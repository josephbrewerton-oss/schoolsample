// src/engine/engineflow.ts
import { ASTNode, parseAST, resolveTopicAST } from './ast-loader';
import { ASTFlowGovernor, GovernedQuestion, RawASTQuestion } from './astGovernor';
import { PromptASTPreParser } from './promptAstparser';
import { runLocalInference } from './EdgeCognitiveEngine';
import { OakStage, OakSubject, OakTopic } from '../curriculum/oakCatalogue';

export interface GenerationRequest {
  subject: string;
  topic: string;
  keyStage: string;
  curriculum?: 'uk_oak' | 'international' | string;
  isQuiz?: boolean;
}

export interface LessonViewContent {
  title: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
}

export interface EngineResult {
  raw: string;
  governed: GovernedQuestion | null;
  ast: ASTNode | null;
  fromCache: boolean;
}

export class EngineFlow {
  /**
   * 1. PRACTICE LAB ROUTE: Token Optimization -> Prompt API -> AST Governance
   */
  public static async synthesizeGovernedQuestion(
    req: GenerationRequest
  ): Promise<GovernedQuestion> {
    const topicKey = `${req.keyStage}_${req.subject}_${req.topic}`.toLowerCase();

    // 1. Build token-dense prompt for multiple-choice quiz format
    const prompt = PromptASTPreParser.parseForInference({
      subject: req.subject,
      topic: req.topic,
      keyStage: req.keyStage,
      curriculum: req.curriculum || 'uk_oak',
    });

    // 2. Execute on-device Gemini Nano inference
    const rawContent = await runLocalInference(prompt, undefined, topicKey);

    // 3. Parse AST tokens into structured node
    const parsedNode = parseAST(rawContent);
    const normalized = this.normalizeASTToQuestion(parsedNode);

    // 4. Pass normalized (or null) to Governor to guarantee a domain-accurate, validated question
    return ASTFlowGovernor.govern(normalized, req.subject, req.topic);
  }

  // Alias for semantic clarity
  public static generatePracticeQuestion = EngineFlow.synthesizeGovernedQuestion;

  /**
   * 2. LEARNING ZONE ROUTE: Pedagogical Lesson Card Generation
   */
  public static async generateLessonCards(req: {
    keyStage: string;
    subject: string;
    topic: string;
    curriculum?: string;
  }): Promise<LessonViewContent> {
    const topicKey = `${req.keyStage}_${req.subject}_${req.topic}`.toLowerCase();

    const systemPrompt = `You are an expert UK Oak National Curriculum author. Generate a concise, age-appropriate lesson structure for ${req.keyStage} ${req.subject}: "${req.topic}".
Format strictly as an S-expression:
(:route "lesson:view"
 :axiom "<Core foundational rule or concept definition under 25 words>"
 :trap "<Common student misconception or pitfall to avoid under 25 words>"
 :hook "<Engaging real-world or inquiry opening question>"
 :guided "<Step-by-step worked example or activity guidance>"
 :socratic "<Socratic check question to verify understanding>")`;

    const prompt = `Synthesize structured lesson cards for ${req.keyStage} ${req.subject}: "${req.topic}". Output only a valid Lisp S-expression.`;

    const raw = await runLocalInference(prompt, systemPrompt, topicKey);
    const parsed = parseAST(raw);

    return {
      title: req.topic,
      axiom: this.extractProp(parsed, 'axiom') || `Key foundational rule for ${req.topic} in ${req.subject}.`,
      trap: this.extractProp(parsed, 'trap') || `Commonly confusing misconceptions in ${req.topic}.`,
      hook: this.extractProp(parsed, 'hook') || `How does ${req.topic} apply in real-world contexts?`,
      guidedStep: this.extractProp(parsed, 'guided') || `Analyze the structure and principles of ${req.topic} step-by-step.`,
      socraticCheck: this.extractProp(parsed, 'socratic') || `What is the core rule behind ${req.topic}?`,
    };
  }

  /**
   * 3. Resolves and caches full lesson modules from VFS or On-Device generation
   */
  public static async resolveLessonView(
    stage: OakStage,
    subject: OakSubject,
    topic: OakTopic
  ): Promise<{ raw: string; ast: ASTNode | null }> {
    return resolveTopicAST(stage, subject, topic);
  }

