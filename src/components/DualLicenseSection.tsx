import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DualLicenseSection(): React.JSX.Element {
  const [selectedScenario, setSelectedScenario] = useState<string>('teacher');
  const [copiedLicense, setCopiedLicense] = useState<boolean>(false);

  const scenarios = [
    {
      id: 'teacher',
      label: 'Classroom Teacher / School Governor',
      desc: 'Using the player on classroom SMART boards, laptops, and student Chromebooks.',
      track: 'A',
      verdict: 'Track A: Humanitarian Commons (GNU AGPLv3 / OGL v3.0)',
      cost: '£0.00 Forever',
      details:
        'You have full, unconditional legal rights to use, project, offline-cache, and share all simulations. Zero licensing costs, zero cloud fees, and zero account logins.',
    },
    {
      id: 'mat_trust',
      label: 'Multi-Academy Trust (MAT) / Local Authority',
      desc: 'Deploying the portal across 10 to 50+ maintained state or Catholic schools.',
      track: 'A',
      verdict: 'Track A: Humanitarian Commons (GNU AGPLv3 / OGL v3.0)',
      cost: '£0.00 Forever',
      details:
        'All schools in your trust are fully covered under the St Joseph’s Covenant. You can self-host, mirror, or use our CDN. No procurement tender or software licenses required.',
    },
    {
      id: 'developing_nation',
      label: 'Emerging Nation School / NGO / Mission',
      desc: 'Operating in rural or low-bandwidth regions (OECD DAC ODA recipients).',
      track: 'A',
      verdict: 'Track A: Humanitarian Commons (Global Equity Grant)',
      cost: '£0.00 Forever',
      details:
        'Full offline deployment rights. Micro-footprint (<15KB) lessons require zero active cellular data. Unconditional perpetual grant.',
    },
    {
      id: 'open_source',
      label: 'Open-Source Developer / Researcher',
      desc: 'Forking the AST Vector Player or building public educational extensions.',
      track: 'A',
      verdict: 'Track A: GNU Affero GPL v3.0 (Copyleft)',
      cost: '£0.00 Forever',
      details:
        'You may freely inspect, fork, and enhance the code. Under AGPLv3 Section 13, any derivative network deployments must remain open-source under the same terms.',
    },
    {
      id: 'commercial_vendor',
      label: 'Commercial EdTech Vendor / Closed SaaS',
      desc: 'Embedding the SVG vector engine inside a proprietary, fee-paying commercial product.',
      track: 'B',
      verdict: 'Track B: Enterprise Commercial License Required',
      cost: 'Commercial Royalty / Partnership Agreement',
      details:
        'Because GNU AGPLv3 requires reciprocal open-sourcing of network services, closed-source commercial platforms must obtain a Track B Commercial License. 100% of commercial proceeds fund free school hardware and translations.',
    },
  ];

  const activeScenario = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  const handleCopyLegalSummary = () => {
    const legalText = `St Joseph's Curriculum Portal — Dual-Licensing Summary
Track A (Humanitarian Commons): GNU AGPLv3 (Software) & OGL v3.0 (Curriculum). 100% Free in perpetuity for all state schools, Catholic organisations, charities, and emerging nations.
Track B (Commercial Enterprise): Available for proprietary closed-source redistribution.
Full text: https://github.com/josephbrewerton-oss/schoolsample/blob/main/LICENSE.md`;
    navigator.clipboard.writeText(legalText);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 3000);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Overview Intro Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '2.25rem 2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚖️</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Permanent Anti-Enclosure Architecture
          </span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
          Why Dual-Licensing? Protecting the Educational Commons
        </h2>
        <p style={{ fontSize: '1.02rem', color: '#cbd5e1', lineHeight: 1.65, maxWidth: '840px', margin: 0 }}>
          High-performance educational breakthroughs are often targeted by venture-backed software monopolies who take open-source code, strip the humanitarian mission, wrap it in a proprietary paywall, and sell it back to cash-strapped schools.
          Our <strong>Dual-Licensing Charter</strong> solves this: it guarantees <strong>unconditional, permanent freedom for schools and children</strong> while legally requiring commercial software vendors to pay their fair share to fund student hardware.
        </p>
      </div>

      {/* The Two Tracks Side-by-Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {/* Track A Card */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.2rem' }}>🕊️</span>
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              100% Free Forever
            </span>
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Track A: Humanitarian Commons
          </h3>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginBottom: '1rem' }}>
            GNU AGPLv3 (Software) &bull; OGL v3.0 (Curriculum)
          </div>

          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Designed exclusively for schools, pupils, teachers, faith communities, and emerging nations:
          </p>

          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1 }}>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>£0.00 in Perpetuity:</strong> Unconditional free use for all state and Catholic educational bodies worldwide.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Offline PWA Rights:</strong> Unlimited classroom projection, school network mirroring, and local caching.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Zero Data Egress:</strong> Fully compliant with UK GDPR &amp; KCSIE; pupil logs remain locked on-device.
            </li>
            <li style={{ marginBottom: 0 }}>
              <strong>Copyleft Reciprocity Shield:</strong> Under GNU AGPLv3 §13, any derivative network deployments must remain open-source. Commercial firms cannot privatize the code.
            </li>
          </ul>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '0.82rem',
              color: '#14532d',
              fontWeight: 600,
            }}
          >
            ✅ Applies automatically to all schools, parishes, and pupils. No paperwork required.
          </div>
        </div>

        {/* Track B Card */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #ea580c',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.2rem' }}>🏛️</span>
            <span
              style={{
                background: '#ffedd5',
                color: '#c2410c',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Enterprise Commercial
            </span>
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Track B: Commercial License
          </h3>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ea580c', marginBottom: '1rem' }}>
            Proprietary Exemption &bull; B2B Partnership
          </div>

          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            For commercial LMS platforms, proprietary EdTech vendors, and closed-source software publishers:
          </p>

          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1 }}>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>Proprietary Exemption:</strong> Embed the AST Vector Engine and SlideScript inside closed-source commercial software without releasing your proprietary code.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              <strong>B2B SLA &amp; Support:</strong> Custom integration engineering, guaranteed uptime SLAs, and commercial indemnification.
            </li>
            <li style={{ marginBottom: 0 }}>
              <strong>100% Social Reinvestment:</strong> All licensing royalties flow directly into the St Joseph’s Trust to purchase free Chromebooks for disadvantaged children and translate lessons for developing nations.
            </li>
          </ul>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              fontSize: '0.82rem',
              color: '#9a3412',
              fontWeight: 600,
            }}
          >
            🤝 Commercial licensing enquiries: <code>licensing@stjosephs-curriculum.internal</code>
          </div>
        </div>
      </div>

      {/* Interactive License Selector Tool */}
      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        }}
      >
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', textAlign: 'center' }}>
          Interactive License Advisor: Which License Applies to You?
        </h3>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Select your organisation profile to view your exact legal rights, costs, and compliance obligations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenario(sc.id)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'left',
                border: selectedScenario === sc.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: selectedScenario === sc.id ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedScenario === sc.id ? '#1d4ed8' : '#0f172a', marginBottom: '0.25rem' }}>
                {sc.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                {sc.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Verdict Box */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: '14px',
            background: activeScenario.track === 'A' ? '#f0fdf4' : '#fff7ed',
            border: activeScenario.track === 'A' ? '2px solid #86efac' : '2px solid #fdba74',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>{activeScenario.track === 'A' ? '🕊️' : '💼'}</span>
              <strong style={{ fontSize: '1.15rem', color: activeScenario.track === 'A' ? '#166534' : '#9a3412' }}>
                {activeScenario.verdict}
              </strong>
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: activeScenario.track === 'A' ? '#16a34a' : '#ea580c',
                color: '#ffffff',
              }}
            >
              {activeScenario.cost}
            </span>
          </div>

          <p style={{ margin: 0, color: '#334155', fontSize: '0.94rem', lineHeight: 1.65 }}>
            {activeScenario.details}
          </p>
        </div>
      </section>

      {/* Legal Text & Repository Link */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            Official Legal Declaration (`LICENSE.md`)
          </h4>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
            View the formal Dual-Licensing legal charter in our public open-source repository.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopyLegalSummary}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{copiedLicense ? '✅' : '📋'}</span>
            <span>{copiedLicense ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>
          <a
            href="https://github.com/josephbrewerton-oss/schoolsample/blob/main/LICENSE.md"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: '#0f172a',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📦 Open LICENSE.md</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
