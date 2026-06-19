#!/usr/bin/env python3
"""
Remove dead inline fontSize: clamp() + textShadow from non-hero headings.

These were incorrectly applied to ALL headings (including section h2/h3 on
light backgrounds) by an earlier script. They should only be on hero h1s
(which have text-white on dark image backgrounds).

On light backgrounds:
- The clamp(28px, 6vw, 72px) makes ALL headings the same huge size
- The textShadow '0 2px 30px rgba(0,0,0,0.5)' creates a blurry dark halo
  behind dark text — looks terrible on cream/white backgrounds

This script removes both properties from any heading that does NOT have
'text-white' in its className (i.e., non-hero headings).
"""
import re
from pathlib import Path

ALL_TSX = list(Path('/home/z/my-project/src/components').glob('*.tsx'))

def fix_file(filepath):
    content = Path(filepath).read_text()
    original = content

    # Pattern: style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 6vw, 72px)', textShadow: '...' }}
    # We need to check if the preceding className has 'text-white'
    # If YES → keep (hero h1)
    # If NO → remove fontSize + textShadow, keep just fontFamily

    # Find all occurrences of this style pattern
    pattern = re.compile(
        r"style=\{\{ fontFamily: \"'Playfair Display', serif\", fontSize: 'clamp\(28px, 6vw, 72px\)', textShadow: '[^']+' \}\}"
    )

    def replace_if_non_hero(match):
        start = match.start()
        # Look backwards for the nearest className=
        before = content[:start]
        # Find the last className before this style
        cn_match = None
        for m in re.finditer(r'className="([^"]*)"', before):
            cn_match = m
        if cn_match is None:
            return match.group(0)  # keep — can't determine
        
        classname = cn_match.group(1)
        if 'text-white' in classname:
            return match.group(0)  # KEEP on hero h1
        else:
            # REMOVE fontSize + textShadow — this is a non-hero heading
            return "style={{ fontFamily: \"'Playfair Display', serif\" }}"

    content = pattern.sub(replace_if_non_hero, content)

    if content != original:
        Path(filepath).write_text(content)
        return True
    return False


success = 0
skipped = 0
for f in ALL_TSX:
    if fix_file(str(f)):
        print(f"  ✓ {f.name}")
        success += 1
    else:
        skipped += 1

print(f"\n=== Done: {success} updated, {skipped} unchanged ===")
