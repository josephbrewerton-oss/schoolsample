<!--
Copyright (c) 2026 Joseph Brewerton
Licensed under the MIT License.
-->
---
id: ks2-science
title: Primary Discovery & Inquiry (Years 1 - 6)
sidebar_label: Primary Discovery & Inquiry
sidebar_position: 1
---

import InteractiveEdgeSandbox from '@site/src/components/InteractiveEdgeSandbox';

# Primary Discovery & Inquiry Lab 🌿

Explore science, numbers, storytelling, and logical thinking with your voice tutor.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', margin: '20px 0' }}>
  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Channel Status</span>
    <div id="webrtc-status" style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>READY</div>
  </div>
  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>CORS Status</span>
    <div id="webrtc-cors" style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>BYPASSED</div>
  </div>
  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Transport RTT</span>
    <div id="webrtc-rtt" style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b' }}>0 ms</div>
  </div>
  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}>
    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Frames Streamed</span>
    <div id="webrtc-packets" style={{ fontSize: '13px', fontWeight: 'bold', color: '#ec4899' }}>0</div>
  </div>
</div>

<div style={{ margin: '15px 0' }}>
  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
    <input type="checkbox" id="enable-voice-toggle" defaultChecked style={{ marginRight: '8px', transform: 'scale(1.2)' }} />
    Enable Voice Tutor Output 🔊
  </label>
</div>

<InteractiveEdgeSandbox />

### 1. Foundations (STEM & Maths)
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('fractions', 'Explain what a fraction is using a pizza slice example for primary pupils.', false)} style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🍕 Pizza Fractions</button>
  <button onClick={() => window.askSchoolAI('timetables', 'Give a fun mental trick for learning the 9 times table for KS2 maths.', false)} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔢 9x Table Trick</button>
  <button onClick={() => window.askSchoolAI('habitats', 'Explain what an animal habitat is in simple words for young children.', false)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🦁 Living Habitats</button>
</div>

### 2. Inquiry & Critical Thinking
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('robot-instructions', 'You are a robot that takes instructions too literally. Explain why saying "make a sandwich" fails without exact step-by-step logic.', false)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🤖 Precise Instructions (Logic)</button>
  <button onClick={() => window.askSchoolAI('spot-error', 'State three animal facts, but make one obviously silly and wrong. Ask the pupil to guess the fake one!', false)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔍 Spot the Fake Fact</button>
</div>

### 3. Applied Creativity
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('story-builder', 'Start a mysterious 2-sentence adventure story about a hidden door in a school library, then ask the pupil: "What do you do next?"', false)} style={{ background: '#14b8a6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📖 Co-Op Story Adventure</button>
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
  <input type="text" id="custom-prompt-input" placeholder="Ask your own question or give an instruction..." style={{ flexGrow: 1, padding: '12px 14px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc' }} />
  <button onClick={() => { const input = document.getElementById('custom-prompt-input'); if(input && input.value) window.askSchoolAI('custom', input.value, true); }} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Ask 🚀</button>
</div>

### In-Browser Peer Stream Terminal
<div id="ai-output-box" style={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', minHeight: '110px', fontFamily: 'monospace', color: '#4ade80', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
  Ready. Select a module above.
</div>