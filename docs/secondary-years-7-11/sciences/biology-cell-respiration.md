---
id: biology-cell-respiration
title: GCSE Biology - Cellular Respiration & ATP
sidebar_label: 🌿 Cellular Respiration
sidebar_position: 1
---

# GCSE Biology: Cellular Respiration 🌿

Explore aerobic vs. anaerobic pathways, mitochondrial ATP synthesis, and gas exchange.

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

### Biochemical Pathways
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
  <button onClick={() => window.askSchoolAI('photosynthesis', 'Compare the chemical equation of aerobic respiration with photosynthesis.')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Aerobic vs Photosynthesis</button>
  <button onClick={() => window.askSchoolAI('photosynthesis', 'Explain why lactic acid builds up during anaerobic respiration in human muscle tissue.')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Anaerobic & Lactic Acid</button>
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
  <input type="text" id="custom-prompt-input" placeholder="Ask about cellular metabolism..." style={{ flexGrow: 1, padding: '12px 14px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc' }} />
  <button onClick={() => { const input = document.getElementById('custom-prompt-input'); if(input && input.value) window.askSchoolAI('photosynthesis', input.value); }} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Query 🚀</button>
</div>

### In-Browser Peer Stream Terminal
<div id="ai-output-box" style={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', minHeight: '110px', fontFamily: 'monospace', color: '#4ade80', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
  Ready. Select a respiration module above.
</div>
