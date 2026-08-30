// src/engine/hypercall.ts
import { dispatchAstIntent, CurriculumPackage } from '../curriculum';
import { EngineFlow } from './engineflow';
import { ComponentsFlow } from '../components/componentsflow';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getBufferedLesson, putBufferedLesson, CachedLessonRecord } from '../services/dbStore';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { aiCaller } from './aicaller';

export interface HyperMessage<T = any> {
  intent: string;
  payload?: T;
  meta?: Record<string, any>;
}

export interface HyperNodeResult<R = any> {
  ok: boolean;
  data?: R;
  error?: string;
}

const getStageGuidelines = (stage: string) => {
  const s = stage.toLowerCase();
  if (s.includes('ks1') || s.includes('1')) {
    return 'Target: KS1 (Ages 5-7). Sensory, tangible everyday language (bendy, stiff, rough). No formulas. Misconception: Object vs material confusion.';
  }
  if (s.includes('ks2') || s.includes('2')) {
    return 'Target: KS2 (Ages 7-11). Qualitative scientific relationships, simple models. Misconception: Intuitive friction and gravity traps.';
  }
  if (s.includes('ks3') || s.includes('3')) {
    return 'Target: KS3 (Ages 11-14). Scientific models, energy stores, balanced/unbalanced force arrows.';
  }
  return 'Target: KS4 / GCSE (Ages 14-16). Formal GCSE syllabus depth: quantitative relationships (e.g., F=ma, momentum, resultant forces), precise terminology, vector analysis, and Free Body Diagrams. Misconception: Aristotelian impetus (belief that motion requires continuous forward force).';
};

