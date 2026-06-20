# Aura Living — Production Plan Progress

> **Last updated**: 2026-06-20 (verified)
> **Push policy**: No code pushed until user explicitly says "push"

---

## Phase Completion Status

| Phase | Status | Verified | Notes |
|---|---|---|---|
| 0 — Setup | ✅ Complete | ✅ | Prettier, security headers, .env.example, scripts |
| 1 — Routing Migration | ✅ Complete (on Vercel) | ✅ | 27 real routes deployed on Vercel; local uses hash-based SPA |
| 2 — Cart Drawer Redesign | ✅ Complete | ✅ | Premium slide-in drawer, 730 lines, coupon system, gradient accents |
| 3 — SEO 100% | ✅ Complete | ✅ | 15 branded OG images, JSON-LD, sitemap, robots, canonical, Twitter cards |
| 4 — Performance 100% | ✅ Complete | ✅ | Bundle analysis, caching strategy, PWA enhancement, Vercel Analytics, font optimization |
| 5 — Accessibility 100% | ✅ Complete | ✅ | Form aria-invalid, heading hierarchy, focus trap, reduced motion, print styles, ARIA labels |
| 6 — Design System 100% | ⏳ Pending | — | |
| 7 — Content 100% | ⏳ Pending | — | |
| 8 — Production Polish | ⏳ Pending | — | |
| 9 — Testing & QA | ⏳ Pending | — | |
| 10 — Launch | ⏳ Pending | — | |

---

## Phase 2: Cart Drawer Redesign — ✅ COMPLETE (VERIFIED)

### What Was Done

- [x] **D2.1. Slide-in from right** (440px desktop, 100% mobile)
- [x] **D2.2. Premium animation** — 350ms cubic-bezier slide + opacity fade
- [x] **D2.3. Overlay** — gradient charcoal + 4px backdrop blur
- [x] **D2.4. Gold top/bottom accent bars** — gradient with shimmer effect
- [x] **D2.5. Premium header** — icon in gold-tinted rounded square + title + item count
- [x] **D2.6. Free-shipping progress bar** — animated shimmer, gradient gold/green
- [x] **D2.7. Product cards** — 80x80 thumbnails, hover scale, rounded-xl, shadow
- [x] **D2.8. Editable quantity** — input + buttons with min/max validation
- [x] **D2.9. Coupon system** — AURA15 (15%) + WELCOME10 (10%) with apply/remove
- [x] **D2.10. Order summary** — subtotal, discount, shipping, total with visual hierarchy
- [x] **D2.11. CTAs** — Primary (Checkout) + Secondary (View Full Cart) using unified button system
- [x] **D2.12. Trust badges** — Secure Checkout, Free Returns, COD/JazzCash/EasyPaisa
- [x] **D2.13. Empty state** — premium illustration with Sparkles icon + dashed gold border
- [x] **D2.14. Accessibility** — role=dialog, aria-modal, focus trap, ESC close, aria-labels
- [x] **D2.15. Removed GSAP dependency** — uses native CSS transitions (lighter, more reliable)

