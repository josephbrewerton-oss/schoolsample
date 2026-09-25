import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
  colorMode: 'light' | 'dark';
}

export default function MobileBottomNav({
  onToggleMenu,
  isMenuOpen,
  colorMode,
}: MobileBottomNavProps): React.JSX.Element {
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
  const isLearnActive = location.pathname.startsWith('/learning-zone');
  const isPracticeActive = location.pathname.startsWith('/practice-lab');
  const isFaithActive = location.pathname.startsWith('/catholic-life') || location.pathname.startsWith('/first-communion');

  const navItemClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center min-h-[48px] py-1 px-2 transition-colors select-none ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 font-bold'
        : colorMode === 'dark'
        ? 'text-slate-400 hover:text-slate-200'
        : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <nav
      id="mobile-bottom-bar"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors shadow-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto">
        {/* 1. Home */}
        <NavLink
          to="/"
          end
          className={() => navItemClass(isHomeActive && !isMenuOpen)}
          aria-label="Home"
        >
          <span className="text-lg leading-none">🏠</span>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Home</span>
        </NavLink>

        {/* 2. Lessons */}
        <NavLink
          to="/learning-zone"
          className={() => navItemClass(isLearnActive && !isMenuOpen)}
          aria-label="Lessons & Walkthroughs"
        >
          <span className="text-lg leading-none">📖</span>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Lessons</span>
        </NavLink>

        {/* 3. Practice Lab */}
        <NavLink
          to="/practice-lab"
          className={() => navItemClass(isPracticeActive && !isMenuOpen)}
          aria-label="Interactive Practice Arena"
        >
          <span className="text-lg leading-none">⚡</span>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Practice</span>
        </NavLink>

        {/* 4. Catholic Life & Faith Sanctuary */}
        <NavLink
          to="/catholic-life"
          className={() => navItemClass(isFaithActive && !isMenuOpen)}
          aria-label="Catholic Life & Faith"
        >
          <span className="text-lg leading-none">✝️</span>
          <span className="text-[10px] tracking-tight mt-1 font-medium">Faith</span>
        </NavLink>

        {/* 5. Menu / All Features */}
        <button
          type="button"
          onClick={onToggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={isMenuOpen ? 'Close Menu' : 'Open All Menu Options'}
          className={navItemClass(isMenuOpen)}
        >
          <span className="text-lg leading-none">{isMenuOpen ? '✕' : '☰'}</span>
          <span className="text-[10px] tracking-tight mt-1 font-medium">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
}
