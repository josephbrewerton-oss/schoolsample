if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: { NODE_ENV: 'development' } };
}
import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import HomeLearnerGuidedCard from '../components/HomeLearnerGuidedCard';

export default function Home() {
  return (
    <PageMeta
      title="Home"
      description="St Joseph's Primary & Secondary Interactive Learning Portal"
    >
      <div style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Hero */}
        <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <span>🕊️ Education should be free</span>
            <span>&bull;</span>
            <span>UK National Curriculum</span>
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

          {/* Action Hub CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#home-learner-guided-pathway"
              style={{
                padding: '0.9rem 2.25rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                background: '#15803d',
                color: '#ffffff',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 14px 0 rgba(21, 128, 61, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>🕊️ Start Here: Guided Learning</span>
              <span>↓</span>
            </a>

            <Link
              to="/catholic-life"
              className="button button--secondary button--lg"
              style={{
                padding: '0.9rem 2.25rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                border: '2px solid #4338ca',
                color: '#312e81',
                background: '#eef2ff',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(67, 56, 202, 0.15)',
              }}
            >
              <span>✝️</span>
              <span>Catholic Life &amp; Faith</span>
            </Link>

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

        {/* Home-Learner Guided Pathway (For Disadvantaged & Out-of-School Children) */}
        <HomeLearnerGuidedCard />

        {/* Developing-Nation Safe Architecture: Works Offline & Tiny Data Banner */}
        <section
          style={{
            background: '#0f172a',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            marginBottom: '3.5rem',
            color: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌱</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Works Offline &bull; Saves Your Mobile Data &bull; Ultra-Fast
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
              Tiny Lesson Seeds: Learn Anywhere, Even Without Internet!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Instead of draining expensive phone data with giant videos, each lesson is squashed into a tiny seed smaller than a single text message. Your phone or computer opens them into fun, interactive lesson guides and drawings with zero internet data needed!
            </p>
          </div>

          <Link
            to="/learning-zone?tab=inflation"
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: '10px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>See How Tiny Lessons Work</span>
            <span>➔</span>
          </Link>
        </section>

        {/* Core Capabilities Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2.5rem', color: '#0f172a', fontWeight: 800 }}>
            Everything You Need to Succeed
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
                Bite-sized questions with instant thumbs-up feedback, stars to collect, and friendly clues whenever you get stuck.
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
                Step-by-Step Lessons
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Clear explanations with real-world examples, diagrams, and common tricky bits explained before you try a quiz.
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
                Friendly Voice Tutor
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Listen to any lesson read aloud in clear, gentle speech with spoken hints that guide you without spoiling the answer.
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
                Helpful Slip Explanations
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Made a mistake? Don't worry! We spot common slips (like adding fraction bottoms) and show you exactly how to fix them.
              </p>
            </div>
          </div>
        </section>

        {/* Dedicated Whole-School Catholic Life & Faith Sanctuary Banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            border: '2px solid #facc15',
            borderRadius: '20px',
            padding: '2.5rem',
            marginBottom: '3.5rem',
            boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.25)',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>✝️</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Whole-School &amp; Parish Faith Sanctuary &bull; For All Year Groups &bull; Not Key Staged
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0' }}>
              Catholic Life, Liturgy &amp; Sacraments in One Place
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#e0e7ff', lineHeight: 1.6, margin: 0 }}>
              Our Catholic faith is not locked into key stage boxes — it belongs to every child, family, and parish member. Explore the Holy Mass step-by-step, the 7 Sacraments, the Holy Rosary, God's 10 Commandments, Church seasons, Latin Mass prayers, and how we care for God's creation.
            </p>
          </div>

          <Link
            to="/catholic-life"
            style={{
              padding: '0.95rem 2rem',
              borderRadius: '10px',
              background: '#facc15',
              color: '#1e1b4b',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(250, 204, 21, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Enter Catholic Sanctuary</span>
            <span>➔</span>
          </Link>
        </section>

        {/* St Joseph's Global Mission Banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
            border: '2px solid #bbf7d0',
            borderRadius: '20px',
            padding: '2.5rem',
            marginBottom: '3.5rem',
            boxShadow: '0 10px 25px -5px rgba(21, 128, 61, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '9999px',
              background: '#ffffff',
              border: '1px solid #86efac',
              color: '#15803d',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <span>🕊️ St Joseph&apos;s Promise</span>
            <span>&bull;</span>
            <span>100% Free Forever</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Free for All Children, Catholic Parishes &amp; Families
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#334155', maxWidth: '720px', lineHeight: 1.6, margin: '0 auto 1.75rem auto' }}>
            We believe high-quality learning is a gift for every child. St Joseph's portal is 100% free with no subscriptions, no adverts, no account sign-ups, and works offline to protect your family's privacy.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/licensing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.75rem',
                borderRadius: '10px',
                background: '#15803d',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
                transition: 'background-color 0.2s',
              }}
            >
              🕊️ Read Our School Mission
            </Link>
            <Link
              to="/privacy"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.75rem',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              🛡️ Safe, Private &amp; On Your Device
            </Link>
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
      </div>
    </PageMeta>
  );
}