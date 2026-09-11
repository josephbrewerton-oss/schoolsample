// src/hooks/useWebRTCNeuralBus.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { extractQuestionFromAst, ExtractedQuestion } from '../utils/astQuestionExtractor';
import { EngineFlow } from '../engine/engineflow';
import { hypervisor, HypervisorHost, GuestVMState, HypervisorMetrics } from '../engine/hypervisor';
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

export function useWebRTCNeuralBus(onQuestionReady?: (payload: QuestionPayload) => void) {
  const [instanceState, setInstanceState] = useState<GuestVMState>(() => hypervisor.getState());
  const [metrics, setMetrics] = useState<HypervisorMetrics>(() => hypervisor.getMetrics());
  const [status, setStatus] = useState<string>('Supervising Guest VM...');
  const [isReady, setIsReady] = useState<boolean>(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const rawStreamRef = useRef<string>('');
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

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

  // 1. Subscribe to Hypervisor Host State & Telemetry
  useEffect(() => {
    const unsub = hypervisor.subscribe((state, currentMetrics) => {
      setInstanceState(state);
      setMetrics(currentMetrics);

      if (state === 'ready') {
        setIsReady(true);
        setStatus('Guest VM Ready • Hypervised');
      } else if (state === 'executing') {
        setStatus('Inference Active (Watchdog Armed)');
      } else if (state === 'booting') {
        setIsReady(false);
        setStatus('Guest VM Booting...');
      } else if (state === 'watchdog_timeout') {
        setIsReady(false);
        setStatus('Watchdog Timeout • Recycled VM');
      } else {
        setIsReady(false);
        setStatus('Connecting to Guest Daemon...');
      }
    });

    return unsub;
  }, []);

  // 2. WebRTC Peer Connection for low-latency peer data plane
  useEffect(() => {
    let isCurrentMount = true;
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    const pc = new RTCPeerConnection({ iceServers: [] });
    pcRef.current = pc;

    pc.ondatachannel = (event) => {
      if (!isCurrentMount) return;
      const dc = event.channel;
      channelRef.current = dc;

      dc.onopen = () => {
        if (!isCurrentMount) return;
        setIsReady(true);
        setStatus('Guest VM Online (WebRTC DataChannel)');
      };

      dc.onclose = () => {
        if (!isCurrentMount) return;
        if (hypervisor.getState() !== 'ready') {
          setIsReady(false);
          setStatus('Daemon Disconnected');
        }
      };

      dc.onmessage = (msgEvent) => {
        const raw = msgEvent.data;
        if (!raw) return;

        if (raw === '__EOF__') {
          const fullText = rawStreamRef.current;
          rawStreamRef.current = '';

          let rawASTString = fullText;
          if (fullText.startsWith('{') && fullText.endsWith('}')) {
            try {
              const envelope = JSON.parse(fullText);
              if (envelope.type === 'AST_RESPONSE' && envelope.raw) {
                rawASTString = envelope.raw;
              }
            } catch {}
          }

          // Pass raw AST through Hypervisor Rulebook Audit & ASTFlowGovernor
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
          return;
        }

        rawStreamRef.current += raw;
      };
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && isCurrentMount) {
        bus.postMessage({
          type: 'candidate',
          candidate: e.candidate.toJSON(),
          sessionId: sessionIdRef.current,
        });
      }
    };

    bus.onmessage = async (e) => {
      if (!isCurrentMount) return;
      const data = e.data;
      if (!data) return;

      if (data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready', sessionId: sessionIdRef.current });
      } else if (data.type === 'offer') {
        if (pc.signalingState !== 'stable' || channelRef.current?.readyState === 'open') {
          return;
        }

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          bus.postMessage({
            type: 'answer',
            sdp: pc.localDescription?.toJSON(),
            sessionId: sessionIdRef.current,
          });
        } catch {}
      } else if (data.type === 'candidate' && data.candidate) {
        try {
          if (pc.remoteDescription && pc.signalingState !== 'closed') {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch {}
      }
    };

    const heartbeat = setInterval(() => {
      if (channelRef.current?.readyState === 'open') {
        clearInterval(heartbeat);
      } else {
        bus.postMessage({ type: 'peer_ready', sessionId: sessionIdRef.current });
      }
    }, 600);

    return () => {
      isCurrentMount = false;
      clearInterval(heartbeat);
      try { channelRef.current?.close(); } catch {}
      try { pc.close(); } catch {}
      try { bus.close(); } catch {}
    };
  }, []);

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
      } catch (err) {
        console.warn('[NeuralBus Hook] Hypervisor inference execution note:', err);
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

  return {
    isReady,
    status,
    instanceState,
    metrics,
    sendIntent,
    resetInstance,
  };
}
