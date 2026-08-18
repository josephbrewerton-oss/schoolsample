import React, { useState } from 'react';

export default function InteractiveEdgeSandbox({ runtimeConfig }) {
  const [terminalLogs, setTerminalLogs] = useState([
    '⚡ WebGPU runtime initialized.',
    'Ready. Select a lesson topic or enter a query below.'
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerStream = (promptText) => {
    setIsProcessing(true);
    setTerminalLogs((prev) => [...prev, `\n> [Input]: ${promptText}`, '⏳ Dispatching local AST pipeline...']);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `🤖 [Local AI Tutor]: Analyzing "${promptText}"`,
        `💡 [Guidance]: Starting Socratic inquiry loop. Observe the key variables and state your hypothesis.`
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handlePreset = (topic) => {
    triggerStream(`Explore concept: ${topic}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    triggerStream(inputQuery);
    setInputQuery('');
  };

  return (
    <div style={{ marginTop: '1.5rem', background: '#0f172a', borderRadius: '12px', padding: '1.5rem', color: '#fff' }}>
      {/* Quick Lesson Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => handlePreset('Photosynthesis & Light Reactions')}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          🌱 Biology: Photosynthesis
        </button>
        <button
          onClick={() => handlePreset("Newton's Laws of Motion")}
          style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚡ Physics: Newton's Laws
        </button>
        <button
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
      <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '1rem', minHeight: '140px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8' }}>
        {terminalLogs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>{log}</div>
        ))}
      </div>
    </div>
  );
}