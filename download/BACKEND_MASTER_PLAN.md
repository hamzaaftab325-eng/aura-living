# Aura Living — Backend Master Plan (0 → 100%)
### Production-Grade E-Commerce Backend for Pakistan Market (PKR)

---

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Created** | 2026-06-23 |
| **Target Stack** | Next.js 16 + Supabase Postgres + Better Auth + Resend |
| **Currency** | PKR (Pakistani Rupee) — stored as paisa (integer) |
| **Hosting** | Vercel (free tier) |
| **Maintenance Level** | Easy — one developer can manage everything |
| **Quality Target** | 10/10 — production-grade, zero recurring bugs |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack & Why](#2-technology-stack--why)
3. [Architecture Overview](#3-architecture-overview)
4. [Security Posture](#4-security-posture)
5. [Database Schema Design](#5-database-schema-design)
6. [Phase-by-Phase Execution Plan](#6-phase-by-phase-execution-plan)
7. [File Structure (Final)](#7-file-structure-final)
8. [Environment Variables](#8-environment-variables)
9. [Deployment Workflow](#9-deployment-workflow)
10. [Maintenance Playbook](#10-maintenance-playbook)
11. [Rollback & Disaster Recovery](#11-rollback--disaster-recovery)
12. [Cost Analysis](#12-cost-analysis)
13. [Success Metrics](#13-success-metrics)
14. [Risk Register](#14-risk-register)
15. [Previous Failures — Root Cause Matrix](#15-previous-failures--root-cause-matrix)

---

## 1. Executive Summary

Aura Living's frontend is production-ready (27 pages, 40+ components, design system, animations). The backend failed twice on Supabase Auth due to four root causes (build-cache env injection, Service Worker POST interception, unreliable SSR cookie wrapper, missing Suspense boundaries).

This plan rebuilds the backend using a **defense-in-depth architecture** that eliminates every previous failure mode while keeping the stack simple enough for one developer to maintain long-term.

### Core Principles

1. **Server-first** — All data fetching happens in Server Components. Client components only handle interactivity.
2. **Type-safe end-to-end** — Prisma generates types from schema. Zod validates at boundaries. No `any` anywhere.
3. **Money is always integer paisa** — `Rs. 1,234.56` stored as `123456` (BigInt). Display layer formats.
4. **Auth is self-hosted** — Better Auth runs inside the app. No third-party auth service can break.
5. **Every mutation is transactional** — Cart merge, order creation, stock decrement all happen in DB transactions.
6. **Every page has Suspense** — No `useSearchParams()` crashes ever again.
7. **Zero secrets in client** — No `NEXT_PUBLIC_` for anything sensitive. Vercel runtime injection only.

### What Success Looks Like

- User can sign up, verify email, log in, browse 46 products, add to cart, checkout with COD, receive confirmation email — all in production.
- Admin can add/edit products, manage orders, view customers.
- Lighthouse 90+ on all categories.
- Zero TypeScript errors, zero ESLint errors, zero runtime crashes.
- One developer can deploy, debug, and extend the system without confusion.

---

## 2. Technology Stack & Why

### Final Stack (All Free Tier)

| Layer | Tool | Free Tier | Why This Choice |
|-------|------|-----------|-----------------|
| **Framework** | Next.js 16 | Unlimited | Already built, App Router, Server Components |
| **Hosting** | Vercel | 100GB bandwidth, 6000 build min | Native Next.js, zero config, global CDN |
| **Database** | Supabase Postgres | 500MB, 50K MAU | You already have it, full SQL access, real-time capable |
| **ORM** | Prisma 6 (stable) | OSS | Type-safe, migrations, no raw SQL errors |
| **Auth** | Better Auth | OSS, unlimited | Self-hosted, native App Router, manages cookies internally |
| **Email** | Resend | 3,000/month | React Email templates, 99% deliverability |
| **Email Templates** | React Email | OSS | Composable, typed, previewable |
| **Rate Limiting** | Upstash Redis | 10K commands/day | Serverless Redis, REST API, edge-compatible |
| **Storage** | Supabase Storage | 1GB | Same dashboard as DB, image transformations |
| **Validation** | Zod | OSS | Type-safe schemas shared client/server |
| **Forms** | React Hook Form + Zod | OSS | Already installed, performant, accessible |
| **State (UI)** | Zustand | OSS | Cart drawer, UI state only (NOT auth state) |
| **Currency** | PKR (paisa as BigInt) | n/a | No floating-point errors, exact money math |
| **Payments** | Cash on Delivery (COD) | n/a | Primary method for Pakistan market |

### What We Deliberately Did NOT Choose

| Tool | Why Not |
|------|---------|
| ~~Supabase Auth~~ | Failed twice — cookie wrapper unreliable on Vercel, build-cache issues |
| ~~Prisma 7~~ | New config system, less battle-tested, Supabase docs use Prisma 6 |
| ~~Neon Postgres~~ | Adds another dashboard; Supabase already gives us Postgres |
| ~~Firebase~~ | NoSQL doesn't fit e-commerce relational data |
| ~~Auth.js (NextAuth)~~ | Less maintained than Better Auth, weaker session model |
| ~~Stripe~~ | Not widely used in Pakistan; COD is king for local market |

---

## 3. Architecture Overview

### 3.1 Request Flow

```
Browser
  │
  ▼
Vercel Edge CDN (static assets cached 30 days)
  │
  ▼
Next.js Middleware (auth check, redirects, security headers)
  │
  ▼
Server Component (reads from DB via Prisma)
  │
  ▼
Prisma Client → Supabase Postgres (pooled connection, port 6543)
  │
  ▼
HTML streamed to browser (Suspense boundaries for progressive loading)
```

### 3.2 Auth Flow (Better Auth)

```
User submits login form
  │
  ▼
Client calls authClient.signIn.email() (fetch POST to /api/auth/sign-in/email)
  │
  ▼
Better Auth server validates credentials against DB
  │
  ▼
Better Auth sets HttpOnly + Secure + SameSite=Lax session cookie
  │
  ▼
Client receives { user, session } — redirects to /account
  │
  ▼
All subsequent requests: middleware reads session cookie, allows/denies
```

**Critical:** Better Auth handles ALL cookie operations internally. We never touch cookies directly. This eliminates the Supabase SSR cookie wrapper failure.

### 3.3 Cart Flow (Hybrid)

```
Guest user adds to cart
  │
  ▼
Zustand persists cart to localStorage
  │
  ▼
Guest logs in
  │
  ▼
Server Action: mergeCart(userId, guestCart)
  │
  ▼
DB transaction: upsert CartItem records, clear guest cart
  │
  ▼
Logged-in user's cart is now DB-backed (synced across devices)
```

### 3.4 Order Flow

```
User clicks "Place Order"
  │
  ▼
Server Action: createOrder(userId, cart, shippingAddress, paymentMethod)
  │
  ▼
DB Transaction:
  1. Validate all items in stock
  2. Calculate totals (subtotal + shipping - discount)
  3. Create Order + OrderItem records
  4. Decrement Product.stock
  5. Apply coupon (create CouponRedemption)
  6. Clear user's Cart
  7. Create OrderStatusEvent (PENDING)
  │
  ▼
Send order confirmation email (Resend, async)
  │
  ▼
Redirect to /checkout/success?orderId=...
```

---

## 4. Security Posture

### 4.1 Authentication Security

- Passwords hashed with bcrypt (Better Auth default, 12 rounds)
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax`, 30-day expiry
- Sliding session renewal (extends on activity)
- Email verification required before first order
- Password reset tokens expire in 1 hour
- Rate limited: 5 auth attempts per minute per IP

### 4.2 Authorization Levels

| Role | Access |
|------|--------|
| **Anonymous** | Browse products, add to cart, checkout with COD |
| **Customer** | Everything anonymous + view order history, save addresses, wishlist |
| **Admin** | Everything customer + product CRUD, order management, customer view, coupons |

### 4.3 Data Protection

- All user input validated with Zod schemas
- All DB queries via Prisma (parameterized, SQL-injection-proof)
- No `dangerouslySetInnerHTML` anywhere
- Admin product descriptions sanitized (allow only safe HTML tags)
- HTTPS enforced (Vercel automatic SSL)
- HSTS header: `max-age=31536000; includeSubDomains; preload`
- CSP header restricts scripts to `'self'` + Vercel analytics

### 4.4 Environment Variables

**Strict rule:** Server secrets NEVER have `NEXT_PUBLIC_` prefix.

| Variable | Where Used | Prefix |
|----------|-----------|--------|
| `DATABASE_URL` | Server only (Prisma) | None |
| `DIRECT_URL` | Server only (migrations) | None |
| `AUTH_SECRET` | Server only (Better Auth) | None |
| `RESEND_API_KEY` | Server only (email) | None |
| `UPSTASH_REDIS_REST_URL` | Server only (rate limit) | None |
| `UPSTASH_REDIS_REST_TOKEN` | Server only (rate limit) | None |
| `NEXT_PUBLIC_APP_URL` | Client (canonical URLs) | `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_CURRENCY` | Client (display) | `NEXT_PUBLIC_` |

### 4.5 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/*` | 5 requests | per minute per IP |
| `/api/checkout` | 3 requests | per minute per user |
| `/api/coupons/validate` | 10 requests | per minute per user |
| Search queries | 30 requests | per minute per IP |
| Newsletter signup | 3 requests | per hour per IP |

Graceful degradation: if Upstash is down, allow the request (don't block users because of rate-limiter outage).

---

## 5. Database Schema Design

### 5.1 Schema Philosophy

- **Monetary fields**: `BigInt` (paisa) — `Rs. 1,234.56` = `123456`
- **Timestamps**: All tables have `createdAt` + `updatedAt` (with `@updatedAt`)
- **Soft deletes**: `deletedAt` nullable on `Product`, `User` (never hard-delete)
- **Indexes**: On all foreign keys + frequently queried fields
- **Snapshots**: Order stores customer name/email/address snapshot (in case user edits profile later)
- **No RLS**: All DB access is server-side via Prisma with service role. No client DB access.

### 5.2 Tables (15 total)

#### Auth Tables (Better Auth required)
1. **User** — id, email, emailVerified, name, image, role, banned, banReason, banExpires, newsletterSubscribed, deletedAt, timestamps
2. **Account** — OAuth accounts (for future Google login)
3. **Session** — session tokens with expiry
4. **Verification** — email verification + password reset tokens

#### Catalog Tables
5. **Category** — id, slug, name, description, image, isActive, sortOrder
6. **Product** — id, slug, name, sku, description, material, dimensions, weight, careInstructions, warranty, origin, price (BigInt), originalPrice (BigInt?), stock, lowStockThreshold, inStock, categoryId, badge, rating, reviewCount, isActive, featured, sortOrder, image, deletedAt, timestamps
7. **ProductImage** — id, productId, url, altText, sortOrder
8. **ProductVariant** — id, productId, name, value, sku, stock, priceDelta (BigInt)

#### Cart Tables
9. **Cart** — id, userId (unique), timestamps
10. **CartItem** — id, cartId, productId, variantId, quantity

#### Order Tables
11. **Order** — id, orderNumber, userId, status, paymentStatus, paymentMethod, customerName, customerEmail, customerPhone, shippingLine1/2, shippingCity, shippingProvince, shippingPostal, shippingCountry, subtotal, shippingCost, discount, tax, total (all BigInt), couponCode, trackingNumber, trackingCarrier, shippedAt, deliveredAt, cancelledAt, cancellationReason, notes, timestamps
12. **OrderItem** — id, orderId, productId, productName, productSlug, productImage, productSku, unitPrice, quantity, lineTotal (all BigInt), variantName, variantValue
13. **OrderStatusEvent** — id, orderId, status, note, createdAt

#### User Account Tables
14. **Address** — id, userId, label, name, phone, line1, line2, city, province, postal, country, isDefault
15. **WishlistItem** — id, userId, productId, createdAt

#### Coupon Tables
16. **Coupon** — id, code, description, type (PERCENTAGE/FLAT), value (BigInt), minOrderValue (BigInt), maxDiscount (BigInt?), usageLimit, usedCount, perUserLimit, startsAt, endsAt, isActive
17. **CouponRedemption** — id, couponId, userId, orderId, createdAt

### 5.3 Enums

- `UserRole`: CUSTOMER | ADMIN
- `ProductBadge`: NEW | SALE | BESTSELLER
- `OrderStatus`: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | RETURNED
- `PaymentStatus`: UNPAID | PAID | REFUNDED | FAILED
- `PaymentMethod`: COD | CARD | BANK_TRANSFER
- `CouponType`: PERCENTAGE | FLAT

### 5.4 Seed Data (PKR)

- 6 categories (Lighting, Plants & Pots, Vases & Decor, Candles & Fragrance, Wall Art & Mirrors, Kitchen & Dining)
- 46 products (from existing mock data, prices Rs. 1,500 – Rs. 89,000)
- 2 coupons: `WELCOME10` (10% off, max Rs. 1,000), `AURA500` (flat Rs. 500 off above Rs. 5,000)
- 1 admin user (created via signup flow in Phase 2, promoted to ADMIN)

---

## 6. Phase-by-Phase Execution Plan

Each phase: **Entry Criteria → Tasks → Exit Criteria → Rollback**

---

### Phase 1: Foundation (Days 1–2)

**Goal:** Database live, schema migrated, seed data loaded, lib utilities ready.

**Entry Criteria:**
- Supabase project created
- Connection strings obtained
- Resend API key obtained
- Frontend stable on mock data

**Tasks (12 tasks):**
1. Install dependencies: `prisma@^6`, `@prisma/client@^6`, `better-auth`, `resend`, `react-email`, `@react-email/components`, `@upstash/redis`, `@upstash/ratelimit`, `zod`, `nanoid`, `tsx` (dev)
2. Create `prisma/schema.prisma` with all 17 tables + enums (Prisma 6 syntax with `url`/`directUrl` in datasource block)
3. Create `.env.local` with real Supabase connection strings + other secrets
4. Create `.env.example` documenting all vars (no real values)
5. Run `npx prisma migrate dev --name init` → creates tables in Supabase
6. Create `prisma/seed.ts` — idempotent seed script using upsert
7. Run `npm run db:seed` → 6 categories, 46 products, 2 coupons
8. Create `src/lib/db.ts` — Prisma client singleton (cached on globalThis)
9. Create `src/lib/env.ts` — Zod-validated env vars (server vs client separation)
10. Create `src/lib/currency.ts` — PKR formatting helpers (formatPKR, rupeesToPaisa, paisaToRupees, calculatePercentageDiscount)
11. Add `db:*` scripts to `package.json` (generate, migrate, seed, studio, reset)
12. Update `tsconfig.json` target to ES2020+ (BigInt support)

**Exit Criteria:**
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 errors)
- [ ] `npx prisma validate` passes
- [ ] `npx prisma studio` shows seeded data
- [ ] Supabase dashboard → Table Editor shows 46 products
- [ ] `src/lib/db.ts` exports working Prisma client
- [ ] `.env.example` documents all vars

**Rollback Plan:**
Delete `prisma/` directory, remove deps, restore `package.json`. Frontend unaffected.

**Deliverable:** Database is live and seeded. App still uses mock data (Phase 3 swaps).

---

### Phase 2: Authentication (Days 3–5)

**Goal:** Real email/password auth with email verification and password reset.

**Entry Criteria:** Phase 1 complete, DB seeded.

**Tasks (17 tasks):**
1. Create `src/lib/auth.ts` — Better Auth server instance (email/password, email verification, password reset, admin plugin)
2. Create `src/app/api/auth/[...all]/route.ts` — Better Auth REST handler (GET + POST)
3. Create `src/lib/auth-client.ts` — Better Auth React client (`signIn`, `signUp`, `signOut`, `forgetPassword`, `resetPassword`)
4. Create `src/types/auth.ts` — Session user type
5. Create `src/hooks/use-session.ts` — React hook wrapping auth client
6. Create `src/lib/email.ts` — Resend client + send helper
7. Create email templates in `src/emails/`:
   - `welcome.tsx` — signup confirmation
   - `verify-email.tsx` — verification link
   - `reset-password.tsx` — reset link
8. Refactor `src/app/auth/signup/page.tsx`:
   - Replace mock signup with `authClient.signUp.email()`
   - Wrap in `<Suspense>` (uses `useSearchParams`)
   - Zod validation schema
   - On success → `/auth/verify-email?email=...`
9. Refactor `src/app/auth/login/page.tsx`:
   - Replace mock login with `authClient.signIn.email()`
   - Handle unverified email vs invalid credentials distinctly
   - Redirect to `?from=` param or `/account`
10. Refactor `src/app/auth/forgot-password/page.tsx`:
    - Replace mock with `authClient.forgetPassword()`
    - Show generic "check your email" message
11. Create `src/app/auth/reset-password/page.tsx` (wrapped in Suspense, reads token from searchParams)
12. Create `src/app/auth/verify-email/page.tsx` (wrapped in Suspense, reads token from searchParams)
13. Update `src/middleware.ts`:
    - Replace cookie check with Better Auth session check
    - Keep admin route protection (`user.role === 'ADMIN'`)
14. Update `src/store/useStore.ts`:
    - Remove mock `login`/`signup`/`user` state
    - Auth state comes from `useSession()` hook
15. Update `src/app/account/layout.tsx` — show real user data, logout button
16. Update `src/app/account/settings/page.tsx` — change name, change password
17. Create admin promotion script `scripts/promote-admin.ts` — promote `hamzaaftab325@gmail.com` to ADMIN role

**Exit Criteria:**
- [ ] User can sign up → receive verification email → verify → log in
- [ ] User can request password reset → receive email → reset → log in
- [ ] Protected routes (`/account/*`) redirect to `/auth/login?from=...`
- [ ] Admin routes (`/admin/*`) redirect non-admins
- [ ] `npm run build` passes with no Suspense errors
- [ ] Session cookie is `HttpOnly`, `Secure`, `SameSite=Lax`
- [ ] Resend dashboard shows sent emails

**Rollback Plan:**
Set `useMockAuth = true` flag, revert auth pages to Zustand mock. Better Auth routes disabled in middleware.

**Deliverable:** Working authentication. No more mock auth.

---

### Phase 3: Product Catalog (Days 6–8)

**Goal:** Products load from DB with search, filter, pagination (server-side).

**Entry Criteria:** Phase 2 complete, auth working.

**Tasks (8 tasks):**
1. Create `src/lib/products.ts` — server-side queries:
   - `getProducts({ page, category, sort, search, min, max })` — paginated
   - `getProductBySlug(slug)` — single product with images, variants
   - `getRelatedProducts(productId)` — same category, exclude self
   - `getCategories()` — all active categories
2. Refactor `src/app/(shop)/page.tsx`:
   - Read `searchParams` (page, category, sort, q, min, max)
   - Wrap in `<Suspense>`
   - Call `getProducts()` server-side
   - Pass typed data to existing UI components
3. Refactor `src/app/product/[slug]/page.tsx`:
   - Call `getProductBySlug()`
   - `generateStaticParams()` for top 20 products (SSG)
   - `generateMetadata()` for SEO (title, description, OG image)
4. Refactor shop UI components:
   - Replace mock product types with Prisma `Product` type
   - Update filter/sort to submit via URL params (not local state)
5. Add `<Suspense>` boundaries around all `useSearchParams` usages
6. Create `src/app/(shop)/loading.tsx` — skeleton loader
7. Create `src/app/product/[slug]/loading.tsx` — skeleton loader
8. Add `src/app/product/[slug]/not-found.tsx` — 404 for invalid slugs

**Exit Criteria:**
- [ ] `/shop` loads from DB, paginated, filterable, sortable
- [ ] Product detail page loads by slug with real images
- [ ] Search returns relevant results
- [ ] All pages have proper metadata (title, description, OG)
- [ ] LCP < 2.5s on shop page (server-rendered, no client fetch)
- [ ] All `useSearchParams` wrapped in Suspense

**Rollback Plan:**
Revert to mock data imports from `src/data/`.

**Deliverable:** Real product catalog from database.

---

### Phase 4: Cart & Checkout (Days 9–12)

**Goal:** Working cart + COD checkout with order emails.

**Entry Criteria:** Phase 3 complete, products from DB.

**Tasks (12 tasks):**
1. Create `src/lib/cart.ts` — server-side cart operations:
   - `getCart(userId)` — fetch user's cart
   - `addToCart(userId, productId, qty, variantId?)`
   - `updateCartItem(userId, itemId, qty)`
   - `removeFromCart(userId, itemId)`
   - `mergeCart(userId, guestCart)` — transactional merge
   - `clearCart(userId)`
2. Refactor `src/store/useStore.ts`:
   - Keep cart in Zustand for guests (localStorage)
   - On login, call Server Action `mergeCart()`
   - For logged-in users, cart is DB-backed, fetched via `getCart()`
3. Refactor `src/app/cart/page.tsx`:
   - Show items with PKR prices
   - Update qty, remove items
   - Show subtotal, shipping estimate, total
   - "Proceed to checkout" button
4. Refactor `src/app/checkout/page.tsx`:
   - Multi-step: Shipping → Payment → Review
   - Shipping: pre-fill from saved addresses
   - Payment: COD only (radio button)
   - Review: order summary, place order
5. Create `src/lib/orders.ts`:
   - `createOrder(userId, cart, shippingAddress, paymentMethod)`:
     - Transactional: validate stock → create Order + OrderItem → decrement stock → apply coupon → clear cart → create OrderStatusEvent
   - `getOrderById(orderId, userId)` — with ownership check
   - `getOrders(userId)` — paginated list
6. Create `src/lib/coupons.ts`:
   - `validateCoupon(code, cartTotal)` — returns discount or error
   - `applyCoupon(orderId, code)` — record redemption
7. Create `src/lib/shipping.ts`:
   - Flat Rs. 250 nationwide
   - Free above Rs. 10,000
8. Create `src/app/api/checkout/route.ts` — POST endpoint to create order
9. Create `src/app/checkout/success/page.tsx`:
   - Wrapped in Suspense
   - Reads `orderId` from searchParams
   - Fetches order, shows confirmation
10. Create `src/emails/order-confirmation.tsx` — React Email template
11. Update `src/app/checkout/page.tsx` to apply coupon during review
12. Add cart merge on login (in `src/app/auth/login/page.tsx` success handler)

**Exit Criteria:**
- [ ] Guest can add to cart, checkout with COD, receive confirmation email
- [ ] Logged-in user's cart persists across devices
- [ ] Coupon codes apply correctly (WELCOME10, AURA500)
- [ ] Stock decrements on order placement
- [ ] Out-of-stock items block checkout with clear error
- [ ] Order confirmation email arrives within 30 seconds

**Rollback Plan:**
Revert to Zustand-only cart (no DB). Disable checkout, show "Coming soon".

**Deliverable:** Working e-commerce checkout flow.

---

### Phase 5: User Account (Days 13–15)

**Goal:** Full account management — orders, addresses, wishlist, settings.

**Entry Criteria:** Phase 4 complete, orders in DB.

**Tasks (7 tasks):**
1. Refactor `src/app/account/page.tsx` — dashboard: name, email, member since, recent orders, quick links
2. Refactor `src/app/account/orders/page.tsx` — paginated order list with status, total, items count
3. Create `src/app/account/orders/[id]/page.tsx` — order detail with status timeline, tracking link
4. Refactor `src/app/account/addresses/page.tsx` — CRUD addresses, set default
5. Refactor `src/app/account/settings/page.tsx` — change name, change password, newsletter opt-in, delete account
6. Create `src/lib/addresses.ts` — CRUD with ownership checks
7. Refactor `src/app/wishlist/page.tsx` — DB-backed for logged-in users, localStorage for guests, sync on login

**Exit Criteria:**
- [ ] User can view all past orders with full details
- [ ] User can manage multiple addresses (add/edit/delete/set default)
- [ ] User can change password and name
- [ ] Wishlist syncs between guest and logged-in states
- [ ] Delete account soft-deletes (sets `deletedAt`)

**Rollback Plan:** Revert to mock account data.

**Deliverable:** Complete user account system.

---

### Phase 6: Admin Dashboard (Days 16–19)

**Goal:** Admin can manage products, orders, customers, coupons.

**Entry Criteria:** Phase 5 complete, real users/orders in DB.

**Tasks (12 tasks):**
1. Refactor `src/app/admin/page.tsx` — dashboard: total sales, order count, low stock alerts, recent orders, top products
2. Create `src/app/admin/products/page.tsx` — list with search, filter, pagination
3. Create `src/app/admin/products/new/page.tsx` — create form (Zod validated)
4. Create `src/app/admin/products/[id]/edit/page.tsx` — edit form (pre-filled)
5. Create image upload to Supabase Storage
6. Create `src/app/admin/orders/page.tsx` — order list with status filter
7. Create `src/app/admin/orders/[id]/page.tsx` — order detail + status update + email customer
8. Create `src/app/admin/customers/page.tsx` — customer list with order count, total spent
9. Create `src/app/admin/coupons/page.tsx` — coupon CRUD
10. Create `src/lib/admin.ts` — admin-only server functions (role check in every function)
11. Update middleware to verify admin role on `/admin/*`
12. Create admin promotion script (run once to make `hamzaaftab325@gmail.com` admin)

**Exit Criteria:**
- [ ] Admin can CRUD products with image upload
- [ ] Admin can view and update order status (sends email to customer)
- [ ] Admin can view customers and their orders
- [ ] Admin can create/edit/delete coupons
- [ ] Non-admin users get 404 on `/admin/*`
- [ ] Every admin function checks role (defense in depth)

**Rollback Plan:** Disable admin routes in middleware.

**Deliverable:** Working admin panel.

---

### Phase 7: Production Hardening (Days 20–22)

**Goal:** Production-ready — security, performance, monitoring, SEO, testing.

**Entry Criteria:** Phase 6 complete.

**Tasks (10 tasks):**
1. **Rate limiting** — Upstash Redis on all `/api/*` routes (limits per Section 4.5)
2. **SEO** — sitemap includes all products/categories/blog; robots.txt allows crawling, disallows `/account/*`, `/admin/*`, `/api/*`; canonical URLs; OG images on all product pages
3. **Performance** — `next/image` everywhere, lazy load below fold, `loading.tsx` skeletons, bundle analyzer audit
4. **Monitoring** — Vercel Analytics (installed), Vercel Speed Insights (installed), Sentry error tracking (free 5K errors/month)
5. **Backup** — Document Neon PITR restore (Supabase has daily backups on free tier)
6. **E2E Testing** — Playwright: signup → login → browse → cart → checkout → order confirmation
7. **Unit Testing** — Vitest for `lib/` functions (currency, coupons, shipping)
8. **Documentation** — Update README: setup, env vars, deployment, troubleshooting
9. **Final QA** — Lighthouse 90+, axe-core WCAG AA, cross-browser (Chrome/Firefox/Safari/Edge), mobile (iOS/Android)
10. **Deploy** — Push to main, verify on production URL, test all critical flows

**Exit Criteria:**
- [ ] Lighthouse 90+ on all categories (Performance, Accessibility, Best Practices, SEO)
- [ ] Zero ESLint errors, zero TypeScript errors
- [ ] All E2E tests pass
- [ ] Production deployment successful
- [ ] All critical flows tested on production URL
- [ ] No console errors in production

**Rollback Plan:** Revert to last stable commit on Vercel.

**Deliverable:** Production-grade, hardened, monitored backend.

---

## 7. File Structure (Final)

```
aura-living/
├── prisma/
│   ├── schema.prisma          # 17 tables + 6 enums
│   ├── seed.ts                # Idempotent seed script
│   └── migrations/            # Versioned SQL migrations
├── src/
│   ├── app/
│   │   ├── (shop)/            # Public storefront
│   │   ├── account/           # User account (auth required)
│   │   │   ├── orders/[id]/   # Order detail
│   │   │   ├── addresses/     # Address CRUD
│   │   │   └── settings/      # Profile settings
│   │   ├── admin/             # Admin dashboard (admin role)
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── orders/        # Order management
│   │   │   ├── customers/     # Customer list
│   │   │   └── coupons/       # Coupon CRUD
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Signup page
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/  # Suspense-wrapped
│   │   │   └── verify-email/    # Suspense-wrapped
│   │   ├── api/
│   │   │   ├── auth/[...all]/ # Better Auth handler
│   │   │   └── checkout/      # Order creation
│   │   ├── checkout/
│   │   │   └── success/       # Order confirmation
│   │   ├── product/[slug]/    # Product detail
│   │   └── ...
│   ├── components/             # UI components (unchanged)
│   ├── emails/                 # React Email templates
│   │   ├── welcome.tsx
│   │   ├── verify-email.tsx
│   │   ├── reset-password.tsx
│   │   └── order-confirmation.tsx
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── env.ts              # Zod-validated env vars
│   │   ├── auth.ts             # Better Auth server
│   │   ├── auth-client.ts      # Better Auth client
│   │   ├── email.ts            # Resend client
│   │   ├── currency.ts         # PKR helpers
│   │   ├── products.ts         # Product queries
│   │   ├── cart.ts             # Cart operations
│   │   ├── orders.ts           # Order operations
│   │   ├── coupons.ts          # Coupon logic
│   │   ├── shipping.ts         # Shipping calc
│   │   ├── addresses.ts        # Address CRUD
│   │   ├── admin.ts            # Admin-only functions
│   │   └── rate-limit.ts       # Upstash rate limit
│   ├── hooks/
│   │   └── use-session.ts      # Auth session hook
│   ├── store/
│   │   └── useStore.ts         # Cart + UI state (auth removed)
│   ├── types/
│   │   └── index.ts            # Re-exports Prisma types
│   └── middleware.ts           # Auth + admin route protection
├── scripts/
│   └── promote-admin.ts        # Promote user to ADMIN role
├── .env.local                  # Real secrets (gitignored)
├── .env.example                # Template (committed)
├── prisma.config.ts            # NOT needed (Prisma 6 syntax)
└── package.json                # db:* scripts added
```

---

## 8. Environment Variables

### `.env.local` (Development)

```bash
# Database (Supabase Postgres — pooled for app, direct for migrations)
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Auth (Better Auth — server-only secret, 32+ chars)
AUTH_SECRET="generate-32-char-random-string"
AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Aura Living <noreply@auraliving.pk>"

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxxxxx"

# Client-safe (NEXT_PUBLIC_*)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="PKR"
```

### Vercel Production (Project Settings → Environment Variables)

All the above, with:
- `AUTH_URL=https://aura-living-two.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://aura-living-two.vercel.app`
- All server vars set WITHOUT `NEXT_PUBLIC_` prefix

### Security Rules

1. **Never** commit `.env.local` (it's in `.gitignore`)
2. **Never** prefix server secrets with `NEXT_PUBLIC_`
3. **Never** share secrets in chat, Slack, or email — use a password manager
4. **Rotate** all secrets after sharing them with anyone (including AI assistants)
5. **Audit** Vercel env vars quarterly — remove unused, rotate old

---

## 9. Deployment Workflow

### Development → Production

```
1. Develop locally with `npm run dev`
2. Test changes: `npm run typecheck && npm run lint`
3. Commit to `main` branch (or feature branch + PR)
4. Vercel auto-deploys on push to `main`
5. Vercel runs: install → build → deploy
6. Preview deployment at `aura-living-git-branch-name.vercel.app`
7. Test on preview URL
8. Merge to `main` → production deployment at `aura-living-two.vercel.app`
```

### Database Migrations in Production

**NEVER** run `prisma migrate dev` in production (it resets data).

```
1. Create migration locally: `npx prisma migrate dev --name describe_change`
2. Test locally
3. Commit migration files to git
4. Push to main → Vercel build runs `prisma migrate deploy` automatically
5. Verify in Supabase dashboard
```

### Environment Variable Updates

```
1. Add var to `.env.local` for testing
2. Add var to Vercel Project Settings → Environment Variables
3. Redeploy (Vercel → Deployments → Redeploy)
4. Verify with `console.log(process.env.VAR_NAME)` in a server component
```

---

## 10. Maintenance Playbook

### Daily (Automated)
- Vercel Analytics monitors uptime + performance
- Supabase runs automatic daily backups
- Sentry captures runtime errors

### Weekly
- Review Vercel Analytics for performance regressions
- Check Supabase dashboard for storage usage (500MB limit)
- Review Sentry for new errors
- Check Resend dashboard for email deliverability (bounce rate < 2%)

### Monthly
- Review and rotate API keys (Resend, Upstash)
- Apply security updates (`npm audit fix`)
- Review database size — prune old OrderStatusEvents if needed
- Test critical flows manually (signup → checkout → order email)

### Quarterly
- Full Lighthouse audit
- WCAG AA audit (axe-core)
- Dependency updates (`npm update`)
- Review and update documentation

### Emergency
- **Site down:** Check Vercel status page, then Supabase status page
- **DB issue:** Check Supabase dashboard → Logs, restore from daily backup
- **Email not sending:** Check Resend dashboard → Logs, verify domain DNS
- **Rate limit exceeded:** Check Upstash dashboard → upgrade plan or increase limits

---

## 11. Rollback & Disaster Recovery

### Code Rollback

```
Vercel Dashboard → Deployments → find last stable → "Instant Rollback"
```

Takes 30 seconds. No code changes needed.

### Database Rollback

**Scenario:** Bad migration deployed, need to revert schema.

```
1. Vercel Dashboard → Deployments → rollback to pre-migration code
2. Supabase Dashboard → Database → Backups → restore to pre-migration timestamp
3. Investigate migration locally
4. Create new migration that fixes the issue
5. Test locally → deploy
```

**Note:** Supabase free tier has daily backups. For PITR (point-in-time recovery), upgrade to Pro ($25/month).

### Data Loss Prevention

- **Never** run `prisma migrate reset` in production
- **Never** hard-delete products (use soft delete: `deletedAt`)
- **Never** hard-delete users (use soft delete: `deletedAt`)
- **Always** backup before manual SQL operations
- **Always** test migrations on a staging branch first (Supabase branching on Pro plan)

---

## 12. Cost Analysis

### Free Tier Limits (Monthly)

| Service | Free Limit | Aura Living Expected Usage | Headroom |
|---------|-----------|---------------------------|----------|
| Vercel | 100GB bandwidth | ~5GB (1000 visitors × 5MB) | 95% free |
| Supabase | 500MB DB, 50K MAU | ~50MB DB, ~500 users | 90% free |
| Resend | 3,000 emails | ~200 (orders + auth) | 93% free |
| Upstash | 10K commands/day | ~500/day (rate limits) | 95% free |
| Sentry | 5K errors/month | ~50 (well-built app) | 99% free |

**Total monthly cost: $0** until you exceed these limits.

### When You'll Outgrow Free Tier

| Milestone | When | Upgrade |
|-----------|------|---------|
| 50K monthly users | ~2-3 years | Supabase Pro ($25/mo) |
| 3K+ emails/month | ~1-2 years | Resend Pro ($20/mo) |
| 100GB bandwidth | ~20K visitors/month | Vercel Pro ($20/mo) |
| 5K errors/month | Never (if well-built) | Sentry Team ($26/mo) |

**Realistic timeline:** You can run free for 1-2 years. First paid upgrade likely Supabase Pro at ~$25/month.

---

## 13. Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | 90+ | Chrome DevTools |
| Lighthouse Accessibility | 95+ | Chrome DevTools |
| LCP (Largest Contentful Paint) | < 2.5s | Vercel Speed Insights |
| INP (Interaction to Next Paint) | < 200ms | Vercel Speed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | Vercel Speed Insights |
| TypeScript errors | 0 | `npm run typecheck` |
| ESLint errors | 0 | `npm run lint` |
| Build time | < 3 min | Vercel dashboard |
| Uptime | 99.9% | Vercel Analytics |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Signup → First Order conversion | 10%+ | Supabase queries |
| Cart abandonment rate | < 70% | Analytics events |
| Order confirmation email delivery | 99%+ | Resend dashboard |
| Average order value | Rs. 8,000+ | Admin dashboard |
| Repeat customer rate | 20%+ | Admin dashboard |

---

## 14. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | Supabase project autosuspends (7 days inactivity) | Low | Medium | Set up UptimeRobot ping every 5 min |
| 2 | Resend emails marked as spam | Medium | High | Verify domain (SPF/DKIM/DMARC), warm up IP |
| 3 | Upstash rate limit exceeded | Low | Medium | Graceful degradation — allow if Redis down |
| 4 | Vercel function timeout (10s on free) | Medium | Medium | Keep Server Actions < 5s, use background jobs for emails |
| 5 | Prisma migration conflict | Low | Low | Always create new migrations, never edit existing |
| 6 | Supabase free tier DB size hit (500MB) | Low | High | Monitor monthly, prune old data, upgrade to Pro |
| 7 | Better Auth breaking change | Low | High | Pin version in package.json, test before upgrading |
| 8 | PKR currency formatting bug | Low | Low | Unit tests for all currency functions |
| 9 | Cart merge race condition | Low | Medium | DB transaction in `mergeCart()` |
| 10 | Stock oversell on concurrent orders | Medium | High | DB transaction + `SELECT FOR UPDATE` on stock |

---

## 15. Previous Failures — Root Cause Matrix

This is the most important section. Every previous failure is mapped to a concrete mitigation.

| # | Previous Error | Root Cause | Mitigation in This Plan |
|---|----------------|-----------|-------------------------|
| 1 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` not injected by Vercel build cache | Build-time env vars cached in `.next` | ✅ All secrets are server-only (no `NEXT_PUBLIC_`). Better Auth uses `AUTH_SECRET` + `DATABASE_URL` read at runtime |
| 2 | Service Worker intercepted Server Action POSTs | SW scope `/` caught all POSTs | ✅ Better Auth uses REST API routes (`/api/auth/*`), not Server Actions. SW config excludes `/api/*` |
| 3 | `@supabase/ssr` cookie wrapper unreliable on Vercel | Custom cookie parsing across contexts | ✅ Better Auth handles cookies internally with Web standard `Set-Cookie`. We never touch cookies |
| 4 | `useSearchParams()` missing Suspense boundary | Next.js 14+ requires Suspense | ✅ Every page using `searchParams` wrapped in `<Suspense>` from day one. ESLint rule enforced |
| 5 | Build cache pollution from mixed client/server env | `NEXT_PUBLIC_*` cached in client bundle | ✅ Strict env var policy. `.env.example` documents rules. CI checks for leaks |
| 6 | Type mismatches between mock data and real schema | Ad-hoc types in `src/types/` | ✅ Prisma generates types from schema. All DB access typed. Mock types replaced |
| 7 | Race conditions in cart merge on login | Client-side cart not synced with server | ✅ Cart merge happens in Server Action with transactional DB write |
| 8 | Stock oversell on concurrent orders | No transaction around stock check | ✅ `createOrder()` uses DB transaction with row-level lock on stock |
| 9 | Prisma 7 config migration issues | New prisma.config.ts system | ✅ Using Prisma 6 (stable, matches Supabase docs, no separate config file) |
| 10 | Hard to debug auth issues (no logging) | No observability | ✅ Better Auth logs all auth events, Sentry captures errors, Vercel Analytics tracks performance |

---

## Appendix A: Pre-Deployment Checklist

Before going live, verify ALL of these:

### Code Quality
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run build` succeeds
- [ ] No `console.log` in production code
- [ ] No `any` types
- [ ] No `// @ts-ignore` comments

### Security
- [ ] All env vars set in Vercel (not in code)
- [ ] No `NEXT_PUBLIC_` prefix on secrets
- [ ] `.env.local` in `.gitignore`
- [ ] AUTH_SECRET is 32+ chars random
- [ ] Resend domain verified (SPF/DKIM)
- [ ] Rate limiting active on all `/api/*` routes
- [ ] CSP header active
- [ ] HSTS header active

### Database
- [ ] `prisma migrate deploy` runs clean
- [ ] Seed data loaded (6 categories, 46 products, 2 coupons)
- [ ] Admin user promoted to ADMIN role
- [ ] Daily backups confirmed in Supabase dashboard

### Functional
- [ ] User can sign up → verify email → log in
- [ ] User can reset password via email
- [ ] User can browse products, filter, search
- [ ] User can add to cart, checkout with COD
- [ ] Order confirmation email arrives
- [ ] User can view order history
- [ ] Admin can CRUD products
- [ ] Admin can update order status
- [ ] Non-admin gets 404 on `/admin/*`

### Performance
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 95+
- [ ] LCP < 2.5s on all key pages
- [ ] INP < 200ms on all interactive elements
- [ ] CLS < 0.1

### SEO
- [ ] `sitemap.xml` includes all products
- [ ] `robots.txt` disallows `/account/*`, `/admin/*`, `/api/*`
- [ ] All product pages have `generateMetadata()`
- [ ] OG images configured
- [ ] Canonical URLs set

### Monitoring
- [ ] Vercel Analytics active
- [ ] Vercel Speed Insights active
- [ ] Sentry error tracking active
- [ ] Resend deliverability monitored

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **App Router** | Next.js 13+ routing system using `app/` directory |
| **Server Component** | React component that renders on server, sends HTML to client |
| **Client Component** | React component with `'use client'` directive, runs in browser |
| **Server Action** | Function that runs on server, callable from client component |
| **Suspense** | React feature for progressive loading (required for `useSearchParams`) |
| **BigInt** | JavaScript primitive for integers > 2^53 (used for paisa) |
| **Paisa** | 1/100 of a PKR. Rs. 1 = 100 paisa |
| **PgBouncer** | Postgres connection pooler (Supabase uses it on port 6543) |
| **COD** | Cash on Delivery — customer pays when order arrives |
| **PITR** | Point-in-Time Recovery — restore DB to any second |
| **HSTS** | HTTP Strict Transport Security — forces HTTPS |
| **CSP** | Content Security Policy — restricts script sources |
| **RLS** | Row Level Security — Supabase feature (not used in this plan) |

---

## Document End

This plan is the single source of truth for Aura Living's backend. Every phase, every decision, every risk is documented here. Follow it phase-by-phase, verify each exit criteria, and you'll have a 10/10 production backend that's easy to maintain for years.

**Next step:** Send me your Supabase connection strings + Resend API key, and I'll execute Phase 1.
