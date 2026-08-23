import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';
import { parseSExpr } from '../utils/sexprParser';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function NeuralLabCanvas() {
  const [status, setStatus] = useState('Loading Pattern Registry...');
  const [isReady, setIsReady] = useState(false);

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 2');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedUnit, setSelectedUnit] = useState('Fractions and Decimals');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [currentAST, setCurrentAST] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  const activeRequestMetaRef = useRef<{ subject: string; unit: string; keyStage: string }>({
    subject: 'Mathematics',
    unit: 'Fractions and Decimals',
    keyStage: 'Key Stage 2'
  });

  const availableSubjects = useMemo(() => {
    return Object.keys(DEFAULT_OAK_CATALOGUE[selectedKeyStage] || {});
  }, [selectedKeyStage]);

  const availableUnits = useMemo(() => {
    return DEFAULT_OAK_CATALOGUE[selectedKeyStage]?.[selectedSubject] || [];
  }, [selectedKeyStage, selectedSubject]);

  const channelRef = useRef<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const busRef = useRef<BroadcastChannel | null>(null);
  const patternRegistryRef = useRef<Map<string, string>>(new Map());
  const rawAstStreamRef = useRef('');

  const tokenize = (input: string) => {
    return (
      input
        .replace(/,/g, ' ')
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .trim()
        .match(/"[^"]*"|[^\s]+/g) || []
    );
  };

  const extractKwargs = (list: any[]) => {
    const kwargs: Record<string, any> = {};
    if (!Array.isArray(list)) return kwargs;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (typeof item === 'string' && item.startsWith(':')) {
        const key = item.replace(/^:/, '');
        kwargs[key] = list[i + 1];
        i++;
      }
    }
    return kwargs;
  };

  const versionUrl = useBaseUrl('/version.json');
  const manifestUrl = useBaseUrl('/nano-map.ast');

  useEffect(() => {
    async function loadPatterns() {
      try {
        const verRes = await fetch(`${versionUrl}?t=${Date.now()}`);
        if (verRes.ok && verRes.headers.get('content-type')?.includes('application/json')) {
          const verData = await verRes.json();
          console.log(`[Hypervisor] Engine v${verData.version} (Schema v${verData.schemaVersion})`);
        }

        const manifestRes = await fetch(manifestUrl);
        if (manifestRes.ok) {
          const manifestText = await manifestRes.text();
          if (!manifestText.trim().startsWith('<!DOCTYPE')) {
            const manifestAst: any = parseSExpr(manifestText);

            if (Array.isArray(manifestAst) && manifestAst[0] === 'registry:manifest') {
              for (let i = 1; i < manifestAst.length; i++) {
                const entry = extractKwargs(manifestAst[i]);
                if (entry.node && entry.path) {
                  const fileRes = await fetch(entry.path);
                  const fileText = await fileRes.text();
                  patternRegistryRef.current.set(entry.node, fileText);
                }
              }
            }
          }
        }
        setStatus('Ready for Edge Inference');
      } catch (err) {
        console.warn('Pattern registry fallback triggered:', err);
        setStatus('Ready for Edge Inference');
      }
    }
    loadPatterns();
  }, [versionUrl, manifestUrl]);

