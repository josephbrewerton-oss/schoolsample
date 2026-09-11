// src/components/AstHarmoniser.tsx
import React, { useState, useEffect, useMemo } from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation, useHistory } from '@docusaurus/router';
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
      targetPath: '/blog',
      targetLabel: 'School News & Technical Dispatches',
      category: 'Dispatches & Announcements',
      reason: 'Reconciled news inquiry to the School Blog.',
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
  const history = useHistory();
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
      history.push(resolution.targetPath);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused, resolution.targetPath, history]);

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
      history.push(resolution.targetPath);
    } else if (action === 'navigate:home') {
      history.push('/');
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
    <main
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem 1rem',
        fontFamily: 'inherit',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
          marginBottom: '2rem',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Route Harmonised via Curriculum AST
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
              Zero-404 Sovereign Router • Every path is reconciled with the National Curriculum knowledge tree
            </p>
          </div>
        </div>

        {/* Countdown Pill Bar */}
        <div
          style={{
            marginTop: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
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
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>
                {isPaused ? (
                  <span style={{ color: '#f59e0b' }}>Auto-redirection paused</span>
                ) : (
                  <span>
                    Auto-routing in <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{countdown}</strong> seconds...
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Heading to: <strong>{resolution.targetLabel}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              style={{
                background: isPaused ? '#2563eb' : 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <Link
              to={resolution.targetPath}
              style={{
                background: '#22c55e',
                color: '#ffffff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🚀 Go Now ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Render Synthesized AST via SExprViewRenderer */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
            Synthesized AST Node Representation
          </h2>
          <button
            type="button"
            onClick={() => setShowAstSource(!showAstSource)}
            style={{
              background: 'transparent',
              border: '1px solid #cbd5e1',
              color: '#475569',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showAstSource ? 'Hide S-Expression Code' : 'Inspect S-Expression Code'}
          </button>
        </div>

        {showAstSource && (
          <pre
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              padding: '1rem',
              borderRadius: '10px',
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
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Quick Diagnostic: While You Wait, Test an AST Concept
          </h3>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#475569', margin: '0 0 1rem 0' }}>
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
            let btnBg = '#f8fafc';
            let btnBorder = '#cbd5e1';
            let btnColor = '#1e293b';

            if (isSelected) {
              if (isCorrect) {
                btnBg = '#dcfce7';
                btnBorder = '#22c55e';
                btnColor = '#15803d';
              } else {
                btnBg = '#fee2e2';
                btnBorder = '#ef4444';
                btnColor = '#b91c1c';
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
                  borderRadius: '8px',
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
              borderRadius: '8px',
              background: diagnosticAnswer === 1 ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${diagnosticAnswer === 1 ? '#86efac' : '#fca5a5'}`,
              color: diagnosticAnswer === 1 ? '#166534' : '#991b1b',
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
    </main>
  );
}

function DirectoryGrid(): React.JSX.Element {
  return (
    <section>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
        National Curriculum Navigation Directory
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          to="/practice-lab"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>Interactive Practice Arena</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Key Stage 1–4 diagnostic challenges with local Socratic Super Teacher Nano assistance.
          </p>
        </Link>

        <Link
          to="/learning-zone"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📖</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>Curriculum Lessons</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Step-by-step S-Expression units spanning Academic, Faith Formation, and CPD streams.
          </p>
        </Link>

        <Link
          to="/curriculum-studio"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>Curriculum Studio</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Import custom CSV spreadsheets or activate national syllabi (Kenya, India, Ghana, Philippines).
          </p>
        </Link>

        <Link
          to="/profile"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>My Progress & Passport</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Local mastery breakdown, offline certificate generation, and GDPR-safe data control.
          </p>
        </Link>

        <Link
          to="/settings"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚙️</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>Portal Settings</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Configure local Ollama WebRTC models, OpenDyslexic fonts, and high-contrast themes.
          </p>
        </Link>

        <Link
          to="/blog"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📰</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>School News</div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Technical dispatches and updates from St Joseph&apos;s Fishponds AI engineering team.
          </p>
        </Link>
      </div>
    </section>
  );
}

function AstHarmoniserStaticFallback(): React.JSX.Element {
  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
      <div
        style={{
          background: '#1e293b',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
          Route Harmonised via Curriculum AST
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8' }}>
          Zero-404 Sovereign Router • Reconciling your navigation with the National Curriculum knowledge tree...
        </p>
      </div>
      <DirectoryGrid />
    </main>
  );
}

export default function AstHarmoniser(): React.JSX.Element {
  return (
    <BrowserOnly fallback={<AstHarmoniserStaticFallback />}>
      {() => <AstHarmoniserClient />}
    </BrowserOnly>
  );
}
