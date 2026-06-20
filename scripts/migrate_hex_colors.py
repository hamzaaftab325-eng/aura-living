#!/usr/bin/env python3
"""
Migrate remaining inline hex colors to CSS variables/tokens.

Maps:
  #FFFDF7 → var(--surface-card)
  #FAF8F5 → var(--surface-page)
  #D4AF37 → var(--color-gold)
  #E0BD4A → var(--color-gold-hover) (close enough)
  #22C55E → var(--color-success)
  #16A34A → #16A34A (no token — keep as-is, it's a gradient stop)
  #1A1A1A → #1A1A1A (gradient stop — keep)
  #3A3A3A → #3A3A3A (gradient stop — keep)
  #25D366 → #25D366 (WhatsApp brand color — keep)
  #C44 → var(--color-danger)
  #4285F4, #34A853, #FBBC05, #EA4335 → Google brand colors — keep
  #1877F2 → Facebook brand color — keep
  #EAD9B6 → var(--color-gold-soft) (close enough)

Only replace colors that have exact token equivalents.
Leave brand-specific colors (Google, Facebook, WhatsApp) as-is.
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src/components')

# Only replace colors that have exact token equivalents
COLOR_MAP = {
    '#FFFDF7': 'var(--surface-card)',
    '#FAF8F5': 'var(--surface-page)',
    '#D4AF37': 'var(--color-gold)',
    '#C44': 'var(--color-danger)',
    '#EAD9B6': 'var(--color-gold-soft)',
}

total_replacements = 0
files_modified = 0

for filepath in sorted(SRC_DIR.rglob('*.tsx')):
    content = filepath.read_text()
    original = content

    for hex_val, token in COLOR_MAP.items():
        # Case-insensitive replacement
        pattern = re.compile(re.escape(hex_val), re.IGNORECASE)
        content = pattern.sub(token, content)

    if content != original:
        changes = sum(1 for old, new in zip(original.split('\n'), content.split('\n')) if old != new)
        filepath.write_text(content)
        files_modified += 1
        total_replacements += changes
        print(f"  ✓ {filepath.name}: {changes} hex colors replaced")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} hex colors replaced.")
print("\nNote: Brand colors (Google, Facebook, WhatsApp) kept as-is — they're brand-specific.")
