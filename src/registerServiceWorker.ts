// PWA Service Worker Registration & Lifecycle Management
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Successful registration
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New content is available and will be used when all tabs are closed.');
              } else {
                console.log('[PWA] Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[PWA] Service worker registration failed:', error);
      });
  });
}
