// src/utils/sessionReporter.ts
import { getAllProgressRecords, StudentRecord } from '../services/dbStore';
import { TrajectoryEngine, CoordinateAttempt } from '../engine/trajectoryEngine';

export interface SessionReportSummary {
  sessionId: string;
  totalAttempts: number;
  correctCount: number;
  streakPeak: number;
  timestamp: string;
  accuracy: number;
  trajectoryAnalysis?: {
    dominantTrap: string | null;
    trapConfidence: number;
    coordinateEntropy: number;
    predictedNextTrap: string | null;
    recommendedAction: string;
  };
  records: StudentRecord[];
}

export async function generateSessionReport(sessionId: string): Promise<SessionReportSummary> {
  const allRecords = await getAllProgressRecords();
  // Filter by cohort/sessionId if matching, otherwise return recent session records
  const matching = sessionId
    ? allRecords.filter((r) => r.cohortCode === sessionId || sessionId === 'default_cohort')
    : allRecords;

  const recordsToUse = matching.length > 0 ? matching : allRecords;
  const totalAttempts = recordsToUse.length;
  const correctCount = recordsToUse.filter((r) => r.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;

  // Perform trajectory analysis over records
  const trajectory = TrajectoryEngine.analyzeTrajectory();

  return {
    sessionId: sessionId || 'Classroom_Session',
    totalAttempts,
    correctCount,
    streakPeak: 0,
    timestamp: new Date().toLocaleDateString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    accuracy,
    trajectoryAnalysis: {
      dominantTrap: trajectory.activeTrapVector,
      trapConfidence: trajectory.trapConfidence,
      coordinateEntropy: trajectory.coordinateEntropy,
      predictedNextTrap: trajectory.predictedNextTrap,
      recommendedAction: trajectory.recommendedAction,
    },
    records: recordsToUse.slice(-25), // latest 25 attempts
  };
}

export function downloadReportAsHtml(summary: SessionReportSummary) {
  const traj = summary.trajectoryAnalysis;
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cognitive Coordinate Diagnostic Report: ${summary.sessionId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2.5rem; color: #0f172a; max-width: 900px; margin: auto; background: #f8fafc; }
    .header { border-bottom: 2px solid #cbd5e1; padding-bottom: 1.25rem; margin-bottom: 1.5rem; background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .stat { font-size: 1.75rem; font-weight: 800; color: #2563eb; }
    .trajectory-box { background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
    .trail-table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .trail-table th { background: #f1f5f9; padding: 0.75rem 1rem; text-align: left; font-size: 0.85rem; color: #475569; }
    .trail-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; }
    .badge-correct { background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
    .badge-trap { background: #fee2e2; color: #b91c1c; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
    .seed-code { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #0284c7; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin:0 0 0.5rem 0; color:#0f172a;">Oak Curriculum Diagnostic & Coordinate Report</h1>
    <p style="margin:0; color:#64748b;"><strong>Session:</strong> ${summary.sessionId} | <strong>Date:</strong> ${summary.timestamp}</p>
    <p style="margin:0.25rem 0 0 0; font-size:0.85rem; color:#94a3b8;">Zero-cloud local inference ledger powered by deterministic coordinate telemetry.</p>
  </div>

  <div class="grid">
    <div class="card">
      <div style="font-size:0.85rem; color:#64748b; font-weight:600;">Total Questions</div>
      <div class="stat">${summary.totalAttempts}</div>
    </div>
    <div class="card">
      <div style="font-size:0.85rem; color:#64748b; font-weight:600;">Accuracy</div>
      <div class="stat" style="color:${summary.accuracy >= 70 ? '#16a34a' : '#d97706'};">${summary.accuracy}%</div>
    </div>
    <div class="card">
      <div style="font-size:0.85rem; color:#64748b; font-weight:600;">Coordinate Entropy</div>
      <div class="stat" style="color:#6366f1;">${traj?.coordinateEntropy !== undefined ? traj.coordinateEntropy : 0}</div>
      <div style="font-size:0.75rem; color:#94a3b8;">(0 = Systematic, 1 = Guessing)</div>
    </div>
  </div>

  ${
    traj?.dominantTrap
      ? `
  <div class="trajectory-box">
    <h3 style="margin:0 0 0.5rem 0; color:#1e40af;">🎯 Predictive Cognitive Vector Trail</h3>
    <p style="margin:0 0 0.5rem 0; font-size:0.95rem; color:#1e3a8a;">
      <strong>Detected Trap Trajectory:</strong> ${traj.dominantTrap} <br>
      <strong>Convergence Confidence:</strong> ${Math.round(traj.trapConfidence * 100)}%
    </p>
    <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:8px; padding:0.75rem; font-size:0.9rem; color:#1e3a8a;">
      <strong>Recommended Socratic Strategy:</strong> ${traj.recommendedAction}
    </div>
  </div>`
      : `
  <div class="trajectory-box" style="background:#f0fdf4; border-color:#bbf7d0;">
    <h3 style="margin:0 0 0.5rem 0; color:#166534;">✅ Axiomatic Alignment</h3>
    <p style="margin:0; font-size:0.95rem; color:#14532d;">Pupil demonstrates clear adherence to foundational principles without converging on systematic misconceptions.</p>
  </div>`
  }

  <h3 style="color:#0f172a; margin:1.5rem 0 0.75rem 0;">Deterministic Answer Trail (Coordinate Lattice)</h3>
  <table class="trail-table">
    <thead>
      <tr>
        <th>Seed Coordinate</th>
        <th>Topic</th>
        <th>Selected Coord</th>
        <th>Ground Truth</th>
        <th>Status</th>
        <th>Diagnosed Vector</th>
      </tr>
    </thead>
    <tbody>
      ${summary.records
        .map(
          (r) => `
      <tr>
        <td><span class="seed-code">${r.seedToken || 'N/A'}</span></td>
        <td>${r.topicId.replace(/_/g, ' ')}</td>
        <td><strong>Coordinate ${r.selectedCoordinate !== undefined ? String.fromCharCode(65 + r.selectedCoordinate) : '-'}</strong></td>
        <td>Coordinate ${r.correctCoordinate !== undefined ? String.fromCharCode(65 + r.correctCoordinate) : '-'}</td>
        <td><span class="${r.isCorrect ? 'badge-correct' : 'badge-trap'}">${r.isCorrect ? 'Correct' : 'Misconception'}</span></td>
        <td style="color:#64748b; font-size:0.8rem;">${r.isCorrect ? 'Axiomatic deduction' : (r.errorTag || 'Trap vector')}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${summary.sessionId.replace(/\s+/g, '_')}_diagnostic_report.html`;
  a.click();
  URL.revokeObjectURL(url);
}
