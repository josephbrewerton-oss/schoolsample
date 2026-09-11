import React from 'react';
import { Link } from 'react-router-dom';

export default function PersistentFooter(): React.JSX.Element {
  return (
    <footer
      id="persistent-site-footer"
      role="contentinfo"
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '3rem 1.5rem 2rem',
        borderTop: '1px solid #1e293b',
        fontSize: '0.88rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <img src="/img/logo.svg" alt="School crest" style={{ width: '24px', height: '24px' }} />
            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem' }}>
              St Joseph's Portal
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.6, maxWidth: '300px' }}>
            Interactive UK National Curriculum platform powered by edge AST substrates and on-device neural evaluation.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Curriculum Workspaces
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <Link to="/practice-lab" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                ⚡ Interactive Practice Lab
              </Link>
            </li>
            <li>
              <Link to="/learning-zone" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                📖 Curriculum Lessons
              </Link>
            </li>
            <li>
              <Link to="/profile" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                ⭐ Learner Passport & Badges
              </Link>
            </li>
            <li>
              <Link to="/curriculum-studio" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                🌍 Curriculum Studio
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Edge & Standards
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <Link to="/settings" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                ⚙️ Neural Engine Settings
              </Link>
            </li>
            <li>
              <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                🛡️ Privacy, GDPR &amp; Cookies
              </Link>
            </li>
            <li>
              <Link to="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                📰 Curriculum News & Releases
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/josephbrewerton-oss/schoolsample"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#94a3b8', textDecoration: 'none' }}
              >
                📦 Open Source Repository ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#64748b',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>
            © {new Date().getFullYear()} St Joseph's Catholic Primary School & Open Curriculum Contributors.
          </span>
          <span>&bull;</span>
          <Link to="/privacy" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
            🛡️ Zero Cloud Egress • 🍪 No Tracking Cookies • 🇬🇧 UK GDPR &amp; Children&apos;s Code
          </Link>
        </div>
        <span>
          Lessons grounded in Oak National Academy Open Curriculum Specifications (OGL v3.0).
        </span>
      </div>
    </footer>
  );
}
