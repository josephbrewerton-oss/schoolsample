// src/components/componentsflow.ts
import { SExprAST } from '../types/sexpr';
import { parseSExpr } from '../utils/sexprParser';
import { getVfsView, saveVfsView, logProgress } from '../services/dbStore';
import { 
  initCurriculumDB, 
  syncCurriculumIndex, 
  searchCurriculum, 
  getLessonManifest,
  RAGMatch 
} from '../lib/browser-rag';

export interface FlowCurriculumState {
  keyStage: string;
  subject: string;
  unit: string;
  sessionId: string;
  curriculumStandard: 'uk_oak' | 'international';
}

export interface NanoSessionConfig {
  systemPrompt: string;
  expectedInputLanguages?: string[];
  expectedOutputLanguages?: string[];
}

export interface GroundedContextResult {
  context: string;
  match?: RAGMatch;
}

export class ComponentsFlow {
  private static hypervisorBus = new BroadcastChannel('neural_hypervisor_bus');
  private static voiceBus = new BroadcastChannel('neural_voice_bus');

  // 1. Unified S-Expression & AST Stream
  static async loadAndParseAST(vfsPath: string, fallbackTemplate: string): Promise<{ raw: string; ast: SExprAST }> {
    let content = await getVfsView(vfsPath);
    if (!content) {
      content = fallbackTemplate;
      await saveVfsView(vfsPath, content);
    }
    const ast = parseSExpr(content);
    return { raw: content, ast };
  }

  // 2. Unified On-Device Gemini Nano Inference Pipeline
  static async *streamPrompt(
    prompt: string,
    config: NanoSessionConfig
  ): AsyncGenerator<string, void, unknown> {
    const aiHost = (window as any).ai || (self as any).ai || (window.parent as any)?.ai;
    const GlobalLM = (window as any).LanguageModel || (window.parent as any)?.LanguageModel;
    const targetFactory = aiHost?.languageModel || GlobalLM;

    if (!targetFactory) {
      throw new Error('Prompt API not detected in browser');
    }

    const session = await targetFactory.create({
      systemPrompt: config.systemPrompt,
      expectedInputLanguages: config.expectedInputLanguages || ['en'],
      expectedOutputLanguages: config.expectedOutputLanguages || ['en'],
    });

    try {
      if (typeof session.promptStreaming === 'function') {
        const stream = session.promptStreaming(prompt);
        let accumulated = '';
        for await (const chunk of stream) {
          accumulated = chunk.startsWith(accumulated) ? chunk : accumulated + chunk;
          yield accumulated;
        }
      } else {
        const reply = await session.prompt(prompt);
        yield reply;
      }
    } finally {
      if (session && typeof session.destroy === 'function') {
        session.destroy();
      }
    }
  }

  // 3. Unified Cross-Component Bus Dispatch
  static emitFeedback(message: string, isCorrect: boolean) {
    const payload = { type: 'TURING_FEEDBACK', message, isCorrect };
    this.hypervisorBus.postMessage(payload);
    this.voiceBus.postMessage(payload);
  }

  // 4. Unified Diagnostic Progress Tracking
  static async recordProgress(params: {
    cohortCode: string;
    challengeId: string;
    topicId: string;
    isCorrect: boolean;
    userAnswer: string;
  }) {
    await logProgress({
      cohortCode: params.cohortCode || 'default_cohort',
      challengeId: params.challengeId,
      topicId: params.topicId,
      answeredAt: Date.now(),
      isCorrect: params.isCorrect,
      userAnswer: params.userAnswer,
      errorTag: params.isCorrect ? undefined : 'concept_misconception',
    });
  }

  // 5. In-Browser IndexedDB Context Splicer
  static async getGroundedContext(currentTopic: string, query: string): Promise<GroundedContextResult> {
    try {
      const db = await initCurriculumDB();
      await syncCurriculumIndex(db);
      const matches = await searchCurriculum(db, `${currentTopic} ${query}`, 1);
      
      if (matches.length > 0) {
        return {
          context: `\nCurriculum Context:\n${matches[0].context}`,
          match: matches[0],
        };
      }
    } catch (err) {
      console.warn('[ComponentsFlow RAG Error]:', err);
    }
    return { context: '' };
  }

  // 6. On-Demand AST Lesson Manifest Loader
  static async loadLessonAST(id: string, manifestPath: string): Promise<any> {
    const db = await initCurriculumDB();
    return getLessonManifest(db, id, manifestPath);
  }
}