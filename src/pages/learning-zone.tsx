// src/pages/learning-zone.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { parseAST } from '../engine/ast-loader';
import { runLocalInference } from '../engine/EdgeCognitiveEngine';
import { resolveSeedCoordinate, buildLessonNodePrompt } from '@site/static/promptStrategies';

interface LessonPlanNode {
  axiom: string;
  trap: string;
  hook: string;
  activity: string;
  probe: string;
}

function deriveSeedKey(keyStage: string, subject: string, unit: string): string {
  const ks = keyStage.toLowerCase().replace(/[^a-z0-9]/g, '');
  const subLower = subject.toLowerCase();
  
  let sub = 'sci';
  if (subLower.includes('math')) sub = 'mat';
  else if (subLower.includes('eng') || subLower.includes('lang') || subLower.includes('lit')) sub = 'eng';
  else if (subLower.includes('comp')) sub = 'com';
  else if (subLower.includes('hist') || subLower.includes('geog') || subLower.includes('hum')) sub = 'his';

  const unitNorm = unit.toLowerCase();
  let topicSlug = 'atomic';

  if (unitNorm.includes('norman') || unitNorm.includes('1066') || unitNorm.includes('conquest')) {
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
  }

  return `${ks.includes('ks') ? ks : 'ks3'}:${sub}:${topicSlug}`;
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

  const handleCompileLesson = async () => {
    const requestId = ++activeRequestIdRef.current;
    setIsCompiling(true);

    const seed = resolveSeedCoordinate(activeSeedKey);
    const baselineLesson: LessonPlanNode = {
      axiom: seed.axiom,
      trap: seed.trap,
      hook: `What happens when you change the core conditions of ${selectedUnit}?`,
      activity: `Step through the foundational rules of ${selectedUnit} and verify each step against the core axiom.`,
      probe: seed.pivot
    };

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
        setLessonData({
          axiom: parsed.axiom?.children?.[0] || String(parsed.axiom || baselineLesson.axiom),
          trap: parsed.trap?.children?.[0] || String(parsed.trap || baselineLesson.trap),
          hook: parsed.hook?.children?.[0] || String(parsed.hook || baselineLesson.hook),
          activity: parsed.activity?.children?.[0] || String(parsed.activity || baselineLesson.activity),
          probe: parsed.pivot?.children?.[0] || String(parsed.pivot || baselineLesson.probe)
        });
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
        
        {/* Unified Top Control Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <CurriculumSelector
            keyStage={selectedKeyStage}
            subject={selectedSubject}
            unit={selectedUnit}
            status="online"
            isReady={!isCompiling}
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
                {selectedKeyStage} &bull; {selectedSubject} (Oak Curriculum Standard)
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