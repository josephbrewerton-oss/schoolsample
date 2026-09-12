// Service Worker for St Joseph's Learning Portal (PWA Offline Engine)
const CACHE_NAME = 'st-josephs-pwa-v1';

// Critical core assets to pre-cache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './img/logo.svg',
  './img/logo.png',
  './img/logo-512.png',
  './img/favicon-32x32.png',
  './img/favicon-16x16.png',
  './img/apple-touch-icon.png',
  './nano-map.ast'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache critical shell assets, catching any missing files gracefully
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
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

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // For app navigation requests (HTML pages), try network first, fall back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return networkResponse;
          }
          return caches.match('./index.html') || caches.match('/');
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return (await caches.match('./index.html')) || (await caches.match('/'));
        })
    );
    return;
  }

  // Cache-first strategy for static assets (scripts, styles, images, fonts, ast)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Network fallback
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});

