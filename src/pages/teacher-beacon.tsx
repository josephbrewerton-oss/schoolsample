import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { classroomBeacon, StudentBeaconTelemetry } from '../services/classroomBeacon';

export default function TeacherBeaconPage(): React.JSX.Element {
  const [students, setStudents] = useState<StudentBeaconTelemetry[]>([]);
  const [targetSubject, setTargetSubject] = useState<string>('Mathematics');
  const [targetTopic, setTargetTopic] = useState<string>('Fractions & Decimals');
  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);

  useEffect(() => {
    classroomBeacon.startTeacherSession((activePupils) => {
      setStudents(activePupils);
    });

    return () => {
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

  const handlePraiseAll = () => {
    classroomBeacon.broadcastCommand({
      type: 'PRAISE_ALL',
      message: '🌟 Well done Year 4! Great focus on your learning units.',
      timestamp: Date.now(),
    });
    setBroadcastNotice('Sent golden star praise to all pupil devices!');
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  const handleRequestAttention = () => {
    classroomBeacon.broadcastCommand({
      type: 'ATTENTION',
      message: '👀 Pencils down & eyes to the teacher whiteboard please.',
      timestamp: Date.now(),
    });
    setBroadcastNotice('Sent "Eyes to Front" chime to all pupil screens.');
    setTimeout(() => setBroadcastNotice(null), 4000);
  };

  return (
    <Layout
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
              <span>Local Mesh Active</span>
              <span>&bull;</span>
              <span>Zero Cloud Egress</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              📡 Classroom Beacon
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', margin: 0, maxWidth: '650px' }}>
              Live, peer-to-peer lesson oversight directly over your school Wi-Fi. 
              Observe pupil engagement, identify who needs support, and broadcast lesson focus without third-party servers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>{students.length}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Pupils</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d' }}>
                {students.filter((s) => s.accuracyPercent >= 80).length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Mastering</div>
            </div>
          </div>
        </div>

        {/* Broadcast Toast Notification */}
        {broadcastNotice && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontWeight: 600,
              fontSize: '0.92rem',
            }}
          >
            <span>📢 {broadcastNotice}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sent over local mesh</span>
          </div>
        )}

        {/* Teacher Action Deck */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            🎯 Teacher Command Center (One-Touch Broadcast)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleBroadcastLesson('Mathematics', 'Fractions & Decimals')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              📐 Push Unit: KS2 Fractions
            </button>
            <button
              type="button"
              onClick={() => handleBroadcastLesson('Science', 'Living Things & Habitats')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🌿 Push Unit: KS2 Science Habitats
            </button>
            <button
              type="button"
              onClick={handlePraiseAll}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              ⭐ Send Praise &amp; Golden Stars
            </button>
            <button
              type="button"
              onClick={handleRequestAttention}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#64748b',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              👀 Call Class Attention
            </button>
          </div>
        </div>

        {/* Live Student Mesh Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Classroom Roster ({students.length} Online)
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Refreshes automatically via local browser memory
            </span>
          </div>

          {students.length === 0 ? (
            <div
              style={{
                padding: '3.5rem 2rem',
                textAlign: 'center',
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📡</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                Searching for Pupil Devices...
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                Open St Joseph&apos;s Curriculum Portal on student Chromebooks or tablets on the same classroom network. 
                They will appear here automatically with zero sign-ins.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {students.map((student) => (
                <div
                  key={student.studentId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '2rem' }}>{student.avatarEmoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem' }}>
                        {student.alias}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {student.keyStage} &bull; {student.cohortCode}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Current Unit:</div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                      {student.activeSubject}: {student.activeTopic}
                    </div>
                    {student.recentMisconception && (
                      <div
                        style={{
                          marginTop: '6px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#991b1b',
                          fontSize: '0.76rem',
                          lineHeight: 1.3,
                        }}
                      >
                        <strong>⚠️ Diagnostic Trap:</strong> {student.recentMisconception}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>
                      ⭐ <strong>{student.starsEarned}</strong> Stars
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: student.accuracyPercent >= 80 ? '#dcfce7' : '#fee2e2',
                        color: student.accuracyPercent >= 80 ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {student.accuracyPercent}% Accuracy
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal & Privacy Disclosure */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '1.5rem',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '0.85rem',
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: '#0f172a' }}>🛡️ Privacy &amp; Data Dignity Attestation for Teachers:</strong>
          <br />
          The Classroom Beacon operates exclusively peer-to-peer. It does not record keystrokes, webcam footage, or personal identifiable student data. 
          All pupil telemetry uses anonymous animal pseudonyms, stays entirely within classroom browser memory, and vanishes when the teacher closes the tab. 
          Meets UK GDPR Article 6(1)(e) Public Task requirements without requiring parental cloud consent.
        </div>

      </div>
    </Layout>
  );
}
