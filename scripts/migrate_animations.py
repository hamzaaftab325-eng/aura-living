#!/usr/bin/env python3
"""
Migrate all files from legacy useGsap.ts imports to new useAnimations.ts + direct gsap imports.

Mapping:
  useGsapFadeIn    → useScrollReveal  (from @/hooks/useAnimations)
  useGsapBlurText  → useTextReveal    (from @/hooks/useAnimations)
  useGsapStagger   → useStaggerReveal (from @/hooks/useAnimations)
  useGsapScaleIn   → useScaleIn       (from @/hooks/useAnimations)
  useGsapCountUp   → useCountUp       (from @/hooks/useAnimations)
  gsap              → gsap             (from 'gsap')
  ScrollTrigger     → ScrollTrigger    (from 'gsap/ScrollTrigger')

Strategy:
  1. Parse each file's import from '@/hooks/useGsap'
  2. Split into: hooks (→ useAnimations) + gsap (→ 'gsap') + ScrollTrigger (→ 'gsap/ScrollTrigger')
  3. Replace old hook names with new names in the file body
  4. Replace old import with new imports
"""
import re
from pathlib import Path

SRC_DIR = Path('/home/z/my-project/src')

HOOK_MAP = {
    'useGsapFadeIn': 'useScrollReveal',
    'useGsapBlurText': 'useTextReveal',
    'useGsapStagger': 'useStaggerReveal',
    'useGsapScaleIn': 'useScaleIn',
    'useGsapCountUp': 'useCountUp',
}

total_files = 0
total_replacements = 0

for filepath in sorted(list(SRC_DIR.rglob('*.tsx')) + list(SRC_DIR.rglob('*.ts'))):
    content = filepath.read_text()
    
    if "from '@/hooks/useGsap'" not in content:
        continue
    
    original = content
    total_files += 1
    
    # 1. Extract what's imported from useGsap
    # Pattern: import { X, Y, Z } from '@/hooks/useGsap';
    import_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+'@/hooks/useGsap'", content)
    if not import_match:
        continue
    
    imports_str = import_match.group(1)
    
    # Parse individual imports
    imports = [s.strip() for s in imports_str.split(',')]
    imports = [s for s in imports if s]
    
    # Categorize
    hooks = [i for i in imports if i in HOOK_MAP]
    has_gsap = 'gsap' in imports
    has_scrolltrigger = 'ScrollTrigger' in imports
    
    # 2. Build new import lines
    new_imports = []
    
    if hooks:
        hook_names = ', '.join(HOOK_MAP[h] for h in hooks)
        new_imports.append(f"import {{ {hook_names} }} from '@/hooks/useAnimations';")
    
    if has_gsap:
        new_imports.append("import gsap from 'gsap';")
    
    if has_scrolltrigger:
        new_imports.append("import { ScrollTrigger } from 'gsap/ScrollTrigger';")
        if has_gsap:
            # gsap.registerPlugin needs to be called — add after imports
            pass
    
    new_import_str = '\n'.join(new_imports)
    
    # 3. Replace the old import line with new imports
    content = content.replace(import_match.group(0), new_import_str)
    
    # 4. Add gsap.registerPlugin if both gsap and ScrollTrigger are used
    if has_gsap and has_scrolltrigger:
        # Find the last import line
        lines = content.split('\n')
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import_idx = i
        lines.insert(last_import_idx + 1, '\ngsap.registerPlugin(ScrollTrigger);')
        content = '\n'.join(lines)
    
    # 5. Replace hook names in the file body
    for old_name, new_name in HOOK_MAP.items():
        content = content.replace(old_name, new_name)
    
    if content != original:
        filepath.write_text(content)
        total_replacements += 1
        print(f"  ✓ {filepath.name}")

print(f"\n✓ {total_replacements} files migrated (out of {total_files} total)")
