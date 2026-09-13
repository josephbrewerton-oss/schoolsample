// src/services/offlineSyncService.ts
// Offline-first curriculum preloader for low-connectivity schools and emerging nations

export interface SyncProgress {
  total: number;
  completed: number;
  percent: number;
  currentFile: string;
  status: 'idle' | 'syncing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface OfflineStatus {
  isCached: boolean;
  cachedCount: number;
  lastSyncTime?: number;
}

const CACHE_NAME = 'st-josephs-pwa-v1';
const SYNC_TIMESTAMP_KEY = 'stj_offline_sync_timestamp';

/**
 * Checks cache storage to inspect how many items are already cached offline.
 */
export async function getOfflineStatus(): Promise<OfflineStatus> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { isCached: false, cachedCount: 0 };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const lastSync = localStorage.getItem(SYNC_TIMESTAMP_KEY);

    return {
      isCached: keys.length > 10,
      cachedCount: keys.length,
      lastSyncTime: lastSync ? parseInt(lastSync, 10) : undefined,
    };
  } catch (err) {
    console.warn('[OfflineSync] Could not inspect cache:', err);
    return { isCached: false, cachedCount: 0 };
  }
}

/**
 * Downloads all core curriculum manifests, AST rules, and app shells into the Service Worker cache.
 * Designed so a teacher or student in an emerging nation can connect once (e.g. at school/library)
 * and then study completely offline with 0 KB mobile data usage.
 */
export async function downloadCurriculumForOffline(
  onProgress?: (progress: SyncProgress) => void
): Promise<{ success: boolean; count: number; error?: string }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { success: false, count: 0, error: 'Cache storage is not supported on this browser.' };
  }

  try {
    const cache = await caches.open(CACHE_NAME);

    // 1. Initial targets
    const coreUrls = [
      '/',
      '/index.html',
      '/manifest.json',
      '/favicon.ico',
      '/img/logo.svg',
      '/img/logo.png',
      '/nano-map.ast',
      '/manifests/rag-index.json',
    ];

    let totalUrls = [...coreUrls];

    // 2. Discover all lesson manifests from RAG index
    try {
      const ragRes = await fetch('/manifests/rag-index.json');
      if (ragRes.ok) {
        const ragData = await ragRes.json();
        if (Array.isArray(ragData)) {
          ragData.forEach((item: any) => {
            if (item.manifestPath && !totalUrls.includes(item.manifestPath)) {
              totalUrls.push(item.manifestPath);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[OfflineSync] Could not fetch RAG index for manifest listing:', e);
    }

    let completed = 0;
    const total = totalUrls.length;

    onProgress?.({
      total,
      completed: 0,
      percent: 0,
      currentFile: 'Starting curriculum cache...',
      status: 'syncing',
    });

    // 3. Cache assets with graceful concurrency
    const BATCH_SIZE = 4;
    for (let i = 0; i < totalUrls.length; i += BATCH_SIZE) {
      const batch = totalUrls.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) {
              await cache.put(url, res);
            }
          } catch (err) {
            console.warn(`[OfflineSync] Skipping non-essential file: ${url}`, err);
          } finally {
            completed++;
            const percent = Math.round((completed / total) * 100);
            onProgress?.({
              total,
              completed,
              percent,
              currentFile: url,
              status: 'syncing',
            });
          }
        })
      );
    }

    localStorage.setItem(SYNC_TIMESTAMP_KEY, Date.now().toString());

    onProgress?.({
      total,
      completed: total,
      percent: 100,
      currentFile: 'All units saved offline!',
      status: 'completed',
    });

    return { success: true, count: completed };
  } catch (err: any) {
    const msg = err?.message || 'Sync failed';
    onProgress?.({
      total: 0,
      completed: 0,
      percent: 0,
      currentFile: '',
      status: 'error',
      errorMessage: msg,
    });
    return { success: false, count: 0, error: msg };
  }
}
