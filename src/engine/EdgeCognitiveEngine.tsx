// src/engine/EdgeCognitiveEngine.tsx
import React, { useState, useRef, useEffect } from 'react';

/**
 * Resolves the active Prompt API factory across specification variants.
 */
function getLanguageModelFactory(): any {
  if (typeof (window as any).LanguageModel !== 'undefined') {
    return (window as any).LanguageModel;
  }
  if (typeof (self as any).LanguageModel !== 'undefined') {
    return (self as any).LanguageModel;
  }
  const aiHost = (window as any).ai || (self as any).ai;
  return aiHost?.languageModel || null;
}

/**
 * Executes on-device LLM inference using Chrome's Prompt API (Gemini Nano)
 * with strict sampling control, language attestations, 6s race timeout, and fallback.
 */
export async function runLocalInference(prompt: string, systemPrompt?: string): Promise<string> {
  const fallbackAST = `(:route "quiz:mcq" :scratchpad "Atoms consist of protons and neutrons in the central nucleus, with electrons orbiting in outer shells." :prompt "Which subatomic particles are located inside the nucleus of an atom?" :options (list "Protons and Neutrons" "Electrons and Neutrons" "Electrons only" "Protons and Electrons") :answer-key 0)`;

  const targetFactory = getLanguageModelFactory();

  if (!targetFactory) {
    console.warn('[AI Engine] Prompt API unavailable, using deterministic fallback.');
    return fallbackAST;
  }

  const inferencePromise = (async () => {
    let session: any = null;
    try {
      if (typeof targetFactory.availability === 'function') {
        const status = await targetFactory.availability();
        if (status === 'no' || status === 'unavailable') return fallbackAST;
      } else if (typeof targetFactory.capabilities === 'function') {
        const caps = await targetFactory.capabilities();
        if (caps?.available === 'no') return fallbackAST;
      }

      const sessionOptions: Record<string, any> = {
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        temperature: 0.2,
        topK: 3,
      };

      if (systemPrompt) {
        sessionOptions.systemPrompt = systemPrompt;
      }

      session = await targetFactory.create(sessionOptions);
      const response = await session.prompt(prompt);
      return response || fallbackAST;
    } catch (err) {
      console.warn('[AI Engine Error]', err);
      return fallbackAST;
    } finally {
      if (session && typeof session.destroy === 'function') {
        try {
          session.destroy();
        } catch {}
      }
    }
  })();

  const timeoutPromise = new Promise<string>((resolve) =>
    setTimeout(() => {
      console.warn('[AI Engine] Inference timed out after 6s. Resolving fallback AST.');
      resolve(fallbackAST);
    }, 6000)
  );

  return Promise.race([inferencePromise, timeoutPromise]);
}

export default function InteractiveEdgeSandbox({ runtimeConfig }: { runtimeConfig?: any }) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ WebGPU / On-Device Runtime Initialized.',
    'Ready. Select a lesson topic or enter a query below.'
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [terminalLogs]);

  const triggerStream = async (promptText: string) => {
    setIsProcessing(true);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTerminalLogs((prev) => [
      ...prev,
      `\n> [Input]: ${promptText}`,
      '⚡ Connecting to on-device Gemini Nano...',
    ]);

    let session: any = null;
    try {
      const targetFactory = getLanguageModelFactory();

      if (targetFactory) {
        session = await targetFactory.create({
          systemPrompt: "You are a concise, Socratic tutor for primary school students. Extract one narrow rule or question to guide the student. Never give the direct answer. Maximum 20 words.",
          expectedInputs: [{ type: 'text', languages: ['en'] }],
          expectedOutputs: [{ type: 'text', languages: ['en'] }],
          temperature: 0.2,
          topK: 3
        });

        const stream = session.promptStreaming(promptText);
        let fullResponse = '';

        for await (const chunk of stream) {
          fullResponse = chunk;
          setTerminalLogs((prev) => {
            const next = [...prev];
            next[next.length - 1] = `🤖 [Nano Tutor]: ${fullResponse}`;
            return next;
          });
        }
      } else {
        await new Promise((res) => setTimeout(res, 400));
        setTerminalLogs((prev) => [
          ...prev,
          `💡 [Offline Socratic Rule]: Break the problem down into place values. What do the units add up to?`,
        ]);
      }
    } catch (err: any) {
      console.warn('[Nano Inference Error]', err);
      setTerminalLogs((prev) => [
        ...prev,
        `⚠️ [Fallback Tutor]: Let's look at the first step together. Try breaking down the core concepts first.`,
      ]);
    } finally {
      if (session && typeof session.destroy === 'function') {
        try {
          session.destroy();
        } catch {}
      }
      setIsProcessing(false);
    }
  };

  const handlePreset = (topic: string) => {
    triggerStream(`Explore concept: ${topic}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    triggerStream(inputQuery);
    setInputQuery('');
  };

  return (
    <div
      ref={containerRef}
      style={{ marginTop: '1.5rem', background: '#0f172a', borderRadius: '12px', padding: '1.5rem', color: '#fff' }}
    >
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => handlePreset('Photosynthesis & Light Reactions')}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          🌱 Biology: Photosynthesis
        </button>
        <button
          type="button"
          onClick={() => handlePreset("Newton's Laws of Motion")}
          style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚡ Physics: Newton's Laws
        </button>
        <button
          type="button"
          onClick={() => handlePreset('Ionic & Covalent Chemical Bonds')}
          style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          🧪 Chemistry: Chemical Bonds
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Ask the local tutor your own question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={isProcessing}
          style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, cursor: isProcessing ? 'wait' : 'pointer' }}
        >
          {isProcessing ? 'Thinking...' : 'Submit Query 🚀'}
        </button>
      </form>

      <div
        style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '140px',
          maxHeight: '240px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: '#38bdf8'
        }}
      >
        {terminalLogs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>{log}</div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}