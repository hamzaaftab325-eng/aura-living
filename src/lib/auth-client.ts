/**
 * ============================================================================
 * Better Auth — Client (for client components)
 * ============================================================================
 *
 * This is the browser-safe client for Better Auth. It provides typed methods
 * for sign up, sign in, sign out, password reset, and session fetching.
 *
 * USAGE (in client components only):
 *   'use client';
 *   import { authClient } from '@/lib/auth-client';
 *   const { data: session } = authClient.useSession();
 *   await authClient.signIn.email({ email, password });
 *
 * WHY THIS IS SEPARATE FROM src/lib/auth.ts:
 * - src/lib/auth.ts uses Prisma + Resend (server-only deps)
 * - This file uses only fetch() — safe to bundle in client
 * - The actual auth logic runs on the server at /api/auth/[...all]
 */

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// ----------------------------------------------------------------------------
// Better Auth client — talks to /api/auth/* on our server
// ----------------------------------------------------------------------------

export const authClient = createAuthClient({
  // Base URL of the app — auth API routes live at /api/auth/*
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  // Plugins — admin client adds role-based helpers
  plugins: [adminClient()],
});

// ----------------------------------------------------------------------------
// Convenience re-exports (so components can do `import { signIn } from ...`)
// ----------------------------------------------------------------------------

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} = authClient;
