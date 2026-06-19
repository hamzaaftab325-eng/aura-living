#!/usr/bin/env python3
"""
Replace all hero h1 text-size Tailwind classes with the same inline
fontSize: clamp(28px, 6vw, 72px) used by the home page HeroSection.
Also add the same textShadow for consistency.
"""
import re
from pathlib import Path

FILES = [
    'src/components/SaleView.tsx',
    'src/components/ShopView.tsx',
    'src/components/ContactView.tsx',
    'src/components/AboutView.tsx',
    'src/components/TrackOrdersView.tsx',
    'src/components/SettingsView.tsx',
    'src/components/WishlistView.tsx',
    'src/components/CareGuideView.tsx',
    'src/components/AccountView.tsx',
    'src/components/NewArrivalsView.tsx',
    'src/components/CartView.tsx',
    'src/components/CheckoutView.tsx',
    'src/components/FAQView.tsx',
    'src/components/TermsView.tsx',
    'src/components/ShippingView.tsx',
    'src/components/ReturnsView.tsx',
    'src/components/PrivacyView.tsx',
    'src/components/LookbookView.tsx',
    'src/components/AddressesView.tsx',
]

# Pattern: match the className with text-[44px] sm:text-[56px] md:text-[72px] (or similar size variants)
# and remove those size classes. We'll then add fontSize via inline style.
SIZE_CLASS_PATTERN = re.compile(
    r'(text-white\s+)text-\[\d+px\]\s+sm:text-\[\d+px\]\s+md:text-\[\d+px\](\s+font-bold)'
)

def process_file(filepath):
    content = Path(filepath).read_text()
    original = content

    # Step 1: Remove the Tailwind size classes (text-[44px] sm:text-[56px] md:text-[72px])
    # Keep text-white and font-bold
    content = SIZE_CLASS_PATTERN.sub(r'\1font-bold', content)

    # Step 2: For h1 tags that have style={{ fontFamily: "'Playfair Display', serif" }}
    # add fontSize: 'clamp(28px, 6vw, 72px)' and textShadow to match home page
    # Pattern: <h1 ... style={{ fontFamily: "'Playfair Display', serif" }}>
    # Or: <h1 ... style={{ fontFamily: "'Playfair Display', serif", textShadow: '...' }}>

    # Add fontSize + textShadow to Playfair h1 styles that don't already have fontSize
    playfair_style_pattern = re.compile(
        r"style=\{\{ fontFamily: \"'Playfair Display', serif\"(, textShadow: '[^']+')? \}\}"
    )

    def add_font_size(match):
        text_shadow = match.group(1) or ", textShadow: '0 2px 30px rgba(0,0,0,0.5)'"
        return f"style={{{{ fontFamily: \"'Playfair Display', serif\", fontSize: 'clamp(28px, 6vw, 72px)'{text_shadow} }}}}"

    content = playfair_style_pattern.sub(add_font_size, content)

    # Also handle case where textShadow already exists with different value
    playfair_with_shadow_pattern = re.compile(
        r"style=\{\{ fontFamily: \"'Playfair Display', serif\", textShadow: '0 2px 30px rgba\(0,0,0,0\.4\)' \}\}"
    )
    content = playfair_with_shadow_pattern.sub(
        "style={{{ fontFamily: \"'Playfair Display', serif\", fontSize: 'clamp(28px, 6vw, 72px)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}}",
        content
    )

    if content != original:
        Path(filepath).write_text(content)
        return True
    return False


success = 0
failed = 0
for relpath in FILES:
    full = Path('/home/z/my-project') / relpath
    if not full.exists():
        print(f"  ✗ Missing: {relpath}")
        failed += 1
        continue
    if process_file(str(full)):
        print(f"  ✓ {relpath}")
        success += 1
    else:
        print(f"  ⚠ No changes: {relpath}")
        failed += 1

print(f"\n=== Done: {success} updated, {failed} not changed ===")
