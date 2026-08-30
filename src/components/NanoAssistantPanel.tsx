// src/components/NanoAssistantPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { aiCaller } from '../engine/aicaller';

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

  // Reset conversation session when the topic changes
  useEffect(() => {
    setMessages([
      {
        role: 'turing',
        text: `Hello! I'm Super Teacher Nano. What are you exploring in ${currentTopic}?`,
      },
    ]);
  }, [seedKey, currentTopic]);

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

  const buildSystemPrompt = () => `You are "Super Teacher Nano" — an expert UK National Curriculum Socratic educator for ${keyStage} ${subject}.
Target Topic: ${currentTopic}

PEDAGOGICAL RULES:
1. NEVER give the direct answer.
2. Provide ONE concise hint or thought-provoking clue (under 30 words).
3. Always finish with an engaging question to help the student think through the answer.`;

  const speak = (text: string) => {
    if (!voiceEnabledRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[TTS Error]:', e);
    }
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

      const cleaned =
        cleanResponse(rawResponse) ||
        `What do you think is the first key factor we need to consider in ${currentTopic}?`;

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'turing', text: cleaned };
        return copy;
      });

      speak(cleaned);
    } catch (err) {
      console.error('[Super Teacher Error]:', err);
      const fallback = `In ${currentTopic}, what clue or idea comes to mind first?`;
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
      {/* Header */}
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

      {/* Terminal Chat Box */}
      <div
        style={{
          minHeight: '80px',
          maxHeight: '160px',
          overflowY: 'auto',
          marginBottom: '0.75rem',
          padding: '0.65rem',
          background: '#030712',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '0.9rem',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0', color: m.role === 'turing' ? '#4ade80' : '#38bdf8', lineHeight: 1.4 }}>
            <strong>{m.role === 'turing' ? 'Super Teacher Nano: ' : 'pupil: '}</strong>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Super Teacher Nano is thinking...</div>}
        <div ref={terminalEndRef} />
      </div>

      {/* 3-Tier Scaffolding Buttons */}
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

      {/* Lesson Launcher Banner */}
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

      {/* Input */}
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