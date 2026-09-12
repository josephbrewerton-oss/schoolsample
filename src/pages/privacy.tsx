import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function PrivacyPage(): React.JSX.Element {
  return (
    <PageMeta
      title="Privacy, GDPR & Legal Disclaimers"
      description="Legal compliance disclosures for St Joseph's Curriculum Portal: UK GDPR, Children's Code, PECR No-Cookies Policy, and UNCRC safeguarding standards."
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <span>🛡️ Legal &amp; Data Protection Compliance</span>
            <span>&bull;</span>
            <span>UK GDPR &amp; Children&apos;s Code</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em',
            }}
          >
            Privacy, GDPR &amp; Cookie Disclaimers
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, maxWidth: '780px' }}>
            St Joseph&apos;s Curriculum Portal is engineered with privacy as an immutable mathematical guarantee. 
            All pupil progress, question attempts, and AI evaluations occur strictly on the student&apos;s local device with zero cloud data egress.
          </p>
        </div>

        {/* Compliance Badges Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🇬🇧</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
              UK GDPR Compliant
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Data Protection Act 2018. Art. 5 Data Minimisation, Art. 17 Right to Erasure, and Art. 20 Portability built-in.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧒</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
              ICO Children&apos;s Code
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Adheres to all 15 standards of the Age Appropriate Design Code. Maximum privacy default, zero profiling, zero nudges.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍪</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
              Zero Tracking Cookies
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              PECR compliant. Zero third-party cookies, zero tracking beacons, and zero advertising tags.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📜</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
              OGL v3.0 Curriculum
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Oak National Academy &amp; UK National Curriculum materials delivered under the Open Government Licence v3.0.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Section 1 */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔒</span> 1. Zero Cloud Data Egress (Privacy by Architecture)
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>
                Unlike commercial educational platforms that upload student work, assessment scores, and audio to central servers for behavioral profiling, <strong>St Joseph&apos;s Curriculum Portal has no remote student database</strong>.
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li><strong>On-Device Persistence:</strong> All student profiles, star tallies, mastery badges, and diagnostic logs are stored exclusively within the student&apos;s local browser IndexedDB (<code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>dbStore.ts</code>).</li>
                <li><strong>No Cloud AI Leakage:</strong> Question evaluations and Socratic hints run locally via Chrome&apos;s Prompt API (Gemini Nano) or WebLLM directly inside the browser. Pupil answers are never transmitted to cloud LLMs or used for model training.</li>
                <li><strong>Full Offline Autonomy:</strong> The application functions completely when disconnected from the internet, ensuring resilience on school networks.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🍪</span> 2. No-Tracking Cookies Policy (PECR Compliance)
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  background: '#f8fafc',
                  borderLeft: '4px solid #0284c7',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                Why don&apos;t you see a cookie banner on this portal? Because under the <strong>Privacy and Electronic Communications Regulations (PECR)</strong>, cookie banners are only legally required when deploying non-essential tracking or advertising cookies. <strong>We do not use any.</strong>
              </div>

              <p>
                This site drops <strong>0 tracking cookies</strong>, <strong>0 third-party marketing beacons</strong>, and <strong>0 web trackers</strong> (no Google Analytics, no Facebook Pixels, no Hotjar).
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0.5rem 0 0.25rem' }}>
                Essential Local Storage Keys (Strictly Functional):
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '8px 12px' }}>Storage Key</th>
                      <th style={{ padding: '8px 12px' }}>Purpose</th>
                      <th style={{ padding: '8px 12px' }}>Duration</th>
                      <th style={{ padding: '8px 12px' }}>Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>app_universal_lang</td>
                      <td style={{ padding: '8px 12px' }}>Remembers chosen translation language (e.g. Polish, Ukrainian, Spanish)</td>
                      <td style={{ padding: '8px 12px' }}>Persistent (Client)</td>
                      <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 600 }}>Strictly Necessary</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>theme</td>
                      <td style={{ padding: '8px 12px' }}>Stores light / dark visual theme preference</td>
                      <td style={{ padding: '8px 12px' }}>Persistent (Client)</td>
                      <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 600 }}>Strictly Necessary</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>app_font_size / app_high_contrast</td>
                      <td style={{ padding: '8px 12px' }}>Remembers accessibility and low-vision visual settings</td>
                      <td style={{ padding: '8px 12px' }}>Persistent (Client)</td>
                      <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 600 }}>Strictly Necessary</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>st_josephs_edge_db</td>
                      <td style={{ padding: '8px 12px' }}>IndexedDB database storing student practice question stars and diagnostic notes</td>
                      <td style={{ padding: '8px 12px' }}>Persistent (Client)</td>
                      <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 600 }}>Strictly Necessary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚖️</span> 3. UK GDPR Rights &amp; Safe Moniker Policy
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>
                In compliance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>, students and parents possess full autonomy over their learning records:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a' }}>Right of Access (Article 15)</strong>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    View complete mastery records, topic-by-topic accuracy scores, and diagnostic reflections anytime inside the <Link to="/profile" style={{ color: '#2563eb' }}>Learner Passport</Link>.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a' }}>Right to Erasure (Article 17)</strong>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    Click &ldquo;Erase All My Data&rdquo; in the Learner Passport to immediately wipe all local IndexedDB records, cached responses, and star tallies.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a' }}>Right to Data Portability (Article 20)</strong>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    Export a full JSON passport or download a self-contained, verifiable HTML progress certificate to share with teachers or parents.
                  </p>
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a' }}>Child Moniker Policy</strong>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    To uphold child data protection, pupils must use creative monikers (e.g. &ldquo;Curious Owl&rdquo;). Never enter full legal names, addresses, or phone numbers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛡️</span> 4. Age Appropriate Design Code (The Children&apos;s Code) &amp; UNCRC
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>
                This application aligns with the <strong>Information Commissioner&apos;s Office (ICO) Age Appropriate Design Code</strong> and <strong>UNCRC Article 16 (Child Privacy)</strong>:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li><strong>High Privacy by Default:</strong> Device capabilities (such as local AI inference or microphone speech-to-text) are gated behind explicit student/teacher consent in <Link to="/settings" style={{ color: '#2563eb' }}>Settings</Link>.</li>
                <li><strong>Zero Profiling &amp; Dark Patterns:</strong> There are no commercial advertisements, in-app purchases, loot-boxes, algorithmic feeds, or addictive nudge mechanisms.</li>
                <li><strong>Zero Geolocation:</strong> We never request, read, or record the physical location of student devices.</li>
                <li><strong>Keeping Children Safe in Education (KCSIE):</strong> AI prompts are deterministic, token-efficient S-Expressions designed solely for educational scaffold hints, preventing exposure to inappropriate open-ended generative chat.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: International Jurisdictions: California & India */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌐</span> 5. California (AB 2273 &amp; SOPIPA) &amp; India (DPDP Act 2023) Compliance
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>
                To support international classrooms and overseas school partnerships, our privacy architecture complies with the highest standards in both North America and South Asia:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>
                  <strong>State of California (USA):</strong>
                  <br />
                  &bull; <em>California Age-Appropriate Design Code Act (AB 2273 / CAADCA):</em> Implements highest privacy by default, prohibits commercial nudges, and uses plain, age-appropriate language.
                  <br />
                  &bull; <em>Student Online Personal Information Protection Act (SOPIPA):</em> We never amass student profiles for commercial use, target advertisements to pupils, or sell pupil data.
                  <br />
                  &bull; <em>Cal. Civil Code § 1632 Translation Mandate:</em> All legal caveats and on-device AI consent notices are available in Spanish and all portal operational languages.
                </li>
                <li style={{ marginTop: '0.75rem' }}>
                  <strong>Republic of India:</strong>
                  <br />
                  &bull; <em>Digital Personal Data Protection Act, 2023 (DPDP Act) Section 9:</em> Prohibits behavioral tracking or targeted advertising directed at children. Because all inference is on-device without cloud data fiduciaries, no child personal data is transmitted.
                  <br />
                  &bull; <em>DPDP Act Section 5(3) Multi-Language Mandate:</em> Notices and consent disclosures are provided in regional languages (including Hindi, Bengali, and Urdu) in accordance with the 8th Schedule to the Constitution of India.
                  <br />
                  &bull; <em>MeitY AI Labelling Rules:</em> All AI tutoring interactions and synthetic question generations are clearly labelled with on-device AI badges.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📖</span> 6. Educational Frameworks &amp; Copyright Disclaimers
            </h2>
            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>
                Curriculum frameworks, learning sequences, and subject unit structures featured in this portal are aligned with the <strong>UK National Curriculum (Key Stages 1 to 4)</strong> and incorporate open curriculum design patterns published by <strong>Oak National Academy</strong> under the terms of the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Open Government Licence v3.0 (OGL v3.0)</a>.
              </p>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                St Joseph&apos;s Curriculum Portal is an independent educational tool developed to foster student self-efficacy, independent practice, and digital inclusion.
              </p>
            </div>
          </section>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem' }}>
            <Link
              to="/profile"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.92rem',
              }}
            >
              ⭐ Manage Your Local Data in Profile
            </Link>
            <Link
              to="/settings"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.92rem',
              }}
            >
              ⚙️ Review AI &amp; Device Consent Settings
            </Link>
          </div>
        </div>
      </div>
    </PageMeta>
  );
}
