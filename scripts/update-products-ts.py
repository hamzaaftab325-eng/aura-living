#!/usr/bin/env python3
"""Generate TypeScript product entries from the generated-product-specs.json file."""
import json

with open('/home/z/my-project/upload/generated-product-specs.json') as f:
    products = json.load(f)

# Read the existing products.ts to get the original 15 products
with open('/home/z/my-project/src/data/products.ts') as f:
    existing_content = f.read()

# Extract the existing products array entries (between "export const products" and the closing "];")
import re
match = re.search(r'export const products: Product\[\] = \[(.*?)\n\];', existing_content, re.DOTALL)
existing_products_block = match.group(1) if match else ''

# Renumber existing products to IDs 31-45 (so new products are 1-30)
# Actually, let's put new products first (1-30) and existing after (31-45)
# We need to renumber the existing IDs from 1-15 to 31-45

# Parse existing products to renumber them
existing_entries = []
# Split by top-level object boundaries (each product is {...})
depth = 0
current = []
in_product = False
for char in existing_products_block:
    if char == '{':
        depth += 1
        if depth == 1:
            in_product = True
            current = ['{']
            continue
    elif char == '}':
        depth -= 1
        if depth == 0:
            current.append('}')
            existing_entries.append(''.join(current))
            in_product = False
            current = []
            continue
    if in_product:
        current.append(char)

# Renumber existing products to start at 31
for i, entry in enumerate(existing_entries):
    new_id = str(i + 31)
    # Replace the id field
    entry = re.sub(r"id: '\d+'", f"id: '{new_id}'", entry, count=1)
    existing_entries[i] = entry

# Build new product entries (IDs 1-30)
new_entries = []
for i, p in enumerate(products):
    pid = str(i + 1)
    images_array = ', '.join([f"'/images/products/{p['slug']}-{j+1}.webp'" for j in range(3)])
    badge_line = f"    badge: '{p['badge']}',\n" if p.get('badge') else ''
    original_price_line = f"    originalPrice: {p['originalPrice']},\n" if p.get('originalPrice') else ''
    entry = f"""  {{
    id: '{pid}',
    name: {json.dumps(p['name'])},
    price: {p['price']},
{original_price_line}{badge_line}    image: '/images/products/{p['slug']}-1.webp',
    images: [{images_array}],
    category: '{p['category']}',
    rating: {p['rating']},
    reviews: {p['reviews']},
    description: {json.dumps(p['description'])},
    material: {json.dumps(p['material'])},
    inStock: true,
  }},"""
    new_entries.append(entry)

# Combine: new products first (1-30), then existing renumbered (31-45)
all_entries = new_entries + existing_entries
all_block = '\n'.join(all_entries)

# Read the header (categories + formatPKR) from existing file
header_match = re.match(r'(.*?export const products: Product\[\] = \[)', existing_content, re.DOTALL)
header = header_match.group(1) if header_match else ''

footer_match = re.search(r'(\];\s*\n\s*export const formatPKR.*)', existing_content, re.DOTALL)
footer = footer_match.group(1) if footer_match else ''

new_content = header + '\n' + all_block + '\n' + footer

with open('/home/z/my-project/src/data/products.ts', 'w') as f:
    f.write(new_content)

print(f"Updated products.ts with {len(new_entries)} new products (IDs 1-30) + {len(existing_entries)} existing (IDs 31-45)")
print(f"Total: {len(new_entries) + len(existing_entries)} products")
