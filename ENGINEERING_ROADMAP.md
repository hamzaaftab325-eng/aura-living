# Aura Living — Professional Engineering Roadmap

> **Version**: 2.1 (Codebase Cleaned — 2026-06-21)
> **Goal**: Transform current codebase into a production-grade ecommerce platform
> **Philosophy**: Preserve existing UI/UX, business logic, SEO, and accessibility. Rebuild ONLY the engineering architecture.
> **Inspiration**: Webflow/WordPress-level professional structure — clean, maintainable, scalable.

---

## 🧹 Codebase Cleanup Status (Completed 2026-06-21)

| What | Status |
|---|---|
| Old planning docs (BUTTON_SYSTEM_AUDIT, PRODUCTION_PLAN, PROFESSIONAL_CLEANUP_PLAN) | ✅ Deleted |
| Old home.html | ✅ Deleted |
| Old shell scripts (run-no-cache.sh, run-server.sh) | ✅ Deleted |
| Log files (dev.log, server.log, prod.log, build.log) | ✅ Deleted |
| Worklog (worklog.md) | ✅ Deleted |
| Upload directory (temp screenshots) | ✅ Cleared |
| Migration scripts (20+ Python files) | ✅ Deleted |
| Mini-services directory | ✅ Deleted |
| .zscripts directory | ✅ Deleted |
| console.log statements | ✅ Only 2 remain (error handler + SW registration — legitimate) |
| TODO/FIXME comments | ✅ None found |
| Commented-out code | ✅ Only documentation comments remain |
| Unused imports | ✅ ESLint clean (0 errors) |
| TypeScript | ✅ 0 errors |
| Build | ✅ PASS |

### Files Remaining in Root Directory

```
/home/z/my-project/
├── ENGINEERING_ROADMAP.md    ← This document (single source of truth)
├── start-server.sh           ← Server startup script
├── .env                      ← Environment variables
├── .env.example              ← Environment template
├── .gitignore
├── .prettierrc
├── .prettierignore
├── bun.lock
├── package-lock.json
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json
├── Caddyfile
└── server.pid
```

Clean. No dead files. No old docs. No temp scripts.

---

## 📋 Executive Summary

This document is the **single source of truth** for the complete frontend rebuild.
It covers 13 phases, from design system creation to production QA.
The success criteria are absolute: **Zero inline styles, zero duplicate UI, complete design system, professional component library.**

---

## ✅ Success Criteria (Final Acceptance Checklist)

The project is ONLY complete when ALL of the following are true:

- [ ] Zero inline styles (only dynamic values like `${progress}%`)
- [ ] Zero duplicate components
- [ ] Zero duplicate CSS
- [ ] Zero hardcoded colors (all use semantic tokens)
- [ ] Zero hardcoded spacing (all use spacing scale)
- [ ] Zero arbitrary typography (all use typography classes)
- [ ] Complete design token system (colors, typography, spacing, radius, shadows, motion, breakpoints)
- [ ] Complete typography system (Hero Display through Caption/Label)
- [ ] Complete animation system (centralized hooks, no inline animation declarations)
- [ ] Complete button system (3 variants: Primary, Secondary, Newsletter)
- [ ] Complete card system (ProductCard, CategoryCard, BlogCard, etc.)
- [ ] Complete form system (Input, Select, Textarea, Checkbox, Radio, Switch)
- [ ] Complete layout system (Container, Grid, Section, SectionHeader)
- [ ] Fully reusable component library (40+ components)
- [ ] CSS split into 10+ files (tokens.css, typography.css, buttons.css, etc.)
- [ ] WCAG AA compliant
- [ ] Lighthouse Performance 95+
- [ ] Lighthouse Accessibility 100
- [ ] Lighthouse Best Practices 100
- [ ] Lighthouse SEO 100
- [ ] Production ready
- [ ] Senior developer code review ready
- [ ] Easily maintainable for future development

---

## 📊 Phase Status Overview

