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
 * WHY DRIVER ADAPTER?
 * Prisma 7+ uses driver adapters for serverless-friendly connections.
 * @prisma/adapter-neon uses HTTP (not TCP), so it works on Vercel Edge
 * Functions and serverless Node.js without connection pool exhaustion.
 *
 * USAGE:
 *   import { prisma } from '@/lib/db';
 *   const products = await prisma.product.findMany();
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

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

  const adapter = new PrismaNeon({ connectionString });

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
