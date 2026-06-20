#!/usr/bin/env python3
"""
De-duplicate product specs in src/data/products.ts.

- Replace '6-month manufacturer warranty against defects' with category-specific text
- (Dimensions and weights are left as-is — varying them would require product-by-product
   inspection which is hard to do reliably via script)
"""
import re
from pathlib import Path

PRODUCTS_FILE = Path('/home/z/my-project/src/data/products.ts')

# Category → warranty text mapping
WARRANTIES = {
    'lighting': '1-year manufacturer warranty covering electrical components and finish defects',
    'lamps': '1-year manufacturer warranty covering electrical components and finish defects',
    'candles': '30-day satisfaction guarantee; burn time varies with care and environment',
    'vases': '6-month warranty against structural defects; hand-thrown variations are inherent to craftsmanship',
    'ceramics': '6-month warranty against structural defects; hand-thrown variations are inherent to craftsmanship',
    'mirrors': '1-year warranty against frame and mirror defects; proper wall mounting required',
    'wall-art': '6-month warranty against frame defects; keep away from direct sunlight to preserve colors',
    'wall-art-frames': '6-month warranty against frame defects; keep away from direct sunlight to preserve colors',
    'textiles': '30-day return policy; hand-wash recommended to preserve natural fibers',
    'throws': '30-day return policy; hand-wash recommended to preserve natural fibers',
    'planters': '6-month warranty against cracks; drainage recommended to prevent waterlogging',
    'plants': '30-day satisfaction guarantee; plants not included',
    'terrariums': '30-day satisfaction guarantee; plants not included',
    'trays': '6-month warranty against finish defects; hand-wash with mild soap',
    'bowls': '6-month warranty against finish defects; hand-wash with mild soap',
    'brass': '1-year warranty against manufacturing defects; natural patina is not covered',
}

DEFAULT_WARRANTY = '6-month manufacturer warranty against defects'

# Map product categories to warranty text
# First read products.ts to find all categories used
content = PRODUCTS_FILE.read_text()

# Find all unique categories
categories = set(re.findall(r"category:\s*'([^']+)'", content))
print(f"Categories found: {sorted(categories)}")

# Heuristic mapping by category keyword
def warranty_for_category(cat: str) -> str:
    cat_lower = cat.lower()
    # Direct match first
    if cat_lower in WARRANTIES:
        return WARRANTIES[cat_lower]
    # Partial match
    for key, text in WARRANTIES.items():
        if key in cat_lower:
            return text
    return DEFAULT_WARRANTY

# We need to find each product block and update its warranty line.
# Strategy: split file by product blocks. Each product starts with `{ id:` and ends with `}`.
# Easier approach: replace '6-month manufacturer warranty against defects' inline
# but use the surrounding category to pick the replacement.

# Find each occurrence of the warranty string and replace based on nearby category
def replace_warranty(match):
    # Search backwards from match.start() for the category field
    start = max(0, match.start() - 2000)
    chunk = content[start:match.start()]
    cat_match = re.findall(r"category:\s*'([^']+)'", chunk)
    if cat_match:
        cat = cat_match[-1]  # most recent category before this warranty
        return f"'{warranty_for_category(cat)}'"
    return match.group(0)

# Replace all occurrences of the warranty literal
# Match: warranty: '6-month manufacturer warranty against defects'
new_content = re.sub(
    r"warranty:\s*'6-month manufacturer warranty against defects'",
    lambda m: f"warranty: '{replace_warranty(m)}'",
    content,
)

# Count replacements
old_count = content.count("6-month manufacturer warranty against defects")
new_count = new_content.count("6-month manufacturer warranty against defects")
print(f"Original warranty count: {old_count}")
print(f"Remaining after replacement: {new_count}")
print(f"Replaced: {old_count - new_count}")

PRODUCTS_FILE.write_text(new_content)
print("Done.")
