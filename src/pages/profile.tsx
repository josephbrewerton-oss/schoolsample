// src/pages/profile.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  getLearnerProfile,
  saveLearnerProfile,
  getLearnerAnalytics,
  generateRandomAlias,
  purgeAllLearnerData,
  exportLearnerPassportJson,
  downloadLearnerCertificateHtml,
  LearnerAnalytics,
} from '../services/studentProfileStore';

const AVATAR_OPTIONS = ['🦉', '🦅', '🐬', '🦦', '🦊', '🐦', '🐆', '🐺', '🔬', '🚀', '🌟', '📚'];

export default function StudentProfilePage() {
  const [analytics, setAnalytics] = useState<LearnerAnalytics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState('');
  const [avatar, setAvatar] = useState('🦉');
  const [keyStage, setKeyStage] = useState('Key Stage 2');
  const [cohortCode, setCohortCode] = useState('Primary Group');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');

  const refreshData = async () => {
    const data = await getLearnerAnalytics();
    setAnalytics(data);
    setAlias(data.profile.alias);
    setAvatar(data.profile.avatarEmoji);
    setKeyStage(data.profile.keyStage);
    setCohortCode(data.profile.cohortCode);
  };

  useEffect(() => {
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener('learner_profile_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('learner_profile_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveLearnerProfile({
      alias: alias.trim() || 'Curious Explorer',
      avatarEmoji: avatar,
      keyStage,
      cohortCode: cohortCode.trim() || 'Primary Group',
    });
    setIsEditing(false);
    setSaveNotification('Profile updated successfully!');
    setTimeout(() => setSaveNotification(''), 3000);
    refreshData();
  };

  const handleRandomizeAlias = () => {
    const random = generateRandomAlias();
    setAlias(random.alias);
    setAvatar(random.avatar);
  };

  const handleConfirmWipe = async () => {
    await purgeAllLearnerData();
    setShowDeleteModal(false);
    await refreshData();
    setSaveNotification('All local learner data has been completely erased.');
    setTimeout(() => setSaveNotification(''), 4000);
  };

  return (
    <Layout title="Learner Profile & Passport" description="100% On-Device, GDPR-Compliant Student Learning Passport">
      <main style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
        {/* Top Header & Privacy Guarantee Pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              👤 Student Learning Passport
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Offline mastery tracking, strengths index, and verifiable curriculum progress.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              color: '#065f46',
              fontWeight: 700,
            }}
          >
            <span>🔒 100% On-Device &amp; Private</span>
            <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 500 }}>(Zero Cloud Telemetry)</span>
          </div>
        </div>

        {saveNotification && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            ✅ {saveNotification}
          </div>
        )}

        {/* Profile Identity Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
          }}
        >
          {!isEditing ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    border: '2px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                  }}
                >
                  {analytics?.profile.avatarEmoji || '🦉'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {analytics?.profile.alias || 'Curious Explorer'}
                    </h2>
                    <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {analytics?.profile.keyStage}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Class / Cohort: <strong>{analytics?.profile.cohortCode || 'Primary Group'}</strong> • Member since{' '}
                    {new Date(analytics?.profile.createdAt || Date.now()).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Edit Alias
                </button>
                <button
                  type="button"
                  onClick={downloadLearnerCertificateHtml}
                  style={{
                    padding: '8px 16px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  📄 Print Certificate
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                ✏️ Edit Student Alias &amp; Key Stage
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
                🛡️ <strong>GDPR Child Protection Notice:</strong> To protect pupil privacy, please use a fun alias (e.g. animal moniker). Never enter a pupil&apos;s full legal name, home address, or contact details.
              </p>

              {/* Avatar Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Choose Avatar
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        fontSize: '1.5rem',
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        border: avatar === av ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: avatar === av ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Learner Alias (Pseudonym)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      maxLength={30}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRandomizeAlias}
                      title="Generate random pseudonym"
                      style={{
                        padding: '8px 12px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      🎲 Random
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Key Stage
                  </label>
                  <select
                    value={keyStage}
                    onChange={(e) => setKeyStage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      background: '#ffffff',
                    }}
                  >
                    <option value="Key Stage 1">Key Stage 1 (Ages 5-7)</option>
                    <option value="Key Stage 2">Key Stage 2 (Ages 7-11)</option>
                    <option value="Key Stage 3">Key Stage 3 (Ages 11-14)</option>
                    <option value="Key Stage 4">Key Stage 4 / GCSE (Ages 14-16)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Class / Cohort Code
                  </label>
                  <input
                    type="text"
                    value={cohortCode}
                    onChange={(e) => setCohortCode(e.target.value)}
                    maxLength={20}
                    placeholder="e.g. Year 4 Oak"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* High-Level Mastery Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563eb' }}>{analytics?.totalAttempts || 0}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
              Questions Answered
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669' }}>
              {analytics?.overallAccuracy || 0}%
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
              Overall Accuracy
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7c3aed' }}>
              {analytics?.topicsMasteredCount || 0}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
              Units Mastered
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#d97706' }}>
              ⭐ {analytics?.totalCorrect || 0}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
              Stars Earned
            </div>
          </div>
        </div>

        {/* Topic Mastery Grid */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Curriculum Unit Mastery
            </h2>
            <Link
              to="/practice-lab"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              + Practice More in Lab &rarr;
            </Link>
          </div>

          {analytics && analytics.topicBreakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analytics.topicBreakdown.map((t) => (
                <div
                  key={t.topicId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{t.displayName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      {t.correctCount} of {t.attempts} questions correct ({t.accuracyPercent}%)
                    </div>
                  </div>

                  <div>
                    {t.status === 'Mastered' && (
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem' }}>
                        🏆 Mastered
                      </span>
                    )}
                    {t.status === 'Practicing' && (
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem' }}>
                        ⚡ Practicing
                      </span>
                    )}
                    {t.status === 'Exploring' && (
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600, fontSize: '0.8rem' }}>
                        🌱 Exploring
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>No practice sessions logged on this browser yet.</p>
              <Link
                to="/practice-lab"
                style={{
                  display: 'inline-block',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                Start Practicing Now
              </Link>
            </div>
          )}
        </div>

        {/* GDPR, Data Sovereignty & Export Section */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            🛡️ Data Sovereignty &amp; GDPR Rights
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
            St Joseph is built under the <strong>UK GDPR and the Age Appropriate Design Code (Children&apos;s Code)</strong>.
            All learning progress, star tallies, and error diagnostics are stored exclusively inside your browser&apos;s on-device storage. No personal data or learning analytics are transmitted to our servers or third parties.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={exportLearnerPassportJson}
              style={{
                padding: '9px 16px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              📥 Export Data (JSON)
            </button>

            <button
              type="button"
              onClick={downloadLearnerCertificateHtml}
              style={{
                padding: '9px 16px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              📄 Download Certificate (HTML)
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '9px 16px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🗑️ Erase All My Data (GDPR Art. 17)
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Data Erasure */}
        {showDeleteModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                maxWidth: '480px',
                width: '100%',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c', margin: '0 0 0.5rem 0' }}>
                ⚠️ Permanently Erase All Data?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                This will wipe your on-device Learner Profile, all completed quiz logs, star points, and topic mastery records from this browser. This action is irreversible.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWipe}
                  style={{
                    padding: '8px 16px',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Yes, Erase Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
