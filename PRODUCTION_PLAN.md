# Aura Living — Production-Grade .com Launch Plan

> **Document version**: 1.0
> **Last updated**: 2026-06-20
> **Owner**: Senior Developer (you) + AI pair (me)
> **Status**: Pre-implementation — awaiting your guidance on critical decisions
> **Push policy**: No code is pushed to GitHub until you explicitly say "push"

---

## 📋 How to Use This Document

- Every task has a checkbox: `- [ ]`
- When a task is complete, change to: `- [x]`
- Phases are sequential (Phase N depends on Phase N-1) unless marked **(parallel)**
- Each phase ends with a **Verification Gate** — must pass before next phase
- All file paths are absolute from project root: `/home/z/my-project/`
- Estimated effort per task: **S** (< 1 hour), **M** (1-4 hours), **L** (4+ hours)

---

## 🎯 Project Goals

1. Migrate from hash-based SPA routing to **real Next.js App Router routes**
2. Achieve **100% across all 6 audit dimensions** (Structure, Design, A11y, Perf, SEO, Content)
3. Pass **Core Web Vitals** (LCP < 2.5s, CLS < 0.1, INP < 200ms)
4. Pass **WCAG 2.2 AA** accessibility audit (Lighthouse 95+)
5. Pass **Google Rich Results Test** for all structured data
6. Deploy to **auraliving.com** (or .pk) on Vercel
7. Be **production-grade** — ready for real customers

---

## 📊 Current State (Fresh Audit — 2026-06-20)

### Codebase Metrics

| Metric | Value | Target |
|---|---|---|
| Total source files | 75 | ~85 (after routing migration) |
| Total lines of code | 23,732 | ~25,000 |
| View components | 27 | 27 (restructured) |
| UI primitives | 17 | 20+ |
| Products in catalog | 36 (was 51 — verify) | 51+ with unique specs |
| Articles in blog | 8 (11 slug refs) | 12+ |
| Mock reviews | 53 (12 products) | All products |
| Testimonials | 22 | 12 (curated, real) |

### Quality Metrics (Measured Today)

| Metric | Current | Target | Status |
|---|---|---|---|
| Inline `style={{}}` blocks | 1,186 | < 100 | ❌ Major work |
| Inline hex colors (non-globals.css) | 30 | 0 | ⚠️ Close |
| Hardcoded font refs (`'Poppins'`, `'Playfair Display'`) | 121 | 0 | ❌ Major work |
| Raw `<img>` tags | 0 | 0 | ✅ Done |
| `next/image` imports | 17 | 20+ | ✅ Good |
| `text-gold` on light backgrounds (WCAG fail) | 10 usages | 0 | ⚠️ Admin sidebar (OK on dark) + NewsletterSection (dark, OK) + HeroSection (1) |
| `aria-invalid` on form fields | 7 | All form fields | ❌ 6 forms missing |
| `role="alert"` on errors | 8 | All error messages | ❌ 6 forms missing |
| Files with multiple `<h1>` | 7 files | 0 | ❌ Critical a11y issue |
| JSON-LD scripts | 9 instances | 12+ | ✅ Good |
| Pages with `<Breadcrumb>` component | 21 | 25+ | ✅ Good |
| Metadata exports per page | 1 (root only) | 27 (per route) | ❌ Blocked by hash routing |
| `next/dynamic` code-splitting | 1 file (page.tsx) | Per route (automatic) | ✅ Will be auto post-migration |
| `framer-motion` dependency | Removed | Removed | ✅ Done |
| Service worker | Basic | Enhanced with offline fallback | ⚠️ Upgrade needed |
| Sitemap URLs | 77 | 90+ | ✅ Good |

### Files With Multiple `<h1>` Tags (Critical A11y Issue)

- [ ] `AdminDashboard.tsx` — 7 h1 tags
- [ ] `AddressesView.tsx` — 2 h1 tags
- [ ] `ArticleView.tsx` — 2 h1 tags
- [ ] `CartView.tsx` — 2 h1 tags
- [ ] `CheckoutView.tsx` — 2 h1 tags
- [ ] `SettingsView.tsx` — 2 h1 tags
- [ ] `TrackOrdersView.tsx` — 2 h1 tags

### Forms Missing `aria-invalid` + `role="alert"`

- [ ] `AuthView.tsx` (login/signup form)
- [ ] `ForgotPasswordView.tsx`
- [ ] `ContactView.tsx` (contact form)
- [ ] `AddressesView.tsx` (address form)
- [ ] `SettingsView.tsx` (profile form)
- [ ] `NewsletterSection.tsx` (email capture)

### Top Inline-Style Offenders (Must Migrate)

| File | Inline styles |
|---|---|
| `AdminDashboard.tsx` | 123 |
| `Navbar.tsx` | 59 |
| `CheckoutView.tsx` | 58 |
| `SettingsView.tsx` | 57 |
| `AddressesView.tsx` | 53 |
| `ShopView.tsx` | 48 |
| `ReturnsView.tsx` | 44 |
| `AccountView.tsx` | 43 |
| `CartView.tsx` | 41 |
| `CartDrawer.tsx` | 40 |

---

## 📚 Web Standards Reference

These are the standards every task in this plan adheres to. No exceptions.

### 1. Next.js 16 App Router Best Practices
- **Source**: https://nextjs.org/docs/app
- Use Server Components by default; `'use client'` only when needed
- Use `loading.tsx`, `error.tsx`, `not-found.tsx` per route
- Use `generateMetadata` for per-page SEO
- Use `generateStaticParams` for dynamic routes (SSG)
- Use `<Link>` for navigation (auto-prefetch)
- Use `next/image` for ALL images (no raw `<img>`)
- Use `next/font` for fonts (no `@font-face`)

### 2. Core Web Vitals (2024)
- **Source**: https://web.dev/articles/vitals
- **LCP** (Largest Contentful Paint): < 2.5s (75th percentile)
- **CLS** (Cumulative Layout Shift): < 0.1
- **INP** (Interaction to Next Paint): < 200ms (replaced FID in 2024)
- **TTFB** (Time to First Byte): < 800ms
- **FCP** (First Contentful Paint): < 1.8s

### 3. WCAG 2.2 AA Accessibility
- **Source**: https://www.w3.org/TR/WCAG22/
- **1.4.3 Contrast** (Minimum): 4.5:1 for normal text, 3:1 for large text
- **1.4.11 Non-text Contrast**: 3:1 for UI components
- **2.1.1 Keyboard**: All functionality accessible via keyboard
- **2.1.2 No Keyboard Trap**: Focus can leave modals
- **2.4.1 Bypass Blocks**: Skip-to-content link
- **2.4.6 Headings and Labels**: Descriptive headings
- **3.3.1 Error Identification**: Errors announced to screen readers
- **3.3.2 Labels or Instructions**: All inputs have labels
- **4.1.2 Name, Role, Value**: All controls have accessible names
- **4.1.3 Status Messages**: `role="status"` / `aria-live` for dynamic updates

