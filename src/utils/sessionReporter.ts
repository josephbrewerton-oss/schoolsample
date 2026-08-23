// src/utils/sessionReporter.ts

export interface SessionReportSummary {
  sessionId: string;
  totalAttempts: number;
  correctCount: number;
  streakPeak: number;
  timestamp: string;
  events: Array<{ actor: string; payload: string; timestamp: number }>;
}

export async function generateSessionReport(sessionId: string): Promise<SessionReportSummary> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('SchoolAiJotter', 1);

    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('session_events')) {
        return resolve({
          sessionId,
          totalAttempts: 0,
          correctCount: 0,
          streakPeak: 0,
          timestamp: new Date().toISOString(),
          events: []
        });
      }

      const tx = db.transaction('session_events', 'readonly');
      const store = tx.objectStore('session_events');
      const index = store.index('sessionId');
      const query = index.getAll(IDBKeyRange.only(sessionId));

      query.onsuccess = () => {
        const events = query.result || [];
        resolve({
          sessionId,
          totalAttempts: events.filter(e => e.actor === 'student').length,
          correctCount: events.filter(e => e.payload?.includes('correct')).length,
          streakPeak: 0,
          timestamp: new Date().toLocaleDateString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          events
        });
      };

      query.onerror = () => reject(query.error);
    };

    req.onerror = () => reject(req.error);
  });
}

export function downloadReportAsHtml(summary: SessionReportSummary) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Diagnostic Report: ${summary.sessionId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2rem; color: #0f172a; max-width: 800px; margin: auto; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; }
    .stat { font-size: 1.5rem; font-weight: bold; color: #2563eb; }
    .log-item { padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Oak Curriculum Diagnostic Report</h1>
    <p><strong>Session:</strong> ${summary.sessionId} | <strong>Date:</strong> ${summary.timestamp}</p>
    <p><em>Generated client-side via SchoolSample zero-cloud engine.</em></p>
  </div>
  <div class="card">
    <p>Questions Answered: <span class="stat">${summary.totalAttempts}</span></p>
  </div>
  <h3>Session Event Log (Append-Only Ledger)</h3>
  <div>
    ${summary.events.map(e => `<div class="log-item"><strong>[${e.actor}]</strong> ${e.payload}</div>`).join('')}
  </div>
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