| Phase | Name | Status | Est. Time |
|---|---|---|---|
| 0 | Codebase Audit | ✅ Done | — |
| 1 | Design System | ⚠️ 70% — needs completion | 2 hours |
| 2 | CSS Architecture | ❌ Not started — need to split globals.css | 2 hours |
| 3 | Component Library | ⚠️ 60% — 25/40 components built | 4 hours |
| 4 | Animation System | ✅ 90% — 7 hooks built, 4/37 files migrated | 2 hours |
| 5 | Layout System | ⚠️ 60% — need Container, Grid, Row components | 1 hour |
| 6 | Page Rebuild | ❌ 10% — 27 pages need rebuilding | 8-10 hours |
| 7 | Forms | ⚠️ 40% — primitives exist, not used everywhere | 2 hours |
| 8 | Accessibility | ✅ 85% — Phase 5 done, need final audit | 1 hour |
| 9 | Performance | ✅ 85% — Phase 4 done, need Lighthouse verification | 1 hour |
| 10 | SEO | ✅ 90% — Phase 3 done, need schema validation | 30 min |
| 11 | Code Quality | ⚠️ 60% — 384 inline styles remain | 2 hours |
| 12 | Engineering Standards | ⚠️ 40% — need ESLint rules + strict enforcement | 1 hour |
| 13 | Production QA | ❌ Not started | 2 hours |
| | **Total Remaining** | | **~30 hours** |

---

## Phase 0 — Codebase Audit ✅ DONE

Completed across multiple sessions. Full metrics:

| Metric | Current Value |
|---|---|
| Total source files | 75+ |
| Total lines of code | 23,000+ |
| Inline styles remaining | 384 (was 1,200) |
| Hardcoded font references | 0 (was 92) |
| Arbitrary text sizes | 0 (was 43) |
| Design tokens | 126 (was 62) |
| Utility classes | 208 (was 56) |
| UI components | 25 (was 17) |
| GSAP animation hooks | 7 (was 0) |

---

## Phase 1 — Design System (COMPLETE THIS)

**Objective**: Build a complete design system with semantic tokens.

### 1.1 Color System (Semantic Names)

Create semantic color tokens (not just raw hex names):

```css
/* ─── Semantic Colors ─── */
--color-primary: var(--color-gold);              /* #D4AF37 */
--color-primary-hover: var(--color-gold-hover);  /* #C9A22E */
--color-primary-text: var(--color-gold-text);    /* #B8941F (WCAG AA) */
--color-secondary: var(--color-sage);            /* #A8B5A0 */
--color-accent: var(--color-gold-pale);          /* #F5EDDA */
--color-success: #22C55E;
--color-success-bg: rgba(34, 197, 94, 0.08);
--color-warning: #F59E0B;
--color-warning-bg: rgba(245, 158, 11, 0.08);
--color-danger: #DC2626;
--color-danger-bg: rgba(220, 38, 38, 0.08);
--color-info: #3B82F6;
--color-info-bg: rgba(59, 130, 246, 0.08);

/* ─── Surfaces ─── */
--surface-base: var(--surface-page);             /* #FAF8F5 */
--surface-elevated: var(--surface-card);         /* #FFFDF7 */
--surface-accent: var(--surface-accent);         /* #F5EDDA */
--surface-dark: var(--surface-dark);             /* #2C2C2C */
--surface-overlay: rgba(44, 44, 44, 0.5);

/* ─── Text ─── */
--text-primary: #2C2C2C;
--text-secondary: #5A5A5A;
--text-muted: #8A8A8A;
--text-on-primary: #FFFFFF;
--text-on-dark: #FFFFFF;
--text-gold: #B8941F;
--text-disabled: #B0B0B0;
--text-placeholder: #8A8A8A;

/* ─── Borders ─── */
--border-default: var(--color-gold-soft);        /* #E8D5A3 */
--border-primary: var(--color-gold);             /* #D4AF37 */
--border-subtle: rgba(232, 213, 163, 0.4);
--border-muted: rgba(232, 213, 163, 0.3);
--border-strong: var(--color-gold);
--border-success: rgba(34, 197, 94, 0.25);
--border-danger: rgba(220, 38, 38, 0.2);

/* ─── Dividers ─── */
--divider-default: rgba(232, 213, 163, 0.4);
--divider-strong: var(--color-gold-soft);
```

### 1.2 Typography System (Complete Hierarchy)

