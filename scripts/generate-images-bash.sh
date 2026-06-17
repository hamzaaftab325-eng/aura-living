#!/bin/bash
# Generate 90 product images sequentially using the z-ai CLI.
# More robust than long-running Node process — each invocation is a fresh process.
# Skips files that already exist (resumable).
set -u

OUTPUT_DIR="/home/z/my-project/upload/generated"
SPECS_FILE="/home/z/my-project/upload/generated-product-specs.json"
LOG_FILE="/home/z/my-project/scripts/generate-images-bash.log"

mkdir -p "$OUTPUT_DIR"

STYLE_SUFFIX=", isolated on a clean solid pure white background, professional studio product photography, soft even lighting, no shadows, centered composition, high detail, e-commerce product photo, 1024x1024"

# Read product specs and extract slug + angle prompts using Python
mapfile -t TASKS < <(/usr/bin/python3 -c "
import json
with open('$SPECS_FILE') as f:
    products = json.load(f)
for p in products:
    for i, angle in enumerate(p['angles']):
        print(f\"{p['slug']}|{i+1}|{angle}$STYLE_SUFFIX\")
")

TOTAL=${#TASKS[@]}
echo "Starting generation of $TOTAL images..." | tee "$LOG_FILE"

COUNT=0
SUCCESSED=0
FAILED=0

for task in "${TASKS[@]}"; do
  IFS='|' read -r slug angle_num prompt <<< "$task"
  COUNT=$((COUNT + 1))

  FILENAME="${slug}-${angle_num}.png"
  OUTPUT_PATH="${OUTPUT_DIR}/${FILENAME}"

  # Skip if already exists and is non-trivial size
  if [ -f "$OUTPUT_PATH" ] && [ "$(stat -c%s "$OUTPUT_PATH" 2>/dev/null || echo 0)" -gt 10000 ]; then
    SUCCESSED=$((SUCCESSED + 1))
    echo "[$COUNT/$TOTAL] SKIP $FILENAME (already exists)" | tee -a "$LOG_FILE"
    continue
  fi

  echo "[$COUNT/$TOTAL] Generating $FILENAME ..." | tee -a "$LOG_FILE"

  # Try with retries
  SUCCESS=0
  for attempt in 1 2 3 4 5; do
    # Use z-ai CLI to generate the image — 120s timeout per attempt
    if timeout 120 z-ai image -p "$prompt" -o "$OUTPUT_PATH" -s 1024x1024 > /tmp/z-ai-stdout.log 2> /tmp/z-ai-stderr.log; then
      if [ -f "$OUTPUT_PATH" ] && [ "$(stat -c%s "$OUTPUT_PATH" 2>/dev/null || echo 0)" -gt 10000 ]; then
        SUCCESS=1
        SUCCESSED=$((SUCCESSED + 1))
        echo "  ✓ Generated $FILENAME ($(stat -c%s "$OUTPUT_PATH") bytes)" | tee -a "$LOG_FILE"
        break
      fi
    fi
    # Clean up any partial file
    rm -f "$OUTPUT_PATH"
    # Failed — wait and retry
    WAIT_S=$((attempt * 8))
    ERR_MSG=$(cat /tmp/z-ai-stderr.log 2>/dev/null | head -1 | cut -c1-100)
    [ -z "$ERR_MSG" ] && ERR_MSG="timeout or unknown"
    echo "  [retry $attempt] waiting ${WAIT_S}s... ($ERR_MSG)" | tee -a "$LOG_FILE"
    sleep "$WAIT_S"
  done

  if [ $SUCCESS -eq 0 ]; then
    FAILED=$((FAILED + 1))
    echo "  ✗ FAILED $FILENAME after 5 retries" | tee -a "$LOG_FILE"
    echo "$slug|$angle_num" >> /home/z/my-project/upload/generated-failed.txt
  fi

  # Wait between successful requests to avoid rate limit
  sleep 5
done

echo "" | tee -a "$LOG_FILE"
echo "========== Generation complete ==========" | tee -a "$LOG_FILE"
echo "Total: $TOTAL" | tee -a "$LOG_FILE"
echo "Succeeded: $SUCCESSED" | tee -a "$LOG_FILE"
echo "Failed: $FAILED" | tee -a "$LOG_FILE"
echo "Output dir: $OUTPUT_DIR" | tee -a "$LOG_FILE"
