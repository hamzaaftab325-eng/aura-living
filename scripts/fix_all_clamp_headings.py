#!/usr/bin/env python3
"""
Remove ALL inline fontSize: clamp() + textShadow from ALL headings.
Then add .aura-hero-title class to actual hero h1s (identified by
having text-white + being inside a hero section with background image).

Hero h1s are identified by: className containing "text-white font-bold leading-[1.15] pt-2"
Non-hero headings: everything else — they'll use their Tailwind classes.
"""
import re
from pathlib import Path

ALL_TSX = list(Path('/home/z/my-project/src/components').glob('*.tsx'))

def fix_file(filepath):
    content = Path(filepath).read_text()
    original = content
    changes = 0

    # ── Step 1: Remove ALL inline fontSize: 'clamp(28px, 6vw, 72px)' ──
    # This appears in style objects as either:
    #   fontSize: 'clamp(28px, 6vw, 72px)', 
    # or:
    #   fontSize: 'clamp(28px, 6vw, 72px)'
    
    # Remove "fontSize: 'clamp(28px, 6vw, 72px)', " (with trailing comma+space)
    new_content, n = re.subn(r"fontSize:\s*'clamp\(28px,\s*6vw,\s*72px\)',\s*", '', content)
    changes += n
    content = new_content
    
    # Remove "fontSize: 'clamp(28px, 6vw, 72px)'" (without trailing comma — last property)
    new_content, n = re.subn(r"fontSize:\s*'clamp\(28px,\s*6vw,\s*72px\)'", '', content)
    changes += n
    content = new_content

    # Also remove the 18px-32px clamp variant (used in one AboutView heading)
    new_content, n = re.subn(r"fontSize:\s*'clamp\(18px,\s*3vw,\s*32px\)',\s*", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"fontSize:\s*'clamp\(18px,\s*3vw,\s*32px\)'", '', content)
    changes += n
    content = new_content

    # ── Step 2: Remove textShadow: '0 2px 30px rgba(0,0,0,0.5)' ──
    new_content, n = re.subn(r"textShadow:\s*'0 2px 30px rgba\(0,0,0,0\.5\)',\s*", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"textShadow:\s*'0 2px 30px rgba\(0,0,0,0\.5\)'", '', content)
    changes += n
    content = new_content

    # Also remove textShadow with 0.4 opacity (older variant)
    new_content, n = re.subn(r"textShadow:\s*'0 2px 30px rgba\(0,0,0,0\.4\)',\s*", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"textShadow:\s*'0 2px 30px rgba\(0,0,0,0\.4\)'", '', content)
    changes += n
    content = new_content

    # ── Step 3: Add .aura-hero-title class to hero h1s ──
    # Hero h1s have: className="text-white font-bold leading-[1.15] pt-2"
    # Replace with: className="aura-hero-title text-white"
    # This gives them the correct clamp size + textShadow via CSS class
    content = content.replace(
        'className="text-white font-bold leading-[1.15] pt-2"',
        'className="aura-hero-title text-white"'
    )
    # Also handle variant with ref
    content = content.replace(
        'className="text-white font-bold leading-[1.15] pt-2" ref={heroTitleRef}',
        'className="aura-hero-title text-white" ref={heroTitleRef}'
    )
    content = content.replace(
        'ref={heroTitleRef} className="text-white font-bold leading-[1.15] pt-2"',
        'ref={heroTitleRef} className="aura-hero-title text-white"'
    )

    # ── Step 4: Clean up empty style={{ }} objects ──
    content = re.sub(r'style=\{\{\s*\}\}', '', content)
    content = re.sub(r'\s+style=\{\}', '', content)
    # Clean up style={{ , ... }} (leading comma after removing first property)
    content = re.sub(r'style=\{\{,\s*', 'style={{ ', content)
    # Clean up style={{  }} (double space)
    content = re.sub(r'style=\{\{\s+', 'style={{ ', content)

    if content != original:
        Path(filepath).write_text(content)
        return changes
    return 0


total = 0
files = 0
for f in ALL_TSX:
    n = fix_file(str(f))
    if n > 0:
        print(f"  ✓ {f.name}: {n} fixes")
        total += n
        files += 1

print(f"\n=== Done: {total} fixes across {files} files ===")
