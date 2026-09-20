// src/pages/child-safety.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ChildSafetyPage(): React.JSX.Element {
  useEffect(() => {
    document.title = "Child Safety & Safeguarding Guarantee | St Joseph's Curriculum Portal";
  }, []);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem', color: '#1e293b' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          borderRadius: '18px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(4, 120, 87, 0.25)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <span>🛡️ Verified Child-Safe Environment</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Our Child Safety &amp; Safeguarding Guarantee
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#a7f3d0', margin: 0, lineHeight: 1.6, maxWidth: '780px' }}>
          St Joseph&apos;s Curriculum Portal is engineered as a safe, private sanctuary for young learners (ages 5–16). 
          Every AI interaction, curriculum challenge, and diagnostic operates under zero-tolerance child safeguarding controls.
        </p>
      </div>

      {/* Immediate Safeguarding Helpline Banner */}
      <div
        style={{
          background: '#eff6ff',
          border: '1.5px solid #93c5fd',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: '2rem' }}>🕊️</div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <strong style={{ color: '#1e3a8a', fontSize: '1rem', display: 'block', marginBottom: '2px' }}>
            Are you a student who is feeling sad, worried, or unsafe?
          </strong>
          <span style={{ color: '#1e40af', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Please talk to a trusted adult, family member, or teacher right now. In the UK, you can speak with <strong>Childline</strong> free, anytime, day or night on <strong>0800 1111</strong> (or online at childline.org.uk). You are never alone.
          </span>
        </div>
      </div>

      {/* 5 Core Safety Pillars */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
        The Five Pillars of Our Child Safety Architecture
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Pillar 1 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🔒</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            1. Zero Cloud Data Egress
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Student answers, voice queries, notes, and progress logs are processed <strong>100% on the child&apos;s local device</strong> (via Gemini Nano or WebLLM). Zero student data, audio, or text is transmitted to remote AI cloud servers or retained externally.
          </p>
        </div>

        {/* Pillar 2 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🚫</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            2. Real-Time Content Filtering
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Every query and response is audited by an automated on-device filter. It strictly prohibits violence, weapons, adult content, profanity, drugs, personal data sharing, and prompt overrides before text is ever displayed or spoken.
          </p>
        </div>

        {/* Pillar 3 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>📚</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            3. Strict Curriculum Grounding
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            The AI tutor is bounded by Oak National Academy curriculum axioms. It is Socratic and pedagogical: it will never give away exam answers, engage in casual roleplaying, or drift into inappropriate discussions.
          </p>
        </div>

        {/* Pillar 4 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>👥</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            4. Zero Stranger Communication
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            There are no public chatrooms, direct message systems, or user-to-user discovery mechanisms. Children cannot be messaged or contacted by strangers or external internet users.
          </p>
        </div>

        {/* Pillar 5 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>⚖️</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            5. KCSIE &amp; Age Appropriate Standards
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Engineered in alignment with the UK Department for Education&apos;s statutory guidance <em>Keeping Children Safe in Education (KCSIE)</em>, the UK Online Safety Act, and the ICO Children&apos;s Code (Age Appropriate Design Code).
          </p>
        </div>

        {/* Pillar 6 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🍪</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
            6. No Ads, No Profiling, No Cookies
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            We do not sell advertising, do not build commercial tracking profiles on children, and use zero third-party marketing cookies. Education is provided as an unconditional public good.
          </p>
        </div>
      </div>

      {/* Guidance for Parents and Teachers */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>
          Information for Parents, Guardians, and School Leaders
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem' }}>
          As an educational portal originating from St Joseph&apos;s Catholic Primary School, child safeguarding is our foremost moral and legal responsibility.
        </p>
        <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <li><strong>No Login Credentials Required</strong>: Students do not need to register with an email address or password to access the full curriculum.</li>
          <li><strong>Local Browser Sandbox</strong>: All student notes and practice history stay safely within browser IndexedDB storage on the physical device in use.</li>
          <li><strong>Air-Gap Ready</strong>: Schools can enforce strict air-gap mode, disabling peer networking entirely in the Settings menu.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            background: '#059669',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '10px 22px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
          }}
        >
          Return to Portal Home
        </Link>
        <Link
          to="/privacy"
          style={{
            background: '#f1f5f9',
            color: '#475569',
            textDecoration: 'none',
            padding: '10px 22px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: '1px solid #cbd5e1',
          }}
        >
          View Privacy &amp; GDPR Policy
        </Link>
      </div>
    </div>
  );
}
