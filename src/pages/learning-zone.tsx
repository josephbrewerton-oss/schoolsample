// src/pages/learning-zone.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { EngineFlow, LessonViewContent } from '../engine/engineflow';

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

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 1');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Seasonal Changes');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const [lessonData, setLessonData] = useState<LessonViewContent>({
    title: 'Seasonal Changes',
    axiom: 'Earth experiences four distinct seasons due to changes in weather, temperature, and daylight hours throughout the year.',
    trap: 'Believing seasons change because the Earth moves significantly closer or further from the Sun.',
    hook: 'Why do trees lose their leaves in autumn, and why does it get dark so early in winter?',
    guidedStep: 'Observe and compare temperature shifts, daylight patterns, and plant lifecycle changes across all 4 seasons.',
    socraticCheck: 'How do daylight hours differ between mid-summer and mid-winter in the UK?',
  });

  const handleCompileLesson = async () => {
    const requestId = ++activeRequestIdRef.current;
    setIsCompiling(true);

    try {
      const generated = await EngineFlow.generateLessonCards({
        keyStage: selectedKeyStage,
        subject: selectedSubject,
        topic: selectedUnit,
        curriculum: curriculumSetting,
      });

      if (requestId !== activeRequestIdRef.current) return;

      setLessonData(generated);
    } catch (err) {
      console.warn('[Learning Zone AST Notice]:', err);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsCompiling(false);
      }
    }
  };

  useEffect(() => {
    handleCompileLesson();
  }, [selectedKeyStage, selectedSubject, selectedUnit, curriculumSetting]);

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
            opacity: isCompiling ? 0.7 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                {selectedKeyStage.toUpperCase()} &bull; {selectedSubject.toUpperCase()} ({curriculumSetting.toUpperCase()} Standard)
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {lessonData.title || selectedUnit}
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
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>{lessonData.guidedStep}</p>
              </div>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 3: Socratic Check for Understanding</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}><em>"{lessonData.socraticCheck}"</em></p>
              </div>
            </div>
          </div>

          {/* Socratic Assistant Panel */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <TuringTutor
              seedKey={`${selectedKeyStage}:${selectedSubject}:${selectedUnit}`}
              keyStage={selectedKeyStage}
              subject={selectedSubject}
              unit={selectedUnit}
              contextTopic={selectedUnit}
              activePrompt={lessonData.socraticCheck}
            />
          </div>

        </div>
      </main>
    </Layout>
  );
}