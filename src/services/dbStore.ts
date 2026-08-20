import { DomainManifest } from '../types/learning-ast';

const DB_NAME = 'EdgeLearningEngineDB';
const DB_VERSION = 2; // Bumped version to initialize vfs_views store
const STORE_MANIFESTS = 'manifests';
const STORE_PROGRESS = 'student_progress';
export const STORE_VIEWS = 'vfs_views';

export interface StudentRecord {
  cohortCode: string;
  challengeId: string;
  answeredAt: number;
  isCorrect: boolean;
  userAnswer: string;
}

export interface VfsViewRecord {
  path: string;       // Key path: e.g., '/sys/views/cheat_sheet.lisp'
  content: string;    // Raw S-expression source
  updatedAt: number;  // Timestamp
}

export function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Manifests Store
      if (!db.objectStoreNames.contains(STORE_MANIFESTS)) {
        db.createObjectStore(STORE_MANIFESTS, { keyPath: 'meta.domainId' });
      }
      
      // Student Progress Store
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        const progStore = db.createObjectStore(STORE_PROGRESS, { autoIncrement: true });
        progStore.createIndex('cohortCode', 'cohortCode', { unique: false });
      }

      // Declarative S-Expression Views Store (VFS)
      if (!db.objectStoreNames.contains(STORE_VIEWS)) {
        db.createObjectStore(STORE_VIEWS, { keyPath: 'path' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Manifest Operations ---

export async function saveManifest(manifest: DomainManifest): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MANIFESTS, 'readwrite');
    const store = tx.objectStore(STORE_MANIFESTS);
    const req = store.put(manifest);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getManifest(domainId: string): Promise<DomainManifest | null> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MANIFESTS, 'readonly');
    const store = tx.objectStore(STORE_MANIFESTS);
    const req = store.get(domainId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// --- Progress Operations ---

export async function logProgress(record: StudentRecord): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROGRESS, 'readwrite');
    const store = tx.objectStore(STORE_PROGRESS);
    const req = store.add(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- VFS S-Expression View Operations ---

export async function saveVfsView(path: string, content: string): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VIEWS, 'readwrite');
    const store = tx.objectStore(STORE_VIEWS);
    const record: VfsViewRecord = {
      path,
      content,
      updatedAt: Date.now(),
    };
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getVfsView(path: string): Promise<string | null> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VIEWS, 'readonly');
    const store = tx.objectStore(STORE_VIEWS);
    const req = store.get(path);
    req.onsuccess = () => {
      resolve(req.result ? (req.result as VfsViewRecord).content : null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function bootstrapVfsViews(defaultViews: Record<string, string>): Promise<void> {
  for (const [path, content] of Object.entries(defaultViews)) {
    const existing = await getVfsView(path);
    if (!existing) {
      await saveVfsView(path, content);
    }
  }
}

// --- Storage Management ---

export async function purgeInactiveManifests(
  activeDomainId: string, 
  preservedDomains: string[] = ['school', 'communion']
): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MANIFESTS, 'readwrite');
    const store = tx.objectStore(STORE_MANIFESTS);
    const keysReq = store.getAllKeys();

    keysReq.onsuccess = () => {
      const keys = keysReq.result as string[];
      keys.forEach((key) => {
        if (key !== activeDomainId && !preservedDomains.includes(key)) {
          store.delete(key);
          console.log(`🧹 Ephemeral Cache Purge: Cleared manifest [${key}] from local IndexedDB`);
        }
      });
      resolve();
    };

    keysReq.onerror = () => reject(keysReq.error);
  });
}