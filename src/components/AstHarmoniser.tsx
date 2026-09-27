// src/components/AstHarmoniser.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parseSExpr } from '../utils/sexprParser';
import { SExprAST } from '../types/sexpr';
import SExprViewRenderer from './SExprViewRenderer';
import { logProgress } from '../services/dbStore';

interface RouteResolution {
  targetPath: string;
  targetLabel: string;
  category: string;
  reason: string;
  subject?: string;
  keyStage?: string;
  unit?: string;
}

export function resolveHarmonisedRoute(rawPath: string, search: string = ''): RouteResolution {
  let clean = (rawPath || '/').toLowerCase();
  if (clean.startsWith('/schoolsample')) {
    clean = clean.replace('/schoolsample', '');
  }
  clean = clean.replace(/\/+$/, '') || '/';

  const fullQuery = (clean + ' ' + (search || '')).toLowerCase();

  // 1. Primary Curriculum Aliases
  if (
    clean === '/primary' ||
    clean.includes('ks1') ||
    clean.includes('ks2') ||
    clean.includes('years-1-6') ||
    clean.includes('primary-years')
  ) {
    if (fullQuery.includes('sci') || fullQuery.includes('plant')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 2&sub=Science&unit=Plant Nutrition',
        targetLabel: 'KS2 Science • Plant Nutrition (Practice Arena)',
        category: 'Primary Curriculum (Years 1–6)',
        reason: 'Matched Primary Science curriculum standard from route path.',
        keyStage: 'Key Stage 2',
        subject: 'Science',
        unit: 'Plant Nutrition',
      };
    }
    if (fullQuery.includes('math') || fullQuery.includes('fraction')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 2&sub=Mathematics&unit=Fractions and Decimals',
        targetLabel: 'KS2 Mathematics • Fractions and Decimals (Practice Arena)',
        category: 'Primary Curriculum (Years 1–6)',
        reason: 'Matched Primary Mathematics curriculum standard from route path.',
        keyStage: 'Key Stage 2',
        subject: 'Mathematics',
        unit: 'Fractions and Decimals',
      };
    }
    return {
      targetPath: '/learning-zone?stage=Key Stage 2',
      targetLabel: 'Key Stage 2 Primary Curriculum Lessons',
      category: 'Primary Curriculum (Years 1–6)',
      reason: 'Reconciled primary stage request to National Curriculum Learning Zone.',
      keyStage: 'Key Stage 2',
    };
  }

  // 2. Secondary Core & GCSE Aliases
  if (
    clean === '/secondary' ||
    clean.includes('ks3') ||
    clean.includes('ks4') ||
    clean.includes('gcse') ||
    clean.includes('years-7-11') ||
    clean.includes('secondary-years')
  ) {
    if (fullQuery.includes('bio') || fullQuery.includes('cell') || fullQuery.includes('respiration')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 3&sub=Science&unit=Cell Biology and Respiration',
        targetLabel: 'KS3 Science • Cell Biology & Respiration (Practice Arena)',
        category: 'Secondary Core (Years 7–11)',
        reason: 'Matched Secondary Biology standard from route path.',
        keyStage: 'Key Stage 3',
        subject: 'Science',
        unit: 'Cell Biology and Respiration',
      };
    }
    return {
      targetPath: '/learning-zone?stage=Key Stage 3',
      targetLabel: 'Key Stage 3 Secondary Curriculum Lessons',
      category: 'Secondary Core (Years 7–11)',
      reason: 'Reconciled secondary stage request to National Curriculum Learning Zone.',
      keyStage: 'Key Stage 3',
    };
  }

  // 3. Sixth Form & Advanced
  if (
    clean.includes('sixth-form') ||
    clean.includes('alevel') ||
    clean.includes('ks5') ||
    clean.includes('years-12-14')
  ) {
    return {
      targetPath: '/learning-zone?stage=Key Stage 4',
      targetLabel: 'Upper Secondary & Advanced Curriculum Lessons',
      category: 'Advanced Study (Years 12–14)',
      reason: 'Reconciled sixth-form request to Advanced Learning Zone.',
      keyStage: 'Key Stage 4',
    };
  }

  // 4. Practice Lab / Arena / Quiz / Challenges
  if (
    clean.includes('practice') ||
    clean.includes('arena') ||
    clean.includes('lab') ||
    clean.includes('quiz') ||
    clean.includes('question') ||
    clean.includes('challenge')
  ) {
    return {
      targetPath: '/practice-lab',
      targetLabel: '⚡ Interactive Practice Arena',
      category: 'Interactive Practice Engine',
      reason: 'Reconciled practice request to the on-device Practice Arena.',
    };
  }

  // 5. Lessons / Learning Zone / Curriculum
  if (
    clean.includes('lesson') ||
    clean.includes('learn') ||
    clean.includes('curriculum') ||
    clean.includes('stream') ||
    clean.includes('unit')
  ) {
    return {
      targetPath: '/learning-zone',
      targetLabel: '📖 Curriculum Lessons & S-Expressions',
      category: 'National Curriculum Directory',
      reason: 'Reconciled lesson inquiry to the Curriculum Learning Zone.',
    };
  }

  // 6. International Curriculum Studio / Importer
  if (
    clean.includes('studio') ||
    clean.includes('import') ||
    clean.includes('pack') ||
    clean.includes('csv') ||
    clean.includes('overseas')
  ) {
    return {
      targetPath: '/curriculum-studio',
      targetLabel: '🌍 International Curriculum Studio',
      category: 'Curriculum Authoring & Importer',
      reason: 'Reconciled pack/import inquiry to the Curriculum Studio.',
    };
  }

  // 7. Student Profile / Passport / Stars / Progress
  if (
    clean.includes('profile') ||
    clean.includes('passport') ||
    clean.includes('progress') ||
    clean.includes('star') ||
    clean.includes('certificate') ||
    clean.includes('badge')
  ) {
    return {
      targetPath: '/profile',
      targetLabel: '⭐ Student Progress & Mastery Passport',
      category: 'Learner Sovereignty & Records',
      reason: 'Reconciled progress query to local GDPR-safe Student Profile.',
    };
  }

  // 8. Settings & Accessibility
  if (
    clean.includes('setting') ||
    clean.includes('config') ||
    clean.includes('font') ||
    clean.includes('theme') ||
    clean.includes('contrast') ||
    clean.includes('dyslexic') ||
    clean.includes('ollama')
  ) {
    return {
      targetPath: '/settings',
      targetLabel: '⚙️ Settings & Device Configuration',
      category: 'Portal Configuration',
      reason: 'Reconciled configuration request to Portal Settings.',
    };
  }

  // 9. Blog / News / Updates
  if (clean.includes('blog') || clean.includes('news') || clean.includes('breakthrough')) {
    return {
      targetPath: '/news',
      targetLabel: 'School News & Technical Dispatches',
      category: 'Dispatches & Announcements',
      reason: 'Reconciled news inquiry to the School Newsroom.',
    };
  }

  // 10. Documentation / Intro / Overview / About
  if (clean.includes('doc') || clean.includes('intro') || clean.includes('about') || clean.includes('overview')) {
    return {
      targetPath: '/',
      targetLabel: "St Joseph's Portal Overview & Gateway",
      category: 'Core Portal Gateway',
      reason: 'Reconciled legacy overview path to the main application gateway.',
    };
  }

  // 11. Specific Subjects
  if (fullQuery.includes('math') || fullQuery.includes('algebra') || fullQuery.includes('arithmetic')) {
    return {
      targetPath: '/practice-lab?ks=Key Stage 2&sub=Mathematics',
      targetLabel: 'Mathematics Practice Arena',
      category: 'STEM Discipline',
      reason: 'Subject keyword matched Mathematics.',
      subject: 'Mathematics',
    };
  }
  if (fullQuery.includes('sci') || fullQuery.includes('biology') || fullQuery.includes('physics') || fullQuery.includes('chem')) {
    return {
      targetPath: '/practice-lab?ks=Key Stage 2&sub=Science',
      targetLabel: 'Science Practice Arena',
      category: 'STEM Discipline',
      reason: 'Subject keyword matched Science.',
      subject: 'Science',
    };
  }
  if (fullQuery.includes('faith') || fullQuery.includes('reconcil') || fullQuery.includes('mass') || fullQuery.includes('catholic')) {
    return {
      targetPath: '/learning-zone?stage=Key Stage 2&sub=Religious Formation',
      targetLabel: 'Parish & Faith Formation Lessons',
      category: 'Faith Formation',
      reason: 'Subject keyword matched Religious Formation.',
      subject: 'Religious Formation',
    };
  }

  // Default Universal Harmonisation Target
  return {
    targetPath: '/practice-lab',
    targetLabel: '⚡ Interactive Practice Arena',
    category: 'Universal Curriculum Hub',
    reason: 'Non-catalog route seamlessly resolved to the core Interactive Practice Lab.',
  };
}

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

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      navigate(resolution.targetPath);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused, resolution.targetPath, navigate]);

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
      navigate(resolution.targetPath);
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
      <DirectoryGrid />
    </div>
  );
}

