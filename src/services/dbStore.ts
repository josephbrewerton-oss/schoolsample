import { DomainManifest } from '../types/learning-ast';

const DB_NAME = 'EdgeLearningEngineDB';
const DB_VERSION = 1;
const STORE_MANIFESTS = 'manifests';
const STORE_PROGRESS = 'student_progress';

export interface StudentRecord {
  cohortCode: string;
  challengeId: string;
  answeredAt: number;
  isCorrect: boolean;
  userAnswer: string;
}

export function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MANIFESTS)) {
        db.createObjectStore(STORE_MANIFESTS, { keyPath: 'meta.domainId' });
      }
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        const progStore = db.createObjectStore(STORE_PROGRESS, { autoIncrement: true });
        progStore.createIndex('cohortCode', 'cohortCode', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save or Update a Manifest in IndexedDB
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

// Fetch a Manifest by Domain ID
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

// Log student question attempt locally
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