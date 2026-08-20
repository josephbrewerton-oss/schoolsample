import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DomainManifest, MasterCatalog, CatalogItem, LearningStream, ShorthandManifest } from '../types/learning-ast';
import { SCHOOL_MANIFEST } from '../manifests/school';
import { COMMUNION_MANIFEST } from '../manifests/communion';
import { openLocalDB, saveManifest, getManifest, logProgress, purgeInactiveManifests } from '../services/dbStore';
import useBaseUrl from '@docusaurus/useBaseUrl';

const DEFAULT_REGISTRY: Record<string, DomainManifest> = {
  school: SCHOOL_MANIFEST,
  communion: COMMUNION_MANIFEST,
};

// Client-side hydrator for Shorthand AST manifests
function hydrateManifest(raw: any): DomainManifest {
  if (raw.meta && raw.meta.domainId) return raw as DomainManifest;

  const s = raw as ShorthandManifest;
  return {
    meta: {
      domainId: s.m.d,
      portalName: s.m.n,
      badgeIcon: s.m.i,
      themeColor: s.m.c,
      tagline: s.m.t,
      lang: s.m.l || 'en-US',
    },
    tutorPersona: {
      name: s.tp.n,
      engineType: s.tp.e,
      voicePitch: s.tp.p,
      voiceRate: s.tp.r,
    },
    cohorts: s.co.map((c) => ({
      code: c.c,
      name: c.n,
      subtext: c.s,
      defaultTopicId: c.d,
    })),
    challenges: s.c.map((ch, index) => ({
      id: ch.i,
      cohortCode: s.co[0]?.c || 'GEN-1',
      topic: s.m.n,
      level: index + 1,
      prompt: ch.p,
      immersionPrompt: ch.ip,
      expectedAnswer: ch.a,
      hint: ch.h,
      explanation: ch.e,
      starterTutorPrompt: `Let's tackle this concept: ${ch.p}`,
      semanticRules: ch.r.map(([kw, res]) => ({
        keywords: kw.split(' '),
        response: res,
      })),
    })),
  };
}

interface EngineProps {
  activeManifestId?: string;
  defaultPhase?: 'PRIMARY' | 'SECONDARY' | string;
  defaultSubject?: string;
  defaultCode?: string;
  defaultStream?: LearningStream | string;
}

