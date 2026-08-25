import { DomainManifest } from '../types/learning-ast';

const DB_NAME = 'EdgeLearningEngineDB';
const DB_VERSION = 3; // Version 3: Dynamic In-Context Adapters & Synthetic AST Bank

const STORE_MANIFESTS = 'manifests';
const STORE_PROGRESS = 'student_progress';
export const STORE_VIEWS = 'vfs_views';
const STORE_ADAPTERS = 'dynamic_adapters';
const STORE_AST_BANK = 'ast_bank';

export interface StudentRecord {
  cohortCode: string;
  challengeId: string;
  topicId: string;
  answeredAt: number;
  isCorrect: boolean;
  userAnswer: string;
  errorTag?: string; // e.g. 'subtended_vs_circumference', 'arithmetic_sign'
}

export interface VfsViewRecord {
  path: string;       // Key path: e.g., '/sys/views/cheat_sheet.lisp'
  content: string;    // Raw S-expression source
  updatedAt: number;  // Timestamp
}

export interface TopicAdapterRecord {
  topicKey: string;           // Key: e.g., 'ks4_maths_circle_theorems'
  exemplarAST: string;        // Gold-standard Lisp AST few-shot
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

/**
 * Generates an aggregated diagnostic summary of student struggles to ground Prof. Turing.
 */
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

      const correctCount = records.filter(r => r.isCorrect).length;
      const errors = records
        .filter(r => !r.isCorrect && r.errorTag)
        .map(r => r.errorTag as string);

      resolve({
        accuracy: correctCount / records.length,
        commonErrors: Array.from(new Set(errors))
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
    exemplarAST: '(:route "quiz:mcq" :scratchpad "Isotopes are atoms of the same element with different numbers of neutrons, giving them different mass numbers." :prompt "Why do different isotopes of the same element have different mass numbers?" :options (list "They have different numbers of neutrons" "They have different numbers of protons" "They have different numbers of electrons" "Their electrons have different masses") :answer-key 0)',
    curriculumGuardrails: [
      'Protons = positive (relative mass 1)',
      'Neutrons = neutral (relative mass 1)',
      'Electrons = negative (negligible mass / 1/1840)',
      'Isotopes differ ONLY in neutron count'
    ],
    commonMisconceptions: ['Thinking neutrons are massless', 'Confusing atomic number with mass number'],
    updatedAt: Date.now()
  },
  {
    topicKey: 'physics_newtons_laws',
    exemplarAST: '(:route "quiz:mcq" :scratchpad "Newton\'s First Law states an object remains at constant velocity unless acted upon by a resultant force." :prompt "What happens to a moving spacecraft when all engine thrust stops in deep space?" :options (list "It continues moving at a constant velocity" "It gradually slows down to a stop" "It instantly halts" "It changes direction") :answer-key 0)',
    curriculumGuardrails: [
      'F = ma',
      'Objects keep moving at constant velocity unless resultant force acts',
      'Friction is absent in a vacuum'
    ],
    commonMisconceptions: ['Assuming force is required to maintain motion'],
    updatedAt: Date.now()
  }
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
// --- Verified Synthetic AST Bank Operations ---

export async function saveVerifiedAST(topicKey: string, rawAST: string): Promise<void> {
  const db = await openLocalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_AST_BANK, 'readwrite');
    const store = tx.objectStore(STORE_AST_BANK);
    const req = store.add({
      topicKey,
      rawAST,
      createdAt: Date.now()
    });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
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