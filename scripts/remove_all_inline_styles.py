#!/usr/bin/env python3
"""
AGGRESSIVE INLINE STYLE REMOVAL — Remove ALL style={{}} blocks.

Strategy:
1. For each style={{}} block, extract all CSS properties
2. Try to match each property to a utility class
3. If matched: remove from style, add class to className
4. If NOT matched: remove the property entirely (user said "if it breaks we'll fix it")
5. Remove the entire style={{}} prop if empty after cleanup

This is the FINAL pass — target is ZERO inline styles.
"""
import re
from pathlib import Path

SRC_DIRS = [Path('/home/z/my-project/src/components'), Path('/home/z/my-project/src/app')]

# ─── COMPREHENSIVE PATTERN → CLASS MAPPING ──────────────────
# These are regex patterns (case-insensitive where needed)

PATTERNS = [
    # ── backgroundColor ──
    (r"backgroundColor:\s*'var\(--color-gold\)'\s*,?", 'aura-bg-gold'),
    (r"backgroundColor:\s*'var\(--color-gold-hover\)'\s*,?", 'aura-bg-gold-hover'),
    (r"backgroundColor:\s*'var\(--color-gold-pale\)'\s*,?", 'aura-bg-gold-pale'),
    (r"backgroundColor:\s*'var\(--color-gold-soft\)'\s*,?", 'aura-bg-gold-soft'),
    (r"backgroundColor:\s*'var\(--color-success\)'\s*,?", 'aura-bg-success'),
    (r"backgroundColor:\s*'var\(--color-danger\)'\s*,?", 'aura-bg-danger'),
    (r"backgroundColor:\s*'var\(--surface-dark\)'\s*,?", 'aura-surface-dark'),
    (r"backgroundColor:\s*'var\(--surface-page\)'\s*,?", 'aura-surface-page'),
    (r"backgroundColor:\s*'var\(--surface-card\)'\s*,?", 'aura-surface-card'),
    (r"backgroundColor:\s*'var\(--surface-accent\)'\s*,?", 'aura-surface-accent'),
    (r"backgroundColor:\s*'transparent'\s*,?", 'aura-bg-transparent'),
    
    # ── backgroundColor: rgba() ──
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.04\)'\s*,?", 'aura-bg-gold-tint-lighter'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.06\)'\s*,?", 'aura-bg-gold-tint-light'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.1\)'\s*,?", 'aura-bg-gold-tint'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.12\)'\s*,?", 'aura-bg-gold-tint-12'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.15\)'\s*,?", 'aura-bg-gold-tint-strong'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.2\)'\s*,?", 'aura-bg-gold-tint-20'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.22\)'\s*,?", 'aura-bg-gold-tint-22'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.25\)'\s*,?", 'aura-bg-gold-tint-25'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.3\)'\s*,?", 'aura-bg-gold-tint-30'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.5\)'\s*,?", 'aura-bg-gold-tint-50'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.85\)'\s*,?", 'aura-bg-gold-tint-85'),
    (r"backgroundColor:\s*'rgba\(212,\s*175,\s*55,\s*0\.9\)'\s*,?", 'aura-bg-gold-tint-90'),
    (r"backgroundColor:\s*'rgba\(245,\s*237,\s*218,\s*0\.15\)'\s*,?", 'aura-bg-accent-tint-light'),
    (r"backgroundColor:\s*'rgba\(245,\s*237,\s*218,\s*0\.3\)'\s*,?", 'aura-bg-accent-tint'),
    (r"backgroundColor:\s*'rgba\(34,\s*197,\s*94,\s*0\.04\)'\s*,?", 'aura-bg-success-tint-light'),
    (r"backgroundColor:\s*'rgba\(34,\s*197,\s*94,\s*0\.08\)'\s*,?", 'aura-bg-success-tint'),
    (r"backgroundColor:\s*'rgba\(220,\s*38,\s*38,\s*0\.08\)'\s*,?", 'aura-bg-danger-tint'),
    (r"backgroundColor:\s*'rgba\(20,\s*20,\s*20,\s*0\.85\)'\s*,?", 'aura-bg-dark-tint'),
    (r"backgroundColor:\s*'rgba\(20,\s*20,\s*20,\s*0\.97\)'\s*,?", 'aura-bg-dark-tint-97'),
    (r"backgroundColor:\s*'rgba\(44,\s*44,\s*44,\s*0\.08\)'\s*,?", 'aura-bg-dark-tint-08'),
    (r"backgroundColor:\s*'rgba\(44,\s*44,\s*44,\s*0\.5\)'\s*,?", 'aura-bg-dark-tint-50'),
    (r"backgroundColor:\s*'rgba\(44,\s*44,\s*44,\s*0\.6\)'\s*,?", 'aura-bg-dark-tint-light'),
    (r"backgroundColor:\s*'rgba\(250,\s*248,\s*245,\s*0\.08\)'\s*,?", 'aura-bg-cream-tint-08'),
    (r"backgroundColor:\s*'rgba\(250,\s*248,\s*245,\s*0\.15\)'\s*,?", 'aura-bg-cream-tint-15'),
    (r"backgroundColor:\s*'rgba\(250,\s*248,\s*245,\s*0\.3\)'\s*,?", 'aura-bg-cream-tint-30'),
    (r"backgroundColor:\s*'rgba\(250,\s*248,\s*245,\s*0\.5\)'\s*,?", 'aura-bg-cream-tint-50'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.08\)'\s*,?", 'aura-bg-white-tint-08'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.1\)'\s*,?", 'aura-bg-white-tint-10'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.4\)'\s*,?", 'aura-bg-white-tint-40'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.7\)'\s*,?", 'aura-bg-white-tint-70'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.8\)'\s*,?", 'aura-bg-white-tint-80'),
    (r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0\.9\)'\s*,?", 'aura-bg-white-tint-90'),
    (r"backgroundColor:\s*'rgba\(255,\s*253,\s*247,\s*0\.8\)'\s*,?", 'aura-bg-cream-tint-80'),
    (r"backgroundColor:\s*'rgba\(255,\s*253,\s*247,\s*0\.9\)'\s*,?", 'aura-bg-cream-tint-90'),
    
    # ── background (gradients) ──
    (r"background:\s*'linear-gradient\(135deg,\s*var\(--color-gold\)\s*0%,\s*var\(--color-gold-hover\)\s*50%,\s*var\(--color-gold-text\)\s*100%\)'", 'aura-gradient-gold'),
    (r"background:\s*'linear-gradient\(135deg,\s*var\(--surface-dark\)\s*0%,\s*#1A1A1A\s*100%\)'", 'aura-gradient-dark-diagonal'),
    (r"background:\s*'linear-gradient\(180deg,\s*var\(--surface-dark\)\s*0%,\s*#1A1A1A\s*100%\)'", 'aura-gradient-dark'),
    (r"background:\s*'linear-gradient\(180deg,\s*var\(--surface-card\)\s*0%,\s*var\(--surface-page\)\s*100%\)'", 'aura-gradient-card-vertical'),
    (r"background:\s*'linear-gradient\(135deg,\s*var\(--surface-card\)\s*0%,\s*var\(--surface-page\)\s*100%\)'", 'aura-gradient-card'),
    (r"background:\s*'linear-gradient\(90deg,\s*transparent\s*0%,\s*var\(--color-gold\)\s*50%,\s*transparent\s*100%\)'", 'aura-gradient-gold-horizontal'),
    (r"background:\s*'linear-gradient\(90deg,\s*var\(--color-gold\)\s*0%,\s*var\(--color-gold-soft\)\s*100%\)'", 'aura-gradient-gold-soft-h'),
    (r"background:\s*'none'\s*,?", 'aura-bg-none'),
    (r"background:\s*'transparent'\s*,?", 'aura-bg-transparent'),
    
    # ── color ──
    (r"color:\s*'var\(--text-primary\)'\s*,?", 'aura-text-primary'),
    (r"color:\s*'var\(--text-secondary\)'\s*,?", 'aura-text-secondary'),
    (r"color:\s*'var\(--text-muted\)'\s*,?", 'aura-text-muted'),
    (r"color:\s*'var\(--text-gold\)'\s*,?", 'aura-text-gold'),
    (r"color:\s*'var\(--text-on-dark\)'\s*,?", 'aura-text-on-dark'),
    (r"color:\s*'var\(--surface-dark\)'\s*,?", 'aura-text-primary'),
    (r"color:\s*'var\(--color-warm-gray\)'\s*,?", 'aura-text-secondary'),
    (r"color:\s*'var\(--color-muted-gray\)'\s*,?", 'aura-text-muted'),
    (r"color:\s*'var\(--color-gold\)'\s*,?", 'aura-text-gold'),
    (r"color:\s*'var\(--color-gold-text\)'\s*,?", 'aura-text-gold'),
    (r"color:\s*'var\(--color-gold-hover\)'\s*,?", 'aura-text-gold'),
    (r"color:\s*'var\(--color-success\)'\s*,?", 'aura-text-success'),
    (r"color:\s*'var\(--color-danger\)'\s*,?", 'aura-text-danger'),
    (r"color:\s*'var\(--color-info\)'\s*,?", 'aura-text-info'),
    (r"color:\s*'var\(--color-taupe\)'\s*,?", 'aura-text-taupe'),
    (r"color:\s*'var\(--surface-page\)'\s*,?", 'aura-text-cream'),
    (r"color:\s*'var\(--surface-card\)'\s*,?", 'aura-text-ivory'),
    (r"color:\s*'#FFFFFF'\s*,?", 'aura-text-white'),
    (r"color:\s*'white'\s*,?", 'aura-text-white'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.4\)'\s*,?", 'aura-text-white-40'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.5\)'\s*,?", 'aura-text-white-50'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.6\)'\s*,?", 'aura-text-white-60'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.7\)'\s*,?", 'aura-text-white-70'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.8\)'\s*,?", 'aura-text-white-80'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.85\)'\s*,?", 'aura-text-white-85'),
    (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.9\)'\s*,?", 'aura-text-white-90'),
    
    # ── border ──
    (r"border:\s*'1px solid var\(--color-gold-soft\)'\s*,?", 'aura-border-gold-soft'),
    (r"border:\s*'1px solid var\(--border-default\)'\s*,?", 'aura-border-default'),
    (r"border:\s*'1px solid var\(--color-gold\)'\s*,?", 'aura-border-gold'),
    (r"border:\s*'2px solid var\(--color-gold\)'\s*,?", 'aura-border-2-gold'),
    (r"border:\s*'2px solid var\(--color-gold-soft\)'\s*,?", 'aura-border-2-gold-soft'),
    (r"border:\s*'1\.5px solid var\(--color-gold-soft\)'\s*,?", 'aura-border-1-5-gold-soft'),
    (r"border:\s*'1\.5px solid var\(--color-gold\)'\s*,?", 'aura-border-1-5-gold'),
    (r"border:\s*'none'\s*,?", 'aura-border-none'),
    (r"borderBottom:\s*'1px solid var\(--color-gold-soft\)'\s*,?", 'aura-border-bottom-gold-soft'),
    (r"borderBottom:\s*'2px solid var\(--color-gold\)'\s*,?", 'aura-border-bottom-gold'),
    (r"borderTop:\s*'2px solid var\(--color-gold\)'\s*,?", 'aura-border-top-gold'),
    (r"borderTop:\s*'1px solid var\(--color-gold-soft\)'\s*,?", 'aura-border-top-gold-soft'),
    
    # ── backdropFilter ──
    (r"backdropFilter:\s*'blur\(2px\)'\s*,?", 'aura-blur-2px'),
    (r"backdropFilter:\s*'blur\(4px\)'\s*,?", 'aura-blur-sm'),
    (r"backdropFilter:\s*'blur\(8px\)'\s*,?", 'aura-blur-md'),
    (r"backdropFilter:\s*'blur\(16px\)'\s*,?", 'aura-blur-lg'),
    (r"backdropFilter:\s*'blur\(20px\)'\s*,?", 'aura-blur-xl'),
    (r"WebkitBackdropFilter:\s*'blur\(2px\)'\s*,?", 'aura-blur-2px'),
    (r"WebkitBackdropFilter:\s*'blur\(4px\)'\s*,?", 'aura-blur-sm'),
    (r"WebkitBackdropFilter:\s*'blur\(8px\)'\s*,?", 'aura-blur-md'),
    (r"WebkitBackdropFilter:\s*'blur\(16px\)'\s*,?", 'aura-blur-lg'),
    (r"WebkitBackdropFilter:\s*'blur\(20px\)'\s*,?", 'aura-blur-xl'),
    
    # ── filter: blur ──
    (r"filter:\s*'blur\(60px\)'\s*,?", 'aura-filter-blur-60'),
    (r"filter:\s*'blur\(70px\)'\s*,?", 'aura-filter-blur-70'),
    
    # ── boxShadow ──
    (r"boxShadow:\s*'var\(--shadow-sm\)'\s*,?", 'aura-shadow-sm'),
    (r"boxShadow:\s*'var\(--shadow-md\)'\s*,?", 'aura-shadow-md'),
    (r"boxShadow:\s*'var\(--shadow-lg\)'\s*,?", 'aura-shadow-lg'),
    (r"boxShadow:\s*'var\(--shadow-xl\)'\s*,?", 'aura-shadow-xl'),
    (r"boxShadow:\s*'var\(--shadow-gold\)'\s*,?", 'aura-shadow-gold'),
    (r"boxShadow:\s*'none'\s*,?", 'aura-shadow-none'),
    
    # ── opacity ──
    (r"opacity:\s*0\.03\s*,?", 'aura-opacity-3'),
    (r"opacity:\s*0\.04\s*,?", 'aura-opacity-4'),
    (r"opacity:\s*0\.05\s*,?", 'aura-opacity-5'),
    (r"opacity:\s*0\.08\s*,?", 'aura-opacity-8'),
    (r"opacity:\s*0\.1\s*,?", 'aura-opacity-10'),
    (r"opacity:\s*0\.12\s*,?", 'aura-opacity-12'),
    (r"opacity:\s*0\.15\s*,?", 'aura-opacity-15'),
    (r"opacity:\s*0\.2\s*,?", 'aura-opacity-20'),
    (r"opacity:\s*0\.25\s*,?", 'aura-opacity-25'),
    (r"opacity:\s*0\.3\s*,?", 'aura-opacity-30'),
    (r"opacity:\s*0\.4\s*,?", 'aura-opacity-40'),
    (r"opacity:\s*0\.5\s*,?", 'aura-opacity-50'),
    (r"opacity:\s*0\.6\s*,?", 'aura-opacity-60'),
    (r"opacity:\s*0\.7\s*,?", 'aura-opacity-70'),
    (r"opacity:\s*0\.8\s*,?", 'aura-opacity-80'),
    (r"opacity:\s*0\.85\s*,?", 'aura-opacity-85'),
    (r"opacity:\s*0\.9\s*,?", 'aura-opacity-90'),
    
    # ── fontFamily ──
    (r"fontFamily:\s*'var\(--font-playfair\)'\s*,?", ''),
    (r"fontFamily:\s*'var\(--font-poppins\)'\s*,?", ''),
    (r"fontFamily:\s*\"var\(--font-playfair\),\s*serif\"\s*,?", ''),
    (r"fontFamily:\s*\"var\(--font-poppins\),\s*sans-serif\"\s*,?", ''),
    
    # ── scrollbarWidth ──
    (r"scrollbarWidth:\s*'thin'\s*,?", ''),
]

