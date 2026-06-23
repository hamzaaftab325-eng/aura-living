---
Task ID: phase-1
Agent: Super Z (main)
Task: Build Phase 1 (Foundation) — install Prisma 7 + deps, create schema, lib files, seed script. All must typecheck + lint clean. No DB connection needed yet.

Work Log:
- Installed Prisma 7 stack: prisma@7.8.0, @prisma/client@7.8.0, @prisma/adapter-neon@7.8.0, better-auth@1.6.20, resend@6.14.0, react-email@6.6.4, @react-email/components@1.0.12, @upstash/redis@1.38.0, @upstash/ratelimit@2.0.8, zod@4.4.3, nanoid@5.1.15, tsx@4.22.4 (dev).
- Created prisma/schema.prisma with 17 models + 6 enums (Prisma 7 syntax: provider only in datasource, URL in prisma.config.ts).
- Created prisma.config.ts using defineConfig() with datasource.url + migrations config.
- Validated schema: `npx prisma validate` → "schema is valid 🚀"
- Generated Prisma client: `npx prisma generate` → success.
- Created src/lib/db.ts: Prisma client singleton with PrismaNeon adapter, cached on globalThis for HMR safety.
- Created src/lib/env.ts: Zod-validated env vars. Uses Proxy pattern so missing vars throw clear runtime errors (not build-time errors). Strict server/client separation.
- Created src/lib/currency.ts: PKR helpers — formatPKR, formatPKRNumber, rupeesToPaisa, paisaToRupees, calculatePercentageDiscount, addPaisa, subtractPaisa.
- Created prisma/seed.ts: Idempotent seed using upsert. Reads from existing mock data (src/data/products.ts) → seeds 6 categories, 46 products (with images), 2 coupons (WELCOME10, AURA500).
- Created .env.example documenting all required env vars with notes on why NEXT_PUBLIC_ is forbidden for secrets.
- Updated package.json scripts: db:generate, db:migrate, db:migrate:prod, db:push, db:seed, db:studio, db:reset. Added prisma.seed config.
- Updated tsconfig.json target: ES2017 → ES2021 (BigInt support required by Prisma BigInt fields).
- Created scripts/verify-phase-1.ts: automated verification of all 67 Phase 1 deliverables.
- Ran verification: 67/67 checks PASSED.
- Ran typecheck: 0 errors.
- Ran lint: 0 errors (2 pre-existing warnings in AuthView.tsx, unrelated).

Stage Summary:
- Phase 1 code complete and verified. All files in place, all checks pass.
- App still uses mock data (frontend unchanged) — Phase 3 will swap mock for DB queries.
- Awaiting user's Supabase credentials to run: `npm run db:migrate -- --name init && npm run db:seed`.
- Once migrated + seeded, Phase 1 is truly complete and we proceed to Phase 2 (Better Auth).
- Key files: prisma/schema.prisma, prisma.config.ts, prisma/seed.ts, src/lib/db.ts, src/lib/env.ts, src/lib/currency.ts, .env.example, scripts/verify-phase-1.ts.