```css
/* ─── Display ─── */
.aura-hero-display { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(44px, 8vw, 96px); line-height: 1.1; letter-spacing: -0.03em; }
.aura-display-large { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(36px, 6vw, 72px); line-height: 1.2; letter-spacing: -0.02em; }
.aura-display-medium { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(28px, 4vw, 44px); line-height: 1.2; letter-spacing: -0.02em; }

/* ─── Headings ─── */
.aura-h1 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(32px, 5vw, 48px); line-height: 1.2; letter-spacing: -0.02em; }
.aura-h2 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(28px, 4vw, 36px); line-height: 1.3; letter-spacing: -0.01em; }
.aura-h3 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: clamp(22px, 3vw, 28px); line-height: 1.3; letter-spacing: -0.01em; }
.aura-h4 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: clamp(18px, 2vw, 22px); line-height: 1.4; }
.aura-h5 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: clamp(16px, 1.5vw, 18px); line-height: 1.4; }
.aura-h6 { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.875rem; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em; }

/* ─── Body ─── */
.aura-body-xl { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: clamp(18px, 2vw, 22px); line-height: 1.6; }
.aura-body-large { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: clamp(16px, 1.8vw, 20px); line-height: 1.6; }
.aura-body { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: clamp(15px, 1.5vw, 17px); line-height: 1.6; }
.aura-body-small { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: clamp(13px, 1.2vw, 15px); line-height: 1.5; }

/* ─── Special ─── */
.aura-caption { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 0.75rem; line-height: 1.4; color: var(--text-muted); }
.aura-label { font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 0.875rem; line-height: 1.4; color: var(--text-secondary); }
.aura-button-text { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
.aura-nav-text { font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 0.875rem; letter-spacing: 0.02em; }
.aura-price { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1.125rem; color: var(--text-primary); }
.aura-eyebrow { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--text-gold); }
```

### 1.3 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 1.4 Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 20px;
--radius-full: 9999px;
```

### 1.5 Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.10);
--shadow-xl: 0 16px 50px rgba(0, 0, 0, 0.14);
--shadow-floating: 0 8px 30px rgba(0, 0, 0, 0.12);
--shadow-modal: 0 20px 60px rgba(0, 0, 0, 0.15);
--shadow-dropdown: 0 4px 20px rgba(0, 0, 0, 0.10);
--shadow-gold: 0 4px 20px rgba(212, 175, 55, 0.15);
```

### 1.6 Motion

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--transition-fast: var(--duration-fast) var(--ease-out);
--transition-normal: var(--duration-normal) var(--ease-out);
--transition-slow: var(--duration-slow) var(--ease-out);
```

### 1.7 Breakpoints

```css
--bp-mobile: 320px;
--bp-sm: 640px;   /* Tablet portrait */
--bp-md: 768px;   /* Tablet landscape */
--bp-lg: 1024px;  /* Laptop */
--bp-xl: 1280px;  /* Desktop */
--bp-2xl: 1536px; /* Ultra wide */
```

---

## Phase 2 — CSS Architecture

**Objective**: Split the 1,300-line globals.css into 10+ organized files.

### New CSS File Structure

```
src/app/styles/
├── tokens.css          ← All CSS custom properties (colors, spacing, radius, etc.)
├── typography.css      ← All .aura-h1 through .aura-caption classes
├── buttons.css         ← .btn-primary, .btn-secondary, .btn-newsletter + sizes
├── forms.css           ← Input, Select, Textarea, Checkbox, Radio styles
├── cards.css           ← .aura-card, .aura-card-flat, .aura-card-hover
├── navigation.css      ← Navbar, Footer, Breadcrumb, Mega Menu styles
├── animations.css      ← Keyframes + animation utility classes
├── utilities.css       ← .aura-bg-*, .aura-text-*, .aura-border-*, .aura-shadow-*
├── responsive.css      ← Media queries for mobile/tablet/desktop
└── globals.css         ← Imports all above + base reset + body styles
```

### Implementation

```css
/* globals.css — imports all modular CSS files */
@import "tailwindcss";
@import "tw-animate-css";

@import "./styles/tokens.css";
@import "./styles/typography.css";
@import "./styles/buttons.css";
@import "./styles/forms.css";
@import "./styles/cards.css";
@import "./styles/navigation.css";
@import "./styles/animations.css";
@import "./styles/utilities.css";
@import "./styles/responsive.css";

