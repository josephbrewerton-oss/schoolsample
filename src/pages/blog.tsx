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

      {/* Ethical & Theological Dispatch: The Vatican Rome Call for AI Ethics */}
      <article style={{ marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '2px solid #e2e8f0' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#fef3c7',
              color: '#92400e',
              marginBottom: '0.75rem',
            }}
          >
            🏛️ ETHICAL CHARTER &amp; CATHOLIC SOCIAL TEACHING • SEPTEMBER 2026
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.5rem' }}>
            Algor-ethics in the Classroom: How the Vatican&apos;s Rome Call for AI Ethics Shaped St Joseph&apos;s On-Device Architecture
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Published September 20, 2026 • By Joseph Brewerton &amp; St Joseph&apos;s Curriculum Engineering Team
          </p>
        </div>

        <div style={{ lineHeight: 1.75, fontSize: '1.02rem', color: '#334155' }}>
          <p style={{ fontSize: '1.12rem', color: '#1e293b', fontWeight: 500, marginBottom: '1.5rem' }}>
            When the Holy See, through the Pontifical Academy for Life, initiated the landmark <strong>Rome Call for AI Ethics</strong> in February 2020, 
            it issued a prophetic challenge to the world: artificial intelligence must be guided by <em>&ldquo;algor-ethics&rdquo;</em>—ensuring 
            that technological progress always serves human dignity, the common good, and the preferential protection of the most vulnerable.
          </p>

          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderLeft: '4px solid #d97706',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400e', marginTop: 0, marginBottom: '0.5rem' }}>
              The Vatican&apos;s Mandate: Technology in Service of Human Personhood
            </h3>
            <p style={{ margin: 0, color: '#78350f', fontSize: '0.95rem' }}>
              &ldquo;An ethical approach to artificial intelligence does not mean setting limits to progress, but ensuring that progress 
              is genuinely human, serving human beings and not reducing them to mere data consumers or surveillance subjects.&rdquo; 
              — <em>Pontifical Academy for Life, Rome Call for AI Ethics</em>
            </p>
          </div>

          <p style={{ marginBottom: '1.5rem' }}>
            In commercial EdTech, the dominant business model has run contrary to these Christian principles. Tech monopolies charge schools 
            exorbitant monthly SaaS fees (£5–£20 per student) while streaming children&apos;s queries, personal misconceptions, and voice inputs 
            to centralized cloud LLM servers overseas. This model deepens educational inequality, creates severe GDPR safeguarding vulnerabilities, 
            and excludes underfunded parish schools and pupils in developing nations.
          </p>

          <p style={{ marginBottom: '1.75rem' }}>
            At St Joseph&apos;s, inspired by <strong>Canon Gregory</strong> and <strong>Father Jerome Ajakaiye</strong>, we engineered our platform as a 
            direct, technical translation of the Rome Call&apos;s six ethical pillars:
          </p>

          {/* 6 Principles Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>🔒</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>1. Security &amp; Privacy</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>Zero Cloud Egress:</strong> Student reasoning, answers, and voice inputs never leave the pupil&apos;s local browser sandbox. No profiling or data harvesting.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>🌍</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>2. Inclusion</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>£0.00 Marginal Cost:</strong> Runs on-device via quantized Gemini Nano and offline IndexedDB. Works on aged school Chromebooks and rural classrooms without internet.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>🔍</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>3. Transparency</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>Deterministic Lisp ASTs:</strong> Question models and vector simulations operate on transparent, auditable S-Expressions rather than unpredictable black-box prompts.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>⚖️</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>4. Impartiality</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>Curriculum Fidelity:</strong> Grounded strictly in UK National Curriculum &amp; Oak National Academy standards, free from corporate ads, bias, or algorithmic nudging.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>🛡️</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>5. Responsibility</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>Pedagogical Governance:</strong> Socratic prompt constraints ensure pupils are guided towards genuine understanding rather than passive answer copying.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.15rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>⚙️</div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>6. Reliability</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>Zero-Fail Fallback:</strong> Instant procedural rule engines step in under 5ms if neural APIs are absent, backed by 430 audited test manifests.
              </p>
            </div>
          </div>

          <p style={{ marginBottom: '1.5rem' }}>
            By demonstrating that high-performance, Socratic artificial intelligence can be delivered at zero marginal cost and zero privacy risk, 
            St Joseph&apos;s proves that the Holy See&apos;s vision for ethical AI is not an abstract ideal—it is a working, production reality 
            accessible to every child today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link
              to="/catholic-life"
              style={{
                display: 'inline-block',
                background: '#d97706',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              ✝️ Catholic Life &amp; RE Sanctuary
            </Link>
            <Link
              to="/privacy"
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
              🔒 Inspect Zero-Egress Safeguarding
            </Link>
            <Link
              to="/licensing"
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
              📜 Dual-Licensing Charter
            </Link>
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
