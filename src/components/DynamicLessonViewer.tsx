import React, { useState, useEffect, useRef } from 'react';
import { DomainManifest } from '../types/learning-ast';
import { SCHOOL_MANIFEST } from '../manifests/school';
import { COMMUNION_MANIFEST } from '../manifests/communion';

// Swappable Manifest Registry
const MANIFEST_REGISTRY: Record<string, DomainManifest> = {
  school: SCHOOL_MANIFEST,
  communion: COMMUNION_MANIFEST,
};

export default function UniversalLearningEngine({ activeManifestId = 'school' }: { activeManifestId?: string }): React.JSX.Element {
  const [manifestKey, setManifestKey] = useState<string>(activeManifestId);
  const manifest = MANIFEST_REGISTRY[manifestKey] ?? SCHOOL_MANIFEST;

  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [activeCodeInput, setActiveCodeInput] = useState<string>('');
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Filter challenges for active cohort
  const cohortChallenges = selectedCohort
    ? manifest.challenges.filter((c) => c.cohortCode === selectedCohort)
    : manifest.challenges;

  const currentChallenge = cohortChallenges[challengeIdx % cohortChallenges.length] ?? manifest.challenges[0];

  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'incorrect'; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<Array<{ role: 'system' | 'student' | 'tutor'; text: string }>>([]);
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

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
      { role: 'system', text: `Session initialized for cohort [${code}].` },
      { role: 'tutor', text: initial.starterTutorPrompt },
    ]);
    speakText(initial.starterTutorPrompt);
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    const isCorrect = studentAnswer.trim().toLowerCase().includes(currentChallenge.expectedAnswer.toLowerCase());
    if (isCorrect) {
      const msg = `Correct! ${currentChallenge.explanation}`;
      setFeedback({ status: 'correct', message: msg });
      setStreak((s) => s + 1);
      speakText(msg);
    } else {
      const msg = `Not quite. Review the question or view the hint.`;
      setFeedback({ status: 'incorrect', message: msg });
      setStreak(0);
      speakText(msg);
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
      <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Quick Manifest Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.25rem' }}>
          {Object.keys(MANIFEST_REGISTRY).map((key) => (
            <button
              key={key}
              onClick={() => { setManifestKey(key); }}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                border: manifestKey === key ? `1px solid ${manifest.meta.themeColor}` : '1px solid #e2e8f0',
                background: manifestKey === key ? manifest.meta.themeColor : '#f8fafc',
                color: manifestKey === key ? '#fff' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
              }}
            >
              Preset: {key}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{manifest.meta.badgeIcon}</div>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{manifest.meta.portalName}</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{manifest.meta.tagline}</p>

        <form onSubmit={(e) => { e.preventDefault(); const c = manifest.cohorts.find(x => x.code.toLowerCase() === activeCodeInput.trim().toLowerCase()); if (c) selectCohort(c.code); else alert('Code not found.'); }} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Enter Code (e.g. 4B, FHC-A)"
            value={activeCodeInput}
            onChange={(e) => setActiveCodeInput(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: manifest.meta.themeColor, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Join ➔
          </button>
        </form>

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

        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', color: '#0f172a' }}>{currentChallenge.prompt}</h2>

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

      {/* Persona Edge Terminal */}
      <div style={{ background: '#0b1120', borderRadius: '12px', padding: '1.25rem', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.85rem' }}>
            ⚡ {manifest.tutorPersona.name} [{manifest.tutorPersona.engineType}]
          </span>
          <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: '10px' }}>100% Client-Side</span>
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