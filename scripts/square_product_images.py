#!/usr/bin/env python3
"""
Convert all portrait (864x1152) product images to square (1200x1200) by
placing them on a centered ivory (#FFFDF7) background. This ensures all
product images are perfectly visible in square containers without any
cropping or letterboxing.
"""
from PIL import Image, ImageOps
import os

PRODUCT_DIR = '/home/z/my-project/public/images/products'
TARGET_SIZE = 1200
BG_COLOR = (255, 253, 247, 255)  # #FFFDF7 ivory, with alpha

count = 0
for fname in sorted(os.listdir(PRODUCT_DIR)):
    if not fname.endswith('.webp'):
        continue
    fpath = os.path.join(PRODUCT_DIR, fname)
    try:
        img = Image.open(fpath)
        w, h = img.size
        if w == h:
            continue  # Already square — skip

        # Convert to RGBA for compositing
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Calculate scale to fit within TARGET_SIZE x TARGET_SIZE
        scale = min(TARGET_SIZE / w, TARGET_SIZE / h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)

        # Create square background
        canvas = Image.new('RGBA', (TARGET_SIZE, TARGET_SIZE), BG_COLOR)

        # Center the resized image on the canvas
        offset_x = (TARGET_SIZE - new_w) // 2
        offset_y = (TARGET_SIZE - new_h) // 2
        canvas.paste(img_resized, (offset_x, offset_y), img_resized)

        # Convert back to RGB for webp (no alpha needed on ivory bg)
        canvas = canvas.convert('RGB')

        # Save as webp (quality 95 for minimal loss)
        canvas.save(fpath, 'WEBP', quality=95, method=6)
        count += 1
        print(f"  ✓ {fname}: {w}x{h} → {TARGET_SIZE}x{TARGET_SIZE}")

    except Exception as e:
        print(f"  ✗ {fname}: {e}")

print(f"\n=== Done: {count} images converted to {TARGET_SIZE}x{TARGET_SIZE} ===")
