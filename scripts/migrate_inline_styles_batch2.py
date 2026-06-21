#!/usr/bin/env python3
"""
Batch 2: More inline style patterns to migrate.
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src/components')

STYLE_TO_CLASS = {
    # More background patterns
    "backgroundColor: 'rgba(212,175,55,0.1)'": '',
    "backgroundColor: 'rgba(212, 175, 55, 0.1)'": '',
    "backgroundColor: 'rgba(212,175,55,0.15)'": '',
    "backgroundColor: 'rgba(245,237,218,0.3)'": '',
    "backgroundColor: 'rgba(245, 237, 218, 0.3)'": '',
    # Border patterns
    "borderBottom: '1px solid rgba(232, 213, 163, 0.4)'": '',
    "borderBottom: '1px solid rgba(232, 213, 163, 0.5)'": '',
    "borderBottom: '1px solid var(--color-gold-soft)'": '',
    # Color patterns with var
    "color: 'var(--color-warm-gray)'": 'aura-text-secondary',
    "color: 'var(--color-muted-gray)'": 'aura-text-muted',
    "color: 'var(--surface-dark)'": 'aura-text-primary',
    # Text decoration
    "textDecoration: 'none'": '',
}

total_replacements = 0
files_modified = 0

for filepath in sorted(SRC_DIR.rglob('*.tsx')):
    content = filepath.read_text()
    original = content
    changes = 0

    for style_pattern, class_name in STYLE_TO_CLASS.items():
        if style_pattern in content:
            count = content.count(style_pattern)
            content = content.replace(style_pattern, '')
            changes += count

    # Clean up
    content = re.sub(r'style=\{\{\s*,?\s*\}\}', '', content)
    content = re.sub(r'style=\{\{\s*,\s*', 'style={{ ', content)
    content = re.sub(r',\s*,', ',', content)
    content = re.sub(r',\s*\}\}', ' }}', content)

    if content != original:
        filepath.write_text(content)
        files_modified += 1
        total_replacements += changes
        print(f"  ✓ {filepath.name}: {changes} patterns replaced")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} patterns replaced.")
