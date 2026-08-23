import React, { useState } from 'react';

interface TuringTutorProps {
  activePrompt?: string;
  activeTopic?: string;
}

export function TuringTutor({ activePrompt = '', activeTopic = '' }: TuringTutorProps) {
  const [messages, setMessages] = useState<Array<{ role: 'turing' | 'pupil'; text: string }>>([
    { role: 'turing', text: 'I am here to guide your steps! Ask me if you get stuck.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Spec-compliant create options
      const options = {
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        systemPrompt: 'You are Prof. Turing, a helpful UK school maths tutor. Give a concise hint under 20 words. Never state the final numerical answer directly.'
      };

      try {
        session = await targetFactory.create(options);
      } catch {
        session = await targetFactory.create();
      }

      const promptContext = `Pupil asked: "${query}". Context topic: ${activeTopic || 'Maths'}, question: "${activePrompt || ''}". Hint:`;

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

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'turing', text: accumulated.trimStart() };
            return updated;
          });
        }
      } else {
        const reply = await session.prompt(promptContext);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'turing', text: reply.trim() };
          return updated;
        });
      }
    } catch (err) {
      console.error('[Turing Tutor Error]:', err);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        const fallbackText = 'Remember to line up the decimal places carefully before adding or dividing!';

        if (last && last.role === 'turing' && !last.text) {
          updated[updated.length - 1] = { role: 'turing', text: fallbackText };
        } else {
          updated.push({ role: 'turing', text: fallbackText });
        }
        return updated;
      });
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
        fontFamily: 'monospace'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🤖 Prof. Turing [Gemini Nano]</span>
        <span style={{ fontSize: '0.75rem', background: '#065f46', color: '#34d399', padding: '2px 8px', borderRadius: '6px' }}>
          100% Client-Side
        </span>
      </div>

      <div style={{ minHeight: '60px', maxHeight: '140px', overflowY: 'auto', marginBottom: '0.75rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '4px 0', color: m.role === 'turing' ? '#4ade80' : '#38bdf8' }}>
            <strong>{m.role === 'turing' ? 'Prof. Turing: ' : 'pupil: '}</strong>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: '#94a3b8' }}>Prof. Turing is thinking...</div>}
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
            padding: '6px 12px'
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
            cursor: 'pointer'
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

export default TuringTutor;