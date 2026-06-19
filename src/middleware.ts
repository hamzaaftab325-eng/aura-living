import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Force no-cache on HTML pages so new builds don't serve stale chunks
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  // Apply to all routes except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo|images|manifest.json).*)'],
};
