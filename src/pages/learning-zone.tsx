// src/pages/learning-zone.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { openDB, DBSchema } from 'idb';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { parseAST } from '../engine/ast-loader';
import { runLocalInference } from '../engine/EdgeCognitiveEngine';
import { resolveSeedCoordinate, buildLessonNodePrompt, OAK_SEED_REGISTRY } from '@site/static/promptStrategies';

interface LessonPlanNode {
  axiom: string;
  trap: string;
  hook: string;
  activity: string;
  probe: string;
}

interface KnowledgeStageDBSchema extends DBSchema {
  active_stage_props: {
    key: string;
    value: {
      stageKey: string;
      timestamp: number;
      nodes: Record<string, LessonPlanNode>;
    };
  };
}

const DB_NAME = 'oak_stage_knowledge_db';
const STORE_NAME = 'active_stage_props';

async function getKnowledgeDB() {
  return openDB<KnowledgeStageDBSchema>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'stageKey' });
      }
    },
  });
}

function deriveSeedKey(keyStage: string, subject: string, unit: string): string {
  // Normalize "Key Stage 1" or "ks1" -> "ks1"
  let ks = 'ks3';
  const ksNorm = keyStage.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (ksNorm.includes('1')) ks = 'ks1';
  else if (ksNorm.includes('2')) ks = 'ks2';
  else if (ksNorm.includes('4')) ks = 'ks4';
  else if (ksNorm.includes('3')) ks = 'ks3';

  const subLower = subject.toLowerCase();
  let sub = 'sci';
  if (subLower.includes('math')) sub = 'mat';
  else if (subLower.includes('eng') || subLower.includes('lang') || subLower.includes('lit')) sub = 'eng';
  else if (subLower.includes('comp')) sub = 'com';
  else if (subLower.includes('hist') || subLower.includes('geog') || subLower.includes('hum')) sub = 'his';

  const unitNorm = unit.toLowerCase();
  let topicSlug = 'general';

  if (unitNorm.includes('living memory') || unitNorm.includes('memory') || unitNorm.includes('timeline') || unitNorm.includes('past')) {
    topicSlug = 'living_memory';
  } else if (unitNorm.includes('shape') || unitNorm.includes('2d') || unitNorm.includes('3d') || unitNorm.includes('geometry')) {
    topicSlug = 'shapes';
  } else if (unitNorm.includes('norman') || unitNorm.includes('1066') || unitNorm.includes('conquest')) {
    topicSlug = 'normans';
  } else if (unitNorm.includes('capital') || unitNorm.includes('punct') || unitNorm.includes('stop') || unitNorm.includes('letter')) {
    topicSlug = 'punctuation';
  } else if (unitNorm.includes('plant') || unitNorm.includes('seed')) {
    topicSlug = 'plants';
  } else if (unitNorm.includes('add') || unitNorm.includes('number')) {
    topicSlug = 'addition';
  } else if (unitNorm.includes('force') || unitNorm.includes('motion')) {
    topicSlug = 'forces';
  } else if (unitNorm.includes('fraction')) {
    topicSlug = 'fractions';
  } else if (unitNorm.includes('algo') || unitNorm.includes('comput')) {
    topicSlug = 'algorithms';
  } else if (unitNorm.includes('bond')) {
    topicSlug = 'bonding';
  } else if (unitNorm.includes('atom') || unitNorm.includes('periodic')) {
    topicSlug = 'atomic';
  }

  return `${ks}:${sub}:${topicSlug}`;
}

