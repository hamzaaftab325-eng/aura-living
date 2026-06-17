#!/bin/bash
# Continue identification — only process images that don't have valid .txt output yet
set -u

cd /home/z/my-project/upload/product-images-extracted
mkdir -p /home/z/my-project/upload/product-ids

PROMPT="This is a product photo for an e-commerce home decor store called 'Aura Living' (a premium Pakistani home decor brand). Identify the product in ONE line of structured info. Format your response EXACTLY as a single line:
PRODUCT_TYPE | SHORT_NAME | CATEGORY | MATERIAL | PRICE_PKR | TAGS

Where:
- PRODUCT_TYPE = one word (Vase, Lamp, Plant, Candle, Mirror, Pillow, Tapestry, Pot, Planter, Tray, Holder, Basket, Bowl, Lantern, Sculpture, Diffuser)
- SHORT_NAME = 3-6 word evocative name (e.g. 'Golden Aura Table Lamp', 'Marble Arch Ceramic Vase')
- CATEGORY = exactly one of: lighting, plants, vases, candles, wall-art, dining
- MATERIAL = primary material (Ceramic, Brass & Glass, Cotton Rope, Soy Wax, Terracotta, etc.)
- PRICE_PKR = realistic Pakistan market price in PKR between 999 and 29999 (just the number, no commas)
- TAGS = 3-5 comma-separated descriptive tags

Do not include any other text, just the single line."

for img in *.jpg; do
  base=$(basename "$img" .jpg)
  out_json="/home/z/my-project/upload/product-ids/${base}.json"
  out_txt="/home/z/my-project/upload/product-ids/${base}.txt"

  # Skip if already done with valid content
  if [ -f "$out_txt" ] && grep -qE "^[A-Z][a-z]+ \|" "$out_txt"; then
    echo "SKIP $base"
    continue
  fi

  echo "Identifying $base..."

  # Try with retries
  success=0
  for attempt in 1 2 3 4 5; do
    rm -f "$out_json"
    z-ai vision -p "$PROMPT" -i "$img" -o "$out_json" > /dev/null 2>&1
    if [ -f "$out_json" ] && [ -s "$out_json" ]; then
      success=1
      break
    fi
    echo "  retry $attempt (rate limit)..."
    sleep $((attempt * 8))
  done

  if [ $success -eq 0 ]; then
    echo "  FAILED after retries"
    echo "FAILED" > "$out_txt"
    sleep 10
    continue
  fi

  # Parse JSON
  python3 -c "
import json
try:
    with open('$out_json') as f:
        data = json.load(f)
    content = data['choices'][0]['message']['content'].strip()
    for line in content.split('\n'):
        line = line.strip()
        if '|' in line and len(line.split('|')) == 6:
            print(line)
            break
    else:
        for line in content.split('\n'):
            if line.strip():
                print(line.strip()[:200])
                break
except Exception as e:
    print(f'PARSE_ERROR: {e}')
" > "$out_txt"

  echo "  -> $(cat $out_txt 2>/dev/null | head -1)"

  # Wait between requests
  sleep 6
done

echo ""
echo "=== Final identifications ==="
for f in /home/z/my-project/upload/product-ids/*.txt; do
  base=$(basename $f .txt)
  content=$(cat "$f" 2>/dev/null | head -1)
  echo "$base | $content"
done
