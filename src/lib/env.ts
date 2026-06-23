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
  // Database (Neon Postgres — pooled connection string)
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid Postgres connection URL")
    .min(1, "DATABASE_URL is required"),

  // Neon direct connection (used by Prisma Migrate for DDL operations)
  DIRECT_URL: z
    .string()
    .url("DIRECT_URL must be a valid Postgres connection URL")
    .min(1, "DIRECT_URL is required"),

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
// ----------------------------------------------------------------------------

const serverParsed = serverEnvSchema.safeParse(process.env);
const clientParsed = clientEnvSchema.safeParse(process.env);

// In development, fail loudly so devs fix missing vars immediately.
// In production, also fail — better to crash on boot than serve broken pages.
if (!serverParsed.success) {
  console.error("❌ Missing or invalid server environment variables:");
  console.error(serverParsed.error.flatten().fieldErrors);
  throw new Error(
    "Invalid server environment. Check .env.local (dev) or Vercel project settings (prod).",
  );
}

if (!clientParsed.success) {
  console.error("❌ Missing or invalid client environment variables:");
  console.error(clientParsed.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables.");
}

export const env = serverParsed.data;
export const clientEnv = clientParsed.data;
