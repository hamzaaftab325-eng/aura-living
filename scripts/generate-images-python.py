#!/usr/bin/env python3
"""
Generate product images via z-ai CLI with robust error handling.
Resumable: skips files that already exist.
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

OUTPUT_DIR = Path("/home/z/my-project/upload/generated")
SPECS_FILE = Path("/home/z/my-project/upload/generated-product-specs.json")
LOG_FILE = Path("/home/z/my-project/scripts/generate-images-python.log")
STATE_FILE = Path("/home/z/my-project/upload/generated-state.json")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_SUFFIX = ", isolated on a clean solid pure white background, professional studio product photography, soft even lighting, no shadows, centered composition, high detail, e-commerce product photo, 1024x1024"

def log(msg: str) -> None:
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            return {"completed": [], "failed": []}
    return {"completed": [], "failed": []}

def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2))

def generate_image(prompt: str, output_path: Path, timeout: int = 120) -> tuple[bool, str]:
    """Generate a single image via z-ai CLI. Returns (success, error_message)."""
    full_prompt = prompt + STYLE_SUFFIX
    try:
        result = subprocess.run(
            ["z-ai", "image", "-p", full_prompt, "-o", str(output_path), "-s", "1024x1024"],
            timeout=timeout,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            return False, f"exit={result.returncode}: {result.stderr[:200]}"
        if not output_path.exists() or output_path.stat().st_size < 10000:
            return False, "output file missing or too small"
        return True, ""
    except subprocess.TimeoutExpired:
        return False, f"timeout after {timeout}s"
    except Exception as e:
        return False, f"exception: {e}"

def main() -> int:
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
    log(f"Starting generation of {total} images (resumable)")

    state = load_state()
    completed_set = set(state["completed"])

    succeeded = 0
    failed = 0
    skipped = 0

    for i, task in enumerate(tasks, 1):
        output_path = OUTPUT_DIR / task["filename"]

        # Skip if already exists with non-trivial size
        if output_path.exists() and output_path.stat().st_size > 10000:
            skipped += 1
            log(f"[{i}/{total}] SKIP {task['filename']} (exists, {output_path.stat().st_size} bytes)")
            if task["filename"] not in completed_set:
                completed_set.add(task["filename"])
            continue

        # Skip if previously marked as completed
        if task["filename"] in completed_set:
            skipped += 1
            log(f"[{i}/{total}] SKIP {task['filename']} (in state)")
            continue

        log(f"[{i}/{total}] Generating {task['filename']}...")

        success = False
        last_error = ""
        for attempt in range(1, 5):
            # Remove any partial file
            if output_path.exists():
                output_path.unlink()

            success, err = generate_image(task["prompt"], output_path)
            if success:
                size = output_path.stat().st_size
                log(f"  ✓ Generated {task['filename']} ({size:,} bytes) on attempt {attempt}")
                succeeded += 1
                completed_set.add(task["filename"])
                state["completed"] = list(completed_set)
                save_state(state)
                break
            else:
                last_error = err
                wait_s = attempt * 8
                log(f"  [retry {attempt}/4] waiting {wait_s}s — {err[:100]}")
                time.sleep(wait_s)

        if not success:
            failed += 1
            state["failed"].append({"filename": task["filename"], "error": last_error})
            log(f"  ✗ FAILED {task['filename']} after 4 retries — {last_error[:120]}")
            save_state(state)

        # Brief delay between successful generations
        time.sleep(3)

    log("")
    log(f"========== Generation complete ==========")
    log(f"Total: {total}")
    log(f"Succeeded: {succeeded}")
    log(f"Skipped (already existed): {skipped}")
    log(f"Failed: {failed}")
    log(f"Output dir: {OUTPUT_DIR}")
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
