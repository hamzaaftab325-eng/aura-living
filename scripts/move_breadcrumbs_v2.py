#!/usr/bin/env python3
"""
Move breadcrumb from inside hero to a strip below the hero.
Generates valid JSX (no JSON-style object keys).
"""
import re
from pathlib import Path

# Type A files - breadcrumb inside hero
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
]


def make_below_breadcrumb(parent_label, current_label, parent_page_target):
    """Generate VALID JSX for the below-hero breadcrumb strip."""
    return f'''
      <!-- Breadcrumb strip (below hero) -->
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{{{ backgroundColor: '#F5EDDA', borderBottom: '1px solid #E8D5A3' }}}}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={{() => {{ setPage('{parent_page_target}'); window.scrollTo({{ top: 0, behavior: 'smooth' }}); }}}}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{{{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}}}
          >
            {parent_label}
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{{{ color: '#B8A99A' }}}} />
          <span className="text-sm font-medium" style={{{{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}}}>
            {current_label}
          </span>
        </div>
      </div>'''


def process_file(filepath):
    content = Path(filepath).read_text()
    original = content

    # Pattern 1: {/* Breadcrumb */} comment + <nav>...</nav>
    pat1 = re.compile(
        r'\n\s*\{/\* Breadcrumb \*/\}\s*\n\s*<nav[^>]*>(.*?)</nav>',
        re.DOTALL
    )
    # Pattern 2: <nav className="flex items-center justify-center gap-2 mb-X">...</nav> (ContactView, CartView)
    pat2 = re.compile(
        r'\n\s*<nav\s+className="flex items-center justify-center gap-2 mb-\d+"[^>]*>(.*?)</nav>',
        re.DOTALL
    )

    match = pat1.search(content) or pat2.search(content)
    if not match:
        print(f"  ✗ No breadcrumb found in {filepath}")
        return False

    breadcrumb_inner = match.group(1)

    # Determine parent
    if 'My Account' in breadcrumb_inner:
        parent_label = 'My Account'
        parent_page = 'account'
    else:
        parent_label = 'Home'
        parent_page = 'home'

    # Determine current page label
    spans = re.findall(r'<span[^>]*>([^<]+)</span>', breadcrumb_inner)
    current_label = spans[-1].strip() if spans else 'Current'

    # Special case for AccountView (breadcrumb shows "My Account" as current page; parent should be Home)
    if filepath.endswith('AccountView.tsx'):
        parent_label = 'Home'
        parent_page = 'home'
        current_label = 'My Account'

    # Special case for CheckoutView (breadcrumb shows Cart > Checkout)
    if filepath.endswith('CheckoutView.tsx'):
        # Check if breadcrumb has Cart as parent
        if 'Cart' in breadcrumb_inner:
            parent_label = 'Cart'
            parent_page = 'cart'
            current_label = 'Checkout'

    print(f"  → {parent_label} > {current_label}")

    # Remove the breadcrumb block
    content = content[:match.start()] + content[match.end():]

    # Find first </section> after where breadcrumb was
    section_end_idx = content.find('</section>', match.start())
    if section_end_idx == -1:
        print(f"  ✗ No </section> found after breadcrumb in {filepath}")
        return False

    insert_pos = section_end_idx + len('</section>')

    # Insert the new breadcrumb strip
    new_strip = make_below_breadcrumb(parent_label, current_label, parent_page)
    content = content[:insert_pos] + new_strip + content[insert_pos:]

    if content != original:
        Path(filepath).write_text(content)
        print(f"  ✓ Moved breadcrumb in {filepath}")
        return True
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
