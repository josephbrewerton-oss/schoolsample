// src/components/TuringTutor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ComponentsFlow } from './componentsflow';
import { dispatchAstIntent, CurriculumPackage } from '../curriculum';

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

  const [messages, setMessages] = useState<Array<{ role: 'turing' | 'pupil'; text: string }>>([
    {
      role: 'turing',
      text: `Hello! I'm Super Teacher Nano. What are you exploring in ${currentTopic}?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedLesson, setSuggestedLesson] = useState<RetrievedLesson | null>(null);
  const [launchingLesson, setLaunchingLesson] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const voiceEnabledRef = useRef(voiceEnabled);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const ukVoice =
          voices.find(
            (v) =>
              v.lang === 'en-GB' ||
              v.name.toLowerCase().includes('united kingdom') ||
              v.name.toLowerCase().includes('british')
          ) || voices[0];
        voiceRef.current = ukVoice || null;
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const buildSystemPrompt = () => `You are "Super Teacher Nano" — an elite UK National Curriculum Socratic educator.
Subject Context: ${subject} | Stage: ${keyStage} | Topic: ${currentTopic}

PEDAGOGICAL RULES:
1. NEVER reveal the direct final answer.
2. If the student is stuck: Break the question down into ONE simpler micro-step (Scaffolding).
3. If the student makes an error: Identify the root misconception and ask a gentle counter-factual question to help them self-correct.
4. Keep all spoken responses under 25 words to optimize audio synthesis.
5. Conclude every turn with an engaging, bite-sized question.`;

  const speak = (text: string) => {
    if (!voiceEnabledRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.98;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const cleanThoughtArtifacts = (raw: string): string => {
    return raw
      .replace(/^[\s\S]*?\*\*Response:\*\*/i, '')
      .replace(/^[\s\S]*?(?:Okay,?\s+here['’]?s\s+(?:a\s+)?socratic\s+hint[^:]*:\s*|Here(?:'s|\s+is)\s+a\s+hint:?)/i, '')
      .replace(/\((?:Since|Based on|If they|Note).*?\)/gi, '')
      .replace(/\*\*.*?\*\*/g, '')
      .replace(/^"(.*)"$/, '$1')
      .replace(/^(?:Hint|Tutor Hint|Super Teacher Nano|Prof\. Turing):\s*/i, '')
      .trim();
  };

  const handleLaunchSuggestedLesson = async () => {
    if (!suggestedLesson) return;
    setLaunchingLesson(true);
    try {
      const fullAST = await ComponentsFlow.loadLessonAST(
        suggestedLesson.id,
        suggestedLesson.manifestPath
      );
      if (onLaunchLesson) {
        onLaunchLesson(fullAST);
      } else {
        const channel = new BroadcastChannel('neural_hypervisor_bus');
        channel.postMessage({ type: 'LOAD_AST_MANIFEST', manifest: fullAST });
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
    setMessages((prev) => [...prev, { role: 'pupil', text: userText }]);
    setLoading(true);
    setSuggestedLesson(null);

    try {
      // 1. Resolve live curriculum grounding via AST Substrate Intent
      let stageManifestContext = '';
      try {
        const normalizedStage = keyStage.toLowerCase().replace(/\s+/g, '');
        const pkg = dispatchAstIntent<CurriculumPackage>('getActiveCurriculum', normalizedStage);
        if (pkg?.catalogueStage) {
          const adapted = dispatchAstIntent('adaptOakStage', pkg.catalogueStage);
          if (adapted) {
            stageManifestContext = `\n[Mined Framework: ${pkg.framework}]`;
          }
        }
      } catch (e) {
        console.warn('[AST Tutor Context Grounding Skip]:', e);
      }

      // 2. Query contextual embeddings
      const ragResult = await ComponentsFlow.getGroundedContext(currentTopic, userText);
      if (ragResult.match) {
        setSuggestedLesson({
          id: ragResult.match.id,
          title: ragResult.match.title,
          manifestPath: ragResult.match.manifestPath,
        });
      }

      const promptContext = `Topic: ${currentTopic} (${keyStage} ${subject})${stageManifestContext}${ragResult.context}\n${
        activePrompt ? `Active Check: "${activePrompt}"\n` : ''
      }${customInstruction ? `Instruction: ${customInstruction}\n` : ''}Pupil Query: "${userText}"\nRespond as Super Teacher Nano:`;

      setMessages((prev) => [...prev, { role: 'turing', text: '' }]);
      setLoading(false);

      const stream = ComponentsFlow.streamPrompt(promptContext, {
        systemPrompt: buildSystemPrompt(),
      });

      let accumulated = '';
      for await (const chunk of stream) {
        accumulated = chunk;
        const cleaned = cleanThoughtArtifacts(accumulated);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'turing',
            text: cleaned || 'Formulating Socratic guidance...',
          };
          return updated;
        });
      }

      const finalClean = cleanThoughtArtifacts(accumulated) || 'What is the first rule we apply here?';
      speak(finalClean);
    } catch (err) {
      console.error('[Super Teacher Error]:', err);
      const fallbackText = 'Let us break this problem down into its first simple step. What do we know so far?';
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'turing' && !last.text) {
          updated[updated.length - 1] = { role: 'turing', text: fallbackText };
        } else {
          updated.push({ role: 'turing', text: fallbackText });
        }
        return updated;
      });
      speak(fallbackText);
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

  // 3-Tier Scaffolding Handlers
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

  return (
    <div
      style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '1.25rem',
        marginTop: '1.5rem',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>⚡</span>
          <span style={{ fontWeight: 700, color: '#38bdf8', letterSpacing: '0.02em' }}>
            Super Teacher Nano <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>[{keyStage} • {subject}]</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              fontSize: '0.75rem',
              background: voiceEnabled ? '#059669' : '#334155',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>
          <span style={{ fontSize: '0.75rem', background: '#064e3b', color: '#34d399', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
            100% On-Device
          </span>
        </div>
      </div>

      {/* Terminal Chat Body */}
      <div
        style={{
          minHeight: '80px',
          maxHeight: '160px',
          overflowY: 'auto',
          marginBottom: '0.75rem',
          padding: '0.5rem',
          background: '#030712',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0', color: m.role === 'turing' ? '#4ade80' : '#38bdf8', lineHeight: 1.4 }}>
            <strong>{m.role === 'turing' ? 'Super Teacher Nano: ' : 'pupil: '}</strong>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: '#94a3b8' }}>Super Teacher Nano is diagnosing and thinking...</div>}
        <div ref={terminalEndRef} />
      </div>

      {/* 3-Tier Scaffolding Hint Ladder */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(1)}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          💡 Level 1: Nudge
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(2)}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          🔍 Level 2: Clue
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleScaffoldHint(3)}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          🧩 Level 3: Step Breakdown
        </button>
      </div>

      {/* Grounded Manifest Match */}
      {suggestedLesson && (
        <div
          style={{
            background: '#0f172a',
            border: '1px dashed #38bdf8',
            borderRadius: '6px',
            padding: '6px 10px',
            marginBottom: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Matched Unit: <strong style={{ color: '#e2e8f0' }}>{suggestedLesson.title}</strong>
          </span>
          <button
            type="button"
            onClick={handleLaunchSuggestedLesson}
            disabled={launchingLesson}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.75rem',
              cursor: launchingLesson ? 'wait' : 'pointer',
              fontWeight: 600,
            }}
          >
            {launchingLesson ? 'Loading...' : 'Launch Interactive Practice ⚡'}
          </button>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question, describe your steps, or request advice..."
          style={{
            flex: 1,
            background: '#020617',
            border: '1px solid #334155',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.85rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 18px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1,
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

export default TuringTutor;