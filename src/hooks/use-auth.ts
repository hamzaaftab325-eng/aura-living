/**
 * ============================================================================
 * useAuth — Compatibility wrapper for components that previously used
 * Zustand mock auth.
 * ============================================================================
 *
 * Older components accessed `useStore(state => state.user)` and
 * `useStore(state => state.logout)`. Since we moved auth to Better Auth,
 * those properties no longer exist on the store.
 *
 * This hook provides a backward-compatible interface:
 *   - user: { name, email, memberSince, rewardsPoints } | null
 *   - logout(): signs out via Better Auth, clears cart/wishlist
 *
 * New components should use `useSession` from @/hooks/use-session directly.
 * This hook exists only to avoid rewriting 4 large view components.
 *
 * TODO (Phase 5): Refactor AccountView, AddressesView, SettingsView,
 * TrackOrdersView to use useSession directly, then delete this hook.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useStore } from '@/store/useStore';
import type { User } from '@/types';

interface UseAuthReturn {
  user: User | null;
  logout: () => Promise<void>;
  isPending: boolean;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const clearCart = useStore((state) => state.clearCart);

  // Build a User-shaped object from the Better Auth session
  const user: User | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        memberSince: new Date(session.user.createdAt).getFullYear().toString(),
        rewardsPoints: 450, // Placeholder — will be replaced with real rewards in Phase 5
      }
    : null;

  async function logout() {
    await authClient.signOut();
    clearCart();
    router.push('/auth/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return { user, logout, isPending };
}
