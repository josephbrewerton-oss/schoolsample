// src/components/NanoAssistantPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { aiCaller, hasUserGrantedAiConsent, setUserAiConsent } from '../engine/aicaller';
import { findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';
import {
  getSavedLanguage,
  listenToLanguageChange,
  SUPPORTED_LANGUAGES,
} from '../engine/operational-language';
import { translateText, speakInLanguage } from '../engine/translationService';
import { getComplianceCaveat } from '../data/complianceCaveats';

interface TuringTutorProps {
  activePrompt?: string;
  activeTopic?: string;
  contextTopic?: string;
  seedKey?: string;
  keyStage?: string;
  subject?: string;
  unit?: string;
  onLaunchLesson?: (manifest: any) => void;
}

interface RetrievedLesson {
  id: string;
  title: string;
  manifestPath: string;
}

export function TuringTutor({
  activePrompt = '',
  activeTopic = '',
  contextTopic = '',
  seedKey = '',
  keyStage = 'Key Stage 3',
  subject = 'Science',
  unit = 'Atomic Structure',
  onLaunchLesson,
}: TuringTutorProps) {
  const currentTopic = activeTopic || contextTopic || unit || 'General Studies';
  const topicKnowledge = findCurriculumKnowledge(keyStage, subject, currentTopic);

  const [currentLang, setCurrentLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });

  const [messages, setMessages] = useState<Array<{ role: 'turing' | 'pupil'; text: string }>>([
    {
      role: 'turing',
      text: topicKnowledge
        ? `Hello! I'm Super Teacher Nano. In ${topicKnowledge.title}: ${topicKnowledge.socraticPivot}`
        : `Hello! I'm Super Teacher Nano. What are you exploring in ${currentTopic}?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedLesson, setSuggestedLesson] = useState<RetrievedLesson | null>(null);
  const [launchingLesson, setLaunchingLesson] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setHasConsent(hasUserGrantedAiConsent());
    const handleConsentChanged = (e: any) => {
      setHasConsent(Boolean(e.detail));
    };
    window.addEventListener('ai_consent_changed', handleConsentChanged);
    window.addEventListener('storage', () => setHasConsent(hasUserGrantedAiConsent()));
    return () => {
      window.removeEventListener('ai_consent_changed', handleConsentChanged);
    };
  }, []);

  const voiceEnabledRef = useRef(voiceEnabled);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Reset conversation session when the topic or language changes
  useEffect(() => {
    let cancelled = false;
    const knowledge = findCurriculumKnowledge(keyStage, subject, currentTopic);
    const baseGreeting = knowledge
      ? `Hello! I'm Super Teacher Nano. In ${knowledge.title}: ${knowledge.socraticPivot}`
      : `Hello! I'm Super Teacher Nano. What are you exploring in ${currentTopic}?`;

    if (currentLang && currentLang !== 'en') {
      translateText(baseGreeting, currentLang).then((translated) => {
        if (!cancelled) {
          setMessages([{ role: 'turing', text: translated }]);
        }
      });
    } else {
      setMessages([{ role: 'turing', text: baseGreeting }]);
    }

    return () => {
      cancelled = true;
    };
  }, [seedKey, currentTopic, keyStage, subject, currentLang]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const buildSystemPrompt = () => {
    const langMeta = SUPPORTED_LANGUAGES[currentLang];
    const langInstruction =
      currentLang !== 'en' && langMeta
        ? `\nCRITICAL LANGUAGE REQUIREMENT: You MUST formulate your entire response in ${langMeta.label} (${langMeta.nativeLabel}). ${langMeta.promptCondition}.`
        : '';

    return `You are "Super Teacher Nano" — an expert UK National Curriculum Socratic educator for ${keyStage} ${subject}.
Target Topic: ${currentTopic}
${topicKnowledge ? `\nCURRICULUM GROUND TRUTH:
- Core Axiom/Rule: "${topicKnowledge.coreAxiom}"
- Target Pupil Misconception: "${topicKnowledge.cognitiveTrap}"
- Socratic Inquiry Angle: "${topicKnowledge.socraticPivot}"` : ''}
${langInstruction}

PEDAGOGICAL RULES:
1. NEVER give the direct answer.
2. Provide ONE concise hint or thought-provoking clue (under 35 words).
3. Directly counter the known pupil misconception without giving the solution away.
4. Always finish with an engaging question to help the student think through the answer.`;
  };

  const speak = (text: string) => {
    if (!voiceEnabledRef.current || typeof window === 'undefined') return;
    speakInLanguage(text, currentLang);
  };

  const cleanResponse = (raw: string): string => {
    if (!raw) return '';
    return raw
      .replace(/^(?:Hint|Tutor Hint|Super Teacher Nano|Teacher|Prof\. Turing):\s*/i, '')
      .replace(/\*\*(?:Response|Thought|Explanation|Answer):\*\*/gi, '')
      .replace(/^"(.*)"$/, '$1')
      .trim();
  };

  const handleLaunchSuggestedLesson = async () => {
    if (!suggestedLesson) return;
    setLaunchingLesson(true);
    try {
      if (onLaunchLesson) {
        onLaunchLesson(suggestedLesson);
      } else {
        const channel = new BroadcastChannel('neural_hypervisor_bus');
        channel.postMessage({ type: 'LOAD_AST_MANIFEST', manifest: suggestedLesson });
        channel.close();
      }
    } catch (err) {
      console.error('[Launch AST Error]:', err);
    } finally {
      setLaunchingLesson(false);
    }
  };

  const dispatchNanoInference = async (userText: string, customInstruction?: string) => {
    if (loading) return;
    setLoading(true);
    setSuggestedLesson(null);

    const updatedMessages = [...messages, { role: 'pupil' as const, text: userText }];
    setMessages([...updatedMessages, { role: 'turing' as const, text: '' }]);

    try {
      // Package recent conversation context into the prompt
      const conversationHistory = updatedMessages
        .slice(-4)
        .map((m) => `${m.role === 'pupil' ? 'Pupil' : 'Teacher'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `Topic Context: ${currentTopic} (${keyStage} ${subject})\n${
        activePrompt ? `Focus Question: "${activePrompt}"\n` : ''
      }${conversationHistory}\n${customInstruction ? `Instruction: ${customInstruction}\n` : ''}Teacher Socratic Response:`;

      const rawResponse = await aiCaller.promptText({
        prompt: fullPrompt,
        systemPrompt: buildSystemPrompt(),
        preserveContext: false, // Prevents Chrome session port collisions
      });

      let cleaned =
        cleanResponse(rawResponse) ||
        `What do you think is the first key factor we need to consider in ${currentTopic}?`;

      // If needed, verify language translation
      if (currentLang && currentLang !== 'en') {
        try {
          cleaned = await translateText(cleaned, currentLang);
        } catch (e) {
          // Keep response
        }
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'turing', text: cleaned };
        return copy;
      });

      speak(cleaned);
    } catch (err) {
      console.error('[Super Teacher Error]:', err);
      let fallback = `In ${currentTopic}, what clue or idea comes to mind first?`;
      if (customInstruction?.includes('analogy') && topicKnowledge?.scaffoldHints.level1) {
        fallback = topicKnowledge.scaffoldHints.level1;
      } else if (customInstruction?.includes('rule') && topicKnowledge?.scaffoldHints.level2) {
        fallback = topicKnowledge.scaffoldHints.level2;
      } else if (customInstruction?.includes('step') && topicKnowledge?.scaffoldHints.level3) {
        fallback = topicKnowledge.scaffoldHints.level3;
      } else if (topicKnowledge) {
        fallback = `Remember the key rule: ${topicKnowledge.coreAxiom}. How can we apply that here?`;
      }

      if (currentLang && currentLang !== 'en') {
        try {
          fallback = await translateText(fallback, currentLang);
        } catch (e) {
          // Keep english fallback
        }
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'turing', text: fallback };
        return copy;
      });
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query) return;
    setInput('');
    dispatchNanoInference(query);
  };

  const handleScaffoldHint = (level: 1 | 2 | 3) => {
    if (level === 1) {
      dispatchNanoInference(
        'Can I have a small nudge?',
        'Give a gentle real-world analogy to orient the student without using formula jargon.'
      );
    } else if (level === 2) {
      dispatchNanoInference(
        'Can I have a clue on the rule?',
        'Point out the specific curriculum rule or property needed here, but leave the execution to the student.'
      );
    } else {
      dispatchNanoInference(
        'Can we break this down step-by-step?',
        'Provide a worked parallel mini-example demonstrating the first step only.'
      );
    }
  };

  const currentLangMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        color: '#1e293b',
        boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>🎓</span>
          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
            Prof. Turing <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>• Friendly Tutor [{keyStage} • {subject}]</span>
          </span>
          {currentLang !== 'en' && (
            <span
              style={{
                fontSize: '0.75rem',
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              🌐 {currentLangMeta.label}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              fontSize: '0.8rem',
              background: voiceEnabled ? '#ecfdf5' : '#f1f5f9',
              color: voiceEnabled ? '#047857' : '#64748b',
              border: `1px solid ${voiceEnabled ? '#a7f3d0' : '#cbd5e1'}`,
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {voiceEnabled ? '🔊 Audio Guide ON' : '🔇 Audio Guide OFF'}
          </button>
          <button
            type="button"
            onClick={() => setUserAiConsent(!hasConsent)}
            style={{
              fontSize: '0.78rem',
              background: hasConsent ? '#f0fdf4' : '#fef3c7',
              color: hasConsent ? '#15803d' : '#92400e',
              padding: '5px 10px',
              borderRadius: '8px',
              fontWeight: 700,
              border: `1px solid ${hasConsent ? '#bbf7d0' : '#fde68a'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title={hasConsent ? 'Click to switch to Eco Mode' : 'Click to enable local Gemini Nano AI'}
          >
            <span>{hasConsent ? '🧠 Smart Tutor Ready' : '⚡ Enable Gemini Nano'}</span>
          </button>
        </div>
      </div>

      {/* Just-In-Time In-Context Consent Banner when Nano is OFF (California CAADCA & India DPDP Act compliant) */}
      {!hasConsent && (() => {
        const caveat = getComplianceCaveat(currentLang);
        return (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🛡️</span> {caveat.badgeTitle}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '2px', lineHeight: 1.4 }}>
                {caveat.badgeSubtitle}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span>• {caveat.californiaNotice}</span>
                <span>• {caveat.indiaNotice}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setUserAiConsent(true)}
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(217,119,6,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {caveat.activateBtn}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Chat Messages Container */}
      <div
        style={{
          minHeight: '90px',
          maxHeight: '220px',
          overflowY: 'auto',
          marginBottom: '1rem',
          padding: '0.85rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '0.92rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              background: m.role === 'turing' ? '#eff6ff' : '#ffffff',
              border: `1px solid ${m.role === 'turing' ? '#bfdbfe' : '#e2e8f0'}`,
              color: m.role === 'turing' ? '#1e3a8a' : '#0f172a',
              lineHeight: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <div style={{ flex: 1 }}>
              <strong style={{ color: m.role === 'turing' ? '#1d4ed8' : '#475569' }}>
                {m.role === 'turing' ? '🎓 Prof. Turing: ' : '🎒 Pupil: '}
              </strong>
              {m.text}
            </div>
            {m.role === 'turing' && m.text && (
              <button
                type="button"
                onClick={() => speakInLanguage(m.text, currentLang)}
                title="Listen to message"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '2px 4px',
                }}
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {loading && <div style={{ color: '#64748b', fontStyle: 'italic', padding: '4px' }}>Prof. Turing is thinking...</div>}
        <div ref={terminalEndRef} />
      </div>

      {/* 3-Tier Scaffolding Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(1)}
          style={{
            background: '#ffffff',
            color: '#1e40af',
            border: '1.5px solid #bfdbfe',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.82rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          💡 Nudge Me
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(2)}
          style={{
            background: '#ffffff',
            color: '#1e40af',
            border: '1.5px solid #bfdbfe',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.82rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          🔍 Remind Me of the Rule
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(3)}
          style={{
            background: '#ffffff',
            color: '#1e40af',
            border: '1.5px solid #bfdbfe',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.82rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          🧩 Break Down Step 1
        </button>
      </div>

      {/* Lesson Launcher Banner */}
      {suggestedLesson && (
        <div
          style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.82rem', color: '#0369a1' }}>
            Recommended Lesson: <strong>{suggestedLesson.title}</strong>
          </span>
          <button
            type="button"
            onClick={handleLaunchSuggestedLesson}
            disabled={launchingLesson}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              cursor: launchingLesson ? 'wait' : 'pointer',
              fontWeight: 700,
            }}
          >
            {launchingLesson ? 'Loading...' : 'Go to Lesson ➔'}
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Prof. Turing a question or explain what you think..."
          style={{
            flex: 1,
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
          }}
        >
          Ask Tutor
        </button>
      </form>
    </div>
  );
}

export default TuringTutor;
