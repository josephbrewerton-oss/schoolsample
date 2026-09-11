import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import UniversalTranslatorBar from './UniversalTranslatorBar';
import PersistentNavbar from './PersistentNavbar';
import PersistentFooter from './PersistentFooter';
import ViewportSkeleton from './ViewportSkeleton';
import { classroomBeacon, TeacherBroadcastCommand } from '../services/classroomBeacon';
import { getLearnerProfile } from '../services/studentProfileStore';

export default function PersistentAppShell(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [incomingBroadcast, setIncomingBroadcast] = useState<TeacherBroadcastCommand | null>(null);

  // Scroll restoration on route transition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.replace(/^#/, ''));
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const viewport = document.getElementById('ast-persistent-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
  }, [location.pathname, location.hash]);

  // Read stored accessibility preferences
  useEffect(() => {
    const storedFont = localStorage.getItem('app_font_size') || 'normal';
    const storedContrast = localStorage.getItem('app_high_contrast') === 'true';
    document.documentElement.setAttribute('data-font-size', storedFont);
    document.documentElement.setAttribute('data-high-contrast', storedContrast ? 'true' : 'false');
  }, []);

  // Connect pupil device to local classroom beacon (peer-to-peer over local school network)
  useEffect(() => {
    // If the teacher themselves is on the beacon console, don't broadcast as pupil
    if (location.pathname === '/teacher-beacon') return;

    classroomBeacon.startStudentBeacon(
      () => {
        const profile = getLearnerProfile();
        const storedMisconception = typeof window !== 'undefined' ? localStorage.getItem('active_student_misconception') || undefined : undefined;
        return {
          studentId: profile.alias ? `pupil_${profile.alias.toLowerCase().replace(/\s+/g, '_')}` : 'desk_pupil',
          alias: profile.alias || 'Pupil',
          avatarEmoji: profile.avatarEmoji || '🦉',
          keyStage: profile.keyStage || 'Key Stage 2',
          cohortCode: profile.cohortCode || 'Year 4',
          activeSubject: location.pathname.includes('learning-zone') ? 'Guided Lessons' : 'Interactive Practice',
          activeTopic: location.pathname.replace(/^\//, '') || 'Home',
          recentMisconception: storedMisconception,
          starsEarned: profile.starsEarned || 0,
          totalAttempts: 10,
          accuracyPercent: 90,
          status: storedMisconception ? 'need_help' : 'active',
        };
      },
      (command) => {
        setIncomingBroadcast(command);
        if (command.type === 'NAVIGATE_TOPIC') {
          // If teacher directs class to a unit, navigate smoothly
          if (location.pathname !== '/practice-lab' && location.pathname !== '/learning-zone') {
            navigate('/practice-lab');
          }
        }
        setTimeout(() => setIncomingBroadcast(null), 6000);
      }
    );

    return () => {
      classroomBeacon.stopStudentBeacon();
    };
  }, [location.pathname, navigate]);

  return (
    <div
      id="app-root-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Teacher Incoming Broadcast Banner */}
      {incomingBroadcast && (
        <div
          role="alert"
          style={{
            background: '#1e3a8a',
            color: '#ffffff',
            padding: '0.65rem 1rem',
            textAlign: 'center',
            fontSize: '0.92rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          <span>📢 Teacher Broadcast: {incomingBroadcast.message || 'Attention please!'}</span>
          <button
            type="button"
            onClick={() => setIncomingBroadcast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#93c5fd',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Unified Sticky Header: Zero-Shift Translator Bar + Navigation */}
      <header
        id="persistent-header-group"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 990,
          width: '100%',
        }}
      >
        <UniversalTranslatorBar />
        <PersistentNavbar />
      </header>

      {/* 3. In-Memory AST Viewport (Only this swaps on page navigation!) */}
      <main
        id="ast-persistent-viewport"
        className="ast-viewport-stage"
        style={{
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Suspense fallback={<ViewportSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      {/* 4. Persistent Site Footer */}
      <PersistentFooter />
    </div>
  );
}
