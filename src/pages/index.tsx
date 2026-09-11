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
      description="St Joseph's Primary & Secondary Interactive Learning Portal"
    >
      <main style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Hero */}
        <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <span>✨ UK National Curriculum Aligned</span>
            <span>&bull;</span>
            <span>Works Offline</span>
          </div>

          <h1 style={{ fontSize: '2.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Learn with Confidence at St Joseph's
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '720px', margin: '0 auto 2.25rem auto', lineHeight: 1.6 }}>
            Interactive practice with instant feedback, step-by-step clues, and diagnostic mistake checks. 
            Tailored for Key Stages 1 to 4 in Mathematics, Science, English, Computing, and more.
          </p>

          {/* Dual Action Hub CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/practice-lab"
              className="button button--primary button--lg"
              style={{
                padding: '0.9rem 2.25rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                background: '#1d4ed8',
                color: '#ffffff',
                fontWeight: 700,
                boxShadow: '0 4px 14px 0 rgba(29, 78, 216, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              ⚡ Start Practicing Questions
            </Link>

            <Link
              to="/learning-zone"
              className="button button--secondary button--lg"
              style={{
                padding: '0.9rem 2.25rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                border: '2px solid #0369a1',
                color: '#0369a1',
                background: '#ffffff',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
            >
              📖 Explore Lesson Walkthroughs
            </Link>
          </div>
        </section>

        {/* Core Capabilities Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2.5rem', color: '#0f172a', fontWeight: 800 }}>
            Designed for Pupil Success
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Service 1: Practice Arena */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
              transition: 'transform 0.15s ease',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1d4ed8' }}>
                Instant Practice Arena
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Bite-sized curriculum questions with real-time feedback, streak rewards, and instant hints whenever you get stuck.
              </p>
            </div>

            {/* Service 2: Learning Zone */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
              transition: 'transform 0.15s ease',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}>📖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0369a1' }}>
                Curriculum Lessons
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Step-by-step lesson guides covering key concepts, everyday examples, and common traps before starting a quiz.
              </p>
            </div>

            {/* Service 3: Prof. Turing */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
              transition: 'transform 0.15s ease',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#047857' }}>
                Prof. Turing Audio Tutor
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Friendly, voice-guided hints and Socratic prompts that guide your thinking without giving away the answers.
              </p>
            </div>

            {/* Service 4: 100% Accurate Verified Math */}
            <div style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
              transition: 'transform 0.15s ease',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#6d28d9' }}>
                Diagnostic Checks
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Every incorrect option checks for common student slips (like adding fraction denominators) to explain exactly where you went wrong.
              </p>
            </div>
          </div>
        </section>

        {/* Licensing & Attribution */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#334155',
          lineHeight: 1.6,
        }}>
          St Joseph's Learning Portal &bull; Open-source, privacy-first educational technology.
          Curriculum materials licensed under{' '}
          <a
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1d4ed8', fontWeight: 600, textDecoration: 'underline' }}
          >
            OGL v3.0 (Oak National Academy)
          </a>.
        </div>
      </main>
    </Layout>
  );
}