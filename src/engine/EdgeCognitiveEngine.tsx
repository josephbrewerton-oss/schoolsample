import React, { useState, useRef, useEffect } from 'react';

export default function InteractiveEdgeSandbox({ runtimeConfig }: { runtimeConfig?: any }) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ WebGPU runtime initialized.',
    'Ready. Select a lesson topic or enter a query below.'
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Auto-scrolls the terminal output box as tokens stream in
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [terminalLogs]);

  const triggerStream = async (promptText: string) => {
    setIsProcessing(true);

    // 2. Smoothly keeps this whole interaction box visible on screen
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTerminalLogs((prev) => [
      ...prev,
      `\n> [Input]: ${promptText}`,
      '⚡ Connecting to on-device Gemini Nano...',
    ]);

    try {
      const aiObj = (window as any).ai || (window as any).LanguageModel;

      if (aiObj) {
        const session = (window as any).ai?.languageModel
          ? await (window as any).ai.languageModel.create({
              systemPrompt: "You are a concise, Socratic tutor for primary school students. Extract one narrow rule or question to guide the student. Never give the direct answer. Maximum 20 words.",
            })
          : await (window as any).LanguageModel.create({
              systemPrompt: "You are a concise, Socratic tutor for primary school students. Extract one narrow rule or question to guide the student. Never give the direct answer. Maximum 20 words.",
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
        `⚠️ [Fallback Tutor]: Let's look at the first step together. Try adding the ones column first.`,
      ]);
    } finally {
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
      {/* Quick Lesson Buttons */}
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

      {/* Query Form */}
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

      {/* Terminal Display */}
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