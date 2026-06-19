#!/usr/bin/env python3
"""
Apply Typography & Card Design Guidelines across all components.

Changes:
1. Card radius: rounded-sm → rounded-xl (12px) on info cards
2. Card hover: gold glow → subtle dark shadow
3. Card padding: p-6 sm:p-8 → p-5 sm:p-6 lg:p-8
4. Section H2: bump up to text-[28px] sm:text-[36px] lg:text-[44px]
5. Card H3: bump up to text-xl sm:text-2xl
6. Body text: ensure leading-relaxed on paragraphs
"""
import re
from pathlib import Path

ALL_TSX = list(Path('/home/z/my-project/src/components').glob('*.tsx'))

def fix_file(filepath):
    content = Path(filepath).read_text()
    original = content

    # ── 1. Card hover shadow: gold glow → subtle dark ──
    content = content.replace(
        'hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]',
        'hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]'
    )
    # Also fix the 0.15 opacity variant
    content = content.replace(
        'hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]',
        'hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]'
    )

    # ── 2. Card radius: rounded-sm → rounded-xl on info cards ──
    # Only replace when the element also has backgroundColor #FFFDF7 and border #E8D5A3
    # Pattern: "rounded-sm" appears in className AND style has #FFFDF7
    # We'll do this carefully — replace rounded-sm with rounded-xl only when
    # the same element has backgroundColor: '#FFFDF7'
    
    # Find all elements with rounded-sm and check if they're cards
    # Use regex to find className="...rounded-sm..." near style={{ backgroundColor: '#FFFDF7'
    def replace_card_radius(match):
        return match.group(0).replace('rounded-sm', 'rounded-xl')
    
    # Pattern: className containing rounded-sm, followed by style with #FFFDF7
    card_pattern = re.compile(
        r'(className="[^"]*rounded-sm[^"]*"\s+style=\{\{[^}]*backgroundColor: [\'"]#FFFDF7[\'"])',
        re.DOTALL
    )
    content = card_pattern.sub(replace_card_radius, content)
    
    # Also handle the reverse order (style before className)
    card_pattern2 = re.compile(
        r'(style=\{\{[^}]*backgroundColor: [\'"]#FFFDF7[\'"][^}]*\}\}\s+className="[^"]*)rounded-sm',
        re.DOTALL
    )
    content = card_pattern2.sub(lambda m: m.group(1) + 'rounded-xl', content)

    # ── 3. Card padding: p-6 sm:p-8 → p-5 sm:p-6 lg:p-8 ──
    # Only on elements that are cards (have #FFFDF7 bg)
    content = content.replace(
        "className=\"rounded-xl p-6 sm:p-8",
        "className=\"rounded-xl p-5 sm:p-6 lg:p-8"
    )

    # ── 4. Section H2: text-xl sm:text-2xl font-bold → bigger ──
    # Replace section heading sizes (H2 level)
    content = content.replace(
        'text-xl sm:text-2xl font-bold mb-2',
        'text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-3'
    )
    content = content.replace(
        'text-xl sm:text-2xl font-bold mb-1',
        'text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-2'
    )
    content = content.replace(
        'text-xl sm:text-2xl font-semibold mb-2',
        'text-[28px] sm:text-[32px] lg:text-[40px] font-semibold mb-3'
    )
    content = content.replace(
        'text-2xl sm:text-3xl font-bold',
        'text-[28px] sm:text-[32px] lg:text-[40px] font-bold'
    )
    content = content.replace(
        'text-3xl sm:text-4xl lg:text-5xl font-bold',
        'text-[28px] sm:text-[36px] lg:text-[44px] font-bold'
    )

    # ── 5. Card H3: text-base sm:text-lg → text-xl sm:text-2xl ──
    # Only on h3 elements (card titles)
    content = content.replace(
        '<h3 className="text-base sm:text-lg font-semibold',
        '<h3 className="text-xl sm:text-2xl font-semibold'
    )
    content = content.replace(
        'className="text-base sm:text-lg font-semibold mb-1',
        'className="text-xl sm:text-2xl font-semibold mb-2'
    )

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
