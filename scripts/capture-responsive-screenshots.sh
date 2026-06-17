#!/bin/bash
# Capture screenshots at 5 breakpoints for key views.
# Breakpoints: 320 (iPhone SE 1st gen), 375 (iPhone 14), 768 (iPad portrait), 1024 (small laptop), 1440 (desktop)
set -u

mkdir -p /home/z/my-project/download/responsive

BREAKPOINTS=(320 375 768 1024 1440)

# Pages to capture — navigated via UI where possible, fallback to JS click
declare -A PAGE_LABELS=(
  [home]="Home"
  [shop]="Shop"
  [about]="About"
  [contact]="Contact"
  [wishlist]="Wishlist"
  [account]="Account"
)

capture_page_at_breakpoint() {
  local page="$1"
  local label="$2"
  local bp="$3"

  agent-browser set viewport "$bp" 900 2>&1 > /dev/null

  # Navigate via nav button if it's a top-level page
  if [ -n "$label" ]; then
    agent-browser find role button click --name "$label" 2>&1 > /dev/null
    sleep 2
  fi

  # Wait for network idle + animations
  agent-browser wait --load networkidle 2>&1 > /dev/null
  sleep 2

  # Take full-page screenshot
  local out="/home/z/my-project/download/responsive/${page}-${bp}.png"
  agent-browser screenshot "$out" --full 2>&1 > /dev/null
  echo "  Captured ${page} @ ${bp}px -> $(basename $out)"
}

# First navigate to home
agent-browser open http://localhost:3000 2>&1 > /dev/null
agent-browser wait --load networkidle 2>&1 > /dev/null
sleep 3

# Capture Home at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "home" "Home" "$bp"
done

# Capture Shop at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "shop" "Shop" "$bp"
done

# Capture About at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "about" "About" "$bp"
done

# Capture Contact at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "contact" "Contact" "$bp"
done

# Capture Wishlist at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "wishlist" "Wishlist" "$bp"
done

# Capture Account at all breakpoints
for bp in "${BREAKPOINTS[@]}"; do
  capture_page_at_breakpoint "account" "Account" "$bp"
done

# Reset viewport
agent-browser set viewport 1440 900 2>&1 > /dev/null

# Now capture some specific mobile-only states
echo ""
echo "=== Mobile-specific states (375px) ==="
agent-browser set viewport 375 900 2>&1 > /dev/null

# Navigate to home first
agent-browser open http://localhost:3000 2>&1 > /dev/null
sleep 2

# Open mobile menu
agent-browser scroll up 99999 2>&1 > /dev/null
sleep 1
agent-browser eval "
  (function(){
    const btns = Array.from(document.querySelectorAll('button[aria-label]'));
    const menu = btns.find(b => b.getAttribute('aria-label').toLowerCase().includes('menu'));
    if (menu) { menu.click(); return 'menu opened'; }
    return 'no menu button';
  })()
" 2>&1 > /dev/null
sleep 2
agent-browser screenshot "/home/z/my-project/download/responsive/mobile-menu-open-375.png" 2>&1 > /dev/null
echo "  Captured mobile-menu-open @ 375px"
agent-browser press Escape 2>&1 > /dev/null
sleep 1

# Open cart drawer
agent-browser eval "
  (function(){
    const btns = Array.from(document.querySelectorAll('button[aria-label]'));
    const cart = btns.find(b => b.getAttribute('aria-label').toLowerCase().includes('cart'));
    if (cart) { cart.click(); return 'cart opened'; }
    return 'no cart';
  })()
" 2>&1 > /dev/null
sleep 2
agent-browser screenshot "/home/z/my-project/download/responsive/mobile-cart-drawer-375.png" 2>&1 > /dev/null
echo "  Captured mobile-cart-drawer @ 375px"
agent-browser press Escape 2>&1 > /dev/null
sleep 1

# Open search modal
agent-browser eval "
  (function(){
    const btns = Array.from(document.querySelectorAll('button[aria-label]'));
    const search = btns.find(b => b.getAttribute('aria-label').toLowerCase().includes('search'));
    if (search) { search.click(); return 'search opened'; }
    return 'no search';
  })()
" 2>&1 > /dev/null
sleep 2
agent-browser screenshot "/home/z/my-project/download/responsive/mobile-search-modal-375.png" 2>&1 > /dev/null
echo "  Captured mobile-search-modal @ 375px"
agent-browser press Escape 2>&1 > /dev/null
sleep 1

# Reset
agent-browser set viewport 1440 900 2>&1 > /dev/null

echo ""
echo "=== Done. Files in /home/z/my-project/download/responsive/ ==="
ls -la /home/z/my-project/download/responsive/ | head -40
