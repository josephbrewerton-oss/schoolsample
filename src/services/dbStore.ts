// src/services/dbStore.ts
import { DomainManifest } from '../types/learning-ast';

const DB_NAME = 'EdgeLearningEngineDB';
const DB_VERSION = 4; // Version 4: In-Context Lesson Schemas & Logic Inflation

const STORE_MANIFESTS = 'manifests';
const STORE_PROGRESS = 'student_progress';
export const STORE_VIEWS = 'vfs_views';
const STORE_ADAPTERS = 'dynamic_adapters';
const STORE_AST_BANK = 'ast_bank';
const STORE_LESSONS = 'lessons';

export interface StudentRecord {
  cohortCode: string;
  challengeId: string;
  topicId: string;
  answeredAt: number;
  isCorrect: boolean;
  userAnswer: string;
  errorTag?: string;
}

export interface VfsViewRecord {
  path: string;
  content: string;
  updatedAt: number;
}

export interface TopicAdapterRecord {
  topicKey: string;
  exemplarAST: string;
  curriculumGuardrails: string[];
  commonMisconceptions: string[];
  updatedAt: number;
}

export interface CachedASTRecord {
  id?: number;
  topicKey: string;
  rawAST: string;
  createdAt: number;
}

export interface CachedLessonRecord {
  key: string; // `${stage}_${subject}_${topic}`
  title: string;
  stage: string;
  subject: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
  fullText?: string;
  updatedAt: number;
}

export function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const tx = request.transaction;

      // 1. Manifests Store
      if (!db.objectStoreNames.contains(STORE_MANIFESTS)) {
        db.createObjectStore(STORE_MANIFESTS, { keyPath: 'meta.domainId' });
      }

      // 2. Student Progress Store + Migration
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        const progStore = db.createObjectStore(STORE_PROGRESS, { autoIncrement: true });
        progStore.createIndex('cohortCode', 'cohortCode', { unique: false });
        progStore.createIndex('topicId', 'topicId', { unique: false });
      } else if (tx) {
        const progStore = tx.objectStore(STORE_PROGRESS);
        if (!progStore.indexNames.contains('topicId')) {
          progStore.createIndex('topicId', 'topicId', { unique: false });
        }
      }

      // 3. Declarative S-Expression Views Store (VFS)
      if (!db.objectStoreNames.contains(STORE_VIEWS)) {
        db.createObjectStore(STORE_VIEWS, { keyPath: 'path' });
      }

      // 4. Dynamic In-Context Adapters
      if (!db.objectStoreNames.contains(STORE_ADAPTERS)) {
        db.createObjectStore(STORE_ADAPTERS, { keyPath: 'topicKey' });
      }

      // 5. Verified AST Bank
      if (!db.objectStoreNames.contains(STORE_AST_BANK)) {
        const astStore = db.createObjectStore(STORE_AST_BANK, { autoIncrement: true, keyPath: 'id' });
        astStore.createIndex('topicKey', 'topicKey', { unique: false });
      }

      // 6. Cached Pedagogical Lessons & Logic Point Inflations
      if (!db.objectStoreNames.contains(STORE_LESSONS)) {
        db.createObjectStore(STORE_LESSONS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Alias for backwards compatibility
export const getDB = openLocalDB;

// --- Lesson Logic Inflation Operations ---

export async function getBufferedLesson(key: string): Promise<CachedLessonRecord | null> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_LESSONS, 'readonly');
      const store = tx.objectStore(STORE_LESSONS);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as CachedLessonRecord) || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[dbStore] Lesson cache lookup error:', err);
    return null;
  }
}

export async function putBufferedLesson(lesson: CachedLessonRecord): Promise<void> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LESSONS, 'readwrite');
      const store = tx.objectStore(STORE_LESSONS);
      const req = store.put(lesson);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[dbStore] Lesson cache write error:', err);
  }
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

// --- Progress & Diagnostic Operations ---

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

export async function getTuringDiagnosticSummary(topicId: string): Promise<{ accuracy: number; commonErrors: string[] }> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROGRESS, 'readonly');
    const store = tx.objectStore(STORE_PROGRESS);
    const index = store.index('topicId');
    const req = index.getAll(topicId);

    req.onsuccess = () => {
      const records = (req.result as StudentRecord[]) || [];
      if (records.length === 0) {
        return resolve({ accuracy: 1.0, commonErrors: [] });
      }

      const correctCount = records.filter((r) => r.isCorrect).length;
      const errors = records
        .filter((r) => !r.isCorrect && r.errorTag)
        .map((r) => r.errorTag as string);

      resolve({
        accuracy: correctCount / records.length,
        commonErrors: Array.from(new Set(errors)),
      });
    };
    req.onerror = () => reject(req.error);
  });
}

// --- Dynamic In-Context Adapter Operations ---

