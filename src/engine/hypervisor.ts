// src/engine/hypervisor.ts
/**
 * St Joseph's Neural Hypervisor Engine
 * Supervises isolated worker/guest execution runtimes, enforces AST rulebook constraints (quiz.rules.ast),
 * provides VM watchdog timeouts, traps guest hypercalls, and manages warm session lifecycles.
 */

import { getRuleSet, RulesRegistry } from '../rules';
import { ASTFlowGovernor, RawASTQuestion } from './astGovernor';
import { EngineFlow } from './engineflow';
import { extractQuestionFromAst } from '../utils/astQuestionExtractor';
import { saveVerifiedAST, saveVfsView } from '../services/dbStore';
import type { HyperMessage, HyperNodeResult } from './hypercall';

export type HypercallDispatcher = (target: string, message: HyperMessage) => Promise<HyperNodeResult>;

let externalDispatcher: HypercallDispatcher | null = null;
export function setHypercallDispatcher(fn: HypercallDispatcher) {
  externalDispatcher = fn;
}

export type GuestVMState = 'uninitialized' | 'booting' | 'ready' | 'executing' | 'watchdog_timeout' | 'faulted';

export interface HypervisorMetrics {
  totalInferences: number;
  successfulInferences: number;
  watchdogTimeouts: number;
  ruleViolationsIntercepted: number;
  autoRepairsApplied: number;
  lastExecutionLatencyMs: number;
  lastHeartbeatPingMs: number;
  sessionWarm: boolean;
  guestCapabilities: string[];
}

export interface RuleAuditResult {
  passed: boolean;
  ruleViolations: string[];
  autoRepairs: string[];
  governedQuestion: RawASTQuestion | null;
  sanitizedLisp: string;
}

export interface HypervisorInferenceRequest {
  keyStage: string;
  subject: string;
  unit: string;
  curriculum?: string;
  difficulty?: 'warmup' | 'challenger' | 'brainbuster';
  lang?: string;
  timeoutMs?: number;
}

export interface HypervisorInferenceResult {
  ok: boolean;
  source: 'guest_vm' | 'offline_deterministic' | 'cache';
  rawAST?: string;
  question?: RawASTQuestion;
  error?: string;
  latencyMs: number;
  audit?: RuleAuditResult;
}

export class HypervisorHost {
  private static instance: HypervisorHost | null = null;

  private state: GuestVMState = 'uninitialized';
  private signalingBus: BroadcastChannel | null = null;
  private hypervisorBus: BroadcastChannel | null = null;
  private workerIframe: HTMLIFrameElement | null = null;

  // Active in-flight requests map: requestId -> { resolve, reject, timer, startTime }
  private pendingRequests = new Map<
    string,
    {
      resolve: (val: any) => void;
      reject: (err: any) => void;
      timer: NodeJS.Timeout;
      startTime: number;
      request: HypervisorInferenceRequest;
    }
  >();

  private metrics: HypervisorMetrics = {
    totalInferences: 0,
    successfulInferences: 0,
    watchdogTimeouts: 0,
    ruleViolationsIntercepted: 0,
    autoRepairsApplied: 0,
    lastExecutionLatencyMs: 0,
    lastHeartbeatPingMs: 0,
    sessionWarm: false,
    guestCapabilities: [],
  };

  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscribers = new Set<(state: GuestVMState, metrics: HypervisorMetrics) => void>();

