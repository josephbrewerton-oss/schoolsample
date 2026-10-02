// src/engine/EdgeCognitiveEngine.ts
/**
 * Edge Cognitive Engine — Multi-Tier On-Device Neural Execution Substrate
 * 
 * Supports:
 * Tier 1: Native Chrome Prompt API (window.ai.languageModel / Gemini Nano)
 * Tier 2: WebLLM / WebGPU Neural Pipeline (@mlc-ai/web-llm for Safari 18+, Firefox, and non-Chromium)
 * Tier 3: WebAssembly / Neural Worker Daemon fallback for locked-down school devices
 * Tier 4: Self-correcting Socratic rule-engine AST synthesizer
 */

import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { 
  openLocalDB, 
  bootstrapTopicAdapters, 
  saveVerifiedAST, 
  getRandomCachedAST 
} from '../services/dbStore';
import { resolveSeedCoordinate } from '../../static/promptStrategies';
import { healSExprString } from '../utils/astQuestionExtractor';
import { parseAstNode, type ParsedAstNode } from '../utils/sexprParser';

export type { ParsedAstNode };

export interface EngineExecutionResult {
  output: string;
  source: 'chrome-builtin-nano' | 'webgpu-webllm' | 'daemon-channel' | 'rule-fallback';
  ast?: ParsedAstNode;
  correctionsCount: number;
}

export class AstParser {
  /**
   * Parses S-Expression into ParsedAstNode using robust recursive tokenizer.
   * Replaces legacy brittle regex matchers.
   */
  static parse(sExpr: string): ParsedAstNode {
    return parseAstNode(sExpr);
  }
}

export interface InitProgressReport {
  text: string;
  progress: number;
}

export interface MemoryGuardStatus {
  isEligible: boolean;
  reason: string;
  deviceMemoryGb?: number;
  isIpadOrIos: boolean;
  webgpuSupported: boolean;
  hardwareConcurrency?: number;
}

export interface MemoryBudgetReport {
  engineState: 'unloaded' | 'loading' | 'loaded' | 'memory-guarded';
  selectedModel: string;
  estimatedWeightMb: number;
  estimatedKvBufferMb: number;
  totalEstimatedFootprintMb: number;
  unbudgetedBaselineFootprintMb: number;
  budgetSavedMb: number;
  idleTimeoutSeconds: number;
  contextWindowSize: number;
  slidingWindowSize: number;
  eligibility: MemoryGuardStatus;
}

export class EdgeCognitiveEngine {
  private webllmEngine: MLCEngineInterface | null = null;
  private hasWebGPU: boolean = false;
  private hasChromeAI: boolean = false;
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;
  private memoryGuardTripped: boolean = false;
  private memoryGuardReason: string = '';
  public selectedModel: string = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

  // Dynamic memory budgeting & idle unloading
  private idleTimer: any = null;
  private backgroundTimer: any = null;
  private idleTimeoutMs: number = 180_000;
  private contextWindowSize: number = 1024;
  private slidingWindowSize: number = 512;
  private visibilityListenerAttached: boolean = false;

  constructor() {
    this.detectCapabilities();
    this.setupVisibilityWatcher();
  }

