import React, { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UniversalTranslatorBar from './UniversalTranslatorBar';
import PersistentNavbar from './PersistentNavbar';
import PersistentFooter from './PersistentFooter';
import ViewportSkeleton from './ViewportSkeleton';

export default function PersistentAppShell(): React.JSX.Element {
  const location = useLocation();

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
