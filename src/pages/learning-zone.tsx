// src/pages/learning-zone.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import { dispatch } from '../engine/hypercall';

export interface LessonViewContent {
  title: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
}

const buildDefaultNarrative = (topic: string, data: Partial<LessonViewContent>): string => {
  return `### ${topic}\n\n**1. Conceptual Narrative:**\n${data.axiom || `Core curriculum standard established for ${topic}.`}\n\n**2. Guided Practice & Key Mechanics:**\n${data.guidedStep || `Explore and observe the key principles of ${topic}.`}\n\n**3. Cognitive Trap & Misconception:**\nCommon misunderstanding: "${data.trap || `Intuitive misconception regarding ${topic}`}". In practice, we evaluate the scientific standard.\n\n**4. Check for Understanding:**\n${data.socraticCheck || `What fundamental property defines ${topic}?`}`;
};

export default function LearningZonePage() {
  const [curriculumSetting, setCurriculumSetting] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('curriculum_standard') || 'uk_oak';
    }
    return 'uk_oak';
  });

  const activeRequestIdRef = useRef(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSynthesizingFull, setIsSynthesizingFull] = useState(false);

  const [selectedKeyStage, setSelectedKeyStage] = useState('ks1');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Animals and Humans');
  const [sessionId, setSessionId] = useState('Lesson 1');

  // 1. Resolve Curriculum Catalogue Tree via Substrate Dispatch
  const [curriculumTree, setCurriculumTree] = useState<any>(null);
  useEffect(() => {
    dispatch('CurriculumNode', {
      intent: 'resolve:tree',
      payload: { stage: selectedKeyStage, curriculum: curriculumSetting },
    }).then((res) => {
      if (res.ok) setCurriculumTree(res.data);
    });
  }, [selectedKeyStage, curriculumSetting]);

  const [lessonData, setLessonData] = useState<LessonViewContent>({
    title: 'Animals and Humans',
    axiom: 'Animals, including humans, have basic needs for survival and distinct body structures.',
    trap: 'Believing that humans are not animals or that all animals have the same dietary needs.',
    hook: 'How do different animals survive in varying environments compared to humans?',
    guidedStep: 'Identify, compare, and classify common animals by their physical structures and diets.',
    socraticCheck: 'What essential things do all animals need to stay alive?',
  });

  const [fullLessonText, setFullLessonText] = useState<string>(() =>
    buildDefaultNarrative('Animals and Humans', {
      axiom: 'Animals, including humans, have basic needs for survival and distinct body structures.',
      guidedStep: 'Identify, compare, and classify common animals by their physical structures and diets.',
      trap: 'Believing that humans are not animals or that all animals have the same dietary needs.',
      socraticCheck: 'What essential things do all animals need to stay alive?',
    })
  );

  // 2. Governed Compilation with Atomic Target Parameters
  const compileLessonForTopic = useCallback(
    async (targetStage: string, targetSubject: string, targetTopic: string) => {
      if (!targetTopic) return;

      const requestId = ++activeRequestIdRef.current;
      setIsCompiling(true);

      // Instant optimistic placeholder update so the UI reacts immediately
      setLessonData((prev) => ({
        ...prev,
        title: targetTopic,
        axiom: `Synthesizing core curriculum principles for ${targetTopic}...`,
        trap: `Analyzing common student misconceptions for ${targetTopic}...`,
        hook: `How does ${targetTopic} apply to observable physical reality?`,
        guidedStep: `Analyzing key mechanics and properties of ${targetTopic}...`,
        socraticCheck: `What is the core principle governing ${targetTopic}?`,
      }));

      const timeoutTimer = setTimeout(() => {
        if (requestId === activeRequestIdRef.current) {
          setIsCompiling(false);
        }
      }, 4500);

      try {
        // Step A: Fast IndexedDB Cache Lookup
        const cacheRes = await dispatch('LessonSynthesizer', {
          intent: 'inflate:baseline',
          payload: {
            stage: targetStage,
            subject: targetSubject,
            topic: targetTopic,
          },
        });

        if (requestId !== activeRequestIdRef.current) {
          clearTimeout(timeoutTimer);
          return;
        }

        const isRealData =
          cacheRes?.ok &&
          cacheRes.data &&
          cacheRes.data.axiom &&
          !cacheRes.data.axiom.startsWith('Synthesizing') &&
          !cacheRes.data.axiom.startsWith('Core curriculum rule established');

        if (isRealData) {
          const loadedLesson: LessonViewContent = {
            title: cacheRes.data.title || targetTopic,
            axiom: cacheRes.data.axiom,
            trap: cacheRes.data.trap || '',
            hook: cacheRes.data.hook || '',
            guidedStep: cacheRes.data.guidedStep || '',
            socraticCheck: cacheRes.data.socraticCheck || '',
          };

          setLessonData(loadedLesson);
          if (cacheRes.data.fullText && cacheRes.data.fullText.trim().length > 20) {
            setFullLessonText(cacheRes.data.fullText);
          } else {
            setFullLessonText(buildDefaultNarrative(loadedLesson.title, loadedLesson));
          }

          setIsCompiling(false);
          clearTimeout(timeoutTimer);
          return;
        }

        // Step B: Governed AI Question Engine Synthesis
        const res = await dispatch('QuestionEngine', {
          intent: 'synthesize:governed',
          payload: {
            keyStage: targetStage,
            subject: targetSubject,
            topic: targetTopic,
            curriculum: curriculumSetting,
          },
        });

        if (requestId !== activeRequestIdRef.current) {
          clearTimeout(timeoutTimer);
          return;
        }

        if (res?.ok && res.data) {
          const freshLesson: LessonViewContent = {
            title: targetTopic,
            axiom: res.data.axiom || `Fundamental principles governing ${targetTopic}.`,
            trap: res.data.trap || `Common misunderstanding regarding ${targetTopic}.`,
            hook: res.data.hook || `How does ${targetTopic} operate in everyday reality?`,
            guidedStep: res.data.guidedStep || `Analyze the core properties and behaviors of ${targetTopic}.`,
            socraticCheck: res.data.prompt || `What fundamental property defines ${targetTopic}?`,
          };

          // Update active view state with real synthesized data
          setLessonData(freshLesson);

          const defaultNarrative = buildDefaultNarrative(targetTopic, freshLesson);
          setFullLessonText(defaultNarrative);

          // Buffer back to IndexedDB with real content
          dispatch('LessonSynthesizer', {
            intent: 'inflate:baseline',
            payload: {
              stage: targetStage,
              subject: targetSubject,
              topic: targetTopic,
              fullText: defaultNarrative,
              ...freshLesson,
            },
          });
        }
      } catch (err) {
        console.warn('[Learning Zone AST Notice]:', err);
      } finally {
        clearTimeout(timeoutTimer);
        if (requestId === activeRequestIdRef.current) {
          setIsCompiling(false);
        }
      }
    },
    [curriculumSetting]
  );

  // 3. Trigger compilation when selection changes
  useEffect(() => {
    compileLessonForTopic(selectedKeyStage, selectedSubject, selectedUnit);
  }, [selectedKeyStage, selectedSubject, selectedUnit, compileLessonForTopic]);

  // 4. Synthesize Full Dynamic Lesson (Axiom Expansion)
  const handleSynthesizeFullLesson = async () => {
    setIsSynthesizingFull(true);
    try {
      const res = await dispatch('LessonSynthesizer', {
        intent: 'synthesize:full-lesson',
        payload: {
          stage: selectedKeyStage,
          subject: selectedSubject,
          topic: selectedUnit,
          axiom: lessonData.axiom,
          trap: lessonData.trap,
          steps: [lessonData.hook, lessonData.guidedStep, lessonData.socraticCheck],
        },
      });

      const output = res?.data?.content || res?.data?.fullText;
      if (res?.ok && output && output.trim().length > 10) {
        setFullLessonText(output);
      } else {
        setFullLessonText(buildDefaultNarrative(selectedUnit, lessonData));
      }
    } catch (err) {
      console.error('[Full Lesson Synthesis Error]:', err);
    } finally {
      setIsSynthesizingFull(false);
    }
  };

  const practiceLabUrl = `/practice-lab?ks=${encodeURIComponent(selectedKeyStage)}&sub=${encodeURIComponent(selectedSubject)}&unit=${encodeURIComponent(selectedUnit)}`;

  return (
    <Layout
      title="Curriculum Learning Zone"
      description="Deterministic concept exploration and misconception diagnostics."
    >
      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Hidden WebRTC Neural Worker Daemon Frame */}
        <iframe
          src="/schoolsample/worker.html"
          style={{ display: 'none' }}
          title="neural-worker-daemon"
        />

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
            onNewQuestion={() => compileLessonForTopic(selectedKeyStage, selectedSubject, selectedUnit)}
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
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleSynthesizeFullLesson}
                disabled={isSynthesizingFull || isCompiling}
                className="button button--secondary"
                style={{
                  borderRadius: '8px',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 600,
                  cursor: isSynthesizingFull ? 'wait' : 'pointer',
                }}
              >
                {isSynthesizingFull ? '✨ Synthesizing Lesson...' : '✨ Expand Full Lesson (AI)'}
              </button>
              <Link
                to={practiceLabUrl}
                className="button button--primary"
                style={{
                  borderRadius: '8px',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 600,
                  background: '#2563eb',
                }}
              >
                ⚡ Test in Practice Lab
              </Link>
            </div>
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

          {/* Expanded AI Lesson Narrative Block */}
          {fullLessonText && (
            <div
              style={{
                marginBottom: '2rem',
                padding: '1.75rem',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✨</span> Synthesized Comprehensive Lesson
              </h3>
              <div style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {fullLessonText}
              </div>
            </div>
          )}

          {/* Socratic Assistant Panel */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <TuringTutor
              key={`${selectedKeyStage}-${selectedSubject}-${selectedUnit}`}
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