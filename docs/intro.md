---
id: intro
title: AI Laboratory HUD
sidebar_label: 🚀 Portal Overview
sidebar_position: 1
---

<!--
Copyright (c) 2026 Joseph Brewerton
Licensed under the MIT License.
-->

import InteractiveEdgeSandbox from '@site/src/components/InteractiveEdgeSandbox';
import questions from './questions.json';

# School AI Interactive Terminal

Experience deterministic, in-browser AI tutoring powered by an isolated WebRTC loopback stream.

### Live WebRTC Telemetry HUD

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  marginBottom: '1.5rem'
}}>
  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Channel Status</div>
    <div id="webrtc-status" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#38bdf8' }}>CONNECTING...</div>
  </div>

  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>CORS Status</div>
    <div id="webrtc-cors" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#22c55e' }}>BYPASSED</div>
  </div>

  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #eab308' }}>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Transport RTT</div>
    <div id="webrtc-rtt" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#eab308' }}>0 ms</div>
  </div>

  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Frames Streamed</div>
    <div id="webrtc-packets" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ec4899' }}>0</div>
  </div>
</div>

---

### Lesson Experiments (Data-Driven)

<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
  <input type="checkbox" id="enable-voice-toggle" defaultChecked style={{ cursor: 'pointer', transform: 'scale(1.2)' }} />
  <label htmlFor="enable-voice-toggle" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
    Enable Voice Tutor Output 🔊
  </label>
</div>

<div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
  {questions.map((q) => (
    <button
      key={q.id}
      className={`button ${q.buttonClass}`}
      onClick={() => window.askSchoolAI(q.topic, q.prompt || '')}>
      {q.label}
    </button>
  ))}
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
  <input 
    id="custom-student-query"
    type="text" 
    placeholder="Ask the local tutor your own question..." 
    style={{
      flex: 1,
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #475569',
      background: '#0f172a',
      color: '#fff'
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        window.askSchoolAI('custom', e.target.value);
      }
    }}
  />
  <button 
    className="button button--success"
    onClick={() => {
      const input = document.getElementById('custom-student-query');
      if (input && input.value) window.askSchoolAI('custom', input.value);
    }}>
    Submit Query 🚀
  </button>
</div>

---

### In-Browser Peer Stream Terminal

<pre id="ai-output-box" style={{
  background: '#020617',
  color: '#4ade80',
  padding: '1.25rem',
  borderRadius: '8px',
  minHeight: '110px',
  whiteSpace: 'pre-wrap',
  fontSize: '1rem',
  fontFamily: 'Consolas, Monaco, monospace',
  border: '1px solid #1e293b'
}}>
Ready. Select an experiment above or type a custom prompt.
</pre>