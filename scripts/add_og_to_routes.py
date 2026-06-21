#!/usr/bin/env python3
"""
Add OG image metadata to all route page.tsx files.
Maps each route to its corresponding /og/<name>.png image.
"""
import re
from pathlib import Path

APP_DIR = Path('/home/z/my-project/src/app')

# Route → OG image mapping
ROUTE_OG_MAP = {
    'about/page.tsx': 'about.png',
    'contact/page.tsx': 'contact.png',
    'faq/page.tsx': 'faq.png',
    'blog/page.tsx': 'blog.png',
    'shipping/page.tsx': 'shipping.png',
    'returns/page.tsx': 'returns.png',
    'care-guide/page.tsx': 'care-guide.png',
    'terms/page.tsx': 'terms.png',
    'privacy/page.tsx': 'privacy.png',
    '(shop)/shop/page.tsx': 'shop.png',
    '(shop)/new-arrivals/page.tsx': 'new-arrivals.png',
    '(shop)/sale/page.tsx': 'sale.png',
    '(shop)/lookbook/page.tsx': 'lookbook.png',
    'cart/page.tsx': 'default.png',
    'checkout/page.tsx': 'default.png',
    'wishlist/page.tsx': 'default.png',
    'account/page.tsx': 'default.png',
    'account/orders/page.tsx': 'default.png',
    'account/addresses/page.tsx': 'default.png',
    'account/settings/page.tsx': 'default.png',
    'admin/page.tsx': 'default.png',
    'auth/login/page.tsx': 'default.png',
    'auth/signup/page.tsx': 'default.png',
    'auth/forgot-password/page.tsx': 'default.png',
}

# Product + blog article routes get special handling
# They use ogProductImage / ogBlogImage patterns

total_updated = 0

for route_rel, og_image in ROUTE_OG_MAP.items():
    filepath = APP_DIR / route_rel
    if not filepath.exists():
        print(f"  ⏭  {route_rel} — file not found")
        continue

    content = filepath.read_text()

    # Skip if already has images: in openGraph
    if 'images:' in content and '/og/' in content:
        print(f"  ⏭  {route_rel} — already has OG image")
        continue

    # Add OG image to openGraph config
    # Pattern: find openGraph: { ... } and add images array
    # Also add twitter images

    og_image_block = f"""    images: [
      {{
        url: '/og/{og_image}',
        width: 1344,
        height: 768,
        alt: 'Aura Living',
      }},
    ],
"""

    twitter_image_block = f"    images: ['/og/{og_image}'],\n"

    # Add images to openGraph (after locale or type line)
    if 'openGraph:' in content and 'images:' not in content.split('openGraph:')[1].split('}')[0]:
        # Find the openGraph block and add images before the closing }
        content = re.sub(
            r'(openGraph:\s*\{[^}]*?)(\s+\},)',
            lambda m: m.group(1) + '\n' + og_image_block.rstrip() + m.group(2),
            content,
            count=1,
            flags=re.DOTALL
        )

    # Add images to twitter (if twitter block exists and doesn't have images)
    if 'twitter:' in content:
        twitter_section = content.split('twitter:')[1].split('},')[0]
        if 'images:' not in twitter_section:
            content = re.sub(
                r'(twitter:\s*\{[^}]*?)(\s+\},)',
                lambda m: m.group(1) + '\n' + twitter_image_block.rstrip() + m.group(2),
                content,
                count=1,
                flags=re.DOTALL
            )

    filepath.write_text(content)
    total_updated += 1
    print(f"  ✓ {route_rel} → /og/{og_image}")

print(f"\n✓ Done. {total_updated} files updated with OG images.")
