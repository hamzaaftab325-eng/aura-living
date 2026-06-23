import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PAGE_REDIRECTS: Record<string, string> = {
  home: '/', shop: '/shop', cart: '/cart', checkout: '/checkout', wishlist: '/wishlist', account: '/account', about: '/about', contact: '/contact', faq: '/faq', shipping: '/shipping', returns: '/returns', 'care-guide': '/care-guide', 'new-arrivals': '/new-arrivals', sale: '/sale', lookbook: '/lookbook', terms: '/terms', privacy: '/privacy', 'forgot-password': '/auth/forgot-password', 'track-orders': '/account/orders', addresses: '/account/addresses', settings: '/account/settings', admin: '/admin', login: '/auth/login', signup: '/auth/signup', blog: '/blog',
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const pageParam = searchParams.get('page');
  if (pageParam && PAGE_REDIRECTS[pageParam]) {
    const target = new URL(PAGE_REDIRECTS[pageParam], request.url);
    searchParams.forEach((value, key) => { if (key !== 'page') target.searchParams.set(key, value); });
    return NextResponse.redirect(target, 301);
  }
  if ((pathname === '/account' || pathname.startsWith('/account/')) && !request.cookies.get('aura-user')?.value) {
    const loginUrl = new URL('/auth/login', request.url); loginUrl.searchParams.set('from', pathname); return NextResponse.redirect(loginUrl);
  }
  if ((pathname === '/admin' || pathname.startsWith('/admin/')) && (!request.cookies.get('aura-admin')?.value || request.cookies.get('aura-admin')?.value !== 'true')) {
    const loginUrl = new URL('/auth/login', request.url); loginUrl.searchParams.set('from', pathname); return NextResponse.redirect(loginUrl);
  }
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo|images|manifest.json|sw.js).*)'] };
