if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: { NODE_ENV: 'development' } };
}
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="Home"
      description="St Joseph's Interactive National Curriculum Edge AI Portal"
    >
      <main style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Hero */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            St Joseph's Interactive Learning Portal
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Master the UK National Curriculum with offline, on-device AI. 
            Interactive S-expression practice, deterministic math validation, and real-time private tutoring.
          </p>

          {/* Dual Action Hub CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/learning-zone"
              className="button button--secondary button--lg"
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '2px solid #0284c7',
                color: '#0284c7',
                fontWeight: 600
              }}
            >
              📖 Curriculum Learning Zone
            </Link>

            <Link
              to="/practice-lab"
              className="button button--primary button--lg"
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                background: '#2563eb',
                fontWeight: 600
              }}
            >
              ⚡ Interactive Practice Lab 🚀
            </Link>
          </div>
        </section>

        {/* Core Capabilities Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
            What We Offer
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Service 1: Learning Zone */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0284c7' }}>
                Curriculum Learning Zone
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                Structured micro-lessons and misconception busting. Learn core principles step-by-step before testing your knowledge.
              </p>
            </div>

            {/* Service 2: Practice Lab */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#2563eb' }}>
                Adaptive Practice Lab
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                Dynamic S-expression assessment engine with instant grading, streak tracking, and automated session diagnostics.
              </p>
            </div>

            {/* Service 3: Prof. Turing */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#059669' }}>
                Prof. Turing Socratic Tutor
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                100% on-device AI assistant providing real-time voice guidance and conceptual hints without revealing direct answers.
              </p>
            </div>

            {/* Service 4: Deterministic Guardrails */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#7c3aed' }}>
                Deterministic Guardrails
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                AST flow governors and arithmetic solvers verify every question, eliminating hallucinations before rendering.
              </p>
            </div>
          </div>
        </section>

        {/* Licensing & Attribution */}
        <footer style={{
          paddingTop: '2rem',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#94a3b8'
        }}>
          St Joseph's Learning Portal &bull; Open-source, privacy-first educational technology.
          Curriculum materials licensed under{' '}
          <a
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#64748b' }}
          >
            OGL v3.0 (Oak National Academy)
          </a>.
        </footer>
      </main>
    </Layout>
  );
}