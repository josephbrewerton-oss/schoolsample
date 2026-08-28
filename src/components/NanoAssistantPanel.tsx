// src/components/TuringTutor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ComponentsFlow } from './componentsflow';

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
  keyStage = 'KS3',
  subject = 'Science',
  unit = 'Atomic Structure',
  onLaunchLesson,
}: TuringTutorProps) {
  const currentTopic = activeTopic || contextTopic || unit || 'General Studies';

  const [messages, setMessages] = useState<Array<{ role: 'turing' | 'pupil'; text: string }>>([
    { role: 'turing', text: 'I am here to guide your steps! Ask me if you get stuck.' },
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

  const speak = (text: string) => {
    if (!voiceEnabledRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const cleanThoughtArtifacts = (raw: string): string => {
    return raw
      .replace(/^[\s\S]*?\*\*Response:\*\*/i, '')
      .replace(/^[\s\S]*?(?:Okay,?\s+here['’]?s\s+(?:a\s+)?socratic\s+hint[^:]*:\s*|Here(?:'s|\s+is)\s+a\s+hint:?)/i, '')
      .replace(/\((?:Since|Based on|If they|Note).*?\)/gi, '')
      .replace(/\*\*.*?\*\*/g, '')
      .replace(/^"(.*)"$/, '$1')
      .replace(/^(?:Hint|Tutor Hint|Prof\. Turing):\s*/i, '')
      .trim();
  };

  // STEP 4: Fetch full lesson AST on demand via ComponentsFlow
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

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { role: 'pupil', text: query }]);
    setInput('');
    setLoading(true);
    setSuggestedLesson(null);

    try {
      // 1. In-browser RAG match via ComponentsFlow
      const ragResult = await ComponentsFlow.getGroundedContext(currentTopic, query);
      if (ragResult.match) {
        setSuggestedLesson({
          id: ragResult.match.id,
          title: ragResult.match.title,
          manifestPath: ragResult.match.manifestPath,
        });
      }

      const promptContext = `Topic: ${currentTopic} (${keyStage} ${subject})${ragResult.context}\n\nPupil Question: "${query}"\nRespond with one brief Socratic question:`;

      setMessages((prev) => [...prev, { role: 'turing', text: '' }]);
      setLoading(false);

      // 2. Stream generation via unified Prompt API generator
      const stream = ComponentsFlow.streamPrompt(promptContext, {
        systemPrompt:
          'You are Prof. Turing, a concise UK Socratic tutor. Never deliver lectures, lesson plans, summaries, or lists. Reply in ONE single question under 20 words guiding the pupil.',
      });

      let accumulated = '';
      for await (const chunk of stream) {
        accumulated = chunk;
        const cleaned = cleanThoughtArtifacts(accumulated);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'turing',
            text: cleaned || 'Examining the concept...',
          };
          return updated;
        });
      }

      const finalClean = cleanThoughtArtifacts(accumulated) || 'Think about the core rule for this topic!';
      speak(finalClean);
    } catch (err) {
      console.error('[Turing Tutor Error]:', err);
      const fallbackText = 'Break the problem down into its core components and test each condition step-by-step.';
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

  return (
    <div
      style={{
        background: '#0a0e17',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '1rem',
        marginTop: '1.5rem',
        color: '#f8fafc',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🤖 Prof. Turing [Gemini Nano + IndexedDB RAG]</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              fontSize: '0.75rem',
              background: voiceEnabled ? '#047857' : '#334155',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '2px 8px',
              cursor: 'pointer',
            }}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>
          <span style={{ fontSize: '0.75rem', background: '#065f46', color: '#34d399', padding: '2px 8px', borderRadius: '6px' }}>
            100% Client-Side
          </span>
        </div>
      </div>

      <div style={{ minHeight: '60px', maxHeight: '140px', overflowY: 'auto', marginBottom: '0.75rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '4px 0', color: m.role === 'turing' ? '#4ade80' : '#38bdf8' }}>
            <strong>{m.role === 'turing' ? 'Prof. Turing: ' : 'pupil: '}</strong>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: '#94a3b8' }}>Prof. Turing is retrieving context & thinking...</div>}
        <div ref={terminalEndRef} />
      </div>

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
            }}
          >
            {launchingLesson ? 'Loading...' : 'Launch Interactive Practice ⚡'}
          </button>
        </div>
      )}

      <form onSubmit={handleAsk} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or explain your reasoning..."
          style={{
            flex: 1,
            background: '#020617',
            border: '1px solid #334155',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '6px 12px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

export default TuringTutor;