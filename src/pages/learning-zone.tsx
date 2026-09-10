// src/pages/learning-zone.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import { dispatch } from '../engine/hypercall';
import { hypervisor } from '../engine/hypervisor';
import {
  LanguageSelector,
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
} from '../engine/operational-language';
import { translateLessonData, speakInLanguage } from '../engine/translationService';

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

  const [currentLang, setCurrentLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isTranslatingLesson, setIsTranslatingLesson] = useState<boolean>(false);
  const [translatedLessonData, setTranslatedLessonData] = useState<LessonViewContent | null>(null);
  const [translatedFullText, setTranslatedFullText] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    return unsub;
  }, []);

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

  // Dynamic lesson re-translation when currentLang or lessonData changes
  useEffect(() => {
    let cancelled = false;

    if (!currentLang || currentLang === 'en') {
      setTranslatedLessonData(null);
      setTranslatedFullText(null);
      setIsTranslatingLesson(false);
      return;
    }

    setIsTranslatingLesson(true);
    translateLessonData(
      {
        title: lessonData.title,
        axiom: lessonData.axiom,
        trap: lessonData.trap,
        hook: lessonData.hook,
        guidedStep: lessonData.guidedStep,
        socraticCheck: lessonData.socraticCheck,
        fullText: fullLessonText,
      },
      currentLang
    )
      .then((res) => {
        if (!cancelled) {
          setTranslatedLessonData({
            title: res.title,
            axiom: res.axiom,
            trap: res.trap,
            hook: res.hook,
            guidedStep: res.guidedStep,
            socraticCheck: res.socraticCheck,
          });
          if (res.fullText) {
            setTranslatedFullText(res.fullText);
          }
          setIsTranslatingLesson(false);
        }
      })
      .catch((err) => {
        console.warn('[Lesson Translation Error]:', err);
        if (!cancelled) setIsTranslatingLesson(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonData, fullLessonText, currentLang]);

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
            lang: currentLang,
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
            lang: currentLang,
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
              lang: currentLang,
              ...freshLesson,
            },
          });
        }
      } catch (err) {
        console.error('[Governed Compilation Error]:', err);
      } finally {
        if (requestId === activeRequestIdRef.current) {
          setIsCompiling(false);
          clearTimeout(timeoutTimer);
        }
      }
    },
    [curriculumSetting, currentLang]
  );

  // 3. Keep Active Lesson Synced when Unit selection changes
  useEffect(() => {
    compileLessonForTopic(selectedKeyStage, selectedSubject, selectedUnit);
  }, [selectedKeyStage, selectedSubject, selectedUnit, curriculumSetting, compileLessonForTopic]);

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
          lang: currentLang,
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

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
    setSavedLanguage(newLang);
    setShowOriginal(false);
  };

  const isNonEnglish = currentLang && currentLang !== 'en';
  const effectiveLesson = isNonEnglish && !showOriginal && translatedLessonData ? translatedLessonData : lessonData;
  const effectiveFullText = isNonEnglish && !showOriginal && translatedFullText ? translatedFullText : fullLessonText;
  const currentLangMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;

  const handleSpeakLesson = () => {
    const textToSpeak = `${effectiveLesson.title}. Core Axiom: ${effectiveLesson.axiom}. Common Misconception: ${effectiveLesson.trap}. Inquiry: ${effectiveLesson.hook}. Check: ${effectiveLesson.socraticCheck}`;
    const langToSpeak = isNonEnglish && !showOriginal ? currentLang : 'en';
    speakInLanguage(textToSpeak, langToSpeak);
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
          ref={(el) => hypervisor.registerWorkerIframe(el)}
          src={useBaseUrl('/worker.html')}
          style={{ display: 'none' }}
          title="neural-worker-daemon"
        />

        {/* Language Selection Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
          <LanguageSelector currentLang={currentLang} onSelect={handleLanguageChange} />
        </div>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                {selectedKeyStage.toUpperCase()} &bull; {selectedSubject.toUpperCase()} ({curriculumSetting.toUpperCase()} Standard)
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
                {effectiveLesson.title || selectedUnit}
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {isNonEnglish && (
                <button
                  type="button"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="button button--outline button--primary"
                  style={{
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                  }}
                >
                  {showOriginal ? `🌐 Show ${currentLangMeta.label}` : '🇬🇧 Show Original'}
                </button>
              )}

              <button
                type="button"
                onClick={handleSpeakLesson}
                className="button button--secondary"
                style={{
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontWeight: 600,
                }}
                title="Listen to lesson overview"
              >
                🔊 Read Aloud
              </button>

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

          {/* Translation Status Badge */}
          {isNonEnglish && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '1rem',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: showOriginal ? '#fef3c7' : '#eff6ff',
                color: showOriginal ? '#92400e' : '#1e40af',
                border: `1px solid ${showOriginal ? '#fde68a' : '#bfdbfe'}`,
              }}
            >
              {isTranslatingLesson ? (
                <span>⚡ Translating lesson into {currentLangMeta.label} ({currentLangMeta.nativeLabel})...</span>
              ) : showOriginal ? (
                <span>🇬🇧 Viewing English Original (Translation into {currentLangMeta.label} ready)</span>
              ) : (
                <span>🌐 Translated into {currentLangMeta.label} ({currentLangMeta.nativeLabel})</span>
              )}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0 1.5rem 0' }} />

          {/* Diagnostic Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📐</span> Core Axiom
              </div>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                {effectiveLesson.axiom}
              </p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> Cognitive Trap (Common Error)
              </div>
              <p style={{ color: '#92400e', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                {effectiveLesson.trap}
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
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>{effectiveLesson.hook}</p>
              </div>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 2: Guided Practice & Activity</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>{effectiveLesson.guidedStep}</p>
              </div>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#15803d' }}>Step 3: Socratic Check for Understanding</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}><em>"{effectiveLesson.socraticCheck}"</em></p>
              </div>
            </div>
          </div>

          {/* Expanded AI Lesson Narrative Block */}
          {effectiveFullText && (
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
                {effectiveFullText}
              </div>
            </div>
          )}

          {/* Socratic Assistant Panel */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <TuringTutor
              key={`${selectedKeyStage}-${selectedSubject}-${selectedUnit}-${currentLang}`}
              seedKey={`${selectedKeyStage}:${selectedSubject}:${selectedUnit}:${currentLang}`}
              keyStage={selectedKeyStage}
              subject={selectedSubject}
              unit={selectedUnit}
              contextTopic={selectedUnit}
              activePrompt={effectiveLesson.socraticCheck}
            />
          </div>

        </div>
      </main>
    </Layout>
  );
}
