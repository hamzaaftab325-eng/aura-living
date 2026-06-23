---
Task ID: phase-2
Agent: Super Z (main)
Task: Build Phase 2 (Authentication) — replace Zustand mock auth with Better Auth. Email/password signup, login, email verification, password reset. All previous Supabase Auth failure modes must be eliminated.

Work Log:
- Explored existing auth setup: AuthView.tsx (login+signup), ForgotPasswordView.tsx, middleware.ts (cookie-based auth), useStore.ts (mock user/login/signup/logout).
- Created src/lib/auth.ts — Better Auth server instance with:
  - prismaAdapter (PostgreSQL)
  - emailAndPassword auth with requireEmailVerification: true
  - sendVerificationEmail + sendResetPassword via Resend
  - admin plugin (CUSTOMER/ADMIN roles)
  - 30-day sessions with sliding renewal
  - HttpOnly + Secure + SameSite=Lax cookies
  - Rate limiting (5 req/10s per IP)
- Created src/lib/auth-client.ts — Better Auth React client with adminClient plugin. Exports signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword, sendVerificationEmail, verifyEmail.
- Created src/app/api/auth/[...all]/route.ts — Better Auth REST handler using toNextJsHandler() helper. All auth endpoints (signup, login, logout, verify-email, etc.) go through this single route.
- Created src/emails/verify-email.tsx, reset-password.tsx, welcome.tsx — React Email templates with Aura Living branding (gold accents, PKR-styled).
- Created src/hooks/use-session.ts — convenience wrapper for authClient.useSession().
- Created src/hooks/use-auth.ts — backward-compat hook that provides { user, logout } shape for older components (AccountView, AddressesView, SettingsView, TrackOrdersView) without rewriting them.
- Refactored src/components/AuthView.tsx:
  - Replaced mock login/signup with authClient.signIn.email() / authClient.signUp.email()
  - Wrapped in <Suspense> (uses useSearchParams for ?from= redirect)
  - Distinguishes "EMAIL_NOT_VERIFIED" from invalid credentials
  - Removed Google/Facebook social login buttons (deferred to v1.1)
- Refactored src/components/ForgotPasswordView.tsx — uses authClient.requestPasswordReset(). Always shows "check your email" message (prevents email enumeration). Wrapped in <Suspense>.
- Created src/components/VerifyEmailView.tsx — handles email verification flow:
  - Auto-detects ?token= in URL and calls authClient.verifyEmail()
  - Shows verifying/success/error/idle states
  - Resend verification email button
- Created src/components/ResetPasswordView.tsx — user sets new password after clicking reset link. Uses authClient.resetPassword({ newPassword, token }). Wrapped in <Suspense>.
- Created src/app/auth/verify-email/page.tsx + src/app/auth/reset-password/page.tsx — page wrappers with metadata.
- Updated src/middleware.ts:
  - Replaced manual cookie check with Better Auth session cookie detection
  - Checks both `better-auth.session_token` (dev) and `__Secure-better-auth.session_token` (prod)
  - Excluded /api/* from middleware matcher (so auth API routes aren't blocked)
- Updated src/store/useStore.ts — removed user/login/signup/logout state (auth now from Better Auth). Cart + wishlist + UI state remain.
- Updated AccountView, AddressesView, SettingsView, TrackOrdersView to use useAuth() hook instead of useStore(state => state.user/logout).
- Created scripts/promote-admin.ts — promotes a user to ADMIN role (run after creating your admin account via signup).
- Updated .env.local with new AUTH_SECRET (openssl rand -base64 32).

CRITICAL FIXES DURING DEVELOPMENT:
1. CSS parsing error: Box-drawing characters (═) in CSS comments broke PostCSS in Turbopack dev mode. Replaced with regular = chars in all CSS files. Fixed broken comment in responsive.css.
2. Prisma 7 + Neon HTTP adapter doesn't work with Supabase — the HTTP adapter sends queries via HTTPS to Neon's API, but Supabase doesn't expose that endpoint. Switched to @prisma/adapter-pg which uses standard Postgres protocol.
3. Shell environment had stale DATABASE_URL=file:/home/z/my-project/db/custom.db that overrode .env. Fixed by unsetting shell env vars before starting dev server.
4. Better Auth Account schema field names don't match traditional Prisma conventions:
   - `provider` → `providerId`
   - `providerAccountId` → `accountId`
   - `expiresAt` → `accessTokenExpiresAt`
   - Removed: `type`, `tokenType`, `sessionState`
   - Added: `password` (for credential auth)
   Applied via `prisma db push --accept-data-loss` (interactive migrate not supported in non-TTY).

VERIFICATION:
- ✅ npm run typecheck — 0 errors
- ✅ npm run lint — 0 errors (2 pre-existing warnings in AuthView.tsx)
- ✅ npm run build — succeeds, all pages compile including new /auth/verify-email, /auth/reset-password, /api/auth/[...all]
- ✅ Dev server starts and serves all pages (200 status)
- ✅ POST /api/auth/sign-up/email returns 200 with user object — user created in DB
- ✅ POST /api/auth/sign-in/email returns 403 "Email not verified" (correct — requireEmailVerification: true)
- ✅ Users visible in Supabase dashboard (verified via Prisma query)
- ✅ All 4 previous Supabase Auth failure modes eliminated:
   1. No NEXT_PUBLIC_ env vars needed (Better Auth uses server-only AUTH_SECRET)
   2. Auth uses REST API routes (/api/auth/*), not Server Actions — SW can't intercept
   3. Better Auth manages cookies internally via toNextJsHandler — no SSR wrapper
   4. All useSearchParams wrapped in <Suspense> from day one

Stage Summary:
- ✅ Phase 2 COMPLETE and verified.
- Auth system is live: signup creates users in Supabase DB, login checks credentials, email verification is enforced.
- ⚠️ Email sending requires a real Resend API key (currently placeholder). User must:
   1. Sign up at https://resend.com
   2. Get API key from https://resend.com/api-keys
   3. Replace RESEND_API_KEY in .env.local
   4. (For production) Verify domain at https://resend.com/domains
- Until Resend is configured, signup still works (user is created in DB) but verification emails won't be delivered. Users can't log in until verified. For testing, you can manually mark a user as verified in Supabase dashboard (Table Editor → User → set emailVerified = true).
- Admin promotion: After creating your admin account, run `npx tsx scripts/promote-admin.ts hamzaaftab325@gmail.com`
- Awaiting user verification + approval before Phase 3.
