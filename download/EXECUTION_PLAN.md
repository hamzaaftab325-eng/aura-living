# Aura Living — Production Backend Execution Plan v2

> **Document owner**: Engineering
> **Last updated**: 2026-06-23
> **Status**: Phase 1 — ✅ Complete (awaiting Neon DB credentials to run migrate + seed)
> **Goal**: Build a production-grade backend for Aura Living e-commerce (PKR market) using only free-tier services, with zero recurrence of previous backend errors.

---

## 1. Executive Summary

Aura Living's frontend (27 pages, 40+ components, design system, animations) is production-ready. The backend failed twice on Supabase auth due to four root causes (build-cache env injection, Service Worker POST interception, unreliable SSR cookie wrapper, missing Suspense boundaries). This plan replaces the entire stack with a Next.js-native architecture that eliminates every failure mode.

### 1.1 Success Criteria

1. Users can sign up, log in, log out, reset password (email-based).
2. Products load from the database with search, filter, pagination (server-side).
3. Cart persists for guests, merges on login, converts to orders.
4. Checkout supports COD in PKR with proper order confirmation emails.
5. Admin dashboard manages products, orders, customers.
6. All routes pass WCAG AA, Core Web Vitals (LCP < 2.5s, INP < 200ms).
7. Zero build errors, zero TypeScript errors, zero ESLint errors.
8. Deployment to Vercel succeeds with no env var issues.

### 1.2 Non-Goals

- Online payment gateways (Stripe, JazzCash, etc.) — deferred to v1.1.
- Internationalization — deferred to v1.2.
- Multi-vendor marketplace — out of scope.
- Mobile app — out of scope.

---

## 2. Technology Stack (All Free Tier)

| Layer | Technology | Free Tier Limit | Why This Choice |
|-------|-----------|----------------|-----------------|
| **Database** | Neon Postgres | 0.5 GB storage, autosuspend after inactive | Serverless, branching, perfect for Vercel cold starts |
| **ORM** | Prisma 5 | OSS, unlimited | Type-safe, migrations, no raw SQL errors |
| **Auth** | Better Auth | OSS, unlimited | Native App Router, manages cookies internally, no external service |
| **Email** | Resend | 3,000 emails/month | React Email templates, deliverability |
| **Storage** | Vercel Blob | 1 GB storage, 10 GB bandwidth | Native Vercel integration |
| **Rate Limit** | Upstash Redis | 10,000 commands/day | Serverless Redis, REST API |
| **Validation** | Zod | OSS, unlimited | Type-safe schemas shared client/server |
| **Currency** | PKR (₨) | n/a | Stored as integer paisa, displayed as `Rs. 12,345` |
| **Payments** | Cash on Delivery (COD) | n/a | Primary method for Pakistan market |

---

## 3. Root Cause Analysis & Mitigation Matrix

This is the most important section. Every previous failure is mapped to a concrete mitigation.

### 3.1 Previous Failures → New Mitigations

