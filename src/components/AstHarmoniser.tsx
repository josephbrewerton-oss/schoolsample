// src/components/AstHarmoniser.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parseSExpr } from '../utils/sexprParser';
import { SExprAST } from '../types/sexpr';
import SExprViewRenderer from './SExprViewRenderer';
import { logProgress } from '../services/dbStore';
import { resolveHarmonisedRoute, type RouteResolution } from '../utils/harmonisedRouteResolver';
import NavigationDirectoryGrid from './NavigationDirectoryGrid';

export { resolveHarmonisedRoute, type RouteResolution };

function AstHarmoniserClient(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const rawPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const rawSearch = location?.search || (typeof window !== 'undefined' ? window.location.search : '');

  const resolution = useMemo(() => resolveHarmonisedRoute(rawPath, rawSearch), [rawPath, rawSearch]);

  // Auto-redirect countdown
  const [countdown, setCountdown] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showAstSource, setShowAstSource] = useState<boolean>(false);

  // Quick interactive diagnostic question on the harmoniser card
  const [diagnosticAnswer, setDiagnosticAnswer] = useState<number | null>(null);
  const [diagnosticFeedback, setDiagnosticFeedback] = useState<string | null>(null);

  // Prevent competing with React Router 7 client-side navigation or back-forward browser cache (bfcache)
  useEffect(() => {
    try {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries && navEntries[0]?.type === 'back_forward') {
        setIsPaused(true);
      }
    } catch {
      // Ignore if Navigation Timing API unavailable
    }

    const handlePopState = () => {
      // Pause countdown immediately on browser back/forward to avoid trapping user
      setIsPaused(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Countdown timer with idempotent replace navigation
  useEffect(() => {
    if (isPaused) return;

    // Prevent redundant self-redirect loops
    if (rawPath === resolution.targetPath) {
      setIsPaused(true);
      return;
    }

    if (countdown <= 0) {
      // Use replace: true so we don't pollute the browser history stack
      navigate(resolution.targetPath, { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused, resolution.targetPath, rawPath, navigate]);

  // Construct S-Expression AST representing this harmonised route
  const harmonisedAstSource = useMemo(() => {
    const cleanDisplayPath = (rawPath || '/').replace(/["\\]/g, '');
    const cleanTargetLabel = resolution.targetLabel.replace(/["\\]/g, '');
    const cleanReason = resolution.reason.replace(/["\\]/g, '');

    return `(view :className "card padding--lg shadow--md margin-vert--md"
  (header :level 2 "🛡️ Sovereign AST Route Harmoniser")
  (badge :variant "success" "Zero-404 AST Protocol Active")
  (callout :variant "info" "Reconciled route: \\"${cleanDisplayPath}\\" ➔ ${cleanTargetLabel}")
  (stepper
    (step (text "Original Requested Route: ${cleanDisplayPath}"))
    (step (text "Harmonised Category: ${resolution.category}"))
    (step (text "AST Decision Engine: ${cleanReason}")))
  (box :className "margin-vert--md"
    (button :className "button button--primary button--lg" :action "navigate:target" "⚡ Proceed to Harmonised Arena")
    (button :className "button button--secondary button--lg margin-left--sm" :action "navigate:home" "🏠 Portal Home"))
  (ai-tutor :persona "Curriculum Governor" :engine "Gemini Nano" :greeting "Hello! You have reached a sovereign node. The AST router intercepted this link and harmonised it with your curriculum."))`;
  }, [rawPath, resolution]);

  const parsedAst = useMemo<SExprAST | null>(() => {
    try {
      return parseSExpr(harmonisedAstSource);
    } catch {
      return null;
    }
  }, [harmonisedAstSource]);

  const handleAstAction = (action: string) => {
    if (action === 'navigate:target') {
      navigate(resolution.targetPath, { replace: true });
    } else if (action === 'navigate:home') {
      navigate('/');
    }
  };

  const handleQuickQuestionAnswer = (idx: number) => {
    setDiagnosticAnswer(idx);
    setIsPaused(true); // Pause countdown so student can read explanation
    if (idx === 1) {
      setDiagnosticFeedback('✅ Spot on! An AST (Abstract Syntax Tree) deterministically represents hierarchical curriculum structures.');
      logProgress({
        cohortCode: 'HARMONISER-COHORT',
        challengeId: `harmoniser-${Date.now()}`,
        topicId: 'comp-ast-harmoniser',
        answeredAt: Date.now(),
        isCorrect: true,
        userAnswer: 'Abstract Syntax Trees (ASTs) represent structured hierarchical curricula deterministically.',
      });
    } else {
      setDiagnosticFeedback('💡 Remember: ASTs parse nested expressions and syntax trees deterministically without cloud tracking.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem 1rem',
        fontFamily: 'inherit',
      }}
    >
      {/* Header Banner */}
      <div
        className="stj-card"
        style={{
          background: 'linear-gradient(135deg, var(--stj-surface-raised) 0%, var(--stj-surface) 100%)',
          color: 'var(--stj-text)',
          padding: '2rem',
          borderRadius: 'var(--stj-radius-lg)',
          boxShadow: 'var(--stj-shadow-lg)',
          marginBottom: '2rem',
          border: '1px solid var(--stj-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--stj-text)' }}>
              Route Harmonised via Curriculum AST
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--stj-text-muted)', fontSize: '0.95rem' }}>
              Zero-404 Sovereign Router • Every path is reconciled with the National Curriculum knowledge tree
            </p>
          </div>
        </div>

        {/* Countdown Pill Bar */}
        <div
          style={{
            marginTop: '1.25rem',
            background: 'var(--stj-canvas)',
            border: '1px solid var(--stj-border)',
            borderRadius: 'var(--stj-radius-md)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⏳</span>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--stj-text)' }}>
                {isPaused ? (
                  <span style={{ color: 'var(--stj-warning)' }}>Auto-redirection paused</span>
                ) : (
                  <span>
                    Auto-routing in <strong style={{ color: 'var(--stj-primary)', fontSize: '1.1rem' }}>{countdown}</strong> seconds...
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--stj-text-muted)' }}>
                Heading to: <strong style={{ color: 'var(--stj-text)' }}>{resolution.targetLabel}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className={`stj-btn ${isPaused ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <Link
              to={resolution.targetPath}
              className="stj-btn stj-btn-success stj-btn-sm"
              style={{ textDecoration: 'none' }}
            >
              🚀 Go Now ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Render Synthesized AST via SExprViewRenderer */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--stj-text)' }}>
            Synthesized AST Node Representation
          </h2>
          <button
            type="button"
            onClick={() => setShowAstSource(!showAstSource)}
            className="stj-btn stj-btn-ghost stj-btn-sm"
            style={{ border: '1px solid var(--stj-border)' }}
          >
            {showAstSource ? 'Hide S-Expression Code' : 'Inspect S-Expression Code'}
          </button>
        </div>

        {showAstSource && (
          <pre
            style={{
              background: 'var(--stj-canvas)',
              color: 'var(--stj-primary)',
              border: '1px solid var(--stj-border)',
              padding: '1rem',
              borderRadius: 'var(--stj-radius-md)',
              fontSize: '0.82rem',
              overflowX: 'auto',
              marginBottom: '1rem',
            }}
          >
            <code>{harmonisedAstSource}</code>
          </pre>
        )}

        {parsedAst && (
          <SExprViewRenderer ast={parsedAst} onAction={handleAstAction} />
        )}
      </section>

      {/* Instant Interactive Diagnostic Challenge */}
      <section
        className="stj-card"
        style={{
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--stj-text)' }}>
            Quick Diagnostic: While You Wait, Test an AST Concept
          </h3>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--stj-text-muted)', margin: '0 0 1rem 0' }}>
          In deterministic offline architectures, why are <strong>Abstract Syntax Trees (ASTs)</strong> used to govern curriculum routing?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          {[
            'A) They require constant round-trips to cloud telemetry databases.',
            'B) They represent structured hierarchical curricula and syntax deterministically without cloud dependencies.',
            'C) They randomly shuffle all page routes to surprise users.',
            'D) They prevent students from navigating between subjects.',
          ].map((option, idx) => {
            const isSelected = diagnosticAnswer === idx;
            const isCorrect = idx === 1;
            let btnBg = 'var(--stj-canvas)';
            let btnBorder = 'var(--stj-border)';
            let btnColor = 'var(--stj-text)';

            if (isSelected) {
              if (isCorrect) {
                btnBg = 'var(--stj-success-surface)';
                btnBorder = 'var(--stj-success)';
                btnColor = 'var(--stj-success)';
              } else {
                btnBg = 'var(--stj-danger-surface)';
                btnBorder = 'var(--stj-danger)';
                btnColor = 'var(--stj-danger)';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestionAnswer(idx)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: 'var(--stj-radius-md)',
                  background: btnBg,
                  border: `1px solid ${btnBorder}`,
                  color: btnColor,
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {diagnosticFeedback && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--stj-radius-md)',
              background: diagnosticAnswer === 1 ? 'var(--stj-success-surface)' : 'var(--stj-danger-surface)',
              border: `1px solid ${diagnosticAnswer === 1 ? 'var(--stj-success)' : 'var(--stj-danger)'}`,
              color: diagnosticAnswer === 1 ? 'var(--stj-success)' : 'var(--stj-danger)',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            {diagnosticFeedback}
          </div>
        )}
      </section>

      {/* Universal Directory Grid */}
      <NavigationDirectoryGrid />
    </div>
  );
}

function AstHarmoniserStaticFallback(): React.JSX.Element {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
      <div
        className="stj-card"
        style={{
          background: 'linear-gradient(135deg, var(--stj-surface-raised) 0%, var(--stj-surface) 100%)',
          color: 'var(--stj-text)',
          padding: '2rem',
          borderRadius: 'var(--stj-radius-lg)',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--stj-text)' }}>
          Route Harmonised via Curriculum AST
        </h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--stj-text-muted)' }}>
          Zero-404 Sovereign Router • Reconciling your navigation with the National Curriculum knowledge tree...
        </p>
      </div>
      <NavigationDirectoryGrid />
    </div>
  );
}

export default function AstHarmoniser(): React.JSX.Element {
  return <AstHarmoniserClient />;
}
