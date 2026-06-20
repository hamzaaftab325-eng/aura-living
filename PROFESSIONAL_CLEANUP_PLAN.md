# Professional Code Cleanup Plan — 736 → 0 Inline Styles

> **Created**: 2026-06-21
> **Goal**: Transform from AI-generated prototype to professional production-grade codebase
> **Target Rating**: 9/10 (from current 5.5/10)
> **Rule**: If inline styles cause issues, delete the file and recreate it with professional code

---

## 📊 EXACT CURRENT STATE (Audited 2026-06-21)

### Total: 736 inline `style={{}}` blocks

| Category | Count | Can Eliminate? | Strategy |
|---|---|---|---|
| **Simple static** (backgroundColor, color, border, padding) | **452** | ✅ YES | Create utility classes + migrate |
| **Conditional** (ternary `? :` based on state) | **86** | ✅ YES | Convert to conditional `className` |
| **rgba/opacity values** (semi-transparent colors) | **188** | ✅ YES (most) | Create tint utility classes |
| **Gradients** (linear-gradient, radial-gradient) | **36** | ✅ YES | Create gradient utility classes |
| **Dynamic** (template literals with `${variable}`) | **7** | ❌ NO | Legitimate — keep as inline style |
| **Total** | **736** | **729 eliminable** | **7 remain (dynamic values)** |

### Top 15 Files (548 of 736 = 75% of all inline styles)

| Rank | File | Count | Action |
|---|---|---|---|
| 1 | Navbar.tsx | 62 | Rewrite into 4 sub-components |
| 2 | CartDrawer.tsx | 35 | Migrate to utility classes |
| 3 | AdminDashboard.tsx | 31 | Rewrite into 7 sub-components |
| 4 | AddressesView.tsx | 31 | Migrate to utility classes |
| 5 | ReturnsView.tsx | 30 | Migrate to utility classes |
| 6 | SaleView.tsx | 29 | Migrate to utility classes |
| 7 | ShopView.tsx | 28 | Migrate + extract ProductCard |
| 8 | SettingsView.tsx | 27 | Migrate to utility classes |
| 9 | AboutView.tsx | 24 | Rewrite into 5 sub-components |
| 10 | CheckoutView.tsx | 23 | Migrate to utility classes |
| 11 | ShippingView.tsx | 22 | Migrate to utility classes |
| 12 | Footer.tsx | 22 | Migrate to utility classes |
| 13 | BlogView.tsx | 21 | Migrate to utility classes |
| 14 | ContactView.tsx | 20 | Migrate to utility classes |
| 15 | AuthView.tsx | 20 | Migrate to utility classes |

### Remaining 188 inline styles (in smaller files)

| File | Count |
|---|---|
| ProductDetailView.tsx | 18 |
| LookbookView.tsx | 15 |
| TrackOrdersView.tsx | 15 |
| ArticleView.tsx | 14 |
| FAQView.tsx | 12 |
| NewsletterSection.tsx | 12 |
| AccountView.tsx | 11 |
| CareGuideView.tsx | 10 |
| NewArrivalsView.tsx | 10 |
| PrivacyView.tsx | 9 |
| TermsView.tsx | 8 |
| FeaturedProducts.tsx | 7 |
| WishlistView.tsx | 7 |
| ForgotPasswordView.tsx | 6 |
| UI components (Input, Select, etc.) | 15 |
| Other small files | 10 |

---

## 🏗️ THE 4-PHASE EXECUTION PLAN

### Phase A: GSAP Animation System (1.5 hours)

**Goal**: Replace scattered GSAP code with clean, reusable hooks

#### A.1: Install dependencies
```bash
npm install @gsap/react canvas-confetti @types/canvas-confetti
```

#### A.2: Create `src/hooks/useAnimations.ts`

7 reusable animation hooks:

| Hook | Purpose | Replaces |
|---|---|---|
| `useScrollReveal()` | Fade + slide up on scroll | useGsapFadeIn |
| `useTextReveal()` | Word-by-word blur reveal | useGsapBlurText |
| `useParallax()` | Background parallax | Inline useEffect GSAP |
| `useStaggerReveal()` | Grid items reveal one by one | useGsapStagger |
| `useScaleIn()` | Scale from 0.9 to 1 | useGsapScaleIn |
| `useCountUp()` | Number count-up animation | Inline useEffect GSAP |
| `useMagnetic()` | Button follows cursor | Not yet implemented |

