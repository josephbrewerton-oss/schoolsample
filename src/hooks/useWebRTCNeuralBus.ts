// src/hooks/useWebRTCNeuralBus.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { extractQuestionFromAst, ExtractedQuestion } from '../utils/astQuestionExtractor';

export interface QuestionPayload {
  question: ExtractedQuestion;
  keyStage: string;
  subject: string;
  unit: string;
  curriculum?: string;
}

export function useWebRTCNeuralBus(onQuestionReady: (payload: QuestionPayload) => void) {
  const [status, setStatus] = useState<string>('Connecting to Daemon...');
  const [isReady, setIsReady] = useState<boolean>(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const rawStreamRef = useRef<string>('');

  // Track currently in-flight context so when response arrives it pairs accurately
  const inFlightContextRef = useRef<{
    keyStage: string;
    subject: string;
    unit: string;
    curriculum: string;
  }>({
    keyStage: 'Key Stage 3',
    subject: 'Science',
    unit: 'Atomic Structure & Periodic Table',
    curriculum: 'uk_oak',
  });

  const onQuestionReadyRef = useRef(onQuestionReady);
  useEffect(() => {
    onQuestionReadyRef.current = onQuestionReady;
  }, [onQuestionReady]);

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    pc.ondatachannel = (event) => {
      const dc = event.channel;
      channelRef.current = dc;

      dc.onopen = () => {
        setIsReady(true);
        setStatus('Engine Ready');
      };

      dc.onclose = () => {
        setIsReady(false);
        setStatus('Daemon Disconnected');
      };

      dc.onmessage = (msgEvent) => {
        const chunk = msgEvent.data;
        if (chunk === '__EOF__') {
          const fullText = rawStreamRef.current;
          rawStreamRef.current = '';

          const extracted = extractQuestionFromAst(fullText);
          if (extracted) {
            onQuestionReadyRef.current({
              question: extracted,
              keyStage: inFlightContextRef.current.keyStage,
              subject: inFlightContextRef.current.subject,
              unit: inFlightContextRef.current.unit,
              curriculum: inFlightContextRef.current.curriculum,
            });
          }
          return;
        }
        rawStreamRef.current += chunk;
      };
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        bus.postMessage({ type: 'candidate', candidate: e.candidate.toJSON() });
      }
    };

    bus.onmessage = async (e) => {
      if (e.data.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(e.data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        bus.postMessage({ type: 'answer', sdp: pc.localDescription?.toJSON() });
      } else if (e.data.type === 'candidate' && e.data.candidate) {
        try {
          if (pc.remoteDescription && pc.signalingState !== 'closed') {
            await pc.addIceCandidate(new RTCIceCandidate(e.data.candidate));
          }
        } catch {}
      } else if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      }
    };

    bus.postMessage({ type: 'peer_ready' });

    return () => {
      channelRef.current?.close();
      pc.close();
      bus.close();
    };
  }, []);

  const sendIntent = useCallback(
    (
      keyStage: string,
      subject: string,
      unit: string,
      keyStageId: string,
      subjectId: string,
      unitId: string,
      curriculum: string = 'uk_oak'
    ) => {
      inFlightContextRef.current = { keyStage, subject, unit, curriculum };

      if (channelRef.current?.readyState === 'open') {
        const intentPayload = {
          type: 'GENERATE_INTENT',
          keyStage,
          subject,
          unit,
          keyStageId,
          subjectId,
          unitId,
          curriculum,
        };
        channelRef.current.send(JSON.stringify(intentPayload));
      }
    },
    []
  );

  return { isReady, status, sendIntent };
}