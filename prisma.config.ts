// ============================================================================
// Prisma 7+ Configuration
// ============================================================================
//
// In Prisma 7, the datasource URL is configured here (not in schema.prisma).
// The schema.prisma file only declares the database provider ("postgresql").
//
// The driver adapter (@prisma/adapter-neon) is NOT configured here — it is
// passed to the PrismaClient constructor at runtime in src/lib/db.ts.
// This file is used by the Prisma CLI (migrate, db push, studio).
//
// For Supabase Postgres:
// - DIRECT_URL (port 5432) is used for migrations (direct connection)
// - DATABASE_URL (port 6543) is used for app runtime (pooled via PgBouncer)
// ============================================================================

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // Prisma Migrate reads this URL to apply migrations.
  // Use the DIRECT (non-pooled) Supabase connection string for migrations.
  // The pooled connection is used at runtime by the PrismaClient adapter.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },

  // Migration files location + seed command
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
