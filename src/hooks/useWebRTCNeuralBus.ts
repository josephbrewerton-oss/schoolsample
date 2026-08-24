// src/hooks/useWebRTCNeuralBus.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { extractQuestionFromAst, ExtractedQuestion } from '../utils/astQuestionExtractor';

export interface QuestionPayload {
  question: ExtractedQuestion;
  keyStage: string;
  subject: string;
  unit: string;
}

export function useWebRTCNeuralBus(onQuestionReady: (payload: QuestionPayload) => void) {
  const [status, setStatus] = useState<string>('Connecting to Daemon...');
  const [isReady, setIsReady] = useState<boolean>(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const rawStreamRef = useRef<string>('');
  
  // Track currently in-flight context so when response arrives it pairs accurately
  const inFlightContextRef = useRef<{ keyStage: string; subject: string; unit: string }>({
    keyStage: 'Key Stage 3',
    subject: 'History',
    unit: 'The Norman Conquest (1066)'
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
              unit: inFlightContextRef.current.unit
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

  const sendIntent = useCallback((
    ks: string,
    sub: string,
    unit: string,
    ksId: string,
    subId: string,
    unitId: string
  ) => {
    rawStreamRef.current = '';
    inFlightContextRef.current = { keyStage: ks, subject: sub, unit };

    const seed = Math.floor(Math.random() * 10000);
    const intent = `Subject: "${sub}", Topic: "${unit}", Key Stage: "${ks}", SubjectId: "${subId}", TopicId: "${unitId}" (Seed #${seed})`;

    if (channelRef.current && channelRef.current.readyState === 'open') {
      channelRef.current.send(intent);
    } else {
      busRef.current?.postMessage({ type: 'peer_ready' });
    }
  }, []);

  return { isReady, status, sendIntent };
}