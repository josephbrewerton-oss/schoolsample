// src/pages/learning-zone.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { getAssetUrl } from '../utils/url';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import SeedInflationStudio from '../components/SeedInflationStudio';
import { dispatch } from '../engine/hypercall';
import { hypervisor } from '../engine/hypervisor';
import {
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

  const [searchParams, setSearchParams] = useSearchParams();
  const [userRole, setUserRole] = useState<'pupil' | 'teacher'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('learning_zone_role') as 'pupil' | 'teacher') || 'pupil';
    }
    return 'pupil';
  });
  const [pupilTab, setPupilTab] = useState<'learn' | 'tutor' | 'full'>('learn');

  const handleRoleChange = (role: 'pupil' | 'teacher') => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('learning_zone_role', role);
    }
  };

  const [activeViewMode, setActiveViewMode] = useState<'lesson' | 'inflation'>(() => {
    return searchParams.get('tab') === 'inflation' ? 'inflation' : 'lesson';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'inflation' && activeViewMode !== 'inflation') {
      setActiveViewMode('inflation');
    } else if (!tab && activeViewMode !== 'lesson') {
      setActiveViewMode('lesson');
    }
  }, [searchParams]);

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
    <PageMeta
      title="Curriculum Learning Zone"
      description="Deterministic concept exploration and misconception diagnostics."
    >
      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Hidden WebRTC Neural Worker Daemon Frame */}
        <iframe
          ref={(el) => hypervisor.registerWorkerIframe(el)}
          src={getAssetUrl('worker.html?v=1.2.1')}
          style={{ display: 'none' }}
          title="neural-worker-daemon"
        />

        {/* Header Bar: Pupil View vs. Teacher / Master View */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          {/* Primary Role Switch: Pupil vs Teacher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mode:
            </span>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
              <button
                type="button"
                id="learning-role-pupil"
                onClick={() => handleRoleChange('pupil')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: userRole === 'pupil' ? '#2563eb' : 'transparent',
                  color: userRole === 'pupil' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: userRole === 'pupil' ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🎒 Pupil View</span>
                <span style={{ fontSize: '0.7rem', opacity: userRole === 'pupil' ? 0.9 : 0.6 }}>(Focused)</span>
              </button>

              <button
                type="button"
                id="learning-role-teacher"
                onClick={() => handleRoleChange('teacher')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: userRole === 'teacher' ? '#0f172a' : 'transparent',
                  color: userRole === 'teacher' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: userRole === 'teacher' ? '0 2px 4px rgba(15,23,42,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>👩‍🏫 Teacher View</span>
                <span style={{ fontSize: '0.7rem', opacity: userRole === 'teacher' ? 0.9 : 0.6 }}>(Lesson Plan & Diagnostics)</span>
              </button>
            </div>
          </div>

          {/* Secondary Switch: In Teacher Mode, offer Seed Inflation Engine shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {userRole === 'teacher' && (
              <div style={{ display: 'flex', background: '#f8fafc', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '3px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveViewMode('lesson');
                    setSearchParams({});
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeViewMode === 'lesson' ? '#ffffff' : 'transparent',
                    color: activeViewMode === 'lesson' ? '#0f172a' : '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: activeViewMode === 'lesson' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  Lesson Plan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveViewMode('inflation');
                    setSearchParams({ tab: 'inflation' });
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeViewMode === 'inflation' ? '#2563eb' : 'transparent',
                    color: activeViewMode === 'inflation' ? '#ffffff' : '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: activeViewMode === 'inflation' ? '0 1px 2px rgba(37,99,235,0.2)' : 'none',
                  }}
                >
                  🌱 Seed Engine
                </button>
              </div>
            )}

            {/* Quick Practice shortcut button */}
            <Link
              to={practiceLabUrl}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚡ Practice Quiz</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {activeViewMode === 'inflation' && userRole === 'teacher' ? (
          <SeedInflationStudio />
        ) : (
          <>
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
                buttonLabel={isCompiling ? '⚡ Compiling...' : '📖 Change Topic'}
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
                padding: userRole === 'pupil' ? '1.75rem 2rem' : '2.25rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                minHeight: '440px',
                opacity: isCompiling ? 0.7 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {/* Lesson Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {selectedKeyStage.toUpperCase()} &bull; {selectedSubject.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        background: userRole === 'pupil' ? '#eff6ff' : '#f8fafc',
                        color: userRole === 'pupil' ? '#1d4ed8' : '#475569',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      {userRole === 'pupil' ? '🎒 Pupil View' : '👩‍🏫 Teacher Lesson Plan'}
                    </span>
                  </div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    {effectiveLesson.title || selectedUnit}
                  </h1>
                </div>

                {/* Compact Control Cluster */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {isNonEnglish && (
                    <button
                      type="button"
                      onClick={() => setShowOriginal(!showOriginal)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: showOriginal ? '#fef3c7' : '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: showOriginal ? '#92400e' : '#334155',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {showOriginal ? `🌐 ${currentLangMeta.label}` : '🇬🇧 Original'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSpeakLesson}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#1e293b',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    title="Listen to lesson overview"
                  >
                    <span>🔊</span>
                    <span>Read Aloud</span>
                  </button>

                  <Link
                    to={practiceLabUrl}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
                    }}
                  >
                    <span>⚡ Practice Now</span>
                  </Link>
                </div>
              </div>

              {/* Translation Alert (if non-English) */}
              {isNonEnglish && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '1rem',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: showOriginal ? '#fffbeb' : '#eff6ff',
                    color: showOriginal ? '#b45309' : '#1e40af',
                    border: `1px solid ${showOriginal ? '#fef3c7' : '#bfdbfe'}`,
                  }}
                >
                  {isTranslatingLesson ? (
                    <span>⚡ Translating into {currentLangMeta.label}...</span>
                  ) : showOriginal ? (
                    <span>🇬🇧 Viewing English Original</span>
                  ) : (
                    <span>🌐 Translated into {currentLangMeta.label} ({currentLangMeta.nativeLabel})</span>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* PUPIL VIEW: Uncluttered, Calm 3-Step Journey with Socratic Tutor on Demand */}
              {/* ========================================================================= */}
              {userRole === 'pupil' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Clean Pupil Sub-Tabs to prevent vertical scrolling fatigue */}
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPupilTab('learn')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: pupilTab === 'learn' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'learn' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'learn' ? 700 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      📖 Lesson Steps
                    </button>
                    <button
                      type="button"
                      onClick={() => setPupilTab('tutor')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: pupilTab === 'tutor' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'tutor' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'tutor' ? 700 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>💬 Ask Prof. Turing</span>
                      <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '1px 5px', borderRadius: '4px' }}>AI Tutor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPupilTab('full')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: pupilTab === 'full' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'full' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'full' ? 700 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      📝 Detailed Reading
                    </button>
                  </div>

                  {/* Pupil Tab 1: 3-Step Clean Lesson Card */}
                  {pupilTab === 'learn' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Step 1: Core Fact Banner */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Key Fact to Remember:
                        </div>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                          {effectiveLesson.axiom}
                        </p>
                      </div>

                      {/* Step 2: What are we investigating? */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                          1. Think About This:
                        </div>
                        <p style={{ fontSize: '1.05rem', color: '#1e293b', margin: 0, lineHeight: 1.6 }}>
                          {effectiveLesson.hook}
                        </p>
                      </div>

                      {/* Step 3: Practice Activity */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                          2. How It Works:
                        </div>
                        <p style={{ fontSize: '1.05rem', color: '#1e293b', margin: 0, lineHeight: 1.6 }}>
                          {effectiveLesson.guidedStep}
                        </p>
                      </div>

                      {/* Step 4: Watch Out Trap */}
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>
                          ⚠️ Common Trap to Avoid:
                        </div>
                        <p style={{ fontSize: '1rem', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                          {effectiveLesson.trap}
                        </p>
                      </div>

                      {/* Prompt to Test */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8' }}>Ready to test what you learned?</div>
                          <div style={{ fontSize: '0.95rem', color: '#334155' }}>Try 3 quick practice questions with instant stars and hints.</div>
                        </div>
                        <Link
                          to={practiceLabUrl}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '10px',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                          }}
                        >
                          ⚡ Start Practice Quiz
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Pupil Tab 2: Socratic AI Tutor */}
                  {pupilTab === 'tutor' && (
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                        Need help understanding <strong>{effectiveLesson.title}</strong>? Ask Professor Turing for a friendly hint or question!
                      </div>
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
                  )}

                  {/* Pupil Tab 3: Full Reading Narrative */}
                  {pupilTab === 'full' && (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
                      {effectiveFullText}
                    </div>
                  )}
                </div>
              ) : (
                /* ========================================================================= */
                /* TEACHER VIEW: Full Pedagogical Architecture, Diagnostic Pillars, & AI Expand */
                /* ========================================================================= */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Teacher Action Toolbar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                      Pedagogical Blueprint &bull; Diagnostic Architecture
                    </span>
                    <button
                      type="button"
                      onClick={handleSynthesizeFullLesson}
                      disabled={isSynthesizingFull || isCompiling}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: isSynthesizingFull ? 'wait' : 'pointer',
                      }}
                    >
                      {isSynthesizingFull ? '✨ Synthesizing Lesson...' : '✨ Expand Detailed Lesson Plan (AI)'}
                    </button>
                  </div>

                  {/* Diagnostic Pillars */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📐</span> Pedagogical Axiom (Standard)
                      </div>
                      <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        {effectiveLesson.axiom}
                      </p>
                    </div>

                    <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#b45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️</span> Cognitive Trap (Student Misconception)
                      </div>
                      <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        {effectiveLesson.trap}
                      </p>
                    </div>
                  </div>

                  {/* Structured Lesson Delivery Flow */}
                  <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📋</span> 3-Part Lesson Delivery Flow
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ padding: '0.85rem 1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>Phase 1: Inquiry Hook</strong>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontSize: '0.92rem' }}>{effectiveLesson.hook}</p>
                      </div>

                      <div style={{ padding: '0.85rem 1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>Phase 2: Guided Practice &amp; Activity</strong>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontSize: '0.92rem' }}>{effectiveLesson.guidedStep}</p>
                      </div>

                      <div style={{ padding: '0.85rem 1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>Phase 3: Socratic Check for Understanding</strong>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontSize: '0.92rem' }}><em>"{effectiveLesson.socraticCheck}"</em></p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded AI Lesson Narrative Block */}
                  {effectiveFullText && (
                    <div
                      style={{
                        padding: '1.5rem',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✨</span> Teacher Lesson Outline &amp; Narrative
                      </h3>
                      <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {effectiveFullText}
                      </div>
                    </div>
                  )}

                  {/* Socratic Assistant Panel */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
                      🎓 AI Socratic Tutor Simulation:
                    </div>
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
              )}

            </div>
          </>
        )}
      </main>
    </PageMeta>
  );
}