function DirectoryGrid(): React.JSX.Element {
  return (
    <section>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--stj-text)', marginBottom: '1rem' }}>
        National Curriculum Navigation Directory
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          to="/practice-lab"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Interactive Practice Arena</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Key Stage 1–4 diagnostic challenges with local Socratic Super Teacher Nano assistance.
          </p>
        </Link>

        <Link
          to="/learning-zone"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📖</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Curriculum Lessons</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Step-by-step S-Expression units spanning Academic, Faith Formation, and CPD streams.
          </p>
        </Link>

        <Link
          to="/curriculum-studio"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Curriculum Studio</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Import custom CSV spreadsheets or activate national syllabi (Kenya, India, Ghana, Philippines).
          </p>
        </Link>

        <Link
          to="/profile"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>My Progress & Passport</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Local mastery breakdown, offline certificate generation, and GDPR-safe data control.
          </p>
        </Link>

        <Link
          to="/settings"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚙️</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Portal Settings</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Configure local Ollama WebRTC models, OpenDyslexic fonts, and high-contrast themes.
          </p>
        </Link>

        <Link
          to="/news"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📰</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>School News</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Technical dispatches and updates from St Joseph&apos;s Fishponds AI engineering team.
          </p>
        </Link>
      </div>
    </section>
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
      <DirectoryGrid />
    </div>
  );
}

export default function AstHarmoniser(): React.JSX.Element {
  return <AstHarmoniserClient />;
}
