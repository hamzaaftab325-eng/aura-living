import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Supabase Browser Client (Singleton)
 *
 * Uses @supabase/ssr for proper cookie sync with server client.
 * Falls back to dummy client if env vars are missing (build-time safety).
 *
 * The anon key is PUBLIC — it's safe to hardcode as fallback.
 * It's protected by Row Level Security, not by being secret.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let browserClient: any = null;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcqovnbyhkyzwdzoggdl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcW92bmJ5aGt5endkem9nZ2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjY4MDcsImV4cCI6MjA5NzcwMjgwN30.L7qaIcPY-FX-SnL4Lhn7l62-1d_9RcLD0-BnIYjPQLE';

export function createClient() {
  if (browserClient) return browserClient;

  // During build, return dummy client to prevent SSG crashes
  if (typeof window === 'undefined') {
    browserClient = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('SSR') }),
        signUp: async () => ({ data: null, error: new Error('SSR') }),
        signOut: async () => ({ error: null }),
        signInWithOAuth: async () => ({ data: { url: '' }, error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
        updateUser: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ data: null, error: null, maybeSingle: async () => ({ data: null, error: null }) }),
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
        delete: async () => ({ error: null }),
      }),
    };
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}
