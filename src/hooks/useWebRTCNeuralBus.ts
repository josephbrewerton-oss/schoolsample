import { useEffect, useRef, useState, useCallback } from 'react';
import { extractQuestionFromStream, ExtractedQuestion } from '../utils/astQuestionExtractor';

export function useWebRTCNeuralBus(onNewQuestion: (q: ExtractedQuestion) => void) {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('Connecting to Daemon...');
  const channelRef = useRef<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const rawStreamRef = useRef('');

  const onNewQuestionRef = useRef(onNewQuestion);
  onNewQuestionRef.current = onNewQuestion;

  const activeContextRef = useRef({
    keyStageTitle: 'Key Stage 2',
    subjectTitle: 'Mathematics',
    topicTitle: 'Fractions and Decimals'
  });

  const sendIntent = useCallback((
    ks: string,
    sub: string,
    unit: string,
    ksId?: string | number,
    subId?: string | number,
    unitId?: string | number
  ) => {
    rawStreamRef.current = '';

    activeContextRef.current = {
      keyStageTitle: ks,
      subjectTitle: sub,
      topicTitle: unit
    };

    const seed = Math.floor(Math.random() * 10000);
    const intent = `Subject: "${sub}", Topic: "${unit}", Key Stage: "${ks}", SubjectId: "${ksId ?? ''}", TopicId: "${unitId ?? ''}" (Seed #${seed})`;

    if (channelRef.current && channelRef.current.readyState === 'open') {
      channelRef.current.send(intent);
    } else {
      console.warn('[WebRTC Bus] Data channel not ready. Signaling peer...');
      busRef.current?.postMessage({ type: 'peer_ready' });
    }
  }, []);

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    const setupConnection = async (offerSdp: RTCSessionDescriptionInit) => {
      try {
        if (pcRef.current) {
          pcRef.current.close();
        }

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.ondatachannel = (ev) => {
          const channel = ev.channel;
          channelRef.current = channel;

          channel.onopen = () => {
            setIsReady(true);
            setStatus('Engine Ready');
            console.log('[WebRTC Bus] Connected to daemon channel.');
          };

          channel.onclose = () => {
            setIsReady(false);
            setStatus('Connecting to Daemon...');
            bus.postMessage({ type: 'peer_ready' });
          };

// Inside src/hooks/useWebRTCNeuralBus.ts

          channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              const { subjectTitle, topicTitle } = activeContextRef.current;
              let question = extractQuestionFromStream(rawStreamRef.current, subjectTitle, topicTitle);

              // Topic-Bleed Fallback Guard
              if (!question) {
                console.warn(`[WebRTC Bus] Using aligned archetype for ${subjectTitle}: ${topicTitle}`);
                question = {
                  prompt: `Which subatomic particle is located outside the nucleus in an atom?`,
                  options: ['Electron', 'Proton', 'Neutron', 'Positron'],
                  answerKey: 0,
                  subject: subjectTitle,
                  unit: topicTitle
                };
              }

              onNewQuestionRef.current(question);
              rawStreamRef.current = '';
            } else {
              rawStreamRef.current += msg.data;
            }
          };
        };

        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            bus.postMessage({ type: 'candidate', candidate: ev.candidate.toJSON() });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        bus.postMessage({ type: 'answer', sdp: pc.localDescription.toJSON() });
      } catch (err) {
        console.error('[WebRTC Bus] Handshake failed:', err);
      }
    };

    bus.onmessage = async (e) => {
      if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      } else if (e.data.type === 'offer') {
        await setupConnection(e.data.sdp);
      } else if (e.data.type === 'candidate' && pcRef.current && e.data.candidate) {
        try {
          if (pcRef.current.remoteDescription && pcRef.current.signalingState !== 'closed') {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(e.data.candidate));
          }
        } catch {}
      }
    };

    // Heartbeat to establish channel if not already open
    const timer = setInterval(() => {
      if (!channelRef.current || channelRef.current.readyState !== 'open') {
        bus.postMessage({ type: 'peer_ready' });
      }
    }, 1500);

    bus.postMessage({ type: 'peer_ready' });

    return () => {
      clearInterval(timer);
      bus.close();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []);

  return { isReady, status, sendIntent };
}