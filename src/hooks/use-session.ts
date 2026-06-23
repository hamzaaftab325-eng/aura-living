/**
 * ============================================================================
 * useSession — React hook for accessing the current auth session
 * ============================================================================
 *
 * Convenience wrapper around Better Auth's useSession hook.
 *
 * USAGE:
 *   'use client';
 *   import { useSession } from '@/hooks/use-session';
 *
 *   function MyComponent() {
 *     const { data: session, isPending, error } = useSession();
 *     if (isPending) return <Loading />;
 *     if (!session) return <SignInPrompt />;
 *     return <p>Hi, {session.user.name}</p>;
 *   }
 *
 * Returns:
 *   - data: Session object ({ user, session }) or null if not logged in
 *   - isPending: true while loading
 *   - error: Error object if session fetch failed
 */

import { authClient } from '@/lib/auth-client';

export function useSession() {
  return authClient.useSession();
}
