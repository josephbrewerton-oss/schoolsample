// src/engine/aicaller.ts
import { edgeCognitiveEngine } from './EdgeCognitiveEngine';
import { validateStudentInput, sanitizeAiOutput } from '../services/childSafetyFilter';

export interface AiInferenceOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
  /** Set to true to reuse the multi-turn session (e.g. for conversational chat). Default: false (stateless). */
  preserveContext?: boolean;
  onDownloadProgress?: (loaded: number, total: number) => void;
  /** Maximum inference timeout in milliseconds. Defaults to 12000ms. */
  timeoutMs?: number;
}

export interface ModelAvailability {
  status: 'readily' | 'after-download' | 'no';
  maxTokens?: number;
  temperature?: number;
}

export const CONSENT_STORAGE_KEY = 'ai_model_download_consent';

export function hasUserGrantedAiConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
}

export function setUserAiConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  if (granted) {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
  } else {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
  }
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('ai_consent_changed', { detail: granted }));
}

class AiRuntimeCaller {
  private chatSession: any = null;
  private activeSystemPrompt: string = '';
  private cachedAvailability: ModelAvailability | null = null;
  private availabilityPromise: Promise<ModelAvailability> | null = null;

  /**
   * Safe accessor for the Prompt API root across Chromium revisions
   */
  private getAiRoot(): any {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    const scope = typeof self !== 'undefined' ? (self as any) : win;

    if (typeof win.LanguageModel !== 'undefined') return win.LanguageModel;
    if (typeof scope.LanguageModel !== 'undefined') return scope.LanguageModel;
    if (win.ai?.languageModel) return win.ai.languageModel;
    if (scope.ai?.languageModel) return scope.ai.languageModel;
    if (win.ai?.assistant) return win.ai.assistant;

    return null;
  }

  /**
   * Synchronous check for native Prompt API presence (window.ai / LanguageModel).
   * 0ms, zero overhead, safe for low-spec Chromebooks.
   */
  public hasNativePromptApi(): boolean {
    return this.getAiRoot() !== null;
  }

  /**
   * Check if WebLLM / WebGPU on-device neural fallback is available (Safari 18+, Firefox, non-Chromium)
   */
  public hasWebLlmFallback(): boolean {
    return edgeCognitiveEngine.isSupported();
  }

  /**
   * Identifies the active on-device engine tier
   */
  public getActiveEngineType(): 'chrome-builtin-nano' | 'webgpu-webllm' | 'rule-engine' {
    if (this.hasNativePromptApi()) return 'chrome-builtin-nano';
    if (edgeCognitiveEngine.isSupported()) return 'webgpu-webllm';
    return 'rule-engine';
  }

  /**
   * Synchronous check whether on-device AI (Native Prompt API or WebLLM fallback) is supported and consented to.
   */
  public isPromptApiAvailableSync(): boolean {
    if (!hasUserGrantedAiConsent()) return false;
    if (this.hasNativePromptApi()) {
      if (this.cachedAvailability && this.cachedAvailability.status === 'no') return false;
      return true;
    }
    // Safari / Firefox / non-Chromium WebLLM / WebGPU fallback path:
    if (edgeCognitiveEngine.isSupported()) return true;
    return false;
  }

  /**
   * Diagnostic check across Desktop & Mobile runtimes (hardware capability check only)
   */
  async checkAvailability(): Promise<ModelAvailability> {
    if (this.cachedAvailability) {
      return this.cachedAvailability;
    }

    if (this.availabilityPromise) {
      return this.availabilityPromise;
    }

    const lm = this.getAiRoot();
    if (!lm) {
      // Check WebLLM / WebGPU fallback for Safari / Firefox / non-Chromium
      if (edgeCognitiveEngine.isSupported()) {
        this.cachedAvailability = {
          status: 'readily',
          maxTokens: 4096,
          temperature: 0.2,
        };
        return this.cachedAvailability;
      }

      this.cachedAvailability = { status: 'no' };
      return this.cachedAvailability;
    }

    this.availabilityPromise = (async () => {
      try {
        if (typeof lm.availability === 'function') {
          let status: any = 'no';
          try {
            // Modern W3C availability check
            status = await lm.availability({
              expectedInputs: [{ type: 'text', languages: ['en'] }],
              expectedOutputs: [{ type: 'text', languages: ['en'] }],
              outputLanguage: 'en',
              expectedInputLanguages: ['en'],
              expectedOutputLanguages: ['en'],
            });
          } catch {
            try {
              status = await lm.availability({
                outputLanguage: 'en',
                expectedInputLanguages: ['en'],
                expectedOutputLanguages: ['en'],
              });
            } catch {
              status = await lm.availability();
            }
          }

          const mappedStatus =
            status === 'readily' || status === 'available'
              ? 'readily'
              : status === 'after-download' || status === 'downloadable'
              ? 'after-download'
              : 'no';
          this.cachedAvailability = { status: mappedStatus };
          return this.cachedAvailability;
        }

        if (typeof lm.capabilities === 'function') {
          const caps = await lm.capabilities();
          const mappedStatus =
            caps?.available === 'readily' || caps?.available === 'available'
              ? 'readily'
              : caps?.available === 'after-download' || caps?.available === 'downloadable'
              ? 'after-download'
              : caps?.available || 'no';
          this.cachedAvailability = {
            status: mappedStatus,
            maxTokens: caps?.maxTokens,
            temperature: caps?.defaultTemperature,
          };
          return this.cachedAvailability;
        }

        this.cachedAvailability = { status: 'no' };
        return this.cachedAvailability;
      } catch {
        this.cachedAvailability = { status: 'no' };
        return this.cachedAvailability;
      } finally {
        this.availabilityPromise = null;
      }
    })();

    return this.availabilityPromise;
  }

