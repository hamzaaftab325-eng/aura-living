#!/usr/bin/env python3
"""
Generate beautiful branded OG thumbnail images for all Aura Living pages.
Uses the z-ai CLI image generation tool.

Each image is 1440x720 (closest supported size to standard 1200x630 OG image).
Saved to public/og/ directory.
"""
import subprocess
import os
from pathlib import Path

OUTPUT_DIR = Path('/home/z/my-project/public/og')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Standard design prompt template — consistent branding across all OG images
DESIGN_TEMPLATE = (
    "Luxury brand social media thumbnail image, "
    "dark charcoal background gradient from #2C2C2C to #1A1A1A, "
    "elegant gold #D4AF37 accent elements and decorative lines, "
    "premium minimalist graphic design aesthetic, "
    "luxury home decor brand identity, "
    "high quality, professional, sophisticated, "
    "no people, no products, pure graphic design, "
    "clean typography layout, 1200x630 landscape format"
)

# All OG images to generate
OG_IMAGES = [
    {
        'filename': 'home.png',
        'title': 'Where Comfort Meets Style',
        'subtitle': 'Handcrafted home decor delivered across Pakistan',
        'extra': 'elegant gold circle logo mark with letter A at top left, large title text in center',
    },
    {
        'filename': 'shop.png',
        'title': 'Shop All Home Decor',
        'subtitle': 'Lamps, vases, candles, planters, wall art & tableware',
        'extra': 'shopping bag icon motif in gold, category grid pattern background',
    },
    {
        'filename': 'about.png',
        'title': 'Our Story',
        'subtitle': 'From a Lahore workshop to homes across Pakistan',
        'extra': 'artisan craftsmanship theme, subtle workshop tools silhouette',
    },
    {
        'filename': 'contact.png',
        'title': 'Get in Touch',
        'subtitle': 'Reach the Aura Living team in Lahore, Pakistan',
        'extra': 'envelope and phone icon motif in gold',
    },
    {
        'filename': 'faq.png',
        'title': 'Frequently Asked Questions',
        'subtitle': 'Orders, shipping, returns, products, and rewards',
        'extra': 'question mark icon motif in gold',
    },
    {
        'filename': 'blog.png',
        'title': 'The Journal',
        'subtitle': 'Styling guides, care tips, and behind-the-scenes stories',
        'extra': 'open book icon motif in gold, elegant editorial layout',
    },
    {
        'filename': 'new-arrivals.png',
        'title': 'New Arrivals',
        'subtitle': 'Fresh additions to the Aura Living collection',
        'extra': 'sparkle and star icon motif in gold',
    },
    {
        'filename': 'sale.png',
        'title': 'Sale',
        'subtitle': 'Limited-time prices on selected pieces',
        'extra': 'percentage discount icon motif in gold, urgency theme',
    },
    {
        'filename': 'lookbook.png',
        'title': 'The Lookbook',
        'subtitle': 'Styled room scenes and mood boards',
        'extra': 'camera and frame icon motif in gold, editorial layout',
    },
    {
        'filename': 'shipping.png',
        'title': 'Shipping Information',
        'subtitle': 'Standard, Express, and Same-Day delivery across Pakistan',
        'extra': 'truck and delivery icon motif in gold',
    },
    {
        'filename': 'returns.png',
        'title': 'Returns & Exchanges',
        'subtitle': '14-day return window, easy exchanges, fast refunds',
        'extra': 'return arrow icon motif in gold',
    },
    {
        'filename': 'care-guide.png',
        'title': 'Care Guide',
        'subtitle': 'Keep your Aura Living pieces looking their best',
        'extra': 'caring hands icon motif in gold, soft warm aesthetic',
    },
    {
        'filename': 'terms.png',
        'title': 'Terms of Service',
        'subtitle': 'Terms governing the use of auraliving.com',
        'extra': 'document icon motif in gold, formal legal aesthetic',
    },
    {
        'filename': 'privacy.png',
        'title': 'Privacy Policy',
        'subtitle': 'How we collect, use, and protect your information',
        'extra': 'shield and lock icon motif in gold, security theme',
    },
    {
        'filename': 'default.png',
        'title': 'Aura Living',
        'subtitle': 'Where Comfort Meets Style',
        'extra': 'elegant gold circle logo mark with letter A at top left, brand identity',
    },
]


def generate_image(filename: str, title: str, subtitle: str, extra: str) -> bool:
    """Generate a single OG image using z-ai CLI."""
    output_path = OUTPUT_DIR / filename

    # Skip if already exists
    if output_path.exists():
        print(f"  ⏭  {filename} already exists, skipping")
        return True

    # Build the full prompt
    prompt = (
        f"{DESIGN_TEMPLATE}. "
        f"Image features: {extra}. "
        f"The text '{title}' displayed prominently in large elegant white serif font in center. "
        f"The text '{subtitle}' displayed below in smaller light gray sans-serif font. "
        f"The brand name 'Aura Living' in gold serif font at top. "
        f"The URL 'auraliving.com' in small gray text at bottom."
    )

    print(f"  🎨 Generating {filename}...")
    try:
        result = subprocess.run(
            ['z-ai', 'image', '-p', prompt, '-o', str(output_path), '-s', '1344x768'],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if result.returncode == 0 and output_path.exists():
            size_kb = output_path.stat().st_size / 1024
            print(f"  ✓ {filename} generated ({size_kb:.1f} KB)")
            return True
        else:
            print(f"  ✗ {filename} FAILED")
            if result.stderr:
                print(f"    stderr: {result.stderr[:200]}")
            return False
    except subprocess.TimeoutExpired:
        print(f"  ✗ {filename} TIMEOUT")
        return False
    except Exception as e:
        print(f"  ✗ {filename} ERROR: {e}")
        return False


def main():
    print("=" * 60)
    print("Generating OG Thumbnail Images for Aura Living")
    print("=" * 60)
    print()

    success_count = 0
    fail_count = 0

    for img in OG_IMAGES:
        if generate_image(img['filename'], img['title'], img['subtitle'], img['extra']):
            success_count += 1
        else:
            fail_count += 1

    print()
    print("=" * 60)
    print(f"✓ Complete: {success_count} succeeded, {fail_count} failed")
    print(f"  Output: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
