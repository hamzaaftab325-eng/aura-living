# Aura Living — Full Frontend→Backend Integration Plan

> **Created**: 2026-06-23
> **Goal**: Remove ALL mock data, fix ALL bugs, wire frontend to backend completely
> **Approach**: Fix critical bugs first → delete dead code → migrate components → build missing APIs → design audit

---

## 🔴 Phase A: Critical Bug Fixes (Do First)

### A1. Coupon code dropped at checkout
- **Bug**: `CheckoutView.tsx` doesn't send `couponCode` to `/api/checkout` — user sees discount in cart but pays full price
- **Fix**: Pass `couponCode` state from CartDrawer/CartView to CheckoutView, include in API payload
- **Files**: `CheckoutView.tsx`, `CartDrawer.tsx`, `CartView.tsx`

### A2. Shipping threshold mismatch
- **Bug**: Cart UI says free shipping at Rs. 2,999; server uses Rs. 10,000
- **Fix**: Replace hardcoded `2999` with `FREE_SHIPPING_THRESHOLD` from `@/lib/shipping.ts` (Rs. 10,000)
- **Files**: `CartView.tsx:42`, `CartDrawer.tsx:45`, `CheckoutView.tsx:141`

### A3. WishlistView broken for logged-in users
- **Bug**: DB product IDs are Prisma UUIDs, but WishlistView looks up mock array by string ID
- **Fix**: Fetch from `/api/wishlist` for logged-in users, fall back to localStorage for guests
- **Files**: `WishlistView.tsx`

---

## 🟠 Phase B: Delete Dead Code

### B1. Delete unused components
- `components/AdminDashboard.tsx` (649 lines of mock data — replaced by AdminDashboardClient)
- `components/pages/index.ts` (unused barrel file)

### B2. Delete dead mock constants
- `mockOrders` in `AccountView.tsx:46-74`
- `trackedOrders` in `TrackOrdersView.tsx:58-101`
- `initialAddresses` in `AddressesView.tsx:53-76`

### B3. Delete legacy hash-redirect logic
- `SiteShell.tsx:39-96` — 60 lines of SPA→App Router redirect code that depends on mock data
- This drags `@/data/products` and `@/data/articles` into every page's client bundle

---

## 🟡 Phase C: Migrate Components to DB

### C1. Homepage sections (convert to server components)
- `FeaturedProducts.tsx` → use `getFeaturedProducts(4)` 
- `CategoriesSection.tsx` → use `getCategories()`
- Make pages pass DB data as props (like ShopView pattern)

### C2. Sale + New Arrivals pages
- `app/(shop)/sale/page.tsx` → fetch `getSaleProducts(12)`, pass to SaleView
- `app/(shop)/new-arrivals/page.tsx` → fetch `getNewArrivals(12)`, pass to NewArrivalsView

### C3. WishlistView → DB-backed
- Fetch from `/api/wishlist` for logged-in users
- Use localStorage for guests
- Sync on login (already have `/api/wishlist/merge`)

### C4. Navbar search
- Replace client-side mock search with `/api/products/search?q=…` endpoint
- OR pre-build a slim search index at build time

### C5. Unify formatPKR
- Replace all `formatPKR` imports from `@/data/products` with `@/lib/currency-display`
- Update call sites from rupee-number to paisa-BigInt (or keep rupees in FrontendProduct)

---

## 🔵 Phase D: Build Missing APIs

### D1. Reviews system
- Create Prisma `Review` model (id, productId, userId, rating, title, body, createdAt, isApproved)
- Create `/api/reviews` POST (create review) + GET (list reviews for product)
- Rewrite `ReviewForm.tsx` to call API
- Rewrite `ReviewList.tsx` to fetch from API

### D2. Contact form
- Create `/api/contact` POST route
- Save to DB `ContactMessage` table + email notification
- Rewrite `ContactView.tsx` to call API

### D3. Footer newsletter
- Wire `Footer.tsx` handleSubscribe to `POST /api/newsletter`

### D4. Account deletion
- Implement `SettingsView.tsx` handleDeleteAccount via Better Auth

### D5. Product search API
- Create `/api/products/search?q=…` endpoint
- Used by Navbar search

---

## 🟢 Phase E: Type Cleanup

### E1. Unify Product type
- Use `FrontendProduct` from `@/lib/products` everywhere
- Remove duplicate `Product` from `@/types/product.ts`

### E2. Unify Article type
- Keep in `@/types/blog.ts` only
- Remove from `@/data/articles.ts`

### E3. Remove unused types
- Delete `@/types/review.ts` (zero importers) OR dedupe

---

## 🟣 Phase F: Design Audit + Improvements

### F1. Design system audit
- Review all 155 design tokens
- Check spacing consistency
- Verify color contrast (WCAG AA)
- Audit typography scale

### F2. Component design improvements
- Product cards: hover effects, quick-add button
- Cart drawer: free shipping progress bar
- Checkout: multi-step indicator
- Admin dashboard: charts/graphs
- Account: order timeline visual

### F3. Mobile responsiveness audit
- Test all pages on mobile
- Fix any layout issues
- Touch-friendly buttons

### F4. Performance audit
- Lighthouse score target: 90+
- Image optimization (Cloudinary auto-format)
- Bundle size analysis
- Lazy load below-fold content

---

## Execution Order

1. **Phase A** (critical bugs) — 30 min
2. **Phase B** (delete dead code) — 20 min
3. **Phase C** (migrate to DB) — 1 hour
4. **Phase D** (missing APIs) — 1 hour
5. **Phase E** (type cleanup) — 20 min
6. **Phase F** (design audit) — ongoing

Total estimated: 3-4 hours of focused work
