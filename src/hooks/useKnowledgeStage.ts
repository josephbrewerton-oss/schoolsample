// src/hooks/useKnowledgeStage.ts
import { useState, useEffect } from 'react';

const DB_NAME = 'oak_knowledge_ephemeral';
const STORE_NAME = 'active_ks_props';

export interface StagePayload {
  keyStage: string;
  subject: string;
  facts: Record<string, {
    axiom: string;
    trap: string;
    pivot: string;
    microTokens: string;
  }>;
}

function openKnowledgeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in current environment'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'stageKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getStageRecord(db: IDBDatabase, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function putStageRecord(db: IDBDatabase, record: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function useKnowledgeStage(keyStage: string, subject: string, fallbackRegistry: any) {
  const [activeProps, setActiveProps] = useState<Record<string, any> | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadStageContext() {
      setIsReady(false);
      const stageKey = `${keyStage}:${subject}`.toLowerCase();

      try {
        // 1. Initialize IndexedDB store in-house
        const db = await openKnowledgeDB();

        // 2. Check if this Key Stage is already unpacked
        let record = await getStageRecord(db, stageKey);

        if (!record) {
          // Unpack from your registry or local model extract
          const stageFacts = fallbackRegistry?.[stageKey] || {};
          record = { stageKey, timestamp: Date.now(), facts: stageFacts };
          await putStageRecord(db, record);
        }

        if (!isCancelled) {
          setActiveProps(record.facts);
          setIsReady(true);
        }
      } catch (err) {
        console.warn('[useKnowledgeStage] Native IndexedDB fallback:', err);
        if (!isCancelled) {
          setActiveProps(fallbackRegistry?.[stageKey] || {});
          setIsReady(true);
        }
      }
    }

    loadStageContext();

    // 3. Lifecycle cleanup
    return () => {
      isCancelled = true;
    };
  }, [keyStage, subject]);

  return { activeProps, isReady };
}