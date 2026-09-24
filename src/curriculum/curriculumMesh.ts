// src/curriculum/curriculumMesh.ts
/**
 * St Joseph's Curriculum Mesh: AST / JSON-LD Hybrid Routing Substrate
 *
 * Replaces fuzzy string heuristics, scattered knowledge lookups, and fragile regexes
 * with an observable, deterministic Pedagogical Graph. Every Key Stage, Subject,
 * Topic, and Lesson is addressed by an immutable URN and indexed for O(1) resolution.
 */

import { OAK_CURRICULUM_CATALOGUE, OakStage, OakLesson } from './oakCatalogue';
import { findCurriculumKnowledge, CurriculumTopicKnowledge } from '../data/oakCurriculumKnowledge';
import { MathQuestionGenerator } from '../engine/mathQuestionGenerator';
import { getInstalledCurriculumPacks } from '../services/curriculumPackStore';
import { saveVfsView, getVfsView } from '../services/dbStore';

export type ExecutionEngineType = 'curriculum_bank' | 'procedural_generator' | 'socratic_nano';

export interface CurriculumQuestionItem {
  id: string;
  prompt: string;
  options: string[];
  answerKey: number;
  explanation: string;
  hint: string;
  misconceptions: string[];
  stageBadge?: string;
  stepLabel?: string;
}

export interface CurriculumLessonNode {
  id: string;
  title: string;
  lessonNumber: number;
  urn: string;
  questionRefId?: string;
  question?: CurriculumQuestionItem;
}

export interface CurriculumRouteNode {
  csn: string;                           // Curriculum Stock Number (NATO-style identifier, e.g. "CSN-KS2-MATH-FRAC")
  urn: string;                           // e.g. "urn:curriculum:ks2:science:states-of-matter"
  path: string;                          // e.g. "ks2/science/states-of-matter"
  stageId: string;                       // e.g. "ks2"
  stageTitle: string;                    // e.g. "Key Stage 2"
  subjectId: string;                     // e.g. "science"
  subjectTitle: string;                  // e.g. "Science"
  topicId: string;                       // e.g. "states-of-matter"
  topicTitle: string;                    // e.g. "States of Matter"
  executionEngine: ExecutionEngineType;  // 'curriculum_bank' | 'procedural_generator' | 'socratic_nano'
  axiom: string;                         // Core invariant conceptual rule
  cognitiveTrap: string;                 // Characteristic pupil error / distractor rationale
  hook: string;                          // Everyday real-world context
  guidedStep: string;                    // Reasoning scaffold step
  socraticPivot: string;                 // Remedial / exploratory inquiry question
  scaffoldHints?: {
    level1: string;
    level2: string;
    level3: string;
  };
  lessons: CurriculumLessonNode[];
  questions: CurriculumQuestionItem[];
}

// -------------------------------------------------------------
// Helper: Normalizer for consistent indexing
// -------------------------------------------------------------
function normalizeToken(str: string): string {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/^urn:curriculum:/, '')
    .replace(/[^a-z0-9]+/g, '-');
}

