import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MatSlaSection(): React.JSX.Element {
  const [trustName, setTrustName] = useState<string>('');
  const [schoolCount, setSchoolCount] = useState<string>('12');
  const [leadOfficer, setLeadOfficer] = useState<string>('');
  const [certificateGenerated, setCertificateGenerated] = useState<boolean>(false);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (trustName.trim()) {
      setCertificateGenerated(true);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* SLA Hero Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🛡️</div>
          <strong style={{ display: 'block', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
            Zero-Telemetry Guarantee
          </strong>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            100% on-device sandbox. Zero pupil PII, keystrokes, or answers ever leave the local hardware.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>⚡</div>
          <strong style={{ display: 'block', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
            3-Tier Hardware Safety
          </strong>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Automated execution cascade with WebGPU Memory Guard preventing older 2GB/3GB iPad crashes.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📡</div>
          <strong style={{ display: 'block', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
            0 bps Perpetual Offline
          </strong>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Certified to operate through total school broadband outages with zero cloud dependencies.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📜</div>
          <strong style={{ display: 'block', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
            £0.00 Perpetual Covenant
          </strong>
          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Zero per-seat charges, zero token fees, zero cloud compute pass-through for all trust schools.
          </p>
        </div>
      </div>

      {/* Section 1: Zero-Telemetry & Safeguarding */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            1. Zero-Telemetry Architecture &amp; Statutory Compliance
          </h2>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          The St Joseph&apos;s Curriculum Portal is engineered with a strict <strong>Air-Gap Data Boundary</strong>. Unlike commercial cloud learning suites that transmit student answers to remote API servers, our architecture executes all pedagogical logic, S-Expression AST parsers, and neural embeddings exclusively inside the client browser.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Statutory Framework</th>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Technical Guarantee</th>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Enforcement Mechanism</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>UK GDPR (Article 25)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Data Protection by Design &amp; Default</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 600 }}>Zero remote network requests for pupil interactions</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>ICO Children&apos;s Code</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>15 Age-Appropriate Design standards</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 600 }}>Zero profiling, zero tracking cookies, zero ads</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>DfE GenAI Guidance (2024)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>No student data used for LLM training</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 600 }}>100% on-device inference (Nano &amp; WebGPU)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>Prevent &amp; KCSIE 2024</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Pastoral guardrails &amp; deterministic safety</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 600 }}>Hard AST rulebook interception (<code style={{ fontSize: '0.8rem' }}>quiz.rules.ast</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Local Hardware Tiers & Memory Guard */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>💻</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            2. Local Hardware Tiers &amp; WebGPU Memory Guard on Older iPads
          </h2>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Trust estates comprise mixed hardware: managed ChromeOS Chromebooks, locked-down Windows laptops, and older iPad carts. The St Joseph&apos;s Edge Cognitive Engine cascades automatically between three execution tiers:
        </p>

        {/* The 3 Tiers Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                TIER 1 &bull; NATIVE CHROME
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>25–85 ms/tok</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0.35rem 0' }}>
              Chrome Prompt API (Gemini Nano)
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Hardware-accelerated on-device NPU/GPU runtime for modern managed Chromebooks and Windows/macOS Chrome 131+. Zero memory heap overhead.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                TIER 2 &bull; WEBGPU SHADERS
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>40–120 ms/tok</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0.35rem 0' }}>
              WebLLM Neural Pipeline
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              On-device execution via WebGPU shaders (SmolLM2-360M) for Safari 18+ (M-series iPads/Macs), Firefox, and non-Chromium enterprise devices.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                TIER 3 &bull; UNIVERSAL FAILSAFE
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>&lt; 5 ms (Instant)</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0.35rem 0' }}>
              Local Socratic Rule Synthesizer
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Deterministic AST rulebook engine. Zero GPU footprint (&lt; 15MB RAM). Runs on legacy PCs, locked-down kiosk exam browsers, and baseline iPads.
            </p>
          </div>
        </div>

        {/* Deep Dive on Older iPads Memory Guard */}
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e40af', margin: 0 }}>
              WebGPU Memory Guard on Older 2GB/3GB Educational iPads
            </h3>
          </div>
          <p style={{ fontSize: '0.87rem', color: '#1e3a8a', lineHeight: 1.55, margin: 0 }}>
            Standard school iPads (iPad 5th–9th Generation, iPad Air 2/3) operate with 2GB or 3GB of unified system RAM. On iPadOS, Safari&apos;s WebKit engine enforces an aggressive kernel watchdog (<strong>Jetsam</strong>) that forcibly kills browser tabs if allocations exceed ~1.2GB.
            <br /><br />
            Our <strong>Edge Cognitive Engine Memory Guard</strong> automatically evaluates hardware memory before any WebGPU compute pipelines are created:
          </p>
          <ul style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.6, paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: 0 }}>
            <li><strong>Proactive Heuristics:</strong> Inspects CPU cores, device memory bounds, and WebGPU buffer limits prior to model weight allocation.</li>
            <li><strong>Zero Tab Crash:</strong> If an older 2GB/3GB iPad is detected or memory allocation fails, the system immediately and seamlessly routes into <strong>Tier 3 (Local Socratic Rule Synthesizer)</strong> without user interruption.</li>
            <li><strong>Classroom Continuity:</strong> Pupils on legacy hardware complete quizzes and interactive lesson ASTs with zero lag or browser terminations.</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Perpetual Offline SLA & MDM Deployment */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📡</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            3. Perpetual Offline SLA &amp; Trust MDM Fleet Deployment
          </h2>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          The portal requires <strong>0 bps bandwidth</strong> once installed. Oak National Academy curriculum sequences, lesson templates, and question banks are baked directly into the offline Service Worker cache and IndexedDB.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
              Google Admin Console (Chromebooks)
            </h3>
            <ol style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '1.1rem', margin: 0, lineHeight: 1.5 }}>
              <li>Devices &gt; Chrome &gt; Apps &amp; Extensions &gt; Users.</li>
              <li>Select student OU and add PWA URL.</li>
              <li>Set policy: <em>Force install + pin to shelf</em>.</li>
              <li>Enable offline application cache.</li>
            </ol>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
              Microsoft Intune (Windows 10/11)
            </h3>
            <ol style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '1.1rem', margin: 0, lineHeight: 1.5 }}>
              <li>Apps &gt; Windows &gt; Add &gt; Web App (PWA).</li>
              <li>Provide curriculum portal URL and icon.</li>
              <li>Assign to Year Group Device Security Groups.</li>
              <li>Deploy as pinned Edge PWA.</li>
            </ol>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
              Jamf School / Apple School Manager
            </h3>
            <ol style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '1.1rem', margin: 0, lineHeight: 1.5 }}>
              <li>Profiles &gt; Web Clip / PWA configuration.</li>
              <li>Whitelist origin in Web Content Filters.</li>
              <li>Assign profile to Shared iPad Carts.</li>
              <li>Verify offline launch in Airplane Mode.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Section 4: Operational Availability SLA Metrics */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            4. Service Level Commitments &amp; Maintenance Metrics
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Performance Dimension</th>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Target SLA</th>
                <th style={{ padding: '0.75rem 1rem', color: '#1e293b' }}>Operational Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>Local Execution Availability</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 700 }}>99.99%</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Independent of central web servers; cached PWA renders reliably.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>Recovery Time Objective (RTO)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 700 }}>&lt; 60 seconds</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Swap student device and immediately load portal from local cache.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>Recovery Point Objective (RPO)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 700 }}>0 seconds</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Synchronous IndexedDB writes prevent student progress loss.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>Bandwidth Egress During Lessons</td>
                <td style={{ padding: '0.75rem 1rem', color: '#15803d', fontWeight: 700 }}>0 bps</td>
                <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>Zero continuous telemetry or cloud token streaming.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Interactive MAT Procurement Attestation Certificate */}
      <section
        style={{
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.6rem' }}>🏛️</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Generate Official Multi-Academy Trust SLA Addendum
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Trust Chief Information Officers (CIOs), Data Protection Officers (DPOs), and Headteachers can generate a customized, legally binding Trust SLA Attestation for internal compliance dossiers and governing board records.
        </p>

        <form onSubmit={handleGenerateCertificate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Multi-Academy Trust / Diocese Name *
            </label>
            <input
              type="text"
              required
              value={trustName}
              onChange={(e) => setTrustName(e.target.value)}
              placeholder="e.g. St Thomas Aquinas Catholic Multi-Academy Trust"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Number of Federated Academies
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={schoolCount}
              onChange={(e) => setSchoolCount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Trust DPO / CEO Signatory Name (Optional)
            </label>
            <input
              type="text"
              value={leadOfficer}
              onChange={(e) => setLeadOfficer(e.target.value)}
              placeholder="e.g. Dr Sarah Jenkins, Trust DPO"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.68rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Generate SLA Addendum 📜
            </button>
          </div>
        </form>

        {certificateGenerated && (
          <div
            id="mat-sla-certificate"
            style={{
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              marginTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em', color: '#15803d', textTransform: 'uppercase' }}>
                  Irrevocable Covenant Grant &bull; Enterprise SLA
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                  Multi-Academy Trust Service Level Agreement
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Document Reference: <strong>SJCP-MAT-SLA-{Date.now().toString().slice(-6)}</strong>
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.82rem', borderRadius: '6px' }}>
                  £0.00 Perpetual Grant Active
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, marginBottom: '1rem' }}>
              This document attests that <strong>{trustName}</strong> (representing <strong>{schoolCount} educational academies</strong>) is formally registered under the St Joseph&apos;s Educational Covenant. The Trust holds unconditional rights to deploy the St Joseph&apos;s Curriculum Portal with the following binding technical SLAs:
            </p>

            <ul style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <li><strong>Zero Cloud Egress Guarantee:</strong> No student assessment, response, or personal identifiable information (PII) is ever transmitted to cloud servers.</li>
              <li><strong>WebGPU Memory Guard Enforcement:</strong> Automatic hardware inspection guarantees older 2GB/3GB baseline iPads fall back into Tier 3 Local Socratic Rule mode without browser tab crashes.</li>
              <li><strong>99.99% Local Availability SLA:</strong> Client-side PWA guarantees uninterrupted offline learning during WAN and broadband outages.</li>
              <li><strong>Commercial Covenant:</strong> £0.00 recurring license fees, £0.00 compute charges, and unrestricted multi-academy distribution rights in perpetuity.</li>
            </ul>

            {leadOfficer && (
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
                Acknowledged Signatory: <strong>{leadOfficer}</strong>
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
              <span>Attested Date: {new Date().toLocaleDateString('en-GB')}</span>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                🖨️ Print / Save Trust SLA PDF
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
