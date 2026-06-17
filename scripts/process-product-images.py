#!/usr/bin/env python3
"""
Remove background from product images using rembg, then composite onto a clean
ivory/cream background matching the Aura Living site aesthetic.

Input:  /home/z/my-project/upload/product-images-extracted/*.jpg
Output: /home/z/my-project/public/images/products/<descriptive-name>.webp
"""
import os
import sys
from io import BytesIO
from PIL import Image, ImageFilter, ImageOps, ImageDraw
from rembg import remove, new_session

# Use the higher-quality "isnet-general-use" model for cleaner edges
print("Initializing rembg session (this may download the model on first run)...")
session = new_session("isnet-general-use")
print("Session ready.")

INPUT_DIR = "/home/z/my-project/upload/product-images-extracted"
OUTPUT_DIR = "/home/z/my-project/public/images/products"

# Aura Living brand backgrounds (match globals.css)
BG_WARM_WHITE = (250, 248, 245)   # #FAF8F5
BG_IVORY      = (255, 253, 247)   # #FFFDF7

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mapping from original filename -> new descriptive filename
# (kept stable so the existing data/products.ts paths still resolve, plus added new ones)
# We'll generate new filenames based on what VLM identified.
PRODUCT_FILENAMES = {
    "1000241708": "planter-golden-cage-succulent",
    "1000241711": "planter-golden-wire-cage",
    "1000241715": "planter-golden-cage-black-pot",
    "1000241723": "planter-golden-wire-cage-2",
    "1000241795": "lamp-brass-pleated-shade",
    "1000241805": "lamp-brass-pleated-shade-2",
    "1000241806": "lamp-golden-pleated-shade",
    "1000241825": "lamp-crystal-arch-table",
    "1000241826": "lamp-crystal-oval-accent",
    "1000241842": "lamp-golden-arc-floor",
    "1000241843": "lamp-golden-arc-floor-2",
    "1000241846": "lamp-golden-oval-crystal",
    "1000241928": "lamp-elegant-ceramic-table",
    "1000241929": "lamp-white-ceramic-gold",
    "1000241938": "lamp-marble-arch-ceramic",
    "1000241979": "lamp-marble-brass-table",
    "1000241980": "lamp-marble-arch-ceramic-2",
}

def remove_bg(img: Image.Image) -> Image.Image:
    """Remove background and return RGBA image with transparent bg."""
    # rembg works in bytes
    buf = BytesIO()
    img.save(buf, format="PNG")
    result_bytes = remove(
        buf.getvalue(),
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )
    return Image.open(BytesIO(result_bytes)).convert("RGBA")


def trim_to_subject(rgba: Image.Image, padding_ratio: float = 0.08) -> Image.Image:
    """Crop tightly around the non-transparent subject, then add symmetric padding."""
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    pad_x = int(width * padding_ratio)
    pad_y = int(height * padding_ratio)
    return rgba.crop((left - pad_x, top - pad_y, right + pad_x, bottom + pad_y))


def make_square_canvas(rgba: Image.Image, target_size: int = 1200, bg_color=BG_IVORY) -> Image.Image:
    """
    Place the subject on a square canvas of `target_size` x `target_size`.
    - Subject is scaled to fit with generous padding (max 80% of canvas).
    - Centered horizontally; vertically centered with slight bottom weighting
      so products "sit" on the canvas rather than float.
    """
    bbox = rgba.getbbox()
    if bbox is None:
        # fully transparent — fallback
        canvas = Image.new("RGB", (target_size, target_size), bg_color)
        return canvas

    subject_w = bbox[2] - bbox[0]
    subject_h = bbox[3] - bbox[1]
    max_subject_size = int(target_size * 0.78)  # subject occupies ~78% of canvas
    scale = min(max_subject_size / subject_w, max_subject_size / subject_h)
    scale = min(scale, 1.0)  # never upscale beyond original
    new_w = max(1, int(subject_w * scale))
    new_h = max(1, int(subject_h * scale))

    resized = rgba.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (target_size, target_size), bg_color + (255,))

    # Center horizontally, bias slightly downward (visual weight at bottom)
    x = (target_size - new_w) // 2
    # Vertical: position so the subject's vertical center is at 52% of canvas height
    y_center = int(target_size * 0.52)
    y = y_center - new_h // 2

    canvas.paste(resized, (x, y), resized)
    return canvas.convert("RGB")


