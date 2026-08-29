// src/hooks/useWebRTCNeuralBus.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { extractQuestionFromAst, ExtractedQuestion } from '../utils/astQuestionExtractor';
import { EngineFlow } from '../engine/engineflow';

export interface QuestionPayload {
  question: ExtractedQuestion;
  keyStage: string;
  subject: string;
  unit: string;
  curriculum?: string;
  hint?: string;
}

export function useWebRTCNeuralBus(onQuestionReady: (payload: QuestionPayload) => void) {
  const [status, setStatus] = useState<string>('Connecting to Daemon...');
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
        setStatus('Engine Ready');
        console.log('[NeuralBus Client] DataChannel OPEN.');
      };

      dc.onclose = () => {
        if (!isCurrentMount) return;
        setIsReady(false);
        setStatus('Daemon Disconnected');
        console.log('[NeuralBus Client] DataChannel CLOSED.');
      };

      dc.onmessage = (msgEvent) => {
        const raw = msgEvent.data;
        if (!raw) return;

        if (raw === '__EOF__') {
          const fullText = rawStreamRef.current;
          rawStreamRef.current = '';

          // 1. Try JSON Envelope decode
          if (fullText.startsWith('{') && fullText.endsWith('}')) {
            try {
              const envelope = JSON.parse(fullText);
              if (envelope.type === 'AST_RESPONSE' || envelope.raw) {
                const parsedNode = EngineFlow.parse(envelope.raw);
                const normalized = EngineFlow.normalizeASTToQuestion(parsedNode);
                if (normalized) {
                  onQuestionReadyRef.current({
                    question: normalized,
                    keyStage: envelope.keyStage || inFlightContextRef.current.keyStage,
                    subject: envelope.subject || inFlightContextRef.current.subject,
                    unit: envelope.unit || inFlightContextRef.current.unit,
                    curriculum: envelope.curriculum || inFlightContextRef.current.curriculum,
                    hint: normalized.hint,
                  });
                  return;
                }
              }
            } catch (err) {
              console.warn('[NeuralBus Envelope Parse Error]:', err);
            }
          }

          // 2. Direct S-expression extraction
          const parsedNode = EngineFlow.parse(fullText);
          const normalized = EngineFlow.normalizeASTToQuestion(parsedNode) || extractQuestionFromAst(fullText);

          if (normalized) {
            onQuestionReadyRef.current({
              question: normalized,
              keyStage: inFlightContextRef.current.keyStage,
              subject: inFlightContextRef.current.subject,
              unit: inFlightContextRef.current.unit,
              curriculum: inFlightContextRef.current.curriculum,
              hint: normalized.hint,
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
          sessionId: sessionIdRef.current 
        });
      }
    };

    bus.onmessage = async (e) => {
      if (!isCurrentMount) return;
      const data = e.data;
      if (!data) return;

      if (data.type === 'daemon_ready') {
        console.log('[NeuralBus Client] Detected daemon_ready, sending peer_ready...');
        bus.postMessage({ type: 'peer_ready', sessionId: sessionIdRef.current });
      } else if (data.type === 'offer') {
        if (pc.signalingState !== 'stable' || channelRef.current?.readyState === 'open') {
          return;
        }

        try {
          console.log('[NeuralBus Client] Received offer from Daemon. Creating answer...');
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          bus.postMessage({ 
            type: 'answer', 
            sdp: pc.localDescription?.toJSON(), 
            sessionId: sessionIdRef.current 
          });
        } catch (err) {
          console.warn('[NeuralBus Client] Offer resolution warning:', err);
        }
      } else if (data.type === 'candidate' && data.candidate) {
        try {
          if (pc.remoteDescription && pc.signalingState !== 'closed') {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch {}
      }
    };

    // Heartbeat: announce presence until connected
    const heartbeat = setInterval(() => {
      if (channelRef.current?.readyState === 'open') {
        clearInterval(heartbeat);
      } else {
        bus.postMessage({ type: 'peer_ready', sessionId: sessionIdRef.current });
      }
    }, 500);

    return () => {
      isCurrentMount = false;
      clearInterval(heartbeat);
      try { channelRef.current?.close(); } catch {}
      try { pc.close(); } catch {}
      try { bus.close(); } catch {}
    };
  }, []);

  const sendIntent = useCallback(
    (
      keyStage: string,
      subject: string,
      unit: string,
      ksId?: string,
      subId?: string,
      unitId?: string,
      curriculum: string = 'uk_oak'
    ) => {
      if (!channelRef.current || channelRef.current.readyState !== 'open') {
        return false;
      }

      inFlightContextRef.current = {
        keyStage,
        subject,
        unit,
        curriculum,
      };

      rawStreamRef.current = '';

      const payload = JSON.stringify({
        type: 'REQUEST_QUESTION',
        keyStage,
        subject,
        unit,
        ks: keyStage,
        sub: subject,
        topic: unit,
        curriculum,
      });

      channelRef.current.send(payload);
      return true;
    },
    []
  );

  return { isReady, status, sendIntent };
}