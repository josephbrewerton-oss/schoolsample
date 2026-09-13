// src/hooks/useWebRTCNeuralBus.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { extractQuestionFromAst, ExtractedQuestion } from '../utils/astQuestionExtractor';
import { EngineFlow } from '../engine/engineflow';
import { hypervisor, GuestVMState, HypervisorMetrics } from '../engine/hypervisor';
import { RawASTQuestion } from '../engine/astGovernor';

export interface QuestionPayload {
  question: RawASTQuestion | ExtractedQuestion;
  keyStage: string;
  subject: string;
  unit: string;
  curriculum?: string;
  hint?: string;
  governed?: boolean;
}

export function useWebRTCNeuralBus(
  onQuestionReady?: (payload: QuestionPayload) => void,
  onTokenChunk?: (chunk: string) => void
) {
  const [instanceState, setInstanceState] = useState<GuestVMState>(() => hypervisor.getState());
  const [metrics, setMetrics] = useState<HypervisorMetrics>(() => hypervisor.getMetrics());
  const [status, setStatus] = useState<string>('Supervising Guest VM...');
  const [isReady, setIsReady] = useState<boolean>(false);

  const channelRef = useRef<RTCDataChannel | null>(null);
  const rawStreamRef = useRef<string>('');

  const inFlightContextRef = useRef<{
    keyStage: string;
    subject: string;
    unit: string;
    curriculum: string;
  }>({
    keyStage: 'Key Stage 1',
    subject: 'Science',
    unit: 'Seasonal Changes',
    curriculum: 'uk_oak',
  });

  const onQuestionReadyRef = useRef(onQuestionReady);
  useEffect(() => {
    onQuestionReadyRef.current = onQuestionReady;
  }, [onQuestionReady]);

  const onTokenChunkRef = useRef(onTokenChunk);
  useEffect(() => {
    onTokenChunkRef.current = onTokenChunk;
  }, [onTokenChunk]);

  const processGovernedAST = useCallback((rawASTString: string) => {
    const audit = hypervisor.auditAndGovernAST(rawASTString, {
      keyStage: inFlightContextRef.current.keyStage,
      subject: inFlightContextRef.current.subject,
      unit: inFlightContextRef.current.unit,
      curriculum: inFlightContextRef.current.curriculum,
    });

    if (audit.passed && audit.governedQuestion && onQuestionReadyRef.current) {
      onQuestionReadyRef.current({
        question: audit.governedQuestion,
        keyStage: inFlightContextRef.current.keyStage,
        subject: inFlightContextRef.current.subject,
        unit: inFlightContextRef.current.unit,
        curriculum: inFlightContextRef.current.curriculum,
        hint: audit.governedQuestion.hint,
        governed: true,
      });
    }
  }, []);

  const finalizeAndGovernStream = useCallback(() => {
    const fullText = rawStreamRef.current;
    rawStreamRef.current = '';
    if (!fullText) return;

    let rawASTString = fullText;
    if (fullText.startsWith('{') && fullText.endsWith('}')) {
      try {
        const envelope = JSON.parse(fullText);
        if (envelope.type === 'AST_RESPONSE' && envelope.raw) {
          rawASTString = envelope.raw;
        }
      } catch {}
    }

    processGovernedAST(rawASTString);
  }, [processGovernedAST]);

  // 1. Subscribe to Hypervisor Host State & WebRTC DataChannel Telemetry
  useEffect(() => {
    const unsubState = hypervisor.subscribe((state, currentMetrics) => {
      setInstanceState(state);
      setMetrics(currentMetrics);

      const isRtc = currentMetrics.rtcDataChannelState === 'open';
      channelRef.current = hypervisor.getDataChannel();

      if (state === 'ready') {
        setIsReady(true);
        setStatus(
          isRtc
            ? 'Guest VM Online (WebRTC DataChannel • Zero-Copy)'
            : 'Guest VM Ready • Hypervised'
        );
      } else if (state === 'executing') {
        setStatus('Inference Active (Watchdog Armed)');
      } else if (state === 'booting') {
        setIsReady(false);
        setStatus('Guest VM Booting...');
      } else if (currentMetrics.rtcDataChannelState === 'reconnecting') {
        setStatus('Reconnecting WebRTC Loopback...');
      } else if (state === 'watchdog_timeout') {
        setIsReady(false);
        setStatus('Watchdog Timeout • Recycled VM');
      } else {
        setIsReady(false);
        setStatus('Connecting to Guest Daemon...');
      }
    });

    const unsubTokens = hypervisor.addTokenChunkListener((tokenChunk, streamId, isFinal) => {
      rawStreamRef.current += tokenChunk;
      if (onTokenChunkRef.current) {
        onTokenChunkRef.current(tokenChunk);
      }
      if (isFinal) {
        finalizeAndGovernStream();
      }
    });

    return () => {
      unsubState();
      unsubTokens();
    };
  }, [finalizeAndGovernStream]);

  /**
   * Dispatches an intent to the hypervised guest VM
   */
  const sendIntent = useCallback(
    async (
      keyStage: string,
      subject: string,
      unit: string,
      ksId?: string,
      subId?: string,
      unitId?: string,
      curriculum: string = 'uk_oak'
    ) => {
      inFlightContextRef.current = {
        keyStage,
        subject,
        unit,
        curriculum,
      };

      try {
        const result = await hypervisor.executeInference({
          keyStage,
          subject,
          unit,
          curriculum,
          timeoutMs: 28000,
        });

        if (result.ok && result.question && onQuestionReadyRef.current) {
          onQuestionReadyRef.current({
            question: result.question,
            keyStage,
            subject,
            unit,
            curriculum,
            hint: result.question.hint,
            governed: true,
          });
          return true;
        }
      } catch {
        // Fallback smoothly
      }

      // Fallback to DataChannel if open
      if (channelRef.current && channelRef.current.readyState === 'open') {
        rawStreamRef.current = '';
        channelRef.current.send(
          JSON.stringify({
            type: 'REQUEST_QUESTION',
            keyStage,
            subject,
            unit,
            curriculum,
          })
        );
        return true;
      }

      return false;
    },
    []
  );

  const resetInstance = useCallback(() => {
    hypervisor.resetGuestInstance();
  }, []);

  const reconnect = useCallback((reason: string = 'manual_trigger') => {
    hypervisor.reconnectRTCDataChannel(reason);
  }, []);

  return {
    isReady,
    status,
    instanceState,
    metrics,
    sendIntent,
    resetInstance,
    reconnect,
  };
}
