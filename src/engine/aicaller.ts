// src/engine/aicaller.ts

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
   * Diagnostic check across Desktop & Mobile runtimes (hardware capability check only)
   */
  async checkAvailability(): Promise<ModelAvailability> {
    const lm = this.getAiRoot();
    if (!lm) return { status: 'no' };

    try {
      if (typeof lm.availability === 'function') {
        const status = await lm.availability({
          expectedInputLanguages: ['en'],
          expectedOutputLanguages: ['en'],
        });
        const mappedStatus =
          status === 'readily' || status === 'available'
            ? 'readily'
            : status === 'after-download' || status === 'downloadable'
            ? 'after-download'
            : 'no';
        return { status: mappedStatus };
      }

      if (typeof lm.capabilities === 'function') {
        const caps = await lm.capabilities();
        return {
          status: caps?.available || 'no',
          maxTokens: caps?.maxTokens,
          temperature: caps?.defaultTemperature,
        };
      }

      return { status: 'no' };
    } catch {
      return { status: 'no' };
    }
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

    const createOptions: any = {
      systemPrompt,
      temperature: opts?.temperature ?? 0.2,
      topK: opts?.topK ?? 3,
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
        return await lm.create({
          systemPrompt,
          expectedInputLanguages: ['en'],
          expectedOutputLanguages: ['en'],
        });
      }
    })();

    // Model weight downloading might take longer, allow 45s if monitoring progress, otherwise 20s
    const creationTimeoutMs = opts?.onDownloadProgress ? 45000 : 20000;
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
   * Single prompt execution with strict timeout protection
   */
  async promptText(opts: AiInferenceOptions): Promise<string> {
    const isEphemeral = !opts.preserveContext;
    const session = await this.getSession(opts);
    const timeoutMs = opts.timeoutMs ?? 12000;

    const inferencePromise = session.prompt(opts.prompt);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`[AiCaller] Inference prompt timed out after ${timeoutMs}ms`)), timeoutMs)
    );

    try {
      return await Promise.race([inferencePromise, timeoutPromise]);
    } catch (err) {
      if (!isEphemeral) this.destroy();
      throw err;
    } finally {
      if (isEphemeral && session?.destroy) {
        try { session.destroy(); } catch {}
      }
    }
  }

  /**
   * Streaming prompt execution supporting both AsyncIterable and ReadableStream
   */
  async *promptStream(opts: AiInferenceOptions): AsyncGenerator<string, void, unknown> {
    const isEphemeral = !opts.preserveContext;
    const session = await this.getSession(opts);

    try {
      const stream = session.promptStreaming ? session.promptStreaming(opts.prompt) : null;

      if (!stream) {
        const text = await session.prompt(opts.prompt);
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
    } catch (err) {
      if (!isEphemeral) this.destroy();
      throw err;
    } finally {
      if (isEphemeral && session?.destroy) {
        try { session.destroy(); } catch {}
      }
    }
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