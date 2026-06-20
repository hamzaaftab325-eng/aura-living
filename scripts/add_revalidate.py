#!/usr/bin/env python3
"""
Add `export const revalidate` to static pages for ISR (Incremental Static Regeneration).
- Content pages (about, contact, faq, shipping, returns, care-guide, terms, privacy): 86400 (1 day)
- Blog listing: 3600 (1 hour — new articles may be added)
- Product pages: 3600 (1 hour — inventory/price may change)
- Blog article pages: 86400 (1 day — articles rarely change)

DO NOT add to:
- Shop page (uses useSearchParams — dynamic)
- Cart, checkout, account, auth (client-side state)
"""
from pathlib import Path
import re

APP_DIR = Path('/home/z/my-project/src/app')

# Route → revalidate seconds
REVALIDATE_MAP = {
    'about/page.tsx': 86400,        # 1 day
    'contact/page.tsx': 86400,      # 1 day
    'faq/page.tsx': 86400,          # 1 day
    'shipping/page.tsx': 86400,     # 1 day
    'returns/page.tsx': 86400,      # 1 day
    'care-guide/page.tsx': 86400,   # 1 day
    'terms/page.tsx': 86400 * 30,   # 30 days (rarely change)
    'privacy/page.tsx': 86400 * 30, # 30 days
    'blog/page.tsx': 3600,          # 1 hour (new articles)
    'product/[slug]/page.tsx': 3600, # 1 hour (inventory)
    'blog/[slug]/page.tsx': 86400,   # 1 day (articles rarely change)
}

total_updated = 0

for route_rel, seconds in REVALIDATE_MAP.items():
    filepath = APP_DIR / route_rel
    if not filepath.exists():
        print(f"  ⏭  {route_rel} — not found")
        continue

    content = filepath.read_text()

    # Skip if already has revalidate
    if 'export const revalidate' in content:
        print(f"  ⏭  {route_rel} — already has revalidate")
        continue

    # Add revalidate after the first import line
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i

    revalidate_line = f"\n// Revalidate every {seconds // 3600 if seconds >= 3600 else seconds // 60} {'hour' if seconds >= 3600 else 'minute'}s\nexport const revalidate = {seconds};\n"
    lines.insert(last_import_idx + 1, revalidate_line)

    filepath.write_text('\n'.join(lines))
    total_updated += 1
    print(f"  ✓ {route_rel} → revalidate = {seconds}s")

print(f"\n✓ Done. {total_updated} files updated with revalidate config.")