| # | Previous Error | Root Cause | Mitigation in v2 |
|---|----------------|-----------|------------------|
| 1 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` not injected by Vercel build cache | Build-time env vars get cached in `.next` and don't refresh on redeploy | ✅ All secrets are server-only (no `NEXT_PUBLIC_` prefix). Better Auth uses `AUTH_SECRET` + `DATABASE_URL` which are read at **runtime** via `process.env` inside Server Components and Route Handlers |
| 2 | Service Worker intercepted Server Action POSTs | SW scope `/` caught all POST requests including `/__auth` | ✅ Better Auth exposes **REST API routes** at `/api/auth/*` (not Server Actions). We add `cleanUrls: false` and exclude `/api/*` from SW scope in the new SW config. SW will only precache static assets |
| 3 | `@supabase/ssr` cookie wrapper unreliable on Vercel | Custom cookie parsing across middleware/edge/server contexts | ✅ Better Auth handles cookies **internally** with Web standard `Set-Cookie` headers. We never touch cookies directly. The `auth.api` handles all cookie operations |
| 4 | `useSearchParams()` missing Suspense boundary | Next.js 14+ requires Suspense for `useSearchParams` in static pages | ✅ Every page that reads `searchParams` is wrapped in `<Suspense>` from the start. ESLint rule `@next/next/no-missing-suspense-around-use-search-params` enforced |
| 5 | Build cache pollution from mixed client/server env | `NEXT_PUBLIC_*` cached in client bundle | ✅ Strict env var policy documented in `.env.example`. Server secrets never prefixed. CI checks for leaks |
| 6 | Type mismatches between mock data and real schema | Ad-hoc types in `src/types/index.ts` | ✅ Prisma generates types from schema. All DB access goes through typed `prisma` client. Mock types replaced with Prisma types |
| 7 | Race conditions in cart merge on login | Client-side cart state not synced with server | ✅ Cart merge happens in a **Server Action** with transactional DB write. Client just refetches |

### 3.2 Defense-in-Depth Measures

- **Database**: Prisma migrations versioned in git, never use `db push` in production.
- **Auth**: Session cookies `HttpOnly`, `Secure`, `SameSite=Lax`, 30-day expiry with sliding renewal.
- **API**: All mutations require CSRF token (Better Auth handles this) + rate limited.
- **Admin**: Separate role check in middleware AND in every admin Server Component.
- **Emails**: All transactional emails use React Email templates, tested locally with Resend sandbox.
- **Error handling**: All Server Actions return `{ ok: boolean, error?: string }` shape, never throw.

---

## 4. Database Schema (Prisma)

### 4.1 Tables Overview

```
User              → Account, Session, Verification, Address, Order, WishlistItem, Cart
Product           → ProductImage, ProductVariant, CartItem, OrderItem, WishlistItem
Category          → Product
Order             → OrderItem, OrderStatusEvent
Coupon            → CouponRedemption
```

### 4.2 Schema Highlights

- **Monetary fields**: `BigInt` (paisa) — `Rs. 1,234.56` stored as `123456`. Display layer formats with `Intl.NumberFormat('ur-PK')`.
- **Timestamps**: All tables have `createdAt`, `updatedAt` with `@updatedAt`.
- **Soft deletes**: `deletedAt` nullable on `Product`, `User` (admin can deactivate).
- **Indexes**: On `Product(slug)`, `Product(categoryId, isActive)`, `Order(userId, createdAt)`, `User(email)`.
- **RLS**: Not needed — all DB access is server-side via Prisma with service role. No client DB access.

### 4.3 Seed Data (PKR)

- 6 categories (Living Room, Bedroom, Dining, Decor, Lighting, Outdoor)
- 12 products (2 per category, varied prices Rs. 1,500 – Rs. 89,000)
- 3 blog articles
- 2 coupons (`WELCOME10` 10% off, `AURA500` flat Rs. 500 off above Rs. 5,000)
- 1 admin user (hamzaaftab325@gmail.com)

---

## 5. Phased Execution Plan

Each phase has: **Entry Criteria** → **Tasks** → **Exit Criteria** → **Rollback Plan**.

### Phase 1: Foundation (Days 1–2)

**Entry Criteria**: Frontend stable, no Supabase code, env vars to be set.

**Tasks**:
1. Remove `@supabase/*` from `package.json`, run `npm install`.
2. Install: `prisma`, `@prisma/client`, `better-auth`, `resend`, `react-email`, `@upstash/redis`, `@upstash/ratelimit`, `zod`, `@hookform/resolvers` (already present), `nanoid`.
3. Create `prisma/schema.prisma` with all 15 tables.
4. Create Neon project, get connection string, set `DATABASE_URL` in `.env.local` (and Vercel).
5. Run `npx prisma migrate dev --name init` to create schema.
6. Create `prisma/seed.ts` with PKR seed data.
7. Run `npx prisma db seed`.
8. Create `src/lib/db.ts` (Prisma client singleton).
9. Create `src/lib/currency.ts` (PKR formatting helpers).
10. Create `src/lib/env.ts` (validated env var loader with Zod).
11. Update `.env.example` with all required vars.
12. Add `db:seed`, `db:migrate`, `db:studio` scripts to `package.json`.

**Exit Criteria**:
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npx prisma studio` shows seeded data.
- `src/lib/db.ts` exports a working Prisma client.

**Rollback Plan**: Delete `prisma/` directory, remove deps, restore `package.json`. Frontend unaffected (still uses mock data).

---

### Phase 2: Authentication (Days 3–5)

**Entry Criteria**: Phase 1 complete, DB seeded.

**Tasks**:
1. Install `better-auth` (already in Phase 1).
2. Create `src/lib/auth.ts` — Better Auth server instance with email/password, email verification, password reset.
3. Create `src/app/api/auth/[...all]/route.ts` — Better Auth REST handler.
4. Create `src/lib/auth-client.ts` — Better Auth React client (creates `signIn`, `signUp`, `signOut` hooks).
5. Create `src/types/auth.ts` — Session user type.
6. Create `src/hooks/use-session.ts` — Wraps `auth-client` for components.
7. Refactor `src/app/auth/signup/page.tsx`:
   - Replace mock signup with `authClient.signUp.email()`.
   - Add Suspense boundary around `useSearchParams`.
   - Add Zod validation schema for the form.
   - On success → redirect to `/auth/verify-email?email=...`.
8. Refactor `src/app/auth/login/page.tsx`:
   - Replace mock login with `authClient.signIn.email()`.
   - On success → redirect to `?from=` param or `/account`.
   - Handle "unverified email" and "invalid credentials" errors distinctly.
9. Refactor `src/app/auth/forgot-password/page.tsx`:
   - Replace mock with `authClient.forgetPassword()`.
   - Show "check your email" message (don't reveal if email exists).
10. Create `src/app/auth/reset-password/page.tsx`:
    - Wrapped in `<Suspense>`.
    - Reads `token` from `searchParams`.
    - Calls `authClient.resetPassword()`.
11. Create `src/app/auth/verify-email/page.tsx`:
    - Reads `token` from `searchParams`.
    - Calls `authClient.verifyEmail()`.
    - Shows success/failure UI.
12. Update `src/middleware.ts`:
    - Replace cookie check with Better Auth session check via `auth.api.getSession({ headers })`.
    - Keep admin route protection (check `user.role === 'ADMIN'`).
13. Update `src/store/useStore.ts`:
    - Remove mock `login`/`signup`/`user` state.
    - Auth state now comes from `useSession()` hook.
14. Create email templates in `src/emails/`:
    - `welcome.tsx` — signup confirmation + verify link.
    - `verify-email.tsx` — verification link.
    - `reset-password.tsx` — reset link.
    - `order-confirmation.tsx` — (used in Phase 4).
15. Create `src/lib/email.ts` — Resend client + send helper.
16. Update `src/app/account/layout.tsx` — show real user data, logout button.
17. Update `src/app/account/settings/page.tsx` — change name, change password.

**Exit Criteria**:
- User can sign up → receive verification email → verify → log in.
- User can request password reset → receive email → reset password → log in.
- Protected routes (`/account/*`) redirect to `/auth/login?from=...`.
- `npm run build` passes with no Suspense errors.
- Session cookie is `HttpOnly`, `Secure`, `SameSite=Lax`.

**Rollback Plan**: Set `useMockAuth = true` flag, revert auth pages to use Zustand mock. Better Auth routes can be disabled in middleware.

---

### Phase 3: Product Catalog (Days 6–8)

**Entry Criteria**: Phase 2 complete, auth working.

**Tasks**:
1. Create `src/lib/products.ts` — server-side product queries:
   - `getProducts({ page, category, sort, search, min, max })` — paginated listing.
   - `getProductBySlug(slug)` — single product with images, variants.
   - `getRelatedProducts(productId)` — same category, exclude self.
   - `getCategories()` — all active categories.
2. Refactor `src/app/(shop)/page.tsx`:
   - Read `searchParams` (page, category, sort, q, min, max).
   - Wrapped in `<Suspense>`.
   - Call `getProducts()` server-side.
   - Pass typed data to existing UI components.
3. Refactor `src/app/product/[slug]/page.tsx`:
   - Call `getProductBySlug()`.
   - Generate static params for top 20 products.
   - Add `generateMetadata()` for SEO.
4. Refactor `src/app/(shop)/components/*`:
   - Replace mock product types with Prisma `Product` type.
   - Update filter/sort UI to submit via URL params (not local state).
5. Add `<Suspense>` boundaries around all `useSearchParams` usages.
6. Add loading.tsx for `/shop` and `/product/[slug]`.
7. Add `not-found.tsx` for invalid product slugs.
8. Implement search functionality:
   - Search bar in header → submits to `/shop?q=...`.
   - Server-side ILIKE search on name + description.
   - Add Postgres `gin` index on `tsvector(name, description)`.

**Exit Criteria**:
- `/shop` page loads from DB, paginated, filterable by category, sortable.
- Product detail page loads by slug, shows real images and variants.
- Search returns relevant results.
- All pages have proper metadata for SEO.
- LCP < 2.5s on shop page (server-rendered, no client fetch).

**Rollback Plan**: Revert to mock data imports from `src/data/`.

---

### Phase 4: Cart & Checkout (Days 9–12)

**Entry Criteria**: Phase 3 complete, products from DB.

**Tasks**:
1. Refactor `src/store/useStore.ts`:
   - Keep cart in Zustand for guests (persisted to localStorage).
   - On login, call Server Action `mergeCart()` to sync to DB.
   - For logged-in users, cart is server-side (DB-backed), fetched via `getCart()`.
2. Create `src/lib/cart.ts` — server-side cart operations:
   - `getCart(userId)` — fetch user's cart with items.
   - `addToCart(userId, productId, qty, variantId?)`.
   - `updateCartItem(userId, itemId, qty)`.
   - `removeFromCart(userId, itemId)`.
   - `mergeCart(userId, guestCart)` — merge guest cart into user cart.
   - `clearCart(userId)`.
3. Create `src/app/api/cart/route.ts` — REST endpoint for guest cart sync (optional).
4. Refactor `src/app/cart/page.tsx`:
   - Show cart items with PKR prices.
   - Update quantities, remove items.
   - Show subtotal, shipping estimate, total in PKR.
   - "Proceed to checkout" button.
5. Refactor `src/app/checkout/page.tsx`:
   - Multi-step form: Shipping → Payment → Review.
   - Shipping: pre-fill from saved addresses, add new address.
   - Payment: COD only (radio button, no card form).
   - Review: order summary, place order button.
6. Create `src/lib/orders.ts`:
   - `createOrder(userId, cart, shippingAddress, paymentMethod)`:
     - Validate cart items still in stock.
     - Calculate totals (subtotal, shipping, discount, tax=0, total).
     - Create `Order` + `OrderItem` records in a transaction.
     - Apply coupon if valid.
     - Decrement product stock.
     - Clear user's cart.
     - Send order confirmation email.
   - `getOrderById(orderId, userId)` — with ownership check.
   - `getOrders(userId)` — paginated list.
7. Create `src/app/api/checkout/route.ts` — POST endpoint to create order.
8. Create `src/app/checkout/success/page.tsx`:
   - Wrapped in Suspense.
   - Reads `orderId` from searchParams.
   - Fetches order, shows confirmation.
   - Sends `order-confirmation` email (if not already sent).
9. Create `src/lib/coupons.ts`:
   - `validateCoupon(code, cartTotal)` — returns discount amount or error.
   - `applyCoupon(orderId, code)` — record redemption.
10. Update `src/app/checkout/page.tsx` to apply coupon during review step.
11. Add order confirmation email template `src/emails/order-confirmation.tsx`.
12. Add shipping calculation in `src/lib/shipping.ts`:
    - Flat Rs. 250 nationwide.
    - Free above Rs. 10,000.

**Exit Criteria**:
- Guest can add to cart, checkout with COD, receive confirmation email.
- Logged-in user's cart persists across devices.
- Coupon codes apply correctly.
- Stock decrements on order placement.
- Out-of-stock items block checkout with clear error.

**Rollback Plan**: Revert to Zustand-only cart (no DB). Disable checkout, show "Coming soon".

---

### Phase 5: User Account (Days 13–15)

**Entry Criteria**: Phase 4 complete, orders in DB.

**Tasks**:
1. Refactor `src/app/account/page.tsx`:
   - Show user name, email, member since.
   - Recent orders summary (last 5).
   - Quick links to addresses, wishlist, settings.
2. Refactor `src/app/account/orders/page.tsx`:
   - Paginated order list.
   - Each order: order #, date, status, total, items count.
   - Click → order detail page.
3. Create `src/app/account/orders/[id]/page.tsx`:
   - Order details: items, shipping address, payment method, totals.
   - Order status timeline (placed → processing → shipped → delivered).
   - "Track order" link (Pakistan Post / TCS tracking URL if available).
4. Refactor `src/app/account/addresses/page.tsx`:
   - List saved addresses.
   - Add/edit/delete addresses.
   - Set default shipping/billing.
5. Refactor `src/app/account/settings/page.tsx`:
   - Change name.
   - Change password.
   - Email preferences (newsletter opt-in).
   - Delete account (soft delete — sets `deletedAt`).
6. Create `src/lib/addresses.ts`:
   - CRUD operations with ownership checks.
7. Refactor `src/app/wishlist/page.tsx`:
   - Fetch wishlist items from DB (for logged-in users).
   - For guests, use Zustand wishlist (sync on login).
   - Move to cart button.
   - Remove from wishlist.

**Exit Criteria**:
- User can view all past orders with details.
- User can manage multiple addresses.
- User can change password and name.
- Wishlist syncs between guest and logged-in states.

**Rollback Plan**: Revert to mock account data.

---

### Phase 6: Admin Dashboard (Days 16–19)

**Entry Criteria**: Phase 5 complete, real users/orders in DB.

**Tasks**:
1. Create admin role check: `user.role === 'ADMIN'`.
2. Seed admin user: `hamzaaftab325@gmail.com` with `ADMIN` role.
3. Refactor `src/app/admin/page.tsx`:
   - Dashboard: total sales, order count, low stock alerts.
   - Recent orders table.
   - Top products by sales.
4. Create `src/app/admin/products/page.tsx`:
   - Product list with search, filter, pagination.
   - Create / edit / delete (soft) products.
   - Upload images to Vercel Blob.
5. Create `src/app/admin/products/new/page.tsx`:
   - Form: name, slug, description, price (PKR), category, images, variants, stock.
   - Zod validation.
6. Create `src/app/admin/products/[id]/edit/page.tsx`:
   - Same form, pre-filled.
7. Create `src/app/admin/orders/page.tsx`:
   - Order list with status filter.
   - Click → order detail.
8. Create `src/app/admin/orders/[id]/page.tsx`:
   - Order details.
   - Update status (processing → shipped → delivered).
   - Send status update email to customer.
9. Create `src/app/admin/customers/page.tsx`:
   - Customer list with order count, total spent.
10. Create `src/app/admin/coupons/page.tsx`:
    - Coupon CRUD.
11. Create `src/lib/admin.ts` — admin-only server functions (with role check).
12. Update middleware to verify admin role on `/admin/*`.

**Exit Criteria**:
- Admin can CRUD products with image upload.
- Admin can view and update orders.
- Admin can manage customers and coupons.
- Non-admin users get 404 on `/admin/*`.

**Rollback Plan**: Disable admin routes in middleware.

---

### Phase 7: Production Hardening (Days 20–22)

**Entry Criteria**: Phase 6 complete.

**Tasks**:
1. **Rate limiting**:
   - All `/api/auth/*` routes: 5 req/min per IP (Upstash).
   - All form submissions: 10 req/min per user.
   - Search endpoint: 30 req/min per IP.
2. **Security**:
   - CSRF tokens on all mutations (Better Auth handles).
   - Input sanitization on all user-generated content (admin product descriptions).
   - SQL injection protection (Prisma parameterized — already done).
   - XSS protection (React escapes by default, no `dangerouslySetInnerHTML`).
3. **SEO**:
   - `sitemap.xml` includes all products, categories, blog posts.
   - `robots.txt` allows crawling, disallows `/account/*`, `/admin/*`, `/api/*`.
   - All product pages have `generateMetadata()` with OG images.
   - Add `<link rel="canonical">` on all pages.
4. **Performance**:
   - Add `next/image` to all product images.
   - Lazy load below-the-fold content.
   - Add `loading.tsx` skeletons to all routes.
   - Audit bundle size with `@next/bundle-analyzer`.
5. **Monitoring**:
   - Vercel Analytics (already installed).
   - Vercel Speed Insights (already installed).
   - Add Sentry for error tracking (free tier 5K errors/month).
6. **Backup**:
   - Neon has automatic point-in-time recovery (free).
   - Document restore procedure in README.
7. **Testing**:
   - Playwright E2E tests for critical flows: signup → login → browse → cart → checkout → order confirmation.
   - Vitest unit tests for `lib/` functions.
8. **Documentation**:
   - Update README with setup instructions.
   - Document env vars.
   - Document deployment process.
9. **Final QA**:
   - Lighthouse audit (target: 90+ all categories).
   - WCAG AA audit (axe-core).
   - Cross-browser testing (Chrome, Firefox, Safari, Edge).
   - Mobile testing (iOS Safari, Android Chrome).
10. **Deploy**:
    - Push to `main` branch.
    - Verify on Vercel.
    - Test all critical flows on production URL.

**Exit Criteria**:
- Lighthouse 90+ on all categories.
- Zero ESLint errors, zero TypeScript errors.
- All E2E tests pass.
- Production deployment successful.

**Rollback Plan**: Revert to last stable commit on Vercel.

---

## 6. Environment Variables

### 6.1 Local Development (`.env.local`)

```bash
# Database (Neon Postgres)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

# Auth
AUTH_SECRET="32-char-random-string"
AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="Aura Living <noreply@auraliving.pk>"

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="PKR"
```

### 6.2 Vercel Production

All the above, with:
- `AUTH_URL=https://aura-living-two.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://aura-living-two.vercel.app`
- All server vars set in Vercel project settings (NOT in `NEXT_PUBLIC_*`).

---

## 7. Coding Standards

### 7.1 TypeScript

- `strict: true` (already enabled).
- All functions have explicit return types.
- All Server Actions return `{ ok: boolean; data?: T; error?: string }`.
- No `any` — use `unknown` + type narrowing.

### 7.2 React

- Server Components by default.
- `'use client'` only for: forms, interactive UI, hooks.
- All async components wrapped in `<Suspense>`.
- No `useEffect` for data fetching — use Server Components.

### 7.3 Database

- All queries via Prisma client (no raw SQL).
- All mutations in transactions where multiple tables affected.
- All list queries paginated (default 12, max 100).

### 7.4 Security

- All user input validated with Zod.
- All Server Actions check auth.
- All admin actions check role.
- No secrets in client bundle.

### 7.5 Performance

- All images via `next/image`.
- All routes have `loading.tsx`.
- All static content cached.
- All dynamic content `cache: 'no-store'` or `revalidate: X`.

---

## 8. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Neon autosuspend causes cold start latency | Medium | Low | Use connection pooling, warmup query on deploy |
| Resend email deliverability to Gmail | Medium | High | Set up SPF/DKIM/DMARC, use custom domain |
| Upstash rate limit exceeded | Low | Medium | Implement graceful degradation (allow if Redis down) |
| Vercel function timeout on heavy operations | Medium | Medium | Use background jobs for email sending (deferred) |
| Prisma migration conflicts in team | Low | Low | Always create new migration, never edit existing |

---

## 9. Progress Log

> This section is updated after each phase completion.

| Phase | Status | Start Date | End Date | Notes |
|-------|--------|-----------|----------|-------|
| Phase 1: Foundation | ✅ Complete | 2026-06-23 | 2026-06-23 | All 67 verification checks pass. Schema valid, Prisma client generated, typecheck + lint clean. Awaiting Neon DB credentials to run migrate + seed. |
| Phase 2: Authentication | ⚪ Pending | — | — | — |
| Phase 3: Product Catalog | ⚪ Pending | — | — | — |
| Phase 4: Cart & Checkout | ⚪ Pending | — | — | — |
| Phase 5: User Account | ⚪ Pending | — | — | — |
| Phase 6: Admin Dashboard | ⚪ Pending | — | — | — |
| Phase 7: Production Hardening | ⚪ Pending | — | — | — |

---

## 10. File Structure (Final)

```
src/
├── app/
│   ├── (shop)/                 # Public storefront
│   ├── account/                # User account (auth required)
│   ├── admin/                  # Admin dashboard (admin role)
│   ├── auth/                   # Login, signup, reset
│   ├── api/
│   │   ├── auth/[...all]/      # Better Auth handler
│   │   ├── cart/               # Cart sync
│   │   └── checkout/           # Order creation
│   ├── checkout/
│   │   └── success/            # Order confirmation
│   ├── product/[slug]/
│   └── ...
├── components/                 # UI components (unchanged)
├── emails/                     # React Email templates
│   ├── welcome.tsx
│   ├── verify-email.tsx
│   ├── reset-password.tsx
│   └── order-confirmation.tsx
├── lib/
│   ├── auth.ts                 # Better Auth server
│   ├── auth-client.ts          # Better Auth client
│   ├── db.ts                   # Prisma client
│   ├── env.ts                  # Validated env vars
│   ├── email.ts                # Resend client
│   ├── currency.ts             # PKR formatting
│   ├── products.ts             # Product queries
│   ├── cart.ts                 # Cart operations
│   ├── orders.ts               # Order operations
│   ├── coupons.ts              # Coupon logic
│   ├── shipping.ts             # Shipping calc
│   ├── addresses.ts            # Address CRUD
│   ├── admin.ts                # Admin-only functions
│   └── rate-limit.ts           # Upstash rate limit
├── hooks/
│   └── use-session.ts          # Auth session hook
├── store/
│   └── useStore.ts             # Cart + UI state (auth removed)
├── types/
│   └── index.ts                # Re-exports Prisma types
└── middleware.ts               # Auth + admin route protection

prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

---

## 11. Deployment Checklist

- [ ] All env vars set in Vercel
- [ ] `AUTH_SECRET` is 32+ chars random
- [ ] `AUTH_URL` matches production domain
- [ ] Database migrated (`prisma migrate deploy`)
- [ ] Seed data loaded (or existing data preserved)
- [ ] Admin user created with `ADMIN` role
- [ ] Resend domain verified (SPF/DKIM)
- [ ] Vercel Blob bucket created
- [ ] Upstash Redis database created
- [ ] Custom domain configured (if any)
- [ ] SSL certificate active
- [ ] All critical flows tested on production
- [ ] Lighthouse audit passed
- [ ] No console errors in production
