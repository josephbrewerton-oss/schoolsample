// src/registerServiceWorker.ts
// PWA Service Worker Registration & Lifecycle Management
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Allow registration in production or if explicitly enabled
  window.addEventListener('load', () => {
    // Determine SW URL based on base URL
    const swUrl = `${import.meta.env.BASE_URL || '/'}sw.js`;
    
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[PWA] Service Worker active. Offline-first zero-data engine initialized.');

        // Immediately check for updates on load
        registration.update().catch(() => {});

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] Stored new curriculum substrate on device. Activating update...');
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              } else {
                console.log('[PWA] Content is permanently stored on device for offline use.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration note:', error);
      });

    // Check for updates when window regains focus (e.g. returning to tab)
    window.addEventListener('focus', () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update().catch(() => {});
      }).catch(() => {});
    });
  });
}
