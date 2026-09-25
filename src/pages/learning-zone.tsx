// src/pages/learning-zone.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { getAssetUrl } from '../utils/url';
import { CurriculumSelector } from '../components/CurriculumSelector';
import TuringTutor from '../components/NanoAssistantPanel';
import SeedInflationStudio from '../components/SeedInflationStudio';
import LocalKeyGuard from '../components/LocalKeyGuard';
import { dispatch } from '../engine/hypercall';

const FirstCommunionMasteryLab = React.lazy(() => import('../components/FirstCommunionMasteryLab'));
const ConceptConstellation = React.lazy(() => import('../components/ConceptConstellation'));
const ZeroBloatVectorStudio = React.lazy(() => import('../components/ZeroBloatVectorStudio'));
const AstVectorMediaPlayer = React.lazy(() => import('../components/AstVectorMediaPlayer'));
import { hypervisor } from '../engine/hypervisor';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
  getLanguagePracticeMode,
  listenToLanguagePracticeMode,
  getSpeechSpeed,
  listenToSpeechSpeed,
} from '../engine/operational-language';
import {
  translateLessonData,
  speakInLanguage,
  speakBilingual,
  cancelSpeech,
} from '../engine/translationService';

export interface LessonViewContent {
  title: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
}

const buildDefaultNarrative = (topic: string, data: Partial<LessonViewContent>): string => {
  return `### ${topic}\n\n**1. Let's Learn! (The Big Idea):**\n${data.axiom || `Let's explore what makes ${topic} so interesting and how it works.`}\n\n**2. Step-by-Step Example:**\n${data.guidedStep || `Follow along step-by-step to see how to solve questions about ${topic}.`}\n\n**3. Watch Out for This Common Mistake!:**\nDon't get tricked: "${data.trap || `It's easy to make a quick slip here with ${topic}`}". Remember to double-check your steps!\n\n**4. Quick Check — Can You Answer This?:**\n${data.socraticCheck || `Can you explain the main idea of ${topic} in your own words?`}`;
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

  const [activeViewMode, setActiveViewMode] = useState<'lesson' | 'inflation' | 'first-communion' | 'constellation' | 'vector-motion'>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'inflation') return 'inflation';
    if (tab === 'first-communion') return 'first-communion';
    if (tab === 'constellation' || tab === 'graph') return 'constellation';
    if (tab === 'vector-motion' || tab === 'vectors') return 'vector-motion';
    return 'lesson';
  });

  const [motionPlayerMode, setMotionPlayerMode] = useState<'iframe' | 'studio'>('iframe');

  const normalizeKeyStageParam = (raw: string | null): string => {
    if (!raw) return 'ks1';
    const l = raw.toLowerCase();
    if (l.includes('1')) return 'ks1';
    if (l.includes('2')) return 'ks2';
    if (l.includes('3')) return 'ks3';
    if (l.includes('4') || l.includes('gcse')) return 'ks4';
    return raw;
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'inflation' && activeViewMode !== 'inflation') {
      setActiveViewMode('inflation');
    } else if (tab === 'first-communion' && activeViewMode !== 'first-communion') {
      setActiveViewMode('first-communion');
    } else if ((tab === 'constellation' || tab === 'graph') && activeViewMode !== 'constellation') {
      setActiveViewMode('constellation');
    } else if ((tab === 'vector-motion' || tab === 'vectors') && activeViewMode !== 'vector-motion') {
      setActiveViewMode('vector-motion');
    } else if (!tab && activeViewMode !== 'lesson') {
      setActiveViewMode('lesson');
    }

    const urlKs = searchParams.get('ks');
    const urlSub = searchParams.get('sub');
    const urlUnit = searchParams.get('unit');

    if (urlKs) {
      const normKs = normalizeKeyStageParam(urlKs);
      if (normKs !== selectedKeyStage) {
        setSelectedKeyStage(normKs);
      }
    }
    if (urlSub && urlSub !== selectedSubject) {
      setSelectedSubject(urlSub);
    }
    if (urlUnit && urlUnit !== selectedUnit) {
      setSelectedUnit(urlUnit);
    }
  }, [searchParams]);

  const [currentLang, setCurrentLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isTranslatingLesson, setIsTranslatingLesson] = useState<boolean>(false);
  const [translatedLessonData, setTranslatedLessonData] = useState<LessonViewContent | null>(null);
  const [translatedFullText, setTranslatedFullText] = useState<string | null>(null);

  const [practiceMode, setPracticeMode] = useState<boolean>(() => getLanguagePracticeMode());
  const [speechSpeed, setLocalSpeechSpeed] = useState<number>(() => getSpeechSpeed());
  const [audioSpeaking, setAudioSpeaking] = useState<boolean>(false);
  const cancelAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubLang = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    const unsubPractice = listenToLanguagePracticeMode((enabled) => {
      setPracticeMode(enabled);
    });
    const unsubSpeed = listenToSpeechSpeed((speed) => {
      setLocalSpeechSpeed(speed);
    });
    return () => {
      unsubLang();
      unsubPractice();
      unsubSpeed();
      if (cancelAudioRef.current) {
        cancelAudioRef.current();
        cancelAudioRef.current = null;
      }
      cancelSpeech();
    };
  }, []);

  const activeRequestIdRef = useRef(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSynthesizingFull, setIsSynthesizingFull] = useState(false);

  const [selectedKeyStage, setSelectedKeyStage] = useState(() => {
    const initialKs = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ks') : null;
    return normalizeKeyStageParam(initialKs);
  });
  const [selectedSubject, setSelectedSubject] = useState(() => {
    return (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('sub') : null) || 'Science';
  });
  const [selectedUnit, setSelectedUnit] = useState(() => {
    return (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('unit') : null) || 'Animals and Humans';
  });
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

      // Child-friendly optimistic placeholder update so the UI reacts immediately
      setLessonData((prev) => ({
        ...prev,
        title: targetTopic,
        axiom: `Getting ready to explore ${targetTopic}! Loading key facts...`,
        trap: `Finding helpful tips so you don't get tricked...`,
        hook: `Have you ever wondered how ${targetTopic} works in the real world?`,
        guidedStep: `Preparing fun examples and steps to try together...`,
        socraticCheck: `What is the most interesting thing you know about ${targetTopic}?`,
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
          !cacheRes.data.axiom.startsWith('Getting ready') &&
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
            axiom: res.data.axiom || `The big idea behind ${targetTopic} and why it matters.`,
            trap: res.data.trap || `A friendly tip so you don't get tricked on ${targetTopic}.`,
            hook: res.data.hook || `How does ${targetTopic} connect to our daily world?`,
            guidedStep: res.data.guidedStep || `Follow the step-by-step guide to explore and solve ${targetTopic}.`,
            socraticCheck: res.data.prompt || `Can you share what you've learned about ${targetTopic}?`,
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
      } catch {
        // Fallback gracefully without console error
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
    } catch {
      setFullLessonText(buildDefaultNarrative(selectedUnit, lessonData));
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

  const handleSpeakLesson = (slow?: boolean) => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
    }
    const textToSpeak = `${effectiveLesson.title}. Today's big idea: ${effectiveLesson.axiom}. Something to think about: ${effectiveLesson.hook}. How it works: ${effectiveLesson.guidedStep}. Watch out so you don't get tricked: ${effectiveLesson.trap}. Quick question for you: ${effectiveLesson.socraticCheck}`;
    const langToSpeak = isNonEnglish && !showOriginal ? currentLang : 'en';
    setAudioSpeaking(true);
    speakInLanguage(textToSpeak, langToSpeak, {
      rate: slow ? 0.7 : speechSpeed,
      onEnd: () => setAudioSpeaking(false),
      onError: () => setAudioSpeaking(false),
    });
  };

  const handleSpeakEchoLesson = () => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
      setAudioSpeaking(false);
      return;
    }

    if (!isNonEnglish) {
      handleSpeakLesson();
      return;
    }

    const enText = `${lessonData.title}. The big idea: ${lessonData.axiom}. Think about this: ${lessonData.hook}.`;
    const targetText = translatedLessonData
      ? `${translatedLessonData.title}. ${translatedLessonData.axiom}. ${translatedLessonData.hook}.`
      : enText;

    setAudioSpeaking(true);
    cancelAudioRef.current = speakBilingual(
      enText,
      'en',
      targetText,
      currentLang,
      {
        rate: speechSpeed,
        onEnd: () => {
          setAudioSpeaking(false);
          cancelAudioRef.current = null;
        },
      }
    );
  };

  const handleStopAudio = () => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
    }
    setAudioSpeaking(false);
  };

  const practiceLabUrl = `/practice-lab?ks=${encodeURIComponent(selectedKeyStage)}&sub=${encodeURIComponent(selectedSubject)}&unit=${encodeURIComponent(selectedUnit)}`;

  return (
    <PageMeta
      title="Pupil Learning Zone | St Joseph's Curriculum"
      description="Fun, step-by-step lessons, helpful hints, and practice quizzes for children at St Joseph's."
    >
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
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
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: userRole === 'pupil' ? '#2563eb' : 'transparent',
                  color: userRole === 'pupil' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: userRole === 'pupil' ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>🎒 Pupil View</span>
                <span className="hidden sm:inline" style={{ fontSize: '0.7rem', opacity: userRole === 'pupil' ? 0.9 : 0.6 }}>(Fun &amp; Clear)</span>
              </button>

              <button
                type="button"
                id="learning-role-teacher"
                onClick={() => handleRoleChange('teacher')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: userRole === 'teacher' ? '#0f172a' : 'transparent',
                  color: userRole === 'teacher' ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: userRole === 'teacher' ? '0 2px 4px rgba(15,23,42,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>👩‍🏫 Teacher View</span>
                <span className="hidden sm:inline" style={{ fontSize: '0.7rem', opacity: userRole === 'teacher' ? 0.9 : 0.6 }}>(Lesson Plan)</span>
              </button>
            </div>
          </div>

          {/* Mode Switchers: Lesson Plan vs Star Map vs Visual Studio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                📖 Today&apos;s Lesson
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('constellation');
                  setSearchParams({ tab: 'constellation' });
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeViewMode === 'constellation' ? '#6366f1' : 'transparent',
                  color: activeViewMode === 'constellation' ? '#ffffff' : '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeViewMode === 'constellation' ? '0 1px 2px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                🌟 Learning Star Map
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('vector-motion');
                  setSearchParams({ tab: 'vector-motion' });
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeViewMode === 'vector-motion' ? '#0284c7' : 'transparent',
                  color: activeViewMode === 'vector-motion' ? '#ffffff' : '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: activeViewMode === 'vector-motion' ? '0 1px 2px rgba(2,132,199,0.2)' : 'none',
                }}
              >
                🎨 Visual Animations &amp; Worksheets
              </button>
              {userRole === 'teacher' && (
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
              )}
              <Link
                to="/catholic-life"
                title="Whole-School Catholic Faith Sanctuary (Not Key Staged)"
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  background: '#eef2ff',
                  color: '#3730a3',
                  border: '1px solid #c7d2fe',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>✝️</span> Catholic Sanctuary
              </Link>
            </div>

            {/* Quick Practice shortcut button */}
            <Link
              to={practiceLabUrl}
              aria-label={`Practice Quiz for ${selectedUnit}`}
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
              <span>⭐ Practice Quiz</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {activeViewMode === 'inflation' && userRole === 'teacher' ? (
          <LocalKeyGuard
            featureTitle="Internal Seed Inflation &amp; AST Engine"
            featureDescription="This module contains proprietary procedural curriculum generators, misconception graphs, and AST seeds. An authorized local cryptographic key is required to activate it on this device."
          >
            <SeedInflationStudio />
          </LocalKeyGuard>
        ) : activeViewMode === 'constellation' ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Curriculum Learning Constellation
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Interactive star-map of your learning! Click any topic bubble to see how it connects and jump straight to that lesson.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('lesson');
                  setSearchParams({});
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                &larr; Back to Lesson View
              </button>
            </div>
            <React.Suspense
              fallback={
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#0a0e17', borderRadius: '16px' }}>
                  <span>Loading in-memory Concept Constellation graph...</span>
                </div>
              }
            >
              <ConceptConstellation
                filterStage={selectedKeyStage}
                filterSubject={selectedSubject}
                onSelectConcept={(concept) => {
                  if (concept.path) {
                    const parts = concept.path.split('/');
                    if (parts.length >= 3) {
                      setSelectedKeyStage(parts[0]);
                      setSelectedSubject(parts[1]);
                      setSelectedUnit(parts[2]);
                    }
                  }
                }}
              />
            </React.Suspense>
          </div>
        ) : activeViewMode === 'vector-motion' ? (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Interactive Visual Lessons &amp; Vector Motion Suite
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Decoupled AST vector animations (0% main thread), mathematical proofs, solar system orbits, and printable worksheets.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setMotionPlayerMode('iframe')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: motionPlayerMode === 'iframe' ? '#0284c7' : 'transparent',
                      color: motionPlayerMode === 'iframe' ? '#ffffff' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    🎬 AST iFrame Player (LMS Embed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMotionPlayerMode('studio')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: motionPlayerMode === 'studio' ? '#0f172a' : 'transparent',
                      color: motionPlayerMode === 'studio' ? '#ffffff' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    🎨 Full Studio &amp; Worksheets
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveViewMode('lesson');
                    setSearchParams({});
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  &larr; Back to Lesson View
                </button>
              </div>
            </div>

            {motionPlayerMode === 'iframe' ? (
              <React.Suspense
                fallback={
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#090d16', borderRadius: '14px', border: '1px solid #1e293b' }}>
                    <span>Initializing AST Vector Media Player iFrame...</span>
                  </div>
                }
              >
                <AstVectorMediaPlayer
                  preset={
                    selectedSubject.toLowerCase().includes('math')
                      ? 'fractions'
                      : selectedSubject.toLowerCase().includes('science') || selectedUnit.toLowerCase().includes('space')
                      ? 'solar-system'
                      : 'fractions'
                  }
                  allowPresetSwitch={true}
                  height="540px"
                />
              </React.Suspense>
            ) : (
              <React.Suspense
                fallback={
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
                    <span>Loading Zero-Bloat Parametric Vector Studio...</span>
                  </div>
                }
              >
                <ZeroBloatVectorStudio
                  initialPreset={
                    selectedSubject.toLowerCase().includes('math')
                      ? 'fractions'
                      : selectedSubject.toLowerCase().includes('science') || selectedUnit.toLowerCase().includes('space')
                      ? 'solar-system'
                      : 'fractions'
                  }
                />
              </React.Suspense>
            )}
          </div>
        ) : activeViewMode === 'first-communion' ? (
          <>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('lesson');
                  setSearchParams({});
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <span>&larr;</span>
                <span>Back to Standard Lessons</span>
              </button>
              <Link
                to={practiceLabUrl}
                aria-label={`Practice Lab Quiz for ${selectedUnit}`}
                style={{
                  padding: '7px 16px',
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
                <span>⭐ Practice Lab Quiz</span>
                <span>➔</span>
              </Link>
            </div>
            <React.Suspense
              fallback={
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  <span>Loading Catholic First Holy Communion Masterclass...</span>
                </div>
              }
            >
              <FirstCommunionMasteryLab />
            </React.Suspense>
          </>
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
                buttonLabel={isCompiling ? '⚡ Loading...' : '📖 Change Topic'}
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

            {/* Catholic First Communion Banner if studying Catholic RE */}
            {(selectedSubject.toLowerCase().includes('catholic') ||
              selectedSubject.toLowerCase().includes('religious education') ||
              selectedUnit.toLowerCase().includes('communion') ||
              selectedUnit.toLowerCase().includes('eucharist') ||
              selectedUnit.toLowerCase().includes('baptism') ||
              selectedUnit.toLowerCase().includes('reconciliation') ||
              selectedUnit.toLowerCase().includes('mass')) && (
              <div
                style={{
                  marginBottom: '1.25rem',
                  background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                  border: '2px solid #facc15',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>✝️</span>
                  <div>
                    <strong style={{ color: '#854d0e', fontSize: '0.95rem' }}>
                      Whole-School Catholic Life &amp; Faith Sanctuary Available
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#713f12' }}>
                      All Catholic content is now unified in one dedicated place for all ages: Holy Mass, Seven Sacraments, Rosary, Latin Prayers, and CST.
                    </span>
                  </div>
                </div>
                <Link
                  to="/catholic-life"
                  id="open-communion-masterclass-btn"
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    background: '#4338ca',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
                  }}
                >
                  <span>✝️ Open Catholic Sanctuary</span>
                  <span>➔</span>
                </Link>
              </div>
            )}

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

                  {/* Audio Controls */}
                  {isNonEnglish && (
                    <button
                      type="button"
                      onClick={handleSpeakEchoLesson}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: audioSpeaking ? '#047857' : '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: audioSpeaking ? '#ffffff' : '#065f46',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: audioSpeaking ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                      title="Sequential bilingual echo: Listen in English first, then in target language"
                    >
                      <span>🎧</span>
                      <span>{audioSpeaking ? 'Playing Echo...' : `Echo (EN ➔ ${currentLangMeta.code.toUpperCase()})`}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSpeakLesson()}
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
                    title="Listen to lesson overview in active language"
                  >
                    <span>🔊</span>
                    <span>Read Aloud</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeakLesson(true)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Listen at slower speed (0.7x) for phonetic clarity"
                  >
                    <span>🐢</span>
                    <span>Slow</span>
                  </button>

                  {audioSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#b91c1c',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      title="Stop audio playback"
                    >
                      ⏹ Stop
                    </button>
                  )}

                  <Link
                    to={practiceLabUrl}
                    aria-label={`Practice questions now for ${selectedUnit}`}
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
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setPupilTab('learn')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: pupilTab === 'learn' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'learn' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'learn' ? 700 : 600,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>📖</span>
                      <span>1. Step-by-Step Lesson</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPupilTab('tutor')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: pupilTab === 'tutor' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'tutor' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'tutor' ? 700 : 600,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>💬</span>
                      <span>2. Ask Professor Turing</span>
                      <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>Friendly AI Buddy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPupilTab('full')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: pupilTab === 'full' ? '#eff6ff' : 'transparent',
                        color: pupilTab === 'full' ? '#1d4ed8' : '#64748b',
                        fontWeight: pupilTab === 'full' ? 700 : 600,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>📚</span>
                      <span>3. Story &amp; Full Reading</span>
                    </button>
                  </div>

                  {/* Pupil Tab 1: 3-Step Clean Lesson Card */}
                  {pupilTab === 'learn' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Step 1: Core Fact Banner */}
                      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)', border: '1.5px solid #bae6fd', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 4px rgba(2, 132, 199, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                          <span>🌟</span> The Big Idea to Remember:
                        </div>
                        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                          {effectiveLesson.axiom}
                        </p>
                      </div>

                      {/* Step 2: What are we investigating? */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                          <span>🤔</span> 1. Think About This:
                        </div>
                        <p style={{ fontSize: '1.05rem', color: '#1e293b', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                          {effectiveLesson.hook}
                        </p>
                      </div>

                      {/* Step 3: Practice Activity */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                          <span>🚀</span> 2. How It Works (Step-by-Step):
                        </div>
                        <p style={{ fontSize: '1.05rem', color: '#1e293b', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                          {effectiveLesson.guidedStep}
                        </p>
                      </div>

                      {/* Step 4: Watch Out Trap */}
                      <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                          <span>🕵️</span> 3. Watch Out! Don&apos;t Get Tricked:
                        </div>
                        <p style={{ fontSize: '1rem', color: '#92400e', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                          {effectiveLesson.trap}
                        </p>
                      </div>

                      {/* Prompt to Test */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1.5px solid #93c5fd', borderRadius: '14px', padding: '1.25rem 1.5rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8' }}>⭐ Ready for a Quick Challenge?</div>
                          <div style={{ fontSize: '0.92rem', color: '#334155', marginTop: '2px' }}>Test your superpowers with 3 fun practice questions and earn stars!</div>
                        </div>
                        <Link
                          to={practiceLabUrl}
                          aria-label={`Start Practice Quiz for ${selectedUnit}`}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '10px',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>⭐ Start Practice Quiz</span>
                          <span>➔</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Pupil Tab 2: Socratic AI Tutor */}
                  {pupilTab === 'tutor' && (
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ marginBottom: '1rem', fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
                        Stuck or curious about <strong>{effectiveLesson.title}</strong>? Professor Turing is right here with gentle hints and fun clues — no grades, just friendly help!
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
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
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📋</span> 3-Part Lesson Delivery Flow
                    </h2>
                    
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
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✨</span> Teacher Lesson Outline &amp; Narrative
                      </h2>
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
      </div>
    </PageMeta>
  );
}
