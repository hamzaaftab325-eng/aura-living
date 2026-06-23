/**
 * ============================================================================
 * Better Auth — Catch-All API Route Handler
 * ============================================================================
 *
 * All auth requests go through this single route. Better Auth handles:
 *   POST /api/auth/sign-up/email           — Create account
 *   POST /api/auth/sign-in/email           — Login
 *   POST /api/auth/sign-out                — Logout
 *   POST /api/auth/verify-email            — Verify email with token
 *   POST /api/auth/send-verification-email — Resend verification email
 *   POST /api/auth/request-password-reset  — Request password reset
 *   POST /api/auth/reset-password          — Reset password with token
 *   GET  /api/auth/get-session             — Get current session
 *   GET  /api/auth/list-sessions           — List user's active sessions
 *
 * This is a Route Handler (not a Server Action), which means:
 * - The Service Worker cannot intercept it (it's a regular fetch, not a form post)
 * - Vercel build cache doesn't poison it (URL is fixed, no env vars needed in URL)
 * - Better Auth manages cookies via Set-Cookie header (no SSR wrapper needed)
 *
 * This eliminates all 4 previous Supabase Auth failure modes.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// better-auth provides a helper that converts the auth handler to Next.js
// GET + POST route handlers with proper cookie/header handling.
export const { GET, POST } = toNextJsHandler(auth);
