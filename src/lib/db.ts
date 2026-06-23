/**
 * ============================================================================
 * Prisma Client Singleton
 * ============================================================================
 *
 * WHY A SINGLETON?
 * Next.js hot-reloads dev server, which can spawn many Prisma Client
 * instances and exhaust DB connections. We cache the client on globalThis
 * to reuse one instance per dev session.
 *
 * WHY @prisma/adapter-pg (not @prisma/adapter-neon)?
 * The Neon HTTP adapter only works with Neon databases (it sends queries
 * via HTTPS to Neon's API). Supabase uses standard Postgres protocol, so
 * we use @prisma/adapter-pg which uses the standard `pg` library.
 *
 * We use the POOLED connection (DATABASE_URL, port 6543) at runtime — this
 * goes through Supabase's PgBouncer and supports many concurrent connections
 * without exhausting the database.
 *
 * USAGE:
 *   import { prisma } from '@/lib/db';
 *   const products = await prisma.product.findMany();
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Cache on globalThis to survive HMR in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (dev) or Vercel environment variables (prod).",
    );
  }

  // Debug: log the URL being used (mask password)
  if (process.env.NODE_ENV === "development") {
    const maskedUrl = connectionString.replace(
      /(:\/\/[^:]+:)[^@]+(@)/,
      "$1***$2",
    );
    console.log(`[db] Using connection string: ${maskedUrl}`);
  }

  // PrismaPg uses the standard `pg` library — works with any Postgres
  // database including Supabase. We pass the connection string directly;
  // pg.Pool handles connection pooling on the client side.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
