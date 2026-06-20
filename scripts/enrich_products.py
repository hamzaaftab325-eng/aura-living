#!/usr/bin/env python3
"""
Enrich product data in products.ts with additional fields:
- sku: Product SKU code
- dimensions: Physical dimensions
- weight: Product weight
- careInstructions: How to care for the product
- warranty: Warranty info
- origin: Country/region of origin
"""
import re
from pathlib import Path

FILE = Path('/home/z/my-project/src/data/products.ts')
content = FILE.read_text()

# Care instructions by category
CARE = {
    'lighting': 'Wipe with a soft dry cloth. Avoid abrasive cleaners. Use LED bulbs only (max 60W equivalent).',
    'plants': 'Wipe planter with damp cloth. For live plants, water according to species requirements. Ensure drainage.',
    'vases': 'Hand wash with mild soap. Do not use in dishwasher. Dry thoroughly after washing.',
    'candles': 'Trim wick to 5mm before each burn. Never burn for more than 4 hours. Keep away from drafts.',
    'wall-art': 'Dust regularly with a soft brush. Avoid direct sunlight to prevent fading. Clean glass with standard glass cleaner.',
    'dining': 'Hand wash recommended. Avoid sudden temperature changes. Not microwave safe unless stated.',
}

# Dimensions by category (approximate)
DIMS = {
    'lighting': 'H 45cm × W 25cm × D 25cm',
    'plants': 'H 30cm × W 25cm × D 25cm',
    'vases': 'H 28cm × W 15cm × D 15cm',
    'candles': 'H 12cm × W 10cm × D 10cm',
    'wall-art': 'H 60cm × W 45cm × D 4cm',
    'dining': 'H 8cm × W 20cm × D 20cm',
}

WEIGHT = {
    'lighting': '2.5 kg',
    'plants': '1.8 kg',
    'vases': '1.2 kg',
    'candles': '0.5 kg',
    'wall-art': '3.0 kg',
    'dining': '0.8 kg',
}

WARRANTY = '6-month manufacturer warranty against defects'

# Find all product objects and add the new fields
# Pattern: matches `inStock: true,` or `inStock: false,` and adds fields after it
def enrich_product(match):
    line = match.group(0)
    # Extract the category from the product (look backwards in the full content)
    # We need to find the category value for this product
    start = match.start()
    before = content[:start]
    
    # Find the last 'category: ' before this match
    cat_match = None
    for m in re.finditer(r"category: '([^']+)'", before):
        cat_match = m
    
    category = cat_match.group(1) if cat_match else 'vases'
    
    # Find the last product id
    id_match = None
    for m in re.finditer(r"id: '([^']+)'", before):
        id_match = m
    
    product_id = id_match.group(1) if id_match else '0'
    sku = f"AURA-{product_id.zfill(3)}"
    
    care = CARE.get(category, CARE['vases'])
    dims = DIMS.get(category, DIMS['vases'])
    weight = WEIGHT.get(category, WEIGHT['vases'])
    
    new_fields = f"""    inStock: true,
    sku: '{sku}',
    dimensions: '{dims}',
    weight: '{weight}',
    careInstructions: '{care}',
    warranty: '{WARRANTY}',
    origin: 'Pakistan',"""
    
    return new_fields

# Replace 'inStock: true,' with enriched fields (only the first occurrence per product)
# We need to be careful — only replace the standalone 'inStock: true,' line
content = re.sub(r'^    inStock: true,$', enrich_product, content, flags=re.MULTILINE)

FILE.write_text(content)
print("Done — enriched all products with sku, dimensions, weight, care, warranty, origin")
