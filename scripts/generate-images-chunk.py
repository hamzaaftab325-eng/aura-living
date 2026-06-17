#!/usr/bin/env python3
"""
Generate product images in a chunk — run with start/end index args.
Each invocation processes a small range and exits, so the sandbox doesn't kill it.

Usage: python3 generate-images-chunk.py <start> <end>
  start: 1-indexed start position (inclusive)
  end:   1-indexed end position (inclusive)
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

OUTPUT_DIR = Path("/home/z/my-project/upload/generated")
SPECS_FILE = Path("/home/z/my-project/upload/generated-product-specs.json")
LOG_FILE = Path("/home/z/my-project/scripts/generate-images-chunk.log")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_SUFFIX = ", isolated on a clean solid pure white background, professional studio product photography, soft even lighting, no shadows, centered composition, high detail, e-commerce product photo, 1024x1024"

def log(msg: str) -> None:
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def generate_image(prompt: str, output_path: Path, timeout: int = 100) -> tuple[bool, str]:
    full_prompt = prompt + STYLE_SUFFIX
    try:
        result = subprocess.run(
            ["z-ai", "image", "-p", full_prompt, "-o", str(output_path), "-s", "1024x1024"],
            timeout=timeout,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            return False, f"exit={result.returncode}: {(result.stderr or '')[:200]}"
        if not output_path.exists() or output_path.stat().st_size < 10000:
            return False, "output file missing or too small"
        return True, ""
    except subprocess.TimeoutExpired:
        return False, f"timeout after {timeout}s"
    except Exception as e:
        return False, f"exception: {e}"

def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python3 generate-images-chunk.py <start> <end>")
        return 1

    start = int(sys.argv[1])
    end = int(sys.argv[2])

    with open(SPECS_FILE) as f:
        products = json.load(f)

    tasks = []
    for p in products:
        for i, angle in enumerate(p["angles"]):
            tasks.append({
                "slug": p["slug"],
                "angle_num": i + 1,
                "prompt": angle,
                "filename": f"{p['slug']}-{i+1}.png",
            })

    total = len(tasks)
    # Clamp range
    start = max(1, start)
    end = min(total, end)

    log(f"=== Chunk: tasks {start}-{end} of {total} ===")

    succeeded = 0
    failed = 0
    skipped = 0

    for i in range(start, end + 1):
        task = tasks[i - 1]
        output_path = OUTPUT_DIR / task["filename"]

        if output_path.exists() and output_path.stat().st_size > 10000:
            skipped += 1
            log(f"[{i}/{total}] SKIP {task['filename']} (exists, {output_path.stat().st_size:,} bytes)")
            continue

        log(f"[{i}/{total}] Generating {task['filename']}...")

        success = False
        last_error = ""
        for attempt in range(1, 4):  # 3 retries
            if output_path.exists():
                output_path.unlink()
            success, err = generate_image(task["prompt"], output_path)
            if success:
                size = output_path.stat().st_size
                log(f"  ✓ {task['filename']} ({size:,} bytes) on attempt {attempt}")
                succeeded += 1
                break
            else:
                last_error = err
                wait_s = attempt * 6
                log(f"  [retry {attempt}/3] wait {wait_s}s — {err[:100]}")
                time.sleep(wait_s)

        if not success:
            failed += 1
            log(f"  ✗ FAILED {task['filename']} — {last_error[:120]}")

        # Brief delay between generations
        time.sleep(2)

    log(f"=== Chunk {start}-{end} done: {succeeded} generated, {skipped} skipped, {failed} failed ===")
    return 0

if __name__ == "__main__":
    sys.exit(main())
