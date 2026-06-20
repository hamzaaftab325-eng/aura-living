#!/usr/bin/env python3
"""
Smart-pad ALL product images to exactly 900x1200 (3:4).
- Portrait (864x1152): upscale to 900x1200
- Square (1200x1200): crop sides to 900x1200, then resize
- All images become uniform 900x1200 — no inconsistency
"""
from PIL import Image
import os

PRODUCT_DIR = '/home/z/my-project/public/images/products'
TARGET_W = 900
TARGET_H = 1200
TARGET_RATIO = TARGET_W / TARGET_H  # 0.75

count = 0
for fname in sorted(os.listdir(PRODUCT_DIR)):
    if not fname.endswith('.webp'):
        continue
    fpath = os.path.join(PRODUCT_DIR, fname)
    try:
        img = Image.open(fpath)
        w, h = img.size
        if w == TARGET_W and h == TARGET_H:
            continue
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        current_ratio = w / h
        if abs(current_ratio - TARGET_RATIO) < 0.01:
            img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        elif current_ratio > TARGET_RATIO:
            # Too wide (square) — crop sides
            new_w = int(h * TARGET_RATIO)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
            img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        else:
            # Too tall — crop top/bottom
            new_h = int(w / TARGET_RATIO)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
            img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        img.save(fpath, 'WEBP', quality=95, method=6)
        count += 1
    except Exception as e:
        print(f"  ✗ {fname}: {e}")

print(f"=== Done: {count} images converted to {TARGET_W}x{TARGET_H} ===")
