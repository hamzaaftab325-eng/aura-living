#!/usr/bin/env python3
"""
Remove background from all generated product images and composite onto ivory canvas.
Processes files in chunks for resumability.

Usage: python3 process-generated-chunk.py <start> <end>
  start/end: 1-indexed range (inclusive) into the sorted file list
"""
import os, sys, hashlib
from pathlib import Path
from PIL import Image, ImageFilter
from io import BytesIO
from rembg import remove, new_session

INPUT_DIR = Path("/home/z/my-project/upload/generated")
OUTPUT_DIR = Path("/home/z/my-project/public/images/products")
LOG_FILE = Path("/home/z/my-project/scripts/process-images-chunk.log")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BG_IVORY = (255, 253, 247)

# Initialize once
print("Initializing rembg session...", flush=True)
session = new_session("isnet-general-use")
print("Session ready.", flush=True)

def log(msg):
    line = f"[{__import__('time').strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def remove_bg(img):
    buf = BytesIO()
    img.save(buf, format="PNG")
    result = remove(
        buf.getvalue(),
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )
    return Image.open(BytesIO(result)).convert("RGBA")

def trim_to_subject(rgba, padding_ratio=0.10):
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    pad_x = int(width * padding_ratio)
    pad_y = int(height * padding_ratio)
    return rgba.crop((left - pad_x, top - pad_y, right + pad_x, bottom + pad_y))

def add_soft_shadow(rgba, blur=18, opacity=90):
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    alpha = rgba.split()[-1]
    silhouette = alpha.point(lambda p: 255 if p > 30 else 0)
    width, height = rgba.size
    contact_band = silhouette.crop((0, int(height * 0.65), width, height))
    contact_band_squashed = contact_band.resize((width, max(1, int(height * 0.08))))
    shadow = contact_band_squashed.filter(ImageFilter.GaussianBlur(blur))
    shadow_full = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    shadow_y = int(height * 0.78)
    shadow_resized = shadow.resize((width, max(1, int(height * 0.18))))
    shadow_full.paste((0, 0, 0, opacity), (0, shadow_y), shadow_resized)
    result = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    result.paste(shadow_full, (0, 0), shadow_full)
    result.paste(rgba, (0, 0), rgba)
    return result

def make_square_canvas(rgba, target_size=1200, bg_color=BG_IVORY):
    bbox = rgba.getbbox()
    if bbox is None:
        return Image.new("RGB", (target_size, target_size), bg_color)
    subject_w = bbox[2] - bbox[0]
    subject_h = bbox[3] - bbox[1]
    max_size = int(target_size * 0.78)
    scale = min(max_size / subject_w, max_size / subject_h, 1.0)
    new_w = max(1, int(subject_w * scale))
    new_h = max(1, int(subject_h * scale))
    resized = rgba.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (target_size, target_size), bg_color + (255,))
    x = (target_size - new_w) // 2
    y_center = int(target_size * 0.52)
    y = y_center - new_h // 2
    canvas.paste(resized, (x, y), resized)
    return canvas.convert("RGB")

def process_one(input_path, output_path, target_size=1200):
    img = Image.open(input_path).convert("RGB")
    rgba = remove_bg(img)
    rgba = trim_to_subject(rgba, 0.10)
    rgba = add_soft_shadow(rgba)
    final = make_square_canvas(rgba, target_size, BG_IVORY)
    final.save(output_path, format="WEBP", quality=92, method=6)

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 process-generated-chunk.py <start> <end>")
        return 1
    start = int(sys.argv[1])
    end = int(sys.argv[2])

    # Get sorted list of generated PNG files
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith(".png")])
    total = len(files)
    start = max(1, start)
    end = min(total, end)

    log(f"=== Processing chunk {start}-{end} of {total} ===")

    succeeded = 0
    failed = 0
    skipped = 0

    for i in range(start, end + 1):
        src_filename = files[i - 1]
        # Output filename: same stem but .webp
        out_filename = src_filename.replace(".png", ".webp")
        src_path = INPUT_DIR / src_filename
        out_path = OUTPUT_DIR / out_filename

        if out_path.exists() and out_path.stat().st_size > 5000:
            skipped += 1
            log(f"[{i}/{total}] SKIP {out_filename} (exists)")
            continue

        log(f"[{i}/{total}] Processing {src_filename} -> {out_filename}...")
        try:
            process_one(src_path, out_path)
            size = out_path.stat().st_size
            log(f"  ✓ {out_filename} ({size:,} bytes)")
            succeeded += 1
        except Exception as e:
            failed += 1
            log(f"  ✗ FAILED {src_filename}: {e}")

    log(f"=== Chunk {start}-{end} done: {succeeded} processed, {skipped} skipped, {failed} failed ===")
    return 0

if __name__ == "__main__":
    sys.exit(main())
