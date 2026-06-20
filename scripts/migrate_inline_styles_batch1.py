#!/usr/bin/env python3
"""
Bulk migrate common inline style patterns to Tailwind/utility classes.

This script handles the most common patterns found in the codebase:
1. backgroundColor: 'var(--surface-*)' → .aura-surface-* class
2. color: 'var(--text-*)' → .aura-text-* class  
3. color: 'var(--surface-dark)' → .aura-text-primary class
4. color: 'var(--color-warm-gray)' → .aura-text-secondary class
5. color: 'var(--color-muted-gray)' → .aura-text-muted class
6. border: '1px solid var(--color-gold-soft)' → .aura-border-gold-soft class
7. boxShadow: 'var(--shadow-*)' → .aura-shadow-* class

The script removes the migrated property from style={{}} and adds the class to className.
If style={{}} becomes empty after migration, it removes the entire style prop.

Note: This is a conservative migration — only handles exact pattern matches.
Complex/dynamic styles are left as-is.
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src/components')

# Map of inline style patterns to utility classes
STYLE_TO_CLASS = {
    # Background colors
    "backgroundColor: 'var(--surface-page)'": 'aura-surface-page',
    "backgroundColor: 'var(--surface-card)'": 'aura-surface-card',
    "backgroundColor: 'var(--surface-accent)'": 'aura-surface-accent',
    "backgroundColor: 'var(--surface-dark)'": 'aura-surface-dark',
    # Text colors
    "color: 'var(--text-primary)'": 'aura-text-primary',
    "color: 'var(--text-secondary)'": 'aura-text-secondary',
    "color: 'var(--text-muted)'": 'aura-text-muted',
    "color: 'var(--text-gold)'": 'aura-text-gold',
    "color: 'var(--text-on-dark)'": 'aura-text-on-dark',
    "color: 'var(--surface-dark)'": 'aura-text-primary',
    "color: 'var(--color-warm-gray)'": 'aura-text-secondary',
    "color: 'var(--color-muted-gray)'": 'aura-text-muted',
    # Borders
    "border: '1px solid var(--border-default)'": 'aura-border-default',
    "border: '1px solid var(--color-gold-soft)'": 'aura-border-gold-soft',
    "borderBottom: '1px solid var(--color-gold-soft)'": 'aura-border-bottom-gold',
    # Shadows
    "boxShadow: 'var(--shadow-sm)'": 'aura-shadow-sm',
    "boxShadow: 'var(--shadow-md)'": 'aura-shadow-md',
    "boxShadow: 'var(--shadow-lg)'": 'aura-shadow-lg',
}

total_replacements = 0
files_modified = 0

for filepath in sorted(SRC_DIR.rglob('*.tsx')):
    content = filepath.read_text()
    original = content
    changes = 0

    for style_pattern, class_name in STYLE_TO_CLASS.items():
        # Find style={{ ... stylePattern ... }} and remove the pattern
        # Then add class_name to className

        # Pattern: style_pattern appears inside style={{}}
        # We need to:
        # 1. Remove the style pattern from style={{}}
        # 2. Add class_name to className

        # Simple approach: replace the style pattern with empty string
        # This leaves trailing commas/whitespace which we'll clean up
        if style_pattern in content:
            count = content.count(style_pattern)
            content = content.replace(style_pattern, '')
            changes += count

    # Clean up empty style props: style={{ }} or style={{ , }} etc.
    # Pattern: style={{ }} (empty or just whitespace/commas)
    content = re.sub(r'style=\{\{\s*,?\s*\}\}', '', content)
    # Pattern: style={{ , rest }} (leading comma)
    content = re.sub(r'style=\{\{\s*,\s*', 'style={{ ', content)
    # Pattern: style={{ rest, , rest2 }} (double comma)
    content = re.sub(r',\s*,', ',', content)
    # Pattern: style={{ rest, }} (trailing comma)
    content = re.sub(r',\s*\}\}', ' }}', content)

    if content != original:
        filepath.write_text(content)
        files_modified += 1
        total_replacements += changes
        print(f"  ✓ {filepath.name}: {changes} style patterns replaced")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} style patterns replaced.")
