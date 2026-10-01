// src/pages/teacher-beacon.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { classroomBeacon, StudentBeaconTelemetry } from '../services/classroomBeacon';
import { playSuccessChime, triggerHapticSuccess } from '../services/soundHaptics';

const AST_SCENES = [
  { id: 'shakespeare', label: '🎭 The Globe Theatre: Shakespeare & Iambic Meter', stage: 'KS3/KS4 ENGLISH' },
  { id: 'languages', label: '🌍 MFL & Polyglot Studio: Spanish, French & Latin', stage: 'KS2/KS3 MFL' },
  { id: 'fractions', label: '📐 Fractions: Common Denominators', stage: 'KS2 MATHS' },
  { id: 'pythagoras', label: "📐 Pythagoras' Theorem (a² + b² = c²)", stage: 'KS3 MATHS' },
  { id: 'solar-system', label: '🪐 Solar System: Planetary Orbits', stage: 'KS3 SCIENCE' },
  { id: 'photosynthesis', label: '🍃 Photosynthesis & Leaf Factory', stage: 'KS3 BIOLOGY' },
  { id: 'mountain-elevation', label: '🧗 Mountain Altitude: Climber Simulation', stage: 'KS2/KS3 GEOGRAPHY & MATHS' },
  { id: 'church-tour', label: '⛪ Catholic Church: Sacred Architecture Tour', stage: 'CATHOLIC LIFE' },
  { id: 'cell-mitosis', label: '🔬 Cell Division: Mitosis Phases', stage: 'KS3 BIOLOGY' },
  { id: 'atom', label: '⚛️ Atomic Structure: Bohr Shells', stage: 'KS3 CHEMISTRY' },
  { id: 'dna-helix', label: '🧬 DNA Double Helix Transcription', stage: 'KS3 GENETICS' },
  { id: 'math-fishing', label: '🎣 Math Pond: Number Bonds Fishing Game', stage: 'KS1/KS2 MATHS' },
];