// -------------------------------------------------------------
// Compilation: Assemble the Unified In-Memory Mesh
// -------------------------------------------------------------
export function generateCurriculumStockNumber(stageId: string, subjectId: string, topicId: string): string {
  const s = (stageId || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const sub = (subjectId || 'SUB').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const top = (topicId || 'TOP').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return `CSN-${s}-${sub}-${top}`;
}

const ROUTE_MAP_BY_URN = new Map<string, CurriculumRouteNode>();
const ROUTE_MAP_BY_PATH = new Map<string, CurriculumRouteNode>();
const ROUTE_MAP_BY_TUPLE = new Map<string, CurriculumRouteNode>();
const ROUTE_MAP_BY_TOPIC_ID = new Map<string, CurriculumRouteNode>();
const ROUTE_MAP_BY_CSN = new Map<string, CurriculumRouteNode>();

export const ALL_CURRICULUM_ROUTES: CurriculumRouteNode[] = [];

function compileCurriculumMesh() {
  for (const [stageKey, stage] of Object.entries(OAK_CURRICULUM_CATALOGUE)) {
    const normStage = normalizeToken(stageKey);

    for (const sub of stage.subjects) {
      const normSub = normalizeToken(sub.id || sub.title);

      for (const top of sub.topics) {
        const normTop = normalizeToken(top.id || top.title);
        const urn = `urn:curriculum:${stage.id}:${sub.id}:${top.id}`;
        const path = `${stage.id}/${sub.id}/${top.id}`;

        // Retrieve verified curriculum knowledge from knowledge substrate
        const knowledge: CurriculumTopicKnowledge | null = findCurriculumKnowledge(
          stageKey,
          sub.title,
          top.title
        );

        // Determine execution engine deterministically:
        // Math procedural questions run ONLY for dedicated arithmetic/multiplication calculation skills
        const isMathProcedural =
          MathQuestionGenerator.canGenerate(stage.title, sub.title, top.title) &&
          (normTop.includes('multipli') ||
            normTop.includes('arithmetic') ||
            normTop.includes('division') ||
            normTop.includes('algebra') ||
            normTop.includes('bidmas') ||
            normTop.includes('fraction-arithmetic'));

        const executionEngine: ExecutionEngineType = isMathProcedural
          ? 'procedural_generator'
          : 'curriculum_bank';

        const questions: CurriculumQuestionItem[] = (knowledge?.questions || []).map((q, idx) => ({
          id: q.id || `q_${stage.id}_${sub.id}_${top.id}_${idx + 1}`,
          prompt: q.prompt,
          options: q.options,
          answerKey: q.answerKey,
          explanation: q.explanation || knowledge?.coreAxiom || 'Review core curriculum principles.',
          hint: q.hint || knowledge?.scaffoldHints.level1 || 'Focus on foundational definitions.',
          misconceptions: q.options.map((_, optIdx) => {
            if (optIdx === q.answerKey) return 'Correct! Accurately applies curriculum rules.';
            return `Common trap: ${knowledge?.cognitiveTrap || 'Confuses fundamental properties.'}`;
          }),
          stageBadge: `${stage.title} • ${sub.title}`,
          stepLabel: knowledge?.title || top.title,
        }));

        // Map lessons with semantic question bindings (matching title keywords or falling back gracefully)
        const lessons: CurriculumLessonNode[] = (top.lessons || []).map((l: OakLesson, lIdx: number) => {
          let matchedQ = questions[lIdx] || questions[0];
          if (questions.length > 1 && l.title) {
            const stopWords = new Set(['lesson', '1', '2', '3', '4', '5', 'and', 'the', 'of', 'in', 'for', 'with', 'vs']);
            const lTokens = l.title
              .toLowerCase()
              .split(/[^a-z0-9]+/)
              .filter((w) => w.length > 2 && !stopWords.has(w));

            let bestScore = 0;
            for (const q of questions) {
              let score = 0;
              const text = `${q.prompt} ${q.explanation} ${q.hint}`.toLowerCase();
              for (const tok of lTokens) {
                if (text.includes(tok)) score += 2;
              }
              if (score > bestScore) {
                bestScore = score;
                matchedQ = q;
              }
            }
          }

          return {
            id: l.id,
            title: l.title,
            lessonNumber: l.lessonNumber,
            urn: `${urn}:${l.id}`,
            questionRefId: matchedQ?.id,
            question: matchedQ,
          };
        });

        const csn = generateCurriculumStockNumber(stage.id, sub.id, top.id);

        const routeNode: CurriculumRouteNode = {
          csn,
          urn,
          path,
          stageId: stage.id,
          stageTitle: stage.title,
          subjectId: sub.id,
          subjectTitle: sub.title,
          topicId: top.id,
          topicTitle: top.title,
          executionEngine,
          axiom: knowledge?.coreAxiom || `Core invariant rule for ${top.title} at ${stage.title}.`,
          cognitiveTrap: knowledge?.cognitiveTrap || `Frequent misconception regarding ${top.title}.`,
          hook: knowledge?.hook || `Real-world context for ${top.title}.`,
          guidedStep: knowledge?.guidedStep || `Examine the defining properties of ${top.title}.`,
          socraticPivot: knowledge?.socraticPivot || `What is the essential characteristic of ${top.title}?`,
          scaffoldHints: knowledge?.scaffoldHints,
          lessons,
          questions,
        };

        ALL_CURRICULUM_ROUTES.push(routeNode);

        // Index in routing tables for O(1) retrieval
        ROUTE_MAP_BY_URN.set(urn, routeNode);
        ROUTE_MAP_BY_PATH.set(path, routeNode);
        ROUTE_MAP_BY_CSN.set(csn, routeNode);

        const tupleKey = `${normStage}|${normSub}|${normTop}`;
        ROUTE_MAP_BY_TUPLE.set(tupleKey, routeNode);

        // Also index by topic ID and friendly aliases
        if (!ROUTE_MAP_BY_TOPIC_ID.has(normTop)) {
          ROUTE_MAP_BY_TOPIC_ID.set(normTop, routeNode);
        }
        if (!ROUTE_MAP_BY_TOPIC_ID.has(top.id)) {
          ROUTE_MAP_BY_TOPIC_ID.set(top.id, routeNode);
        }
      }
    }
  }
}

// Execute initial mesh assembly
compileCurriculumMesh();

// -------------------------------------------------------------
// Dynamic Mesh Registration (Data-Agnostic Substrate)
// -------------------------------------------------------------
/**
 * Registers an arbitrary curriculum route node into the routing tables.
 * Allows custom curriculum packs, overseas syllabi, or AI-generated AST topologies
 * to integrate into the exact same O(1) execution pipeline.
 */
export function registerRouteNode(node: CurriculumRouteNode): void {
  const normStage = normalizeToken(node.stageId || node.stageTitle);
  const normSub = normalizeToken(node.subjectId || node.subjectTitle);
  const normTop = normalizeToken(node.topicId || node.topicTitle);

  const existingIdx = ALL_CURRICULUM_ROUTES.findIndex((r) => r.urn === node.urn);
  if (existingIdx !== -1) {
    ALL_CURRICULUM_ROUTES[existingIdx] = node;
  } else {
    ALL_CURRICULUM_ROUTES.push(node);
  }

  ROUTE_MAP_BY_URN.set(node.urn, node);
  ROUTE_MAP_BY_PATH.set(node.path, node);
  if (node.csn) {
    ROUTE_MAP_BY_CSN.set(node.csn, node);
  }
  ROUTE_MAP_BY_TUPLE.set(`${normStage}|${normSub}|${normTop}`, node);
  ROUTE_MAP_BY_TOPIC_ID.set(normTop, node);
  ROUTE_MAP_BY_TOPIC_ID.set(node.topicId, node);
}

/**
 * Dynamically ingests an arbitrary CustomCurriculumPack into the Mesh.
 */
export function ingestCustomCurriculumPack(pack: any): number {
  if (!pack || !pack.stages) return 0;
  let registeredCount = 0;

  for (const [stageKey, stageData] of Object.entries<any>(pack.stages)) {
    const stageId = stageData.id || stageKey;
    const stageTitle = stageData.title || stageKey;

    for (const sub of stageData.subjects || []) {
      for (const top of sub.topics || []) {
        const matchingLessons = (pack.lessons || []).filter(
          (l: any) =>
            (l.stageTitle === stageTitle || l.stageTitle === stageId) &&
            (l.subjectTitle === sub.title || l.subjectTitle === sub.id) &&
            (l.topicTitle === top.title || l.topicTitle === top.id || l.unitTitle === top.title)
        );

        const questions: CurriculumQuestionItem[] = matchingLessons.flatMap((l: any, lIdx: number) =>
          (l.questions || []).map((q: any, qIdx: number) => {
            const correctOpt = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
            const distractorTexts = (q.distractors || []).map((d: any) => (typeof d === 'string' ? d : d.answerText));
            const allOptions = [correctOpt, ...distractorTexts].filter(Boolean);

            return {
              id: `${pack.id}_${stageId}_${sub.id}_${top.id}_${lIdx}_${qIdx}`,
              prompt: q.questionText,
              options: allOptions,
              answerKey: 0,
              explanation: q.explanation || l.axiom || 'Core curriculum invariant.',
              hint: q.hint || 'Review the key definition.',
              misconceptions: (q.distractors || []).map((d: any) => (typeof d === 'object' ? d.feedback : 'Common misconception.')),
              stageBadge: `${stageTitle} • ${sub.title}`,
              stepLabel: top.title,
            };
          })
        );

        const urn = `urn:curriculum:${stageId}:${sub.id}:${top.id}`;
        const path = `${stageId}/${sub.id}/${top.id}`;
        const csn = generateCurriculumStockNumber(stageId, sub.id, top.id);

        const routeNode: CurriculumRouteNode = {
          csn,
          urn,
          path,
          stageId,
          stageTitle,
          subjectId: sub.id,
          subjectTitle: sub.title,
          topicId: top.id,
          topicTitle: top.title,
          executionEngine: 'curriculum_bank',
          axiom: matchingLessons[0]?.axiom || `Axiomatic foundation of ${top.title}.`,
          cognitiveTrap: matchingLessons[0]?.trap || `Characteristic cognitive trap for ${top.title}.`,
          hook: matchingLessons[0]?.hook || `Real-world inquiry context for ${top.title}.`,
          guidedStep: matchingLessons[0]?.guidedStep || `Step-by-step reasoning for ${top.title}.`,
          socraticPivot: matchingLessons[0]?.socraticCheck || `Inquiry question for ${top.title}?`,
          lessons: matchingLessons.map((l: any, idx: number) => ({
            id: l.id || `l_${idx + 1}`,
            title: l.unitTitle || l.topicTitle || `Lesson ${idx + 1}`,
            lessonNumber: idx + 1,
            urn: `${urn}:${l.id || idx + 1}`,
            questionRefId: questions[idx]?.id,
            question: questions[idx],
          })),
          questions,
        };

        registerRouteNode(routeNode);
        registeredCount++;
      }
    }
  }

  return registeredCount;
}

// -------------------------------------------------------------
// IndexedDB Mesh Synchronization (Zero Cloud Architecture)
// -------------------------------------------------------------
/**
 * Asynchronously persists the compiled S-expression AST and JSON-LD schema
 * directly into the browser's native IndexedDB (STORE_VIEWS).
 * Guarantees zero network latency (< 2ms lookup) and full offline operation.
 */
export async function syncMeshToIndexedDB(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const ast = exportCurriculumMeshToSExpr();
    await saveVfsView('/manifests/curriculum-mesh.ast', ast);
    const json = JSON.stringify(exportCurriculumMeshToJSON());
    await saveVfsView('/manifests/curriculum-mesh.json', json);
  } catch (err) {
    console.warn('[CurriculumMesh] IndexedDB sync error:', err);
  }
}