  /**
   * 4. Normalizes parsed AST node objects to standard question schema
   */
  public static normalizeASTToQuestion(parsed: any): RawASTQuestion & { hint?: string } | null {
    if (!parsed) return null;

    // Handle nested (view ... (quiz ...)) or (body (quiz ...)) structures
    let target = parsed;
    if (parsed.body && typeof parsed.body === 'object') {
      target = parsed.body.quiz || parsed.body;
    } else if (parsed.quiz && typeof parsed.quiz === 'object') {
      target = parsed.quiz;
    }

    // 1. Extract prompt string (:prompt, :q, :question)
    let prompt = '';
    const rawPrompt = target.prompt ?? target.q ?? target.question;
    if (typeof rawPrompt === 'string') {
      prompt = rawPrompt;
    } else if (rawPrompt?.children && Array.isArray(rawPrompt.children)) {
      prompt = rawPrompt.children.join(' ');
    } else if (rawPrompt && typeof rawPrompt === 'object') {
      prompt = rawPrompt.text || rawPrompt.value || Object.values(rawPrompt).join(' ');
    }

    // 2. Extract options list (:options, :opts, :choices) handling array variants and (list ...) tags
    let rawOptionsList: any[] = [];
    const rawOpts = target.options ?? target.opts ?? target.choices;
    if (Array.isArray(rawOpts)) {
      rawOptionsList = rawOpts;
    } else if (rawOpts?.children && Array.isArray(rawOpts.children)) {
      rawOptionsList = rawOpts.children;
    } else if (rawOpts?.list && Array.isArray(rawOpts.list)) {
      rawOptionsList = rawOpts.list;
    } else if (target.list && Array.isArray(target.list)) {
      rawOptionsList = target.list;
    }

    const options: string[] = rawOptionsList
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object' && item !== null) {
          if (typeof item.children?.[0] === 'string') return item.children[0].trim();
          return item.text || item.value || String(item);
        }
        return String(item).trim();
      })
      .filter((opt) => opt.length > 0 && !opt.includes('<DISTRACTOR') && !opt.includes('<CORRECT>'));

    // 3. Extract auxiliary attributes
    const rawScratchpad = target.scratchpad ?? target.calc ?? target.reasoning;
    const scratchpad = typeof rawScratchpad === 'string'
      ? rawScratchpad
      : (rawScratchpad?.children?.[0] || '');

    const rawHint = target.hint ?? target.hints;
    let hint = '';
    if (typeof rawHint === 'string') {
      hint = rawHint;
    } else if (Array.isArray(rawHint)) {
      hint = typeof rawHint[0] === 'string' ? rawHint[0] : (rawHint[0]?.children?.[0] || '');
    } else if (rawHint?.list && Array.isArray(rawHint.list)) {
      hint = typeof rawHint.list[0] === 'string' ? rawHint.list[0] : (rawHint.list[0]?.children?.[0] || '');
    } else if (rawHint?.children?.[0]) {
      hint = rawHint.children[0];
    }

    const rawKey = target['answer-key'] ?? target.ans ?? target.answerKey ?? target.answer_key ?? target.answer ?? 0;
    const answerKey = typeof rawKey === 'number' ? rawKey : parseInt(String(rawKey), 10) || 0;

    let misconceptions: string[] | undefined = undefined;
    const rawMisc = target.misconceptions ?? target.misc;
    if (Array.isArray(rawMisc)) {
      misconceptions = rawMisc.map((m: any) =>
        typeof m === 'string' ? m.trim() : typeof m?.children?.[0] === 'string' ? m.children[0].trim() : String(m)
      );
    } else if (rawMisc?.list && Array.isArray(rawMisc.list)) {
      misconceptions = rawMisc.list.map((m: any) =>
        typeof m === 'string' ? m.trim() : typeof m?.children?.[0] === 'string' ? m.children[0].trim() : String(m)
      );
    } else if (target.trap) {
      const trapText = typeof target.trap === 'string' ? target.trap : target.trap?.children?.[0];
      if (trapText) {
        misconceptions = options.map((_, i) =>
          i === answerKey ? 'Correct conceptual deduction.' : `Common trap: ${trapText}`
        );
      }
    }

    const explanation = typeof target.explanation === 'string'
      ? target.explanation.trim()
      : typeof target.axiom === 'string'
      ? target.axiom.trim()
      : undefined;

    const socraticFollowUp = typeof target.socratic === 'string'
      ? target.socratic.trim()
      : typeof target['socratic-followup'] === 'string'
      ? target['socratic-followup'].trim()
      : typeof target.socraticFollowUp === 'string'
      ? target.socraticFollowUp.trim()
      : undefined;

    // Fail normalization if essential components are absent or poisoned by templates
    if (!prompt || prompt.includes('<STEM>') || options.length < 2) {
      return null;
    }

    return {
      route: target.route || parsed.route || 'quiz:mcq',
      prompt: prompt.trim(),
      scratchpad: scratchpad.trim(),
      hint: hint.trim(),
      explanation,
      misconceptions,
      socraticFollowUp,
      options,
      answerKey: answerKey < options.length ? answerKey : 0,
    };
  }

  /**
   * 5. Helper for direct AST string parsing
   */
  public static parse(source: string): ASTNode | null {
    return parseAST(source);
  }

  private static extractProp(parsed: any, key: string): string {
    if (!parsed) return '';
    const val = parsed[key];
    if (typeof val === 'object') return val?.children?.[0] || '';
    return typeof val === 'string' ? val.trim() : '';
  }
}