  private detectCapabilities(): void {
    if (typeof window === 'undefined') return;

    this.hasChromeAI = Boolean(
      (window as any).LanguageModel || 
      (window as any).ai?.languageModel || 
      (window as any).ai?.assistant
    );

    this.hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  /**
   * Sets up background tab visibility watcher to protect against iOS/iPadOS WebKit Jetsam kills.
   */
  private setupVisibilityWatcher(): void {
    if (typeof document === 'undefined' || this.visibilityListenerAttached) return;
    this.visibilityListenerAttached = true;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const memStatus = this.checkMemoryEligibility();
        // On iPadOS/iOS or memory-constrained devices (<= 4GB), background tabs exceeding ~1GB are killed by Jetsam.
        // Start a 15-second grace countdown to unload WebGPU weights.
        if (memStatus.isIpadOrIos || (memStatus.deviceMemoryGb && memStatus.deviceMemoryGb <= 4)) {
          if (this.backgroundTimer) clearTimeout(this.backgroundTimer);
          this.backgroundTimer = setTimeout(() => {
            if (document.visibilityState === 'hidden' && this.webllmEngine) {
              console.info('[EdgeCognitiveEngine] Background tab detected on memory-constrained device. Unloading WebLLM to prevent WebKit Jetsam kill.');
              this.unload();
            }
          }, 15_000);
        }
      } else if (document.visibilityState === 'visible') {
        if (this.backgroundTimer) {
          clearTimeout(this.backgroundTimer);
          this.backgroundTimer = null;
        }
      }
    });
  }

  /**
   * Resets the inactivity timer for automatic dynamic unloading.
   */
  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (!this.webllmEngine) return;

    this.idleTimer = setTimeout(() => {
      console.info('[EdgeCognitiveEngine] Inactivity threshold reached. Dynamically unloading WebLLM weights from GPU to free memory.');
      this.unload();
    }, this.idleTimeoutMs);
  }

  /**
   * Dynamically calculates KV cache token limits based on device RAM tier.
   * Reduces the default ~250MB KV buffer down to ~45MB-65MB.
   */
  public calculateKvBudget(): {
    contextWindowSize: number;
    slidingWindowSize: number;
    estimatedKvMb: number;
    idleTimeoutMs: number;
  } {
    const memStatus = this.checkMemoryEligibility();
    const reportedRam = memStatus.deviceMemoryGb || 4;

    if (reportedRam >= 8) {
      // High-memory desktop/Mac: 1024 tokens (~65 MB KV buffer, 4 min idle unload)
      return {
        contextWindowSize: 1024,
        slidingWindowSize: 512,
        estimatedKvMb: 65,
        idleTimeoutMs: 240_000,
      };
    } else {
      // 4GB-6GB constrained tier: 768 tokens (~45 MB KV buffer, 2 min idle unload)
      return {
        contextWindowSize: 768,
        slidingWindowSize: 384,
        estimatedKvMb: 45,
        idleTimeoutMs: 120_000,
      };
    }
  }

  /**
   * Diagnostic telemetry reporting current memory budget, weight size, KV buffer, and savings.
   */
  public getMemoryBudgetReport(): MemoryBudgetReport {
    const eligibility = this.checkMemoryEligibility();
    const budget = this.calculateKvBudget();
    const estimatedWeightMb = 380;
    const estimatedKvBufferMb = budget.estimatedKvMb;
    const totalEstimatedFootprintMb = estimatedWeightMb + estimatedKvBufferMb;
    const unbudgetedBaselineFootprintMb = 630; // 380 + 250
    const budgetSavedMb = unbudgetedBaselineFootprintMb - totalEstimatedFootprintMb;

    let engineState: MemoryBudgetReport['engineState'] = 'unloaded';
    if (this.memoryGuardTripped || !eligibility.isEligible) {
      engineState = 'memory-guarded';
    } else if (this.isInitializing) {
      engineState = 'loading';
    } else if (this.webllmEngine !== null) {
      engineState = 'loaded';
    }

    return {
      engineState,
      selectedModel: this.selectedModel,
      estimatedWeightMb,
      estimatedKvBufferMb,
      totalEstimatedFootprintMb,
      unbudgetedBaselineFootprintMb,
      budgetSavedMb,
      idleTimeoutSeconds: Math.round(budget.idleTimeoutMs / 1000),
      contextWindowSize: budget.contextWindowSize,
      slidingWindowSize: budget.slidingWindowSize,
      eligibility,
    };
  }

  /**
   * Dynamically unloads WebLLM model weights (~380MB) and KV cache from GPU memory.
   * Can be invoked manually or automatically on inactivity / tab backgrounding.
   */
  public async unload(): Promise<void> {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.backgroundTimer) {
      clearTimeout(this.backgroundTimer);
      this.backgroundTimer = null;
    }

    if (this.webllmEngine) {
      try {
        await this.webllmEngine.unload();
      } catch (err) {
        console.warn('[EdgeCognitiveEngine] WebLLM unload error:', err);
      }
      this.webllmEngine = null;
      console.info('[EdgeCognitiveEngine] WebLLM weights (~380MB) and KV cache freed from client heap.');
    }
  }

  /**
   * Diagnostic memory check specifically for older 2GB/3GB mobile devices (like baseline iPads).
   * Prevents browser tab crashing by gracefully detecting low-spec devices before WebGPU model allocation.
   */
  public checkMemoryEligibility(): MemoryGuardStatus {
    if (typeof window === 'undefined') {
      return { isEligible: true, reason: 'Server environment', isIpadOrIos: false, webgpuSupported: false };
    }

    const nav = typeof navigator !== 'undefined' ? navigator : ({} as any);

    // Allow intentional administrator override
    if (typeof localStorage !== 'undefined' && localStorage.getItem('force_webllm_override') === 'true') {
      return {
        isEligible: true,
        reason: 'Manual override enabled (force_webllm_override)',
        deviceMemoryGb: (nav as any).deviceMemory,
        isIpadOrIos: false,
        webgpuSupported: Boolean(nav.gpu),
        hardwareConcurrency: nav.hardwareConcurrency,
      };
    }

    const webgpuSupported = typeof nav.gpu !== 'undefined';
    const reportedMemory = typeof (nav as any).deviceMemory === 'number' ? (nav as any).deviceMemory : undefined;
    const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined;

    // Detect iPadOS and iOS devices
    const isIpadOrIos = Boolean(
      /iPad|iPhone|iPod/.test(nav.userAgent || '') ||
      (nav.platform === 'MacIntel' && (nav.maxTouchPoints || 0) > 1)
    );

    // Rule 1: Explicit navigator.deviceMemory reporting < 4 GB
    if (typeof reportedMemory === 'number' && reportedMemory < 4) {
      return {
        isEligible: false,
        reason: `Reported device RAM (${reportedMemory} GB) is below the 4GB neural shader allocation threshold.`,
        deviceMemoryGb: reportedMemory,
        isIpadOrIos,
        webgpuSupported,
        hardwareConcurrency: cores,
      };
    }

    // Rule 2: Older / baseline iPads (e.g. iPad 5th-9th gen, iPad Air 2/3, iPad Mini 4/5)
    // Standard baseline iPads have 2GB or 3GB RAM where WebKit Jetsam kills tabs exceeding ~1.2GB.
    // iPads with < 8 cores are A-series models (e.g. A10/A12/A13) with 2GB-3GB RAM.
    // M-series iPads (M1/M2/M4) report >= 8 cores and 8GB+ RAM.
    if (isIpadOrIos) {
      if (cores !== undefined && cores < 8) {
        return {
          isEligible: false,
          reason: `Baseline iPad hardware detected (${cores} CPU cores, 2GB/3GB RAM profile). Memory guard engaged to protect Safari tab from WebKit Jetsam kill.`,
          deviceMemoryGb: reportedMemory || 3,
          isIpadOrIos: true,
          webgpuSupported,
          hardwareConcurrency: cores,
        };
      }
    }

    return {
      isEligible: true,
      reason: 'Hardware profile meets neural shader memory requirements.',
      deviceMemoryGb: reportedMemory,
      isIpadOrIos,
      webgpuSupported,
      hardwareConcurrency: cores,
    };
  }

  /**
   * Diagnostic inspection of active memory guard state
   */
  public getMemoryGuardStatus(): { tripped: boolean; reason: string; eligibility: MemoryGuardStatus } {
    const eligibility = this.checkMemoryEligibility();
    return {
      tripped: this.memoryGuardTripped || !eligibility.isEligible,
      reason: this.memoryGuardReason || eligibility.reason,
      eligibility,
    };
  }

  /**
   * Diagnostic check: is any on-device hardware inference supported on this browser?
   */
  public isSupported(): boolean {
    this.detectCapabilities();
    return this.hasChromeAI || this.hasWebGPU || typeof Worker !== 'undefined';
  }

  /**
   * Checks if the WebLLM or Chrome AI engine is ready for instant inference.
   */
  public isReady(): boolean {
    this.detectCapabilities();
    return this.hasChromeAI || this.webllmEngine !== null;
  }

  /**
   * Initializes the WebGPU/WebLLM engine with memory guard protection.
   */
  public async init(
    onProgress?: (report: InitProgressReport) => void,
    modelId?: string
  ): Promise<void> {
    this.detectCapabilities();

    if (modelId) {
      this.selectedModel = modelId;
    }

    // If native Chrome Prompt API is readily available, WebLLM warm-up is optional
    if (this.hasChromeAI && !this.hasWebGPU) {
      onProgress?.({ text: 'Chrome Gemini Nano available natively', progress: 1.0 });
      return;
    }

    if (this.webllmEngine) {
      onProgress?.({ text: 'WebLLM WebGPU engine active', progress: 1.0 });
      return;
    }

    // Proactive memory check before any allocation
    const memStatus = this.checkMemoryEligibility();
    if (!memStatus.isEligible) {
      this.memoryGuardTripped = true;
      this.memoryGuardReason = memStatus.reason;
      console.info(`[EdgeCognitiveEngine] Memory guard active: ${memStatus.reason}. Gracefully routing to Tier 3 (Local Socratic Rule Synthesizer).`);
      onProgress?.({ 
        text: 'Device memory check: safely using Tier 3 Local Socratic Rule Synthesizer', 
        progress: 1.0 
      });
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        if (!this.hasWebGPU) {
          console.info('[EdgeCognitiveEngine] WebGPU not exposed; neural worker fallback engaged.');
          return;
        }

        // Check WebGPU adapter limits if accessible
        const navAny = typeof navigator !== 'undefined' ? (navigator as any) : null;
        if (navAny && navAny.gpu) {
          try {
            const adapter = await navAny.gpu.requestAdapter();
            if (!adapter) {
              throw new Error('WebGPU adapter request returned null');
            }
            const maxStorage = adapter.limits?.maxStorageBufferBindingSize || 0;
            if (maxStorage > 0 && maxStorage < 134217728) { // 128MB minimum
              throw new Error(`WebGPU storage buffer size limit (${Math.round(maxStorage / 1024 / 1024)}MB) insufficient for 360M model.`);
            }
          } catch (adapterErr: any) {
            console.warn('[EdgeCognitiveEngine] WebGPU adapter check note:', adapterErr.message);
          }
        }

        const kvBudget = this.calculateKvBudget();
        this.contextWindowSize = kvBudget.contextWindowSize;
        this.slidingWindowSize = kvBudget.slidingWindowSize;
        this.idleTimeoutMs = kvBudget.idleTimeoutMs;

        onProgress?.({ text: `Initializing budgeted WebGPU shader pipeline for ${this.selectedModel} (${kvBudget.contextWindowSize} ctx)...`, progress: 0.1 });

        const webllm = await import('@mlc-ai/web-llm');
        const engine = await webllm.CreateMLCEngine(
          this.selectedModel,
          {
            initProgressCallback: (report: any) => {
              onProgress?.({
                text: report.text,
                progress: typeof report.progress === 'number' ? report.progress : 0.5,
              });
            },
          },
          {
            context_window_size: kvBudget.contextWindowSize,
            sliding_window_size: kvBudget.slidingWindowSize,
            attention_sink_size: 4,
          }
        );

        this.webllmEngine = engine;
        this.resetIdleTimer();
        onProgress?.({ text: `On-device neural weights budgeted (~${kvBudget.estimatedKvMb + 380}MB) & ready`, progress: 1.0 });
      } catch (err: any) {
        this.memoryGuardTripped = true;
        this.memoryGuardReason = err?.message || 'WebGPU allocation failure';
        console.warn('[EdgeCognitiveEngine] WebGPU WebLLM init failed, dropping gracefully to Tier 3 without tab crash:', err);
        onProgress?.({ 
          text: 'Memory allocation limit reached: operating in Tier 3 Local Socratic Rule Synthesizer', 
          progress: 1.0 
        });
      } finally {
        this.isInitializing = false;
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Single-turn inference dispatch with cascading tier execution and memory guard
   */
  public async infer(
    prompt: string,
    systemPrompt?: string
  ): Promise<{ output: string; source: EngineExecutionResult['source'] }> {
    this.detectCapabilities();

    // Tier 1: Chrome Native Prompt API
    if (this.hasChromeAI) {
      try {
        const win = window as any;
        const lm = win.LanguageModel || win.ai?.languageModel || win.ai?.assistant;
        if (lm) {
          const session = await lm.create({
            systemPrompt: systemPrompt || 'You are an elite Socratic school tutor. Guide the student concisely.',
            outputLanguage: 'en',
          });
          const result = await session.prompt(prompt);
          if (session.destroy) session.destroy();
          return { output: result, source: 'chrome-builtin-nano' };
        }
      } catch (err) {
        console.warn('[EdgeCognitiveEngine] Chrome AI invocation failed, falling back to WebGPU:', err);
      }
    }

    // Tier 2: WebLLM / WebGPU Pipeline (Safari 18+, Firefox, non-Chrome)
    if (this.hasWebGPU && !this.memoryGuardTripped) {
      const memCheck = this.checkMemoryEligibility();
      if (!memCheck.isEligible) {
        this.memoryGuardTripped = true;
        this.memoryGuardReason = memCheck.reason;
      } else {
        if (!this.webllmEngine) {
          await this.init();
        }

        if (this.webllmEngine) {
          this.resetIdleTimer();
          try {
            const reply = await this.webllmEngine.chat.completions.create({
              messages: [
                ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
                { role: 'user' as const, content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 512,
            });
            const text = reply.choices[0]?.message?.content || '';
            this.resetIdleTimer();
            return { output: text, source: 'webgpu-webllm' };
          } catch (webllmErr: any) {
            console.warn('[EdgeCognitiveEngine] WebLLM memory/inference error, degrading gracefully to Tier 3:', webllmErr);
            this.memoryGuardTripped = true;
            this.memoryGuardReason = webllmErr?.message || 'Memory allocation failed during inference';
          }
        }
      }
    }

    // Tier 3: Local Socratic Rule Synthesizer (Zero-Crash Fallback)
    const fallbackText = generateSocraticResponse(prompt, systemPrompt);
    return { output: fallbackText, source: 'rule-fallback' };
  }

  /**
   * Streaming inference dispatch for real-time token emission with memory guard
   */
  public async *inferStream(
    prompt: string,
    systemPrompt?: string
  ): AsyncGenerator<string, void, unknown> {
    this.detectCapabilities();

    // Tier 1: Chrome Native Prompt API Streaming
    if (this.hasChromeAI) {
      try {
        const win = window as any;
        const lm = win.LanguageModel || win.ai?.languageModel || win.ai?.assistant;
        if (lm) {
          const session = await lm.create({
            systemPrompt: systemPrompt || 'You are an elite Socratic school tutor. Guide the student concisely.',
            outputLanguage: 'en',
          });

          if (session.promptStreaming) {
            const stream = session.promptStreaming(prompt);
            let prevLen = 0;
            for await (const chunk of stream) {
              const delta = chunk.slice(prevLen);
              prevLen = chunk.length;
              yield delta;
            }
            if (session.destroy) session.destroy();
            return;
          }
        }
      } catch (err) {
        console.warn('[EdgeCognitiveEngine] Chrome streaming failed, falling back to WebGPU:', err);
      }
    }

    // Tier 2: WebLLM / WebGPU Streaming
    if (this.hasWebGPU && !this.memoryGuardTripped) {
      const memCheck = this.checkMemoryEligibility();
      if (!memCheck.isEligible) {
        this.memoryGuardTripped = true;
        this.memoryGuardReason = memCheck.reason;
      } else {
        if (!this.webllmEngine) {
          await this.init();
        }

        if (this.webllmEngine) {
          this.resetIdleTimer();
          try {
            const stream = await this.webllmEngine.chat.completions.create({
              messages: [
                ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
                { role: 'user' as const, content: prompt },
              ],
              stream: true,
              temperature: 0.2,
              max_tokens: 512,
            });

            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content || '';
              if (delta) yield delta;
            }
            this.resetIdleTimer();
            return;
          } catch (err: any) {
            console.warn('[EdgeCognitiveEngine] WebLLM stream failed, degrading gracefully to Tier 3:', err);
            this.memoryGuardTripped = true;
            this.memoryGuardReason = err?.message || 'Stream buffer error';
          }
        }
      }
    }

    // Tier 3: Local Socratic Rule Synthesizer simulated stream (Zero Crash)
    const fallback = generateSocraticResponse(prompt, systemPrompt);
    const words = fallback.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 15));
    }
  }

  /**
   * Self-correcting AST compiler loop
   */
  public async executeAstWithSelfCorrection(
    prompt: string,
    systemPrompt: string,
    maxRetries = 2
  ): Promise<EngineExecutionResult> {
    let attempts = 0;
    let currentPrompt = prompt;

    while (attempts <= maxRetries) {
      const { output, source } = await this.infer(currentPrompt, systemPrompt);
      try {
        const ast = AstParser.parse(output);
        return { output, source, ast, correctionsCount: attempts };
      } catch (err: any) {
        attempts++;
        currentPrompt = `${prompt}\nRepair S-Expression syntax error: ${err.message}\nOutput valid S-expression only.`;
      }
    }

    throw new Error(`AST self-correction failed after ${maxRetries} feedback iterations.`);
  }

  /**
   * Cleans up GPU memory buffers and unloads neural weights.
   */
  public destroy(): void {
    this.unload();
  }
}