// Hydrate custom installed packs and schedule background IndexedDB sync on client startup
if (typeof window !== 'undefined') {
  try {
    const installed = getInstalledCurriculumPacks();
    for (const p of installed) {
      ingestCustomCurriculumPack(p);
    }
  } catch {}

  // Defer IndexedDB background sync until main thread is idle
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => syncMeshToIndexedDB());
  } else {
    setTimeout(() => syncMeshToIndexedDB(), 1000);
  }
}

// -------------------------------------------------------------
// O(1) Route Resolver
// -------------------------------------------------------------
/**
 * Resolves a curriculum route node instantaneously using deterministic keys:
 * Accepts URN, path, or stage/subject/topic strings.
 */
export function resolveCurriculumRoute(
  stage?: string,
  subject?: string,
  topic?: string,
  lessonTitleOrId?: string
): CurriculumRouteNode | null {
  if (!topic && !stage) return null;

  // Case 0: Direct Curriculum Stock Number (CSN) lookup (e.g. "CSN-KS2-MATH-FRAC")
  if (stage?.toUpperCase().startsWith('CSN-') || topic?.toUpperCase().startsWith('CSN-')) {
    const rawCsn = (stage?.toUpperCase().startsWith('CSN-') ? stage : topic)!.toUpperCase().trim();
    if (ROUTE_MAP_BY_CSN.has(rawCsn)) {
      return ROUTE_MAP_BY_CSN.get(rawCsn)!;
    }
  }

  // Case 1: Direct URN lookup (e.g. "urn:curriculum:ks2:science:states-of-matter")
  if (topic?.startsWith('urn:curriculum:') || stage?.startsWith('urn:curriculum:')) {
    const targetUrn = (topic?.startsWith('urn:curriculum:') ? topic : stage) || '';
    const cleanUrn = targetUrn.split(':').slice(0, 5).join(':');
    if (ROUTE_MAP_BY_URN.has(cleanUrn)) {
      return ROUTE_MAP_BY_URN.get(cleanUrn)!;
    }
  }

  // Case 2: Direct Path lookup (e.g. "ks2/science/states-of-matter")
  if (topic?.includes('/') || stage?.includes('/')) {
    const rawPath = (topic?.includes('/') ? topic : stage) || '';
    const cleanPath = rawPath.replace(/^\/+|\/+$/g, '');
    if (ROUTE_MAP_BY_PATH.has(cleanPath)) {
      return ROUTE_MAP_BY_PATH.get(cleanPath)!;
    }
  }

  // Case 3: Normalized Stage + Subject + Topic Tuple
  const normSt = normalizeToken(stage || '');
  const normSub = normalizeToken(subject || '');
  const normTop = normalizeToken(topic || '');

  // Exact tuple match
  const tupleKey = `${normSt}|${normSub}|${normTop}`;
  if (ROUTE_MAP_BY_TUPLE.has(tupleKey)) {
    return ROUTE_MAP_BY_TUPLE.get(tupleKey)!;
  }

  // Tuple match with fuzzy stage aliases (e.g. "Key Stage 2" vs "ks2")
  const stageAlias = normSt.includes('1') ? 'ks1' : normSt.includes('2') ? 'ks2' : normSt.includes('3') ? 'ks3' : normSt.includes('4') ? 'ks4' : normSt;
  const aliasedTupleKey = `${stageAlias}|${normSub}|${normTop}`;
  if (ROUTE_MAP_BY_TUPLE.has(aliasedTupleKey)) {
    return ROUTE_MAP_BY_TUPLE.get(aliasedTupleKey)!;
  }

  // Case 4: Fast scan with token containment
  const found = ALL_CURRICULUM_ROUTES.find((r) => {
    const matchStage = r.stageId === stageAlias || r.stageTitle.toLowerCase() === (stage || '').toLowerCase();
    const matchSub = r.subjectId.includes(normSub) || normSub.includes(r.subjectId) || r.subjectTitle.toLowerCase() === (subject || '').toLowerCase();
    const matchTopic = r.topicId === normTop || r.topicTitle.toLowerCase() === (topic || '').toLowerCase() || r.topicId.includes(normTop) || normTop.includes(r.topicId);
    return matchStage && matchTopic && (!subject || matchSub);
  });

  if (found) return found;

  // Case 5: Direct Topic ID fallback
  if (ROUTE_MAP_BY_TOPIC_ID.has(normTop)) {
    return ROUTE_MAP_BY_TOPIC_ID.get(normTop)!;
  }

  return null;
}

