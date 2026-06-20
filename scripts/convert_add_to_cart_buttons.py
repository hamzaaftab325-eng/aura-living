#!/usr/bin/env python3
"""
Convert inline-styled 'Add to Cart' buttons on product cards to use
the unified .btn-primary class.

Pattern: <button> with inline style background: linear-gradient(...gold...)
         + 'Add to Cart' text → replace with .btn-primary class
"""
import re
from pathlib import Path

FILES = [
    'src/components/WishlistView.tsx',
    'src/components/SaleView.tsx',
    'src/components/NewArrivalsView.tsx',
    'src/components/ShopView.tsx',
    'src/components/FeaturedProducts.tsx',
]

ROOT = Path('/home/z/my-project')

total_replacements = 0

for relpath in FILES:
    filepath = ROOT / relpath
    if not filepath.exists():
        continue

    content = filepath.read_text()
    original = content

    # Pattern: <button ...> with inline gold gradient background and "Add to Cart" text
    # Replace the className + style with .btn-primary class
    # Match: <button ... className="...inline-flex...gradient..." style="{{ background: 'linear-gradient(135deg, var(--color-gold)... }}" ...>
    # We'll do a simpler replacement: find buttons with 'Add to Cart' text and gold gradient style

    # Pattern matches the button opening tag with inline gold gradient
    pattern = re.compile(
        r'(<button\s+[^>]*?)className="([^"]*?inline-flex[^"]*?)"\s+style="\{\{[^}]*?linear-gradient\(135deg,\s*var\(--color-gold\)[^}]*?\}\}"([^>]*?>)\s*(<[^>]+>\s*)?Add to Cart',
        re.DOTALL
    )

    def replace_button(m):
        prefix = m.group(1)
        suffix = m.group(3)
        icon = m.group(4) or ''
        return f'{prefix}className="premium-btn btn-primary btn-sm flex-1"{suffix}{icon}Add to Cart'

    content = pattern.sub(replace_button, content)

    if content != original:
        # Count changes
        changes = original.count("Add to Cart") - content.count("linear-gradient(135deg, var(--color-gold)")
        filepath.write_text(content)
        total_replacements += max(0, changes)
        print(f"  {relpath}: updated")

print(f"\n✓ Done. {total_replacements} Add to Cart buttons converted.")
print("\nNote: Some buttons may need manual review — check the diff.")
