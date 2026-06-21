# Aura Living — Component Architecture

## Overview

This document describes the component organization for the Aura Living e-commerce frontend.
All components follow a strict design system with zero inline styles (except dynamic values).

## Folder Structure

```
src/
├── app/                        # Next.js App Router routes (27 routes)
│   ├── (shop)/                 # Shop route group (no URL prefix)
│   │   ├── shop/               # /shop
│   │   ├── new-arrivals/       # /new-arrivals
│   │   ├── sale/               # /sale
│   │   └── lookbook/           # /lookbook
│   ├── product/[slug]/         # /product/:slug (SSG)
│   ├── blog/[slug]/            # /blog/:slug (SSG)
│   ├── account/                # /account, /account/orders, etc.
│   ├── auth/                   # /auth/login, /auth/signup, etc.
│   ├── admin/                  # /admin (protected)
│   ├── about/                  # /about
│   ├── contact/                # /contact
│   ├── faq/                    # /faq
│   ├── shipping/               # /shipping
│   ├── returns/                # /returns
│   ├── care-guide/             # /care-guide
│   ├── terms/                  # /terms
│   ├── privacy/                # /privacy
│   ├── cart/                   # /cart
│   ├── checkout/               # /checkout
│   ├── wishlist/               # /wishlist
│   ├── layout.tsx              # Root layout (fonts, JSON-LD, Analytics)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Design system (tokens + utility classes)
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Robots.txt config
│   ├── error.tsx               # Error boundary
│   ├── loading.tsx             # Loading skeleton
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── layout/                 # Global layout components
│   │   ├── index.ts            # Barrel: Navbar, Footer, SiteShell, CartDrawer
│   │   (re-exports from root for stability)
│   │
│   ├── sections/               # Homepage sections
│   │   ├── index.ts            # Barrel: Hero, Featured, Categories, etc.
│   │
│   ├── product/                # Product-related components
│   │   ├── index.ts            # Barrel: ProductDetailView, ReviewList, ReviewForm
│   │
│   ├── account/                # Account page components
│   │   ├── index.ts            # Barrel: AccountView, AddressesView, etc.
│   │
│   ├── pages/                  # Full-page views
│   │   ├── index.ts            # Barrel: All page-level views
│   │
│   ├── decorators/             # SVG decorations
│   │   └── index.ts            # Barrel: SVGDecorations, testimonials
│   │
│   └── ui/                     # Reusable UI primitives (26 components)
│       ├── PremiumButton.tsx   # Primary/Secondary/Newsletter button system
│       ├── SaveButton.tsx      # GSAP-powered save button with confetti
│       ├── Input.tsx           # Accessible text input
│       ├── Select.tsx          # Accessible select dropdown
│       ├── Textarea.tsx        # Accessible textarea
│       ├── Checkbox.tsx        # Accessible checkbox
│       ├── RadioGroup.tsx      # Accessible radio group
│       ├── FormRow.tsx         # Form layout wrapper
│       ├── Card.tsx            # Reusable card
│       ├── Badge.tsx           # Product badge (NEW/SALE/BESTSELLER)
│       ├── Breadcrumb.tsx      # Breadcrumb with JSON-LD
│       ├── Tabs.tsx            # WAI-ARIA tabs
│       ├── Modal.tsx           # Accessible modal with focus trap
│       ├── Pagination.tsx      # SEO-friendly pagination
│       ├── SectionHeader.tsx   # Standardized section header
│       ├── SectionDivider.tsx  # Gold ornamental divider
│       ├── EmptyState.tsx      # Standardized empty state
│       ├── ErrorState.tsx      # Standardized 404/500
│       ├── PriceTag.tsx        # Product price with strikethrough
│       ├── RatingStars.tsx     # Star rating display
│       ├── TrustBadge.tsx      # Trust indicators (secure, returns, etc.)
│       ├── Skeletons.tsx       # Loading skeletons
│       ├── toast.tsx           # Toast notification
│       ├── toaster.tsx         # Toast container
│       └── index.ts            # Barrel export for all UI primitives
│
├── hooks/                      # Custom React hooks
│   ├── useAnimations.ts        # 7 GSAP animation hooks (useGSAP)
│   ├── useGsap.ts              # Legacy GSAP hooks (being migrated)
│   ├── useLenis.ts             # Smooth scroll (desktop only)
│   ├── useCartActions.ts       # Cart/wishlist actions with toast
│   └── use-toast.ts            # Toast state management
│
├── lib/                        # Utilities
│   ├── utils.ts                # cn() class merge utility
│   └── focusTrap.ts            # Focus trap for modals/menus
│
├── data/                       # Static data (no API yet)
│   ├── products.ts             # 45 products with slugs
│   ├── articles.ts             # 8 blog articles
│   └── reviews.ts              # 53 mock reviews
│
├── store/                      # State management
│   └── useStore.ts             # Zustand store (cart, wishlist, user)
│
├── types/                      # Centralized TypeScript types
│   ├── product.ts              # Product, CartItem, Category
│   ├── user.ts                 # User, Address, Order, TrackedOrder
│   ├── blog.ts                 # Article, ArticleAuthor
│   ├── review.ts               # Review
│   └── index.ts                # Barrel export
│
├── middleware.ts               # Route protection + hash redirects
└── next.config.ts              # Security headers + image config
```