const dispatchIntent = (
    ks = selectedKeyStage,
    subj = selectedSubject,
    unit = selectedUnit
  ) => {
    activeRequestMetaRef.current = { subject: subj, unit: unit, keyStage: ks };
    rawAstStreamRef.current = '';
    setCurrentAST(null);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    if (!channelRef.current || channelRef.current.readyState !== 'open') {
      console.log('[Hypervisor] Channel not open yet. Signaling daemon...');
      busRef.current?.postMessage({ type: 'peer_ready' });
      return;
    }

    const seed = Math.floor(Math.random() * 10000);
    const nonce = Date.now().toString(36).slice(-4);

    // This exact structure is what worker.html regex looks for:
    const intent = `Subject: "${subj}", Topic: "${unit}", Key Stage: "${ks}" (Seed #${seed}-${nonce})`;
    console.log('[Hypervisor] Sending intent:', intent);
    channelRef.current.send(intent);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex) return;

    setSelectedAnswer(idx);

    if (idx === correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    bus.onmessage = async (e) => {
      if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      } else if (e.data.type === 'offer') {
        if (pcRef.current && pcRef.current.signalingState !== 'closed' && pcRef.current.signalingState !== 'stable') {
          return;
        }

        if (pcRef.current) pcRef.current.close();
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.ondatachannel = (ev) => {
          const channel = ev.channel;
          channelRef.current = channel;

          channel.onopen = () => {
            setIsReady(true);
            setStatus('Engine Ready');
            setTimeout(() => {
              dispatchIntent(
                activeRequestMetaRef.current.keyStage,
                activeRequestMetaRef.current.subject,
                activeRequestMetaRef.current.unit
              );
            }, 100);
          };

channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              console.log('[Hypervisor] Received __EOF__. Stream:', rawAstStreamRef.current);
              try {
                const cleanRaw = rawAstStreamRef.current
                  .replace(/```[a-z]*/gi, '')
                  .replace(/```/g, '')
                  .trim();

                // 1. Parse Prompt
                let prompt = cleanRaw.match(/:prompt\s+"([^"]+)"/i)?.[1] ||
                             cleanRaw.match(/:prompt\s+([^\(\):]+)/i)?.[1] ||
                             'Select the correct answer:';
                prompt = prompt.replace(/:route[\s\S]*$/i, '').trim();

                // 2. Extract and sanitize Options (handles quoted and unquoted tokens)
                let options: string[] = [];
                const optionsBlockMatch = cleanRaw.match(/:options\s*\((?:list\s+)?([\s\S]*?)\)(?=\s*:answer-key|\s*\)|\s*$)/i);
                
                if (optionsBlockMatch) {
                  const blockContent = optionsBlockMatch[1].trim();
                  
                  // Check for quoted strings first
                  const quotedMatches = blockContent.match(/"([^"]+)"/g);
                  if (quotedMatches && quotedMatches.length > 0) {
                    options = quotedMatches.map(s => s.replace(/^"|"$/g, '').trim());
                  } else {
                    // Split whitespace for unquoted numerical / word tokens (e.g. 0.25 25 1/4 40)
                    options = blockContent
                      .split(/\s+/)
                      .filter(t => t && t !== 'list')
                      .map(t => t.replace(/^["']|["']$/g, '').trim());
                  }
                }

                // 3. Extract Answer Key
                const keyMatch = cleanRaw.match(/:answer-key\s+(\d+)/i);
                const answerKey = keyMatch ? parseInt(keyMatch[1], 10) : 0;

                if (options.length >= 2) {
                  const targetCorrectValue = options[answerKey] ?? options[0];
                  const shuffled = [...options].sort(() => Math.random() - 0.5);

                  setCorrectIndex(shuffled.indexOf(targetCorrectValue));
                  setCurrentAST({
                    prompt,
                    options,
                    answerKey,
                    displayOptions: shuffled,
                    activeSubject: activeRequestMetaRef.current.subject,
                    activeUnit: activeRequestMetaRef.current.unit
                  });
                }
              } catch (err) {
                console.error('AST Parse Error:', err);
              }
            } else {
              rawAstStreamRef.current += msg.data;
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
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Filter & Control Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedKeyStage}
            onChange={(e) => {
              const newKS = e.target.value;
              const firstSubj = Object.keys(DEFAULT_OAK_CATALOGUE[newKS] || {})[0] || '';
              const firstUnit = DEFAULT_OAK_CATALOGUE[newKS]?.[firstSubj]?.[0] || '';
              setSelectedKeyStage(newKS);
              setSelectedSubject(firstSubj);
              setSelectedUnit(firstUnit);
              dispatchIntent(newKS, firstSubj, firstUnit);
            }}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, color: '#1e3a8a' }}
          >
            {Object.keys(DEFAULT_OAK_CATALOGUE).map((ks) => (
              <option key={ks} value={ks}>{ks}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => {
              const newSubj = e.target.value;
              const firstUnit = DEFAULT_OAK_CATALOGUE[selectedKeyStage]?.[newSubj]?.[0] || '';
              setSelectedSubject(newSubj);
              setSelectedUnit(firstUnit);
              dispatchIntent(selectedKeyStage, newSubj, firstUnit);
            }}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, color: '#0f172a' }}
          >
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={selectedUnit}
            onChange={(e) => {
              const newUnit = e.target.value;
              setSelectedUnit(newUnit);
              dispatchIntent(selectedKeyStage, selectedSubject, newUnit);
            }}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', maxWidth: '280px' }}
          >
            {availableUnits.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <button
            onClick={() => dispatchIntent(selectedKeyStage, selectedSubject, selectedUnit)}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1.25rem',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            New Question
          </button>
        </div>

        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: isReady ? '#ecfdf5' : '#fef3c7',
            color: isReady ? '#059669' : '#d97706',
            border: `1px solid ${isReady ? '#a7f3d0' : '#fde68a'}`
          }}
        >
          ● {status}
        </span>
      </div>

      {/* V-DOM AST Interactive Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          minHeight: '480px'
        }}
      >
        {!currentAST ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>
            ⚡ Fast-splicing AST question archetype...
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
                {currentAST.activeSubject}: {currentAST.activeUnit}
              </h2>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706' }}>
                ⭐ Stars: {score} &nbsp;&nbsp; 🔥 Streak: {streak}
              </div>
            </div>

            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              {currentAST.prompt}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentAST.displayOptions.map((opt: string, idx: number) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === correctIndex;

                let bg = '#f8fafc';
                let border = '#e2e8f0';
                let textColor = '#1e293b';

                if (isSelected) {
                  if (isCorrect) {
                    bg = '#ecfdf5';
                    border = '#10b981';
                    textColor = '#065f46';
                  } else {
                    bg = '#fff7ed';
                    border = '#f97316';
                    textColor = '#9a3412';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '1rem 1.25rem',
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: '10px',
                      cursor: selectedAnswer === correctIndex ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      color: textColor,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: isSelected ? border : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: selectedAnswer === correctIndex ? '#059669' : '#ea580c' }}>
                  {selectedAnswer === correctIndex ? '🎉 Correct! Well done, great answer.' : '💡 Let’s try another one!'}
                </div>
                <button
                  onClick={() => dispatchIntent(activeRequestMetaRef.current.keyStage, activeRequestMetaRef.current.subject, activeRequestMetaRef.current.unit)}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Next Question ➔
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}