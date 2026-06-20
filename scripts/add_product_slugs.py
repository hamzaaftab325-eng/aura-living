#!/usr/bin/env python3
"""
Add `slug` field to every product in src/data/products.ts.

- Generates slugs from product name (lowercase, hyphenated, special chars removed)
- Handles duplicates by appending -2, -3, etc.
- Inserts slug right after the `id` field

This is a one-time migration script. After it runs, the products.ts file has slugs.
"""
import re
from pathlib import Path

PRODUCTS_FILE = Path('/home/z/my-project/src/data/products.ts')

content = PRODUCTS_FILE.read_text()

# Find each product block: starts with `  {` followed by `    id: 'N',` then `    name: "..."`
# Insert `slug: '...',` right after the id line.

def name_to_slug(name: str) -> str:
    """Convert product name to URL slug."""
    s = name.lower()
    # Replace & with 'and'
    s = s.replace('&', 'and')
    # Remove special characters (keep alphanumeric + spaces + hyphens)
    s = re.sub(r"[^a-z0-9\s-]", '', s)
    # Replace whitespace with hyphens
    s = re.sub(r'[\s-]+', '-', s)
    # Strip leading/trailing hyphens
    s = s.strip('-')
    return s

# Track slugs to dedupe
seen_slugs = {}

def make_unique(slug: str) -> str:
    if slug not in seen_slugs:
        seen_slugs[slug] = 1
        return slug
    seen_slugs[slug] += 1
    return f"{slug}-{seen_slugs[slug]}"

# Pattern: capture the id line + the next name line
# Match either: name: "..." OR name: '...'
pattern = re.compile(r"(\s+id: '([^']+)',\n)(\s+name: (?:\"([^\"]+)\"|'([^']+)'),)")

def insert_slug(match):
    id_line, product_id, name_line, product_name_dq, product_name_sq = match.groups()
    product_name = product_name_dq or product_name_sq
    # Skip if id is a category name (not numeric)
    if not product_id.isdigit():
        return match.group(0)
    slug = make_unique(name_to_slug(product_name))
    # Insert slug line right after id line
    return f"{id_line}    slug: '{slug}',\n{name_line}"

new_content = pattern.sub(insert_slug, content)

# Count
old_count = content.count("slug:")
new_count = new_content.count("slug:")
print(f"Slugs before: {old_count}")
print(f"Slugs after: {new_count}")
print(f"Added: {new_count - old_count} slugs")

PRODUCTS_FILE.write_text(new_content)
print("✓ Done. Verify with: grep -c 'slug:' src/data/products.ts")
