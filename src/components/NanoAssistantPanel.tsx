import React, { useState, useEffect, useRef } from 'react';

interface NanoAssistantProps {
  contextTopic?: string;
  currentQuestion?: string;
  onHintReceived?: (hint: string) => void;
}

export default function NanoAssistantPanel({ contextTopic, currentQuestion }: NanoAssistantProps) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Prof. Turing', text: 'I am here to guide your steps! Ask me if you get stuck.' }
  ]);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const voiceEnabledRef = useRef(voiceEnabled);
  voiceEnabledRef.current = voiceEnabled;

  const busRef = useRef<BroadcastChannel | null>(null);
  const isQueryingRef = useRef(false);

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    bus.onmessage = (e) => {
      if (e.data.type === 'tutor_response') {
        isQueryingRef.current = false;
        const reply = e.data.text;
        setMessages((prev) => [...prev, { sender: 'Prof. Turing', text: reply }]);
        
        if (voiceEnabledRef.current && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Stop any pending speech
          const utterance = new SpeechSynthesisUtterance(reply);
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    return () => {
      bus.close();
    };
  }, []);

  const handleAsk = () => {
    if (!input.trim() || isQueryingRef.current) return;
    
    const userMsg = input.trim();
    isQueryingRef.current = true;
    setMessages((prev) => [...prev, { sender: 'Pupil', text: userMsg }]);
    setInput('');

    busRef.current?.postMessage({
      type: 'tutor_query',
      prompt: userMsg,
      topic: contextTopic || 'General',
      questionContext: currentQuestion || ''
    });
  };

  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '1.25rem',
      marginTop: '1.5rem',
      color: '#f8fafc'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f59e0b' }}>
          🤖 Prof. Turing [Gemini Nano]
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              background: voiceEnabled ? '#065f46' : '#334155',
              color: '#ffffff',
              fontSize: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.6rem',
              cursor: 'pointer'
            }}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>
          <span style={{ background: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            100% Client-Side
          </span>
        </div>
      </div>

      <div style={{
        background: '#020617',
        border: '1px solid #0f172a',
        borderRadius: '8px',
        padding: '0.75rem',
        minHeight: '80px',
        maxHeight: '160px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.88rem',
        marginBottom: '0.75rem'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ color: m.sender === 'Prof. Turing' ? '#4ade80' : '#38bdf8', marginBottom: '4px' }}>
            <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a question or explain your reasoning..."
          style={{
            flex: 1,
            background: '#020617',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f8fafc',
            padding: '0.5rem 0.75rem',
            fontSize: '0.88rem'
          }}
        />
        <button
          onClick={handleAsk}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}