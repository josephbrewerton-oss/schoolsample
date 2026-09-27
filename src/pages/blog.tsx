import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function BlogPage(): React.JSX.Element {
  return (
    <PageMeta
      title="School News & Curriculum Dispatches"
      description="Latest technical dispatches, curriculum releases, sovereign edge AI, and procedural vector teaching at St Joseph's"
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
        {/* Newsroom Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>📰</span>
            <span>St Joseph&apos;s Curriculum Newsroom &amp; Dispatches</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Curriculum News &amp; Technical Updates
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0, lineHeight: 1.5 }}>
            Official announcements, releases, and breakthroughs in sovereign on-device AI and interactive vector teaching.
          </p>
        </div>

        {/* Latest Dispatch: September 2026 */}
      <article style={{ marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '2px solid #e2e8f0' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#dcfce7',
              color: '#15803d',
              marginBottom: '0.75rem',
            }}
          >
            ★ LATEST RELEASE • SEPTEMBER 2026
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.5rem' }}>
            AST Vector Player &amp; SlideScript: Replacing Heavy Video with 15KB Interactive Simulations
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Published September 27, 2026 • By St Joseph's Curriculum Engineering Team
          </p>
        </div>

        <div style={{ lineHeight: 1.75, fontSize: '1.02rem', color: '#334155' }}>
          <p style={{ fontSize: '1.12rem', color: '#1e293b', fontWeight: 500, marginBottom: '1.5rem' }}>
            Schools have long faced an uncomfortable compromise: passive, bandwidth-hungry video streams (50–100MB per lesson) 
            or isolated, engineer-only simulation applets. Our latest release solves both by combining procedural vector graphics, 
            plain-text authoring, and clicker-driven active pedagogy.
          </p>

          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderLeft: '4px solid #16a34a',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginTop: 0, marginBottom: '0.5rem' }}>
              The Four Superpowers of the New AST Vector Engine
            </h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#14532d', fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong>Micro-Footprint (&lt;15 KB per slide):</strong> Resolution-independent SVGs patched at 60 FPS in-memory. Runs smoothly even on 8-year-old school Chromebooks without buffering.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong>SlideScript for Non-Techs:</strong> Teachers write plain Markdown with headings, rules, and questions. The on-device compiler translates it into deterministic Lisp S-expressions and responsive SVG nodes.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong>Clicker-Driven "Step Mode" (👣):</strong> Advances through discrete didactic checkpoints via standard presenter clickers (PageDown / Right Arrow / Space), pausing automatically for class discussion.
              </li>
              <li style={{ marginBottom: 0 }}>
                <strong>OBS WebSocket Studio Sync:</strong> Teachers can broadcast multi-camera lessons with transparent vector overlays and auto-chaptering directly into OBS Studio.
              </li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link
              to="/media-player"
              style={{
                display: 'inline-block',
                background: '#16a34a',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              🚀 Launch AST Vector Player
            </Link>
            <a
              href="/player.html"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                background: '#f1f5f9',
                color: '#1e293b',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              💻 Open Standalone Studio &amp; Compiler
            </a>
          </div>
        </div>
      </article>

      {/* Foundational Dispatch: August 2026 */}
      <article>
        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: '#dbeafe',
              color: '#1e40af',
              marginBottom: '0.75rem',
            }}
          >
            FOUNDATIONAL DISPATCH • AUGUST 2026
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.5rem' }}>
            Sovereign In-Browser AI Tutoring Architecture
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Published August 16, 2026 • By St Joseph's School AI Engineering Team
          </p>
        </div>

        <div style={{ lineHeight: 1.75, fontSize: '1.02rem', color: '#334155' }}>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 500, marginBottom: '1.75rem' }}>
            This live demonstration introduces a decoupled, zero-cloud architecture designed to deliver sub-second,
            interactive AI tutoring directly inside school curriculum materials while ensuring complete student data sovereignty.
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #2563eb',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginTop: 0, marginBottom: '0.5rem' }}>
              Inspired by St Joseph's, Fishponds (Bristol)
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
              Due to our inspirational Priests Canon Gregory and our awesome Priest in Charge Father Jerome Ajakaiye, I was
              given a reason to write this website and bring education to any that are in need.
            </p>
            <p style={{ margin: '0.75rem 0 0', color: '#475569', fontSize: '0.95rem' }}>
              State schools face a dual barrier when adopting modern AI: prohibitive per-seat software licensing fees and
              strict GDPR data privacy obligations regarding pupils' personal data. By grounding our engineering in the
              practical needs of Bristol classrooms, this architecture proves that cutting-edge, personalized Socratic
              tutoring does not require expensive cloud subscriptions or data egress.
            </p>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '2rem', marginBottom: '0.75rem' }}>
            Core Architectural Breakthroughs
          </h3>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Zero-CORS Transport Layer:</strong> In-memory WebRTC loopback over SCTP and DTLS eliminates standard
              HTTP preflight latency and reverse-proxy bottlenecks.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>100% Data Sovereignty:</strong> Student prompts, telemetry, and speech synthesis pipelines execute
              locally on device without routing personal data to third-party cloud LLMs.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>DOM-Decoupled Execution:</strong> The AI streaming engine runs independently from UI rendering cycles,
              preventing layout lag and dropped audio frames on school Chromebooks.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Universal AST Substrates:</strong> Compiled S-Expressions and deterministic question ASTs turn any device
              into an instant curriculum terminal.
            </li>
          </ul>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/practice-lab"
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              ⚡ Test Practice Arena
            </Link>
            <Link
              to="/learning-zone"
              style={{
                display: 'inline-block',
                background: '#f1f5f9',
                color: '#1e293b',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              📖 Browse Curriculum Lessons
            </Link>
          </div>
        </div>
      </article>
    </div>
    </PageMeta>
  );
}
