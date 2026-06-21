#!/usr/bin/env python3
"""
Remove " | Aura Living" suffix from route metadata titles.
The root layout's `title.template: "%s | Aura Living"` will add it automatically,
so individual routes should NOT include the suffix.
"""
import re
from pathlib import Path

APP_DIR = Path('/home/z/my-project/src/app')

# Find all page.tsx and layout.tsx files
files = list(APP_DIR.rglob('page.tsx')) + list(APP_DIR.rglob('layout.tsx'))
# Exclude root layout.tsx (it has the template definition)
files = [f for f in files if f.name == 'page.tsx' or (f.name == 'layout.tsx' and f.parent != APP_DIR)]

total_replacements = 0
files_modified = 0

for filepath in files:
    content = filepath.read_text()
    original = content

    # Replace " | Aura Living" with "" in title: '...' and title: "..." patterns
    # But NOT in openGraph.title or twitter.title (those are full titles for social)
    # Actually we should remove from OG/twitter too since template doesn't apply there
    # — but let's only remove from the main `title:` field to keep OG titles explicit.

    # Pattern: title: 'Something | Aura Living'
    new_content = re.sub(
        r"(title:\s*['\"])([^'\"]*?) \| Aura Living(['\"])",
        r"\1\2\3",
        content
    )

    if new_content != original:
        replacements = content.count(" | Aura Living") - new_content.count(" | Aura Living")
        filepath.write_text(new_content)
        files_modified += 1
        total_replacements += replacements
        print(f"  {filepath.relative_to(APP_DIR)}: {replacements} replacements")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} replacements.")