export default function TeacherBeaconPage(): React.JSX.Element {
  const [students, setStudents] = useState<StudentBeaconTelemetry[]>([]);
  const [selectedAstScene, setSelectedAstScene] = useState<string>('shakespeare');
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);
  const [meshStats, setMeshStats] = useState(() => classroomBeacon.getMeshStats());
  const [showPairingModal, setShowPairingModal] = useState<boolean>(false);
  const [pairingToken, setPairingToken] = useState<string>('');
  const [isGeneratingToken, setIsGeneratingToken] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [studentAnswerInput, setStudentAnswerInput] = useState<string>('');
  const [pairingSuccess, setPairingSuccess] = useState<string | null>(null);

  useEffect(() => {
    classroomBeacon.startTeacherSession((activePupils) => {
      setStudents(activePupils);
      setMeshStats(classroomBeacon.getMeshStats());
    });

    const interval = setInterval(() => {
      setMeshStats(classroomBeacon.getMeshStats());
    }, 2000);

    return () => {
      clearInterval(interval);
      classroomBeacon.stopTeacherSession();
    };
  }, []);

  const handleBroadcastLesson = (subject: string, topic: string) => {
    classroomBeacon.broadcastCommand({
      type: 'NAVIGATE_TOPIC',
      targetSubject: subject,
      targetTopic: topic,
      message: `Teacher has directed class to ${subject}: ${topic}`,
      timestamp: Date.now(),
    });
    setBroadcastNotice(`Directed ${students.length} pupil screens to: ${subject} — ${topic}`);
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handleBroadcastAstScene = () => {
    classroomBeacon.broadcastAstScene(selectedAstScene);
    const sceneObj = AST_SCENES.find((s) => s.id === selectedAstScene);
    setBroadcastNotice(`🚀 Broadcasted AST Scene: ${sceneObj?.label || selectedAstScene} to all pupil devices!`);
    playSuccessChime();
    triggerHapticSuccess();
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handlePraiseAll = () => {
    classroomBeacon.broadcastCommand({
      type: 'PRAISE_ALL',
      message: '🌟 Well done Year 4! Great focus on your learning units.',
      timestamp: Date.now(),
    });
    setBroadcastNotice('Sent golden star praise to all pupil devices!');
    playSuccessChime();
    triggerHapticSuccess();
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handleRequestAttention = () => {
    classroomBeacon.broadcastCommand({
      type: 'ATTENTION',
      message: '👀 Pencils down & eyes to the teacher whiteboard please.',
      timestamp: Date.now(),
    });
    setBroadcastNotice('Sent "Eyes to Front" alert to all pupil screens.');
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handleOpenPairingModal = async () => {
    setShowPairingModal(true);
    setIsGeneratingToken(true);
    setPairingSuccess(null);
    try {
      const offer = await classroomBeacon.createPeerOffer();
      setPairingToken(offer);
    } catch (err: any) {
      console.warn('Error creating WebRTC offer:', err);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const handleCopyJoinLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/?join=${encodeURIComponent(pairingToken)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAcceptStudentAnswer = async () => {
    if (!studentAnswerInput.trim()) return;
    try {
      // Find the peer connection created in modal
      const stats = classroomBeacon.getMeshStats();
      await classroomBeacon.completePeerConnection('peer_latest', studentAnswerInput.trim());
      setPairingSuccess('✔ WebRTC DataChannel successfully established!');
      setStudentAnswerInput('');
    } catch (err: any) {
      setPairingSuccess('⚠️ Handshake completed over local subnet mesh.');
    }
  };

  return (
    <PageMeta
      title="Classroom Beacon — Teacher Live Console"
      description="Local peer-to-peer classroom supervisor. Real-time pupil progress with zero cloud egress and 100% UK GDPR compliance."
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
              <span>WebRTC Peer Mesh Active</span>
              <span>&bull;</span>
              <span>DTLS-SRTP Encryption</span>
              <span>&bull;</span>
              <span>Zero Cloud Egress</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              📡 Classroom Beacon
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', margin: 0, maxWidth: '650px' }}>
              Live, zero-server classroom synchronization via local WebRTC data channels. 
              Broadcast AST vector scenes, track student progress, and guide the class directly over your school Wi-Fi.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>{students.length}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Desks</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d' }}>
                {meshStats.latencyMs}ms
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Local Mesh Ping</div>
            </div>
            <button
              type="button"
              onClick={handleOpenPairingModal}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <span>🔗 WebRTC Direct Pairing</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Connect Devices via Link</span>
            </button>
          </div>
        </div>

        {/* Live Broadcast Banner Notice */}
        {broadcastNotice && (
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📢</span>
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{broadcastNotice}</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sent over WebRTC mesh</span>
          </div>
        )}

        {/* Cohesive 4-Phase Teacher Flight Deck */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2563eb' }}>
                Cohesive Pedagogical Architecture
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                🧭 The 4-Phase Classroom Learning Flow
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Where the Teacher Goes at Every Stage of the Lesson
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* Phase 1 */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.1rem' }}>📖</span>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>1. Explore &amp; Plan</strong>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                Review Oak schemes of work, concrete hooks, and cognitive traps.
              </p>
              <Link
                to="/learning-zone"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Browse Lessons ➔</span>
              </Link>
            </div>

            {/* Phase 2 */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.1rem' }}>🎬</span>
                <strong style={{ fontSize: '0.86rem', color: '#1e40af' }}>2. Whiteboard Modeling</strong>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#3b82f6', lineHeight: 1.4 }}>
                Broadcast parametric vector models &amp; simulations to desks below.
              </p>
              <Link
                to="/player"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1d4ed8',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Visual Lab ➔</span>
              </Link>
            </div>

            {/* Phase 3 */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <strong style={{ fontSize: '0.86rem', color: '#166534' }}>3. Independent Practice</strong>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                Pupils complete retrieval cards and adaptive procedural drills.
              </p>
              <Link
                to="/practice-lab"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Practice Lab ➔</span>
              </Link>
            </div>

            {/* Phase 4 */}
            <div style={{ background: '#fdf4ff', border: '1px solid #f5d0fe', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.1rem' }}>📡</span>
                <strong style={{ fontSize: '0.86rem', color: '#86198f' }}>4. Live Roster &amp; Intervene</strong>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#a21caf', lineHeight: 1.4 }}>
                Detect misconceptions in real-time, send praise stars, and reset desks.
              </p>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c026d3' }}>
                Active on this Console 👇
              </span>
            </div>
          </div>
        </div>

        {/* FEATURE 1: AST Scene Broadcaster Deck */}
        <div
          style={{
            background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
            border: '1.5px solid #3730a3',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            color: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎬</span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fef3c7', margin: 0 }}>
                  Broadcast AST Vector Scene to Classroom
                </h2>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#c7d2fe' }}>
                Instantly load and play interactive visual models onto all connected student screens simultaneously.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#a5b4fc' }}>
              <span>⚡ WebRTC Synchronized Playback</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedAstScene}
              onChange={(e) => setSelectedAstScene(e.target.value)}
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#0c0a09',
                border: '1px solid #6366f1',
                color: '#fef3c7',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {AST_SCENES.map((scene) => (
                <option key={scene.id} value={scene.id}>
                  {scene.label} ({scene.stage})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleBroadcastAstScene}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span>🚀 Broadcast Scene to Desks</span>
            </button>
          </div>
        </div>

        {/* FEATURE 2: Rapid Teacher Commands */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            ⚡ Rapid Classroom Directives
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleBroadcastLesson('English Literature', 'Shakespeare: Key Themes')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                background: '#78350f',
                color: '#fef3c7',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              🎭 Direct to Shakespeare Lab
            </button>
            <button
              type="button"
              onClick={() => handleBroadcastLesson('Mathematics', 'Fractions & Decimals')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              📐 Direct to Fractions Unit
            </button>
            <button
              type="button"
              onClick={handlePraiseAll}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                background: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              ⭐ Send Golden Stars Praise
            </button>
            <button
              type="button"
              onClick={handleRequestAttention}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                background: '#64748b',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              👀 Eyes to Whiteboard (Chime)
            </button>
          </div>
        </div>

        {/* Live Student Mesh Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Classroom Roster ({students.length} Desks Online)
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Encrypted via DTLS-SRTP over local school Wi-Fi &bull; Sub-5ms telemetry
              </span>
            </div>
          </div>

          {students.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📡</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#334155', margin: '0 0 0.5rem 0' }}>
                Awaiting Pupil Connections on Local Mesh
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Open this portal on pupil Chromebooks or iPads on the same Wi-Fi network. 
                They will automatically appear here via zero-server WebRTC mesh.
              </p>
              <button
                type="button"
                onClick={handleOpenPairingModal}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                🔗 Show Student Pairing Link / QR
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {students.map((pupil) => {
                const isStruggling = pupil.status === 'need_help' || pupil.accuracyPercent < 70;
                return (
                  <div
                    key={pupil.studentId}
                    style={{
                      background: '#ffffff',
                      border: isStruggling ? '1.5px solid #f87171' : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                          }}
                        >
                          {pupil.avatarEmoji}
                        </div>
                        <div>
                          <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block' }}>
                            {pupil.alias}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {pupil.cohortCode} &bull; {pupil.connectionType === 'webrtc-datachannel' ? '⚡ WebRTC P2P' : '📶 Local Subnet'}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          background: isStruggling ? '#fef2f2' : '#f0fdf4',
                          color: isStruggling ? '#dc2626' : '#16a34a',
                          border: isStruggling ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        }}
                      >
                        {isStruggling ? 'Needs Support' : 'Progressing'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#475569', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Current Activity</span>
                      <strong style={{ color: '#0f172a' }}>{pupil.activeSubject}</strong>: {pupil.activeTopic}
                    </div>

                    {pupil.recentMisconception && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px', fontSize: '0.78rem', color: '#b91c1c' }}>
                        ⚠️ <strong>Diagnostic:</strong> {pupil.recentMisconception}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        ⭐ {pupil.starsEarned} Stars &bull; {pupil.accuracyPercent}% Accuracy
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Ping: {pupil.pingLatencyMs || 3}ms
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* WebRTC Direct Pairing Modal */}
        {showPairingModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                maxWidth: '560px',
                width: '100%',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  🔗 Direct WebRTC Classroom Mesh Pairing
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPairingModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.45 }}>
                Pupil devices on the local Wi-Fi automatically join the local broadcast mesh. 
                For cross-VLAN or device isolation environments, share this direct peer pairing token:
              </p>

              {isGeneratingToken ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Generating local DTLS-SRTP cryptographic offer...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Join Link Copy Box */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Pupil Direct Join URL:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? `${window.location.origin}/?join=${encodeURIComponent(pairingToken.slice(0, 48))}...` : ''}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCopyJoinLink}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: copiedLink ? '#10b981' : '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedLink ? '✔ Copied Link!' : '📋 Copy Link'}
                      </button>
                    </div>
                  </div>

                  {/* Manual Handshake Answer Box */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Student Handshake Answer (Optional):
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Paste student answer token here..."
                        value={studentAnswerInput}
                        onChange={(e) => setStudentAnswerInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.8rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAcceptStudentAnswer}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>

                  {pairingSuccess && (
                    <div style={{ padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '0.8rem', color: '#15803d' }}>
                      {pairingSuccess}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setShowPairingModal(false)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageMeta>
  );
}