### 4. SEO Best Practices (Google 2024)
- **Source**: https://developers.google.com/search/docs
- Unique `<title>` per page (< 60 chars)
- Unique `<meta description>` per page (< 160 chars)
- Canonical URL per page
- Open Graph + Twitter Card per page
- Structured data (JSON-LD) for: Organization, Product, Article, FAQ, BreadcrumbList, Review, AggregateRating, ItemList, WebSite, Store
- Semantic HTML5: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<aside>`, `<address>`, `<time>`, `<figure>`
- Mobile-first indexing (mobile layout IS the canonical)
- HTTPS only (Vercel handles)
- Fast load (Core Web Vitals pass)
- XML sitemap submitted to Google Search Console + Bing Webmaster
- `robots.txt` with proper allow/disallow rules
- Internal linking strategy (related products, breadcrumbs, footer links)

### 5. Performance Best Practices
- **Source**: https://web.dev/articles/fast
- Code-split per route (App Router does this automatically)
- Lazy-load below-the-fold content
- Optimize images (AVIF > WebP > JPG/PNG)
- Preload critical resources (hero image, fonts)
- Use `display: swap` for fonts
- Minify + compress (Vercel handles)
- Use HTTP/2 (Vercel handles)
- Use CDN (Vercel handles)
- Set long-cache headers for static assets (already done)
- Use `Cache-Control: immutable` for hashed assets (already done)

### 6. Security Best Practices
- **Source**: https://owasp.org/www-project-top-ten/
- Content Security Policy (CSP) headers
- `X-Frame-Options: DENY` (prevent clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera, mic, geolocation
- HTTPS only (Vercel handles)
- HttpOnly cookies for auth (when backend ready)
- Sanitize user input (when forms connect to backend)
- Rate limiting (when backend ready)

### 7. PWA Best Practices
- **Source**: https://web.dev/articles/install-criteria
- Valid `manifest.json` (already done)
- Service worker (basic done, enhance)
- HTTPS (Vercel handles)
- Installable (meets criteria)
- Offline fallback page
- Splash screen icons

### 8. Code Quality Best Practices
- TypeScript strict mode (already on)
- ESLint with `eslint-config-next` (already on)
- Prettier (add for consistency)
- Husky pre-commit hooks (add)
- Conventional Commits (use for git history)
- No `console.log` in production (add lint rule)
- No `any` in TypeScript (add lint rule)
- No unused imports (add lint rule)
- File naming: PascalCase for components, kebab-case for utilities

---

## 🗺️ Phase Overview

| Phase | Name | Est. Days | Dependencies |
|---|---|---|---|
| 0 | Critical Decisions + Setup | 0.5 | None |
| 1 | Routing Migration (Hash → App Router) | 3-4 | Phase 0 |
| 2 | Cart Drawer Redesign | 1 | Phase 1 |
| 3 | SEO 100% | 2-3 | Phase 1 |
| 4 | Performance 100% | 2-3 | Phase 1, 3 |
| 5 | Accessibility 100% (WCAG 2.2 AA) | 2-3 | Phase 1 |
| 6 | Design System 100% | 3-4 | Phase 1 (parallel with 3-5) |
| 7 | Content 100% | 2-3 | Phase 1 (parallel) |
| 8 | Production Polish | 2-3 | Phase 1, 3 |
| 9 | Testing & QA | 2-3 | All previous |
| 10 | Launch | 1 | Phase 9 |

**Total estimate**: 19-27 working days (3-5 weeks for one developer)

---

# Phase 0: Critical Decisions + Setup

You must answer these before any coding starts. I'll wait for your guidance.

## 0.1 Critical Decisions (must answer)

- [ ] **D1. Cart drawer style**:
  - [ ] Option A: Revert to centered popup (smaller, focused)
  - [ ] Option B: Modern right-slide-in drawer (420px desktop, full mobile) — **recommended**
  - [ ] Option C: Hybrid (toast on add + slide-in drawer for full review)

- [ ] **D2. Migration approach**:
  - [ ] (a) Big-bang — migrate everything at once (faster, riskier)
  - [ ] (b) Incremental — migrate page-by-page (slower, safer) — **recommended**

- [ ] **D3. Product URL format**:
  - [ ] (a) Slug: `/product/hammered-brass-table-lamp` (SEO best) — **recommended**
  - [ ] (b) Numeric ID: `/product/1` (simpler, matches existing data)
  - [ ] (c) Hybrid: `/product/1-hammered-brass-table-lamp`

- [ ] **D4. Account structure**:
  - [ ] (a) Nested: `/account/orders`, `/account/addresses` (cleaner) — **recommended**
  - [ ] (b) Flat: `/orders`, `/addresses` (shorter URLs)

- [ ] **D5. Admin protection**:
  - [ ] (a) Middleware-protected (redirect to login if not authed) — **recommended**
  - [ ] (b) Open (no protection, since no backend yet)

- [ ] **D6. Analytics**:
  - [ ] (a) Google Analytics 4 (free, standard, complex)
  - [ ] (b) Plausible (~$9/mo, privacy-friendly, simple) — **recommended for premium brand**
  - [ ] (c) Vercel Analytics (free, basic)

- [ ] **D7. Search**:
  - [ ] (a) Pagefind (free, static, builds at compile time) — **recommended**
  - [ ] (b) Algolia (free tier, hosted, instant)
  - [ ] (c) Keep current client-side filter

- [ ] **D8. Domain**:
  - [ ] (a) `auraliving.com` (international, premium) — **recommended**
  - [ ] (b) `auraliving.pk` (local, builds trust in Pakistan)
  - [ ] (c) Both (redirect .pk → .com)

## 0.2 Optional Decisions (can defer)

- [ ] **D9. Live chat**: Tawk.to (free) / Crisp (free tier) / Skip for v1?
- [ ] **D10. Cookie consent**: Required (GDPR) / Recommended (PK) / Skip for v1?
- [ ] **D11. Email capture**: Mailchimp / Klaviyo / Resend / Skip for v1?
- [ ] **D12. Dark mode**: Implement / Skip for v1? — **recommended: skip**
- [ ] **D13. Storybook**: Build / Skip for v1? — **recommended: skip**
- [ ] **D14. PWA enhancement**: Offline cart sync / Skip? — **recommended: skip for v1**
- [ ] **D15. Blog images**: Generate placeholder covers / Use Unsplash / Custom photography?

## 0.3 Setup Tasks

- [ ] **S1.** Create `production` branch in git (don't push, just local branch)
- [ ] **S2.** Install dev dependencies:
  - [ ] `@next/bundle-analyzer` (bundle size auditing)
  - [ ] `prettier` + `prettier-plugin-tailwindcss` (code formatting)
  - [ ] `husky` + `lint-staged` (pre-commit hooks)
  - [ ] `axe-core` (accessibility testing)
  - [ ] `@playwright/test` (E2E testing)
  - [ ] `pagefind` (static site search) — if D7 = (a)
- [ ] **S3.** Create `.prettierrc` with project conventions
- [ ] **S4.** Create `.husky/pre-commit` hook running `lint-staged`
- [ ] **S5.** Create `lint-staged.config.js` running eslint + prettier on staged files
- [ ] **S6.** Add ESLint rules:
  - [ ] `no-console` (error in production)
  - [ ] `no-explicit-any` (error)
  - [ ] `no-unused-vars` (error)
  - [ ] `react/jsx-key` (error)
  - [ ] `@next/next/no-img-element` (error)
- [ ] **S7.** Add `next.config.ts` security headers (CSP, X-Frame-Options, etc.)
- [ ] **S8.** Update `package.json` scripts:
  - [ ] `analyze`: bundle analyzer
  - [ ] `format`: prettier write
  - [ ] `test:e2e`: playwright
  - [ ] `test:a11y`: axe-core
- [ ] **S9.** Create `.env.example` with all env vars documented
- [ ] **S10.** Verify `.gitignore` excludes `.env`, `.next/`, `node_modules/`

### Phase 0 Verification Gate

- [ ] All decisions D1-D8 answered
- [ ] All setup tasks S1-S10 complete
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Git branch `production` created

---

# Phase 1: Routing Migration (Hash → App Router)

**This is the #1 priority. Everything else depends on this.**

## 1.1 Plan New Route Structure

Target structure (27 real URLs):

```
src/app/
├── layout.tsx                    ← Root (Navbar + Footer + CartDrawer + Toaster)
├── page.tsx                      ← Home (server component)
├── not-found.tsx                 ← Custom 404
├── error.tsx                     ← Error boundary
├── loading.tsx                   ← Global skeleton
│
├── (shop)/                       ← Route group (no URL prefix)
│   ├── shop/page.tsx             ← /shop?category=&search=&sort=
│   ├── new-arrivals/page.tsx     ← /new-arrivals
│   ├── sale/page.tsx             ← /sale
│   └── lookbook/page.tsx         ← /lookbook
│
├── product/[slug]/
│   ├── page.tsx                  ← /product/hammered-brass-table-lamp
│   ├── loading.tsx
│   └── opengraph-image.tsx       ← Dynamic OG image per product
│
├── cart/page.tsx                 ← /cart (full page)
├── checkout/page.tsx             ← /checkout
├── wishlist/page.tsx             ← /wishlist
│
├── account/
│   ├── layout.tsx                ← Sidebar nav + auth guard
│   ├── page.tsx                  ← /account
│   ├── orders/page.tsx           ← /account/orders
│   ├── addresses/page.tsx        ← /account/addresses
│   └── settings/page.tsx         ← /account/settings
│
├── auth/
│   ├── login/page.tsx            ← /auth/login
│   ├── signup/page.tsx           ← /auth/signup
│   └── forgot-password/page.tsx  ← /auth/forgot-password
│
├── blog/
│   ├── page.tsx                  ← /blog
│   ├── [slug]/
│   │   ├── page.tsx              ← /blog/how-to-style-console-table
│   │   └── opengraph-image.tsx
│
├── admin/
│   ├── layout.tsx                ← Admin sidebar + auth guard (middleware)
│   └── page.tsx                  ← /admin (dashboard)
│
├── about/page.tsx                ← Server component
├── contact/page.tsx
├── faq/page.tsx
├── shipping/page.tsx
├── returns/page.tsx
├── care-guide/page.tsx
├── terms/page.tsx
└── privacy/page.tsx
```

- [ ] **1.1.1.** Review route structure above with stakeholder (you)
- [ ] **1.1.2.** Document any deviations from the plan
- [ ] **1.1.3.** Confirm slug format for products (D3)

## 1.2 Add Slug Field to Product Data

- [ ] **1.2.1.** Read `/home/z/my-project/src/data/products.ts`
- [ ] **1.2.2.** Add `slug` field to `Product` interface in `useStore.ts`
- [ ] **1.2.3.** Generate slugs for all 36 products (format: `hammered-brass-table-lamp`)
- [ ] **1.2.4.** Ensure slugs are unique across catalog
- [ ] **1.2.5.** Add helper `getProductBySlug(slug)` in `products.ts`
- [ ] **1.2.6.** Add helper `getProductById(id)` in `products.ts` (backward compat)
- [ ] **1.2.7.** Update `getProductBySlug` to be the primary lookup

## 1.3 Add Slug Field to Article Data

- [ ] **1.3.1.** Read `/home/z/my-project/src/data/articles.ts`
- [ ] **1.3.2.** Verify all 8 articles have unique slugs
- [ ] **1.3.3.** Add `getArticleBySlug` helper (already exists — verify)

## 1.4 Create New Route Files (Scaffolding)

For each route, create the folder + `page.tsx`:

- [ ] **1.4.1.** `src/app/(shop)/shop/page.tsx` — renders `<ShopView />`
- [ ] **1.4.2.** `src/app/(shop)/new-arrivals/page.tsx` — renders `<NewArrivalsView />`
- [ ] **1.4.3.** `src/app/(shop)/sale/page.tsx` — renders `<SaleView />`
- [ ] **1.4.4.** `src/app/(shop)/lookbook/page.tsx` — renders `<LookbookView />`
- [ ] **1.4.5.** `src/app/product/[slug]/page.tsx` — renders `<ProductDetailView />`
- [ ] **1.4.6.** `src/app/product/[slug]/loading.tsx` — product skeleton
- [ ] **1.4.7.** `src/app/cart/page.tsx` — renders `<CartView />`
- [ ] **1.4.8.** `src/app/checkout/page.tsx` — renders `<CheckoutView />`
- [ ] **1.4.9.** `src/app/wishlist/page.tsx` — renders `<WishlistView />`
- [ ] **1.4.10.** `src/app/account/layout.tsx` — sidebar wrapper
- [ ] **1.4.11.** `src/app/account/page.tsx` — renders `<AccountView />`
- [ ] **1.4.12.** `src/app/account/orders/page.tsx` — renders `<TrackOrdersView />`
- [ ] **1.4.13.** `src/app/account/addresses/page.tsx` — renders `<AddressesView />`
- [ ] **1.4.14.** `src/app/account/settings/page.tsx` — renders `<SettingsView />`
- [ ] **1.4.15.** `src/app/auth/login/page.tsx` — renders `<AuthView mode="login" />`
- [ ] **1.4.16.** `src/app/auth/signup/page.tsx` — renders `<AuthView mode="signup" />`
- [ ] **1.4.17.** `src/app/auth/forgot-password/page.tsx` — renders `<ForgotPasswordView />`
- [ ] **1.4.18.** `src/app/blog/page.tsx` — renders `<BlogView />`
- [ ] **1.4.19.** `src/app/blog/[slug]/page.tsx` — renders `<ArticleView />`
- [ ] **1.4.20.** `src/app/blog/[slug]/loading.tsx` — article skeleton
- [ ] **1.4.21.** `src/app/admin/layout.tsx` — admin sidebar
- [ ] **1.4.22.** `src/app/admin/page.tsx` — renders `<AdminDashboard />`
- [ ] **1.4.23.** `src/app/about/page.tsx` — renders `<AboutView />`
- [ ] **1.4.24.** `src/app/contact/page.tsx` — renders `<ContactView />`
- [ ] **1.4.25.** `src/app/faq/page.tsx` — renders `<FAQView />`
- [ ] **1.4.26.** `src/app/shipping/page.tsx` — renders `<ShippingView />`
- [ ] **1.4.27.** `src/app/returns/page.tsx` — renders `<ReturnsView />`
- [ ] **1.4.28.** `src/app/care-guide/page.tsx` — renders `<CareGuideView />`
- [ ] **1.4.29.** `src/app/terms/page.tsx` — renders `<TermsView />`
- [ ] **1.4.30.** `src/app/privacy/page.tsx` — renders `<PrivacyView />`

## 1.5 Update Root Layout

- [ ] **1.5.1.** Update `src/app/layout.tsx` to include `<Navbar />`, `<Footer />`, `<CartDrawer />`, `<Toaster />`, `<BackToTop />` globally
- [ ] **1.5.2.** Remove these wrappers from individual views (they'll be in root layout)
- [ ] **1.5.3.** Verify skip-to-content link still works (`#main-content` anchor)
- [ ] **1.5.4.** Add `<main id="main-content">` wrapper in root layout
- [ ] **1.5.5.** Remove `<main>` wrappers from individual views

