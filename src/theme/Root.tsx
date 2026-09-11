import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import LayoutProvider from '@theme/Layout/Provider';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import UniversalTranslatorBar from '../components/UniversalTranslatorBar';
import PwaReloadPopup from './PwaReloadPopup';

/**
 * Root Persistent App-Shell Component
 *
 * Mounts at the apex of the Docusaurus React tree (above the router outlet).
 * In this persistent AST substrate design:
 * - The Universal Translator Bar, Announcement Bar, Navbar, and Footer stay mounted permanently.
 * - Navigating between pages never unmounts or tears down navigation chrome, audio contexts,
 *   or active WebRTC connections.
 * - Automatically scrolls to top on route transitions (unless an anchor hash is targeted).
 * - The children prop renders the active AST page content inside the persistent viewport.
 */
export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
  const location = useLocation();

  // Scroll restoration on page transition
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

    // Reset window and document scroll position to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const viewport = document.getElementById('ast-persistent-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const storedFont = localStorage.getItem("app_font_size") || "normal";
    const storedContrast = localStorage.getItem("app_high_contrast") === "true";

    document.documentElement.setAttribute("data-font-size", storedFont);
    document.documentElement.classList.toggle("high-contrast-mode", storedContrast);
  }, []);

  return (
    <LayoutProvider>
      <SkipToContent />
      <AnnouncementBar />
      <UniversalTranslatorBar />
      <Navbar />
      <div
        id="ast-persistent-viewport"
        className="ast-viewport-stage"
        style={{
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {children}
      </div>
      <Footer />
      <PwaReloadPopup />
    </LayoutProvider>
  );
}

