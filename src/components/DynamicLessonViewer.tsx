import React, { useState, useEffect, useMemo } from 'react';
import { MasterCatalog, CatalogItem, LearningStream } from '../types/learning-ast';
import { getVfsView, saveVfsView, bootstrapVfsViews } from '../services/dbStore';
import { parseSExpr } from '../utils/sexprParser';
import { SExprAST } from '../types/sexpr';
import SExprViewRenderer from './SExprViewRenderer';
import { Channels } from '../utils/channelBus';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { VFS_CURRICULUM_SEEDS } from '../manifests/vfsSeedModules';

interface EngineProps {
  defaultPhase?: 'PRIMARY' | 'SECONDARY' | string;
  defaultSubject?: string;
  defaultStream?: LearningStream | string;
}

// Fallback seed view for testing/offline bootstrap
const DEFAULT_FALLBACK_VIEW = `(view :className "card padding--md margin-vert--md"
  (header :level 3 "Primary Mathematics: Basic Addition")
  (callout :variant "info" "Addition is combining two or more quantities into a single total.")
  (stepper
    (step (text "Step 1: Look at the units column first."))
    (step (text "Step 2: Add 4 + 3 to get 7."))
    (step (text "Step 3: Combine with the tens column.")))
  (quiz :id "math-add-101"
    (question "What is 14 + 13?")
    (option "26")
    (option :correct true "27")
    (option "28")
    (explanation "14 + 13 = (10 + 10) + (4 + 3) = 20 + 7 = 27."))
  (ai-tutor :persona "Prof. Turing" :engine "Gemini Nano" :greeting "I am here to guide your addition steps! Ask me if you get stuck."))`;

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
  const [activeViewPath, setActiveViewPath] = useState<string>('/sys/views/math_addition.lisp');

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

  // Sync teacher mode across local storage
  useEffect(() => {
    const syncTeacherMode = () => {
      if (typeof window !== 'undefined') {
        setIsTeacherMode(localStorage.getItem('app_teacher_mode') === 'true');
      }
    };
    window.addEventListener('storage', syncTeacherMode);
    return () => window.removeEventListener('storage', syncTeacherMode);
  }, []);

useEffect(() => {
    async function initCatalog() {
      try {
        const catRes = await fetch(`${normalizedBase}/manifests/catalog.json`);
        const catViews: Record<string, string> = {};

        if (catRes.ok) {
          const catData: MasterCatalog = await catRes.json();
          setCatalog(catData);

          // Dynamically synthesize S-Expression views for every Oak lesson
          catData.items.forEach((item) => {
            const vfsPath = `/sys/views/${item.id}.lisp`;
            catViews[vfsPath] = `(view :className "card padding--md margin-vert--md"
  (header :level 3 "${item.title}")
  (callout :variant "info" "${item.description || 'Explore the lesson steps and check your understanding.'}")
  (stepper
    (step (text "Review the core principles and context for ${item.title}."))
    (step (text "Work through the primary practice problems carefully."))
    (step (text "Verify your conclusions against the solution criteria.")))
  (quiz :id "${item.id}-quiz"
    (question "Are you ready to test your knowledge on ${item.title}?")
    (option :correct true "Yes, begin review")
    (option "Review concepts again")
    (explanation "Proceed with your analysis and ask the tutor if you need guidance."))
  (ai-tutor :persona "${item.subject || 'Oak'} Tutor" :engine "Gemini Nano" :greeting "Welcome to ${item.title}! How can I help guide your learning today?"))`;
          });
        }

        // Write both default seeds and full dynamic catalog into IndexedDB VFS
        await bootstrapVfsViews({
          '/sys/views/math_addition.lisp': DEFAULT_FALLBACK_VIEW,
          ...VFS_CURRICULUM_SEEDS,
          ...catViews,
        });
      } catch (err) {
        console.warn('Catalog index could not be loaded; running standalone VFS:', err);
      }
    }

    initCatalog();
  }, [normalizedBase]);

  // 2. Load View from IndexedDB VFS whenever path changes
  useEffect(() => {
    async function loadVfsModule() {
      setIsLoading(true);
      try {
        let content = await getVfsView(activeViewPath);
        if (!content) {
          content = DEFAULT_FALLBACK_VIEW;
          await saveVfsView(activeViewPath, content);
        }
        setRawSource(content);
        const parsed = parseSExpr(content);
        setCurrentAst(parsed);
      } catch (err) {
        console.error('Failed to load S-Expression view from VFS:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadVfsModule();
  }, [activeViewPath]);

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

  const handleAction = (action: string, payload?: any) => {
    // Dispatch to non-blocking CSP channel
    Channels.UI_ACTIONS.send({ action, payload });
  };

return (
    <div style={{ maxWidth: '840px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Dynamic Multi-Filter Navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Phase Filter (Primary / Secondary) */}
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

        {/* Subject Filter */}
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

        {/* Dynamic Lesson Dropdown populated from Oak Catalog + Seed Modules */}
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
            <optgroup label="Seeded Modules">
              <option value="/sys/views/math_addition.lisp">➕ Primary Math: Basic Addition</option>
              <option value="/sys/views/math_fractions.lisp">🍰 Primary Math: Fractions & Decimals</option>
              <option value="/sys/views/sci_plants.lisp">🌱 Primary Science: Plant Photosynthesis</option>
              <option value="/sys/views/physics_forces.lisp">🚀 GCSE Physics: Newton's Laws</option>
              <option value="/sys/views/chem_atoms.lisp">⚛️ GCSE Chemistry: Atomic Structure</option>
            </optgroup>
          )}
        </select>
      </div>

      {/* Main Declarative S-Expression Engine View */}
      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Loading module from IndexedDB VFS...
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