// 1. Concrete Node Execution Registry
const AST_NODE_MAP = new Map<string, { execute: (intent: string, payload: any) => Promise<any> }>([
  // Curriculum Graph Node
  [
    'curriculumnode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'resolve:tree') {
          const standard = (payload?.curriculum || 'uk_oak') as CurriculumProviderKey;
          return getActiveCurriculumTree(standard);
        }
        if (intent === 'get:package') {
          return dispatchAstIntent('getActiveCurriculum', payload?.stage);
        }
        throw new Error(`Unknown CurriculumNode intent: "${intent}"`);
      },
    },
  ],

  // AI Question Generation & AST Governor Engine
  [
    'questionengine',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'synthesize:governed') {
          const stage = payload?.keyStage || 'Key Stage 1';
          const subject = payload?.subject || 'Science';
          const topic = payload?.topic || 'General Science';
          const curriculum = payload?.curriculum || 'uk_oak';
          const stageGuidelines = getStageGuidelines(stage);

          const prompt = `Topic: "${topic}" (${stage} ${subject}, Framework: ${curriculum}).
Age/Stage Guidelines: ${stageGuidelines}

Generate the curriculum logic scaffolding. Return strictly a single JSON object with no Markdown:
{
  "axiom": "Stage-appropriate core rule (plain English for KS1/KS2, rigorous GCSE standard for KS4)",
  "trap": "Accurate, realistic pupil misconception for this exact age group",
  "hook": "Relatable real-world inquiry scenario matching the target stage depth",
  "guidedStep": "Practical or analytical activity appropriate for this stage",
  "prompt": "Direct Socratic question using age-appropriate phrasing (under 20 words)"
}`;

          try {
            const rawResponse = await aiCaller.promptText({
              prompt,
              systemPrompt: `You are an expert UK National Curriculum Educator specializing in ${stage} ${subject}. ${stageGuidelines}. Output strictly valid JSON with no markdown formatting or commentary.`,
              preserveContext: false,
            });

            const match = rawResponse.match(/\{[\s\S]*?\}/);
            if (match) {
              return JSON.parse(match[0]);
            }
          } catch (err) {
            console.warn('[QuestionEngine Parsing Fallback]:', err);
          }

          return {
            axiom: `Fundamental principles governing ${topic}.`,
            trap: `Common misconception regarding ${topic}.`,
            hook: `How does ${topic} operate in everyday physical reality?`,
            guidedStep: `Analyze the core properties and behaviors of ${topic}.`,
            prompt: `What fundamental property defines ${topic}?`,
          };
        }
        throw new Error(`Unknown QuestionEngine intent: "${intent}"`);
      },
    },
  ],

  // Lesson Synthesis Node (IndexedDB Cache + Gemini Nano Full Narrative Expansion)
  [
    'lessonsynthesizer',
    {
      execute: async (intent: string, payload: any) => {
        const stage = payload?.stage || payload?.keyStage || 'Key Stage 1';
        const subject = payload?.subject || 'Science';
        const topic = payload?.topic || payload?.title || payload?.unit || 'General Topic';
        const lessonKey = `${stage}:${subject}:${topic}`.toLowerCase().replace(/\s+/g, '-');
        const stageGuidelines = getStageGuidelines(stage);

        if (intent === 'inflate:baseline') {
          const cached = await getBufferedLesson(lessonKey);
          if (cached) {
            return cached;
          }

          const baselineRecord: CachedLessonRecord = {
            key: lessonKey,
            title: topic,
            stage,
            subject,
            axiom: payload?.axiom || '',
            trap: payload?.trap || '',
            hook: payload?.hook || '',
            guidedStep: payload?.guidedStep || '',
            socraticCheck: payload?.socraticCheck || '',
            fullText: payload?.fullText || '',
            updatedAt: Date.now(),
          };

          if (payload?.axiom && !payload.axiom.startsWith('Core curriculum rule')) {
            await putBufferedLesson(baselineRecord);
          }
          return baselineRecord;
        }

        if (intent === 'synthesize:full-lesson') {
          const cached = await getBufferedLesson(lessonKey);
          if (cached?.fullText && cached.fullText.trim().length > 20) {
            return {
              ...cached,
              content: cached.fullText,
              fullText: cached.fullText,
            };
          }

          const prompt = `You are Super Teacher Nano, an expert UK Curriculum Educator.
Target Level: ${stage.toUpperCase()} • Subject: ${subject} • Topic: ${topic}
Age/Stage Guidelines: ${stageGuidelines}
Core Ground Truth: "${payload?.axiom || 'Fundamental curriculum standard'}"
Specific Misconception: "${payload?.trap || 'Common intuitive error'}"

Generate a comprehensive 4-part lesson plan in clear Markdown:
### 1. Conceptual Narrative
Explain the core principles in depth strictly matching the curriculum depth for ${stage}.

### 2. Worked Example & Demonstration
Step-by-step practical demonstration or analytical calculation suitable for this key stage.

### 3. Misconception Breakdown
Directly dismantle why "${payload?.trap || 'the intuitive error'}" is incorrect.

### 4. Socratic Check-In
One reflective question to verify understanding.`;

          let generatedText = '';

          try {
            generatedText = await aiCaller.promptText({
              prompt,
              systemPrompt: `You are Super Teacher Nano. Return comprehensive structured UK curriculum lessons in clear Markdown strictly adhering to ${stageGuidelines}`,
              preserveContext: false,
            });
          } catch (err) {
            console.warn('[Lesson Synthesis Fallback Activated]:', err);
            generatedText = `### ${topic}\n\n**1. Conceptual Narrative**\n${payload?.axiom || 'Core understanding of this topic.'}\n\n**2. Guided Demonstration**\n${payload?.steps?.[1] || 'Explore the properties and behaviors in detail.'}\n\n**3. Misconception Breakdown**\nMany students believe that "${payload?.trap || 'an incorrect assumption'}". In practice, we evaluate the evidence.\n\n**4. Socratic Check**\n${payload?.steps?.[2] || 'How would you explain this in your own words?'}`;
          }

          const cleanResult = generatedText.trim();

          const updatedRecord: CachedLessonRecord = {
            ...(cached || {
              key: lessonKey,
              title: topic,
              stage,
              subject,
              axiom: payload?.axiom || '',
              trap: payload?.trap || '',
              hook: payload?.steps?.[0] || '',
              guidedStep: payload?.steps?.[1] || '',
              socraticCheck: payload?.steps?.[2] || '',
            }),
            fullText: cleanResult,
            updatedAt: Date.now(),
          };

          try {
            await putBufferedLesson(updatedRecord);
          } catch (e) {
            console.warn('[DB putBufferedLesson Skip]:', e);
          }

          return {
            ...updatedRecord,
            content: cleanResult,
            fullText: cleanResult,
          };
        }

        throw new Error(`Unknown LessonSynthesizer intent: "${intent}"`);
      },
    },
  ],

  // UI Toast & Socratic Feedback Substrate
  [
    'feedbacksubstrate',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'emit:toast') {
          ComponentsFlow.emitFeedback(payload.text, payload.isCorrect);
          return true;
        }
        throw new Error(`Unknown FeedbackSubstrate intent: "${intent}"`);
      },
    },
  ],

  // Telemetry & Metrics Node
  [
    'telemetrynode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'record:answer') {
          await ComponentsFlow.recordProgress({
            cohortCode: payload.cohortCode,
            challengeId: payload.challengeId,
            topicId: payload.topicId,
            isCorrect: payload.isCorrect,
            userAnswer: payload.userAnswer,
          });
          return true;
        }
        throw new Error(`Unknown TelemetryNode intent: "${intent}"`);
      },
    },
  ],

  // Diagnostic Reporting Engine
  [
    'reportengine',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'export:html') {
          const summary = await generateSessionReport(payload.sessionId);
          downloadReportAsHtml(summary);
          return true;
        }
        throw new Error(`Unknown ReportEngine intent: "${intent}"`);
      },
    },
  ],
]);

/**
 * Universal Primitive: Single point of dispatch for all substrate nodes
 */
export async function dispatch(
  target: string,
  message: HyperMessage
): Promise<HyperNodeResult> {
  const symbol = target.toLowerCase();
  const node = AST_NODE_MAP.get(symbol);

  if (!node) {
    console.error(`[Hypercall] Unreachable target node: "${target}"`);
    return { ok: false, error: `AST Node '${target}' not reachable in substrate.` };
  }

  try {
    const result = await node.execute(message.intent, message.payload);
    return { ok: true, data: result };
  } catch (err: any) {
    console.error(`[Hypercall Execution Error] Target: "${target}", Intent: "${message.intent}"`, err);
    return { ok: false, error: err?.message || 'Unknown substrate execution error' };
  }
}