/* Base reset + body styles only */
@layer base { ... }
```

---

## Phase 3 — Component Library (Build 15 Missing)

**Objective**: Complete the 40+ component library.

### Components to Build

| # | Component | Location | Replaces |
|---|---|---|---|
| 1 | **ProductCard** | `ui/ProductCard.tsx` | Duplicated in Shop, Sale, NewArrivals, Wishlist, Featured |
| 2 | **CategoryCard** | `ui/CategoryCard.tsx` | Duplicated in CategoriesSection + Shop |
| 3 | **BlogCard** | `ui/BlogCard.tsx` | Duplicated in BlogView |
| 4 | **Accordion** | `ui/Accordion.tsx` | Inline in FAQView |
| 5 | **Chip** | `ui/Chip.tsx` | Inline filter tags in ShopView |
| 6 | **Avatar** | `ui/Avatar.tsx` | Inline InitialsAvatar in testimonials |
| 7 | **Tooltip** | `ui/Tooltip.tsx` | Not yet built |
| 8 | **Container** | `ui/Container.tsx` | Inline max-w-7xl wrappers |
| 9 | **Grid** | `ui/Grid.tsx` | Inline grid classes |
| 10 | **Hero** | `ui/Hero.tsx` | Inline hero sections |
| 11 | **SearchBar** | `ui/SearchBar.tsx` | Inline in Navbar |
| 12 | **MegaMenu** | `ui/MegaMenu.tsx` | Inline in Navbar |
| 13 | **Switch** | `ui/Switch.tsx` | Inline toggle in SettingsView |
| 14 | **OrderRow** | `ui/OrderRow.tsx` | Inline in TrackOrdersView + AccountView |
| 15 | **FormField** | `ui/FormField.tsx` | Inline in CheckoutView + AddressesView |

### Component Template (Professional Standard)

Every component follows this template:

```typescript
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { useCartActions } from '@/hooks/useCartActions';
import { formatPKR } from '@/data/products';
import Badge from './Badge';
import PriceTag from './PriceTag';
import RatingStars from './RatingStars';

/**
 * ProductCard — Displays a single product in grid layouts.
 *
 * Used in: Shop, Sale, NewArrivals, Wishlist, FeaturedProducts
 *
 * @param product - The product data to display
 * @param variant - Card variant ('default' | 'compact' | 'horizontal')
 * @param showRating - Whether to show star rating
 * @param showBadge - Whether to show NEW/SALE/BESTSELLER badge
 *
 * @example
 * <ProductCard product={product} variant="default" showRating />
 */
export default function ProductCard({
  product,
  variant = 'default',
  showRating = true,
  showBadge = true,
}: {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  showRating?: boolean;
  showBadge?: boolean;
}) {
  // ... clean implementation, zero inline styles, uses .aura-* classes
}
```

---

## Phase 4 — Animation System (Wire Into All Pages)

**Objective**: Migrate ALL 37 files from old `useGsap.ts` hooks to new `useAnimations.ts` hooks.

### Migration Map

| Old Hook (useGsap.ts) | New Hook (useAnimations.ts) | Files Using |
|---|---|---|
| `useGsapFadeIn` | `useScrollReveal` | 15 files |
| `useGsapBlurText` | `useTextReveal` | 12 files |
| `useGsapStagger` | `useStaggerReveal` | 10 files |
| `useGsapScaleIn` | `useScaleIn` | 8 files |
| `useGsapCountUp` | `useCountUp` | 3 files |
| Inline `gsap.context()` | `useGSAP()` | 20 files |

### After Migration
- Delete `src/hooks/useGsap.ts` (legacy file)
- All animations use `@gsap/react`'s `useGSAP()` for auto-cleanup
- All animations respect `prefers-reduced-motion`
- Zero inline `useEffect` + `gsap.context()` patterns

---

## Phase 5 — Layout System

**Objective**: Standardize all layout patterns.

### Layout Components

```typescript
<Container maxWidth="wide">    // max-w-7xl, centered, px-4 sm:px-6 lg:px-8
<Section padding="lg">         // py-12 sm:py-16 md:py-20
<Grid cols={4} gap="md">       // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
<SectionHeader                 // eyebrow + title + subtitle + divider
  eyebrow="Featured"
  title="Bestsellers"
  subtitle="Handpicked treasures"
