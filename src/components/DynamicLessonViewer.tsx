// src/components/DynamicLessonViewer.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MasterCatalog, CatalogItem, LearningStream } from '../types/learning-ast';
import { getVfsView, saveVfsView, bootstrapVfsViews } from '../services/dbStore';
import { parseSExpr } from '../utils/sexprParser';
import { SExprAST } from '../types/sexpr';
import SExprViewRenderer from './SExprViewRenderer';
import { Channels } from '../utils/channelBus';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { VFS_CURRICULUM_SEEDS } from '../manifests/vfsSeedModules';
import { EngineFlow } from '../engine/engineflow';

interface EngineProps {
  defaultPhase?: 'PRIMARY' | 'SECONDARY' | string;
  defaultSubject?: string;
  defaultStream?: LearningStream | string;
}

const GENERATING_PLACEHOLDER_VIEW = `(view :className "card padding--md margin-vert--md"
  (header :level 3 "⚡ Synthesizing Practice Node...")
  (callout :variant "warning" "Formulating pedagogical distractors and verifying AST constraints.")
  (stepper
    (step (text "Selecting curriculum domain..."))
    (step (text "Dispatching prompt to browser runtime..."))
    (step (text "Compiling S-Expression AST...")))
  (ai-tutor :persona "Local Governor" :engine "Gemini Nano" :greeting "Generating your question now..."))`;

