#!/usr/bin/env python3
"""
Move breadcrumb nav from inside hero section to a separate strip below the hero.

Type A files (breadcrumb inside hero, white text) → convert to Type B
(breadcrumb strip below hero with dark text on cream bg).
"""
import re
from pathlib import Path

# Type A files that have breadcrumb INSIDE hero — need to be moved out
TYPE_A_FILES = [
    'src/components/ContactView.tsx',
    'src/components/ShopView.tsx',
    'src/components/SaleView.tsx',
    'src/components/CareGuideView.tsx',
    'src/components/NewArrivalsView.tsx',
    'src/components/WishlistView.tsx',
    'src/components/CartView.tsx',
    'src/components/AccountView.tsx',
    'src/components/CheckoutView.tsx',
    'src/components/TrackOrdersView.tsx',
    'src/components/AddressesView.tsx',
    'src/components/SettingsView.tsx',
]

def process_file(filepath):
    content = Path(filepath).read_text()
    original_content = content

    # Step 1: Find the breadcrumb block inside the hero.
    # Pattern matches: {/* Breadcrumb */} <nav...>...</nav>
    # The nav has either "justify-center gap-2 mb-X" or "gap-2 mb-X breadcrumb-animate"
    breadcrumb_pattern = re.compile(
        r'\n\s*\{/\* Breadcrumb \*/\}\s*\n\s*<nav[^>]*>(.*?)</nav>',
        re.DOTALL
    )

    match = breadcrumb_pattern.search(content)
    if not match:
        print(f"  ✗ No breadcrumb block found in {filepath}")
        return False

    breadcrumb_full = match.group(0)
    breadcrumb_inner = match.group(1)

    # Step 2: Determine the parent label and current page label from the breadcrumb content
    if 'My Account' in breadcrumb_inner:
        parent_label = 'My Account'
        parent_page_target = 'account'
    else:
        parent_label = 'Home'
        parent_page_target = 'home'

    # Current page label is in the last <span>...</span>
    span_match = re.search(r'<span[^>]*>([^<]+)</span>\s*$', breadcrumb_inner.strip())
    if span_match:
        current_label = span_match.group(1).strip()
    else:
        # Try finding any span
        spans = re.findall(r'<span[^>]*>([^<]+)</span>', breadcrumb_inner)
        current_label = spans[-1].strip() if spans else 'Current'

    print(f"  → Found breadcrumb: {parent_label} > {current_label}")

    # Step 3: Remove the breadcrumb block from the hero
    content = content[:match.start()] + content[match.end():]

    # Step 4: Find the first </section> after where the breadcrumb was — that's the hero's closing tag
    section_end_idx = content.find('</section>', match.start())
    if section_end_idx == -1:
        print(f"  ✗ No </section> found after breadcrumb in {filepath}")
        return False

    insert_pos = section_end_idx + len('</section>')

    # Step 5: Build the new breadcrumb strip (Type B style — below hero, dark on cream)
    new_strip = f"""

      <!-- Breadcrumb strip (below hero) -->
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{"backgroundColor": "#F5EDDA", "borderBottom": "1px solid #E8D5A3"}}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={{() => {{ setPage('{parent_page_target}'); window.scrollTo({{ top: 0, behavior: 'smooth' }}); }}}}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{"fontFamily": "'Poppins', sans-serif", "color": "#8A8A8A", "background": "none", "border": "none"}}
          >
            {parent_label}
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{"color": "#B8A99A"}} />
          <span className="text-sm font-medium" style={{"fontFamily": "'Poppins', sans-serif", "color": "#D4AF37"}}>
            {current_label}
          </span>
        </div>
      </div>"""

    content = content[:insert_pos] + new_strip + content[insert_pos:]

    # Step 6: Write back
    if content != original_content:
        Path(filepath).write_text(content)
        print(f"  ✓ Moved breadcrumb in {filepath}")
        return True
    else:
        print(f"  ⚠ No changes made to {filepath}")
        return False


success = 0
failed = 0
for relpath in TYPE_A_FILES:
    full = Path('/home/z/my-project') / relpath
    if not full.exists():
        print(f"  ✗ Missing: {relpath}")
        failed += 1
        continue
    print(f"\nProcessing {relpath}")
    if process_file(str(full)):
        success += 1
    else:
        failed += 1

print(f"\n=== Done: {success} moved, {failed} failed ===")