/>
```

### Standardized Section Spacing

| Section Type | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero | 60vh | 70vh | 80vh |
| Standard section | py-12 (48px) | py-16 (64px) | py-20 (80px) |
| Compact section | py-8 (32px) | py-10 (40px) | py-12 (48px) |
| CTA section | py-16 (64px) | py-20 (80px) | py-24 (96px) |

---

## Phase 6 — Page Rebuild (BIGGEST TASK)

**Objective**: Rebuild ALL 27 pages using ONLY reusable components.

### Rebuild Order (by traffic priority)

| Priority | Page | Components Needed | Est. Time |
|---|---|---|---|
| 1 | Homepage | Hero, Categories, FeaturedProducts, TrendingCollection, Testimonials, Newsletter | 2 hours |
| 2 | Product Detail | ProductGallery, ProductInfo, PriceTag, RatingStars, ReviewList, ReviewForm, Breadcrumb | 1.5 hours |
| 3 | Shop | ProductCard, CategoryCard, ShopFilters, ShopSort, Pagination, Breadcrumb | 1.5 hours |
| 4 | Cart | CartItem, CartSummary, CouponInput, TrustBadge, EmptyState | 1 hour |
| 5 | Checkout | FormField, Input, Select, OrderSummary, TrustBadge | 1 hour |
| 6 | Blog List | BlogCard, SectionHeader, Pagination | 30 min |
| 7 | Blog Detail | ArticleBody, ArticleMeta, ShareButtons, Breadcrumb | 30 min |
| 8 | About | SectionHeader, Timeline, StatsCard, ValueCard | 1 hour |
| 9 | Contact | FormField, Input, Textarea, MapEmbed | 30 min |
| 10 | FAQ | Accordion, SectionHeader | 30 min |
| 11-27 | Remaining pages | Breadcrumb, SectionHeader, ContentBlock | 2 hours |

### Rebuild Rules

1. **Zero inline styles** — only `.aura-*` classes
2. **Zero duplicated markup** — use reusable components
3. **Zero hardcoded values** — use tokens
4. **Zero page-specific CSS** — use utility classes
5. **JSDoc on every page component**
6. **Max 300 lines per page file**
7. **Build + visual test after each page**

---

## Phase 7 — Forms Standardization

**Objective**: Replace all inline forms with form components.

### Forms to Standardize

| Form | Current State | Target |
|---|---|---|
| Newsletter (homepage) | Uses PremiumButton + inline input | Use Input + PremiumButton |
| Newsletter (footer) | Inline input + inline button | Use Input + PremiumButton |
| Contact form | Inline inputs with inline styles | Use FormField + Input + Select + Textarea |
| Checkout form | Custom FormField component | Use FormField + Input + Select |
| Address form | Inline inputs | Use FormField + Input + Select |
| Settings form | Inline inputs | Use FormField + Input + Select |
| Auth (login/signup) | Custom InputField component | Use Input + PremiumButton |
| Review form | Uses Input + Textarea | Already done ✅ |
| Search bar (navbar) | Inline input | Use SearchBar component |

### Form States

Every form must handle:
- ✅ Default state
- ✅ Focus state (gold ring)
- ✅ Error state (red border + role="alert")
- ✅ Success state (green confirmation)
- ✅ Loading state (spinner + disabled)
- ✅ Disabled state (opacity 60%)

---

## Phase 8 — Accessibility (Final Audit)

**Objective**: WCAG 2.2 AA compliance.

### Checklist

- [ ] Skip-to-content link on all pages
- [ ] Exactly one `<h1>` per page
- [ ] Heading hierarchy (h1 → h2 → h3, no skips)
- [ ] All images have alt text
- [ ] All icon-only buttons have `aria-label`
- [ ] All forms have `aria-invalid` + `role="alert"`
- [ ] All modals have `role="dialog"` + `aria-modal`
- [ ] Focus trap in cart drawer + mobile menu + search modal
- [ ] Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys)
- [ ] Color contrast 4.5:1 (normal text) / 3:1 (large text)
- [ ] Touch targets minimum 44x44px
- [ ] `prefers-reduced-motion` respected
- [ ] Semantic HTML (`<article>`, `<address>`, `<time>`, `<figure>`)
- [ ] Screen reader announcements (aria-live for cart count, toasts)

---

## Phase 9 — Performance Optimization

**Objective**: Lighthouse Performance 95+.

### Checklist

- [ ] All images use `next/image` with `sizes` prop
- [ ] `priority` only on above-the-fold images (hero, main product)
- [ ] Fonts use `next/font` with `display: swap`
- [ ] No unused font weights
- [ ] Code splitting via App Router (automatic per-route)
- [ ] ISR with `revalidate` on static pages
- [ ] Service worker for offline support
- [ ] Vercel Analytics + Speed Insights enabled
- [ ] CSS under 15KB gzipped per route
- [ ] JS under 200KB gzipped per route
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## Phase 10 — SEO Verification

**Objective**: Lighthouse SEO 100.

### Checklist

- [ ] Unique `<title>` per page
- [ ] Unique `<meta description>` per page
- [ ] Canonical URL per page
- [ ] Open Graph image per page (15 OG images generated)
- [ ] Twitter Card per page
- [ ] JSON-LD: Organization, WebSite, Store, Product, Review, BreadcrumbList, FAQPage, BlogPosting, ItemList
- [ ] Sitemap with all routes + products + articles
- [ ] robots.txt with proper allow/disallow
- [ ] Semantic HTML (`<article>`, `<nav>`, `<main>`, `<section>`)
- [ ] Breadcrumbs on all pages (except home)

---

## Phase 11 — Code Quality (Dead Code Removal)

**Objective**: Remove all unused code.

### Checklist

- [ ] Remove `src/hooks/useGsap.ts` (legacy, replaced by `useAnimations.ts`)
- [ ] Remove all `console.log` statements
- [ ] Remove unused imports (ESLint will catch)
- [ ] Remove unused CSS classes
- [ ] Remove unused components
- [ ] Remove unused icons from lucide-react imports
- [ ] Remove unused font weights
- [ ] Remove dead CSS from globals.css
- [ ] Remove any `// TODO` or `// FIXME` comments
- [ ] Verify no `any` types in TypeScript

