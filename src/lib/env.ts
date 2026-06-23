/**
 * ============================================================================
 * Environment Variable Validation
 * ============================================================================
 *
 * Centralized, type-safe environment variable access.
 *
 * WHY THIS EXISTS:
 * - Previous Supabase auth failed because NEXT_PUBLIC_SUPABASE_ANON_KEY was
 *   cached by Vercel's build cache and not refreshed on redeploy.
 * - This module enforces strict separation: server-only secrets (no
 *   NEXT_PUBLIC_ prefix) vs client-safe vars.
 * - All env vars are validated at startup. Missing vars throw a clear error
 *   instead of failing silently at runtime.
 *
 * USAGE:
 *   import { env } from '@/lib/env';
 *   const dbUrl = env.DATABASE_URL;
 *
 * CLIENT COMPONENTS:
 *   import { clientEnv } from '@/lib/env';
 *   const appUrl = clientEnv.NEXT_PUBLIC_APP_URL;
 */

import { z } from "zod";

// ----------------------------------------------------------------------------
// Server-only env vars — NEVER import this in client components.
// These are read at runtime, not build-time, so Vercel build cache cannot
// poison them.
// ----------------------------------------------------------------------------

const serverEnvSchema = z.object({
  // Database (Supabase Postgres — pooled connection string, port 6543)
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (Supabase pooled, port 6543)"),

  // Supabase direct connection (used by Prisma Migrate for DDL, port 5432)
  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL is required (Supabase direct, port 5432)"),

  // Better Auth — server-only secret, 32+ chars random
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long"),
  AUTH_URL: z.string().url().optional(),

  // Resend (transactional emails)
  RESEND_API_KEY: z
    .string()
    .min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z
    .string()
    .min(1, "EMAIL_FROM is required (e.g. 'Aura Living <noreply@auraliving.pk>')"),

  // Upstash Redis (rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Vercel Blob (product image uploads)
  BLOB_READ_WRITE_TOKEN: z.string().min(1),

  // Node env
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// ----------------------------------------------------------------------------
// Client-safe env vars — must have NEXT_PUBLIC_ prefix.
// These are inlined at build time and are safe to expose.
// ----------------------------------------------------------------------------

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_CURRENCY: z.string().default("PKR"),
});

// ----------------------------------------------------------------------------
// Parse & validate
//
// IMPORTANT: We do NOT throw at module load time for missing server vars.
// Why? Because Next.js imports this module during `next build` for type
// checking, and we don't want the build to fail if .env.local isn't present
// (e.g. on Vercel build where env vars are injected at runtime).
//
// Instead, we expose the raw values and let consumers fail with a clear
// error when they actually try to use a missing var.
// ----------------------------------------------------------------------------

const serverParsed = serverEnvSchema.safeParse(process.env);
const clientParsed = clientEnvSchema.safeParse(process.env);

// Client env must always be valid (it has safe defaults).
if (!clientParsed.success) {
  console.error("❌ Invalid client environment variables:");
  console.error(clientParsed.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables.");
}

// Server env: log warning if invalid, but don't throw (allows build to proceed).
// The actual runtime check happens when `env` is accessed.
if (!serverParsed.success && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("⚠️  Some server environment variables are missing or invalid.");
  console.warn("   This is OK during build, but the app will fail at runtime if not set.");
  console.warn("   Missing vars:", Object.keys(serverParsed.error.flatten().fieldErrors));
}

// Proxy that throws a clear error if a missing var is accessed at runtime.
export const env = new Proxy(
  serverParsed.success ? serverParsed.data : {},
  {
    get(target, prop: string) {
      if (prop in target) {
        return (target as Record<string, unknown>)[prop];
      }
      throw new Error(
        `Environment variable ${prop} is not set. ` +
          "Add it to .env.local (dev) or Vercel environment variables (prod). " +
          "See .env.example for the full list.",
      );
    },
  },
) as z.infer<typeof serverEnvSchema>;

export const clientEnv = clientParsed.data;
