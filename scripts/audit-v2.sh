#!/bin/bash
# Page-by-page audit. Strategy:
# 1. Start fresh on home.
# 2. For each page, scroll to top, snapshot, find the right ref, click it, take screenshot, capture console+errors.
# 3. If an overlay opens accidentally, press Escape to dismiss.
set -u

mkdir -p /home/z/my-project/download/audit

function snapshot() {
  agent-browser snapshot -i 2>&1
}

function dismiss_overlays() {
  for i in 1 2 3; do
    agent-browser press Escape 2>&1 > /dev/null
    sleep 0.3
  done
}

function get_h1() {
  agent-browser eval "document.querySelector('h1')?.textContent?.trim() || 'NO H1'" 2>&1 | tail -1
}

function test_page_via_nav() {
  local label="$1"
  local nav_text="$2"   # text of button to click
  echo "===== TEST: $label ====="
  agent-browser scroll up 99999 2>&1 > /dev/null
  sleep 0.5
  dismiss_overlays
  # Find and click the nav button by text
  agent-browser find role button click --name "$nav_text" 2>&1 | tail -2
  sleep 2
  echo "  H1: $(get_h1)"
  agent-browser screenshot /home/z/my-project/download/audit/page-${label}.png 2>&1 | tail -1
  echo "  Errors: $(agent-browser errors 2>&1 | tail -5 | tr '\n' '|')"
  echo "  Console: $(agent-browser console 2>&1 | grep -v 'Fast Refresh\|HMR' | tail -5 | tr '\n' '|')"
  echo ""
}

# Start fresh
agent-browser open http://localhost:3000 2>&1 > /dev/null
agent-browser wait --load networkidle 2>&1 > /dev/null
sleep 2

# Top-level nav pages
test_page_via_nav "shop" "Shop"
test_page_via_nav "about" "About"
test_page_via_nav "contact" "Contact"
test_page_via_nav "home" "Home"

# Action icons — snapshot first to find their refs
echo "===== Finding action icon refs ====="
agent-browser scroll up 99999 2>&1 > /dev/null
sleep 0.5
snapshot | head -15

echo ""
echo "===== TEST: wishlist (via icon) ====="
agent-browser find role button click --name "Wishlist" 2>&1 | tail -1
sleep 2
echo "  H1: $(get_h1)"
agent-browser screenshot /home/z/my-project/download/audit/page-wishlist.png 2>&1 | tail -1
echo ""

echo "===== TEST: account (via icon) ====="
agent-browser find role button click --name "Account" 2>&1 | tail -1
sleep 2
echo "  H1: $(get_h1)"
agent-browser screenshot /home/z/my-project/download/audit/page-account.png 2>&1 | tail -1
echo ""

echo "===== TEST: cart drawer (via icon) ====="
agent-browser find role button click --name "Cart" 2>&1 | tail -1
sleep 2
echo "  Dialog title: $(agent-browser eval "document.querySelector('[role=dialog] h2, [role=dialog] h3, [class*=drawer] h2, [class*=drawer] h3')?.textContent?.trim() || 'no dialog'" 2>&1 | tail -1)"
agent-browser screenshot /home/z/my-project/download/audit/page-cart-drawer.png 2>&1 | tail -1
dismiss_overlays
echo ""

echo "===== TEST: search modal (via icon) ====="
agent-browser find role button click --name "Search" 2>&1 | tail -1
sleep 2
echo "  Search input visible: $(agent-browser eval "!!document.querySelector('input[placeholder*=Search], input[type=text], input[type=search]')" 2>&1 | tail -1)"
agent-browser screenshot /home/z/my-project/download/audit/page-search-modal.png 2>&1 | tail -1
dismiss_overlays
echo ""

# Now navigate to shop and click a product
echo "===== TEST: product detail (via Shop → first product) ====="
agent-browser find role button click --name "Shop" 2>&1 | tail -1
sleep 2
agent-browser scroll down 300 2>&1 > /dev/null
sleep 1
# Click the first product card via "Quick view" button (visible on hover, but works)
agent-browser find role button click --name "Quick view" 2>&1 | tail -1
sleep 2
echo "  H1: $(get_h1)"
agent-browser screenshot /home/z/my-project/download/audit/page-product.png 2>&1 | tail -1
echo "  Errors: $(agent-browser errors 2>&1 | tail -5 | tr '\n' '|')"
echo ""

# Footer links — go to home, scroll to footer, click each footer link
echo "===== TEST: footer-driven pages (FAQ, Shipping, Returns, etc.) ====="
agent-browser open http://localhost:3000 2>&1 > /dev/null
agent-browser wait --load networkidle 2>&1 > /dev/null
sleep 2
agent-browser scroll down 99999 2>&1 > /dev/null
sleep 1

# Find all footer buttons
echo "--- Footer button inventory ---"
agent-browser eval "Array.from(document.querySelectorAll('footer button, footer a')).map(b => b.textContent.trim()).filter(t => t).slice(0, 30)" 2>&1 | tail -5
echo ""

# Click each footer link target one by one
for link in "FAQ" "Shipping" "Returns" "Care Guide" "New Arrivals" "Sale" "Lookbook" "Terms" "Privacy" "Sign In" "Forgot Password"; do
  echo "--- Click: $link ---"
  agent-browser scroll down 99999 2>&1 > /dev/null
  sleep 0.3
  agent-browser find role button click --name "$link" 2>&1 | tail -1
  sleep 1.5
  echo "  H1: $(get_h1)"
  safe_name=$(echo "$link" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  agent-browser screenshot /home/z/my-project/download/audit/page-${safe_name}.png 2>&1 | tail -1
  echo "  Errors: $(agent-browser errors 2>&1 | tail -3 | tr '\n' '|')"
  echo ""
done

# Final summary
echo "===== AUDIT COMPLETE — screenshots saved to /home/z/my-project/download/audit/ ====="
ls -la /home/z/my-project/download/audit/ | head -40
