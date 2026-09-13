// src/services/dataSaverStore.ts
// Ultra-low bandwidth & battery saver controller for developing nations and metered networks

const STORAGE_KEY_DATA_SAVER = 'stj_data_saver_mode';
const EVENT_NAME = 'stj_data_saver_changed';

/**
 * Checks whether Data Saver Mode is active.
 * Defaults to true if the client browser has Save-Data enabled (e.g. Chrome Data Saver, Opera Mini)
 * or if the user has explicitly toggled Data Saver in settings.
 */
export function isDataSaverActive(): boolean {
  if (typeof window === 'undefined') return false;

  const userPreference = localStorage.getItem(STORAGE_KEY_DATA_SAVER);
  if (userPreference !== null) {
    return userPreference === 'true';
  }

  // Auto-detect browser connection save-data header/property
  try {
    const nav = navigator as any;
    if (nav?.connection?.saveData === true) {
      return true;
    }
  } catch {}

  return false;
}

/**
 * Toggles or explicitly sets Data Saver Mode
 */
export function setDataSaverMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_DATA_SAVER, enabled ? 'true' : 'false');
  applyDataSaverToDOM(enabled);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { enabled } }));
}

/**
 * Applies or removes data-data-saver attribute on root <html> element
 */
export function applyDataSaverToDOM(enabled: boolean): void {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.documentElement.setAttribute('data-data-saver', 'true');
  } else {
    document.documentElement.removeAttribute('data-data-saver');
  }
}

/**
 * Subscribes to Data Saver toggle changes
 */
export function listenToDataSaverChanges(callback: (enabled: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: any) => {
    const enabled = e.detail?.enabled ?? isDataSaverActive();
    callback(enabled);
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_DATA_SAVER) {
      callback(isDataSaverActive());
    }
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}

/**
 * Detects whether the device is likely constrained (slow connection or low CPU cores)
 */
export function isConstrainedEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  if (isDataSaverActive()) return true;

  try {
    const nav = navigator as any;
    if (nav?.connection) {
      const effectiveType = nav.connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
        return true;
      }
    }
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) {
      return true;
    }
  } catch {}

  return false;
}
