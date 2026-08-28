// src/lib/browser-rag.ts

const DB_NAME = 'SchoolCurriculumRAG';
const DB_VERSION = 1;

export interface RAGMatch {
  id: string;
  title: string;
  context: string;
  manifestPath: string;
}

export async function initCurriculumDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('search_index')) {
        const searchStore = db.createObjectStore('search_index', { keyPath: 'id' });
        searchStore.createIndex('tokens', 'tokens', { multiEntry: true });
        searchStore.createIndex('subject', 'subject', { unique: false });
        searchStore.createIndex('phase', 'phase', { unique: false });
      }
      if (!db.objectStoreNames.contains('ast_cache')) {
        db.createObjectStore('ast_cache', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function syncCurriculumIndex(db: IDBDatabase): Promise<void> {
  const count = await new Promise<number>((res) => {
    const tx = db.transaction('search_index', 'readonly');
    const req = tx.objectStore('search_index').count();
    req.onsuccess = () => res(req.result);
    req.onerror = () => res(0);
  });

  if (count > 0) return;

  try {
    const res = await fetch('/schoolsample/manifests/rag-index.json');
    if (!res.ok) {
      // Fallback for root path if base url differs
      const fallbackRes = await fetch('/manifests/rag-index.json');
      if (!fallbackRes.ok) return;
      const indexData = await fallbackRes.json();
      populateStore(db, indexData);
      return;
    }
    const indexData = await res.json();
    populateStore(db, indexData);
  } catch (err) {
    console.warn('[IndexedDB Sync Warning]:', err);
  }
}

function populateStore(db: IDBDatabase, data: any[]) {
  const tx = db.transaction('search_index', 'readwrite');
  const store = tx.objectStore('search_index');
  for (const item of data) {
    store.put(item);
  }
}

export async function searchCurriculum(
  db: IDBDatabase,
  query: string,
  topK: number = 3
): Promise<RAGMatch[]> {
  const queryTokens = Array.from(
    new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    )
  );

  if (!queryTokens.length) return [];

  const tx = db.transaction('search_index', 'readonly');
  const store = tx.objectStore('search_index');
  const tokenIndex = store.index('tokens');

  const scores = new Map<string, { count: number; record: any }>();

  await Promise.all(
    queryTokens.map((token) => {
      return new Promise<void>((resolve) => {
        const request = tokenIndex.openCursor(IDBKeyRange.only(token));
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const entry = cursor.value;
            const current = scores.get(entry.id) || { count: 0, record: entry };
            current.count += 1;
            scores.set(entry.id, current);
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => resolve();
      });
    })
  );

  return Array.from(scores.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, topK)
    .map(({ record }) => ({
      id: record.id,
      title: record.title,
      context: record.ragContext || '',
      manifestPath: record.manifestPath || '',
    }));
}

export async function getLessonManifest(
  db: IDBDatabase,
  id: string,
  manifestPath: string
): Promise<any> {
  const cached = await new Promise<any>((res) => {
    const tx = db.transaction('ast_cache', 'readonly');
    const req = tx.objectStore('ast_cache').get(id);
    req.onsuccess = () => res(req.result);
    req.onerror = () => res(null);
  });

  if (cached?.manifest) return cached.manifest;

  // Normalize baseUrl for Docusaurus if manifestPath starts with '/'
  const targetUrl = manifestPath.startsWith('/schoolsample')
    ? manifestPath
    : `/schoolsample${manifestPath}`;

  let res = await fetch(targetUrl);
  if (!res.ok) {
    res = await fetch(manifestPath);
  }

  if (!res.ok) {
    throw new Error(`Failed to load manifest at ${targetUrl} or ${manifestPath}`);
  }

  const manifest = await res.json();

  const tx = db.transaction('ast_cache', 'readwrite');
  tx.objectStore('ast_cache').put({ id, manifest });

  return manifest;
}