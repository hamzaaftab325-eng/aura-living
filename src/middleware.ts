import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ============================================================================
 * Middleware — Auth + Redirect + Cache Headers
 * ============================================================================
 *
 * CHANGES FROM PREVIOUS VERSION:
 * - Replaced manual cookie check (`aura-user`) with Better Auth session cookie
 *   detection. Better Auth manages all cookies internally — we just check if
 *   the session cookie exists. The actual session VALIDATION (expiry, DB
 *   lookup) happens in Server Components via `auth.api.getSession()`.
 *
 * WHY ONLY CHECK COOKIE PRESENCE (not validate):
 * - Middleware runs on Edge runtime — can't do DB queries
 * - Cookie presence is enough for the redirect decision
 * - Server Components do the real session validation
 *
 * Better Auth session cookie name: `better-auth.session_token` (dev) or
 * `__Secure-better-auth.session_token` (prod).
 */

const PAGE_REDIRECTS: Record<string, string> = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  wishlist: '/wishlist',
  account: '/account',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  shipping: '/shipping',
  returns: '/returns',
  'care-guide': '/care-guide',
  'new-arrivals': '/new-arrivals',
  sale: '/sale',
  lookbook: '/lookbook',
  terms: '/terms',
  privacy: '/privacy',
  'forgot-password': '/auth/forgot-password',
  'track-orders': '/account/orders',
  addresses: '/account/addresses',
  settings: '/account/settings',
  admin: '/admin',
  login: '/auth/login',
  signup: '/auth/signup',
  blog: '/blog',
};

// Better Auth session cookie names
const SESSION_COOKIE_NAMES = [
  'better-auth.session_token',
  '__Secure-better-auth.session_token',
  // Legacy cookies (kept for backward compat during migration)
  'aura-user',
  'aura-admin',
];

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.get(name)?.value);
}

function hasAdminCookie(request: NextRequest): boolean {
  // For admin routes, we still check the legacy aura-admin cookie OR the
  // Better Auth session cookie. The actual admin role check happens in the
  // Server Component (via auth.api.getSession + user.role === 'ADMIN').
  return (
    request.cookies.get('aura-admin')?.value === 'true' ||
    SESSION_COOKIE_NAMES.some((name) => request.cookies.get(name)?.value)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const pageParam = searchParams.get('page');

  // 1. Legacy ?page= redirects
  if (pageParam && PAGE_REDIRECTS[pageParam]) {
    const target = new URL(PAGE_REDIRECTS[pageParam], request.url);
    searchParams.forEach((value, key) => {
      if (key !== 'page') target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target, 301);
  }

  // 2. Protect /account/* routes — must have session cookie
  if (
    (pathname === '/account' || pathname.startsWith('/account/')) &&
    !hasSessionCookie(request)
  ) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Protect /admin/* routes — must have session cookie
  //    (Server Component will verify admin role)
  if (
    (pathname === '/admin' || pathname.startsWith('/admin/')) &&
    !hasAdminCookie(request)
  ) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Add no-cache headers to all dynamic pages
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo|images|manifest.json|sw.js|api).*)',
  ],
};