// -------------------------------------------------------------
// Question Selector for Route
// -------------------------------------------------------------
export function getQuestionForRoute(
  route: CurriculumRouteNode,
  lessonTitleOrId?: string,
  forceVariation = false,
  seedToken?: string,
  excludePrompt?: string
): CurriculumQuestionItem | null {
  if (!route || route.questions.length === 0) return null;

  // 1. If a lesson title or ID was specified, find the 1:1 mapped lesson question
  if (lessonTitleOrId) {
    const lNorm = normalizeToken(lessonTitleOrId);
    const matchedLesson = route.lessons.find(
      (l) => l.id === lessonTitleOrId || normalizeToken(l.title).includes(lNorm) || lNorm.includes(normalizeToken(l.title))
    );
    if (matchedLesson && matchedLesson.question) {
      if (!excludePrompt || matchedLesson.question.prompt.trim() !== excludePrompt.trim()) {
        return matchedLesson.question;
      }
    }

    // Check lesson number e.g. "Lesson 2: ..."
    const lNumMatch = lessonTitleOrId.match(/lesson\s*(\d+)/i);
    if (lNumMatch) {
      const idx = parseInt(lNumMatch[1], 10) - 1;
      if (idx >= 0 && idx < route.questions.length) {
        if (!excludePrompt || route.questions[idx].prompt.trim() !== excludePrompt.trim()) {
          return route.questions[idx];
        }
      }
    }
  }

  // Filter out excluded prompt if multiple questions exist
  const candidates = (excludePrompt && route.questions.length > 1)
    ? route.questions.filter((q) => q.prompt.trim() !== excludePrompt.trim())
    : route.questions;
  const pool = candidates.length > 0 ? candidates : route.questions;

  // 2. If seedToken is provided, pick deterministically based on seed
  if (seedToken) {
    const seedNum = (seedToken || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const idx = Math.abs(seedNum) % pool.length;
    return pool[idx] || pool[0];
  }

  // 3. If forceVariation is requested or cycling in practice, pick from pool
  if (forceVariation && pool.length > 1) {
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] || pool[0];
  }

  // 4. By default, pick pseudo-randomly among candidates so repeated drills offer variety
  if (pool.length > 1) {
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] || pool[0];
  }

  return pool[0];
}