export default function UniversalLearningEngine({
  activeManifestId = 'school',
  defaultPhase,
  defaultSubject,
  defaultCode,
  defaultStream = 'academic'
}: EngineProps): React.JSX.Element {
  const baseUrl = useBaseUrl('/');
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const [instructionMode, setInstructionMode] = useState<'bilingual' | 'immersion'>('bilingual');

  const [registry, setRegistry] = useState<Record<string, DomainManifest>>(DEFAULT_REGISTRY);
  const [manifestKey, setManifestKey] = useState<string>(activeManifestId);
  const [manifest, setManifest] = useState<DomainManifest>(DEFAULT_REGISTRY[activeManifestId] ?? SCHOOL_MANIFEST);

  // Multi-stream catalog state
  const [catalog, setCatalog] = useState<MasterCatalog | null>(null);
  const [activeStream, setActiveStream] = useState<LearningStream>(defaultStream as LearningStream);
  const [selectedPhase, setSelectedPhase] = useState<string>(defaultPhase || 'ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject || 'ALL');

  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [activeCodeInput, setActiveCodeInput] = useState<string>(defaultCode || '');
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const cohortChallenges = selectedCohort
    ? manifest.challenges.filter((c) => c.cohortCode === selectedCohort)
    : manifest.challenges;

  const currentChallenge = cohortChallenges[challengeIdx % (cohortChallenges.length || 1)] ?? manifest.challenges[0];

  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'incorrect'; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<Array<{ role: 'system' | 'student' | 'tutor'; text: string }>>([]);
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
const [isTeacherMode, setIsTeacherMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_teacher_mode') === 'true';
    }
    return false;
  });
  const [showAstInspector, setShowAstInspector] = useState<boolean>(false);

  useEffect(() => {
    const syncTeacherMode = () => {
      if (typeof window !== 'undefined') {
        setIsTeacherMode(localStorage.getItem('app_teacher_mode') === 'true');
      }
    };

    syncTeacherMode();
    window.addEventListener('storage', syncTeacherMode);
    return () => window.removeEventListener('storage', syncTeacherMode);
  }, []);

  const activePrompt = (instructionMode === 'immersion' && (currentChallenge as any).immersionPrompt)
    ? (currentChallenge as any).immersionPrompt
    : currentChallenge.prompt;

  // 1. Initialize IndexedDB & Load Master Catalog
  useEffect(() => {
    async function bootstrapEngine() {
      try {
        await openLocalDB();
        await saveManifest(SCHOOL_MANIFEST);
        await saveManifest(COMMUNION_MANIFEST);

        try {
          const catRes = await fetch(`${normalizedBase}/manifests/catalog.json`);
          if (catRes.ok) {
            const catData: MasterCatalog = await catRes.json();
            setCatalog(catData);
          }
        } catch {
          console.warn('Catalog index not yet compiled.');
        }

        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const queryDomain = params.get('domain');
        const queryCohort = params.get('cohort');

        if (queryDomain) {
          const cached = await getManifest(queryDomain);
          if (cached) {
            setRegistry((prev) => ({ ...prev, [queryDomain]: cached }));
            setManifestKey(queryDomain);
            setManifest(cached);
          }
        }

        if (queryCohort) {
          setActiveCodeInput(queryCohort);
        }
      } catch (err) {
        console.warn('IndexedDB initialisation failed:', err);
      }
    }

    bootstrapEngine();
  }, [normalizedBase]);

  const switchDomain = async (domainKey: string) => {
    window.speechSynthesis?.cancel();
    setManifestKey(domainKey);
    setSelectedCohort(null);
    setChallengeIdx(0);
    setFeedback(null);
    setTerminalLogs([]);

    if (registry[domainKey]) {
      setManifest(registry[domainKey]);
    } else {
      const cached = await getManifest(domainKey);
      if (cached) {
        setRegistry((prev) => ({ ...prev, [domainKey]: cached }));
        setManifest(cached);
      }
    }
  };

  const loadCatalogItem = async (item: CatalogItem) => {
    try {
      const cleanPath = item.manifestPath.startsWith('/') ? item.manifestPath : `/${item.manifestPath}`;
      const res = await fetch(`${normalizedBase}${cleanPath}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const rawData = await res.json();
      
      const loaded: DomainManifest = hydrateManifest(rawData);

      await saveManifest(loaded);
      await purgeInactiveManifests(loaded.meta.domainId);

      setRegistry((prev) => ({ ...prev, [loaded.meta.domainId]: loaded }));
      await switchDomain(loaded.meta.domainId);
    } catch {
      console.warn(`Could not load manifest for ${item.title}`);
    }
  };

  // Filter items by Stream and Phase
  const streamItems = useMemo(() => {
    if (!catalog) return [];
    return catalog.items.filter((item) => {
      const matchesStream = item.stream === activeStream;
      const matchesPhase = selectedPhase === 'ALL' || !item.keyStage || item.keyStage.toUpperCase().includes(selectedPhase.toUpperCase());
      return matchesStream && matchesPhase;
    });
  }, [catalog, activeStream, selectedPhase]);

  // Derive unique subjects from filtered items
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    streamItems.forEach((i) => {
      if (i.subject) subjects.add(i.subject);
    });
    return Array.from(subjects).sort();
  }, [streamItems]);

  // Filter lessons matching chosen Subject
  const filteredLessons = useMemo(() => {
    if (selectedSubject === 'ALL') return streamItems;
    return streamItems.filter((i) => i.subject === selectedSubject);
  }, [streamItems, selectedSubject]);

  // Automatically load first lesson when filter changes
  useEffect(() => {
    if (filteredLessons.length > 0) {
      const exists = filteredLessons.some((i) => i.id === manifestKey);
      if (!exists) {
        loadCatalogItem(filteredLessons[0]);
      }
    }
  }, [filteredLessons]);

  // Reset session when stream, phase, or subject changes
  useEffect(() => {
    setSelectedCohort(null);
    setFeedback(null);
    setStudentAnswer('');
    setShowHint(false);
  }, [selectedPhase, selectedSubject, activeStream]);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsedRaw = JSON.parse(event.target?.result as string);
        const parsed = hydrateManifest(parsedRaw);

        if (!parsed.meta?.domainId || !Array.isArray(parsed.challenges)) {
          alert('Invalid AST Manifest format.');
          return;
        }
        await saveManifest(parsed);
        setRegistry((prev) => ({ ...prev, [parsed.meta.domainId]: parsed }));
        await switchDomain(parsed.meta.domainId);
      } catch {
        alert('Failed to parse JSON AST file.');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const speakText = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`~[\]]/g, '').replace(/[^\x00-\x7F]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.pitch = manifest.tutorPersona.voicePitch;
    utterance.rate = manifest.tutorPersona.voiceRate;
    utterance.lang = manifest.meta.lang || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const selectCohort = (code: string) => {
    window.speechSynthesis?.cancel();
    setSelectedCohort(code);
    setChallengeIdx(0);
    setStudentAnswer('');
    setFeedback(null);
    setShowHint(false);

    const relevant = manifest.challenges.filter((c) => c.cohortCode === code);
    const initial = relevant[0] ?? manifest.challenges[0];

    setTerminalLogs([
      { role: 'system', text: `Session initialized for cohort [${code}]. Data stored in local IndexedDB.` },
      { role: 'tutor', text: initial.starterTutorPrompt },
    ]);
    speakText(initial.starterTutorPrompt);
  };

const checkAnswer = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmed = studentAnswer.trim();
  if (!trimmed || isProcessing) return;

  const rawExpected = String(currentChallenge.expectedAnswer || '').trim().toLowerCase();
  
  const isOpenEnded =
    !rawExpected ||
    rawExpected === 'undefined' ||
    rawExpected === 'null' ||
    rawExpected.includes('standard definition') ||
    rawExpected.includes('open-ended') ||
    rawExpected.includes('rubric') ||
    rawExpected.includes('refer to');

  // 1. Direct / Keyword check for structured questions
  if (!isOpenEnded) {
    const targets = rawExpected.split('|').map((s) => s.trim()).filter(Boolean);
    const directMatch = targets.some((target) => trimmed.toLowerCase().includes(target));

    const keyTerms = rawExpected
      .split(/[\s|]+/)
      .filter((w) => w.length > 2 && !['what', 'that', 'with', 'from', 'this', 'the', 'and'].includes(w));

    const keywordMatches = keyTerms.filter((term) => trimmed.toLowerCase().includes(term));
    const isCorrect = directMatch || (keyTerms.length > 0 && keywordMatches.length >= Math.ceil(keyTerms.length * 0.5));

    await handleAnswerResult(isCorrect, trimmed, currentChallenge.explanation || 'Well done!');
    return;
  }

  // 2. Open-Ended: Pipe through the Socratic Evaluator
  setIsProcessing(true);
  window.speechSynthesis?.cancel();

  // Log student attempt into the Socratic terminal
  setTerminalLogs((prev) => [
    ...prev,
    { role: 'student', text: `[Answer Submission] ${trimmed}` },
  ]);

  setTimeout(async () => {
    const lowerInput = trimmed.toLowerCase();

// Dynamically derive domain keywords from the active challenge metadata
    const stopWords = new Set([
      'what', 'that', 'with', 'from', 'this', 'outline', 'method', 'solve', 
      'problem', 'concept', 'guidance', 'primary', 'secondary', 'stage', 
      'review', 'using', 'core', 'your', 'about', 'have', 'been', 'which'
    ]);

    const topicTokens = `${currentChallenge.topic} ${currentChallenge.prompt} ${currentChallenge.explanation || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    const uniqueKeywords = Array.from(new Set(topicTokens));
    const matchedKeywords = uniqueKeywords.filter((kw) => lowerInput.includes(kw));

    const matchedRule = currentChallenge.semanticRules?.find((r) =>
      r.keywords.some((k) => lowerInput.includes(k.toLowerCase()))
    );

    let isCorrect = false;
    let tutorFeedback = '';

    if (matchedRule) {
      isCorrect = true;
      tutorFeedback = matchedRule.response;
    } else if (matchedKeywords.length >= 2) {
      isCorrect = true;
      tutorFeedback = `Great breakdown. You correctly identified key steps (${matchedKeywords.join(', ')}).`;
    } else if (matchedKeywords.length === 1) {
      isCorrect = false;
      tutorFeedback = `You mentioned "${matchedKeywords[0]}", but can you describe what happens to the extra amount when a column exceeds 9?`;
    } else {
      isCorrect = false;
      tutorFeedback = `That doesn't quite explain the method. How do we line up the ones and tens columns to add them?`;
    }

    // Output tutor reflection in terminal
    setTerminalLogs((prev) => [
      ...prev,
      { role: 'tutor', text: tutorFeedback },
    ]);
    speakText(tutorFeedback);
    setIsProcessing(false);

    await handleAnswerResult(isCorrect, trimmed, tutorFeedback);
  }, 400);
};