Each hook:
- Uses `useGSAP()` from `@gsap/react` (official, auto-cleanup)
- Respects `prefers-reduced-motion`
- Has JSDoc documentation
- Is fully typed

#### A.3: Build SaveButton with GSAP

Rebuild the SaveButton you shared using GSAP instead of framer-motion:
- Idle → Saving → Saved states
- GSAP timeline for bounce + scale
- GSAP sparkle animation
- canvas-confetti for confetti burst
- Text blur reveal on state change

#### A.4: Migrate existing components to new hooks

Replace all `useGsapFadeIn`, `useGsapStagger`, `useGsapBlurText` imports with new hooks from `useAnimations.ts`.

**Files affected**: 37 files that currently use GSAP

**Time**: 1.5 hours
**Risk**: Medium (GSAP animations could break if hooks aren't correct)
**Mitigation**: Test each component visually after migration

---

### Phase B: Utility Classes + Inline Style Elimination (2 hours)

**Goal**: 736 → < 10 inline styles

#### B.1: Create 25+ utility classes in globals.css

```css
/* ═══ BACKGROUND TINTS ═══ */
.aura-bg-gold-tint          { background-color: rgba(212,175,55,0.1); }
.aura-bg-gold-tint-strong   { background-color: rgba(212,175,55,0.15); }
.aura-bg-gold-tint-light    { background-color: rgba(212,175,55,0.06); }
.aura-bg-accent-tint        { background-color: rgba(245,237,218,0.3); }
.aura-bg-accent-tint-light  { background-color: rgba(245,237,218,0.15); }
.aura-bg-success-tint       { background-color: rgba(34,197,94,0.08); }
.aura-bg-danger-tint        { background-color: rgba(220,38,38,0.08); }
.aura-bg-dark-tint          { background-color: rgba(20,20,20,0.85); }
.aura-bg-dark-tint-light    { background-color: rgba(44,44,44,0.6); }
.aura-bg-cream-tint         { background-color: rgba(250,248,245,0.08); }

/* ═══ GRADIENTS ═══ */
.aura-gradient-gold         { background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-hover) 50%, var(--color-gold-text) 100%); }
.aura-gradient-gold-horizontal { background: linear-gradient(90deg, transparent, var(--color-gold) 50%, transparent); }
.aura-gradient-dark         { background: linear-gradient(180deg, var(--surface-dark) 0%, #1A1A1A 100%); }
.aura-gradient-dark-diagonal { background: linear-gradient(135deg, var(--surface-dark) 0%, #1A1A1A 100%); }
.aura-gradient-card         { background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-page) 100%); }
.aura-gradient-success      { background: linear-gradient(90deg, var(--color-success), #16A34A); }
.aura-gradient-overlay-dark { background: linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.7)); }
.aura-gradient-overlay-cream { background: linear-gradient(to bottom, rgba(250,248,245,0.15), rgba(44,44,44,0)); }

/* ═══ BORDERS ═══ */
.aura-border-subtle        { border: 1px solid rgba(232,213,163,0.4); }
.aura-border-subtle-strong { border: 1px solid rgba(232,213,163,0.5); }
.aura-border-gold-tint     { border: 1px solid rgba(212,175,55,0.3); }
.aura-border-gold-tint-strong { border: 1px solid rgba(212,175,55,0.4); }
.aura-border-success       { border: 1px solid rgba(34,197,94,0.25); }
.aura-border-danger        { border: 1px solid rgba(220,38,38,0.2); }
.aura-border-2-gold        { border: 2px solid var(--color-gold); }
.aura-border-bottom-subtle { border-bottom: 1px solid rgba(232,213,163,0.4); }
.aura-border-top-gold      { border-top: 2px solid var(--color-gold); }

/* ═══ LAYOUT HELPERS ═══ */
.aura-flex-center          { display: flex; align-items: center; justify-content: center; }
.aura-flex-col-center      { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.aura-flex-between         { display: flex; align-items: center; justify-content: space-between; }

/* ═══ BACKDROP FILTERS ═══ */
.aura-blur-sm              { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.aura-blur-md              { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.aura-blur-lg              { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.aura-blur-xl              { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

/* ═══ OPACITY HELPERS ═══ */
.aura-opacity-3            { opacity: 0.03; }
.aura-opacity-8            { opacity: 0.08; }
.aura-opacity-15           { opacity: 0.15; }
```

#### B.2: Migration Script — Batch 1 (Simple static: 452 styles)

Write a Python script that finds and replaces these patterns:

```python
# Pattern → Class mapping
MIGRATIONS = {
    "backgroundColor: 'rgba(212,175,55,0.1)'": "aura-bg-gold-tint",
    "backgroundColor: 'rgba(212, 175, 55, 0.1)'": "aura-bg-gold-tint",
    "backgroundColor: 'rgba(212,175,55,0.15)'": "aura-bg-gold-tint-strong",
    "backgroundColor: 'rgba(245,237,218,0.3)'": "aura-bg-accent-tint",
    "backgroundColor: 'rgba(20, 20, 20, 0.85)'": "aura-bg-dark-tint",
    "background: 'linear-gradient(135deg, var(--surface-dark) 0%, #1A1A1A 100%)'": "aura-gradient-dark-diagonal",
    "background: 'linear-gradient(180deg, var(--surface-card) 0%, var(--surface-page) 100%)'": "aura-gradient-card",
    "background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-soft) 100%)'": "aura-gradient-gold-horizontal",
    "border: '1px solid rgba(232,213,163,0.4)'": "aura-border-subtle",
    "border: '1px solid rgba(212,175,55,0.3)'": "aura-border-gold-tint",
    "borderBottom: '1px solid rgba(232, 213, 163, 0.4)'": "aura-border-bottom-subtle",
    "backdropFilter: 'blur(16px)'": "aura-blur-lg",
    "backdropFilter: 'blur(4px)'": "aura-blur-sm",
    # ... 25+ more patterns
}
```

The script:
1. Finds each pattern in style={{}}
2. Removes it from style
3. Adds the class to className
4. If style={{}} becomes empty, removes the entire style prop
5. Cleans up trailing commas, empty braces

#### B.3: Migration Script — Batch 2 (Conditional: 86 styles)

Convert conditional inline styles to conditional className:

```jsx
// BEFORE:
style={{ color: isActive ? 'var(--color-gold)' : 'var(--text-muted)' }}

// AFTER:
className={isActive ? 'aura-text-gold' : 'aura-text-muted'}
```

#### B.4: Migration Script — Batch 3 (Gradients: 36 styles)

Replace gradient inline styles with gradient utility classes.

#### B.5: Manual cleanup (remaining ~50)

After scripts, manually review and fix remaining edge cases.

**Time**: 2 hours
**Risk**: Low (adding classes, not changing logic)
**Mitigation**: Build + visual test after each batch

---

### Phase C: Component Architecture (2 hours)

**Goal**: Zero duplication, max 300 lines per file

#### C.1: Extract Reusable Components (6 new)

| Component | File Location | Replaces Duplication In |
|---|---|---|
| `ProductCard` | `src/components/product/ProductCard.tsx` | Shop, Sale, NewArrivals, Wishlist, Featured |
| `PriceTag` | `src/components/product/PriceTag.tsx` | Every product display |
| `RatingStars` | `src/components/product/RatingStars.tsx` | Product cards + reviews |
| `CategoryCard` | `src/components/shop/CategoryCard.tsx` | CategoriesSection + Shop |
| `SectionDivider` | `src/components/decorators/SectionDivider.tsx` | 20+ places |
| `TrustBadge` | `src/components/ui/TrustBadge.tsx` | Cart, Checkout, Product |

Each component:
- JSDoc documented
- Zero inline styles
- Uses .aura-* classes
- Fully typed with TypeScript
- Under 100 lines

#### C.2: Rewrite Complex Files (3 files → 16 files)

**AboutView.tsx** (1,275 lines → 6 files):

```
AboutView.tsx (main container)         ~60 lines
components/about/AboutHero.tsx         ~100 lines
components/about/AboutStory.tsx        ~150 lines
components/about/AboutTimeline.tsx     ~180 lines
components/about/AboutValues.tsx       ~120 lines
components/about/AboutCTA.tsx          ~50 lines
```

**AdminDashboard.tsx** (656 lines → 8 files):

```
AdminDashboard.tsx (main + tab state)  ~80 lines
components/admin/AdminSidebar.tsx      ~80 lines
components/admin/AdminOverview.tsx     ~100 lines
components/admin/AdminInventory.tsx    ~100 lines
components/admin/AdminOrders.tsx       ~80 lines
components/admin/AdminAnalytics.tsx    ~80 lines
components/admin/AdminNotifications.tsx ~70 lines
components/admin/AdminSettings.tsx     ~70 lines
```

**Navbar.tsx** (1,000 lines → 5 files):

```
Navbar.tsx (main container + state)    ~100 lines
components/layout/NavbarDesktop.tsx    ~150 lines
components/layout/NavbarMobile.tsx     ~150 lines
components/layout/MegaMenu.tsx         ~120 lines
components/layout/SearchModal.tsx      ~120 lines
```

**Rewrite rules** (for safety):
1. Keep ALL visual output identical
2. Keep ALL GSAP animations working
3. Each sub-component gets its own refs + useEffect
4. Zero inline styles (use utility classes)
5. JSDoc on every component
6. Build + visual test after each file

**Time**: 2 hours
**Risk**: Medium (file splits can break imports + GSAP refs)
**Mitigation**: One file at a time, build check after each, visual verification

---

### Phase D: Documentation + Types + Folders (1 hour)

**Goal**: Professional organization, full documentation

#### D.1: Centralize Types

Create `src/types/` directory:

```
src/types/
├── product.ts    ← Product, CartItem, Category interfaces
├── user.ts       ← User, Address, Order interfaces
├── blog.ts       ← Article, ArticleAuthor interfaces
├── review.ts     ← Review interface
└── index.ts      ← Barrel export
```

Move interfaces from `useStore.ts` to `src/types/` and re-export.

#### D.2: Folder Restructure

```
src/components/
├── layout/         ← Navbar.tsx, Footer.tsx, SiteShell.tsx, CartDrawer.tsx
├── sections/       ← Hero.tsx, FeaturedProducts.tsx, CategoriesSection.tsx, TrendingCollection.tsx,
│                     TestimonialsSection.tsx, NewsletterSection.tsx, WhyChooseUs.tsx
├── product/        ← ProductCard.tsx, PriceTag.tsx, RatingStars.tsx, ProductDetailView.tsx
├── shop/           ← ShopView.tsx, CategoryCard.tsx
├── blog/           ← BlogView.tsx, ArticleView.tsx
├── account/        ← AccountView.tsx, AddressesView.tsx, SettingsView.tsx, TrackOrdersView.tsx
├── admin/          ← AdminSidebar.tsx, AdminOverview.tsx, AdminInventory.tsx, etc.
├── pages/          ← AboutView.tsx, ContactView.tsx, FAQView.tsx, ShippingView.tsx,
│                     ReturnsView.tsx, CareGuideView.tsx, TermsView.tsx, PrivacyView.tsx,
│                     AuthView.tsx, ForgotPasswordView.tsx, CheckoutView.tsx, CartView.tsx,
│                     WishlistView.tsx, SaleView.tsx, NewArrivalsView.tsx, LookbookView.tsx
├── ui/             ← PremiumButton.tsx, Input.tsx, Select.tsx, Textarea.tsx, Card.tsx,
│                     Badge.tsx, Breadcrumb.tsx, Tabs.tsx, Modal.tsx, Checkbox.tsx,
│                     RadioGroup.tsx, FormRow.tsx, SectionHeader.tsx, EmptyState.tsx,
│                     ErrorState.tsx, Pagination.tsx, Skeletons.tsx, toast.tsx, toaster.tsx
└── decorators/     ← SVGDecorations.tsx, stagger-testimonials.tsx
```

Update ALL import paths after moving.

#### D.3: JSDoc Documentation

Add to EVERY component:

```typescript
/**
 * ProductCard — Displays a single product in grid layouts.
 *
 * Used in: Shop, Sale, NewArrivals, Wishlist, FeaturedProducts
 *
 * @param product - The product data to display
 * @param onAddToCart - Callback when "Add to Cart" is clicked
 * @param onToggleWishlist - Callback for wishlist toggle
 * @param isInWishlist - Whether the product is in the user's wishlist
 *
 * @example
 * <ProductCard
 *   product={product}
 *   onAddToCart={handleAddToCart}
 *   onToggleWishlist={handleToggleWishlist}
 *   isInWishlist={wishlist.includes(product.id)}
 * />
 */
```

#### D.4: Create README.md for components

```markdown
# Aura Living — Component Architecture

## Folder Structure

- `layout/` — Global layout components (Navbar, Footer, CartDrawer)
- `sections/` — Homepage sections (Hero, FeaturedProducts, etc.)
- `product/` — Product-related components
- `shop/` — Shop page components
- `blog/` — Blog page components
- `account/` — Account page components
- `admin/` — Admin dashboard components
- `pages/` — Full page views
- `ui/` — Reusable UI primitives
- `decorators/` — Decorative SVG components

## Design System

All styling uses `.aura-*` utility classes defined in `src/app/globals.css`.
No inline styles are used (except for truly dynamic values like progress widths).

## Animation System

All animations use hooks from `src/hooks/useAnimations.ts`.
All hooks use `@gsap/react`'s `useGSAP()` for automatic cleanup.
All hooks respect `prefers-reduced-motion`.
```

**Time**: 1 hour
**Risk**: Low (moving files, updating imports)
**Mitigation**: TypeScript will catch any broken imports immediately

---

## ⏱️ COMPLETE TIME ESTIMATE

| Phase | Task | Time | Risk |
|---|---|---|---|
| **A** | GSAP animation system + SaveButton | 1.5 hr | Medium |
| **B** | Utility classes + inline style migration (736 → <10) | 2 hr | Low |
| **C** | Component extraction + file rewrites | 2 hr | Medium |
| **D** | Documentation + types + folder restructure | 1 hr | Low |
| | **Total** | **6.5 hours** | |

---

## 📊 EXPECTED FINAL METRICS

| Metric | Current | After Cleanup | Senior Dev Standard |
|---|---|---|---|
| Inline styles | 736 | **< 10** (dynamic only) | < 50 ✅ |
| Hardcoded fonts | 0 ✅ | 0 ✅ | 0 ✅ |
| Arbitrary text sizes | 1 ✅ | **0** | 0 ✅ |
| Design tokens | 126 | **150+** | 100+ ✅ |
| Utility classes | 56 | **80+** | 50+ ✅ |
| UI components | 20 | **26** | 20+ ✅ |
| Max file size | 1,275 lines | **< 300 lines** | < 300 ✅ |
| GSAP hooks | 0 (scattered) | **7 reusable** | Required ✅ |
| JSDoc documentation | 0% | **100%** | Required ✅ |
| Folder structure | Flat | **Categorized** | Required ✅ |
| Component duplication | 5 copies | **0** | 0 ✅ |
| Centralized types | Mixed | **`/types/` dir** | Required ✅ |

---

## ⚠️ RISK MITIGATION

### For EVERY file change:

1. **Before**: Read the file, understand its structure
2. **During**: Make changes, add utility classes
3. **After**: Run `tsc --noEmit` (must pass)
4. **After**: Run `eslint` (must pass)
5. **After**: Run `next build` (must succeed)
6. **After**: Visually verify the page looks identical

### If a file breaks:
1. Revert that file to previous state
2. Analyze what went wrong
3. Try again with a different approach
4. If still broken: **delete and recreate from scratch** (user's instruction)

### Files that are HIGH RISK (GSAP-heavy):
- AboutView.tsx — 24 inline styles + heavy GSAP
- HeroSection.tsx — inline styles + GSAP parallax
- Navbar.tsx — 62 inline styles + complex state
- CategoriesSection.tsx — GSAP stagger

**Strategy for high-risk files**: Rewrite completely (don't try to refactor)

---

## 🔄 EXECUTION CHECKLIST

### Phase A: GSAP (1.5 hr)
- [ ] Install @gsap/react + canvas-confetti
- [ ] Create useAnimations.ts with 7 hooks
- [ ] Build SaveButton with GSAP
- [ ] Migrate 37 files to new hooks
- [ ] Build + visual test

### Phase B: Inline Styles (2 hr)
- [ ] Create 25+ utility classes in globals.css
- [ ] Run batch 1 migration script (452 static styles)
- [ ] Run batch 2 migration script (86 conditional styles)
- [ ] Run batch 3 migration script (36 gradients)
- [ ] Run batch 4 migration script (188 rgba values)
- [ ] Manual cleanup of remaining edge cases
- [ ] Build + visual test
- [ ] Verify: < 10 inline styles remaining

### Phase C: Components (2 hr)
- [ ] Create ProductCard component
- [ ] Create PriceTag component
- [ ] Create RatingStars component
- [ ] Create CategoryCard component
- [ ] Create SectionDivider component
- [ ] Create TrustBadge component
- [ ] Rewrite AboutView (1,275 → 6 files)
- [ ] Rewrite AdminDashboard (656 → 8 files)
- [ ] Rewrite Navbar (1,000 → 5 files)
- [ ] Build + visual test after each

### Phase D: Polish (1 hr)
- [ ] Create src/types/ directory
- [ ] Move interfaces to types/
- [ ] Restructure component folders
- [ ] Update all import paths
- [ ] Add JSDoc to every component
- [ ] Create components/README.md
- [ ] Final build + lint + test
- [ ] Verify: 0 errors, 0 warnings, build success

---

## 📦 DEPENDENCIES TO INSTALL

```bash
@gsap/react              # Official GSAP React hook (useGSAP)
canvas-confetti          # Confetti effect for SaveButton
@types/canvas-confetti   # TypeScript types for canvas-confetti
```

---

## 🎯 SENIOR DEVELOPER FEEDBACK ADDRESSING

| Senior Dev Issue | Rating | This Plan's Fix | Target Rating |
|---|---|---|---|
| Excessive inline styles | 4/10 | 736 → < 10 | 9/10 |
| Incomplete design system | 4/10 | 150+ tokens, 80+ classes | 9/10 |
| Typography inconsistency | 4/10 | 0 arbitrary sizes | 10/10 |
| Component duplication | 5/10 | 6 extracted components | 9/10 |
| Button system | 6/10 | Already done + GSAP SaveButton | 9/10 |
| Card system | 5/10 | ProductCard + utility classes | 8/10 |
| Hardcoded values | 4/10 | All migrated to tokens | 9/10 |
| Code quality | 4/10 | DRY, documented, structured | 8/10 |
| Accessibility | 7/10 | Already done (Phase 5) | 9/10 |
| Performance | 7/10 | Already done (Phase 4) | 9/10 |
| Production readiness | 4/10 | All issues addressed | 8/10 |

**Projected overall after cleanup: 8.5-9/10**

---

## 🚫 WHAT WILL NOT BE TOUCHED (Already Good)

1. ✅ `src/app/` directory — Route structure is perfect
2. ✅ `src/store/useStore.ts` — Zustand store is clean
3. ✅ `src/data/` — Data layer is well-separated
4. ✅ `src/hooks/useLenis.ts` — Clean implementation
5. ✅ `src/lib/` — Utilities are correct
6. ✅ `src/middleware.ts` — Route protection works
7. ✅ `next.config.ts` — Security headers configured
8. ✅ `src/app/sitemap.ts` — Sitemap is correct
9. ✅ `src/app/robots.ts` — Robots is correct
10. ✅ All UI primitives (Button, Input, Modal, etc.)

---

**END OF PLAN**

> This document is the single source of truth for the professional cleanup.
> Every checkbox will be marked [x] when complete.
> No push until all phases are verified.
