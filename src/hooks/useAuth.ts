'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/browser';
import type { User } from '@supabase/supabase-js';

/**
 * useAuth — Client-side authentication state hook.
 *
 * Automatically syncs when user logs in/out from any tab.
 *
 * @returns { user, loading, signOut }
 */
export function useAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  return { user, loading, signOut };
}