def add_soft_shadow(rgba: Image.Image, blur: int = 18, opacity: int = 90) -> Image.Image:
    """
    Add a soft contact shadow under the subject to make it sit on the canvas.
    Operates on RGBA image (transparent bg).
    """
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    # Create an all-white silhouette of the alpha channel
    alpha = rgba.split()[-1]
    # Threshold to get a hard silhouette
    silhouette = alpha.point(lambda p: 255 if p > 30 else 0)
    # Take only the bottom 25% of the silhouette (the contact area)
    width, height = rgba.size
    contact_band = silhouette.crop((0, int(height * 0.65), width, height))
    # Squash the contact band vertically to fake a ground shadow
    contact_band_squashed = contact_band.resize((width, max(1, int(height * 0.08))))
    # Blur it
    shadow = contact_band_squashed.filter(ImageFilter.GaussianBlur(blur))

    # Build a shadow layer
    shadow_layer = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    # Stretch the squashed band back to canvas size with offset
    shadow_full = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    shadow_y = int(height * 0.78)
    # Resize shadow to full width and a slim band height
    shadow_resized = shadow.resize((width, max(1, int(height * 0.18))))
    shadow_full.paste((0, 0, 0, opacity), (0, shadow_y), shadow_resized)
    # Combine
    result = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    result.paste(shadow_full, (0, 0), shadow_full)
    result.paste(rgba, (0, 0), rgba)
    return result


def process_image(input_path: str, output_path: str, target_size: int = 1200):
    """Full pipeline: load -> remove bg -> trim -> shadow -> square canvas -> save."""
    print(f"  Loading {os.path.basename(input_path)}...")
    img = Image.open(input_path).convert("RGB")

    print(f"  Removing background...")
    rgba = remove_bg(img)

    print(f"  Trimming to subject...")
    rgba = trim_to_subject(rgba, padding_ratio=0.10)

    print(f"  Adding soft contact shadow...")
    rgba = add_soft_shadow(rgba)

    print(f"  Compositing on {target_size}x{target_size} ivory canvas...")
    final = make_square_canvas(rgba, target_size=target_size, bg_color=BG_IVORY)

    # Save as webp with high quality
    final.save(output_path, format="WEBP", quality=92, method=6)
    print(f"  Saved: {os.path.basename(output_path)} ({final.size[0]}x{final.size[1]})")


def main():
    processed = []
    skipped = []

    for src_name in sorted(os.listdir(INPUT_DIR)):
        if not src_name.endswith(".jpg"):
            continue
        src_id = src_name.replace(".jpg", "")
        if src_id not in PRODUCT_FILENAMES:
            print(f"Skipping unknown: {src_name}")
            continue

        new_name = PRODUCT_FILENAMES[src_id] + ".webp"
        out_path = os.path.join(OUTPUT_DIR, new_name)
        src_path = os.path.join(INPUT_DIR, src_name)

        # Skip if already processed (unless forced)
        if os.path.exists(out_path):
            print(f"SKIP (already exists): {new_name}")
            skipped.append(new_name)
            continue

        print(f"\n=== Processing {src_name} -> {new_name} ===")
        try:
            process_image(src_path, out_path)
            processed.append(new_name)
        except Exception as e:
            print(f"  ERROR: {e}")
            import traceback
            traceback.print_exc()

    print(f"\n=== Summary ===")
    print(f"Processed: {len(processed)} images")
    print(f"Skipped (already existed): {len(skipped)} images")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"\nFinal image list:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith(".webp"):
            path = os.path.join(OUTPUT_DIR, f)
            size = os.path.getsize(path)
            print(f"  {f}  ({size:,} bytes)")


if __name__ == "__main__":
    main()