  public static getInstance(): HypervisorHost {
    if (!HypervisorHost.instance) {
      HypervisorHost.instance = new HypervisorHost();
    }
    return HypervisorHost.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initBuses();
      this.startHeartbeat();
    }
  }

  /**
   * Registers the active hidden iframe hosting worker.html for direct postMessage fast-path
   */
  public registerWorkerIframe(iframe: HTMLIFrameElement | null) {
    this.workerIframe = iframe;
    if (iframe) {
      this.state = 'booting';
      this.notifySubscribers();
    }
  }

  private initBuses() {
    try {
      this.signalingBus = new BroadcastChannel('webrtc-neural-signaling');
      this.hypervisorBus = new BroadcastChannel('neural_hypervisor_bus');

      this.signalingBus.onmessage = (event) => this.handleSignalingMessage(event.data);
      this.hypervisorBus.onmessage = (event) => this.handleHypervisorMessage(event.data);

      window.addEventListener('message', (event) => {
        if (event.data && typeof event.data === 'object' && event.data.__neural_guest__) {
          this.handleGuestMessage(event.data);
        }
      });
    } catch (err) {
      console.warn('[Hypervisor Host] BroadcastChannel setup warning:', err);
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.sendGuestMessage({
        type: 'SUPERVISOR_PING',
        timestamp: Date.now(),
      });
    }, 4000);
  }

  public subscribe(cb: (state: GuestVMState, metrics: HypervisorMetrics) => void): () => void {
    this.subscribers.add(cb);
    cb(this.state, { ...this.metrics });
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private notifySubscribers() {
    for (const cb of this.subscribers) {
      try {
        cb(this.state, { ...this.metrics });
      } catch {}
    }
  }

  public getState(): GuestVMState {
    return this.state;
  }

  public getMetrics(): HypervisorMetrics {
    return { ...this.metrics };
  }

  /**
   * Send a framed message to the guest instance (using fast postMessage with signaling fallback)
   */
  private sendGuestMessage(msg: any) {
    const wrapped = { ...msg, __neural_hypervisor__: true };

    // 1. Direct iframe postMessage fast-path (< 0.1ms)
    if (this.workerIframe?.contentWindow) {
      try {
        this.workerIframe.contentWindow.postMessage(wrapped, '*');
      } catch {}
    }

    // 2. BroadcastChannel fallback
    try {
      this.signalingBus?.postMessage(wrapped);
    } catch {}
  }

  /**
   * Handles inbound messages from the guest instance
   */
  private async handleGuestMessage(data: any) {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'GUEST_READY':
        this.state = 'ready';
        this.metrics.sessionWarm = Boolean(data.sessionWarm);
        if (Array.isArray(data.capabilities)) {
          this.metrics.guestCapabilities = data.capabilities;
        }
        this.notifySubscribers();
        break;

      case 'SUPERVISOR_PONG':
        if (data.pingTimestamp) {
          this.metrics.lastHeartbeatPingMs = Date.now() - data.pingTimestamp;
        }
        this.metrics.sessionWarm = Boolean(data.sessionWarm);
        if (this.state === 'booting' || this.state === 'uninitialized') {
          this.state = 'ready';
        }
        this.notifySubscribers();
        break;

      case 'HYPERCALL':
        await this.handleGuestHypercall(data);
        break;

      case 'AST_RESPONSE':
        this.handleGuestASTResponse(data);
        break;

      case 'AST_ERROR':
        this.handleGuestASTError(data);
        break;

      default:
        break;
    }
  }

  private handleSignalingMessage(data: any) {
    if (!data) return;
    if (data.type === 'daemon_ready') {
      this.state = 'ready';
      this.notifySubscribers();
    }
  }

  private handleHypervisorMessage(data: any) {
    if (!data) return;
    if (data.type === 'RESET_VM_REQUEST') {
      this.resetGuestInstance();
    }
  }

  /**
   * Traps hypercall requests from guest instance, queries host substrate, and returns result
   */
  private async handleGuestHypercall(data: { id: string; target: string; message: HyperMessage }) {
    const { id, target, message } = data;
    if (!id || !target) return;

    let result: HyperNodeResult = { ok: false, error: 'Hypercall dispatcher uninitialized.' };

    if (externalDispatcher) {
      try {
        result = await externalDispatcher(target, message);
      } catch (err: any) {
        result = { ok: false, error: err?.message || 'Hypercall substrate error' };
      }
    }

    this.sendGuestMessage({
      type: 'HYPERCALL_RESPONSE',
      id,
      ok: result.ok,
      data: result.data,
      error: result.error,
    });
  }

  /**
   * Handles AST responses from guest instance, applying strict quiz.rules.ast audit & governor
   */
  private async handleGuestASTResponse(data: {
    requestId: string;
    raw: string;
    keyStage: string;
    subject: string;
    unit: string;
  }) {
    const pending = this.pendingRequests.get(data.requestId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pendingRequests.delete(data.requestId);

    const latency = Date.now() - pending.startTime;
    this.metrics.totalInferences++;
    this.metrics.lastExecutionLatencyMs = latency;
    this.state = 'ready';

    // Audit against quiz.rules.ast and run ASTFlowGovernor
    const audit = this.auditAndGovernAST(data.raw, pending.request);

    if (audit.passed && audit.governedQuestion) {
      this.metrics.successfulInferences++;
      if (audit.ruleViolations.length > 0) {
        this.metrics.ruleViolationsIntercepted += audit.ruleViolations.length;
        this.metrics.autoRepairsApplied += audit.autoRepairs.length;
      }

      // Auto-persist verified AST to VFS view and IndexedDB buffer
      try {
        const topicKey = `${data.keyStage || 'KS1'}_${data.subject || 'General'}_${data.unit || 'Topic'}`
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_');
        await saveVerifiedAST(topicKey, audit.sanitizedLisp);
        await saveVfsView(`/vfs/ast/${topicKey}.lisp`, audit.sanitizedLisp);
      } catch (persistErr) {
        console.warn('[Hypervisor Host] Auto-persist error:', persistErr);
      }

      this.notifySubscribers();
      pending.resolve({
        ok: true,
        source: 'guest_vm',
        rawAST: audit.sanitizedLisp,
        question: audit.governedQuestion,
        latencyMs: latency,
        audit,
      });
    } else {
      this.metrics.ruleViolationsIntercepted += audit.ruleViolations.length || 1;
      this.notifySubscribers();
      pending.reject(new Error(`AST rejected by Hypervisor Rulebook: ${audit.ruleViolations.join('; ')}`));
    }
  }

  private handleGuestASTError(data: { requestId: string; error: string }) {
    const pending = this.pendingRequests.get(data.requestId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pendingRequests.delete(data.requestId);
    this.state = 'ready';
    this.notifySubscribers();

    pending.reject(new Error(data.error || 'Guest VM inference failure'));
  }

  /**
   * Evaluates raw AST string against quiz.rules.ast ruleset and executes deterministic ASTFlowGovernor
   */
  public auditAndGovernAST(rawString: string, req: HypervisorInferenceRequest): RuleAuditResult {
    const violations: string[] = [];
    const repairs: string[] = [];

    // 1. Rule :enforce-lisp-sexpr
    let clean = (rawString || '').trim();
    if (clean.includes('```')) {
      violations.push(':enforce-lisp-sexpr (markdown fences detected in output)');
      clean = clean.replace(/```(?:lisp|scheme)?/gi, '').replace(/```/g, '').trim();
      repairs.push('Stripped markdown fence formatting');
    }

    const firstParen = clean.indexOf('(');
    const lastParen = clean.lastIndexOf(')');
    if (firstParen === -1 || lastParen === -1 || lastParen <= firstParen) {
      violations.push(':enforce-lisp-sexpr (missing enclosing parentheses)');
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    clean = clean.substring(firstParen, lastParen + 1);

    // 2. Parse into AST Node tree
    const parsedNode = EngineFlow.parse(clean);
    let questionCandidate = EngineFlow.normalizeASTToQuestion(parsedNode) || extractQuestionFromAst(clean);

    if (!questionCandidate) {
      violations.push(':required-fields (failed to extract question structure)');
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    // 3. Rule :route-specification
    if (!clean.includes(':route')) {
      violations.push(':route-specification (missing :route tag)');
      repairs.push('Defaulted route to "quiz:mcq"');
    }

    // 4. Rule :exact-distractors (options length)
    if (!Array.isArray(questionCandidate.options) || questionCandidate.options.length !== 4) {
      violations.push(
        `:exact-distractors (expected 4 options, found ${questionCandidate.options?.length || 0})`
      );
    }

    // 5. Rule :zero-based-index
    if (
      typeof questionCandidate.answerKey !== 'number' ||
      questionCandidate.answerKey < 0 ||
      questionCandidate.answerKey > 3
    ) {
      violations.push(`:zero-based-index (answer key ${questionCandidate.answerKey} out of [0..3] range)`);
    }

    // 6. Rule :forbidden-prefixes (e.g. "A)", "Option A:")
    const hasForbiddenPrefix = questionCandidate.options.some((opt) =>
      /^[\(\[]?[A-Da-d1-4][\)\]\.\:\-\s]+\s*/.test(opt)
    );
    if (hasForbiddenPrefix) {
      violations.push(':forbidden-prefixes (options contain alphanumeric option prefixes)');
    }

    // 7. Deterministic Governor Enforcement
    const governed = ASTFlowGovernor.govern(
      {
        prompt: questionCandidate.prompt,
        options: questionCandidate.options,
        answerKey: questionCandidate.answerKey,
        hint: questionCandidate.hint,
        explanation: (questionCandidate as any).explanation,
        misconceptions: (questionCandidate as any).misconceptions,
        socraticFollowUp: (questionCandidate as any).socraticFollowUp,
      },
      req.subject,
      req.unit
    );

    if (!governed.isValid || !governed.sanitizedQuestion) {
      violations.push(`governor_rejection: ${governed.rejectionReason || 'Sanitization failed'}`);
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    repairs.push('Applied ASTFlowGovernor arithmetic solver, distractor padding, and misconception alignment');

    const sanitized = governed.sanitizedQuestion;

    // Build the compliant canonical S-expression
    const optionsLisp = sanitized.options.map((opt) => JSON.stringify(opt)).join(' ');
    const canonicalLisp = `(:route "quiz:mcq"
 :scratchpad ${JSON.stringify(sanitized.scratchpad || `Grounded concept for ${req.unit}`)}
 :prompt ${JSON.stringify(sanitized.prompt)}
 :options (${optionsLisp})
 :answer-key ${sanitized.answerKey}
 :hint ${JSON.stringify(sanitized.hint || `Focus on the core definition of ${req.unit}.`)}
 :governed true
 :rules-target "worker.html")`;

    return {
      passed: true,
      ruleViolations: violations,
      autoRepairs: repairs,
      governedQuestion: sanitized,
      sanitizedLisp: canonicalLisp,
    };
  }

  /**
   * Dispatches an inference request to the supervised guest VM with armed watchdog timer
   */
  public async executeInference(req: HypervisorInferenceRequest): Promise<HypervisorInferenceResult> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeoutMs = req.timeoutMs || 9000;
    const startTime = Date.now();

    this.state = 'executing';
    this.notifySubscribers();

    return new Promise<HypervisorInferenceResult>((resolve, reject) => {
      // 1. Arm Watchdog Timer (VM Supervisor Protection)
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.metrics.watchdogTimeouts++;
        this.state = 'watchdog_timeout';
        this.notifySubscribers();

        console.warn(`[Hypervisor Watchdog] Execution timed out after ${timeoutMs}ms for ${req.unit}. Resetting guest instance.`);
        this.resetGuestInstance();

        reject(new Error(`Hypervisor Watchdog Timeout (${timeoutMs}ms) exceeded.`));
      }, timeoutMs);

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timer,
        startTime,
        request: req,
      });

      // 2. Dispatch execution intent to guest instance
      this.sendGuestMessage({
        type: 'REQUEST_QUESTION',
        requestId,
        keyStage: req.keyStage,
        subject: req.subject,
        unit: req.unit,
        curriculum: req.curriculum || 'uk_oak',
        difficulty: req.difficulty || 'challenger',
        lang: req.lang || 'en',
      });
    });
  }

  /**
   * Resets the guest VM instance (destroys model session, clears memory leak, and rewarms)
   */
  public resetGuestInstance() {
    this.state = 'booting';
    this.metrics.sessionWarm = false;
    this.notifySubscribers();

    this.sendGuestMessage({
      type: 'RESET_INSTANCE',
      timestamp: Date.now(),
    });

    // Clear any stuck pending requests
    for (const [id, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timer);
      pending.reject(new Error('Guest VM reset triggered.'));
      this.pendingRequests.delete(id);
    }
  }
}

export const hypervisor = HypervisorHost.getInstance();