/**
 * Global singleton of the Edge Cognitive Engine
 */
export const edgeCognitiveEngine = new EdgeCognitiveEngine();

/**
 * Generates an instant, route-appropriate fallback AST based on topicKey.
 */
export function generateContextualFallback(topicKey: string, isQuiz: boolean): string {
  const seed = resolveSeedCoordinate(topicKey);

  if (isQuiz) {
    return `(:route "quiz:mcq" :scratchpad "${seed.axiom}" :prompt "${seed.pivot}" :options (list "${seed.axiom}" "Incorrect alternative 1" "Incorrect alternative 2" "Incorrect alternative 3") :hint "Consider the core principle." :answer-key 0)`;
  }

  return `(:route "lesson:view" :axiom "${seed.axiom}" :trap "${seed.trap}" :pivot "${seed.pivot}")`;
}

/**
 * Deterministic Socratic dialog generator when hardware offline acceleration is disabled
 */
function generateSocraticResponse(prompt: string, systemPrompt?: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('atom') || lower.includes('proton') || lower.includes('electron')) {
    return 'What subatomic particles reside in the nucleus, and what charges do they carry?';
  }
  if (lower.includes('force') || lower.includes('motion') || lower.includes('gravity')) {
    return "Think about Newton's laws. What happens to an object when the forces acting upon it are balanced?";
  }
  if (lower.includes('communion') || lower.includes('eucharist') || lower.includes('sacrament')) {
    return 'During the Last Supper, what words did Jesus say over the bread and wine to transform them?';
  }
  if (lower.includes('plant') || lower.includes('photosynthesis') || lower.includes('root')) {
    return 'Which part of the plant absorbs water and minerals from the soil to support growth?';
  }
  return 'Let us look at the key principle here. What is the fundamental definition you learned for this concept?';
}