// Helper to update progress and UI feedback
const handleAnswerResult = async (isCorrect: boolean, answerText: string, feedbackMsg: string) => {
  try {
    await logProgress({
      cohortCode: selectedCohort || 'general',
      challengeId: currentChallenge.id,
      answeredAt: Date.now(),
      isCorrect,
      userAnswer: answerText,
    });
  } catch (err) {
    console.warn('Failed to log progress:', err);
  }

  if (isCorrect) {
    setFeedback({ status: 'correct', message: feedbackMsg });
    setStreak((s) => s + 1);
  } else {
    setFeedback({ status: 'incorrect', message: feedbackMsg });
    setStreak(0);
  }
};

  const nextChallenge = () => {
    window.speechSynthesis?.cancel();
    const nextIdx = (challengeIdx + 1) % cohortChallenges.length;
    setChallengeIdx(nextIdx);
    setStudentAnswer('');
    setFeedback(null);
    setShowHint(false);

    const nextQ = cohortChallenges[nextIdx];
    setTerminalLogs([
      { role: 'system', text: `Loaded challenge ${nextIdx + 1} of ${cohortChallenges.length}` },
      { role: 'tutor', text: nextQ.starterTutorPrompt },
    ]);
    speakText(nextQ.starterTutorPrompt);
  };

  const handleQuery = (promptText: string) => {
    window.speechSynthesis?.cancel();
    setIsProcessing(true);
    setTerminalLogs((prev) => [...prev, { role: 'student', text: promptText }]);

    setTimeout(() => {
      const p = promptText.toLowerCase();
      const matched = currentChallenge.semanticRules.find((r) => r.keywords.some((k) => p.includes(k)));
      const res = matched
        ? matched.response
        : `Reflecting on "${promptText}" regarding ${currentChallenge.topic}. How does this guide your reasoning?`;

      setTerminalLogs((prev) => [...prev, { role: 'tutor', text: res }]);
      setIsProcessing(false);
      speakText(res);
    }, 350);
  };

  // 1. Onboarding Screen
  if (!selectedCohort) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Stream Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {catalog?.streams?.map((stream) => {
            const isActive = activeStream === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveStream(stream.id);
                  setSelectedSubject('ALL');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: isActive ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isActive ? '#f8fafc' : '#ffffff',
                  color: isActive ? '#2563eb' : '#334155',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {stream.icon} {stream.title}
              </button>
            );
          })}
        </div>

        {/* Cascading Subject & Unit Pickers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            
            {/* Phase Selector (if not locked by prop) */}
            {!defaultPhase && activeStream === 'academic' && (
              <select
                aria-label="Filter by Phase"
                value={selectedPhase}
                onChange={(e) => {
                  setSelectedPhase(e.target.value);
                  setSelectedSubject('ALL');
                }}
                style={{
                  flex: '1 1 120px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Phases</option>
                <option value="PRIMARY">🎒 Primary</option>
                <option value="SECONDARY">🔬 Secondary</option>
              </select>
            )}

            {/* Subject Selector */}
            <select
              aria-label="Select Subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                flex: '1 1 160px',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Subjects ({availableSubjects.length})</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Unit / Topic Selector */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {filteredLessons.length > 0 ? (
              <select
                aria-label="Select lesson topic"
                value={manifestKey}
                onChange={(e) => {
                  const selected = filteredLessons.find((i) => i.id === e.target.value);
                  if (selected) loadCatalogItem(selected);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {filteredLessons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.badgeIcon} {item.title}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ flex: 1, padding: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                No modules found for this combination.
              </div>
            )}

            <label style={{ padding: '6px 10px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              📁 Import AST
              <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Card Branding Banner */}
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{manifest.meta.badgeIcon}</div>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.4rem' }}>{manifest.meta.portalName}</h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{manifest.meta.tagline}</p>

        {/* Quick Cohort Entry Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const c = manifest.cohorts.find((x) => x.code.toLowerCase() === activeCodeInput.trim().toLowerCase());
            if (c) selectCohort(c.code);
            else alert('Code not found in active module.');
          }}
          style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}
        >
          <input
            type="text"
            placeholder="Enter Code (e.g. OAK-SCI3, FHC-A)"
            value={activeCodeInput}
            onChange={(e) => setActiveCodeInput(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: manifest.meta.themeColor, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Join ➔
          </button>
        </form>

        {/* Cohort Cards */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {manifest.cohorts.map((c) => (
            <button
              key={c.code}
              onClick={() => selectCohort(c.code)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.subtext}</div>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>Code: {c.code}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Active Session Screen
  const activeCohortMeta = manifest.cohorts.find((c) => c.code === selectedCohort);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Session Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, background: '#f1f5f9', color: '#1e293b', padding: '4px 10px', borderRadius: '6px' }}>
            {manifest.meta.badgeIcon} {activeCohortMeta?.name} ({selectedCohort})
          </span>
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setSelectedCohort(null); }}
            style={{ fontSize: '0.8rem', color: '#64748b', background: 'transparent', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Switch Cohort
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={instructionMode}
            onChange={(e) => setInstructionMode(e.target.value as 'bilingual' | 'immersion')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="bilingual">🇬🇧 English Mode</option>
            <option value="immersion">🌐 Immersion Mode</option>
          </select>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>🔥 Streak: <strong style={{ color: '#ea580c' }}>{streak}</strong></span>
          <button
            type="button"
            onClick={() => { if (isVoiceEnabled && isSpeaking) window.speechSynthesis?.cancel(); setIsVoiceEnabled(!isVoiceEnabled); }}
            style={{ padding: '5px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', background: isVoiceEnabled ? '#f0fdf4' : '#f8fafc', color: isVoiceEnabled ? '#166534' : '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {isVoiceEnabled ? (isSpeaking ? '🔊 Speaking...' : '🔊 Voice ON') : '🔇 Muted'}
          </button>
        </div>
      </div>

      {/* Challenge Card */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontSize: '0.8rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' }}>
            {currentChallenge.topic}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Level {currentChallenge.level}</span>
        </div>

        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', color: '#0f172a' }}>{activePrompt}</h2>

        <form onSubmit={checkAnswer} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Type your response here..."
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            style={{ flex: '1 1 240px', padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          />
          <button type="submit" style={{ padding: '9px 18px', borderRadius: '8px', background: manifest.meta.themeColor, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Submit
          </button>
          <button type="button" onClick={() => setShowHint(!showHint)} style={{ padding: '9px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}>
            {showHint ? 'Hide Hint' : '💡 Hint'}
          </button>
        </form>

        {showHint && (
          <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: '#f8fafc', borderLeft: `3px solid ${manifest.meta.themeColor}`, borderRadius: '4px', fontSize: '0.85rem', color: '#475569' }}>
            <strong>Hint:</strong> {currentChallenge.hint}
          </div>
        )}

        {feedback && (
          <div style={{
            marginTop: '1rem',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 500,
            background: feedback.status === 'correct' ? '#f0fdf4' : '#fef2f2',
            color: feedback.status === 'correct' ? '#166534' : '#991b1b',
            border: `1px solid ${feedback.status === 'correct' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            <span>{feedback.status === 'correct' ? '✅ ' : '❌ '}{feedback.message}</span>
            {feedback.status === 'correct' && (
              <button onClick={nextChallenge} style={{ padding: '6px 12px', background: '#166534', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                Next ➔
              </button>
            )}
          </div>
        )}
      </div>
      {/* Teacher & Facilitator Overlay */}
        {isTeacherMode && currentChallenge && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem',
              border: '2px dashed var(--ifm-color-warning)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 186, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--ifm-color-warning-darkest)' }}>
                🎓 Teacher Mode Active
              </strong>
              <button
                type="button"
                className="button button--sm button--secondary"
                onClick={() => setShowAstInspector(!showAstInspector)}
              >
                {showAstInspector ? 'Hide Raw AST' : 'Inspect Manifest AST'}
              </button>
            </div>

<div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <strong>Target Accepted Answers:</strong>{' '}
              <code>
                {(() => {
                  const c = currentChallenge as any;
                  const ans =
                    c?.acceptedAnswers ||
                    c?.a ||
                    c?.answer ||
                    c?.solution ||
                    c?.solutions ||
                    c?.targetAnswers ||
                    c?.keywords;
                  if (Array.isArray(ans) && ans.length > 0) return ans.join(', ');
                  if (typeof ans === 'string' && ans.trim()) return ans;
                  return 'Open-ended (Evaluated against prompt rubric)';
                })()}
              </code>
            </div>

            {(currentChallenge as any).semanticRules && (currentChallenge as any).semanticRules.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Known Misconceptions & Feedback:</strong>
                <ul style={{ margin: '0.25rem 0 0 1.25rem' }}>
                  {(currentChallenge as any).semanticRules.map(([term, feedback]: [string, string], idx: number) => (
                    <li key={idx}>
                      <code>"{term}"</code> → {feedback}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {((currentChallenge as any).e || (currentChallenge as any).explanation) && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Curriculum Explanation:</strong>{' '}
                {(currentChallenge as any).e || (currentChallenge as any).explanation}
              </div>
            )}
          </div>

          {showAstInspector && (
            <pre
              style={{
                marginTop: '1rem',
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '0.8rem',
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
              }}
            >
              {JSON.stringify(currentChallenge, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Persona Edge Terminal */}
      <div style={{ background: '#0b1120', borderRadius: '12px', padding: '1.25rem', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.85rem' }}>
            ⚡ {manifest.tutorPersona.name} [{manifest.tutorPersona.engineType}]
          </span>
          <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: '10px' }}>100% Client-Side DB</span>
        </div>

        <div style={{ background: '#030712', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', minHeight: '110px', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {terminalLogs.map((log, idx) => (
            <div key={idx} style={{ color: log.role === 'student' ? '#38bdf8' : (log.role === 'tutor' ? '#4ade80' : '#64748b') }}>
              {log.role === 'student' ? '> User: ' : (log.role === 'tutor' ? `🤖 ${manifest.tutorPersona.name}: ` : '⚡ ')}{log.text}
            </div>
          ))}
          {isProcessing && <div style={{ color: '#eab308' }}>⏳ Evaluating locally...</div>}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (queryInput.trim()) { handleQuery(queryInput); setQueryInput(''); } }} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={`Ask ${manifest.tutorPersona.name} a question...`}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', background: '#030712', color: '#f8fafc', fontSize: '0.85rem' }}
          />
          <button type="submit" disabled={isProcessing} style={{ padding: '8px 16px', borderRadius: '6px', background: manifest.meta.themeColor, color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: isProcessing ? 'wait' : 'pointer' }}>
            Ask
          </button>
        </form>
      </div>

    </div>
  );
}