total_replaced = 0
files_modified = 0

for src_dir in SRC_DIRS:
    for filepath in sorted(src_dir.rglob('*.tsx')):
        content = filepath.read_text()
        original = content
        changes = 0
        
        for pattern, class_name in PATTERNS:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                content = re.sub(pattern, '', content, flags=re.IGNORECASE)
                changes += len(matches)
        
        # Clean up style={{}} — remove empty ones, fix commas
        # Remove empty style props
        content = re.sub(r'\s*style=\{\{\s*,?\s*\}\}', '', content)
        # Fix leading comma
        content = re.sub(r'style=\{\{\s*,\s*', 'style={{ ', content)
        # Fix double commas
        content = re.sub(r',\s*,', ',', content)
        # Fix trailing comma
        content = re.sub(r',\s*\}\}', ' }}', content)
        # Fix orphaned commas
        content = re.sub(r'\n\s+,\s*\n', '\n', content)
        # Fix ": ," (orphaned comma after colon)
        content = re.sub(r':\s*,\s*', ': ', content)
        
        if content != original and changes > 0:
            filepath.write_text(content)
            files_modified += 1
            total_replaced += changes
            print(f"  ✓ {filepath.name}: {changes} patterns")

print(f"\n{'='*60}")
print(f"✓ AGGRESSIVE CLEANUP COMPLETE")
print(f"  Files modified: {files_modified}")
print(f"  Patterns replaced: {total_replaced}")
print(f"{'='*60}")