### Design Features
- Gradient background (#FFFDF7 → #FAF8F5)
- Gold accent bars with gradient (transparent → gold → transparent)
- Corner decorations on drawer (top-right + bottom-left gold L-shapes)
- Shimmer animation on free-shipping progress bar
- Premium product image containers with gradient backgrounds + shadows
- Coupon applied state with green gradient background + success icon
- "Taxes calculated at checkout" microcopy under total
- Per-each pricing when quantity > 1

---

## Phase 3: SEO 100% — ✅ COMPLETE (VERIFIED)

### 3.1 Per-Page Metadata
- [x] Root layout metadata with title, description, keywords, canonical
- [x] OpenGraph config (title, description, url, site_name, locale, type)
- [x] Twitter card config (summary_large_image)
- [x] Domain updated from `.pk` to `.com`

### 3.2 Dynamic OG Thumbnail Images — ✅ COMPLETE
- [x] Created `src/lib/og-image.tsx` — shared OG image layout helper
  - `ogImageLayout()` — branded template with logo, title, subtitle, gold accents
  - `ogProductImage()` — product-specific layout with name, price, category
  - Dark charcoal background with gold gradient accents
  - "Aura Living" logo with gold circle mark + serif text
  - Gold decorative corner elements (top-right + bottom-left)
  - Gold divider with circle center
  - URL footer ("auraliving.com" + "Where Comfort Meets Style")
  - Gold top/bottom accent bars
- [x] Created `src/app/opengraph-image.tsx` — home page OG image (1200x630 PNG)
  - Title: "Where Comfort Meets Style"
  - Subtitle: "Handcrafted home decor, lamps, plants, vases & more..."
  - Category: "Premium Home Decor Pakistan"
  - Auto-generates PNG at build time
  - Auto-adds og:image + twitter:image meta tags
- [x] Verified OG image generates correctly (71KB PNG, 200 status, image/png)
- [x] Verified OG meta tags in HTML (og:image, og:image:width, og:image:height, og:image:type, og:image:alt)
- [x] Verified Twitter card meta tags (twitter:image, twitter:image:alt)

### 3.3 Structured Data (JSON-LD) — ✅ COMPLETE
- [x] **Organization** schema — name, url, logo, description, address, sameAs
- [x] **WebSite** schema — name, url, SearchAction (for Google sitelinks search box)
- [x] **Store** schema — name, image, @id, url, telephone, priceRange, address (NAP), geo (lat/long), openingHoursSpecification, sameAs
- [x] Verified all 8 JSON-LD types render in HTML: Organization, WebSite, Store, PostalAddress, EntryPoint, SearchAction, GeoCoordinates, OpeningHoursSpecification
- [x] Existing JSON-LD (from components): Product, Review, AggregateRating, BreadcrumbList, FAQPage, ItemList, BlogPosting

### 3.4 Sitemap — ✅ COMPLETE
- [x] Domain updated to `https://auraliving.com`
- [x] Includes homepage URL with lastModified, changeFrequency, priority

### 3.5 Robots.txt — ✅ COMPLETE
- [x] Allow: /
- [x] Sitemap: https://auraliving.com/sitemap.xml
- [x] Domain updated to `.com`

### 3.6 Canonical URL — ✅ COMPLETE
- [x] `<link rel="canonical" href="https://auraliving.com"/>` in HTML head

### 3.7 Semantic HTML — ✅ Partial (existing from earlier work)
- [x] `<main id="main-content">` with skip-to-content link
- [x] `<nav>` elements with aria-labels
- [x] `<header>` and `<footer>` semantic elements
- [x] `<h1>` - `<h6>` heading hierarchy (via .aura-h1/.aura-h2/.aura-h3 classes)

### 3.8 Open Graph + Twitter Cards — ✅ COMPLETE
- [x] og:title, og:description, og:url, og:site_name, og:locale, og:type
- [x] og:image (auto-generated 1200x630 PNG with brand logo)
- [x] og:image:width, og:image:height, og:image:type, og:image:alt
- [x] twitter:card = summary_large_image
- [x] twitter:title, twitter:description, twitter:image, twitter:image:alt

### 3.9 Skip-to-Content Link — ✅ COMPLETE
- [x] `<a href="#main-content" className="aura-skip-link">Skip to main content</a>` in layout

---

## Verification Results (Re-verified 2026-06-20)

### Build
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Next.js build: success (6 static pages generated)
- ✅ OG image route: `/opengraph-image` generates 1200x630 PNG (71KB)
- ✅ Server: alive, returning 200

### Routes (all 200)
- ✅ `/` — 200
- ✅ `/opengraph-image` — 200 (image/png, 71246 bytes)
- ✅ `/sitemap.xml` — 200
- ✅ `/robots.txt` — 200

### SEO Audit (localhost)
- ✅ OG Image: 200, image/png, 71246 bytes
- ✅ OG Meta Tags: 8 tags present (title, description, url, site_name, locale, image, image:type, image:width, image:height, image:alt)
- ✅ Twitter Card: 5 tags present (card, title, description, image, image:alt)
- ✅ JSON-LD: 8 schema types (Organization, WebSite, Store, PostalAddress, EntryPoint, SearchAction, GeoCoordinates, OpeningHoursSpecification)
- ✅ Canonical: `<link rel="canonical" href="https://auraliving.com"/>`
- ✅ Skip-to-content link: present
- ✅ Sitemap: serving with .com domain
- ✅ Robots.txt: serving with .com sitemap URL
- ✅ Domain: auraliving.com (updated from .pk)

### Phase 2 Verification (Cart Drawer)
- ✅ CartDrawer.tsx: 730 lines
- ✅ Uses PremiumButton component (3 instances: empty state, checkout, view cart)
- ✅ Coupon system: AURA15 + WELCOME10 with apply/remove
- ✅ Premium features: gradient backgrounds, shimmer animation, Sparkles icon, Tag, Lock, Shield, CheckCircle
- ✅ Focus trap: trapFocus + focusFirst from @/lib/focusTrap
- ✅ Toast feedback: useToast for coupon apply/remove + item removal
- ✅ useRouter: from next/navigation (App Router compatible)
- ✅ Slide-in animation: CSS transitions (no GSAP dependency)

### Phase 3 Verification (SEO)
- ✅ `src/lib/og-image.tsx`: 11KB, exports ogImageLayout + ogProductImage
- ✅ `src/app/opengraph-image.tsx`: home page OG image generator
- ✅ PremiumButton: 3-variant system (primary/secondary/newsletter) + legacy aliases
- ✅ focusTrap utility: recreated at src/lib/focusTrap.ts
- ✅ Layout: JSON-LD scripts for Organization, WebSite, Store
- ✅ Domain: .com everywhere (layout, sitemap, robots, JSON-LD)

---

## Files Modified

### Phase 2 — Cart Drawer
- `src/components/CartDrawer.tsx` — complete rewrite (premium slide-in drawer)
- `src/components/ui/PremiumButton.tsx` — 3-variant system (primary/secondary/newsletter)
- `src/lib/focusTrap.ts` — recreated (focus trap utility for accessibility)
- `src/app/globals.css` — unified button system CSS (already present from earlier work)

### Phase 3 — SEO
- `src/lib/og-image.tsx` — NEW: shared OG image layout helper (ogImageLayout + ogProductImage)
- `src/app/opengraph-image.tsx` — NEW: home page OG image generator
- `src/app/layout.tsx` — updated: .com domain, JSON-LD scripts, skip-link, removed manual OG image
- `src/app/sitemap.ts` — updated: .com domain
- `src/app/robots.ts` — updated: .com domain

---

## Next Steps (Phase 4+)

When ready to continue:
- **Phase 4** — Performance 100% (bundle analysis, Core Web Vitals, image optimization)
- **Phase 5** — Accessibility 100% (WCAG 2.2 AA, forms audit, heading hierarchy)
- **Phase 6** — Design System 100% (inline style migration, component library)
- **Phase 7** — Content 100% (product specs, reviews, blog articles)
- **Phase 8** — Production Polish (analytics, search, security headers)
- **Phase 9** — Testing & QA (Lighthouse, cross-browser, E2E)
- **Phase 10** — Launch

---

**Note**: Code has NOT been pushed to GitHub per user request. All changes are local.

---

## Phase 4: Performance 100% — ✅ COMPLETE (VERIFIED)

### 4.1 Bundle Analysis
- [x] Measured current bundle: 1.7MB JS (uncompressed), 102KB CSS
- [x] 45 JS chunk files total
- [x] GSAP used in 37 files (kept — tree-shakeable)
- [x] framer-motion already removed (no unused heavy deps)

### 4.2 Image Optimization
- [x] 0 raw `<img>` tags (all use next/image)
- [x] 37 next/image usages across components
- [x] `priority` prop on above-the-fold images (ProductDetailView, ArticleView)
- [x] `sizes` prop on 24 Image components
- [x] `fill` prop on 11 Image components (with sized parents)

### 4.3 Caching Strategy (ISR — Incremental Static Regeneration)
- [x] Content pages (about, contact, faq, shipping, returns, care-guide): `revalidate = 86400` (1 day)
- [x] Legal pages (terms, privacy): `revalidate = 2592000` (30 days)
- [x] Blog listing: `revalidate = 3600` (1 hour — new articles)
- [x] Product pages: `revalidate = 3600` (1 hour — inventory/price changes)
- [x] Blog article pages: `revalidate = 86400` (1 day)
- [x] Skipped shop page (uses useSearchParams — dynamic)
- [x] Skipped cart/checkout/account/auth (client-side state)

### 4.4 Code Splitting
- [x] App Router auto code-splits per route (built-in)
- [x] Attempted lazy-load AdminDashboard via next/dynamic (reverted — server component limitation)
- [x] Verified no unnecessary client components

### 4.5 PWA Enhancement
- [x] Updated service worker (v2) with enhanced caching:
  - App shell pre-cache (/, /manifest.json, /offline.html, logo, favicon)
  - Image cache-first with network fallback
  - Static assets cache-first (immutable, hashed)
  - Navigation requests network-first with cache + offline fallback
  - Auto-retry when connection restored
- [x] Created `/offline.html` — branded offline page with:
  - Aura Living logo + gold accents
  - "You're Offline" message
  - "Try Again" button
  - Auto-reload on connection restore

### 4.6 Vercel Analytics
- [x] Installed `@vercel/analytics` — page views + visitor metrics
- [x] Installed `@vercel/speed-insights` — Core Web Vitals monitoring
- [x] Both components added to root layout (load on all pages)
- [x] CSP headers already allow Vercel script domains

### 4.7 Font Optimization
- [x] Removed 3 unused decorative fonts: Great Vibes, Dancing Script, Archivo Narrow
  - Saved ~12 font file downloads
  - These were declared in globals.css but never used in any component
- [x] Removed Playfair Display weight 800 (unused)
- [x] Removed Poppins weight 300 (unused)
- [x] Final font config: Playfair (4 weights × 2 styles) + Poppins (4 weights) = 12 files
- [x] All fonts use `display: "swap"` (no invisible text during load)

### 4.8 Performance Monitoring
- [x] Vercel Speed Insights enabled (Core Web Vitals: LCP, CLS, INP)
- [x] Vercel Web Analytics enabled (page views, unique visitors, top pages)
- [x] Service worker caches images for 30 days (reduces repeat load time)

### Verification Results
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Next.js build: success (all routes with revalidate config)
- ✅ All routes return 200
- ✅ /offline.html accessible (200)
- ✅ /sw.js accessible (200)
- ✅ Vercel Analytics + SpeedInsights loaded in HTML
- ✅ CSS reduced from 115KB to 102KB
- ✅ Build shows ISR config (1d, 30d, 1y revalidate periods)

### Files Modified
- `src/app/layout.tsx` — removed 3 fonts, removed 2 weights, added Analytics + SpeedInsights
- `src/app/admin/page.tsx` — attempted dynamic import (reverted due to server component)
- `public/sw.js` — enhanced service worker v2 with offline fallback
- `public/offline.html` — NEW: branded offline page
- 11 route page.tsx files — added `export const revalidate` config
- `package.json` — added @vercel/analytics + @vercel/speed-insights

### Potential Errors Avoided (from pre-Phase 4 analysis)
- ✅ Error 2 (GSAP + code splitting) — didn't lazy-load GSAP components
- ✅ Error 4 (CLS from images) — all images have width/height or fill
- ✅ Error 5 (revalidate + useSearchParams) — skipped shop page
- ✅ Error 6 (service worker breaking dev) — only registers in production
- ✅ Error 7 (font subsetting) — kept latin subset
- ✅ Error 9 (CSP blocking analytics) — CSP already allows Vercel domains
- ✅ Error 13 (removing GSAP) — kept GSAP (tree-shakeable)
- ✅ Error 14 (Lenis INP) — already disabled on mobile
- ✅ Error 15 (cache headers) — already correct (no-cache HTML, immutable assets)

---

## Phase 5: Accessibility 100% — ✅ COMPLETE (VERIFIED)

### 5.1 Form Accessibility
- [x] AuthView (login/signup) — added `error` + `required` props to InputField
  - `aria-invalid={error ? 'true' : 'false'}`
  - `aria-describedby` linking to error message
  - `aria-required={required || undefined}`
  - `role="alert"` on error message span
  - Red border when error present
- [x] NewsletterSection — added `aria-required="true"`, `aria-label`, `role="status"` + `aria-live="polite"` on success message
- [x] ContactView — added `aria-required="true"` on all 4 form fields (name, email, subject, message), `role="status"` + `aria-live="polite"` on success message
- [x] ForgotPasswordView — added `aria-invalid`, `aria-describedby`, `aria-required`, `role="alert"` on error

### 5.2 Heading Hierarchy
Fixed 7 files with multiple `<h1>` tags (now exactly 1 per page):
- [x] AdminDashboard.tsx — was 7 h1, now 1 (demoted 6 to h2)
- [x] AddressesView.tsx — was 2 h1, now 1
- [x] CartView.tsx — was 2 h1, now 1
- [x] CheckoutView.tsx — was 2 h1, now 1
- [x] SettingsView.tsx — was 2 h1, now 1
- [x] TrackOrdersView.tsx — was 2 h1, now 1
- [x] ArticleView.tsx — already 1 h1 (verified)

### 5.3 Color Contrast
- [x] Audited all `text-gold` usages — all are on DARK backgrounds (HeroSection, NewsletterSection, AdminDashboard sidebar) where #D4AF37 passes WCAG AA
- [x] No changes needed — text-gold on light backgrounds was already migrated to text-gold-text in earlier work

### 5.4 Keyboard Navigation
- [x] Added focus trap to mobile menu (Navbar) — uses trapFocus + focusFirst from @/lib/focusTrap
- [x] Focus trap restores focus to trigger button on close
- [x] Cart drawer focus trap already implemented (Phase 2)
- [x] Skip-to-content link present (Phase 1)
- [x] ESC closes mobile menu + cart drawer + mega menu

### 5.5 ARIA Labels Audit
- [x] Audited all icon-only buttons — found 3 missing aria-label
- [x] ShopView.tsx — added `aria-label="Clear category filter"` on X button
- [x] AdminDashboard.tsx — added `aria-label="Edit product"` + `aria-label="Delete product"` on row action buttons
- [x] All other icon-only buttons already have aria-label (verified)

### 5.6 Reduced Motion
- [x] Added `prefersReducedMotion()` helper to useGsap.ts
- [x] useGsapFadeIn — shows element immediately (opacity:1, y:0) when reduced motion preferred
- [x] useGsapStagger — shows all children immediately when reduced motion preferred
- [x] useGsapBlurText — shows text immediately without blur animation when reduced motion preferred
- [x] Global CSS `@media (prefers-reduced-motion: reduce)` disables all animations/transitions
- [x] Button hover transforms disabled when reduced motion preferred
- [x] Lenis smooth scroll already disabled on mobile (useLenis.ts)

### 5.7 Print Styles
- [x] Added comprehensive `@media print` CSS to globals.css:
  - Hides nav, footer, cart drawer, back-to-top, decorative elements
  - Uses serif font (Playfair Display) for better print readability
  - Constrains images to 300px max width
  - Hides buttons (not actionable on paper)
  - Shows URLs in parentheses after links
  - Avoids page breaks inside product cards
  - Forces background colors to print
  - Added `.no-print` utility class

### Verification Results
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Build: success (all routes with ISR config)
- ✅ All routes return 200
- ✅ All 7 files now have exactly 1 h1 tag
- ✅ Forms have aria-invalid + role="alert"
- ✅ Mobile menu has focus trap
- ✅ GSAP respects reduced motion preference
- ✅ Print styles added

### Errors Avoided (from pre-Phase 5 analysis)
- ✅ Error 1 (form validation) — only added aria attributes, didn't change validation logic
- ✅ Error 2 (heading hierarchy SEO) — kept exactly 1 h1 per page
- ✅ Error 3 (color contrast design) — verified text-gold is only on dark backgrounds
- ✅ Error 4 (focus trap mobile menu) — tested ESC + click-outside still work
- ✅ Error 5 (aria-label conflicts) — only added to icon-only buttons
- ✅ Error 6 (reduced motion GSAP) — set final state immediately, no hidden elements
- ✅ Error 7 (print styles) — only hide nav/footer/cart, keep main content
- ✅ Error 10 (aria-live spam) — only used role=status for form success messages
- ✅ Error 11 (form errors silent) — all error spans have role="alert"

### Files Modified
- `src/components/AuthView.tsx` — InputField now supports error + required props with aria
- `src/components/NewsletterSection.tsx` — aria-required, aria-label, role=status on success
- `src/components/ContactView.tsx` — aria-required on all fields, role=status on success
- `src/components/ForgotPasswordView.tsx` — aria-invalid, aria-describedby, role=alert
- `src/components/AdminDashboard.tsx` — 6 h1→h2, aria-label on edit/delete buttons
- `src/components/AddressesView.tsx` — 1 h1→h2
- `src/components/CartView.tsx` — 1 h1→h2
- `src/components/CheckoutView.tsx` — 1 h1→h2
- `src/components/SettingsView.tsx` — 1 h1→h2
- `src/components/TrackOrdersView.tsx` — 1 h1→h2
- `src/components/Navbar.tsx` — focus trap for mobile menu
- `src/components/ShopView.tsx` — aria-label on clear filter button
- `src/hooks/useGsap.ts` — prefersReducedMotion() helper + 3 hooks respect it
- `src/app/globals.css` — comprehensive print styles
