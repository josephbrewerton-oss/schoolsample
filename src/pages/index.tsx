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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to="/practice-lab"
              className="button button--primary button--lg"
              style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px' }}
            >
              Launch Interactive Lab 🚀
            </Link>
          </div>
        </section>

        {/* Core Services & Capabilities Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
            What We Offer
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Service 1: Dynamic National Curriculum */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#059669' }}>
                Full Oak National Curriculum
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                Complete coverage of Key Stages 1 through 4 across Maths, Sciences, and Humanities, structured into dynamic, step-by-step modular lessons.
              </p>
            </div>

            {/* Service 2: On-Device Neural Tutor */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#2563eb' }}>
                Prof. Turing (Edge AI Assistant)
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                Powered entirely client-side with Gemini Nano. Provides Socratic guidance and audio feedback with 100% data privacy and zero cloud tracking.
              </p>
            </div>

            {/* Service 3: Deterministic Hypervisor */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'var(--ifm-card-background-color, #ffffff)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#7c3aed' }}>
                Deterministic Math Guardrails
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
                Zero-hallucination verification engine. Every equation, fraction conversion, and AST node is mathematically verified before rendering to the canvas.
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