## 1.6 Update Home Page

- [ ] **1.6.1.** Rewrite `src/app/page.tsx` as server component rendering `<HeroSection />`, `<CategoriesSection />`, `<FeaturedProducts />`, `<TrendingCollection />`, `<TestimonialsSection />`, `<NewsletterSection />`
- [ ] **1.6.2.** Move SPA routing logic (hash parsing, popstate, history) to a `useHashRedirect()` hook that handles legacy URLs
- [ ] **1.6.3.** Remove `renderPage()` switch statement
- [ ] **1.6.4.** Remove `currentPage` from Zustand store
- [ ] **1.6.5.** Remove `setPage()` from Zustand store
- [ ] **1.6.6.** Remove `selectedProduct` from Zustand store (use URL param)
- [ ] **1.6.7.** Remove `selectedArticleSlug` from Zustand store (use URL param)
- [ ] **1.6.8.** Remove `selectedCategory` from Zustand store (use URL query param)
- [ ] **1.6.9.** Remove `searchQuery` from Zustand store (use URL query param)
- [ ] **1.6.10.** Update `useLenis` hook to work with route changes

## 1.7 Update Navigation

- [ ] **1.7.1.** In `Navbar.tsx`: replace all `setPage('shop')` with `<Link href="/shop">`
- [ ] **1.7.2.** In `Navbar.tsx`: replace all `setPage('product')` + `setSelectedProduct(p)` with `<Link href={\`/product/${p.slug}\`}>`
- [ ] **1.7.3.** In `Footer.tsx`: same updates
- [ ] **1.7.4.** In `CartDrawer.tsx`: update "View Cart" and "Checkout" buttons to use `<Link>`
- [ ] **1.7.5.** In all view components: replace `setPage()` calls with `<Link>` or `useRouter().push()`
- [ ] **1.7.6.** In `Breadcrumb.tsx`: update items to use `href` instead of `onClick`
- [ ] **1.7.7.** In `PremiumButton.tsx`: add optional `href` prop that renders `<Link>` instead of `<button>`
- [ ] **1.7.8.** Update all CTA buttons site-wide

## 1.8 Update Product Detail View

- [ ] **1.8.1.** Convert `ProductDetailView.tsx` to read product from URL params (`useParams()` or `params` prop)
- [ ] **1.8.2.** Remove `selectedProduct` from Zustand usage
- [ ] **1.8.3.** Handle product-not-found case (redirect to `/shop` or show 404)
- [ ] **1.8.4.** Update "Related Products" section to use `<Link>` with slug
- [ ] **1.8.5.** Add `generateStaticParams` to `/product/[slug]/page.tsx` for SSG

## 1.9 Update Shop View

