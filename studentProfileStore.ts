// src/services/studentProfileStore.ts
import { getAllProgressRecords, clearAllStudentProgress, StudentRecord } from './dbStore';

export interface LearnerProfile {
  alias: string;
  avatarEmoji: string;
  keyStage: string;
  cohortCode: string;
  createdAt: number;
  starsEarned: number;
  streakPeak: number;
}

export interface TopicMasteryStat {
  topicId: string;
  displayName: string;
  attempts: number;
  correctCount: number;
  accuracyPercent: number;
  status: 'Mastered' | 'Practicing' | 'Exploring';
}

export interface LearnerAnalytics {
  profile: LearnerProfile;
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  topicsPracticedCount: number;
  topicsMasteredCount: number;
  topicBreakdown: TopicMasteryStat[];
  recentHistory: StudentRecord[];
}

const STORAGE_KEY_PROFILE = 'school_learner_profile';

const DEFAULT_ADJECTIVES = ['Curious', 'Bright', 'Quick', 'Eager', 'Stargazing', 'Brave', 'Wise', 'Clever', 'Inventive'];
const DEFAULT_ANIMALS = ['Owl', 'Falcon', 'Dolphin', 'Otter', 'Fox', 'Robin', 'Cheetah', 'Wolf', 'Explorer'];
const DEFAULT_AVATARS = ['🦉', '🦅', '🐬', '🦦', '🦊', '🐦', '🐆', '🐺', '🔬', '🚀', '🌟', '📚'];

function escapeHtml(str: string): string {
  return str.replace(/[&<>'"]/g, (tag) => {
    const chars: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return chars[tag] || tag;
  });
}

export function generateRandomAlias(): { alias: string; avatar: string } {
  const adj = DEFAULT_ADJECTIVES[Math.floor(Math.random() * DEFAULT_ADJECTIVES.length)];
  const animal = DEFAULT_ANIMALS[Math.floor(Math.random() * DEFAULT_ANIMALS.length)];
  const avatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
  return { alias: `${adj} ${animal}`, avatar };
}

export function getLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') {
    return {
      alias: 'Curious Explorer',
      avatarEmoji: '🦉',
      keyStage: 'Key Stage 2',
      cohortCode: 'Primary Group',
      createdAt: Date.now(),
      starsEarned: 0,
      streakPeak: 0,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        alias: parsed.alias ?? 'Curious Explorer',
        avatarEmoji: parsed.avatarEmoji ?? '🦉',
        keyStage: parsed.keyStage ?? 'Key Stage 2',
        cohortCode: parsed.cohortCode ?? 'Primary Group',
        createdAt: parsed.createdAt ?? Date.now(),
        starsEarned: parsed.starsEarned ?? 0,
        streakPeak: parsed.streakPeak ?? 0,
      };
    }
  } catch (err) {
    console.warn('[ProfileStore] Error parsing stored profile:', err);
  }

  // Generate initial fallback profile
  const generated = generateRandomAlias();
  const initial: LearnerProfile = {
    alias: generated.alias,
    avatarEmoji: generated.avatar,
    keyStage: 'Key Stage 2',
    cohortCode: 'Primary Group',
    createdAt: Date.now(),
    starsEarned: 0,
    streakPeak: 0,
  };

  // Directly set storage to avoid the recursive loop
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(initial));
  } catch (err) {
    console.warn('[ProfileStore] Error setting initial profile:', err);
  }

  return initial;
}

export function saveLearnerProfile(updates: Partial<LearnerProfile>): LearnerProfile {
  if (typeof window === 'undefined') {
    return updates as LearnerProfile;
  }

  const current = getLearnerProfile();
  const updated: LearnerProfile = {
    ...current,
    ...updates,
  };

  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('learner_profile_updated', { detail: updated }));
  } catch (err) {
    console.warn('[ProfileStore] Error saving learner profile:', err);
  }

  return updated;
}

export function formatTopicTitle(rawTopicId: string): string {
  if (!rawTopicId) return 'General Study';

  // Grab the specific topic suffix if using namespaces like ks1:sci:1:plants
  const baseName = rawTopicId.includes(':') 
    ? rawTopicId.split(':').pop() || rawTopicId 
    : rawTopicId;

  return baseName
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function getLearnerAnalytics(): Promise<LearnerAnalytics> {
  const profile = getLearnerProfile();
  const records = await getAllProgressRecords();

  const totalAttempts = records.length;
  const totalCorrect = records.filter((r) => r.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Group by topic
  const topicMap = new Map<string, { attempts: number; correct: number }>();
  for (const rec of records) {
    const key = rec.topicId || 'general_practice';
    const entry = topicMap.get(key) || { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (rec.isCorrect) entry.correct += 1;
    topicMap.set(key, entry);
  }

  const topicBreakdown: TopicMasteryStat[] = [];
  let topicsMasteredCount = 0;

  topicMap.forEach((val, topicId) => {
    const accuracy = val.attempts > 0 ? Math.round((val.correct / val.attempts) * 100) : 0;
    let status: 'Mastered' | 'Practicing' | 'Exploring' = 'Exploring';

    if (val.attempts >= 3 && accuracy >= 80) {
      status = 'Mastered';
      topicsMasteredCount += 1;
    } else if (val.attempts >= 2) {
      status = 'Practicing';
    }

    topicBreakdown.push({
      topicId,
      displayName: formatTopicTitle(topicId),
      attempts: val.attempts,
      correctCount: val.correct,
      accuracyPercent: accuracy,
      status,
    });
  });

  topicBreakdown.sort((a, b) => b.attempts - a.attempts);

  // Explicit sort to guarantee newest-first history
  const recentHistory = [...records]
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 15);

  return {
    profile,
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    topicsPracticedCount: topicMap.size,
    topicsMasteredCount,
    topicBreakdown,
    recentHistory,
  };
}

/**
 * GDPR Article 17: Right to Erasure ("Right to be Forgotten")
 * Complete, permanent local wipe of all learner information and quiz attempts.
 */
export async function purgeAllLearnerData(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem('curriculum_standard');
    localStorage.removeItem('oak_curriculum_standard');
  }

  await clearAllStudentProgress();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('learner_profile_purged'));
  }
}

