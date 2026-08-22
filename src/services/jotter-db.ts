const DB_NAME = 'SchoolAiJotter';
const STORE_NAME = 'session_events';
const DB_VERSION = 1;

export interface JotterEntry {
  sessionId: string;
  timestamp: number;
  nodePath: string; // e.g. "ks2/maths/fractions/frac-01"
  actor: 'student' | 'nano' | 'system';
  payload: string;  // e.g. "(attempt :val \"1/4\" :correct false)" or raw AST patch
}

export function openJotterDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { autoIncrement: true, keyPath: 'id' });
        store.createIndex('sessionId', 'sessionId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function appendJotter(entry: Omit<JotterEntry, 'timestamp'>): Promise<void> {
  const db = await openJotterDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add({ ...entry, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecentJotterEntries(sessionId: string, limit = 5): Promise<JotterEntry[]> {
  const db = await openJotterDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('sessionId');
    const request = index.getAll(IDBKeyRange.only(sessionId));

    request.onsuccess = () => {
      const records: JotterEntry[] = request.result || [];
      // Take the most recent entries to keep the prompt light
      resolve(records.slice(-limit));
    };
    request.onerror = () => reject(request.error);
  });
}