#!/bin/bash
# Walk every SPA page via direct Zustand store access, capture console + errors + screenshot.
# We expose the store via the Navbar component (it uses useStore).

set -u

mkdir -p /home/z/my-project/download/audit

# Inject a global hook that grabs the Zustand store the first time any component uses it.
# We do this by patching the import — easier: just click nav buttons + use eval for the rest.

PAGES=(
  "home"
  "shop"
  "product"
  "cart"
  "checkout"
  "wishlist"
  "account"
  "about"
  "contact"
  "faq"
  "shipping"
  "returns"
  "care-guide"
  "new-arrivals"
  "sale"
  "lookbook"
  "terms"
  "privacy"
  "login"
  "forgot-password"
)

for page in "${PAGES[@]}"; do
  echo "===== TEST: $page ====="
  # Inject a small script that finds the zustand store from React fiber and calls setPage
  # Simpler approach: many nav links exist on the homepage. Just dispatch clicks.
  # Easiest: use eval to call the store via React fiber tree.
  agent-browser eval "
    (function(){
      try {
        // Find any DOM element with a React fiber, walk up to find the store
        const root = document.getElementById('__next') || document.querySelector('main') || document.body;
        let fiber = root[Object.keys(root).find(k => k.startsWith('__reactContainer')) || '__reactFiber$' + ''];
        if (!fiber) {
          // Try alternate fiber key
          for (const k of Object.keys(root)) {
            if (k.startsWith('__reactFiber') || k.startsWith('__reactContainer')) {
              fiber = root[k]; break;
            }
          }
        }
        if (!fiber) return 'no fiber';

        // Walk fiber tree to find a hook that has setPage
        function walk(node, depth) {
          if (!node || depth > 200) return null;
          let memo = node.memoizedState;
          while (memo) {
            if (memo.memoizedState && typeof memo.memoizedState === 'object' && memo.memoizedState && memo.memoizedState.setPage) {
              return memo.memoizedState;
            }
            if (memo.memoizedState && typeof memo.memoizedState === 'function') {
              // zustand hook returns the store.getState() snapshot, not the store itself
            }
            memo = memo.next;
          }
          const found = walk(node.child, depth+1) || walk(node.sibling, depth+1);
          return found;
        }
        const store = walk(fiber, 0);
        if (!store) return 'store not found in fiber tree';
        store.setPage('$page');
        return 'navigated to $page';
      } catch(e) { return 'err: ' + e.message + ' // ' + e.stack; }
    })()
  " 2>&1 | tail -5

  sleep 2
  echo "--- Console ---"
  agent-browser console 2>&1 | tail -8
  echo "--- Errors ---"
  agent-browser errors 2>&1 | tail -8
  agent-browser screenshot /home/z/my-project/download/audit/page-${page}.png 2>&1 | tail -1
  echo ""
done
