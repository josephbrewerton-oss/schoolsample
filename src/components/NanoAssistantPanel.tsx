// src/components/TuringTutor.tsx
import React, { useState, useEffect, useRef } from 'react';

interface TuringTutorProps {
  activePrompt?: string;
  activeTopic?: string;
  contextTopic?: string;
}

export function TuringTutor({
  activePrompt = '',
  activeTopic = '',
  contextTopic = '',
}: TuringTutorProps) {
  const currentTopic = activeTopic || contextTopic || 'General Studies';

  const [messages, setMessages] = useState<Array<{ role: 'turing' | 'pupil'; text: string }>>([
    { role: 'turing', text: 'I am here to guide your steps! Ask me if you get stuck.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const voiceEnabledRef = useRef(voiceEnabled);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // UK English Voice
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

  // Persistent BroadcastChannel listener
  useEffect(() => {
    const channel = new BroadcastChannel('neural_hypervisor_bus');

    channel.onmessage = (event) => {
      if (event.data?.type === 'TURING_FEEDBACK' && event.data.message) {
        const cleaned = cleanThoughtArtifacts(event.data.message);
        setMessages((prev) => [...prev, { role: 'turing', text: cleaned }]);
        speak(cleaned);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { role: 'pupil', text: query }]);
    setInput('');
    setLoading(true);

    let session: any = null;
    try {
      const aiHost = (window as any).ai || (self as any).ai || (window.parent as any)?.ai;
      const GlobalLM = (window as any).LanguageModel || (window.parent as any)?.LanguageModel;
      const targetFactory = aiHost?.languageModel || GlobalLM;

      if (!targetFactory) {
        throw new Error('Prompt API not detected');
      }

      const options = {
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        systemPrompt:
          'You are Prof. Turing, an encouraging UK secondary school science and maths tutor. Never output planning thoughts, meta tags, or greeting fluff. Respond with a single concise Socratic hint under 25 words that guides the student without giving away the direct answer.',
      };

      try {
        session = await targetFactory.create(options);
      } catch {
        session = await targetFactory.create();
      }

      const promptContext = `Topic: "${currentTopic}". Context Stem: "${activePrompt || 'Assessment Practice'}". Student Query: "${query}". Provide a 1-sentence Socratic hint:`;

      setMessages((prev) => [...prev, { role: 'turing', text: '' }]);
      setLoading(false);

      let accumulated = '';

      if (typeof session.promptStreaming === 'function') {
        const stream = session.promptStreaming(promptContext);
        for await (const chunk of stream) {
          if (chunk.startsWith(accumulated)) {
            accumulated = chunk;
          } else {
            accumulated += chunk;
          }

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
      } else {
        const reply = await session.prompt(promptContext);
        const finalClean = cleanThoughtArtifacts(reply) || 'Think about the core rule for this topic!';
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'turing', text: finalClean };
          return updated;
        });
        speak(finalClean);
      }
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
      if (session && typeof session.destroy === 'function') {
        try {
          session.destroy();
        } catch {}
      }
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
        <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🤖 Prof. Turing [Gemini Nano]</span>
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
        {loading && <div style={{ color: '#94a3b8' }}>Prof. Turing is thinking...</div>}
        <div ref={terminalEndRef} />
      </div>

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