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
  lastAccessedAt?: number;
  accessCount?: number;
  isPinned?: boolean;
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
  lastAccessedAt?: number;
  accessCount?: number;
  isPinned?: boolean;
}

/**
 * Permanent Core Syllabus Manifests & Question Banks Registry.
 * These are pinned permanently in local storage and are 100% exempt from LRU eviction.
 */
export const PINNED_CORE_MANIFESTS = new Set<string>([
  'catalog',
  'catalog.json',
  'master-catalog',
  'school',
  'communion',
  'reconciliation',
  'first-reconciliation',
  'first-holy-communion',
  'order-of-the-mass',
  'sacrament-of-baptism',
  'sacrament-of-confirmation',
  'holy-trinity-creed',
  'paschal-mystery',
  'mary-and-rosary',
  'gcse-re-trinity',
  'catholic-social-teaching',
  'catholic-sources-of-authority',
  'catholic-eschatology',
  'uk_oak_core',
  'question_banks',
]);

/**
 * Returns true if the domain or key belongs to pinned core syllabus manifests or question banks.
 */
export function isCoreSyllabusPinned(keyOrDomain: string): boolean {
  if (!keyOrDomain) return false;
  const lower = keyOrDomain.toLowerCase().trim();
  if (PINNED_CORE_MANIFESTS.has(lower)) return true;
  for (const pinned of PINNED_CORE_MANIFESTS) {
    if (lower.includes(pinned)) return true;
  }
  return false;
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
      req.onsuccess = () => {
        const record = req.result as CachedLessonRecord | undefined;
        if (record) {
          // Touch LRU access timestamp asynchronously
          try {
            const touchTx = db.transaction(STORE_LESSONS, 'readwrite');
            touchTx.objectStore(STORE_LESSONS).put({
              ...record,
              lastAccessedAt: Date.now(),
              accessCount: (record.accessCount || 0) + 1,
            });
          } catch {}
          resolve(record);
        } else {
          resolve(null);
        }
      };
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
    const updatedRecord: CachedLessonRecord = {
      ...lesson,
      updatedAt: lesson.updatedAt || Date.now(),
      lastAccessedAt: Date.now(),
      accessCount: (lesson.accessCount || 0) + 1,
      isPinned: lesson.isPinned || isCoreSyllabusPinned(lesson.key) || isCoreSyllabusPinned(lesson.subject),
    };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_LESSONS, 'readwrite');
      const store = tx.objectStore(STORE_LESSONS);
      const req = store.put(updatedRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Enforce LRU eviction asynchronously to protect storage quotas
    enforceStorageQuotaLRU().catch((err) => console.warn('[dbStore] LRU eviction error:', err));
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

export async function getAllProgressRecords(): Promise<StudentRecord[]> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as StudentRecord[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('[dbStore] Failed to fetch progress records:', err);
    return [];
  }
}

export async function clearAllStudentProgress(): Promise<void> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readwrite');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[dbStore] Failed to clear progress store:', err);
  }
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
  {
    topicKey: 'spanish_regular_verbs',
    exemplarAST:
      '(:route "quiz:mcq" :scratchpad "In Spanish, the regular -ar verb stem in present tense takes -o for \'yo\', -as for \'tú\', -a for \'él/ella\', and -amos for \'nosotros\'. For \'hablar\' with \'nosotros\', stem \'habl-\' + \'-amos\' = \'hablamos\'." :prompt "Which is the correct present tense form of \'hablar\' for \'nosotros\'?" :options (list "hablamos" "hablan" "habláis" "hablas") :hint "Identify the first person plural (-amos) ending for regular -ar verbs." :answer-key 0)',
    curriculumGuardrails: [
      '-ar verbs: -o, -as, -a, -amos, -áis, -an',
      '-er verbs: -o, -es, -e, -emos, -éis, -en',
      '-ir verbs: -o, -es, -e, -imos, -ís, -en',
    ],
    commonMisconceptions: [
      'Confusing -ar ending (-amos) with -er ending (-emos)',
      'Mixing third person plural (-an) with first person plural (-amos)',
    ],
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
      lastAccessedAt: Date.now(),
      accessCount: 1,
      isPinned: isCoreSyllabusPinned(topicKey),
    });
    req.onsuccess = () => {
      resolve();
      enforceStorageQuotaLRU().catch(() => {});
    };
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

// --- Storage Management & LRU Eviction ---

export interface StorageQuotaLRUMetrics {
  usageBytes: number;
  quotaBytes: number;
  usagePercent: number;
  totalLessonTraces: number;
  totalAstBankItems: number;
  pinnedManifestsCount: number;
  evictedLessonTraces: number;
  evictedAstItems: number;
  lastEvictionTime: number;
}

let globalEvictionMetrics: StorageQuotaLRUMetrics = {
  usageBytes: 0,
  quotaBytes: 0,
  usagePercent: 0,
  totalLessonTraces: 0,
  totalAstBankItems: 0,
  pinnedManifestsCount: PINNED_CORE_MANIFESTS.size,
  evictedLessonTraces: 0,
  evictedAstItems: 0,
  lastEvictionTime: 0,
};

export const MAX_UNPINNED_LESSON_TRACES = 35;
export const TARGET_UNPINNED_LESSON_TRACES = 25;
export const MAX_UNPINNED_AST_ITEMS = 60;
export const TARGET_UNPINNED_AST_ITEMS = 40;

