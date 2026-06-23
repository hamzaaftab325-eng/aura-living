import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = ['/account', '/admin'];
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

const PAGE_REDIRECTS: Record<string, string> = {
  home: '/', shop: '/shop', cart: '/cart', checkout: '/checkout',
  wishlist: '/wishlist', account: '/account', about: '/about',
  contact: '/contact', faq: '/faq', shipping: '/shipping', returns: '/returns',
  'care-guide': '/care-guide', 'new-arrivals': '/new-arrivals', sale: '/sale',
  lookbook: '/lookbook', terms: '/terms', privacy: '/privacy',
  'forgot-password': '/auth/forgot-password', 'track-orders': '/account/orders',
  addresses: '/account/addresses', settings: '/account/settings', admin: '/admin',
  login: '/auth/login', signup: '/auth/signup', blog: '/blog',
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Legacy ?page= redirect
  const pageParam = searchParams.get('page');
  if (pageParam && PAGE_REDIRECTS[pageParam]) {
    const target = new URL(PAGE_REDIRECTS[pageParam], request.url);
    searchParams.forEach((value, key) => {
      if (key !== 'page') target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target, 301);
  }

  let response = NextResponse.next({ request });

  // 2. Try to refresh Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcqovnbyhkyzwdzoggdl.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              response = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();

      // 3. Protected route checks
      const isProtected = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
      );
      if (isProtected && !user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // 4. Redirect logged-in users away from auth pages
      const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
      );
      if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/account', request.url));
      }
    } catch {
      // If Supabase fails, continue without auth
    }
  }

  // 5. Cache headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo|images|manifest.json|sw.js).*)'],
};
