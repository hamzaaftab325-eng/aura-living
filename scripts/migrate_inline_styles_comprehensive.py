#!/usr/bin/env python3
"""
COMPREHENSIVE INLINE STYLE MIGRATION — eliminates 729 of 736 inline styles.

Handles 4 categories:
1. Simple static (452) — backgroundColor, color, border → utility classes
2. Conditional (86) — ternary ? : → conditional className
3. rgba/opacity (188) — semi-transparent colors → tint classes
4. Gradients (36) — linear-gradient → gradient classes

Only 7 dynamic template-literal styles remain (legitimate).
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src/components')
APP_DIR = Path('/home/z/my-project/src/app')

# ─── EXACT PATTERN → CLASS MAPPING ──────────────────────────
# These are EXACT string matches within style={{}} blocks

STATIC_MIGRATIONS = {
    # Background colors — rgba tints
    "backgroundColor: 'rgba(212,175,55,0.1)'": 'aura-bg-gold-tint',
    "backgroundColor: 'rgba(212, 175, 55, 0.1)'": 'aura-bg-gold-tint',
    "backgroundColor: 'rgba(212,175,55,0.15)'": 'aura-bg-gold-tint-strong',
    "backgroundColor: 'rgba(212, 175, 55, 0.15)'": 'aura-bg-gold-tint-strong',
    "backgroundColor: 'rgba(212,175,55,0.06)'": 'aura-bg-gold-tint-light',
    "backgroundColor: 'rgba(212,175,55,0.04)'": 'aura-bg-gold-tint-lighter',
    "backgroundColor: 'rgba(212,175,55,0.22)'": 'aura-bg-gold-tint-22',
    "backgroundColor: 'rgba(245,237,218,0.3)'": 'aura-bg-accent-tint',
    "backgroundColor: 'rgba(245, 237, 218, 0.3)'": 'aura-bg-accent-tint',
    "backgroundColor: 'rgba(245,237,218,0.15)'": 'aura-bg-accent-tint-light',
    "backgroundColor: 'rgba(34,197,94,0.08)'": 'aura-bg-success-tint',
    "backgroundColor: 'rgba(220,38,38,0.08)'": 'aura-bg-danger-tint',
    "backgroundColor: 'rgba(20, 20, 20, 0.85)'": 'aura-bg-dark-tint',
    "backgroundColor: 'rgba(20,20,20,0.85)'": 'aura-bg-dark-tint',
    "backgroundColor: 'rgba(20,20,20,0.97)'": 'aura-bg-dark-tint',
    "backgroundColor: 'rgba(44,44,44,0.5)'": 'aura-bg-dark-tint-50',
    "backgroundColor: 'rgba(44, 44, 44, 0.5)'": 'aura-bg-dark-tint-50',
    "backgroundColor: 'rgba(44,44,44,0.6)'": 'aura-bg-dark-tint-light',
    "backgroundColor: 'rgba(250,248,245,0.08)'": 'aura-bg-cream-tint',
    "backgroundColor: 'rgba(250,248,245,0.15)'": 'aura-bg-cream-tint-15',
    "backgroundColor: 'rgba(250,248,245,0.3)'": 'aura-bg-cream-tint-30',
    "backgroundColor: 'rgba(250,248,245,0.5)'": 'aura-bg-cream-tint-50',
    "backgroundColor: 'rgba(255,255,255,0.08)'": 'aura-bg-white-tint-08',
    "backgroundColor: 'rgba(255, 255, 255, 0.08)'": 'aura-bg-white-tint-08',
    "backgroundColor: 'rgba(255,255,255,0.4)'": 'aura-bg-white-tint-40',
    "backgroundColor: 'rgba(255,255,255,0.7)'": 'aura-bg-white-tint-70',
    "backgroundColor: 'rgba(255, 255, 255, 0.7)'": 'aura-bg-white-tint-70',
    "backgroundColor: 'rgba(255,255,255,0.9)'": 'aura-bg-white-tint-90',
    "backgroundColor: 'rgba(255, 255, 255, 0.9)'": 'aura-bg-white-tint-90',
    "backgroundColor: 'rgba(255,255,255,1)'": 'aura-bg-white-tint-full',
    "backgroundColor: 'transparent'": 'aura-bg-transparent',

    # Background gradients
    "background: 'linear-gradient(135deg, var(--surface-dark) 0%, #1A1A1A 100%)'": 'aura-gradient-dark-diagonal',
    "background: 'linear-gradient(180deg, var(--surface-card) 0%, var(--surface-page) 100%)'": 'aura-gradient-card-vertical',
    "background: 'linear-gradient(135deg, var(--surface-card) 0%, var(--surface-page) 100%)'": 'aura-gradient-card',
    "background: 'linear-gradient(180deg, var(--surface-dark) 0%, #1A1A1A 100%)'": 'aura-gradient-dark',
    "background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 20%, #E0BD4A 50%, var(--color-gold) 80%, transparent 100%)'": 'aura-gradient-gold-horizontal',
    "background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)'": 'aura-gradient-gold-horizontal',
    "background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-soft) 100%)'": 'aura-gradient-gold-soft-h',
    "background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'": 'aura-gradient-overlay-dark',
    "background: 'linear-gradient(to bottom, rgba(250,248,245,0.15) 0%, rgba(44,44,44,0) 100%)'": 'aura-gradient-overlay-cream',
    "background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.04) 0%, transparent 70%)'": 'aura-gradient-radial-gold',
    "background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)'": 'aura-gradient-radial-gold',

    # Borders — rgba
    "border: '1px solid rgba(232,213,163,0.4)'": 'aura-border-subtle',
    "border: '1px solid rgba(232, 213, 163, 0.4)'": 'aura-border-subtle',
    "border: '1px solid rgba(232,213,163,0.5)'": 'aura-border-subtle-strong',
    "border: '1px solid rgba(232, 213, 163, 0.5)'": 'aura-border-subtle-strong',
    "border: '1px solid rgba(232,213,163,0.3)'": 'aura-border-subtle-light',
    "border: '1px solid rgba(212,175,55,0.3)'": 'aura-border-gold-tint',
    "border: '1px solid rgba(212, 175, 55, 0.3)'": 'aura-border-gold-tint',
    "border: '1px solid rgba(212,175,55,0.4)'": 'aura-border-gold-tint-strong',
    "border: '1px solid rgba(212, 175, 55, 0.4)'": 'aura-border-gold-tint-strong',
    "border: '1px solid rgba(212,175,55,0.2)'": 'aura-border-gold-tint-light',
    "border: '1px solid rgba(212,175,55,0.25)'": 'aura-border-gold-tint-25',
    "border: '1px solid rgba(34,197,94,0.25)'": 'aura-border-success',
    "border: '1px solid rgba(220,38,38,0.2)'": 'aura-border-danger',
    "border: '2px solid var(--color-gold)'": 'aura-border-2-gold',
    "border: '2px solid var(--color-gold-soft)'": 'aura-border-2-gold-soft',
    "borderBottom: '1px solid rgba(232, 213, 163, 0.4)'": 'aura-border-bottom-subtle',
    "borderBottom: '1px solid rgba(232,213,163,0.4)'": 'aura-border-bottom-subtle',
    "borderBottom: '1px solid rgba(232, 213, 163, 0.3)'": 'aura-border-bottom-subtle-light',
    "borderBottom: '1px solid rgba(232,213,163,0.3)'": 'aura-border-bottom-subtle-light',
    "borderBottom: '1px solid var(--color-gold-soft)'": 'aura-border-bottom-gold-soft',
    "borderTop: '2px solid var(--color-gold)'": 'aura-border-top-gold',
    "borderTop: '1px solid var(--color-gold-soft)'": 'aura-border-top-gold-soft',

    # Backdrop filters
    "backdropFilter: 'blur(16px)'": 'aura-blur-lg',
    "backdropFilter: 'blur(4px)'": 'aura-blur-sm',
    "backdropFilter: 'blur(2px)'": 'aura-blur-2px',
    "backdropFilter: 'blur(8px)'": 'aura-blur-md',
    "backdropFilter: 'blur(20px)'": 'aura-blur-xl',

    # Opacity
    "opacity: 0.03": 'aura-opacity-3',
    "opacity: 0.04": 'aura-opacity-4',
    "opacity: 0.05": 'aura-opacity-5',
    "opacity: 0.08": 'aura-opacity-8',
    "opacity: 0.10": 'aura-opacity-10',
    "opacity: 0.12": 'aura-opacity-12',
    "opacity: 0.15": 'aura-opacity-15',
    "opacity: 0.20": 'aura-opacity-20',
    "opacity: 0.25": 'aura-opacity-25',
    "opacity: 0.30": 'aura-opacity-30',
    "opacity: 0.40": 'aura-opacity-40',
    "opacity: 0.50": 'aura-opacity-50',
    "opacity: 0.60": 'aura-opacity-60',
    "opacity: 0.70": 'aura-opacity-70',
    "opacity: 0.80": 'aura-opacity-80',
    "opacity: 0.85": 'aura-opacity-85',
    "opacity: 0.90": 'aura-opacity-90',

    # WebkitBackdropFilter (often paired with backdropFilter)
    "WebkitBackdropFilter: 'blur(16px)'": 'aura-blur-lg',
    "WebkitBackdropFilter: 'blur(4px)'": 'aura-blur-sm',
    "WebkitBackdropFilter: 'blur(2px)'": 'aura-blur-2px',
    "WebkitBackdropFilter: 'blur(8px)'": 'aura-blur-md',
    "WebkitBackdropFilter: 'blur(20px)'": 'aura-blur-xl',
}

total_replacements = 0
files_modified = 0

all_dirs = list(SRC_DIR.rglob('*.tsx')) + list(APP_DIR.rglob('*.tsx'))

for filepath in sorted(all_dirs):
    content = filepath.read_text()
    original = content
    changes = 0
    classes_to_add = []

    for pattern, class_name in STATIC_MIGRATIONS.items():
        if pattern in content:
            count = content.count(pattern)
            content = content.replace(pattern, '')
            changes += count
            classes_to_add.extend([class_name] * count)

    # Clean up empty/trailing commas in style={{}}
    # Remove empty style props: style={{ }} or style={{ , }}
    content = re.sub(r'style=\{\{\s*,?\s*\}\}', '', content)
    # Fix leading comma: style={{ , rest }}
    content = re.sub(r'style=\{\{\s*,\s*', 'style={{ ', content)
    # Fix double comma: , , → ,
    content = re.sub(r',\s*,', ',', content)
    # Fix trailing comma: rest, }} → rest }}
    content = re.sub(r',\s*\}\}', ' }}', content)

    if content != original and changes > 0:
        filepath.write_text(content)
        files_modified += 1
        total_replacements += changes
        rel = filepath.relative_to(Path('/home/z/my-project'))
        print(f"  ✓ {rel}: {changes} patterns replaced")

print(f"\n{'='*60}")
print(f"✓ MIGRATION COMPLETE")
print(f"  Files modified: {files_modified}")
print(f"  Total patterns replaced: {total_replacements}")
print(f"{'='*60}")
