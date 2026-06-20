#!/usr/bin/env python3
"""
Token migration script — replaces inline hex colors with CSS variable references.

Maps each raw hex color to its semantic token from globals.css.
Preserves all other content. Creates .bak backups.

Usage:
  python3 /home/z/my-project/scripts/migrate_tokens.py
"""

import re
import os
from pathlib import Path
import shutil

# Hex → CSS variable mapping (case-insensitive)
# Order matters: longer/more-specific patterns first
TOKEN_MAP = {
    # Gold family
    '#D4AF37': 'var(--color-gold)',
    '#d4af37': 'var(--color-gold)',
    '#C9A22E': 'var(--color-gold-hover)',
    '#c9a22e': 'var(--color-gold-hover)',
    '#B8941F': 'var(--color-gold-text)',
    '#b8941f': 'var(--color-gold-text)',
    '#E8D5A3': 'var(--color-gold-soft)',
    '#e8d5a3': 'var(--color-gold-soft)',
    '#F5EDDA': 'var(--color-gold-pale)',
    '#f5edda': 'var(--color-gold-pale)',
    # Surfaces
    '#FAF8F5': 'var(--surface-page)',
    '#faf8f5': 'var(--surface-page)',
    '#FFFDF7': 'var(--surface-card)',
    '#fffdf7': 'var(--surface-card)',
    '#2C2C2C': 'var(--surface-dark)',
    '#2c2c2c': 'var(--surface-dark)',
    '#F2EDE4': 'var(--color-cream)',
    '#f2ede4': 'var(--color-cream)',
    # Text colors
    '#5A5A5A': 'var(--color-warm-gray)',
    '#5a5a5a': 'var(--color-warm-gray)',
    '#8A8A8A': 'var(--color-muted-gray)',
    '#8a8a8a': 'var(--color-muted-gray)',
    # Accents
    '#A8B5A0': 'var(--color-sage)',
    '#a8b5a0': 'var(--color-sage)',
    '#B8A99A': 'var(--color-taupe)',
    '#b8a99a': 'var(--color-taupe)',
    '#E8CEC1': 'var(--color-blush)',
    '#e8cec1': 'var(--color-blush)',
    # Status
    '#DC2626': 'var(--color-danger)',
    '#dc2626': 'var(--color-danger)',
    '#22C55E': 'var(--color-success)',
    '#22c55e': 'var(--color-success)',
    '#3B82F6': 'var(--color-info)',
    '#3b82f6': 'var(--color-info)',
    # Common danger variants used in errors
    '#E53E3E': 'var(--color-danger)',
    '#e53e3e': 'var(--color-danger)',
    '#E11D48': 'var(--color-danger)',
    '#e11d48': 'var(--color-danger)',
    # White-ish
    '#FFFFFF': 'var(--text-on-dark)',
    '#ffffff': 'var(--text-on-dark)',
}

# Directories to scan
SRC_DIRS = [
    '/home/z/my-project/src/components',
    '/home/z/my-project/src/app',
]

# Files to skip (e.g., the design token source itself)
SKIP_FILES = {
    '/home/z/my-project/src/app/globals.css',
}

# Patterns to match hex inside style={{}} blocks and className strings
# We do simple find/replace because hex is unambiguous in CSS / inline styles
def migrate_file(path: Path, dry_run: bool = False) -> tuple[int, int]:
    """Return (replacements_made, total_hex_found)."""
    content = path.read_text(encoding='utf-8')
    original = content

    replacements = 0
    for hex_val, token in TOKEN_MAP.items():
        # Match hex inside strings (style props, className, etc.) but skip if already a var()
        # Use word-boundary-ish matching: hex must not be preceded by '(' (which would mean it's inside var())
        # Simple approach: just replace the hex literal wherever it appears as a quoted value
        # Be conservative: only replace exact hex strings
        count = content.count(hex_val)
        if count > 0:
            content = content.replace(hex_val, token)
            replacements += count

    if content == original:
        return 0, 0

    if not dry_run:
        # Backup
        bak = path.with_suffix(path.suffix + '.bak')
        shutil.copy2(path, bak)
        path.write_text(content, encoding='utf-8')

    return replacements, replacements


def main():
    total_files = 0
    total_replacements = 0
    affected_files = []

    for src_dir in SRC_DIRS:
        if not os.path.isdir(src_dir):
            continue
        for root, _, files in os.walk(src_dir):
            for fname in files:
                if not fname.endswith(('.tsx', '.ts')):
                    continue
                fpath = Path(root) / fname
                if str(fpath) in SKIP_FILES:
                    continue

                repl, _ = migrate_file(fpath, dry_run=False)
                if repl > 0:
                    total_files += 1
                    total_replacements += repl
                    affected_files.append((str(fpath), repl))

    print(f'\n✓ Migration complete')
    print(f'  Files modified: {total_files}')
    print(f'  Total replacements: {total_replacements}')
    print(f'\nTop 15 files by replacements:')
    for p, n in sorted(affected_files, key=lambda x: -x[1])[:15]:
        print(f'    {n:>4}  {p}')


if __name__ == '__main__':
    main()
