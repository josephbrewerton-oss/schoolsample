// src/hooks/useKnowledgeStage.ts
import { useState, useEffect } from 'react';
import { openDB } from 'idb';

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

export function useKnowledgeStage(keyStage: string, subject: string, fallbackRegistry: any) {
  const [activeProps, setActiveProps] = useState<Record<string, any> | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadStageContext() {
      setIsReady(false);
      const stageKey = `${keyStage}:${subject}`.toLowerCase();

      // 1. Initialize IndexedDB store
      const db = await openDB(DB_NAME, 1, {
        upgrade(dbInstance) {
          if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
            dbInstance.createObjectStore(STORE_NAME, { keyPath: 'stageKey' });
          }
        },
      });

      // 2. Check if this Key Stage is already unpacked
      let record = await db.get(STORE_NAME, stageKey);

      if (!record) {
        // Unpack from your registry or local model extract
        const stageFacts = fallbackRegistry[stageKey] || {};
        record = { stageKey, timestamp: Date.now(), facts: stageFacts };
        await db.put(STORE_NAME, record);
      }

      if (!isCancelled) {
        setActiveProps(record.facts);
        setIsReady(true);
      }
    }

    loadStageContext();

    // 3. Lifecycle cleanup: Optional pruning on unmount or stage change
    return () => {
      isCancelled = true;
    };
  }, [keyStage, subject]);

  return { activeProps, isReady };
}