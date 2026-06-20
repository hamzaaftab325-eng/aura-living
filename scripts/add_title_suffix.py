#!/usr/bin/env python3
"""
Add ' | Aura Living' suffix back to all route metadata titles.
We removed the title.template because of a Next.js 16 streaming bug,
so each page must specify its full title.
"""
import re
from pathlib import Path

APP_DIR = Path('/home/z/my-project/src/app')

# Find all page.tsx and layout.tsx files (excluding root layout)
files = list(APP_DIR.rglob('page.tsx')) + list(APP_DIR.rglob('layout.tsx'))
files = [f for f in files if f.name == 'page.tsx' or (f.name == 'layout.tsx' and f.parent != APP_DIR)]

# Don't modify the home page — it has its own custom title
HOME_PAGE = APP_DIR / 'page.tsx'

total_replacements = 0
files_modified = 0

for filepath in files:
    if filepath == HOME_PAGE:
        continue
    if filepath.name == 'layout.tsx' and filepath.parent.name == 'account':
        # Account layout has its own title — skip (will handle manually if needed)
        pass

    content = filepath.read_text()
    original = content

    # Pattern: title: 'Something' OR title: "Something"
    # Add ' | Aura Living' suffix if not already present
    def add_suffix(match):
        prefix = match.group(1)  # ' or "
        title = match.group(2)
        # Skip if already has suffix
        if title.endswith(' | Aura Living'):
            return match.group(0)
        # Skip if it's the openGraph or twitter title (those are full titles)
        # We only want to modify the main `title:` field
        return f'title: {prefix}{title} | Aura Living{prefix}'

    # Only match the main title: field (not openGraph.title or twitter.title)
    # Pattern: line starts with `  title: '...'` or `  title: "..."`
    new_content = re.sub(
        r"^(\s+)title:\s*(['\"])([^'\"]*?)\2",
        lambda m: f"{m.group(1)}title: {m.group(2)}{m.group(3)} | Aura Living{m.group(2)}",
        content,
        flags=re.MULTILINE
    )

    if new_content != original:
        replacements = original.count("title: '") + original.count('title: "') - (new_content.count(" | Aura Living'") + new_content.count(' | Aura Living"'))
        # Only count actual changes
        old_titles = re.findall(r"^(\s+)title:\s*(['\"])([^'\"]*?)\2", original, re.MULTILINE)
        new_titles = re.findall(r"^(\s+)title:\s*(['\"])([^'\"]*?)\2", new_content, re.MULTILINE)
        changes = sum(1 for old, new in zip(old_titles, new_titles) if old[2] != new[2])
        filepath.write_text(new_content)
        files_modified += 1
        total_replacements += changes
        print(f"  {filepath.relative_to(APP_DIR)}: {changes} titles updated")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} titles updated.")
