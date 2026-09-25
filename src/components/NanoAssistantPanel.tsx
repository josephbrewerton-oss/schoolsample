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
import {
  validateStudentInput,
  sanitizeAiOutput,
  CHILD_SAFEGUARDING_SYSTEM_PROMPT,
} from '../services/childSafetyFilter';
import { generateOfflineSocraticAnswer } from '../engine/socraticOfflineBrain';
import { ASTFlowGovernor } from '../engine/astGovernor';

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
        ? `Hello! I'm Professor Turing, your friendly learning buddy. In ${topicKnowledge.title}: ${topicKnowledge.socraticPivot}`
        : `Hello! I'm Professor Turing, your friendly learning buddy. What fun questions do you have about ${currentTopic}?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedLesson, setSuggestedLesson] = useState<RetrievedLesson | null>(null);
  const [launchingLesson, setLaunchingLesson] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasConsent, setHasConsent] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

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
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Reset conversation session when the topic or language changes
  useEffect(() => {
    let cancelled = false;
    const knowledge = findCurriculumKnowledge(keyStage, subject, currentTopic);
    const baseGreeting = knowledge
      ? `Hello! I'm Professor Turing, your friendly learning buddy. In ${knowledge.title}: ${knowledge.socraticPivot}`
      : `Hello! I'm Professor Turing, your friendly learning buddy. What fun questions do you have about ${currentTopic}?`;

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

  // Scroll chat container without triggering full document reflow or smooth scroll layout thrashing
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const rAF = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
    return () => cancelAnimationFrame(rAF);
  }, [messages, loading]);

  const buildSystemPrompt = (mathGuidance?: string) => {
    const langMeta = SUPPORTED_LANGUAGES[currentLang];
    const langInstruction =
      currentLang !== 'en' && langMeta
        ? `\nCRITICAL LANGUAGE REQUIREMENT: You MUST formulate your entire response in ${langMeta.label} (${langMeta.nativeLabel}). ${langMeta.promptCondition}.`
        : '';

    const stageGuide = keyStage.includes('1')
      ? 'Speak to a 6-year-old child: warm, friendly, simple everyday words, short sentences, and praise.'
      : keyStage.includes('2')
      ? 'Speak to a 9-year-old: enthusiastic, clear explanations, relatable real-world analogies, and friendly guidance.'
      : keyStage.includes('3')
      ? 'Speak to a 13-year-old: supportive, clear scientific/mathematical reasoning, concise conceptual breakdowns.'
      : 'Speak to a 15-year-old GCSE student: academically rigorous, precise exam terminology, clear step-by-step logic.';

    const isMathOrSci =
      subject.toLowerCase().includes('math') ||
      subject.toLowerCase().includes('arithmetic') ||
      subject.toLowerCase().includes('algebra') ||
      subject.toLowerCase().includes('science') ||
      Boolean(mathGuidance);

    const astMathGuidelines = isMathOrSci
      ? `\n;; AST MATHEMATICAL & CHECKUP GUIDELINES (:node "math:checkup")
1. ZERO_HALLUCINATION: Never fabricate arithmetic numbers or mathematical answers.
2. BIDMAS: Calculate strictly according to the order of operations.
3. FRACTIONS: Common denominators before adding/subtracting numerators; never add denominators (1/2 + 1/4 = 3/4).
4. PERCENTAGES: x% of Y = (x/100) * Y. Partition into 10% and 5% steps for clarity.
5. ALGEBRA: Apply inverse operations to isolate the variable.
6. UNITS: 1km=1000m, 1m=100cm, 1cm=10mm, 1kg=1000g, 1L=1000ml, £1=100p.
${mathGuidance ? `\n[VERIFIED AST GROUND TRUTH FOR THIS QUERY]:\n${mathGuidance}\nRULE: Adhere strictly to this verified result. Never invent a different number.` : ''}`
      : '';

    return `You are "Professor Turing" (Super Teacher Nano) — an inspiring, supportive UK National Curriculum teacher for ${keyStage} ${subject}.
Target Topic: ${currentTopic}
${topicKnowledge ? `\nCURRICULUM GROUND TRUTH:
- Core Axiom/Rule: "${topicKnowledge.coreAxiom}"
- Common Student Misconception: "${topicKnowledge.cognitiveTrap}"
- Helpful Analogy: "${topicKnowledge.scaffoldHints.level1}"
- Key Step: "${topicKnowledge.guidedStep}"` : ''}
${langInstruction}
${astMathGuidelines}

${CHILD_SAFEGUARDING_SYSTEM_PROMPT}

PEDAGOGICAL GOALS:
1. Tone: Warm, encouraging, patient, and age-appropriate (${stageGuide}).
2. When the student asks a question or asks for help:
   - Validate their curiosity with genuine encouragement.
   - Explain the core concept simply and clearly (in 2-3 sentences), using a vivid analogy or real-world comparison.
   - Address any common pitfall or misconception so they don't get tripped up.
   - Do NOT just dump the final answer if they are working on a quiz question; instead, guide their thinking with a clear mini-step or friendly check question to test their understanding.
3. Keep the response focused, readable, and under 90 words so the student is never overwhelmed.`;
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

  const getSocraticFallback = async (queryText: string, customInstruction?: string): Promise<string> => {
    let fallback = generateOfflineSocraticAnswer({
      query: queryText,
      topicKnowledge,
      keyStage,
      subject,
      currentTopic,
      customInstruction,
      activePrompt,
      recentMessages: messages,
    });

    if (currentLang && currentLang !== 'en') {
      try {
        fallback = await translateText(fallback, currentLang);
      } catch {
        // Keep english fallback
      }
    }
    return fallback;
  };

  const dispatchNanoInference = async (userText: string, customInstruction?: string) => {
    if (loading) return;
    setLoading(true);
    setSuggestedLesson(null);

    const updatedMessages = [...messages, { role: 'pupil' as const, text: userText }];
    setMessages([...updatedMessages, { role: 'turing' as const, text: '' }]);

    // 1. Mandatory Child Safeguarding Check on student input
    const safetyCheck = validateStudentInput(userText);
    if (!safetyCheck.isSafe) {
      const safeReply = safetyCheck.safeReplacementText || 'Let us keep our learning safe, kind, and focused on school topics.';
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'turing', text: safeReply };
        return copy;
      });
      speak(safeReply);
      setLoading(false);
      return;
    }

    if (!aiCaller.isPromptApiAvailableSync()) {
      const fallback = await getSocraticFallback(userText, customInstruction);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'turing', text: fallback };
        return copy;
      });
      speak(fallback);
      setLoading(false);
      return;
    }

    try {
      // Package recent conversation context into the prompt
      const conversationHistory = updatedMessages
        .slice(-4)
        .map((m) => `${m.role === 'pupil' ? 'Pupil' : 'Teacher'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `Topic Context: ${currentTopic} (${keyStage} ${subject})\n${
        activePrompt ? `Focus Question: "${activePrompt}"\n` : ''
      }${conversationHistory}\n${customInstruction ? `Instruction: ${customInstruction}\n` : ''}Teacher Socratic Response:`;

      // Deterministic AST Math Checkup Evaluation (Zero Hallucination Guard)
      const mathEval = ASTFlowGovernor.evaluateMathCheckup(userText, activePrompt);
      let mathGuidanceStr: string | undefined = undefined;
      if (mathEval && mathEval.isMath) {
        mathGuidanceStr = `Exact Mathematical Result: ${mathEval.groundTruth}\nVerified Calculation Steps:\n${mathEval.steps.join('\n')}\nStudent Answer Status: ${
          mathEval.isStudentCorrect === true
            ? 'CORRECT. Validate and praise their accurate reasoning.'
            : mathEval.isStudentCorrect === false
            ? 'INCORRECT. The student slipped up. Guide them to check step 1 without giving away the answer.'
            : 'Inquiry calculation. Guide them using the verified calculation steps above.'
        }`;
      }

      const rawResponse = await aiCaller.promptText({
        prompt: fullPrompt,
        systemPrompt: buildSystemPrompt(mathGuidanceStr),
        preserveContext: false, // Prevents Chrome session port collisions
        timeoutMs: 15000,
      });

      let cleaned =
        cleanResponse(rawResponse) ||
        `What do you think is the first key factor we need to consider in ${currentTopic}?`;

      // 2. Mandatory Child Safeguarding Sanitization on output
      cleaned = sanitizeAiOutput(cleaned, currentTopic);

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
    } catch {
      const fallback = await getSocraticFallback(userText, customInstruction);
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

  const handleScaffoldHint = (level: 1 | 2 | 3 | 4) => {
    if (level === 1) {
      dispatchNanoInference(
        'Can I have a small nudge?',
        'Give a gentle real-world analogy to orient the student without using formula jargon.'
      );
    } else if (level === 2) {
      dispatchNanoInference(
        'Can you explain this in plain English?',
        'Explain the core concept in friendly, simple everyday language with clear definitions.'
      );
    } else if (level === 3) {
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowSafetyModal(true)}
            style={{
              fontSize: '0.8rem',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title="View child safety, privacy, and safeguarding protections"
          >
            <span>🛡️ Child-Safe Guard Active</span>
          </button>
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
            title={hasConsent ? 'Click to switch to Eco Mode' : 'Click to enable on-device neural AI'}
          >
            <span>{hasConsent ? (aiCaller.hasNativePromptApi() ? '🧠 Gemini Nano Ready' : '⚡ WebLLM WebGPU Ready') : '⚡ Enable On-Device AI'}</span>
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
        ref={chatContainerRef}
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
            <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
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
      </div>

      {/* 4-Tier Scaffolding Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
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
          🌟 Explain Simply
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
          🔍 Remind Me of the Rule
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(4)}
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

      {/* Quick Prompt Suggestions */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => dispatchNanoInference(`What is the most important idea in ${currentTopic}?`)}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 10px', color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          🌟 What is this topic about?
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => dispatchNanoInference(`Can you give me a real-world example of ${currentTopic}?`)}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 10px', color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          🌱 Give me an everyday example
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => dispatchNanoInference(`What is a common mistake students make in ${currentTopic}?`)}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 10px', color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          ⚠️ What trap should I avoid?
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => dispatchNanoInference(`How do I solve problems in ${currentTopic}?`)}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 10px', color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          🧩 How do I solve step 1?
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

      {/* Child Safeguarding & Safety Protections Modal */}
      {showSafetyModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setShowSafetyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Child Safety & Safeguarding Guarantee
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              St Joseph&apos;s Curriculum Portal is designed from the ground up as a completely safe, protected learning sanctuary for children and young people (ages 5 to 16).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>100% On-Device & Zero Cloud Data Leakage</strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    No student answers, microphone audio, or chats are ever sent to remote AI cloud servers or stored externally. Everything runs locally in the browser.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.25rem' }}>🚫</span>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Automated On-Device Content Filtering</strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Strict filters block profanity, violence, weapons, adult material, personal data sharing, and inappropriate topics before any AI prompt is processed or displayed.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.25rem' }}>📚</span>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Curriculum-Bound Pedagogical Guardrails</strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    The tutor is strictly locked to UK National Curriculum topics and Socratic pedagogical hints. It will never engage in roleplay or off-curriculum discussions.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.25rem' }}>👥</span>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Zero Stranger Interaction</strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    There are no open public chatrooms, direct messaging features, or external forums. Children cannot be contacted by strangers.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', background: '#eff6ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '1.25rem' }}>🕊️</span>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#1e40af', display: 'block' }}>Safeguarding & Crisis Support</strong>
                  <span style={{ fontSize: '0.82rem', color: '#1e3a8a' }}>
                    If a student ever indicates distress or feeling unsafe, the system provides immediate, compassionate advice to speak with a trusted adult or call <strong>Childline on 0800 1111</strong> (free & confidential UK helpline).
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TuringTutor;
