// Aura Living Service Worker — enhanced offline support
// Caches app shell, product images, and provides offline fallback page.

const CACHE_VERSION = 'aura-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// App shell — critical resources for offline access
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/logo/default-monochrome-gold-white.svg',
  '/favicon.ico',
];

// Install — pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(APP_SHELL).catch((err) => {
        // Don't fail install if some resources aren't available yet
        console.warn('SW: Some app shell resources failed to cache:', err);
      })
    )
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip Next.js HMR in development
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // ─── Image requests — cache-first with network fallback ───
  if (
    request.destination === 'image' ||
    /\.(webp|jpg|jpeg|png|gif|svg|avif)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          // Return cached version or 1x1 transparent pixel
          return cached || new Response(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            { headers: { 'Content-Type': 'image/png' } }
          );
        }
      })
    );
    return;
  }

  // ─── Static assets — cache-first (immutable, hashed) ───
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // ─── Navigation requests — network-first with cache + offline fallback ───
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          // Cache successful page responses
          if (response.ok && response.status === 200) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          // Try cache first
          const cached = await caches.match(request);
          if (cached) return cached;

          // Try home page cache
          const homeCached = await caches.match('/');
          if (homeCached) return homeCached;

          // Fall back to offline page
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) return offlinePage;

          // Last resort — basic offline response
          return new Response(
            '<!DOCTYPE html><html><head><title>Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:50px"><h1>You are offline</h1><p>Please check your internet connection and try again.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })()
    );
    return;
  }

  // ─── Default — try network, fall back to cache ───
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
