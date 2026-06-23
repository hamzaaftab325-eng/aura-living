---
Task ID: phase-1
Agent: Super Z (main)
Task: Phase 1 — Foundation: Set up Neon Postgres + Prisma 7 + env validation + PKR currency helpers + seed script. Remove all Supabase dependencies. Ensure typecheck and lint pass with zero errors.

Work Log:
- Read existing project structure: 27 pages, mock data in src/data/products.ts (6 categories, 46 products), Zustand mock auth in src/store/useStore.ts, middleware with cookie-based auth.
- Confirmed no Supabase code remained in src/ (only in package.json).
- Uninstalled @supabase/ssr and @supabase/supabase-js.
- Installed: prisma@7.8.0, @prisma/client@7.8.0, @prisma/adapter-neon@7.8.0, better-auth@1.6.20, resend@6.14.0, react-email@6.6.4, @react-email/components@1.0.12, @upstash/redis@1.38.0, @upstash/ratelimit@2.0.8, zod@4.4.3, nanoid@5.1.15, tsx@4.22.4 (dev).
- Created prisma/schema.prisma with 15 models: User, Account, Session, Verification, Category, Product, ProductImage, ProductVariant, Cart, CartItem, Order, OrderItem, OrderStatusEvent, Address, WishlistItem, Coupon, CouponRedemption. All monetary fields use BigInt (paisa). Includes enums: UserRole, ProductBadge, OrderStatus, PaymentStatus, PaymentMethod, CouponType.
- Discovered Prisma 7 removed `url`/`directUrl` from schema datasource block — moved them to prisma.config.ts.
- Created prisma.config.ts using defineConfig() with datasource.url and migrations config.
- Fixed one-to-one relation error: added @unique to CouponRedemption.orderId.
- Schema validated successfully with `npx prisma validate`.
- Generated Prisma client with `npx prisma generate`.
- Created src/lib/db.ts: Prisma client singleton with PrismaNeon adapter, cached on globalThis for HMR safety.
- Created src/lib/env.ts: Zod-validated env vars, strict separation of server secrets vs client-safe vars. Throws clear errors if missing.
- Created src/lib/currency.ts: PKR helpers — formatPKR, formatPKRNumber, rupeesToPaisa, paisaToRupees, calculatePercentageDiscount, addPaisa, subtractPaisa.
- Created prisma/seed.ts: Idempotent seed script using upsert. Seeds 6 categories, 46 products (with images), 2 coupons (WELCOME10, AURA500). Reads from existing mock data in src/data/products.ts.
- Created .env.example documenting all required env vars with notes on why NEXT_PUBLIC_ is forbidden for secrets.
- Updated package.json scripts: db:generate, db:migrate, db:migrate:prod, db:push, db:seed, db:studio, db:reset. Added prisma.seed config.
- Updated tsconfig.json target from ES2017 → ES2021 to support BigInt literals (required by Prisma BigInt fields).
- Created scripts/verify-phase-1.ts: automated verification of all 67 Phase 1 deliverables.
- Ran verification: 67/67 checks passed.
- Ran typecheck: 0 errors.
- Ran lint: 0 errors (2 pre-existing warnings in AuthView.tsx, unrelated).

Stage Summary:
- Phase 1 is complete and verified. All foundation files are in place.
- The app still uses mock data (frontend unchanged) — Phase 3 will swap mock data for DB queries.
- Awaiting user to provide Neon Postgres connection string to run: `npm run db:migrate -- --name init && npm run db:seed`.
- Key files created: prisma/schema.prisma, prisma.config.ts, prisma/seed.ts, src/lib/db.ts, src/lib/env.ts, src/lib/currency.ts, .env.example, scripts/verify-phase-1.ts.
- EXECUTION_PLAN.md updated: Phase 1 marked ✅ Complete.
- Next phase: Phase 2 (Authentication with Better Auth) — will replace Zustand mock auth with real email/password auth, avoiding all 4 previous Supabase failure modes.
