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
    ksId?: string,
    subId?: string,
    unitId?: string
  ) => {
    rawStreamRef.current = '';

    activeContextRef.current = {
      keyStageTitle: ks,
      subjectTitle: sub,
      topicTitle: unit
    };

    if (!channelRef.current || channelRef.current.readyState !== 'open') {
      busRef.current?.postMessage({ type: 'peer_ready' });
      return;
    }

    const seed = Math.floor(Math.random() * 10000);
    const intent = `Subject: "${sub}", Topic: "${unit}", Key Stage: "${ks}", SubjectId: "${subId || ''}", TopicId: "${unitId || ''}" (Seed #${seed})`;
    channelRef.current.send(intent);
  }, []);

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    bus.onmessage = async (e) => {
      if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      } else if (e.data.type === 'offer') {
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
          };

          channel.onclose = () => {
            setIsReady(false);
            setStatus('Connecting to Daemon...');
          };

          channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              const { subjectTitle, topicTitle } = activeContextRef.current;
              const question = extractQuestionFromStream(rawStreamRef.current, subjectTitle, topicTitle);
              if (question) {
                onNewQuestionRef.current(question);
              }
              rawStreamRef.current = '';
            } else {
              rawStreamRef.current += msg.data;
            }
          };
        };

        pc.onicecandidate = (ev) => {
          if (ev.candidate) bus.postMessage({ type: 'candidate', candidate: ev.candidate.toJSON() });
        };

        await pc.setRemoteDescription(new RTCSessionDescription(e.data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        bus.postMessage({ type: 'answer', sdp: pc.localDescription.toJSON() });
      } else if (e.data.type === 'candidate' && pcRef.current && e.data.candidate) {
        try {
          if (pcRef.current.remoteDescription && pcRef.current.signalingState !== 'closed') {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(e.data.candidate));
          }
        } catch {}
      }
    };

    // Trigger offer request
    bus.postMessage({ type: 'peer_ready' });

    return () => {
      bus.close();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []);

  return { isReady, status, sendIntent };
}