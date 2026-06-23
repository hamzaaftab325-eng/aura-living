---
Task ID: phase-7
Agent: Super Z (main)
Task: Build Phase 7 (Production Hardening) — newsletter DB, shop page migration, wishlist sync, rate limiting, SEO, loading skeletons, Vercel deployment plan. No custom domain (user will buy later).

Work Log:
- Added NewsletterSubscriber model to Prisma schema (id, email, name, isActive, source, userId, confirmationToken, confirmedAt, unsubscribedAt, timestamps). Added back-relation on User. Applied via prisma db push.
- Created src/app/api/newsletter/route.ts — POST (subscribe, idempotent upsert, reactivates unsubscribed) + DELETE (unsubscribe). Rate limited: 3 signups/hour/IP.
- Updated src/components/NewsletterSection.tsx — handleSubmit now calls /api/newsletter API (was setTimeout mock). Added submitting state + loading indicator on button.
- Refactored src/app/(shop)/shop/page.tsx — now a server component that fetches products + categories from DB via getProducts() + getCategories(). Passes to ShopView as initialProducts + initialCategories props. ISR: revalidate every 1 hour.
- Updated src/components/ShopView.tsx — accepts initialProducts + initialCategories props. Uses DB data instead of mock data. Added categories to FilterSidebar props. Falls back to empty array if no props (backward compat).
- Created src/app/api/wishlist/merge/route.ts — POST endpoint to merge guest wishlist (productIds) into user's DB wishlist. Skips duplicates, verifies products exist.
- Updated src/components/AuthView.tsx — on successful login, fires fetch to /api/wishlist/merge with guest wishlist productIds from localStorage. Non-blocking (fire-and-forget).
- Created src/lib/rate-limit.ts — in-memory rate limiter (Map-based, auto-cleanup every 5 min). Functions: rateLimit(identifier, options), getClientIP(request), RATE_LIMITS config object. Works without Upstash (single-instance). Will upgrade to Upstash Redis later for multi-instance.
- Applied rate limiting to /api/checkout (3 req/min per IP) and /api/newsletter (3 req/hour per IP).
- Updated src/app/robots.ts — disallows /api/, /admin/, /account/, /auth/, /checkout/, /cart/, /wishlist/, /_next/. Added host directive.
- Created loading skeletons:
  - src/app/admin/loading.tsx — dashboard skeleton (stat cards)
  - src/app/account/loading.tsx — account page skeleton
  - src/app/(shop)/shop/loading.tsx — shop grid skeleton
- Fixed Prisma 7 orderBy issue — changed from object format `{ sortOrder: "asc" }` to array format `[{ sortOrder: "asc" }]` in src/lib/products.ts (required by Prisma 7 for top-level orderBy).

VERIFICATION:
- ✅ npm run typecheck — 0 errors
- ✅ npm run lint — 0 errors (7 pre-existing warnings)
- ✅ npm run build — succeeds, all pages compile
- ✅ Dev server: Homepage 200, Shop 200 (now from DB), Product detail 200, Admin 307 (redirect to login), Robots.txt 200
- ✅ Newsletter API: POST saves subscriber to DB (verified in Supabase)
- ✅ Cleaned up test newsletter subscriber after verification

Stage Summary:
- ✅ Phase 7 COMPLETE.
- Newsletter form saves to DB (NewsletterSubscriber table).
- Shop page now fetches from DB (was mock data) — all 45 products load from Supabase.
- Wishlist syncs from localStorage to DB on login (fire-and-forget merge).
- Rate limiting on /api/checkout (3/min) + /api/newsletter (3/hour).
- robots.txt disallows sensitive paths.
- Loading skeletons for /admin, /account, /shop.
- Created comprehensive Vercel deployment plan at /home/z/my-project/download/VERCEL_DEPLOYMENT_PLAN.md (9-step guide with all env vars, troubleshooting, post-deployment security).
- All 7 phases of backend development COMPLETE.
- Ready for Vercel deployment.