  /**
   * Creates a configured session instance respecting user consent
   */
  private async createSessionInstance(opts?: Partial<AiInferenceOptions>): Promise<any> {
    // UK GDPR & Children's Code Consent Gate:
    // If the user hasn't explicitly granted permission, do NOT spin up or download local neural weights
    if (!hasUserGrantedAiConsent()) {
      throw new Error('User has not consented to in-browser AI model execution/download.');
    }

    const lm = this.getAiRoot();
    if (!lm) {
      throw new Error('W3C LanguageModel API not supported in this environment.');
    }

    const systemPrompt = opts?.systemPrompt || 'You are an elite UK Curriculum Socratic educator.';

    // Fully-specified W3C Prompt API configuration
    const createOptions: any = {
      systemPrompt,
      temperature: opts?.temperature ?? 0.2,
      topK: opts?.topK ?? 3,
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
      outputLanguage: 'en',
      expectedInputLanguages: ['en'],
      expectedOutputLanguages: ['en'],
    };

    if (opts?.onDownloadProgress) {
      createOptions.monitor = (m: any) => {
        m.addEventListener('downloadprogress', (e: any) => {
          opts.onDownloadProgress?.(e.loaded, e.total);
        });
      };
    }

    const createPromise = (async () => {
      try {
        return await lm.create(createOptions);
      } catch {
        try {
          return await lm.create({
            systemPrompt,
            outputLanguage: 'en',
            expectedInputLanguages: ['en'],
            expectedOutputLanguages: ['en'],
          });
        } catch {
          return await lm.create({
            systemPrompt,
            expectedInputLanguages: ['en'],
            expectedOutputLanguages: ['en'],
          });
        }
      }
    })();

    // Model weight downloading might take longer, allow 45s if monitoring progress, otherwise 25s
    const creationTimeoutMs = opts?.onDownloadProgress ? 45000 : 25000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`[AiCaller] Session initialization timed out after ${creationTimeoutMs}ms`)), creationTimeoutMs)
    );

    return Promise.race([createPromise, timeoutPromise]);
  }

  /**
   * Returns a stateful multi-turn session or an ephemeral single-task session
   */
  async getSession(opts?: Partial<AiInferenceOptions>): Promise<any> {
    const systemPrompt = opts?.systemPrompt || 'You are an elite UK Curriculum Socratic educator.';

    if (!opts?.preserveContext) {
      return await this.createSessionInstance(opts);
    }

    if (this.chatSession && this.activeSystemPrompt !== systemPrompt) {
      this.destroy();
    }

    if (!this.chatSession) {
      this.activeSystemPrompt = systemPrompt;
      this.chatSession = await this.createSessionInstance(opts);
    }

    return this.chatSession;
  }

  /**
   * Single prompt execution with strict timeout protection and WebLLM fallback
   */
  async promptText(opts: AiInferenceOptions): Promise<string> {
    if (!hasUserGrantedAiConsent()) {
      throw new Error('User has not consented to in-browser AI model execution.');
    }

    // Child safety check on input before calling any model
    const safetyCheck = validateStudentInput(opts.prompt);
    if (!safetyCheck.isSafe) {
      return safetyCheck.safeReplacementText || 'Let us keep our learning safe and focused on your school lessons.';
    }

    let rawOutput = '';

    // Tier 1: Chrome Native Prompt API
    if (this.hasNativePromptApi()) {
      const isEphemeral = !opts.preserveContext;
      let session = await this.getSession(opts);
      const timeoutMs = opts.timeoutMs ?? 25000;

      const executeCall = async (s: any) => {
        try {
          return await s.prompt(opts.prompt, { outputLanguage: 'en' });
        } catch (err: any) {
          if (err?.name === 'InvalidStateError' || String(err?.message || '').toLowerCase().includes('destroyed')) {
            this.destroy();
            session = await this.getSession(opts);
            return await session.prompt(opts.prompt);
          }
          return await s.prompt(opts.prompt);
        }
      };

      const inferencePromise = executeCall(session);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`[AiCaller] Inference prompt timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      try {
        rawOutput = await Promise.race([inferencePromise, timeoutPromise]);
      } catch (err) {
        if (!isEphemeral) this.destroy();
        console.warn('[AiCaller] Chrome AI prompt failed, invoking WebLLM fallback:', err);
        // Fall through to Tier 2
      } finally {
        if (isEphemeral && session?.destroy) {
          try { session.destroy(); } catch {}
        }
      }
    }

    // Tier 2: WebLLM / WebGPU neural execution for Safari 18+, Firefox, and non-Chromium
    if (!rawOutput && edgeCognitiveEngine.isSupported()) {
      const res = await edgeCognitiveEngine.infer(opts.prompt, opts.systemPrompt);
      rawOutput = res.output;
    }

    if (!rawOutput) {
      throw new Error('No on-device AI inference engine is available in this browser environment.');
    }

    // Sanitize output for child safety before returning
    return sanitizeAiOutput(rawOutput);
  }

  /**
   * Streaming prompt execution supporting native Chrome API and WebLLM WebGPU streams
   */
  async *promptStream(opts: AiInferenceOptions): AsyncGenerator<string, void, unknown> {
    if (!hasUserGrantedAiConsent()) {
      throw new Error('User has not consented to in-browser AI model execution.');
    }

    // Child safety check on streaming input
    const safetyCheck = validateStudentInput(opts.prompt);
    if (!safetyCheck.isSafe) {
      yield safetyCheck.safeReplacementText || 'Let us keep our learning safe and focused on your school lessons.';
      return;
    }

    // Tier 1: Chrome Native Prompt API Streaming
    if (this.hasNativePromptApi()) {
      const isEphemeral = !opts.preserveContext;
      let session = await this.getSession(opts);

      try {
        let stream: any = null;
        try {
          stream = session.promptStreaming ? session.promptStreaming(opts.prompt, { outputLanguage: 'en' }) : null;
        } catch {
          stream = session.promptStreaming ? session.promptStreaming(opts.prompt) : null;
        }

        if (!stream) {
          let text = '';
          try {
            text = await session.prompt(opts.prompt, { outputLanguage: 'en' });
          } catch {
            text = await session.prompt(opts.prompt);
          }
          yield text;
          return;
        }

        if (Symbol.asyncIterator in stream) {
          let previous = '';
          for await (const chunk of stream) {
            const delta = chunk.startsWith(previous) ? chunk.slice(previous.length) : chunk;
            previous = chunk;
            yield delta;
          }
        } else if (typeof stream.getReader === 'function') {
          const reader = stream.getReader();
          let previous = '';
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = typeof value === 'string' ? value : new TextDecoder().decode(value);
              const delta = chunk.startsWith(previous) ? chunk.slice(previous.length) : chunk;
              previous = chunk;
              yield delta;
            }
          } finally {
            reader.releaseLock();
          }
        }
        return;
      } catch (err) {
        if (!isEphemeral) this.destroy();
        console.warn('[AiCaller] Native stream failed, trying WebLLM streaming:', err);
        // Fall through to Tier 2
      } finally {
        if (isEphemeral && session?.destroy) {
          try { session.destroy(); } catch {}
        }
      }
    }

    // Tier 2: WebLLM / WebGPU real-time token stream
    if (edgeCognitiveEngine.isSupported()) {
      for await (const token of edgeCognitiveEngine.inferStream(opts.prompt, opts.systemPrompt)) {
        yield token;
      }
      return;
    }

    throw new Error('No on-device AI inference engine is available in this browser environment.');
  }

  /**
   * Token budget inspection
   */
  async getRemainingTokens(): Promise<number | null> {
    if (!this.chatSession?.tokensLeft) return null;
    return this.chatSession.tokensLeft;
  }

  /**
   * Explicit lifecycle cleanup
   */
  destroy() {
    if (this.chatSession) {
      try {
        this.chatSession.destroy?.();
      } catch {}
      this.chatSession = null;
      this.activeSystemPrompt = '';
    }
  }
}

export const aiCaller = new AiRuntimeCaller();