export default function DynamicLessonViewer({
  defaultPhase,
  defaultSubject,
  defaultStream = 'academic',
}: EngineProps): React.JSX.Element {
  const baseUrl = useBaseUrl('/');
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Multi-stream catalog state
  const [catalog, setCatalog] = useState<MasterCatalog | null>(null);
  const [activeStream, setActiveStream] = useState<LearningStream>(defaultStream as LearningStream);
  const [selectedPhase, setSelectedPhase] = useState<string>(defaultPhase || 'ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject || 'ALL');
  const [activeViewPath, setActiveViewPath] = useState<string>('');

  // AST and Execution state
  const [currentAst, setCurrentAst] = useState<SExprAST | null>(null);
  const [rawSource, setRawSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Teacher overlay mode
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_teacher_mode') === 'true';
    }
    return false;
  });
  const [showAstInspector, setShowAstInspector] = useState<boolean>(false);

  useEffect(() => {
    const syncTeacherMode = () => {
      if (typeof window !== 'undefined') {
        setIsTeacherMode(localStorage.getItem('app_teacher_mode') === 'true');
      }
    };
    window.addEventListener('storage', syncTeacherMode);
    return () => window.removeEventListener('storage', syncTeacherMode);
  }, []);

  // 1. Initialize Master Catalog
  useEffect(() => {
    async function initCatalog() {
      try {
        const catRes = await fetch(`${normalizedBase}/manifests/catalog.json`);
        if (catRes.ok) {
          const catData: MasterCatalog = await catRes.json();
          setCatalog(catData);
        }
        await bootstrapVfsViews({
          ...VFS_CURRICULUM_SEEDS,
        });
      } catch (err) {
        console.warn('Catalog index could not be loaded; running standalone VFS:', err);
      }
    }
    initCatalog();
  }, [normalizedBase]);

  // Filter Catalog items
  const streamItems = useMemo(() => {
    if (!catalog) return [];
    return catalog.items.filter((item) => {
      const matchesStream = item.stream === activeStream;
      const matchesPhase =
        selectedPhase === 'ALL' ||
        !item.keyStage ||
        item.keyStage.toUpperCase().includes(selectedPhase.toUpperCase());
      return matchesStream && matchesPhase;
    });
  }, [catalog, activeStream, selectedPhase]);

  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    streamItems.forEach((i) => {
      if (i.subject) subjects.add(i.subject);
    });
    return Array.from(subjects).sort();
  }, [streamItems]);

  const filteredLessons = useMemo(() => {
    if (selectedSubject === 'ALL') return streamItems;
    return streamItems.filter((i) => i.subject === selectedSubject);
  }, [streamItems, selectedSubject]);

  // Auto-select first subject when phase changes
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [availableSubjects, selectedSubject]);

  // Auto-select first lesson view when filtered lessons change
  useEffect(() => {
    if (filteredLessons.length > 0) {
      const isCurrentPathValid = filteredLessons.some(
        (item) => `/sys/views/${item.id}.lisp` === activeViewPath
      );
      if (!isCurrentPathValid) {
        setActiveViewPath(`/sys/views/${filteredLessons[0].id}.lisp`);
      }
    }
  }, [filteredLessons, activeViewPath]);

  // 2. Synthesize or Load Domain-Accurate S-Expression View
  const hydrateLessonAST = useCallback(async (pathKey: string) => {
    if (!pathKey) return;
    setIsLoading(true);

    try {
      // 1. Check local IndexedDB VFS first
      let content = await getVfsView(pathKey);

      if (!content) {
        const itemId = pathKey.replace('/sys/views/', '').replace('.lisp', '');
        const catalogItem = catalog?.items.find((i) => i.id === itemId);

        if (catalogItem?.manifestPath) {
          // 2. Load and splice real manifest challenges
          const manifestRes = await fetch(`${normalizedBase}${catalogItem.manifestPath}`);
          if (manifestRes.ok) {
            const manifest = await manifestRes.json();
            const ch = manifest.c?.[0] || {};
            const axiom = ch.e || `Fundamental principles and rules governing ${catalogItem.unit || catalogItem.title}.`;
            const trap = ch.r?.[0]?.[1] || `Common misconceptions regarding ${catalogItem.title}.`;
            const prompt = ch.p || `Examine the core concepts of ${catalogItem.title}.`;

            content = `(view :className "card padding--md margin-vert--md"
  (header :level 3 "${manifest.m.n}")
  (callout :variant "info" "${axiom}")
  (callout :variant "warning" "${trap}")
  (stepper
    (step (text "Step 1: Inquiry Hook — ${prompt}"))
    (step (text "Step 2: Key Concept — ${ch.h || 'Analyze the rules and evidence.'}"))
    (step (text "Step 3: Verification — Confirm understanding.")))
  (ai-tutor :persona "${catalogItem.subject} Tutor" :engine "Gemini Nano" :greeting "Welcome to ${catalogItem.title}! Ask me if you need help with this lesson."))`;
          }
        }

        // 3. Fallback to segregated On-Device EngineFlow generation
        if (!content && catalogItem) {
          const generated = await EngineFlow.generateLessonCards({
            keyStage: catalogItem.keyStage || selectedPhase,
            subject: catalogItem.subject || selectedSubject,
            topic: catalogItem.title,
          });

          content = `(view :className "card padding--md margin-vert--md"
  (header :level 3 "${generated.title}")
  (callout :variant "info" "${generated.axiom}")
  (callout :variant "warning" "${generated.trap}")
  (stepper
    (step (text "Step 1: Inquiry Hook — ${generated.hook}"))
    (step (text "Step 2: Guided Practice — ${generated.guidedStep}"))
    (step (text "Step 3: Socratic Check — ${generated.socraticCheck}")))
  (ai-tutor :persona "${selectedSubject} Tutor" :engine "Gemini Nano" :greeting "Welcome to ${generated.title}! How can I help you master this concept?"))`;
        }

        if (content) {
          await saveVfsView(pathKey, content);
        }
      }

      if (content) {
        setRawSource(content);
        const parsed = parseSExpr(content);
        setCurrentAst(parsed);
      }
    } catch (err) {
      console.error('Failed to hydrate S-Expression lesson:', err);
    } finally {
      setIsLoading(false);
    }
  }, [catalog, normalizedBase, selectedPhase, selectedSubject]);

  useEffect(() => {
    hydrateLessonAST(activeViewPath);
  }, [activeViewPath, hydrateLessonAST]);

  const handleAction = (action: string, payload?: any) => {
    if (action === 'NEXT_QUESTION' || action === 'GENERATE') {
      setRawSource(GENERATING_PLACEHOLDER_VIEW);
      setCurrentAst(parseSExpr(GENERATING_PLACEHOLDER_VIEW));

      Channels.UI_ACTIONS.send({
        action,
        payload: {
          ...payload,
          phase: selectedPhase,
          subject: selectedSubject,
          viewPath: activeViewPath,
        },
      });
      return;
    }
    Channels.UI_ACTIONS.send({ action, payload });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Navigation Selectors */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <select
          aria-label="Filter by Phase"
          value={selectedPhase}
          onChange={(e) => {
            setSelectedPhase(e.target.value);
            setSelectedSubject('ALL');
          }}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
        >
          <option value="ALL">All Phases</option>
          <option value="PRIMARY">🎒 Primary</option>
          <option value="SECONDARY">🔬 Secondary</option>
        </select>

        <select
          aria-label="Select Subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
        >
          <option value="ALL">All Subjects ({availableSubjects.length})</option>
          {availableSubjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select
          aria-label="Select Lesson Unit"
          value={activeViewPath}
          onChange={(e) => setActiveViewPath(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
        >
          {filteredLessons.length > 0 ? (
            filteredLessons.map((item) => (
              <option key={item.id} value={`/sys/views/${item.id}.lisp`}>
                {item.badgeIcon || '📚'} {item.title}
              </option>
            ))
          ) : (
            <option value="">No units available</option>
          )}
        </select>
      </div>

      {/* Main Declarative S-Expression Engine View */}
      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Hydrating topic-accurate curriculum AST...
        </div>
      ) : currentAst ? (
        <SExprViewRenderer ast={currentAst} onAction={handleAction} />
      ) : (
        <div className="alert alert--danger">Error parsing declarative S-expression view.</div>
      )}

      {/* Educator & Teacher Diagnostics Inspector */}
      {isTeacherMode && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            border: '2px dashed var(--ifm-color-warning)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 186, 0, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: 'var(--ifm-color-warning-darkest)' }}>
              🎓 Teacher Diagnostics Mode
            </strong>
            <button
              type="button"
              className="button button--sm button--secondary"
              onClick={() => setShowAstInspector(!showAstInspector)}
            >
              {showAstInspector ? 'Hide Raw AST' : 'Inspect VFS AST'}
            </button>
          </div>

          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <strong>Active VFS Path:</strong> <code>{activeViewPath}</code>
          </div>

          {showAstInspector && (
            <div style={{ marginTop: '0.75rem' }}>
              <pre
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  fontSize: '0.8rem',
                  background: '#1e1e1e',
                  color: '#4ade80',
                  padding: '0.75rem',
                  borderRadius: '6px',
                }}
              >
                {rawSource}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}