---

## Phase 12 — Engineering Standards

**Objective**: Enforce DRY, SOLID, KISS principles.

### ESLint Rules to Add

```javascript
// eslint.config.mjs additions
{
  rules: {
    'no-console': 'error',                    // No console.log in production
    'no-explicit-any': 'error',               // No any types
    'no-unused-vars': 'error',                // No unused variables
    'react/jsx-key': 'error',                 // Keys in lists
    '@next/next/no-img-element': 'error',     // Use next/image
    'no-inline-styles': 'warn',               // Warn on inline styles (custom rule)
  }
}
```

### Folder Structure (Final)

```
src/
├── app/                        # Next.js App Router
│   ├── (shop)/                 # Shop route group
│   ├── product/[slug]/         # Product detail (SSG)
│   ├── blog/[slug]/            # Blog detail (SSG)
│   ├── account/                # Account routes
│   ├── auth/                   # Auth routes
│   ├── admin/                  # Admin (protected)
│   ├── styles/                 # CSS architecture (Phase 2)
│   │   ├── tokens.css
│   │   ├── typography.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   ├── navigation.css
│   │   ├── animations.css
│   │   ├── utilities.css
│   │   └── responsive.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css             # Imports all styles
│   ├── sitemap.ts
│   ├── robots.ts
│   └── middleware.ts
│
├── components/
│   ├── layout/                 # Navbar, Footer, SiteShell, CartDrawer
│   ├── sections/               # Hero, FeaturedProducts, Categories
│   ├── product/                # ProductCard, ProductGallery, PriceTag
│   ├── shop/                   # ShopFilters, ShopSort, CategoryCard
│   ├── blog/                   # BlogCard, ArticleBody
│   ├── account/                # AccountSidebar, OrderRow, AddressForm
│   ├── admin/                  # AdminSidebar, AdminInventory
│   ├── pages/                  # About, Contact, FAQ, etc.
│   ├── ui/                     # 40+ reusable UI primitives
│   └── decorators/             # SVGDecorations
│
├── hooks/                      # useAnimations, useLenis, useStore
├── lib/                        # utils, focusTrap
├── data/                       # products, articles, reviews
├── store/                      # Zustand store
├── types/                      # Centralized TypeScript types
└── public/
    ├── og/                     # 15 OG thumbnail images
    ├── images/                 # Product + page images
    ├── logo/                   # Logo SVGs
    ├── sw.js                   # Service worker
    ├── offline.html            # PWA offline page
    └── manifest.json           # PWA manifest
```