/**
 * Executes LRU (Least Recently Used) eviction on unpinned generated lesson traces
 * while permanently preserving core syllabus manifests (catalog.json, question banks, Oak modules).
 */
export async function enforceStorageQuotaLRU(): Promise<StorageQuotaLRUMetrics> {
  try {
    const db = await openLocalDB();

    // 1. Storage Quota Inspection via StorageManager API
    let usageBytes = 0;
    let quotaBytes = 0;
    let usagePercent = 0;

    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
        if (quotaBytes > 0) {
          usagePercent = Math.round((usageBytes / quotaBytes) * 100);
        }
      } catch {}
    }

    let newlyEvictedLessons = 0;
    let newlyEvictedAst = 0;

    // 2. Scan and prune unpinned generated lesson traces (STORE_LESSONS)
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_LESSONS, 'readwrite');
      const store = tx.objectStore(STORE_LESSONS);
      const req = store.getAll();

      req.onsuccess = () => {
        const lessons = (req.result as CachedLessonRecord[]) || [];
        globalEvictionMetrics.totalLessonTraces = lessons.length;

        // Strictly separate unpinned vs permanently pinned lessons
        const unpinned = lessons.filter(
          (l) => !l.isPinned && !isCoreSyllabusPinned(l.key) && !isCoreSyllabusPinned(l.subject)
        );

        const shouldEvict = unpinned.length > MAX_UNPINNED_LESSON_TRACES || usagePercent > 75;
        if (shouldEvict && unpinned.length > TARGET_UNPINNED_LESSON_TRACES) {
          // Sort ascending by lastAccessedAt (oldest accessed first)
          unpinned.sort((a, b) => {
            const timeA = a.lastAccessedAt || a.updatedAt || 0;
            const timeB = b.lastAccessedAt || b.updatedAt || 0;
            return timeA - timeB;
          });

          const excessCount = unpinned.length - TARGET_UNPINNED_LESSON_TRACES;
          const toEvict = unpinned.slice(0, excessCount);

          for (const item of toEvict) {
            store.delete(item.key);
            newlyEvictedLessons++;
          }
          console.log(
            `[Storage Quota LRU] Evicted ${newlyEvictedLessons} generated lesson traces (preserved ${
              lessons.length - unpinned.length
            } pinned manifests).`
          );
        }
        resolve();
      };
      req.onerror = () => resolve();
    });

    // 3. Scan and prune unpinned ephemeral synthetic AST question bank items (STORE_AST_BANK)
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_AST_BANK, 'readwrite');
      const store = tx.objectStore(STORE_AST_BANK);
      const req = store.getAll();

      req.onsuccess = () => {
        const astItems = (req.result as CachedASTRecord[]) || [];
        globalEvictionMetrics.totalAstBankItems = astItems.length;

        const unpinned = astItems.filter(
          (item) => !item.isPinned && !isCoreSyllabusPinned(item.topicKey)
        );

        if (unpinned.length > MAX_UNPINNED_AST_ITEMS || usagePercent > 75) {
          unpinned.sort((a, b) => {
            const timeA = a.lastAccessedAt || a.createdAt || 0;
            const timeB = b.lastAccessedAt || b.createdAt || 0;
            return timeA - timeB;
          });

          const excessCount = unpinned.length - TARGET_UNPINNED_AST_ITEMS;
          const toEvict = unpinned.slice(0, Math.max(0, excessCount));

          for (const item of toEvict) {
            if (item.id !== undefined) {
              store.delete(item.id);
              newlyEvictedAst++;
            }
          }
        }
        resolve();
      };
      req.onerror = () => resolve();
    });

    // 4. Count permanently pinned manifests
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_MANIFESTS, 'readonly');
      const store = tx.objectStore(STORE_MANIFESTS);
      const countReq = store.count();
      countReq.onsuccess = () => {
        globalEvictionMetrics.pinnedManifestsCount = Math.max(
          countReq.result,
          PINNED_CORE_MANIFESTS.size
        );
        resolve();
      };
      countReq.onerror = () => resolve();
    });

    globalEvictionMetrics = {
      ...globalEvictionMetrics,
      usageBytes,
      quotaBytes,
      usagePercent,
      evictedLessonTraces: globalEvictionMetrics.evictedLessonTraces + newlyEvictedLessons,
      evictedAstItems: globalEvictionMetrics.evictedAstItems + newlyEvictedAst,
      lastEvictionTime: Date.now(),
    };

    return globalEvictionMetrics;
  } catch (err) {
    console.warn('[Storage Quota LRU] Error enforcing quota:', err);
    return globalEvictionMetrics;
  }
}

/**
 * Diagnostic accessor for storage quota and LRU eviction status
 */
export async function getStorageQuotaMetrics(): Promise<StorageQuotaLRUMetrics> {
  try {
    return await enforceStorageQuotaLRU();
  } catch {
    return globalEvictionMetrics;
  }
}

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
        // PERMANENT PINNING: Never delete core syllabus manifests or question banks
        if (
          key !== activeDomainId &&
          !preservedDomains.includes(key) &&
          !isCoreSyllabusPinned(key)
        ) {
          store.delete(key);
          console.log(`🧹 Ephemeral Cache Purge: Cleared unpinned manifest [${key}] from local IndexedDB`);
        }
      });
      resolve();
    };

    keysReq.onerror = () => reject(keysReq.error);
  });
}