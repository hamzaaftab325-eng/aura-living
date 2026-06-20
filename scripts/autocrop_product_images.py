#!/usr/bin/env python3
"""
Auto-crop whitespace/ivory background from product images, then resize to 900x1200 (3:4).

This script:
1. Opens each product image
2. Detects the bounding box of the actual product (non-background pixels)
3. Crops to that bounding box (with a small margin)
4. Pads to 3:4 aspect ratio if needed
5. Resizes to 900x1200

Result: products fill the entire image frame with minimal empty space.
"""
from PIL import Image, ImageChops
import os

PRODUCT_DIR = '/home/z/my-project/public/images/products'
TARGET_W = 900
TARGET_H = 1200
TARGET_RATIO = TARGET_W / TARGET_H  # 0.75
MARGIN = 20  # pixels of margin to keep around product


def trim_whitespace(img):
    """Auto-crop uniform background from image edges."""
    # Convert to RGB if needed
    if img.mode == 'RGBA':
        # Create a white background for alpha compositing
        bg = Image.new('RGB', img.size, (255, 253, 247))
        bg.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # Get the background color (sample from corners)
    bg_color = img.getpixel((0, 0))

    # Create a background image of the same color
    bg = Image.new('RGB', img.size, bg_color)
    
    # Compute the difference
    diff = ImageChops.difference(img, bg)
    
    # Convert to grayscale and get bounding box
    bbox = diff.convert('L').getbbox()
    
    if bbox:
        # Add margin
        left = max(0, bbox[0] - MARGIN)
        top = max(0, bbox[1] - MARGIN)
        right = min(img.width, bbox[2] + MARGIN)
        bottom = min(img.height, bbox[3] + MARGIN)
        return img.crop((left, top, right, bottom))
    
    return img


def process_image(fpath):
    """Process a single image: trim → pad to 3:4 → resize to 900x1200."""
    img = Image.open(fpath)
    original_size = img.size

    # Step 1: Trim whitespace
    img = trim_whitespace(img)
    trimmed_size = img.size

    # Step 2: Fit into 3:4 aspect ratio
    w, h = img.size
    current_ratio = w / h

    if abs(current_ratio - TARGET_RATIO) > 0.01:
        if current_ratio > TARGET_RATIO:
            # Too wide — crop sides
            new_w = int(h * TARGET_RATIO)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            # Too tall — this is fine for 3:4, just keep it
            # Pad sides with background color
            new_w = int(h * TARGET_RATIO)
            bg_color = (255, 253, 247)  # ivory
            canvas = Image.new('RGB', (new_w, h), bg_color)
            offset_x = (new_w - w) // 2
            canvas.paste(img, (offset_x, 0))
            img = canvas

    # Step 3: Resize to exact 900x1200
    img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)

    # Step 4: Save
    img.save(fpath, 'WEBP', quality=95, method=6)
    return original_size, img.size


count = 0
for fname in sorted(os.listdir(PRODUCT_DIR)):
    if not fname.endswith('.webp'):
        continue
    fpath = os.path.join(PRODUCT_DIR, fname)
    try:
        orig, final = process_image(fpath)
        count += 1
        if orig != final:
            print(f"  ✓ {fname}: {orig[0]}x{orig[1]} → {final[0]}x{final[1]}")
    except Exception as e:
        print(f"  ✗ {fname}: {e}")

print(f"\n=== Done: {count} images auto-trimmed + resized to {TARGET_W}x{TARGET_H} ===")