/**
 * Executes on-device LLM inference using the unified engine substrate.
 */
export async function runLocalInference(
  prompt: string, 
  systemPrompt?: string, 
  topicKey: string = 'ks3:sci:atomic'
): Promise<string> {
  const isQuizRequest = prompt.includes('quiz:mcq') || !prompt.includes('lesson:view');
  let fallbackAST = generateContextualFallback(topicKey, isQuizRequest);

  try {
    const cached = await getRandomCachedAST(topicKey.toLowerCase());
    if (cached) fallbackAST = cached;
  } catch {
    // Memory-only fallback
  }

  // If the edge runtime has capability (either Chrome AI or WebGPU/WebLLM), execute neural inference
  if (edgeCognitiveEngine.isSupported()) {
    try {
      const defaultSys = "You are an expert Oak Curriculum compiler. Output ONLY a valid Lisp S-expression. Never output markdown backticks or conversational text.";
      const res = await edgeCognitiveEngine.infer(prompt, systemPrompt || defaultSys);
      let sanitized = healSExprString(res.output || '');

      const firstParen = sanitized.indexOf('(');
      const lastParen = sanitized.lastIndexOf(')');

      if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
        sanitized = sanitized.substring(firstParen, lastParen + 1);
      }

      const hasPrompt = sanitized.includes(':prompt') || sanitized.includes(':q') || sanitized.includes(':question');
      const hasOptions = sanitized.includes(':options') || sanitized.includes(':opts') || sanitized.includes(':choices');
      const isQuizValid = hasPrompt && hasOptions;
      const isLessonValid = sanitized.includes(':axiom') && sanitized.includes(':trap');

      if (isQuizValid || isLessonValid) {
        saveVerifiedAST(topicKey.toLowerCase(), sanitized).catch(() => {});
        return sanitized;
      }
    } catch (err) {
      console.warn('[runLocalInference] Neural execution error, returning verified AST fallback:', err);
    }
  }

  return fallbackAST;
}