/**
 * GDPR Article 20: Right to Data Portability
 * Export complete learning passport as a human- and machine-readable JSON file.
 */
export async function exportLearnerPassportJson(): Promise<void> {
  if (typeof window === 'undefined') return;

  const analytics = await getLearnerAnalytics();
  const exportPayload = {
    standard: 'St Joseph UK Curriculum Offline Learning Passport',
    gdprCompliant: true,
    dataSovereignty: 'Client-Device Local Only (Zero Cloud Telemetry)',
    exportedAt: new Date().toISOString(),
    profile: analytics.profile,
    summary: {
      totalQuestionsAnswered: analytics.totalAttempts,
      correctAnswers: analytics.totalCorrect,
      overallAccuracyPercent: analytics.overallAccuracy,
      topicsPracticed: analytics.topicsPracticedCount,
      topicsMastered: analytics.topicsMasteredCount,
    },
    topicsMastery: analytics.topicBreakdown,
    recentLog: analytics.recentHistory,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learning_passport_${analytics.profile.alias.replace(/\s+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Printable Offline Learning Certificate & Progress Record
 * Generates an offline HTML card for students, teachers, or parents.
 */
export async function downloadLearnerCertificateHtml(): Promise<void> {
  if (typeof window === 'undefined') return;

  const analytics = await getLearnerAnalytics();
  const p = analytics.profile;

  const safeAlias = escapeHtml(p.alias);
  const safeAvatar = escapeHtml(p.avatarEmoji);
  const safeKeyStage = escapeHtml(p.keyStage);
  const safeCohort = escapeHtml(p.cohortCode);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Learning Passport: ${safeAlias}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 2rem; }
    .passport-card { max-width: 720px; margin: 0 auto; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 2.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .badge-bar { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .avatar { font-size: 3.5rem; background: #eff6ff; border-radius: 50%; width: 75px; height: 75px; display: flex; align-items: center; justify-content: center; border: 2px solid #bfdbfe; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; text-align: center; }
    .stat-val { font-size: 1.75rem; font-weight: 800; color: #2563eb; }
    .stat-lbl { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
    .topic-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; }
    .mastered-badge { background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; }
    .practicing-badge { background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; }
    .footer-note { margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed #cbd5e1; font-size: 0.8rem; color: #64748b; text-align: center; }
    @media print { body { background: #ffffff; padding: 0; } .passport-card { box-shadow: none; border: 1px solid #000; } }
  </style>
</head>
<body>
  <div class="passport-card">
    <div class="badge-bar">
      <div style="display: flex; align-items: center; gap: 1.25rem;">
        <div class="avatar">${safeAvatar}</div>
        <div>
          <h1 style="margin: 0; font-size: 1.75rem; color: #0f172a;">${safeAlias}</h1>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.95rem;">${safeKeyStage} • Cohort: ${safeCohort}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 0.85rem; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 8px;">
          Offline-Verified Passport
        </span>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">Date: ${new Date().toLocaleDateString('en-GB')}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-val">${analytics.totalAttempts}</div>
        <div class="stat-lbl">Questions Done</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${analytics.overallAccuracy}%</div>
        <div class="stat-lbl">Accuracy</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">${analytics.topicsMasteredCount}</div>
        <div class="stat-lbl">Units Mastered</div>
      </div>
    </div>

    <h2 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 0.75rem;">Curriculum Mastery Index</h2>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      ${
        analytics.topicBreakdown.length > 0
          ? analytics.topicBreakdown
              .map(
                (t) => `
        <div class="topic-row">
          <div>
            <strong>${escapeHtml(t.displayName)}</strong>
            <div style="font-size: 0.8rem; color: #64748b;">${t.correctCount}/${t.attempts} correct (${t.accuracyPercent}%)</div>
          </div>
          <span class="${t.status === 'Mastered' ? 'mastered-badge' : 'practicing-badge'}">${t.status}</span>
        </div>`
              )
              .join('')
          : '<div style="padding: 1.5rem; text-align: center; color: #94a3b8;">No topics practiced yet on this device.</div>'
      }
    </div>

    <div class="footer-note">
      🔒 <strong>Privacy Assured:</strong> Generated 100% on-device by St Joseph's Offline Curriculum Portal. No student data was transmitted to external servers.
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `learning_certificate_${safeAlias.replace(/\s+/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}