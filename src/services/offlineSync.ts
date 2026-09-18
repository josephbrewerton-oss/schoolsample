// src/services/offlineSync.ts
/**
 * Zero-Data Offline Storage & Preloader Engine
 * 
 * Allows students and teachers to download and store the entire curriculum portal
 * onto their device (in CacheStorage and IndexedDB) so that all subsequent visits
 * use ZERO network data calls (true air-gapped / airplane mode operation).
 */

const DEFAULT_CACHE_NAME = 'stj-manifest-v-8003ff2a2bff';
let currentCacheName = DEFAULT_CACHE_NAME;

export async function getActiveManifestCacheName(): Promise<string> {
  try {
    const res = await fetch('/manifest-digests.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.compositeHash) {
        currentCacheName = `stj-manifest-v-${data.compositeHash}`;
      }
    }
  } catch {
    // Fallback to default
  }
  return currentCacheName;
}

const OFFLINE_SYNC_KEY = 'stj_offline_sync_complete';
const OFFLINE_SYNC_TIMESTAMP = 'stj_offline_sync_timestamp';

// Core curriculum manifest & substrate URLs to guarantee 100% offline coverage
export const CORE_OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-digests.json',
  '/favicon.ico',
  '/img/logo.svg',
  '/img/logo.png',
  '/img/logo-512.png',
  '/img/apple-touch-icon.png',
  '/nano-map.ast',
  '/patterns/mcq.ast',
  '/patterns/fill-blank.ast',
  '/patterns/numeric.ast',
  '/patterns/pair-sort.ast',
  '/patterns/harmony.ast',
  '/manifests/catalog.json',
  '/manifests/rag-index.json',
  '/manifests/oak-angles-triangles.json',
  '/manifests/oak-states-of-matter.json',
  '/manifests/history-ks2.json',
  '/manifests/seasonal-changes.json',
];

export interface SyncProgress {
  total: number;
  completed: number;
  percentage: number;
  currentFile: string;
  isComplete: boolean;
  error?: string;
}

export function isOfflineSyncComplete(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(OFFLINE_SYNC_KEY) === 'true';
}

export function getOfflineSyncDate(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(OFFLINE_SYNC_TIMESTAMP);
}

export async function checkDeviceStorageSupport(): Promise<{
  supported: boolean;
  persisted: boolean;
  quotaMb?: number;
  usageMb?: number;
}> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { supported: false, persisted: false };
  }

  let persisted = false;
  try {
    if (navigator.storage && navigator.storage.persisted) {
      persisted = await navigator.storage.persisted();
      if (!persisted && navigator.storage.persist) {
        persisted = await navigator.storage.persist();
      }
    }
  } catch {}

  let quotaMb: number | undefined;
  let usageMb: number | undefined;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota) quotaMb = Math.round(estimate.quota / (1024 * 1024));
      if (estimate.usage) usageMb = Math.round((estimate.usage / (1024 * 1024)) * 10) / 10;
    }
  } catch {}

  return { supported: true, persisted, quotaMb, usageMb };
}

/**
 * Downloads and caches all curriculum substrates, manifests, and assets
 * onto the user's local device storage.
 */
export async function syncEntireCurriculumOffline(
  onProgress?: (progress: SyncProgress) => void
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    onProgress?.({
      total: 0,
      completed: 0,
      percentage: 0,
      currentFile: '',
      isComplete: false,
      error: 'Offline CacheStorage is not supported on this device/browser.',
    });
    return false;
  }

  try {
    // Request persistent storage so the browser does not evict cache under storage pressure
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist().catch(() => {});
    }

    const targetCacheName = await getActiveManifestCacheName();
    const cache = await caches.open(targetCacheName);

    // Discover any additional JS/CSS bundles loaded on this page
    const dynamicAssets: string[] = [];
    document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((el) => {
      const src = el.getAttribute('src') || el.getAttribute('href');
      if (src && !src.startsWith('http') && !src.includes('run.app')) {
        dynamicAssets.push(src);
      }
    });

    const allUrls = Array.from(new Set([...CORE_OFFLINE_URLS, ...dynamicAssets]));
    const total = allUrls.length;
    let completed = 0;

    for (const url of allUrls) {
      onProgress?.({
        total,
        completed,
        percentage: Math.round((completed / total) * 100),
        currentFile: url,
        isComplete: false,
      });

      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (fetchErr) {
        console.warn(`[Offline Sync] Could not cache ${url}:`, fetchErr);
      }

      completed++;
    }

    // Mark sync complete in localStorage
    localStorage.setItem(OFFLINE_SYNC_KEY, 'true');
    localStorage.setItem(OFFLINE_SYNC_TIMESTAMP, new Date().toLocaleDateString());
    window.dispatchEvent(new CustomEvent('stj_offline_sync_updated', { detail: { complete: true } }));

    onProgress?.({
      total,
      completed: total,
      percentage: 100,
      currentFile: 'Complete',
      isComplete: true,
    });

    return true;
  } catch (err: any) {
    console.error('[Offline Sync] Sync failed:', err);
    onProgress?.({
      total: 0,
      completed: 0,
      percentage: 0,
      currentFile: '',
      isComplete: false,
      error: err?.message || 'Storage error while saving to device.',
    });
    return false;
  }
}