- [ ] **1.9.1.** Convert `ShopView.tsx` to read filters from URL search params (`useSearchParams()`)
- [ ] **1.9.2.** Filters: `?category=lighting&search=lamp&sort=price-asc&min=1000&max=5000`
- [ ] **1.9.3.** Update URL when filters change (replace state, don't push)
- [ ] **1.9.4.** Read filters on initial mount from URL
- [ ] **1.9.5.** Remove `selectedCategory`, `searchQuery` from Zustand store

## 1.10 Update Blog Views

- [ ] **1.10.1.** Convert `ArticleView.tsx` to read article from URL params
- [ ] **1.10.2.** Handle article-not-found case
- [ ] **1.10.3.** Update "Continue Reading" links to use `<Link>` with slug
- [ ] **1.10.4.** Add `generateStaticParams` to `/blog/[slug]/page.tsx` for SSG

## 1.11 Update Account Views

- [ ] **1.11.1.** Create `account/layout.tsx` with sidebar nav (Overview, Orders, Addresses, Settings, Sign Out)
- [ ] **1.11.2.** Update `AccountView`, `TrackOrdersView`, `AddressesView`, `SettingsView` to remove their own sidebar
- [ ] **1.11.3.** Add auth guard in layout (redirect to `/auth/login` if not signed in)

## 1.12 Update Admin

- [ ] **1.12.1.** Create `admin/layout.tsx` with admin sidebar
- [ ] **1.12.2.** Update `AdminDashboard.tsx` to remove its own sidebar wrapper
- [ ] **1.12.3.** Add middleware to protect `/admin` route (redirect to `/auth/login` if not authed)
- [ ] **1.12.4.** Add `?tab=inventory` URL param for admin tabs (or nested routes `/admin/inventory`)

## 1.13 Hash Redirect Middleware

- [ ] **1.13.1.** Update `src/middleware.ts` to redirect legacy hash URLs:
  - `/#product/1` → `/product/{slug-for-id-1}`
  - `/#article/slug` → `/blog/slug`
  - `/#shop` → `/shop`
  - `/#cart` → `/cart`
  - etc.
- [ ] **1.13.2.** Use 301 (permanent) redirect for SEO
- [ ] **1.13.3.** Test all 27 old hash URLs redirect correctly

## 1.14 Cleanup

- [ ] **1.14.1.** Delete old `src/app/page.tsx` SPA routing logic (keep only home page rendering)
- [ ] **1.14.2.** Remove `pageTitles` map from `useStore.ts` (per-page metadata in each route)
- [ ] **1.14.3.** Remove unused Zustand state: `currentPage`, `setPage`, `selectedProduct`, `setSelectedProduct`, `selectedArticleSlug`, `setSelectedArticleSlug`, `selectedCategory`, `setSelectedCategory`, `searchQuery`, `setSearchQuery`
- [ ] **1.14.4.** Remove `useHashRedirect` hook if not needed
- [ ] **1.14.5.** Remove `BackToTop` component from `page.tsx` (move to root layout)
- [ ] **1.14.6.** Remove page-transition GSAP code (App Router handles transitions via `loading.tsx`)

## 1.15 Per-Page Loading States

- [ ] **1.15.1.** `src/app/product/[slug]/loading.tsx` — product skeleton
- [ ] **1.15.2.** `src/app/blog/[slug]/loading.tsx` — article skeleton
- [ ] **1.15.3.** `src/app/(shop)/shop/loading.tsx` — product grid skeleton
- [ ] **1.15.4.** `src/app/account/loading.tsx` — account skeleton
- [ ] **1.15.5.** `src/app/admin/loading.tsx` — admin skeleton

## 1.16 Per-Page Error Boundaries

- [ ] **1.16.1.** `src/app/product/[slug]/error.tsx` — "Product not found" + link to shop
- [ ] **1.16.2.** `src/app/blog/[slug]/error.tsx` — "Article not found" + link to blog
- [ ] **1.16.3.** `src/app/error.tsx` — generic error boundary (gate error message behind NODE_ENV)

## 1.17 Update 404 Page

- [ ] **1.17.1.** Update `src/app/not-found.tsx` to use `<Link>` for navigation
- [ ] **1.17.2.** Add search bar to 404 page
- [ ] **1.17.3.** Add "popular pages" links to 404

### Phase 1 Verification Gate

- [ ] All 27 routes load successfully
- [ ] All hash URLs redirect to new URLs (test 27 cases)
- [ ] Cart state persists across route changes
- [ ] Wishlist state persists across route changes
- [ ] No `setPage()` calls remain in codebase
- [ ] No `selectedProduct` references in Zustand
- [ ] `npx tsc --noEmit` passes
- [ ] `npx eslint .` passes
- [ ] `npx next build` succeeds
- [ ] Lighthouse SEO = 100 on home page
- [ ] Manual smoke test: visit every route

---

# Phase 2: Cart Drawer Redesign

Based on D1 decision (recommendation: Option B — slide-in drawer).

## 2.1 Cart Drawer Design Spec

- [ ] **2.1.1.** Slide-in from right (not centered popup)
- [ ] **2.1.2.** Width: 420px desktop, 100% mobile
- [ ] **2.1.3.** Height: 100vh (full viewport)
- [ ] **2.1.4.** Overlay: rgba(44,44,44,0.5) + 2px blur
- [ ] **2.1.5.** Animation: 300ms slide-in, 200ms slide-out
- [ ] **2.1.6.** Close: ESC key, click outside, X button

## 2.2 Cart Drawer Sections

- [ ] **2.2.1.** Header: "Your Cart (N)" + close button
- [ ] **2.2.2.** Free-shipping progress bar (animated, shows "Add PKR X for free shipping")
- [ ] **2.2.3.** Cart items list:
  - Product thumbnail (80x80, lazy-loaded)
  - Product name (truncated to 2 lines)
  - Price (with original price strikethrough if on sale)
  - Quantity selector (input with +/- buttons, min 1, max 99)
  - Remove button (trash icon)
- [ ] **2.2.4.** Coupon code input + "Apply" button
- [ ] **2.2.5.** Order summary:
  - Subtotal
  - Discount (if coupon applied)
  - Shipping (calculated based on free-shipping threshold)
  - Total (bold, large)
- [ ] **2.2.6.** CTAs: "View Cart" (outline) + "Checkout" (gold)
- [ ] **2.2.7.** Trust badges: Secure Checkout, Free Returns, COD Available

## 2.3 Cart Drawer Accessibility

- [ ] **2.3.1.** `role="dialog"` + `aria-modal="true"`
- [ ] **2.3.2.** `aria-labelledby` pointing to header title
- [ ] **2.3.3.** Focus trap (already implemented — verify)
- [ ] **2.3.4.** Restore focus to trigger button on close (already done — verify)
- [ ] **2.3.5.** ESC key closes (already done — verify)
- [ ] **2.3.6.** Click outside closes (verify)
- [ ] **2.3.7.** All buttons have `aria-label`
- [ ] **2.3.8.** Quantity input is keyboard-accessible

## 2.4 Cart Drawer Interactions

- [ ] **2.4.1.** Add to cart: drawer opens with animation + toast notification
- [ ] **2.4.2.** Update quantity: debounced 300ms before updating store (prevent spam)
- [ ] **2.4.3.** Remove item: confirm with toast + "Undo" action button
- [ ] **2.4.4.** Apply coupon: validate against `AURA15`, `WELCOME10` codes
- [ ] **2.4.5.** Free shipping progress: animate bar smoothly when subtotal changes

## 2.5 Implement

- [ ] **2.5.1.** Rewrite `src/components/CartDrawer.tsx` per spec above
- [ ] **2.5.2.** Remove old centered popup implementation
- [ ] **2.5.3.** Test on mobile (375px, 414px)
- [ ] **2.5.4.** Test on desktop (1280px, 1920px)
- [ ] **2.5.5.** Test keyboard navigation
- [ ] **2.5.6.** Test screen reader (VoiceOver/NVDA)

### Phase 2 Verification Gate

- [ ] Cart drawer slides in from right
- [ ] Free-shipping progress bar animates
- [ ] Quantity selector works (input + buttons)
- [ ] Coupon codes work (AURA15, WELCOME10)
- [ ] Trust badges display
- [ ] Focus trap works
- [ ] ESC + click-outside close
- [ ] Lighthouse Accessibility = 100 on cart drawer

---

# Phase 3: SEO 100%

## 3.1 Per-Page Metadata

Add `generateMetadata` (or static `metadata` export) to every route:

- [ ] **3.1.1.** `src/app/page.tsx` (home) — title, description, OG, canonical
- [ ] **3.1.2.** `src/app/(shop)/shop/page.tsx` — title "Shop All Home Decor | Aura Living"
- [ ] **3.1.3.** `src/app/(shop)/new-arrivals/page.tsx`
- [ ] **3.1.4.** `src/app/(shop)/sale/page.tsx`
- [ ] **3.1.5.** `src/app/(shop)/lookbook/page.tsx`
- [ ] **3.1.6.** `src/app/product/[slug]/page.tsx` — dynamic metadata from product data
- [ ] **3.1.7.** `src/app/cart/page.tsx` — `noindex` (don't index cart)
- [ ] **3.1.8.** `src/app/checkout/page.tsx` — `noindex`
- [ ] **3.1.9.** `src/app/wishlist/page.tsx` — `noindex`
- [ ] **3.1.10.** `src/app/account/page.tsx` — `noindex`
- [ ] **3.1.11.** `src/app/account/orders/page.tsx` — `noindex`
- [ ] **3.1.12.** `src/app/account/addresses/page.tsx` — `noindex`
- [ ] **3.1.13.** `src/app/account/settings/page.tsx` — `noindex`
- [ ] **3.1.14.** `src/app/auth/login/page.tsx` — `noindex`
- [ ] **3.1.15.** `src/app/auth/signup/page.tsx` — `noindex`
- [ ] **3.1.16.** `src/app/auth/forgot-password/page.tsx` — `noindex`
- [ ] **3.1.17.** `src/app/blog/page.tsx`
- [ ] **3.1.18.** `src/app/blog/[slug]/page.tsx` — dynamic metadata
- [ ] **3.1.19.** `src/app/admin/page.tsx` — `noindex`
- [ ] **3.1.20.** `src/app/about/page.tsx`
- [ ] **3.1.21.** `src/app/contact/page.tsx`
- [ ] **3.1.22.** `src/app/faq/page.tsx`
- [ ] **3.1.23.** `src/app/shipping/page.tsx`
- [ ] **3.1.24.** `src/app/returns/page.tsx`
- [ ] **3.1.25.** `src/app/care-guide/page.tsx`
- [ ] **3.1.26.** `src/app/terms/page.tsx`
- [ ] **3.1.27.** `src/app/privacy/page.tsx`

## 3.2 Dynamic OG Images

- [ ] **3.2.1.** Install `@vercel/og` (built into Next.js 16 via `ImageResponse`)
- [ ] **3.2.2.** Create `src/app/opengraph-image.tsx` (home) — branded default
- [ ] **3.2.3.** Create `src/app/product/[slug]/opengraph-image.tsx` — product photo + name + price + logo
- [ ] **3.2.4.** Create `src/app/blog/[slug]/opengraph-image.tsx` — cover image + title
- [ ] **3.2.5.** Create `src/app/(shop)/shop/opengraph-image.tsx` — category collage
- [ ] **3.2.6.** Create `src/app/about/opengraph-image.tsx`
- [ ] **3.2.7.** Test OG images with Facebook Sharing Debugger + Twitter Card Validator

## 3.3 Structured Data Validation

Validate ALL JSON-LD in Google Rich Results Test:

- [ ] **3.3.1.** Organization schema (root layout) — verify
- [ ] **3.3.2.** WebSite schema with SearchAction (root layout) — verify
- [ ] **3.3.3.** Store schema with NAP + geo + hours (root layout) — verify
- [ ] **3.3.4.** Product schema (product page) — verify price, availability, rating
- [ ] **3.3.5.** Review schema (product page) — verify author, rating, date
- [ ] **3.3.6.** AggregateRating schema (product page) — verify
- [ ] **3.3.7.** BreadcrumbList schema (all pages via Breadcrumb component) — verify
- [ ] **3.3.8.** ItemList schema (shop page) — verify
- [ ] **3.3.9.** FAQPage schema (faq page) — verify
- [ ] **3.3.10.** BlogPosting schema (blog article page) — verify
- [ ] **3.3.11.** Add `Person` schema for testimonial authors (testimonials section)
- [ ] **3.3.12.** Add `Product` schema with `variant` for color/size options (product page)
- [ ] **3.3.13.** Add `VideoObject` schema if product videos added

## 3.4 Sitemap Overhaul

- [ ] **3.4.1.** Update `src/app/sitemap.ts` with real URLs (not hash URLs)
- [ ] **3.4.2.** Include all 27 static routes with correct priorities
- [ ] **3.4.3.** Include all 36 product pages (auto-generate from products data)
- [ ] **3.4.4.** Include all 8 blog article pages
- [ ] **3.4.5.** Add `lastModified` dates from product/article data
- [ ] **3.4.6.** Add `changeFrequency` per page type
- [ ] **3.4.7.** Create `src/app/sitemap-news.xml.ts` for blog articles
- [ ] **3.4.8.** Create `src/app/sitemap-images.xml.ts` for product images
- [ ] **3.4.9.** Submit sitemap to Google Search Console
- [ ] **3.4.10.** Submit sitemap to Bing Webmaster

## 3.5 Robots.txt

- [ ] **3.5.1.** Update `src/app/robots.ts`:
  ```
  User-Agent: *
  Allow: /
  Disallow: /admin
  Disallow: /account
  Disallow: /checkout
  Disallow: /cart
  Disallow: /auth
  Disallow: /api/
  Disallow: /_next/
  Disallow: /static/

  Sitemap: https://auraliving.com/sitemap.xml
  Host: https://auraliving.com
  ```

## 3.6 Canonical URLs

- [ ] **3.6.1.** Every page metadata includes `alternates.canonical`
- [ ] **3.6.2.** Product pages: canonical = `https://auraliving.com/product/{slug}`
- [ ] **3.6.3.** Blog pages: canonical = `https://auraliving.com/blog/{slug}`
- [ ] **3.6.4.** Self-referencing canonical on all pages (no duplicates)

## 3.7 Semantic HTML Audit

For every page, verify semantic structure:

- [ ] **3.7.1.** Exactly one `<h1>` per page (audit 7 violating files — see Current State)
- [ ] **3.7.2.** Use `<article>` for product cards (not `<div>`)
- [ ] **3.7.3.** Use `<address>` in contact page
- [ ] **3.7.4.** Use `<time dateTime={...}>` for order dates, article dates
- [ ] **3.7.5.** Use `<nav>` for pagination, breadcrumbs
- [ ] **3.7.6.** Use `<aside>` for sidebars
- [ ] **3.7.7.** Use `<figure>` + `<figcaption>` for product images
- [ ] **3.7.8.** Use `<main>` for main content (one per page)
- [ ] **3.7.9.** Use `<header>` and `<footer>` per page section

## 3.8 Internal Linking

- [ ] **3.8.1.** Related products on each product page (4-8 links)
- [ ] **3.8.2.** "Recently viewed" section (uses localStorage)
- [ ] **3.8.3.** Blog articles link to relevant products
- [ ] **3.8.4.** Footer links to all main pages
- [ ] **3.8.5.** Breadcrumbs on every page (except home)
- [ ] **3.8.6.** "Back to Shop" / "Continue Shopping" CTAs

## 3.9 Mobile-First Indexing

- [ ] **3.9.1.** Verify mobile layout matches desktop content
- [ ] **3.9.2.** No hidden content on mobile (Google penalizes)
- [ ] **3.9.3.** Test with Google Mobile-Friendly Test
- [ ] **3.9.4.** Verify viewport meta tag is correct

## 3.10 Image SEO

- [ ] **3.10.1.** All images have descriptive `alt` text
- [ ] **3.10.2.** Image filenames are descriptive (e.g. `hammered-brass-table-lamp.webp` not `IMG_1234.webp`)
- [ ] **3.10.3.** Images are lazy-loaded (next/image default)
- [ ] **3.10.4.** Images have width + height (CLS prevention)

### Phase 3 Verification Gate

- [ ] All 27 routes have unique metadata
- [ ] Google Rich Results Test passes for all JSON-LD
- [ ] Sitemap submitted to Google + Bing
- [ ] Canonical URLs correct on all pages
- [ ] Lighthouse SEO = 100 on all main pages
- [ ] Mobile-Friendly Test passes
- [ ] No `<div>` where `<article>`, `<address>`, `<time>` should be

---

# Phase 4: Performance 100%

## 4.1 Bundle Analysis

- [ ] **4.1.1.** Run `npm run analyze` (with `@next/bundle-analyzer`)
- [ ] **4.1.2.** Identify top 10 largest chunks
- [ ] **4.1.3.** Set budget: initial JS < 200 KB gzipped per route
- [ ] **4.1.4.** Set budget: total JS < 500 KB gzipped per route
- [ ] **4.1.5.** Document any chunks exceeding budget + plan to reduce

## 4.2 Core Web Vitals

### LCP (Largest Contentful Paint) < 2.5s

- [ ] **4.2.1.** Hero image: preload + `priority` + AVIF format
- [ ] **4.2.2.** Server-rendered content (not waiting for hydration)
- [ ] **4.2.3.** No render-blocking JS in `<head>`
- [ ] **4.2.4.** Inline critical CSS (Next.js does this)
- [ ] **4.2.5.** Test LCP with PageSpeed Insights on real mobile device

### CLS (Cumulative Layout Shift) < 0.1

- [ ] **4.2.6.** All `<Image>` use width/height (verify all 17 usages)
- [ ] **4.2.7.** Font-display: swap (already done — verify)
- [ ] **4.2.8.** Reserve space for ads/banners (if any)
- [ ] **4.2.9.** No injected DOM elements above-the-fold
- [ ] **4.2.10.** Test CLS with Chrome DevTools (Performance panel)

### INP (Interaction to Next Paint) < 200ms

- [ ] **4.2.11.** Debounce search input (300ms)
- [ ] **4.2.12.** Memoize expensive renders (`useMemo`, `React.memo`)
- [ ] **4.2.13.** Use `useTransition` for filter updates
- [ ] **4.2.14.** Avoid layout thrashing (batch DOM reads/writes)
- [ ] **4.2.15.** Test INP with Chrome DevTools (Performance panel)

### TTFB (Time to First Byte) < 800ms

- [ ] **4.2.16.** Use Vercel Edge Network (default)
- [ ] **4.2.17.** Cache static pages at edge (`revalidate` config)
- [ ] **4.2.18.** Test TTFB with WebPageTest.org

## 4.3 Image Optimization

- [ ] **4.3.1.** All product images in AVIF format (re-export from originals)
- [ ] **4.3.2.** Generate blur placeholders (`plaiceholder` library or manual base64)
- [ ] **4.3.3.** Use `sizes` prop correctly on every `<Image>` (verify 17 usages)
- [ ] **4.3.4.** Lazy-load below-the-fold images (default in next/image)
- [ ] **4.3.5.** Use `priority` only for above-the-fold images (hero, main product image)
- [ ] **4.3.6.** Verify `next.config.ts` images config (formats, deviceSizes, imageSizes)

## 4.4 Font Optimization

- [ ] **4.4.1.** Already using `next/font` (verify)
- [ ] **4.4.2.** Subset fonts to Latin + Latin Extended
- [ ] **4.4.3.** Preload critical font weights only (already done — verify)
- [ ] **4.4.4.** Remove unused font weights (already removed Playfair 800, Poppins 300)

## 4.5 Code Splitting

- [ ] **4.5.1.** App Router auto code-splits per route (verify)
- [ ] **4.5.2.** Lazy-load admin dashboard chunks (`next/dynamic`)
- [ ] **4.5.3.** Lazy-load review form (`next/dynamic`)
- [ ] **4.5.4.** Lazy-load blog comments (if added)
- [ ] **4.5.5.** Lazy-load cart drawer (already done — verify)
- [ ] **4.5.6.** Verify no unnecessary client components (use `'use client'` sparingly)

## 4.6 Caching Strategy

- [ ] **4.6.1.** Product page: `export const revalidate = 3600` (1 hour)
- [ ] **4.6.2.** Blog article: `export const revalidate = 86400` (1 day)
- [ ] **4.6.3.** Static pages (about, terms): `export const dynamic = 'force-static'`
- [ ] **4.6.4.** Shop page: `export const revalidate = 3600` (1 hour)
- [ ] **4.6.5.** API routes (future): `Cache-Control` headers

## 4.7 PWA Enhancements

- [ ] **4.7.1.** Update `public/sw.js` with offline fallback page
- [ ] **4.7.2.** Cache product images aggressively (already done — verify)
- [ ] **4.7.3.** Add `offline.html` fallback page
- [ ] **4.7.4.** Verify `manifest.json` is valid (test with Lighthouse PWA audit)

## 4.8 Performance Monitoring

- [ ] **4.8.1.** Enable Vercel Speed Insights
- [ ] **4.8.2.** Enable Vercel Web Analytics
- [ ] **4.8.3.** Set up alerting for Core Web Vitals regressions
- [ ] **4.8.4.** Real User Monitoring (RUM) via Vercel

## 4.9 Performance Testing

- [ ] **4.9.1.** Google PageSpeed Insights (mobile + desktop) on all main pages
- [ ] **4.9.2.** WebPageTest.org on home page
- [ ] **4.9.3.** Lighthouse CI in pre-commit hook
- [ ] **4.9.4.** Test on 3G connection (slow network)
- [ ] **4.9.5.** Test on real mobile device (not just emulator)

### Phase 4 Verification Gate

- [ ] All Core Web Vitals pass on home page (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Lighthouse Performance = 90+ on all main pages
- [ ] Bundle size < 200 KB gzipped per route
- [ ] No render-blocking resources
- [ ] All images use next/image with proper sizes
- [ ] PWA installable + offline support works

---

# Phase 5: Accessibility 100% (WCAG 2.2 AA)

## 5.1 Form Accessibility Audit (Critical — 6 forms missing aria-invalid)

For each form, add:
- `<label>` with `htmlFor` linked to input `id`
- `aria-invalid="true"` when error present
- `aria-describedby` linking to error message
- `role="alert"` on error message
- `aria-required="true"` for required fields
- Focus management on submit (move to first error)

- [ ] **5.1.1.** `AuthView.tsx` (login form) — add aria-invalid + role="alert"
- [ ] **5.1.2.** `AuthView.tsx` (signup form) — add aria-invalid + role="alert"
- [ ] **5.1.3.** `ForgotPasswordView.tsx` — add aria-invalid + role="alert"
- [ ] **5.1.4.** `ContactView.tsx` (contact form) — add aria-invalid + role="alert"
- [ ] **5.1.5.** `AddressesView.tsx` (address form) — add aria-invalid + role="alert"
- [ ] **5.1.6.** `SettingsView.tsx` (profile form) — add aria-invalid + role="alert"
- [ ] **5.1.7.** `NewsletterSection.tsx` (email capture) — add aria-invalid + role="alert"
- [ ] **5.1.8.** `ReviewForm.tsx` — verify (already done — verify)
- [ ] **5.1.9.** `CheckoutView.tsx` FormField — verify (already done — verify)
- [ ] **5.1.10.** Navbar search bar — verify has `aria-label`

## 5.2 Heading Hierarchy Fix (Critical — 7 files violate)

Audit each file and ensure exactly ONE `<h1>` per page:

- [ ] **5.2.1.** `AdminDashboard.tsx` — has 7 h1 tags → demote to h2/h3
- [ ] **5.2.2.** `AddressesView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.3.** `ArticleView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.4.** `CartView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.5.** `CheckoutView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.6.** `SettingsView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.7.** `TrackOrdersView.tsx` — has 2 h1 tags → demote one to h2
- [ ] **5.2.8.** Audit all 27 routes after Phase 1 migration — verify 1 h1 each

## 5.3 Color Contrast Audit

- [ ] **5.3.1.** Run Pa11y or axe-core on all pages
- [ ] **5.3.2.** Verify gold text on light backgrounds uses `#B8941F` (not `#D4AF37`)
- [ ] **5.3.3.** Verify `text-gold` only used on dark backgrounds (admin sidebar, newsletter section, hero section)
- [ ] **5.3.4.** Replace `#8A8A8A` muted-gray with `#5A5A5A` for small text (< 18px)
- [ ] **5.3.5.** Verify all button text meets 4.5:1 contrast
- [ ] **5.3.6.** Verify all placeholder text meets 3:1 contrast
- [ ] **5.3.7.** Verify all icon-only buttons have 3:1 contrast against background

## 5.4 Keyboard Navigation

- [ ] **5.4.1.** Tab order: visible + logical on all pages
- [ ] **5.4.2.** Skip-to-content link works (already done — verify on all routes)
- [ ] **5.4.3.** Focus trap in cart drawer (already done — verify)
- [ ] **5.4.4.** Add focus trap in mobile menu (Navbar)
- [ ] **5.4.5.** Add focus trap in search modal (if applicable)
- [ ] **5.4.6.** Arrow key navigation in mega menu (WAI-ARIA menu pattern)
- [ ] **5.4.7.** All interactive elements have visible focus indicator (`:focus-visible`)
- [ ] **5.4.8.** No keyboard traps (Tab can escape any modal)

## 5.5 Screen Reader Testing

- [ ] **5.5.1.** Test with NVDA (Windows) on all main pages
- [ ] **5.5.2.** Test with VoiceOver (Mac) on all main pages
- [ ] **5.5.3.** Test with TalkBack (Android) on mobile pages
- [ ] **5.5.4.** Verify all images have alt text (already done — verify)
- [ ] **5.5.5.** Verify all buttons have aria-label (audit icon-only buttons)
- [ ] **5.5.6.** Verify live regions for cart count (already done — verify)
- [ ] **5.5.7.** Verify live regions for toast notifications
- [ ] **5.5.8.** Verify form submission announcements

## 5.6 ARIA Labels Audit

- [ ] **5.6.1.** All icon-only buttons have `aria-label`
- [ ] **5.6.2.** All decorative images have `alt=""` (empty)
- [ ] **5.6.3.** All informative images have descriptive `alt`
- [ ] **5.6.4.** All form inputs have associated `<label>` (not just `aria-label`)
- [ ] **5.6.5.** All `<nav>` elements have `aria-label`
- [ ] **5.6.6.** All `<main>` elements have id="main-content"
- [ ] **5.6.7.** All modals have `role="dialog"` + `aria-modal="true"`
- [ ] **5.6.8.** All tablists use WAI-ARIA tabs pattern

## 5.7 Reduced Motion

- [ ] **5.7.1.** Verify `@media (prefers-reduced-motion: reduce)` exists in globals.css
- [ ] **5.7.2.** Test all animations respect this
- [ ] **5.7.3.** Disable GSAP when reduced motion preferred
- [ ] **5.7.4.** Disable Lenis smooth scroll when reduced motion preferred
- [ ] **5.7.5.** Test with `prefers-reduced-motion: reduce` in DevTools

## 5.8 Print Styles

- [ ] **5.8.1.** Add `@media print` CSS for product pages
- [ ] **5.8.2.** Hide nav, footer, ads when printing
- [ ] **5.8.3.** Show product name, price, image in print
- [ ] **5.8.4.** Add print styles for order confirmation page
- [ ] **5.8.5.** Add print styles for blog articles

## 5.9 Accessibility Testing

- [ ] **5.9.1.** Run axe-core automated scan on all pages
- [ ] **5.9.2.** Run Pa11y CI in pre-commit hook
- [ ] **5.9.3.** Run Lighthouse Accessibility audit (target 95+)
- [ ] **5.9.4.** Manual keyboard-only navigation test
- [ ] **5.9.5.** Manual screen reader test (NVDA + VoiceOver)
- [ ] **5.9.6.** Manual mobile accessibility test

### Phase 5 Verification Gate

- [ ] Lighthouse Accessibility = 95+ on all main pages
- [ ] axe-core: 0 violations
- [ ] All forms have aria-invalid + role="alert"
- [ ] All pages have exactly 1 h1
- [ ] All color contrast passes WCAG AA
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader test passes on all pages
- [ ] Reduced motion respected

---

# Phase 6: Design System 100%

## 6.1 Inline Style Migration (1,186 inline styles → < 100)

Top offenders (must migrate):

- [ ] **6.1.1.** `AdminDashboard.tsx` — 123 inline styles → Tailwind classes
- [ ] **6.1.2.** `Navbar.tsx` — 59 inline styles → Tailwind classes
- [ ] **6.1.3.** `CheckoutView.tsx` — 58 inline styles → Tailwind classes
- [ ] **6.1.4.** `SettingsView.tsx` — 57 inline styles → Tailwind classes
- [ ] **6.1.5.** `AddressesView.tsx` — 53 inline styles → Tailwind classes
- [ ] **6.1.6.** `ShopView.tsx` — 48 inline styles → Tailwind classes
- [ ] **6.1.7.** `ReturnsView.tsx` — 44 inline styles → Tailwind classes
- [ ] **6.1.8.** `AccountView.tsx` — 43 inline styles → Tailwind classes
- [ ] **6.1.9.** `CartView.tsx` — 41 inline styles → Tailwind classes
- [ ] **6.1.10.** `CartDrawer.tsx` — 40 inline styles → Tailwind classes
- [ ] **6.1.11.** All remaining files — migrate inline styles to Tailwind classes
- [ ] **6.1.12.** Verify < 100 inline styles remain (only for dynamic values)

## 6.2 Hardcoded Font References (121 → 0)

- [ ] **6.2.1.** Replace all `fontFamily: "'Poppins', sans-serif"` with `.aura-body` class
- [ ] **6.2.2.** Replace all `fontFamily: "'Playfair Display', serif"` with `.aura-h1/h2/h3/h4` class
- [ ] **6.2.3.** Verify 0 hardcoded font references remain

## 6.3 Inline Hex Colors (30 → 0)

- [ ] **6.3.1.** Find remaining 30 inline hex colors
- [ ] **6.3.2.** Replace with `var(--*)` tokens
- [ ] **6.3.3.** Verify 0 inline hex colors remain (except in globals.css)

## 6.4 Component Library Completion

Already have: PremiumButton, Breadcrumb, Input, Select, Textarea, FormRow, Card, Badge, Tabs, Modal, Checkbox, RadioGroup, Skeletons, Toast, Toaster.

Still need:

- [ ] **6.4.1.** `Pagination.tsx` — for shop, blog, admin tables
- [ ] **6.4.2.** `Accordion.tsx` — for FAQ (extract from FAQView)
- [ ] **6.4.3.** `Tooltip.tsx` — for icon buttons (Radix Tooltip)
- [ ] **6.4.4.** `Dropdown.tsx` — for sort, filter, account menu
- [ ] **6.4.5.** `EmptyState.tsx` — standardize across pages
- [ ] **6.4.6.** `ErrorState.tsx` — standardize 404/500 patterns
- [ ] **6.4.7.** `Avatar.tsx` — extract InitialsAvatar from testimonials

## 6.5 Typography Scale

- [ ] **6.5.1.** All headings use `.aura-h1` / `.aura-h2` / `.aura-h3` / `.aura-h4`
- [ ] **6.5.2.** All body text uses `.aura-body-large` / `.aura-body` / `.aura-body-small`
- [ ] **6.5.3.** Audit each page — replace ad-hoc `text-[28px] font-bold` patterns
- [ ] **6.5.4.** Verify fluid typography (clamp) works on all breakpoints

## 6.6 Spacing System

- [ ] **6.6.1.** Define spacing scale in globals.css:
  ```css
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  ```
- [ ] **6.6.2.** All components use these tokens (not arbitrary `py-4`, `mb-8`)
- [ ] **6.6.3.** Audit Tailwind classes — replace `py-4` with `py-md` etc. (or keep Tailwind defaults — they map to the same scale)

## 6.7 Dark Mode Decision (D12)

- [ ] **6.7.1.** If D12 = skip: Remove `darkMode: "class"` from tailwind.config.ts + `@custom-variant dark` from globals.css
- [ ] **6.7.2.** If D12 = implement: Add theme toggle in Navbar + dark: variants across all components

## 6.8 Storybook (D13)

- [ ] **6.8.1.** If D13 = build: Install Storybook + document all UI primitives
- [ ] **6.8.2.** If D13 = skip: Move on (recommended for v1)

### Phase 6 Verification Gate

- [ ] Inline styles < 100 (only for dynamic values)
- [ ] Hardcoded font references = 0
- [ ] Inline hex colors = 0 (except globals.css)
- [ ] All UI primitives built
- [ ] All typography uses `.aura-*` classes
- [ ] Lighthouse Best Practices = 95+

---

# Phase 7: Content 100%

## 7.1 Product Content Polish

- [ ] **7.1.1.** Verify all 36 products have unique descriptions (already done — verify)
- [ ] **7.1.2.** Write unique dimensions per product (currently 6 distinct values for 36 products)
- [ ] **7.1.3.** Write unique weights per product (currently 6 distinct values)
- [ ] **7.1.4.** Verify all products have warranty text (39 unique + 6 default — verify)
- [ ] **7.1.5.** Add `colorOptions` field with swatches for products with variants
- [ ] **7.1.6.** Add `sizeOptions` field where applicable
- [ ] **7.1.7.** Add `tags` field for filtering (e.g., "minimalist", "traditional", "modern")
- [ ] **7.1.8.** Add `relatedProductIds` field for manual curation
- [ ] **7.1.9.** Standardize image aspect ratio (all 1:1 OR all 3:4 — currently mixed)
- [ ] **7.1.10.** Add product videos (optional — future)

## 7.2 Reviews for All Products

- [ ] **7.2.1.** Currently: 53 mock reviews for 12 products
- [ ] **7.2.2.** Add 3-8 reviews for remaining 24 products (target: 100+ total reviews)
- [ ] **7.2.3.** OR: Hide review section for products with 0 reviews (show "Be the first to review" CTA)
- [ ] **7.2.4.** Verify ReviewForm works on all product pages

## 7.3 Blog Content

- [ ] **7.3.1.** Currently: 8 articles
- [ ] **7.3.2.** Write 4-7 more articles (target: 12-15 for launch):
  - [ ] "How to Choose Wall Art for Your Living Room"
  - [ ] "Brass vs Copper vs Bronze: A Decor Guide"
  - [ ] "5 Easy Ways to Refresh Your Bedroom Under PKR 10,000"
  - [ ] "The Psychology of Color in Home Decor"
  - [ ] "Pakistani Wedding Decor Trends 2025"
  - [ ] "How to Care for Indoor Plants in Lahore's Climate"
  - [ ] "Upcycling Old Furniture: A Step-by-Step Guide"
- [ ] **7.3.3.** Generate blog cover images (or use Unsplash placeholders per D15)

## 7.4 Real Testimonials

- [ ] **7.4.1.** Currently: 22 testimonials with initials-based avatars
- [ ] **7.4.2.** Curate to top 12 most authentic-sounding
- [ ] **7.4.3.** If real customer photos available: replace InitialsAvatar
- [ ] **7.4.4.** If not: keep InitialsAvatar (looks clean, on-brand)

## 7.5 FAQ Expansion

Currently 14 FAQs. Add:

- [ ] **7.5.1.** "Do you offer gift cards?"
- [ ] **7.5.2.** "Do you offer wholesale/bulk pricing?"
- [ ] **7.5.3.** "Do you ship internationally?"
- [ ] **7.5.4.** "What are your sustainability practices?"
- [ ] **7.5.5.** "How long do custom orders take?"
- [ ] **7.5.6.** "How do I care for [specific material]?"
- [ ] **7.5.7.** "Can I return sale items?"
- [ ] **7.5.8.** "Do you price match?"
- [ ] **7.5.9.** Update FAQPage JSON-LD with new entries

## 7.6 About Page Polish

- [ ] **7.6.1.** Real founder story (verify current content)
- [ ] **7.6.2.** Real workshop photos (replace placeholder images)
- [ ] **7.6.3.** Real artisan profiles
- [ ] **7.6.4.** Certifications/awards (if any)
- [ ] **7.6.5.** Press mentions (if any)

## 7.7 Contact Page

- [ ] **7.7.1.** Verify real address (currently: "123 Artisan Lane, Gulberg III, Lahore" — likely placeholder)
- [ ] **7.7.2.** Verify real phone number (currently: "+92 300 1234567" — placeholder format)
- [ ] **7.7.3.** Add WhatsApp business link
- [ ] **7.7.4.** Add Google Maps embed
- [ ] **7.7.5.** Verify real social media links
- [ ] **7.7.6.** Test contact form (currently mocked — future backend)

## 7.8 Care Guide Expansion

- [ ] **7.8.1.** Currently: 6 care categories with one-liner tips
- [ ] **7.8.2.** Expand each tip to 2-3 sentence paragraph with reasoning
- [ ] **7.8.3.** Add video tutorials (optional — future)
- [ ] **7.8.4.** Add downloadable PDF care guide (optional — future)

## 7.9 Shipping/Returns Policy

- [ ] **7.9.1.** Verify shipping rates (currently PKR 250/500/800)
- [ ] **7.9.2.** Verify free shipping threshold (currently PKR 2,999)
- [ ] **7.9.3.** Verify return window (currently 14 days)
- [ ] **7.9.4.** Verify refund timeline (currently 5-7 business days)
- [ ] **7.9.5.** Add "Track My Return" feature (optional — future)

### Phase 7 Verification Gate

- [ ] All 36 products have unique dimensions/weights
- [ ] All products have colorOptions + tags fields
- [ ] 12+ blog articles published
- [ ] FAQ has 20+ questions
- [ ] Contact info is real (not placeholder)
- [ ] Care guide tips are paragraph-form
- [ ] All shipping/returns info is accurate

---

# Phase 8: Production Polish

## 8.1 Error Handling

- [ ] **8.1.1.** `src/app/not-found.tsx` — custom 404 (verify works)
- [ ] **8.1.2.** `src/app/error.tsx` — error boundary (gate error message behind NODE_ENV)
- [ ] **8.1.3.** `src/app/global-error.tsx` — root-level error boundary
- [ ] **8.1.4.** `src/app/product/[slug]/error.tsx` — product not found
- [ ] **8.1.5.** `src/app/blog/[slug]/error.tsx` — article not found
- [ ] **8.1.6.** `public/offline.html` — offline fallback for PWA
- [ ] **8.1.7.** Test all error pages manually

## 8.2 Loading States

- [ ] **8.2.1.** Global `src/app/loading.tsx` (verify)
- [ ] **8.2.2.** `src/app/product/[slug]/loading.tsx`
- [ ] **8.2.3.** `src/app/blog/[slug]/loading.tsx`
- [ ] **8.2.4.** `src/app/(shop)/shop/loading.tsx`
- [ ] **8.2.5.** `src/app/account/loading.tsx`
- [ ] **8.2.6.** `src/app/admin/loading.tsx`
- [ ] **8.2.7.** Cart drawer skeleton (when opening)
- [ ] **8.2.8.** Search results skeleton (when typing)

## 8.3 Toast Notifications

Already have toast system. Add toasts for:

- [ ] **8.3.1.** ✅ Add to cart (already done — verify)
- [ ] **8.3.2.** ✅ Remove from cart (already done — verify)
- [ ] **8.3.3.** ✅ Wishlist add/remove (already done — verify)
- [ ] **8.3.4.** ✅ Out-of-stock (already done — verify)
- [ ] **8.3.5.** ✅ Max quantity reached (already done — verify)
- [ ] **8.3.6.** Coupon applied (verify)
- [ ] **8.3.7.** Coupon rejected (verify)
- [ ] **8.3.8.** Form submission success (add to all forms)
- [ ] **8.3.9.** Form submission error (add to all forms)
- [ ] **8.3.10.** Signed in successfully
- [ ] **8.3.11.** Signed out successfully
- [ ] **8.3.12.** Address added/updated/deleted
- [ ] **8.3.13.** Settings saved

## 8.4 Empty States

Already good for Cart, Wishlist, Shop. Add for:

- [ ] **8.4.1.** Account orders (no orders yet) — with "Start Shopping" CTA
- [ ] **8.4.2.** Account addresses (no addresses saved) — with "Add Address" CTA
- [ ] **8.4.3.** Account wishlist (no wishlist items) — with "Browse Products" CTA
- [ ] **8.4.4.** Search results (no matches) — with "Clear Filters" CTA
- [ ] **8.4.5.** Blog category (no articles in category) — with "View All Articles" CTA

## 8.5 Form Validation

- [ ] **8.5.1.** Client-side: real-time validation with aria-feedback (mostly done)
- [ ] **8.5.2.** Add password strength meter on signup
- [ ] **8.5.3.** Add email format validation (regex)
- [ ] **8.5.4.** Add phone number format validation (Pakistani: +92 XXX XXXXXXX)
- [ ] **8.5.5.** Add ZIP code validation (5 digits for Pakistan)
- [ ] **8.5.6.** Add credit card validation (when payment gateway integrated)

## 8.6 Analytics Integration (D6)

- [ ] **8.6.1.** If D6 = GA4: Install `@next/third-parties` + add GA4 script
- [ ] **8.6.2.** If D6 = Plausible: Add Plausible script via `next/script`
- [ ] **8.6.3.** If D6 = Vercel Analytics: Enable in Vercel dashboard
- [ ] **8.6.4.** Track page views (automatic)
- [ ] **8.6.5.** Track events: `add_to_cart`, `begin_checkout`, `search`, `filter_used`, `blog_read`
- [ ] **8.6.6.** Set up conversion goals (when backend ready: `purchase`)

## 8.7 Cookie Consent Banner (D10)

- [ ] **8.7.1.** If D10 = required/recommended: Build cookie consent banner
- [ ] **8.7.2.** Store preference in localStorage
- [ ] **8.7.3.** Load analytics only if accepted
- [ ] **8.7.4.** Add "Cookie Policy" link to footer

## 8.8 Search Functionality (D7)

- [ ] **8.8.1.** If D7 = Pagefind: Install + configure + build index
- [ ] **8.8.2.** If D7 = Algolia: Install + configure + index data
- [ ] **8.8.3.** If D7 = keep current: Verify client-side search works
- [ ] **8.8.4.** Create `/search?q=lamp` route for full search page
- [ ] **8.8.5.** Add search bar to Navbar (already done — verify)
- [ ] **8.8.6.** Add search to 404 page

## 8.9 Live Chat (D9)

- [ ] **8.9.1.** If D9 = Tawk.to: Add Tawk.to script via `next/script`
- [ ] **8.9.2.** If D9 = Crisp: Add Crisp script via `next/script`
- [ ] **8.9.3.** Place bottom-right, doesn't conflict with back-to-top button
- [ ] **8.9.4.** Test on mobile + desktop

## 8.10 Email Capture (D11)

- [ ] **8.10.1.** If D11 = Mailchimp: Connect newsletter form to Mailchimp API
- [ ] **8.10.2.** If D11 = Klaviyo: Connect newsletter form to Klaviyo API
- [ ] **8.10.3.** If D11 = Resend: Connect newsletter form to Resend API
- [ ] **8.10.4.** Add welcome email automation
- [ ] **8.10.5.** Cart abandonment emails (future — needs backend)

## 8.11 Social Proof

- [ ] **8.11.1.** Instagram feed embed (if active Instagram account)
- [ ] **8.11.2.** "As seen in" press logos (if any press)
- [ ] **8.11.3.** Customer photo grid (UGC) — future

## 8.12 Trust Badges

- [ ] **8.12.1.** SSL certificate (Vercel handles)
- [ ] **8.12.2.** "Secure Checkout" badge in checkout page
- [ ] **8.12.3.** Payment method icons: COD, JazzCash, EasyPaisa, Visa, Mastercard
- [ ] **8.12.4.** Return policy badge in footer
- [ ] **8.12.5.** Free shipping threshold indicator (already have — verify)

## 8.13 Security Headers

- [ ] **8.13.1.** Content Security Policy (CSP) in `next.config.ts`
- [ ] **8.13.2.** `X-Frame-Options: DENY`
- [ ] **8.13.3.** `X-Content-Type-Options: nosniff`
- [ ] **8.13.4.** `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] **8.13.5.** `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] **8.13.6.** `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] **8.13.7.** Test headers with securityheaders.com

### Phase 8 Verification Gate

- [ ] All error pages work (404, 500, product not found, article not found)
- [ ] All loading states display correctly
- [ ] All toasts fire on appropriate actions
- [ ] All empty states display correctly
- [ ] All forms validate correctly
- [ ] Analytics installed + tracking
- [ ] Search works
- [ ] Live chat works (if D9 selected)
- [ ] Email capture works (if D11 selected)
- [ ] Security headers pass audit

---

# Phase 9: Testing & QA

## 9.1 Lighthouse Audit

Run Lighthouse on every page. Target:

- [ ] **9.1.1.** Performance: 90+
- [ ] **9.1.2.** Accessibility: 95+
- [ ] **9.1.3.** Best Practices: 95+
- [ ] **9.1.4.** SEO: 100
- [ ] **9.1.5.** Document any pages that don't meet targets + fix

## 9.2 Cross-Browser Testing

Test on:

- [ ] **9.2.1.** Chrome (latest) — Windows + Mac
- [ ] **9.2.2.** Safari (latest) — Mac + iOS
- [ ] **9.2.3.** Firefox (latest) — Windows + Mac
- [ ] **9.2.4.** Edge (latest) — Windows
- [ ] **9.2.5.** Samsung Internet (Android)
- [ ] **9.2.6.** Opera (optional)

## 9.3 Mobile Testing

Test on real devices:

- [ ] **9.3.1.** iPhone 12/13/14/15 (Safari)
- [ ] **9.3.2.** Samsung Galaxy S21/S22/S23 (Chrome)
- [ ] **9.3.3.** iPad (Safari)
- [ ] **9.3.4.** Budget Android (small screen, slow CPU)

## 9.4 Responsive Audit

Test at every breakpoint:

- [ ] **9.4.1.** 320px (small mobile)
- [ ] **9.4.2.** 375px (iPhone SE)
- [ ] **9.4.3.** 414px (iPhone Plus)
- [ ] **9.4.4.** 768px (iPad portrait)
- [ ] **9.4.5.** 1024px (iPad landscape)
- [ ] **9.4.6.** 1280px (small laptop)
- [ ] **9.4.7.** 1440px (standard laptop)
- [ ] **9.4.8.** 1920px (desktop)

## 9.5 Accessibility Audit

- [ ] **9.5.1.** axe-core automated scan on all pages
- [ ] **9.5.2.** NVDA screen reader test (Windows)
- [ ] **9.5.3.** VoiceOver screen reader test (Mac)
- [ ] **9.5.4.** Keyboard-only navigation test
- [ ] **9.5.5.** Color contrast checker
- [ ] **9.5.6.** Lighthouse Accessibility audit

## 9.6 Performance Testing

- [ ] **9.6.1.** Google PageSpeed Insights (mobile + desktop)
- [ ] **9.6.2.** WebPageTest.org
- [ ] **9.6.3.** Vercel Speed Insights
- [ ] **9.6.4.** Test on 3G connection (slow network)

## 9.7 SEO Validation

- [ ] **9.7.1.** Google Rich Results Test (all structured data)
- [ ] **9.7.2.** Google Mobile-Friendly Test
- [ ] **9.7.3.** Google PageSpeed Insights
- [ ] **9.7.4.** Bing SEO Analyzer
- [ ] **9.7.5.** Ahrefs/Semrush site audit (if subscription)
- [ ] **9.7.6.** Submit sitemap to Google Search Console
- [ ] **9.7.7.** Submit sitemap to Bing Webmaster

## 9.8 Security Scan

- [ ] **9.8.1.** Vercel handles DDoS, SSL, headers
- [ ] **9.8.2.** Test headers with securityheaders.com (target A+)
- [ ] **9.8.3.** Audit third-party scripts (analytics, chat, etc.)
- [ ] **9.8.4.** No sensitive data in client-side code
- [ ] **9.8.5.** No API keys in client-side code

## 9.9 User Acceptance Testing

- [ ] **9.9.1.** Place 5-10 mock orders (when checkout works)
- [ ] **9.9.2.** Test all 27 routes manually
- [ ] **9.9.3.** Test all forms
- [ ] **9.9.4.** Test cart/wishlist/checkout flow
- [ ] **9.9.5.** Test account creation/login
- [ ] **9.9.6.** Test search and filters
- [ ] **9.9.7.** Test mobile and desktop
- [ ] **9.9.8.** Test email capture
- [ ] **9.9.9.** Test contact form
- [ ] **9.9.10.** Test live chat (if installed)

## 9.10 E2E Testing (Playwright)

- [ ] **9.10.1.** Install Playwright
- [ ] **9.10.2.** Write E2E tests for critical paths:
  - Home → Shop → Product → Cart → Checkout
  - Search → Filter → Product → Wishlist
  - Account → Orders → Addresses → Settings
  - Blog → Article → Related Article
- [ ] **9.10.3.** Run E2E tests in CI (future)

### Phase 9 Verification Gate

- [ ] Lighthouse 90+ on all categories for all main pages
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge, Samsung)
- [ ] Mobile tested on real devices
- [ ] Responsive at all breakpoints
- [ ] axe-core: 0 violations
- [ ] Core Web Vitals pass
- [ ] Google Rich Results Test passes
- [ ] Security headers: A+ rating
- [ ] E2E tests pass

---

# Phase 10: Launch

## 10.1 Pre-Launch

- [ ] **10.1.1.** Custom domain purchased (auraliving.com or .pk per D8)
- [ ] **10.1.2.** DNS pointed to Vercel
- [ ] **10.1.3.** SSL certificate active (Vercel auto)
- [ ] **10.1.4.** Google Search Console verified
- [ ] **10.1.5.** Bing Webmaster verified
- [ ] **10.1.6.** Sitemap submitted to both
- [ ] **10.1.7.** Google Analytics 4 configured (or Plausible/Vercel per D6)
- [ ] **10.1.8.** Vercel Analytics enabled
- [ ] **10.1.9.** All redirects tested (old hash → new URLs — test 27 cases)
- [ ] **10.1.10.** All 27 routes manually tested
- [ ] **10.1.11.** Lighthouse 90+ on all categories
- [ ] **10.1.12.** Mobile responsive verified
- [ ] **10.1.13.** Cross-browser verified
- [ ] **10.1.14.** Accessibility audit passed
- [ ] **10.1.15.** Performance budget met
- [ ] **10.1.16.** Error pages tested (404, 500)
- [ ] **10.1.17.** Forms tested (all of them)
- [ ] **10.1.18.** Cart/checkout flow tested
- [ ] **10.1.19.** Newsletter signup tested
- [ ] **10.1.20.** Contact form tested

## 10.2 Launch Day

- [ ] **10.2.1.** Deploy to production (push to main → Vercel auto-deploys)
- [ ] **10.2.2.** Verify all URLs work in production
- [ ] **10.2.3.** Submit sitemap to Google (final)
- [ ] **10.2.4.** Test in incognito mode
- [ ] **10.2.5.** Monitor Vercel logs for errors
- [ ] **10.2.6.** Have rollback plan ready (revert commit)

## 10.3 Post-Launch (Week 1)

- [ ] **10.3.1.** Monitor Google Search Console for indexing
- [ ] **10.3.2.** Monitor analytics for traffic
- [ ] **10.3.3.** Monitor Core Web Vitals (Vercel Speed Insights)
- [ ] **10.3.4.** Fix any bugs reported
- [ ] **10.3.5.** Submit to Pakistani directories (Hamariweb, etc.)
- [ ] **10.3.6.** Announce on social media
- [ ] **10.3.7.** Send launch email to newsletter

## 10.4 Post-Launch (Month 1)

- [ ] **10.4.1.** A/B test cart drawer CTA copy
- [ ] **10.4.2.** Optimize top exit pages
- [ ] **10.4.3.** Add more blog content (target 20+ articles)
- [ ] **10.4.4.** Collect real customer reviews
- [ ] **10.4.5.** Plan backend integration (auth, payments, orders)

### Phase 10 Verification Gate

- [ ] Site live at auraliving.com (or .pk)
- [ ] All URLs return 200
- [ ] Sitemap submitted
- [ ] Analytics tracking
- [ ] No errors in Vercel logs
- [ ] Core Web Vitals pass on production

---

# Appendix A: File Inventory (Post-Migration)

## New Files to Create

```
src/app/
├── (shop)/shop/page.tsx
├── (shop)/shop/loading.tsx
├── (shop)/new-arrivals/page.tsx
├── (shop)/sale/page.tsx
├── (shop)/lookbook/page.tsx
├── product/[slug]/page.tsx
├── product/[slug]/loading.tsx
├── product/[slug]/error.tsx
├── product/[slug]/opengraph-image.tsx
├── cart/page.tsx
├── checkout/page.tsx
├── wishlist/page.tsx
├── account/layout.tsx
├── account/page.tsx
├── account/orders/page.tsx
├── account/addresses/page.tsx
├── account/settings/page.tsx
├── account/loading.tsx
├── auth/login/page.tsx
├── auth/signup/page.tsx
├── auth/forgot-password/page.tsx
├── blog/page.tsx
├── blog/[slug]/page.tsx
├── blog/[slug]/loading.tsx
├── blog/[slug]/opengraph-image.tsx
├── admin/layout.tsx
├── admin/page.tsx
├── admin/loading.tsx
├── about/page.tsx
├── contact/page.tsx
├── faq/page.tsx
├── shipping/page.tsx
├── returns/page.tsx
├── care-guide/page.tsx
├── terms/page.tsx
├── privacy/page.tsx
├── global-error.tsx
├── opengraph-image.tsx (home)
├── sitemap-news.xml.ts
└── sitemap-images.xml.ts

src/components/ui/
├── Pagination.tsx
├── Accordion.tsx
├── Tooltip.tsx
├── Dropdown.tsx
├── EmptyState.tsx
├── ErrorState.tsx
└── Avatar.tsx

public/
├── offline.html
└── (blog cover images if D15 = generate)
```

## Files to Delete (Post-Migration)

```
src/app/page.tsx (SPA routing logic — replaced by home page server component)
src/hooks/useHashRedirect.ts (if created for legacy redirects — keep if needed)
```

## Files to Heavily Modify

```
src/app/layout.tsx (add Navbar/Footer/CartDrawer globally)
src/app/page.tsx (rewrite as server component)
src/app/sitemap.ts (real URLs)
src/app/robots.ts (update disallow list)
src/app/next.config.ts (security headers)
src/middleware.ts (hash redirects + admin guard)
src/store/useStore.ts (remove SPA state)
src/data/products.ts (add slug field + unique specs)
src/components/Navbar.tsx (use <Link>)
src/components/Footer.tsx (use <Link>)
src/components/CartDrawer.tsx (redesign per Phase 2)
src/components/Breadcrumb.tsx (use href instead of onClick)
src/components/PremiumButton.tsx (add href prop)
src/components/*View.tsx (all 27 views — remove setPage calls)
```

---

# Appendix B: Risk Register

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Routing migration breaks existing functionality | High | Medium | Keep old page.tsx as fallback during migration |
| SEO ranking drops during migration | Medium | Low | 301 redirects preserve all link equity |
| Animations break on route change | Medium | Medium | Test GSAP hooks; use `key={pathname}` to re-mount |
| Bundle size grows with new routes | Low | Low | App Router auto code-splits per route |
| Cart drawer redesign confuses users | Low | Low | A/B test old vs new |
| Performance regression | Medium | Low | Continuous Lighthouse monitoring |
| Accessibility regressions | Medium | Medium | axe-core in CI |
| Form validation errors after refactor | Medium | Medium | E2E tests for all forms |
| Cart state lost during navigation | High | Low | Zustand persist handles this |
| Mobile layout breaks at new breakpoints | Medium | Medium | Test at every breakpoint |

---

# Appendix C: Success Metrics (Post-Launch)

## Performance

- [ ] LCP < 2.5s on 75th percentile (mobile)
- [ ] CLS < 0.1 on all pages
- [ ] INP < 200ms on all pages
- [ ] Lighthouse Performance 90+ on all main pages

## Accessibility

- [ ] Lighthouse Accessibility 95+ on all pages
- [ ] axe-core: 0 violations
- [ ] WCAG 2.2 AA compliance verified

## SEO

- [ ] Lighthouse SEO 100 on all main pages
- [ ] Google Rich Results Test passes for all JSON-LD
- [ ] Sitemap indexed in Google Search Console
- [ ] All 27 routes indexed within 30 days

## Business

- [ ] Site live at auraliving.com (or .pk)
- [ ] First sale within 7 days
- [ ] 100+ unique visitors/day within 30 days
- [ ] Bounce rate < 50%

---

# Appendix D: Web Standards Reference Links

## Performance
- Core Web Vitals: https://web.dev/articles/vitals
- Lighthouse: https://developer.chrome.com/docs/lighthouse
- PageSpeed Insights: https://pagespeed.web.dev

## Accessibility
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA: https://www.w3.org/TR/wai-aria-1.2/
- axe-core: https://github.com/dequelabs/axe-core
- Pa11y: https://pa11y.org/

## SEO
- Google Search Central: https://developers.google.com/search/docs
- Schema.org: https://schema.org/
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

## Next.js
- App Router: https://nextjs.org/docs/app
- Metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Image Optimization: https://nextjs.org/docs/app/api-reference/components/image
- Font Optimization: https://nextjs.org/docs/app/api-reference/components/font

## Security
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- securityheaders.com: https://securityheaders.com/
- Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

## PWA
- PWA Criteria: https://web.dev/articles/install-criteria
- Lighthouse PWA: https://developer.chrome.com/docs/lighthouse/pwa/

---

# Appendix E: Decision Log

Record all decisions made during execution:

| Decision | Choice | Date | Reasoning |
|---|---|---|---|
| D1 (Cart drawer) | TBD | | |
| D2 (Migration approach) | TBD | | |
| D3 (Product URL) | TBD | | |
| D4 (Account structure) | TBD | | |
| D5 (Admin protection) | TBD | | |
| D6 (Analytics) | TBD | | |
| D7 (Search) | TBD | | |
| D8 (Domain) | TBD | | |
| D9 (Live chat) | TBD | | |
| D10 (Cookie consent) | TBD | | |
| D11 (Email capture) | TBD | | |
| D12 (Dark mode) | TBD | | |
| D13 (Storybook) | TBD | | |
| D14 (PWA enhancement) | TBD | | |
| D15 (Blog images) | TBD | | |

---

# Progress Tracking

## Phase Completion Status

| Phase | Status | Started | Completed | Notes |
|---|---|---|---|---|
| 0 — Critical Decisions | ⏳ Pending | | | Awaiting user guidance |
| 1 — Routing Migration | ⏳ Pending | | | |
| 2 — Cart Drawer Redesign | ⏳ Pending | | | |
| 3 — SEO 100% | ⏳ Pending | | | |
| 4 — Performance 100% | ⏳ Pending | | | |
| 5 — Accessibility 100% | ⏳ Pending | | | |
| 6 — Design System 100% | ⏳ Pending | | | |
| 7 — Content 100% | ⏳ Pending | | | |
| 8 — Production Polish | ⏳ Pending | | | |
| 9 — Testing & QA | ⏳ Pending | | | |
| 10 — Launch | ⏳ Pending | | | |

**Legend**: ⏳ Pending | 🔄 In Progress | ✅ Complete | ❌ Blocked

---

**END OF DOCUMENT**

> This is a living document. Update it as decisions are made and tasks are completed.
> Every checkbox represents a concrete, verifiable task.
> No task is "done" until its checkbox is `[x]` AND its verification gate passes.
>
> **Next step**: Review decisions D1-D15, then I'll begin Phase 0 (Setup) followed by Phase 1 (Routing Migration).
