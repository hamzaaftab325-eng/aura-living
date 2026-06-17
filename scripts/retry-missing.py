#!/usr/bin/env python3
"""Retry only the missing images."""
import json, os, subprocess, sys, time
from pathlib import Path

OUTPUT_DIR = Path("/home/z/my-project/upload/generated")
SPECS_FILE = Path("/home/z/my-project/upload/generated-product-specs.json")
LOG_FILE = Path("/home/z/my-project/scripts/generate-images-chunk.log")
STYLE_SUFFIX = ", isolated on a clean solid pure white background, professional studio product photography, soft even lighting, no shadows, centered composition, high detail, e-commerce product photo, 1024x1024"

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def gen(prompt, path, timeout=100):
    try:
        r = subprocess.run(
            ["z-ai", "image", "-p", prompt + STYLE_SUFFIX, "-o", str(path), "-s", "1024x1024"],
            timeout=timeout, capture_output=True, text=True
        )
        if r.returncode != 0:
            return False, f"exit={r.returncode}: {(r.stderr or '')[:150]}"
        if not path.exists() or path.stat().st_size < 10000:
            return False, "missing or too small"
        return True, ""
    except subprocess.TimeoutExpired:
        return False, "timeout"
    except Exception as e:
        return False, str(e)

with open(SPECS_FILE) as f:
    products = json.load(f)

# Build task list
tasks = []
for p in products:
    for i, angle in enumerate(p["angles"]):
        tasks.append({"slug": p["slug"], "angle_num": i+1, "prompt": angle, "filename": f"{p['slug']}-{i+1}.png"})

# Find missing
missing = [t for t in tasks if not (OUTPUT_DIR / t["filename"]).exists() or (OUTPUT_DIR / t["filename"]).stat().st_size < 10000]
log(f"=== Retry pass: {len(missing)} missing images ===")

succeeded = 0
failed = 0
for i, task in enumerate(missing, 1):
    output_path = OUTPUT_DIR / task["filename"]
    log(f"[{i}/{len(missing)}] Generating {task['filename']}...")
    success = False
    for attempt in range(1, 5):
        if output_path.exists():
            output_path.unlink()
        success, err = gen(task["prompt"], output_path)
        if success:
            log(f"  ✓ {task['filename']} ({output_path.stat().st_size:,} bytes) attempt {attempt}")
            succeeded += 1
            break
        else:
            wait = attempt * 10
            log(f"  [retry {attempt}/4] wait {wait}s — {err[:100]}")
            time.sleep(wait)
    if not success:
        failed += 1
        log(f"  ✗ FAILED {task['filename']}")
    time.sleep(3)

log(f"=== Retry done: {succeeded} generated, {failed} failed ===")
