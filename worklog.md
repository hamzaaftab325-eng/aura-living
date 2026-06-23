---
Task ID: phase-1
Agent: Super Z (main)
Task: Build Phase 1 (Foundation) — install Prisma 7, create schema, lib files, seed script. Connect to Supabase, run migration + seed. All checks must pass.

Work Log:
- Installed Prisma 7 stack: prisma@7.8.0, @prisma/client@7.8.0, @prisma/adapter-neon@7.8.0, better-auth, resend, react-email, @react-email/components, @upstash/redis, @upstash/ratelimit, zod, nanoid, tsx (dev), dotenv.
- Created prisma/schema.prisma with 17 models + 6 enums (Prisma 7 syntax). All money stored as BigInt paisa.
- Created prisma.config.ts using defineConfig() with datasource.url (reads DIRECT_URL via dotenv loading).
- Validated schema: `npx prisma validate` → "schema is valid 🚀"
- Generated Prisma client: `npx prisma generate` → success.
- Created src/lib/db.ts: Prisma client singleton with PrismaNeon adapter, cached on globalThis for HMR safety.
- Created src/lib/env.ts: Zod-validated env vars. Uses Proxy pattern so missing vars throw clear runtime errors. Strict server/client separation.
- Created src/lib/currency.ts: PKR helpers — formatPKR, formatPKRNumber, rupeesToPaisa, paisaToRupees, calculatePercentageDiscount, addPaisa, subtractPaisa.
- Created prisma/seed.ts: Idempotent seed using upsert. Reads from existing mock data (src/data/products.ts) → seeds 6 categories, 45 products (with images), 2 coupons (WELCOME10, AURA500). Uses PrismaNeon adapter with DIRECT_URL for long-running script reliability.
- Created .env.example + .env.local with real Supabase credentials (password URL-encoded: ! → %21, # → %23).
- Created .env (copy of .env.local) so Prisma CLI auto-loads it.
- Updated package.json scripts: db:generate, db:migrate, db:migrate:prod, db:push, db:seed, db:studio, db:reset. Added prisma.seed config.
- Updated tsconfig.json target: ES2017 → ES2021 (BigInt support).
- Created scripts/verify-phase-1.ts: 67 automated checks (all PASSED).
- Created scripts/verify-db.ts: queries Supabase to verify seeded data.
- Ran `npx prisma migrate dev --name init` → 17 tables created in Supabase.
- Ran `npm run db:seed` → 6 categories, 45 products, 2 coupons seeded successfully.
- Ran verify-db.ts → confirmed all data is live in Supabase.
- Ran typecheck: 0 errors. Ran lint: 0 errors (2 pre-existing warnings).

Stage Summary:
- ✅ Phase 1 COMPLETE and verified.
- ✅ Database live: 17 tables in Supabase (jrjhonvpkhimpajmjtmq project).
- ✅ Seed data: 6 categories (Lighting, Plants & Pots, Vases & Decor, Candles & Fragrance, Wall Art & Mirrors, Kitchen & Dining), 45 products (Lighting category fully populated, PKR prices Rs. 1,500 - Rs. 89,000), 2 coupons (WELCOME10: 10% off max Rs. 1,000; AURA500: flat Rs. 500 off above Rs. 5,000).
- ⚠️ Note: 45 products seeded (1 product from mock data had category 'new-arrivals' which doesn't match a seeded category — skipped with warning). This is fine; we'll add a 'new-arrivals' view filter in Phase 3.
- App still uses mock data on frontend — Phase 3 will swap to DB queries.
- Awaiting user verification + approval before Phase 2.
- Security reminder: User shared DB password in chat. Recommend rotating it after Phase 1 verification (Supabase Dashboard → Settings → Database → Reset password).