export async function saveTopicAdapter(adapter: TopicAdapterRecord): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ADAPTERS, 'readwrite');
    const store = tx.objectStore(STORE_ADAPTERS);
    const req = store.put({ ...adapter, updatedAt: Date.now() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getTopicAdapter(topicKey: string): Promise<TopicAdapterRecord | null> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ADAPTERS, 'readonly');
    const store = tx.objectStore(STORE_ADAPTERS);
    const req = store.get(topicKey);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export const DEFAULT_TOPIC_ADAPTERS: TopicAdapterRecord[] = [
  {
    topicKey: 'science_atomic_structure',
    exemplarAST:
      '(:route "quiz:mcq" :scratchpad "Isotopes are atoms of the same element with different numbers of neutrons, giving them different mass numbers." :prompt "Why do different isotopes of the same element have different mass numbers?" :options (list "They have different numbers of neutrons" "They have different numbers of protons" "They have different numbers of electrons" "Their electrons have different masses") :hint "Consider which subatomic particle in the nucleus varies without altering atomic number." :answer-key 0)',
    curriculumGuardrails: [
      'Protons = positive (relative mass 1)',
      'Neutrons = neutral (relative mass 1)',
      'Electrons = negative (negligible mass / 1/1840)',
      'Isotopes differ ONLY in neutron count',
    ],
    commonMisconceptions: ['Thinking neutrons are massless', 'Confusing atomic number with mass number'],
    updatedAt: Date.now(),
  },
  {
    topicKey: 'physics_newtons_laws',
    exemplarAST:
      '(:route "quiz:mcq" :scratchpad "Newton\'s First Law states an object remains at constant velocity unless acted upon by a resultant force." :prompt "What happens to a moving spacecraft when all engine thrust stops in deep space?" :options (list "It continues moving at a constant velocity" "It gradually slows down to a stop" "It instantly halts" "It changes direction") :hint "Remember that no friction or resultant force opposes motion in deep space." :answer-key 0)',
    curriculumGuardrails: [
      'F = ma',
      'Objects keep moving at constant velocity unless resultant force acts',
      'Friction is absent in a vacuum',
    ],
    commonMisconceptions: ['Assuming force is required to maintain motion'],
    updatedAt: Date.now(),
  },
];

export async function bootstrapTopicAdapters(): Promise<void> {
  const db = await openLocalDB();
  for (const adapter of DEFAULT_TOPIC_ADAPTERS) {
    const existing = await getTopicAdapter(adapter.topicKey);
    if (!existing) {
      await saveTopicAdapter(adapter);
    }
  }
}

// --- Verified Synthetic AST Bank & Buffer Operations ---

export async function saveVerifiedAST(topicKey: string, rawAST: string): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AST_BANK, 'readwrite');
    const store = tx.objectStore(STORE_AST_BANK);
    const req = store.add({
      topicKey,
      rawAST,
      createdAt: Date.now(),
    });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getBufferedQuestion(topicKey: string): Promise<string | null> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve) => {
      // 1. Open readwrite transaction so we can consume the record
      const tx = db.transaction(STORE_AST_BANK, 'readwrite');
      const store = tx.objectStore(STORE_AST_BANK);
      const index = store.index('topicKey');
      const req = index.getAll(topicKey);

      req.onsuccess = () => {
        const results = (req.result as CachedASTRecord[]) || [];
        if (results.length === 0) return resolve(null);

        // 2. Take the first question
        const chosen = results[0];

        // 3. Delete it so it is never served twice
        if (chosen.id !== undefined) {
          store.delete(chosen.id);
        }

        resolve(chosen.rawAST);
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[dbStore] Buffer lookup error:', err);
    return null;
  }
}

export async function checkAndReplenishBuffer(
  topicKey: string,
  minThreshold: number = 3,
  triggerWorker: (key: string) => Promise<void>
): Promise<void> {
  try {
    const db = await openLocalDB();
    const tx = db.transaction(STORE_AST_BANK, 'readonly');
    const store = tx.objectStore(STORE_AST_BANK);
    const index = store.index('topicKey');
    const countReq = index.count(topicKey);

    countReq.onsuccess = () => {
      if (countReq.result < minThreshold) {
        triggerWorker(topicKey).catch(console.error);
      }
    };
  } catch (err) {
    console.warn('[dbStore] Buffer check error:', err);
  }
}

export async function getRandomCachedAST(topicKey: string): Promise<string | null> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AST_BANK, 'readonly');
    const store = tx.objectStore(STORE_AST_BANK);
    const index = store.index('topicKey');
    const req = index.getAll(topicKey);

    req.onsuccess = () => {
      const results = (req.result as CachedASTRecord[]) || [];
      if (results.length === 0) return resolve(null);
      const randomItem = results[Math.floor(Math.random() * results.length)];
      resolve(randomItem.rawAST);
    };
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