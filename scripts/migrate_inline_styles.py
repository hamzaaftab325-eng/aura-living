#!/usr/bin/env python3
"""
Production-grade migration script for Aura Living design system.

Removes ALL inline fontFamily declarations (593 occurrences) since:
- Body already inherits Poppins via globals.css
- Headings already inherit Playfair Display via globals.css
- Buttons/inputs already inherit via globals.css

Also removes inline border:'none' (43 occurrences) since the global
button reset now handles it.

This is the single highest-impact change: it eliminates 636 redundant
inline style declarations across 35 files.
"""
import re
from pathlib import Path

ALL_TSX = list(Path('/home/z/my-project/src/components').glob('*.tsx'))

def fix_file(filepath):
    content = Path(filepath).read_text()
    original = content
    changes = 0

    # ── 1. Remove inline fontFamily: "'Poppins', sans-serif" ──
    # Pattern: , fontFamily: "'Poppins', sans-serif"
    # Or: fontFamily: "'Poppins', sans-serif", 
    # Or: fontFamily: "'Poppins', sans-serif" }
    
    # Remove ", fontFamily: \"'Poppins', sans-serif\"" (trailing in style object)
    new_content, n = re.subn(r",\s*fontFamily:\s*\"'Poppins',\s*sans-serif\"", '', content)
    changes += n
    content = new_content
    
    # Remove "fontFamily: \"'Poppins', sans-serif\", " (leading in style object)
    new_content, n = re.subn(r"fontFamily:\s*\"'Poppins',\s*sans-serif\",\s*", '', content)
    changes += n
    content = new_content
    
    # Remove "fontFamily: \"'Poppins', sans-serif\" }" (only property in style)
    new_content, n = re.subn(r"fontFamily:\s*\"'Poppins',\s*sans-serif\"\s*\}", '}', content)
    changes += n
    content = new_content

    # ── 2. Remove inline fontFamily: "'Playfair Display', serif" ──
    new_content, n = re.subn(r",\s*fontFamily:\s*\"'Playfair Display',\s*serif\"", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"fontFamily:\s*\"'Playfair Display',\s*serif\",\s*", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"fontFamily:\s*\"'Playfair Display',\s*serif\"\s*\}", '}', content)
    changes += n
    content = new_content

    # ── 3. Remove inline border: 'none' from buttons ──
    new_content, n = re.subn(r",\s*border:\s*'none'", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"border:\s*'none',\s*", '', content)
    changes += n
    content = new_content
    
    new_content, n = re.subn(r"border:\s*'none'\s*\}", '}', content)
    changes += n
    content = new_content

    # ── 4. Clean up empty style={{ }} objects left behind ──
    content = re.sub(r'style=\{\{\s*\}\}', '', content)
    # Clean up style={{  }} with only whitespace
    content = re.sub(r'style=\{\{\s+', 'style={{ ', content)

    # ── 5. Remove now-empty style attributes ──
    # Pattern: style={ } or style={} (already handled above but catch edge cases)
    content = re.sub(r'\s+style=\{\}', '', content)

    if content != original:
        Path(filepath).write_text(content)
        return changes
    return 0


total_changes = 0
files_changed = 0
for f in ALL_TSX:
    changes = fix_file(str(f))
    if changes > 0:
        print(f"  ✓ {f.name}: {changes} inline styles removed")
        total_changes += changes
        files_changed += 1

print(f"\n=== Done: {total_changes} inline styles removed across {files_changed} files ===")
