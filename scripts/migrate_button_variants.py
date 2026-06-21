#!/usr/bin/env python3
"""
Bulk migrate PremiumButton variants to the new 3-class system.

- variant="gold"    → variant="primary"
- variant="outline" → variant="secondary"
- variant="dark"    → variant="secondary" (deprecated)

Also updates NewsletterSection to use variant="newsletter".
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src')

# Files to skip (already manually updated)
SKIP_FILES = {
    'CartDrawer.tsx',
    'CartView.tsx',
}

total_replacements = 0
files_modified = 0

for filepath in sorted(SRC_DIR.rglob('*.tsx')):
    if filepath.name in SKIP_FILES:
        continue

    content = filepath.read_text()
    original = content

    # variant="gold" → variant="primary"
    content = re.sub(
        r'variant=("|\')gold\1',
        r'variant=\1primary\1',
        content
    )
    # variant="outline" → variant="secondary"
    content = re.sub(
        r'variant=("|\')outline\1',
        r'variant=\1secondary\1',
        content
    )
    # variant="dark" → variant="secondary" (deprecated)
    content = re.sub(
        r'variant=("|\')dark\1',
        r'variant=\1secondary\1',
        content
    )

    if content != original:
        # Count changes
        gold_count = original.count('variant="gold"') + original.count("variant='gold'")
        outline_count = original.count('variant="outline"') + original.count("variant='outline'")
        dark_count = original.count('variant="dark"') + original.count("variant='dark'")
        changes = gold_count + outline_count + dark_count
        filepath.write_text(content)
        files_modified += 1
        total_replacements += changes
        rel = filepath.relative_to(SRC_DIR)
        print(f"  {rel}: {changes} variants updated (gold={gold_count}, outline={outline_count}, dark={dark_count})")

print(f"\n✓ Done. {files_modified} files modified, {total_replacements} variant replacements.")

# Now handle NewsletterSection specially
newsletter_file = SRC_DIR / 'components' / 'NewsletterSection.tsx'
if newsletter_file.exists():
    content = newsletter_file.read_text()
    # Change variant="primary" to variant="newsletter" in newsletter form
    new_content = content.replace(
        'variant="primary" fullWidth type="submit"',
        'variant="newsletter" fullWidth type="submit"'
    )
    if new_content != content:
        newsletter_file.write_text(new_content)
        print(f"\n✓ NewsletterSection.tsx: changed submit button to variant='newsletter'")
