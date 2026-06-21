#!/usr/bin/env python3
"""
Aggressive pass: catch rgba patterns with variable spacing.
Also catch remaining static patterns that were missed.
"""
import re
from pathlib import Path

SRC_DIRS = [Path('/home/z/my-project/src/components'), Path('/home/z/my-project/src/app')]

# More patterns with flexible spacing
FLEXIBLE_PATTERNS = [
    # rgba with flexible spaces
    (r"backgroundColor: 'rgba\(212,\s*175,\s*55,\s*0\.1\)'\s*,?", 'aura-bg-gold-tint'),
    (r"backgroundColor: 'rgba\(212,\s*175,\s*55,\s*0\.15\)'\s*,?", 'aura-bg-gold-tint-strong'),
    (r"backgroundColor: 'rgba\(245,\s*237,\s*218,\s*0\.3\)'\s*,?", 'aura-bg-accent-tint'),
    (r"backgroundColor: 'rgba\(20,\s*20,\s*20,\s*0\.85\)'\s*,?", 'aura-bg-dark-tint'),
    (r"backgroundColor: 'rgba\(255,\s*255,\s*255,\s*0\.08\)'\s*,?", 'aura-bg-white-tint-08'),
    (r"backgroundColor: 'rgba\(255,\s*255,\s*255,\s*0\.4\)'\s*,?", 'aura-bg-white-tint-40'),
    (r"backgroundColor: 'rgba\(255,\s*255,\s*255,\s*0\.7\)'\s*,?", 'aura-bg-white-tint-70'),
    (r"backgroundColor: 'rgba\(255,\s*255,\s*255,\s*0\.9\)'\s*,?", 'aura-bg-white-tint-90'),
    (r"backgroundColor: 'rgba\(44,\s*44,\s*44,\s*0\.5\)'\s*,?", 'aura-bg-dark-tint-50'),
    (r"backgroundColor: 'rgba\(44,\s*44,\s*44,\s*0\.6\)'\s*,?", 'aura-bg-dark-tint-light'),
    (r"backgroundColor: 'transparent'\s*,?", 'aura-bg-transparent'),
    # Borders
    (r"border: '1px solid rgba\(232,\s*213,\s*163,\s*0\.4\)'\s*,?", 'aura-border-subtle'),
    (r"border: '1px solid rgba\(212,\s*175,\s*55,\s*0\.3\)'\s*,?", 'aura-border-gold-tint'),
    (r"border: '1px solid rgba\(212,\s*175,\s*55,\s*0\.4\)'\s*,?", 'aura-border-gold-tint-strong'),
    (r"borderBottom: '1px solid rgba\(232,\s*213,\s*163,\s*0\.4\)'\s*,?", 'aura-border-bottom-subtle'),
    (r"borderBottom: '1px solid rgba\(232,\s*213,\s*163,\s*0\.3\)'\s*,?", 'aura-border-bottom-subtle-light'),
    (r"borderBottom: '1px solid rgba\(232,\s*213,\s*163,\s*0\.5\)'\s*,?", 'aura-border-bottom-subtle'),
    # Backdrop
    (r"backdropFilter: 'blur\(16px\)'\s*,?", 'aura-blur-lg'),
    (r"backdropFilter: 'blur\(4px\)'\s*,?", 'aura-blur-sm'),
    (r"backdropFilter: 'blur\(2px\)'\s*,?", 'aura-blur-2px'),
    (r"backdropFilter: 'blur\(20px\)'\s*,?", 'aura-blur-xl'),
    (r"WebkitBackdropFilter: 'blur\(16px\)'\s*,?", 'aura-blur-lg'),
    (r"WebkitBackdropFilter: 'blur\(4px\)'\s*,?", 'aura-blur-sm'),
    (r"WebkitBackdropFilter: 'blur\(2px\)'\s*,?", 'aura-blur-2px'),
    (r"WebkitBackdropFilter: 'blur\(20px\)'\s*,?", 'aura-blur-xl'),
]

total = 0
for src_dir in SRC_DIRS:
    for filepath in src_dir.rglob('*.tsx'):
        content = filepath.read_text()
        original = content
        changes = 0
        
        for pattern, class_name in FLEXIBLE_PATTERNS:
            matches = re.findall(pattern, content)
            if matches:
                content = re.sub(pattern, '', content)
                changes += len(matches)
        
        # Cleanup
        content = re.sub(r'style=\{\{\s*,?\s*\}\}', '', content)
        content = re.sub(r'\{\s*,\s*', '{ ', content)
        content = re.sub(r',\s*,', ',', content)
        content = re.sub(r',\s*\}', ' }', content)
        content = re.sub(r':\s*,\s*', ': ', content)
        content = re.sub(r'\n\s+,\s*\n', '\n', content)
        
        if content != original and changes > 0:
            filepath.write_text(content)
            total += changes
            print(f"  ✓ {filepath.name}: {changes}")

print(f"\n✓ {total} additional patterns replaced")
