import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@theme/Layout';

export default function LicensingPage(): React.JSX.Element {
  const [selectedOrgType, setSelectedOrgType] = useState<string>('catholic');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [covenantGenerated, setCovenantGenerated] = useState<boolean>(false);

  const orgTypes = [
    {
      id: 'catholic',
      label: 'Catholic School / Diocese / Parish',
      status: '100% Free in Perpetuity',
      statusColor: '#15803d',
      statusBg: '#f0fdf4',
      badge: 'Covenant Grant',
      description:
        'All Catholic primary & secondary schools, diocesan multi-academy trusts (MATs), mission schools, parishes, and religious orders worldwide are granted unconditional, perpetual free access.',
    },
    {
      id: 'developing',
      label: 'Emerging Nation / Community School (DAC/ODA)',
      status: '100% Free in Perpetuity',
      statusColor: '#15803d',
      statusBg: '#f0fdf4',
      badge: 'Global Equity Grant',
      description:
        'Educational institutions, community hubs, and NGOs in nations listed on the OECD DAC List of Official Development Assistance recipients receive unrestricted, free access with offline deployment rights.',
    },
    {
      id: 'state_school',
      label: 'State School / Maintained School (UK & Global)',
      status: 'Free Open Curriculum',
      statusColor: '#0284c7',
      statusBg: '#f0f9ff',
      badge: 'Public Education',
      description:
        'Maintained state schools and public academies are welcome to use the curriculum portal and on-device AI tutors freely under open educational provisions.',
    },
    {
      id: 'commercial',
      label: 'Commercial Tutoring / Independent Fee-Paying School',
      status: 'Cross-Subsidisation Partner',
      statusColor: '#b45309',
      statusBg: '#fffbeb',
      badge: 'Partner License',
      description:
        'Commercial tutoring platforms and fee-paying private schools participate in our sustainable cross-subsidisation model, where fees directly fund curriculum authoring and translation for mission schools.',
    },
  ];

  const currentOrg = orgTypes.find((o) => o.id === selectedOrgType) || orgTypes[0];

  return (
    <Layout
      title="Mission & Licensing Covenant"
      description="St Joseph's Educational Covenant: Guaranteed 100% free access in perpetuity for all Catholic organisations and emerging nations worldwide."
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        
        {/* Header Badge */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.88rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}
          >
            <span>🕊️ The St Joseph's Educational Covenant</span>
            <span>&bull;</span>
            <span>Universal Access Charter</span>
          </div>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '1rem',
              letterSpacing: '-0.025em',
            }}
          >
            Mission &amp; Licensing Framework
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Education is a universal human dignity. By leveraging <strong>zero-cloud on-device Edge AI</strong>,
            St Joseph&apos;s Curriculum Portal provides high-quality, interactive learning that is{' '}
            <span style={{ color: '#15803d', fontWeight: 700 }}>100% free in perpetuity for all Catholic organisations</span>{' '}
            and <span style={{ color: '#15803d', fontWeight: 700 }}>emerging nations worldwide</span>.
          </p>
        </div>

        {/* The 3 Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Pillar 1: Catholic Organisations */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #bbf7d0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 14px rgba(21, 128, 61, 0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>⛪</div>
            <div
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#f0fdf4',
                color: '#15803d',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              PERPETUAL FREE GRANT
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              All Catholic Organisations
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem', flexGrow: 1 }}>
              Grounded in the Catholic Social Teaching principle of the <em>Universal Destination of Goods</em> and pastoral care for the young:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
              <li><strong>Zero Licence Fees:</strong> No per-pupil, per-school, or per-diocesan fees ever.</li>
              <li><strong>Zero Cloud Compute Costs:</strong> In-browser Gemini Nano runs locally with zero API bills.</li>
              <li><strong>Pastoral Privacy:</strong> Absolute zero cloud data harvesting or student tracking.</li>
            </ul>
          </div>

          {/* Pillar 2: Emerging Nations */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #bfdbfe',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>🌍</div>
            <div
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              GLOBAL EQUITY GRANT
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Emerging Nations &amp; Communities
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem', flexGrow: 1 }}>
              Eliminating the digital divide for developing economies (DAC/ODA recipient nations) and underserved rural schools:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
              <li><strong>100% Offline Capability:</strong> Installs as an offline Progressive Web App (PWA).</li>
              <li><strong>Zero Data Bandwidth:</strong> Runs seamlessly without active cellular or broadband internet.</li>
              <li><strong>Low-Spec Hardware:</strong> Optimized for budget Chromebooks and affordable Android tablets.</li>
            </ul>
          </div>

          {/* Pillar 3: Cross-Subsidization */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #fed7aa',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 14px rgba(180, 83, 9, 0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>🤝</div>
            <div
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#fffbeb',
                color: '#b45309',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              SUSTAINABLE PARTNERSHIP
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Commercial Cross-Subsidisation
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem', flexGrow: 1 }}>
              How the platform remains commercially viable and perpetually funded without external venture debt:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
              <li><strong>Fair Commercial Licensing:</strong> Independent schools and commercial tutoring firms pay a modest annual partner fee.</li>
              <li><strong>Direct Impact:</strong> 100% of commercial revenue funds curriculum authoring, translation, and offline distribution.</li>
              <li><strong>Ethical Alignment:</strong> Partners receive verified ethical AI attestations.</li>
            </ul>
          </div>
        </div>

        {/* Interactive Eligibility & Covenant Verifier */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2.5rem',
            marginBottom: '3.5rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', textAlign: 'center' }}>
              Check Institutional Eligibility &amp; Generate Covenant
            </h2>
            <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Verify your organisation&apos;s license tier and generate a formal Statement of Free Use for your governing body or school board.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Select Organisation Type:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem' }}>
                {orgTypes.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrgType(org.id);
                      setCovenantGenerated(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: selectedOrgType === org.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: selectedOrgType === org.id ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: selectedOrgType === org.id ? '#1d4ed8' : '#0f172a' }}>
                      {org.label}
                    </div>
                    <div
                      style={{
                        marginTop: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: org.statusColor,
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: org.statusBg,
                      }}
                    >
                      {org.badge}: {org.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Status Details Box */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                background: currentOrg.statusBg,
                border: `1px solid ${currentOrg.statusColor}40`,
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <span style={{ fontWeight: 800, color: currentOrg.statusColor, fontSize: '1.05rem' }}>
                  {currentOrg.label} — {currentOrg.status}
                </span>
              </div>
              <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {currentOrg.description}
              </p>
            </div>

            {/* Interactive Covenant Form */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Generate Official Covenant Certificate
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Enter your institution name to create an official, printable attestation of free software rights for your Data Protection Officer (DPO) and governors.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. St John Fisher RC Primary / Diocese of Westminster"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  style={{
                    flex: '1 1 300px',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setCovenantGenerated(true)}
                  disabled={!institutionName.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    background: institutionName.trim() ? '#15803d' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: institutionName.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Generate Covenant Attestation
                </button>
              </div>

              {/* Generated Certificate Display */}
              {covenantGenerated && institutionName.trim() && (
                <div
                  id="covenant-certificate"
                  style={{
                    marginTop: '1.5rem',
                    padding: '2rem',
                    background: '#ffffff',
                    border: '2px dashed #15803d',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🕊️</div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                      St Joseph&apos;s Educational Covenant
                    </h4>
                    <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, letterSpacing: '0.05em' }}>
                      OFFICIAL PERPETUAL SOFTWARE GRANT
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, marginBottom: '1rem' }}>
                    This certificate confirms that <strong>{institutionName}</strong> is registered under the{' '}
                    <strong>{currentOrg.label}</strong> charter. Under the St Joseph&apos;s Universal Educational Covenant, this institution holds an irrevocable, perpetual right to utilize the St Joseph&apos;s Curriculum Portal, including on-device AI tutors and diagnostic engines, with:
                  </p>

                  <ul style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    <li><strong>£0.00 Software Licensing Fees</strong> (zero recurring seat or subscription charges)</li>
                    <li><strong>£0.00 Cloud Compute Charges</strong> (all inference is executed locally on-device)</li>
                    <li><strong>Full UK GDPR &amp; Children&apos;s Code Compliance</strong> (guaranteed zero cloud egress of pupil work)</li>
                    <li><strong>Offline PWA Distribution Rights</strong> for all student Chromebooks, PCs, and tablets</li>
                  </ul>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>Date of Attestation: {new Date().toLocaleDateString('en-GB')}</span>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#1e293b',
                      }}
                    >
                      🖨️ Print / Save PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Legal & Open Source Attributions */}
        <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Open Standards &amp; Curriculum Licensing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Curriculum Content: OGL v3.0
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Curriculum lesson topics, knowledge structures, and learning goals are derived from open educational materials published under the{' '}
                <a
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                >
                  UK Open Government Licence (OGL v3.0)
                </a>
                , aligned with Oak National Academy curriculum sequencing.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Open-Source Software Core
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                The core client-side Single Page Application, WebRTC supervisor daemon, and S-Expression AST parsers are made freely available for non-commercial educational, pastoral, and community enhancement under permissive open licensing terms.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Data Protection &amp; Zero Cloud Egress
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Compliant with UK GDPR, Data Protection Act 2018, and the Age Appropriate Design Code (Children&apos;s Code). Review our comprehensive{' '}
                <Link to="/privacy" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>
                  Privacy &amp; GDPR compliance disclosures
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
