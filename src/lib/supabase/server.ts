import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Supabase Server Client
 *
 * Uses @supabase/ssr for proper cookie sync.
 * Uses SUPABASE_SERVICE_ROLE_KEY for reliable Vercel runtime injection.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcqovnbyhkyzwdzoggdl.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can be ignored if called from a Server Component
        }
      },
    },
  });
}