export default function LearningZonePage() {
  const [curriculumSetting, setCurriculumSetting] = useState<CurriculumProviderKey>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('curriculum_standard') as CurriculumProviderKey) || 'uk_oak';
    }
    return 'uk_oak';
  });

  const activeRequestIdRef = useRef(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDbHydrated, setIsDbHydrated] = useState(false);

  const curriculumTree = useMemo(() => {
    return getActiveCurriculumTree(curriculumSetting);
  }, [curriculumSetting]);

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 3');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Atomic Structure & Periodic Table');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const activeSeedKey = useMemo(() => {
    return deriveSeedKey(selectedKeyStage, selectedSubject, selectedUnit);
  }, [selectedKeyStage, selectedSubject, selectedUnit]);

  const stageSubjectGroup = useMemo(() => {
    const ks = selectedKeyStage.toLowerCase().replace(/[^a-z0-9]/g, '');
    const subLower = selectedSubject.toLowerCase();
    let sub = 'sci';
    if (subLower.includes('math')) sub = 'mat';
    else if (subLower.includes('eng')) sub = 'eng';
    else if (subLower.includes('comp')) sub = 'com';
    else if (subLower.includes('hist')) sub = 'his';
    return `${ks}:${sub}`;
  }, [selectedKeyStage, selectedSubject]);

  const [lessonData, setLessonData] = useState<LessonPlanNode>(() => {
    const seed = resolveSeedCoordinate('ks3:sci:atomic');
    return {
      axiom: seed.axiom,
      trap: seed.trap,
      hook: "Why doesn't the negative cloud of electrons collapse into the positive nucleus?",
      activity: "Model a Carbon-12 atom by placing 6 protons and 6 neutrons in the central core, then arrange 2 inner and 4 outer shell electrons.",
      probe: seed.pivot
    };
  });

  // Stage Expander: Syncs active KeyStage knowledge to IndexedDB
  useEffect(() => {
    let isCancelled = false;

    async function syncStageToIndexedDB() {
      try {
        const db = await getKnowledgeDB();
        let cachedStage = await db.get(STORE_NAME, stageSubjectGroup);

        if (!cachedStage) {
          const stageNodes: Record<string, LessonPlanNode> = {};
          
          Object.keys(OAK_SEED_REGISTRY).forEach((key) => {
            if (key.startsWith(stageSubjectGroup)) {
              const seed = OAK_SEED_REGISTRY[key];
              stageNodes[key] = {
                axiom: seed.axiom,
                trap: seed.trap,
                hook: `What happens when you change the core conditions of ${seed.topic || 'this topic'}?`,
                activity: `Step through the foundational rules of ${seed.topic || 'this topic'} and verify each step against the core axiom.`,
                probe: seed.pivot
              };
            }
          });

          cachedStage = {
            stageKey: stageSubjectGroup,
            timestamp: Date.now(),
            nodes: stageNodes
          };

          await db.put(STORE_NAME, cachedStage);
        }

        if (!isCancelled) {
          setIsDbHydrated(true);
        }
      } catch (err) {
        console.warn('[Knowledge DB]: Ephemeral expansion fallback to memory.', err);
        if (!isCancelled) setIsDbHydrated(true);
      }
    }

    syncStageToIndexedDB();

    return () => {
      isCancelled = true;
    };
  }, [stageSubjectGroup]);

  const handleCompileLesson = async () => {
  const requestId = ++activeRequestIdRef.current;
  setIsCompiling(true);

  // 1. Resolve registered seed
  const seed = resolveSeedCoordinate(activeSeedKey);
  
  // Flag whether this resolved to the atomic physics default fallback
  const isDefaultPhysicsFallback = 
    !activeSeedKey.includes('atomic') && 
    seed.axiom.toLowerCase().includes('proton');

  let baselineLesson: LessonPlanNode = {
    axiom: isDefaultPhysicsFallback
      ? `Understanding how things change over time and recognizing differences between the past and present in ${selectedUnit}.`
      : seed.axiom,
    trap: isDefaultPhysicsFallback
      ? `Assuming conditions and technologies in the past were identical to how they are today.`
      : seed.trap,
    hook: `What was everyday life like during the period of ${selectedUnit}, and how do we know?`,
    activity: `Compare artifacts, photographs, or accounts from ${selectedUnit} with modern day equivalents.`,
    probe: isDefaultPhysicsFallback
      ? `What is one major difference between life today and life in the period we are studying?`
      : seed.pivot
  };

  // 2. Check IndexedDB cache for pre-compiled AST
  try {
    const db = await getKnowledgeDB();
    const stage = await db.get(STORE_NAME, stageSubjectGroup);
    if (stage && stage.nodes[activeSeedKey]) {
      baselineLesson = stage.nodes[activeSeedKey];
    }
  } catch {
    // Clean fallback to baseline
  }

  // Immediately render the subject-accurate baseline
  setLessonData(baselineLesson);

  const astPrompt = buildLessonNodePrompt(activeSeedKey);

  try {
    const rawContent = await runLocalInference(
      astPrompt,
      "You are an expert Oak Curriculum compiler. Output ONLY a valid Lisp S-expression. Never output markdown backticks or conversational text.",
      activeSeedKey
    );
    
    if (requestId !== activeRequestIdRef.current) return;

    const parsed = parseAST(rawContent);

    if (parsed) {
      const compiledLesson: LessonPlanNode = {
        axiom: parsed.axiom?.children?.[0] || String(parsed.axiom || baselineLesson.axiom),
        trap: parsed.trap?.children?.[0] || String(parsed.trap || baselineLesson.trap),
        hook: parsed.hook?.children?.[0] || String(parsed.hook || baselineLesson.hook),
        activity: parsed.activity?.children?.[0] || String(parsed.activity || baselineLesson.activity),
        probe: parsed.pivot?.children?.[0] || String(parsed.pivot || baselineLesson.probe)
      };

      setLessonData(compiledLesson);

      const db = await getKnowledgeDB();
      let stage = await db.get(STORE_NAME, stageSubjectGroup);
      if (!stage) {
        stage = { stageKey: stageSubjectGroup, timestamp: Date.now(), nodes: {} };
      }
      stage.nodes[activeSeedKey] = compiledLesson;
      await db.put(STORE_NAME, stage);
    }
  } catch (err) {
    if (requestId !== activeRequestIdRef.current) return;
    console.warn('[Learning Zone AST Notice]: Using verified seed lesson.', err);
    setLessonData(baselineLesson);
  } finally {
    setIsCompiling(false);
  }
};

  useEffect(() => {
    handleCompileLesson();
  }, [selectedKeyStage, selectedSubject, selectedUnit, curriculumSetting, activeSeedKey]);

  const practiceLabUrl = `/practice-lab?ks=${encodeURIComponent(selectedKeyStage)}&sub=${encodeURIComponent(selectedSubject)}&unit=${encodeURIComponent(selectedUnit)}`;

  return (
    <Layout
      title="Curriculum Learning Zone"
      description="Deterministic concept exploration and misconception diagnostics."
    >
      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Top Selector Control Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <CurriculumSelector
            keyStage={selectedKeyStage}
            subject={selectedSubject}
            unit={selectedUnit}
            status="online"
            isReady={!isCompiling && isDbHydrated}
            sessionId={sessionId}
            curriculumTree={curriculumTree}
            buttonLabel={isCompiling ? '⚡ Compiling...' : '📖 Generate Lesson'}
            onKeyStageChange={(newKs, firstSub, firstUnit) => {
              setSelectedKeyStage(newKs);
              if (firstSub) setSelectedSubject(firstSub);
              if (firstUnit) setSelectedUnit(firstUnit);
            }}
            onSubjectChange={(newSub, firstUnit) => {
              setSelectedSubject(newSub);
              if (firstUnit) setSelectedUnit(firstUnit);
            }}
            onUnitChange={(newUnit) => setSelectedUnit(newUnit)}
            onSessionIdChange={setSessionId}
            onNewQuestion={handleCompileLesson}
            onDownloadReport={() => {}}
          />
        </div>

        {/* Main Lesson Sheet */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            minHeight: '480px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
            {selectedKeyStage.toUpperCase()} &bull; {selectedSubject.toUpperCase()} (Oak Curriculum Standard)
            </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {selectedUnit}
              </h2>
            </div>
            
            <Link
              to={practiceLabUrl}
              className="button button--primary"
              style={{
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                fontWeight: 600,
                background: '#2563eb'
              }}
            >
              ⚡ Test in Practice Lab
            </Link>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.5rem 0' }} />

          {/* Diagnostic Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📐</span> Core Axiom
              </div>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                {lessonData.axiom}
              </p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> Cognitive Trap (Common Error)
              </div>
              <p style={{ color: '#92400e', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                {lessonData.trap}
              </p>
            </div>

          </div>

          {/* Structured Lesson Delivery Flow */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> Structured Lesson Steps
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 1: Inquiry Hook</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>{lessonData.hook}</p>
              </div>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 2: Guided Practice & Activity</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>{lessonData.activity}</p>
              </div>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 3: Socratic Check for Understanding</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}><em>"{lessonData.probe}"</em></p>
              </div>
            </div>
          </div>

          {/* Socratic Assistant Panel */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <TuringTutor
              seedKey={activeSeedKey}
              keyStage={selectedKeyStage}
              subject={selectedSubject}
              unit={selectedUnit}
              contextTopic={selectedUnit}
              activePrompt={lessonData.probe}
            />
          </div>

        </div>
      </main>
    </Layout>
  );
}