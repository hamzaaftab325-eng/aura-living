#!/usr/bin/env python3
"""
Bulk migrate view components from SPA routing (setPage) to Next.js App Router.

For each .tsx file in src/components/:
1. Add `import Link from 'next/link';` and `import { useRouter } from 'next/navigation';` if missing
2. Add `const router = useRouter();` inside the component if setPage is used
3. Replace `setPage('shop')` with `router.push('/shop')` etc.
4. Replace `setPage('product'); setSelectedProduct(product);` patterns with `router.push('/product/' + product.slug)`
5. Remove `setPage`, `setSelectedProduct`, `setSelectedCategory`, `setSearchQuery`, `setSelectedArticleSlug` from useStore destructure
6. Remove `currentPage`, `selectedProduct`, `selectedCategory`, `searchQuery`, `selectedArticleSlug` from useStore destructure

Special cases (handled manually after script):
- ProductDetailView: receives `product` as prop
- ArticleView: receives `article` as prop
- AuthView: receives `mode` as prop
- ShopView: uses useSearchParams
"""
import re
from pathlib import Path

COMPONENTS_DIR = Path('/home/z/my-project/src/components')

# Route mapping
ROUTE_MAP = {
    'home': '/',
    'shop': '/shop',
    'cart': '/cart',
    'checkout': '/checkout',
    'wishlist': '/wishlist',
    'account': '/account',
    'about': '/about',
    'contact': '/contact',
    'faq': '/faq',
    'shipping': '/shipping',
    'returns': '/returns',
    'care-guide': '/care-guide',
    'new-arrivals': '/new-arrivals',
    'sale': '/sale',
    'lookbook': '/lookbook',
    'terms': '/terms',
    'privacy': '/privacy',
    'forgot-password': '/auth/forgot-password',
    'track-orders': '/account/orders',
    'addresses': '/account/addresses',
    'settings': '/account/settings',
    'admin': '/admin',
    'login': '/auth/login',
    'signup': '/auth/signup',
    'blog': '/blog',
}

# Skip these — they have special handling
SKIP_FILES = {
    'ProductDetailView.tsx',
    'ArticleView.tsx',
    'AuthView.tsx',
    'ShopView.tsx',
    'BlogView.tsx',  # has selectedArticleSlug
}

def needs_router_push(content: str) -> bool:
    """Check if file contains setPage calls."""
    return bool(re.search(r'setPage\(', content))

def add_imports(content: str) -> str:
    """Add Link + useRouter imports if needed."""
    needs_link = needs_router_push(content) or 'setSelectedProduct' in content or 'setSelectedCategory' in content
    needs_router = needs_router_push(content) or 'setSelectedProduct' in content

    if not (needs_link or needs_router):
        return content

    # Find the last import line
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import ') or line.startswith("import '"):
            last_import_idx = i

    new_imports = []
    if needs_link and "from 'next/link'" not in content:
        new_imports.append("import Link from 'next/link';")
    if needs_router and "from 'next/navigation'" not in content:
        new_imports.append("import { useRouter } from 'next/navigation';")

    if new_imports:
        lines.insert(last_import_idx + 1, '\n'.join(new_imports))

    return '\n'.join(lines)

def add_router_hook(content: str) -> str:
    """Add `const router = useRouter();` after the useStore line if not present."""
    if 'useRouter()' not in content and 'useRouter ' not in content:
        # Find the useStore line and add router right after
        # Pattern: const { ... } = useStore(...);
        pattern = r'(const\s+\{[^}]+\}\s*=\s*useStore(?:\([^)]*\))?\s*;)'
        match = re.search(pattern, content)
        if match:
            content = content[:match.end()] + '\n  const router = useRouter();' + content[match.end():]
    return content

def replace_setpage_calls(content: str) -> str:
    """Replace setPage('route') with router.push('/route')."""
    for spa_route, real_route in ROUTE_MAP.items():
        # setPage('route')
        content = re.sub(
            rf"setPage\('{spa_route}'\)",
            f"router.push('{real_route}')",
            content
        )
        # setPage("route")
        content = re.sub(
            rf'setPage\("{spa_route}"\)',
            f"router.push('{real_route}')",
            content
        )
    return content

def replace_product_nav(content: str) -> str:
    """Replace setSelectedProduct(p) + setPage('product') patterns with router.push('/product/' + p.slug)."""
    # Pattern 1: setSelectedProduct(product); setPage('product');
    content = re.sub(
        r"setSelectedProduct\((\w+)\);\s*\n?\s*setPage\('product'\);?",
        r"router.push('/product/' + \1.slug);",
        content
    )
    # Pattern 2: setSelectedProduct(p); setPage('product'); window.scrollTo(...)
    content = re.sub(
        r"setSelectedProduct\((\w+)\);\s*\n?\s*setPage\('product'\);\s*\n?\s*window\.scrollTo\(\{[^}]+\}\);?",
        r"router.push('/product/' + \1.slug);",
        content
    )
    # Pattern 3: just setSelectedProduct(p) — leave it, will be cleaned up
    return content

def clean_usestore_destructure(content: str) -> str:
    """Remove obsolete fields from useStore destructure."""
    obsolete = ['setPage', 'setSelectedProduct', 'setSelectedCategory', 'setSearchQuery', 'setSelectedArticleSlug', 'currentPage', 'selectedProduct', 'selectedCategory', 'searchQuery', 'selectedArticleSlug']

    # Find useStore destructure: const { ... } = useStore(...);
    pattern = r'(const\s+\{)([^}]+)(\}\s*=\s*useStore(?:\([^)]*\))?\s*;)'

    def clean_match(m):
        prefix, fields, suffix = m.groups()
        # Split fields by comma, strip whitespace
        field_list = [f.strip() for f in fields.split(',') if f.strip()]
        # Remove obsolete fields
        cleaned = [f for f in field_list if f not in obsolete and not any(f.startswith(ob + ':') for ob in obsolete)]
        if not cleaned:
            # All fields removed — replace with empty destructure (will be fixed manually)
            return f'// useStore removed — no fields needed'
        return f"{prefix} {', '.join(cleaned)} {suffix}"

    return re.sub(pattern, clean_match, content)

def process_file(filepath: Path) -> tuple[int, int]:
    """Process a single file. Returns (setpage_replaced, fields_removed)."""
    if filepath.name in SKIP_FILES:
        return (0, 0)

    content = filepath.read_text()
    original = content

    setpage_count = len(re.findall(r"setPage\(", content))

    content = add_imports(content)
    content = add_router_hook(content)
    content = replace_setpage_calls(content)
    content = replace_product_nav(content)
    content = clean_usestore_destructure(content)

    if content != original:
        filepath.write_text(content)

    return (setpage_count, 0)

def main():
    total_files = 0
    total_setpage = 0
    for filepath in sorted(COMPONENTS_DIR.glob('*.tsx')):
        if filepath.name in SKIP_FILES:
            continue
        sp, _ = process_file(filepath)
        if sp > 0:
            total_files += 1
            total_setpage += sp
            print(f"  {filepath.name}: {sp} setPage calls replaced")

    print(f"\n✓ Done. {total_files} files modified, {total_setpage} setPage calls replaced.")
    print(f"\nSkipped (handle manually): {sorted(SKIP_FILES)}")

if __name__ == '__main__':
    main()
