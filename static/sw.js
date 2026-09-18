// static/sw.js
// Ultra-Low-Bandwidth Offline Engine & Service Worker for St Joseph's Learning Portal
// Designed for developing nations, metered data plans, and air-gapped schools.
// Cache key is bound directly to the curriculum composite digest for content-addressed immutability.
const MANIFEST_HASH = '1d2f641009fc';
const CACHE_NAME = `stj-manifest-v-${MANIFEST_HASH}`;

// Critical core assets to pre-cache on install for instant offline boot
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest-digests.json',
  './favicon.ico',
  './img/logo.svg',
  './img/logo.png',
  './img/logo-512.png',
  './img/favicon-32x32.png',
  './img/favicon-16x16.png',
  './img/apple-touch-icon.png',
  './nano-map.ast',
  './patterns/mcq.ast',
  './patterns/fill-blank.ast',
  './patterns/numeric.ast',
  './patterns/pair-sort.ast',
  './patterns/harmony.ast',
  './manifests/catalog.json',
  './manifests/rag-index.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache critical shell assets, catching any missing files gracefully
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url, { cache: 'no-cache' })
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_URLS' && Array.isArray(event.data.urls)) {
    caches.open(CACHE_NAME).then((cache) => {
      event.data.urls.forEach((u) => {
        fetch(u).then((r) => {
          if (r.ok) cache.put(u, r);
        }).catch(() => {});
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept non-http protocols or Vite dev server internals & HMR endpoints
  if (
    url.protocol !== 'http:' && url.protocol !== 'https:' ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.search.includes('v=') ||
    url.search.includes('t=') ||
    url.search.includes('import') ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1'
  ) {
    return;
  }

  // Navigation requests (HTML pages): Serve cached index.html immediately if offline or on navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then((cachedShell) => {
          // If cached shell exists, return it immediately to avoid cellular network latency & data usage
          if (cachedShell) {
            // Optional background revalidate
            fetch(request)
              .then((netRes) => {
                if (netRes && netRes.ok) {
                  caches.open(CACHE_NAME).then((c) => c.put(request, netRes));
                }
              })
              .catch(() => {});
            return cachedShell;
          }

          // If no cached shell yet, fetch from network and cache
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
              }
              return networkResponse;
            })
            .catch(async () => {
              return (await caches.match('./index.html')) || (await caches.match('/')) || new Response('Offline Portal Ready', { status: 200, headers: { 'Content-Type': 'text/html' } });
            });
        })
    );
    return;
  }

  // Cache-First Strategy for all static assets (scripts, styles, images, manifests, AST files)
  // This guarantees 0 bytes of cellular data are used for any asset already stored on the device.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not yet in cache, fetch once from network, clone into cache, then return
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const fallback = await caches.match(request);
          if (fallback) return fallback;
          return new Response('Asset offline', { status: 503, statusText: 'Offline Resource' });
        });
    })
  );
});
