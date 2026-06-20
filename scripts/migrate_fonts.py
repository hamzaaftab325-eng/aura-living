#!/usr/bin/env python3
"""
Migrate all hardcoded font references to .aura-* typography classes.

Patterns to replace:
  style={{ fontFamily: "'Poppins', sans-serif", ... }} → remove fontFamily, add .aura-body class
  style={{ fontFamily: "'Playfair Display', serif", ... }} → remove fontFamily, add .aura-h2 or .aura-h3 class

Strategy:
  1. Find all style={{ ... fontFamily: '...' ... }} blocks
  2. Remove the fontFamily property
  3. If the element is an h1/h2/h3/h4, add the appropriate .aura-h* class
  4. If the element is a p/span/div, the body font (Poppins) is already the default — just remove
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src/components')
total_replacements = 0
files_modified = 0

for filepath in sorted(SRC_DIR.rglob('*.tsx')):
    content = filepath.read_text()
    original = content

    # Pattern 1: fontFamily: "'Poppins', sans-serif" (with or without trailing comma)
    # Remove it from style blocks
    content = re.sub(
        r"fontFamily:\s*'Poppins',?\s*sans-serif'?,?\s*",
        '',
        content
    )
    # Also handle: fontFamily: "'Poppins', sans-serif",
    content = re.sub(
        r"fontFamily:\s*\"'Poppins',\s*sans-serif\"?,?\s*",
        '',
        content
    )

    # Pattern 2: fontFamily: "'Playfair Display', serif"
    # Remove it from style blocks
    content = re.sub(
        r"fontFamily:\s*'Playfair Display',?\s*serif'?,?\s*",
        '',
        content
    )
    content = re.sub(
        r"fontFamily:\s*\"'Playfair Display',\s*serif\"?,?\s*",
        '',
        content
    )

    if content != original:
        # Count replacements
        old_count = original.count("'Poppins'") + original.count("'Playfair Display'")
        new_count = content.count("'Poppins'") + content.count("'Playfair Display'")
        changes = old_count - new_count
        if changes > 0:
            filepath.write_text(content)
            files_modified += 1
            total_replacements += changes
            print(f"  ✓ {filepath.name}: {changes} font refs removed")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} font references removed.")
