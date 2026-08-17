<!--
Copyright (c) 2026 Joseph Brewerton
Licensed under the MIT License.
-->
---
id: alevel-advanced
title: Sixth Form Higher Analysis & Ethics (Years 12 - 14)
sidebar_label: Higher Analysis & Ethics
sidebar_position: 1
---

# Sixth Form Advanced Synthesis & Ethical Reasoning 🔬

High-capacity local inference for A-Level analysis, ethical case studies, and first-principles decomposition.

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

### 1. Higher STEM & Maths
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('calculus', 'Explain integration by parts formula integral u dv = uv - integral v du and evaluate integral x*e^x dx step-by-step for A-Level Maths.')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>∫ Integration by Parts</button>
  <button onClick={() => window.askSchoolAI('thermodynamics', 'Derive the relationship between enthalpy, entropy, and Gibbs Free Energy (ΔG = ΔH - TΔS) and explain how temperature governs reaction spontaneity.')} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔥 Gibbs Free Energy</button>
  <button onClick={() => window.askSchoolAI('neural-nets', 'Explain the chain rule mechanism in stochastic gradient descent and backpropagation for deep neural networks.')} style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🧠 Neural Backpropagation</button>
</div>

### 2. Critical Ethics & Systems Thinking
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('bioethics', 'Present an ethical dilemma regarding CRISPR gene editing in germline cells: weigh individual therapy against societal genetic divergence. Ask the student for their verdict.')} style={{ background: '#9333ea', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🧬 CRISPR Bioethics Dilemma</button>
  <button onClick={() => window.askSchoolAI('first-principles', 'Deconstruct an urban power blackout problem into first-principles: power generation, grid transmission, storage buffer, and load balancing.')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⚙️ First-Principles Decomposition</button>
  <button onClick={() => window.askSchoolAI('fallacy-check', 'Present a philosophical argument containing the "affirming the consequent" logical fallacy and challenge the student to isolate the structural flaw.')} style={{ background: '#ea580c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⚖️ Logical Fallacy Cross-Exam</button>
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
  <input type="text" id="custom-prompt-input" placeholder="Enter an analytical thesis or proof to stress-test..." style={{ flexGrow: 1, padding: '12px 14px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc' }} />
  <button onClick={() => { const input = document.getElementById('custom-prompt-input'); if(input && input.value) window.askSchoolAI('custom', input.value); }} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Evaluate 🚀</button>
</div>

### In-Browser Peer Stream Terminal
<div id="ai-output-box" style={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', minHeight: '110px', fontFamily: 'monospace', color: '#4ade80', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
  Ready. Select a module or thesis above.
</div>