## Design System

### Design Tokens (126 CSS custom properties)

All visual values are defined as CSS custom properties in `globals.css`:

| Category | Count | Examples |
|---|---|---|
| Colors | 20+ | `--color-gold`, `--surface-dark`, `--text-muted` |
| Typography | 14 classes | `.aura-h1` through `.aura-caption` |
| Spacing | 7 | `--space-xs` (4px) through `--space-3xl` (96px) |
| Radius | 7 | `--radius-xs` through `--radius-pill` |
| Shadows | 6 | `--shadow-xs` through `--shadow-gold` |
| Animations | 5 | `--ease-out`, `--duration-fast`, etc. |
| Breakpoints | 5 | `--bp-sm` through `--bp-2xl` |
| Container | 4 | `--container-narrow` through `--container-full` |
| Z-index | 9 | `--z-base` through `--z-tooltip` |

### Utility Classes (208 `.aura-*` classes)

All styling uses `.aura-*` utility classes. No inline styles except for truly dynamic values.

| Category | Examples |
|---|---|
| Surfaces | `.aura-surface-page`, `.aura-surface-card`, `.aura-surface-dark` |
| Backgrounds | `.aura-bg-gold-tint`, `.aura-bg-dark-tint`, `.aura-bg-transparent` |
| Gradients | `.aura-gradient-gold`, `.aura-gradient-dark`, `.aura-gradient-card` |
| Text | `.aura-text-primary`, `.aura-text-gold`, `.aura-text-white-80` |
| Borders | `.aura-border-subtle`, `.aura-border-gold-tint`, `.aura-border-2-gold` |
| Shadows | `.aura-shadow-sm`, `.aura-shadow-md`, `.aura-shadow-gold` |
| Layout | `.aura-flex-center`, `.aura-flex-between`, `.aura-flex-col-center` |
| Blur | `.aura-blur-sm`, `.aura-blur-lg`, `.aura-blur-xl` |
| Opacity | `.aura-opacity-10` through `.aura-opacity-90` |

### Button System (3 variants only)

| Class | Purpose | Visual |
|---|---|---|
| `.btn-primary` | Main CTA | Gold gradient, white text, pill |
| `.btn-secondary` | Supporting action | Outline, gold text, pill |
| `.btn-newsletter` | Form submit | Enhanced primary, taller |

Sizes: `.btn-sm`, `.btn-md` (default), `.btn-lg`

## Animation System

All animations use hooks from `src/hooks/useAnimations.ts`:

| Hook | Purpose |
|---|---|
| `useScrollReveal()` | Fade + slide up on scroll |
| `useTextReveal()` | Word-by-word blur reveal |
| `useParallax()` | Background parallax |
| `useStaggerReveal()` | Grid items stagger |
| `useScaleIn()` | Scale from 0.9 to 1 |
| `useCountUp()` | Number count-up |
| `useMagnetic()` | Magnetic button hover |

All hooks:
- Use `@gsap/react`'s `useGSAP()` for automatic cleanup
- Respect `prefers-reduced-motion`
- Have JSDoc documentation
- Are fully typed

## Import Conventions

```typescript
// UI primitives — import from barrel
import { PremiumButton, Input, Card, Badge } from '@/components/ui';

// Types — import from centralized types
import type { Product, CartItem, User } from '@/types';

// Hooks — import directly
import { useScrollReveal, useTextReveal } from '@/hooks/useAnimations';

// Data — import directly
import { products, formatPKR, getProductBySlug } from '@/data/products';

// Store — import directly
import { useStore, MAX_CART_QTY } from '@/store/useStore';
```

## Code Quality Standards

1. **Zero inline styles** — use `.aura-*` classes (dynamic values are the only exception)
2. **Zero hardcoded fonts** — use `.aura-h1` through `.aura-caption` typography classes
3. **Zero arbitrary text sizes** — no `text-[28px]` patterns
4. **Zero hardcoded hex colors** — use `var(--color-*)` tokens
5. **JSDoc on every component** — document what, why, and usage example
6. **Max 300 lines per file** — split large files into sub-components
7. **WCAG 2.2 AA** — all interactive elements accessible
8. **prefers-reduced-motion** — all animations respect user preference