// -------------------------------------------------------------
// S-Expression AST Serializer
// Generates compact, token-efficient Lisp AST for Edge-AI / Gemini Nano
// -------------------------------------------------------------
export function exportCurriculumMeshToSExpr(): string {
  let ast = `;; St Joseph's Curriculum Ontology Mesh AST\n;; Format: S-Expression Lisp-compatible AST\n(:curriculum-mesh\n  :version "3.0.0"\n  :total-nodes ${ALL_CURRICULUM_ROUTES.length}\n  :stages (\n`;

  const stages = Object.values(OAK_CURRICULUM_CATALOGUE);
  for (const st of stages) {
    ast += `    (:stage :id "${st.id}" :title "${st.title}"\n      :subjects (\n`;
    for (const sub of st.subjects) {
      ast += `        (:subject :id "${sub.id}" :title "${sub.title}"\n          :topics (\n`;
      for (const top of sub.topics) {
        const route = resolveCurriculumRoute(st.id, sub.id, top.id);
        const engine = route?.executionEngine || 'curriculum_bank';
        const qCount = route?.questions.length || 0;
        ast += `            (:topic :id "${top.id}" :title "${top.title}" :engine :${engine} :questions ${qCount}\n`;
        ast += `              :axiom "${escapeSExprString(route?.axiom || '')}"\n`;
        ast += `              :trap "${escapeSExprString(route?.cognitiveTrap || '')}"\n`;
        if (top.lessons && top.lessons.length > 0) {
          ast += `              :lessons (\n`;
          for (const l of top.lessons) {
            ast += `                (:lesson :id "${l.id}" :number ${l.lessonNumber} :title "${escapeSExprString(l.title)}")\n`;
          }
          ast += `              )\n`;
        }
        ast += `            )\n`;
      }
      ast += `          )\n        )\n`;
    }
    ast += `      )\n    )\n`;
  }

  ast += `  )\n)\n`;
  return ast;
}

function escapeSExprString(str: string): string {
  return (str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

// -------------------------------------------------------------
// JSON-LD Manifest Serializer
// -------------------------------------------------------------
export function exportCurriculumMeshToJSON(): object {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "St Joseph's Curriculum Mesh",
    "version": "3.0.0",
    "totalRoutes": ALL_CURRICULUM_ROUTES.length,
    "routes": ALL_CURRICULUM_ROUTES.map((r) => ({
      urn: r.urn,
      path: r.path,
      stage: r.stageTitle,
      subject: r.subjectTitle,
      topic: r.topicTitle,
      executionEngine: r.executionEngine,
      axiom: r.axiom,
      cognitiveTrap: r.cognitiveTrap,
      lessonsCount: r.lessons.length,
      questionsCount: r.questions.length,
    })),
  };
}
