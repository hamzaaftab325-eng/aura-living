/**
 * ============================================================================
 * Better Auth — Server Instance
 * ============================================================================
 *
 * This is the heart of the authentication system. Better Auth handles ALL
 * cookie operations internally — we never touch cookies directly. This
 * eliminates the Supabase SSR cookie wrapper failure that broke auth before.
 *
 * FEATURES:
 * - Email/password authentication
 * - Email verification (required before first order)
 * - Password reset via email
 * - Admin role plugin (CUSTOMER / ADMIN)
 * - Session cookies: HttpOnly + Secure + SameSite=Lax, 30-day expiry
 *
 * USAGE (server-side only):
 *   import { auth } from '@/lib/auth';
 *   const session = await auth.api.getSession({ headers });
 *   await auth.api.signUpEmail({ body: { email, password, name } });
 *
 * This file MUST NEVER be imported by client components.
 * Client components use `@/lib/auth-client` instead.
 */

import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import VerifyEmailEmail from "@/emails/verify-email";
import ResetPasswordEmail from "@/emails/reset-password";
import WelcomeEmail from "@/emails/welcome";

// ----------------------------------------------------------------------------
// Resend client (initialized once, reused across requests)
// ----------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

// ----------------------------------------------------------------------------
// Better Auth instance
// ----------------------------------------------------------------------------

export const auth = betterAuth({
  // Database adapter — uses our Prisma client
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // App URL (used in email links)
  baseURL: process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  // Server-only secret (32+ chars, set in .env.local)
  secret: process.env.AUTH_SECRET,

  // Email/password auth config
  emailAndPassword: {
    enabled: true,
    // Require email verification before user can log in
    requireEmailVerification: true,
    // Send password reset email
    sendResetPassword: async ({ user, url, token }) => {
      const resetUrl = `${process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

      console.log(`[auth] Sending password reset email to ${user.email}...`);

      try {
        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Aura Living <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your password — Aura Living",
          react: ResetPasswordEmail({
            name: user.name,
            resetUrl,
          }),
        });

        if (result.error) {
          console.error("[auth] Password reset email error from Resend:", result.error);
        } else {
          console.log(`[auth] ✅ Password reset email sent! Email ID: ${result.data?.id}`);
        }
      } catch (error) {
        console.error("[auth] Failed to send password reset email:", error);
      }
    },
    // Reset password redirect URL (after successful reset)
    resetPasswordCallbackUrl: "/auth/login",
  },

  // Email verification config (Better Auth 1.6+ moved this OUT of emailAndPassword)
  emailVerification: {
    // Send a verification email automatically after sign up
    sendOnSignUp: true,
    // Send verification email callback
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

      console.log(`[auth] Sending verification email to ${user.email}...`);

      try {
        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Aura Living <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email — Aura Living",
          react: VerifyEmailEmail({
            name: user.name,
            verificationUrl,
          }),
        });

        if (result.error) {
          console.error("[auth] Verification email error from Resend:", result.error);
        } else {
          console.log(`[auth] ✅ Verification email sent! Email ID: ${result.data?.id}`);
        }
      } catch (error) {
        console.error("[auth] Failed to send verification email:", error);
        // Don't throw — we still want signup to succeed so user can request
        // a new verification email from the verify-email page.
      }
    },
  },

  // Session config
  session: {
    // 30-day session with sliding renewal
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
    updateAge: 60 * 60 * 24 * 7, // Refresh session after 7 days of activity
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache session in cookie for 5 min (reduces DB hits)
    },
  },

  // Plugins
  plugins: [
    // Admin plugin enables role field + admin role check helpers
    admin({
      defaultRole: "CUSTOMER",
      adminRole: "ADMIN",
    }),
  ],

  // User fields — extend with our custom fields
  user: {
    additionalFields: {
      // role field is automatically added by admin plugin, but we map it
      // explicitly to match our Prisma schema
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false, // Users cannot set their own role
      },
    },
  },

  // Rate limiting (basic — full rate limiting in Phase 7 with Upstash)
  rateLimit: {
    enabled: true,
    // 5 requests per 10 seconds per IP for auth endpoints
    storage: "memory",
    window: 10,
    max: 5,
  },

  // Advanced options
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",
    // Default cookie settings
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },
});

// ----------------------------------------------------------------------------
// Send welcome email after successful email verification
// (Called manually from the verify-email page after Better Auth verifies)
// ----------------------------------------------------------------------------

export async function sendWelcomeEmail(name: string, email: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Aura Living <noreply@auraliving.pk>",
      to: email,
      subject: "Welcome to Aura Living 🌿",
      react: WelcomeEmail({ name }),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

// ----------------------------------------------------------------------------
// Type exports — these types are inferred from the auth config above
// ----------------------------------------------------------------------------

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
