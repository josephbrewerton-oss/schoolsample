// src/engine/hypercall.ts
import { dispatchAstIntent, CurriculumPackage } from '../curriculum';
import { EngineFlow } from './engineflow';
import { ComponentsFlow } from '../components/componentsflow';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';

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

// 1. Concrete Node Execution Registry
const AST_NODE_MAP = new Map<string, { execute: (intent: string, payload: any) => Promise<any> }>([
  // Curriculum Graph Node
  [
    'curriculumnode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'resolve:tree') {
          const stageKey = (payload?.stage || 'ks1').toLowerCase().replace(/\s+/g, '');
          const pkg = dispatchAstIntent<CurriculumPackage>('getActiveCurriculum', stageKey);
          if (pkg?.catalogueStage) {
            return dispatchAstIntent('adaptOakStage', pkg.catalogueStage);
          }
          return null;
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
          const governed = await EngineFlow.synthesizeGovernedQuestion({
            subject: payload.subject,
            topic: payload.topic,
            keyStage: payload.keyStage,
            curriculum: payload.curriculum,
            isQuiz: true,
          });

          if (governed?.isValid && governed.sanitizedQuestion) {
            return governed.sanitizedQuestion;
          }
          throw new Error(governed?.rejectionReason || 'Question generation rejected by AST governor.');
        }
        throw new Error(`Unknown QuestionEngine intent: "${intent}"`);
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
 * Universal Primitive: One single call for all code execution across the graph
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