---

## Phase 13 — Production QA

**Objective**: Full quality assurance across all devices.

### Testing Matrix

| Device | Browser | Pages to Test |
|---|---|---|
| iPhone 12+ | Safari | All 27 routes |
| Samsung Galaxy | Chrome | All 27 routes |
| iPad | Safari | All 27 routes |
| Desktop | Chrome | All 27 routes |
| Desktop | Safari | All 27 routes |
| Desktop | Firefox | All 27 routes |
| Desktop | Edge | All 27 routes |

### QA Checklist

- [ ] All routes return 200
- [ ] No console errors
- [ ] No broken images
- [ ] No broken links
- [ ] Cart works (add, update, remove, persist)
- [ ] Wishlist works (add, remove, persist)
- [ | Checkout flow works
- [ ] Auth flow works (login, signup, logout)
- [ ] Search works
- [ ] Filters work
- [ ] Animations smooth (no jank)
- [ ] Mobile responsive (320px - 414px)
- [ ] Tablet responsive (768px - 1024px)
- [ ] Desktop responsive (1280px+)
- [ ] Lighthouse Performance 95+
- [ ] Lighthouse Accessibility 100
- [ ] Lighthouse Best Practices 100
- [ ] Lighthouse SEO 100

---

## ⏱️ Execution Plan

### Recommended Order

| Step | Phase | Time | Can Parallelize? |
|---|---|---|---|
| 1 | Phase 1 — Complete Design System | 2 hours | No (foundation) |
| 2 | Phase 2 — Split CSS into files | 2 hours | No (depends on Phase 1) |
| 3 | Phase 3 — Build 15 missing components | 4 hours | Yes (with Phase 4) |
| 4 | Phase 4 — Wire animations into all pages | 2 hours | Yes (with Phase 3) |
| 5 | Phase 5 — Layout system components | 1 hour | Yes (with Phase 3/4) |
| 6 | Phase 6 — Rebuild 27 pages | 8-10 hours | No (biggest task) |
| 7 | Phase 7 — Forms standardization | 2 hours | Yes (with Phase 6) |
| 8 | Phase 11 — Dead code removal | 2 hours | Yes (after Phase 6) |
| 9 | Phase 12 — Engineering standards | 1 hour | Yes (after Phase 11) |
| 10 | Phase 8 — Accessibility audit | 1 hour | No (after all pages) |
| 11 | Phase 9 — Performance verification | 1 hour | No (after all pages) |
| 12 | Phase 10 — SEO verification | 30 min | No (after all pages) |
| 13 | Phase 13 — Production QA | 2 hours | No (final step) |
| | **Total** | **~30 hours** | |

### Push Strategy

- **After Phase 2** — Push (CSS architecture complete)
- **After Phase 3** — Push (component library complete)
- **After Phase 6** — Push (all pages rebuilt)
- **After Phase 13** — Final push (production ready)

---

## 🎯 Final Goal

The finished product will:

1. **Look identical** to the current website (same UI/UX)
2. **Be engineered** like a professional team built it
3. **Have zero inline styles** (only dynamic values)
4. **Have zero duplicate UI** (all reusable components)
5. **Have a complete design system** (tokens, typography, spacing, etc.)
6. **Be easily maintainable** by any senior developer
7. **Pass senior code review** with 9-10/10 rating
8. **Be production ready** for real customers

---

**END OF ROADMAP**

> This document supersedes all previous plans.
> Every checkbox must be marked [x] before the project is considered complete.
> No shortcuts. No compromises. Professional engineering only.
