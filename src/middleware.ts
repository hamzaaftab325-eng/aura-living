import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Aura Living middleware — handles:
 * 1. Legacy hash URL redirects (#product/1 → /product/<slug>)
 * 2. Admin route protection (redirects to /auth/login if no user cookie)
 * 3. Cache-Control headers for HTML pages
 *
 * Note: The hash fragment (#...) is NOT sent to the server in the HTTP request,
 * so we can't directly redirect based on hash. Instead, the home page's
 * client-side useEffect handles legacy hash redirects on the client.
 * This middleware still handles:
 * - Admin protection (cookie-based)
 * - Cache headers
 * - Old query-string style redirects (?page=shop → /shop)
 */

// Map old SPA page names to new routes
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

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ── 1. Legacy ?page= redirect (old SPA-style query string) ────────────────
  const pageParam = searchParams.get('page');
  if (pageParam && PAGE_REDIRECTS[pageParam]) {
    const target = new URL(PAGE_REDIRECTS[pageParam], request.url);
    // Preserve other search params (like category, search)
    searchParams.forEach((value, key) => {
      if (key !== 'page') target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target, 301);
  }

  // ── 2. Admin route protection ─────────────────────────────────────────────
  // Redirect /admin to /auth/login if no auth cookie present.
  // (Cookie-based auth will be implemented in Phase 11 with real backend;
  //  for now we check a simple 'aura-user' cookie that the client sets on login.)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const userCookie = request.cookies.get('aura-admin')?.value;
    if (!userCookie || userCookie !== 'true') {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 3. Account route protection (light — client-side also checks) ────────
  if (pathname === '/account' || pathname.startsWith('/account/')) {
    const userCookie = request.cookies.get('aura-user')?.value;
    if (!userCookie) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 4. Cache-Control headers for HTML pages ──────────────────────────────
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  // Apply to all routes except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo|images|manifest.json|sw.js).*)'],
};
