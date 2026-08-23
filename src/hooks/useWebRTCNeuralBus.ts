import { useEffect, useRef, useState, useCallback } from 'react';
import { extractQuestionFromStream, ExtractedQuestion } from '../utils/astQuestionExtractor';

export function useWebRTCNeuralBus(onNewQuestion: (q: ExtractedQuestion) => void) {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('Connecting to Daemon...');
  const channelRef = useRef<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const rawStreamRef = useRef('');

  const sendIntent = useCallback((ks: string, subj: string, unit: string) => {
    rawStreamRef.current = '';
    if (!channelRef.current || channelRef.current.readyState !== 'open') {
      busRef.current?.postMessage({ type: 'peer_ready' });
      return;
    }
    const seed = Math.floor(Math.random() * 10000);
    const nonce = Date.now().toString(36).slice(-4);
    const intent = `Subject: "${subj}", Topic: "${unit}", Key Stage: "${ks}" (Seed #${seed}-${nonce})`;
    channelRef.current.send(intent);
  }, []);

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    bus.onmessage = async (e) => {
      if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      } else if (e.data.type === 'offer') {
        if (pcRef.current && pcRef.current.signalingState !== 'closed' && pcRef.current.signalingState !== 'stable') return;
        if (pcRef.current) pcRef.current.close();

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.ondatachannel = (ev) => {
          const channel = ev.channel;
          channelRef.current = channel;

            channel.onopen = () => {
            setIsReady(true);
            setStatus('Engine Ready');
            // Auto-trigger initial question once channel is open
            const seed = Math.floor(Math.random() * 10000);
            const nonce = Date.now().toString(36).slice(-4);
            const initialIntent = `Subject: "Mathematics", Topic: "Fractions and Decimals", Key Stage: "Key Stage 2" (Seed #${seed}-${nonce})`;
            channel.send(initialIntent);
          };

          channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              const question = extractQuestionFromStream(rawStreamRef.current);
              if (question) onNewQuestion(question);
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
          if (pcRef.current.remoteDescription) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(e.data.candidate));
          }
        } catch {}
      }
    };

    const syncInterval = setInterval(() => {
      if (channelRef.current?.readyState === 'open') {
        clearInterval(syncInterval);
      } else {
        bus.postMessage({ type: 'peer_ready' });
      }
    }, 1200);

    bus.postMessage({ type: 'peer_ready' });

    return () => {
      clearInterval(syncInterval);
      bus.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, [onNewQuestion]);

  return { isReady, status, sendIntent };
}