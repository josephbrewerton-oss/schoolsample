import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';

export default function NeuralLabCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState('Loading Pattern Registry...');
  const [isReady, setIsReady] = useState(false);

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 2');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedUnit, setSelectedUnit] = useState('Fractions and Decimals');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

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
  const compiledASTRef = useRef<any>(null);
  const interactiveButtonsRef = useRef<{ id: string; x: number; y: number; w: number; h: number; idx?: number }[]>([]);
  const selectedAnswerRef = useRef<number | null>(null);
  const correctIndexRef = useRef<number | null>(null);
  const hintTextRef = useRef<string | null>(null);

  const scoreRef = useRef(score);
  const streakRef = useRef(streak);
  scoreRef.current = score;
  streakRef.current = streak;

  // --- RESILIENT AST PARSER ---
const parseAstDirectly = (raw: string) => {
  try {
    // 1. Extract prompt
    const promptMatch = raw.match(/:prompt\s+"([\s\S]*?)"(?=\s*:options|\s*:answer-key|\s*\))/i) 
      || raw.match(/:prompt\s+"([^"]+)"/i)
      || raw.match(/:prompt\s+([^\(\)]+)/i);

    let cleanPrompt = promptMatch ? promptMatch[1] : '';
    cleanPrompt = cleanPrompt.replace(/:route[\s\S]*$/i, '').trim();

    // 2. Extract options block
    const optionsBlockMatch = raw.match(/:options\s*\((?:list\s+)?([\s\S]*?)\)(?=\s*:answer-key|\s*\)|\s*$)/i);
    const options: string[] = [];

    if (optionsBlockMatch) {
      const blockContent = optionsBlockMatch[1].trim();
      
      // Try extracting quoted strings first
      const optRegex = /"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = optRegex.exec(blockContent)) !== null) {
        options.push(m[1].trim());
      }

      // If no quoted strings found, split by whitespace or s-expression tokens
      if (options.length === 0) {
        const rawTokens = blockContent.split(/\s+/).filter(t => t && t !== 'list');
        rawTokens.forEach(token => {
          options.push(token.replace(/^["']|["']$/g, '').trim());
        });
      }
    }

    // 3. Extract answer key
    const keyMatch = raw.match(/:answer-key\s+(\d+)/i);
    const answerKey = keyMatch ? parseInt(keyMatch[1], 10) : 0;

    return {
      prompt: cleanPrompt || 'Select the correct answer:',
      options: options.length >= 2 ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
      answerKey: answerKey
    };
  } catch (e) {
    console.error('Direct AST Parse Error:', e);
    return null;
  }
};

  const tokenize = (input: string) => {
    return input
      .replace(/,/g, ' ')
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .trim()
      .match(/"[^"]*"|[^\s]+/g) || [];
  };

  const parseSExpr = (tokens: string[]): any => {
    if (tokens.length === 0) return null;
    const token = tokens.shift()!;
    if (token === '(') {
      const list = [];
      while (tokens.length > 0 && tokens[0] !== ')') {
        list.push(parseSExpr(tokens));
      }
      tokens.shift();
      return list;
    } else if (token === ')') {
      return null;
    } else if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    } else if (!isNaN(Number(token))) {
      return Number(token);
    }
    return token;
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

  // --- PRELOAD MANIFEST & PATTERNS ---
  useEffect(() => {
    async function loadPatterns() {
      try {
        const verRes = await fetch(`/static/version.json?t=${Date.now()}`);
        if (verRes.ok) {
          const verData = await verRes.json();
          console.log(`[Hypervisor] Engine v${verData.version} (Schema v${verData.schemaVersion})`);
        }
        const manifestRes = await fetch('/static/nano-map.ast');
        if (manifestRes.ok) {
          const manifestText = await manifestRes.text();
          const manifestAst = parseSExpr(tokenize(manifestText));

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
        setStatus('Ready for Edge Inference');
      } catch (err) {
        console.error('Failed to load static pattern registry:', err);
        setStatus('Error loading patterns');
      }
    }
    loadPatterns();
  }, []);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  }

  const renderScreen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!compiledASTRef.current) {
      ctx.fillStyle = '#64748b';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('⚡ Fast-splicing AST question archetype...', 60, 100);
      return;
    }

    interactiveButtonsRef.current = [];
    const parsedData = compiledASTRef.current;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 20, 1020, 660);

    // Dynamic Header Banner
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${selectedSubject}: ${selectedUnit}`, 60, 65);

    // Score & Streak
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`⭐ Stars: ${scoreRef.current}   🔥 Streak: ${streakRef.current}`, 760, 65);

    const prompt = parsedData.prompt;
    const rawOptions = parsedData.options;
    const originalAnsIdx = parsedData.answerKey || 0;
    const targetCorrectValue = rawOptions[originalAnsIdx] ?? rawOptions[0];

    // Shuffling
    let displayOptions = rawOptions;
    if (correctIndexRef.current === null && rawOptions.length > 0) {
      const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);
      displayOptions = shuffled;
      correctIndexRef.current = shuffled.indexOf(targetCorrectValue);
      parsedData._shuffled = shuffled;
    } else if (parsedData._shuffled) {
      displayOptions = parsedData._shuffled;
    }

    // Wrapped Question Prompt
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const lastPromptY = wrapText(ctx, prompt || 'Choose the correct answer:', 60, 125, 960, 28);

    const optionsStartY = Math.max(175, lastPromptY + 30);

    displayOptions.forEach((opt: string, idx: number) => {
      const bx = 60;
      const by = optionsStartY + idx * 68;
      const bw = 960;
      const bh = 54;

      interactiveButtonsRef.current.push({ id: `option_${idx}`, x: bx, y: by, w: bw, h: bh, idx });

      if (selectedAnswerRef.current === idx) {
        ctx.fillStyle = idx === correctIndexRef.current ? '#ecfdf5' : '#fff7ed';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = idx === correctIndexRef.current ? '#10b981' : '#f97316';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
      }

      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = '#1e293b';
      ctx.font = '500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`Option ${String.fromCharCode(65 + idx)}:   ${opt}`, bx + 24, by + 34);
    });

    // Feedback & Next Action
    if (selectedAnswerRef.current !== null) {
      const isCorrect = selectedAnswerRef.current === correctIndexRef.current;

      ctx.fillStyle = isCorrect ? '#059669' : '#ea580c';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(
        isCorrect ? '🎉 Correct! Well done, great answer.' : '💡 Let’s try another one!',
        60,
        optionsStartY + displayOptions.length * 68 + 30
      );

      const nbx = 60;
      const nby = optionsStartY + displayOptions.length * 68 + 55;
      const nbw = 220;
      const nbh = 48;

      interactiveButtonsRef.current.push({ id: 'btn_next', x: nbx, y: nby, w: nbw, h: nbh });

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(nbx, nby, nbw, nbh);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Next Question ➔', nbx + 36, nby + 30);
    }
  };

const dispatchIntent = (
  ks = selectedKeyStage,
  subj = selectedSubject,
  unit = selectedUnit
) => {
  if (!channelRef.current || channelRef.current.readyState !== 'open') return;
  rawAstStreamRef.current = '';
  compiledASTRef.current = null;
  selectedAnswerRef.current = null;
  correctIndexRef.current = null;
  hintTextRef.current = null;
  renderScreen();

  const seed = Math.floor(Math.random() * 10000);
  const nonce = Date.now().toString(36).slice(-4);

  // Store the active title explicitly alongside the request
  (window as any).__ACTIVE_TOPIC_HEADER = `${subj}: ${unit}`;

  const intent = `Subject: "${subj}", Topic: "${unit}", Key Stage: "${ks}" (Seed #${seed}-${nonce})`;
  channelRef.current.send(intent);
};
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    interactiveButtonsRef.current.forEach((btn) => {
      if (clickX >= btn.x && clickX <= btn.x + btn.w && clickY >= btn.y && clickY <= btn.y + btn.h) {
        if (btn.id === 'btn_next') {
          dispatchIntent();
          return;
        }

        const isMastered = selectedAnswerRef.current === correctIndexRef.current;
        if (btn.idx !== undefined && !isMastered) {
          selectedAnswerRef.current = btn.idx;

          if (btn.idx === correctIndexRef.current) {
            setScore((s) => s + 1);
            setStreak((st) => st + 1);
          } else {
            setStreak(0);
          }
          renderScreen();
        }
      }
    });
  };

  useEffect(() => {
    const bus = new BroadcastChannel('webrtc-neural-signaling');
    busRef.current = bus;

    bus.onmessage = async (e) => {
      if (e.data.type === 'daemon_ready') {
        bus.postMessage({ type: 'peer_ready' });
      } else if (e.data.type === 'offer') {
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
              dispatchIntent();
            }, 100);
          };

          channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              try {
                const cleanRaw = rawAstStreamRef.current
                  .replace(/```[a-z]*/gi, '')
                  .replace(/```/g, '')
                  .trim();

                const parsed = parseAstDirectly(cleanRaw);
                if (parsed) {
                  compiledASTRef.current = parsed;
                }
              } catch (err) {
                console.error('AST Parse Error:', err);
              }
              renderScreen();
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
          await pcRef.current.addIceCandidate(new RTCIceCandidate(e.data.candidate));
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
    renderScreen();

    return () => {
      clearInterval(syncInterval);
      bus.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{
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
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedKeyStage}
            onChange={(e) => {
              const newKS = e.target.value;
              setSelectedKeyStage(newKS);
              const firstSubj = Object.keys(DEFAULT_OAK_CATALOGUE[newKS] || {})[0] || '';
              setSelectedSubject(firstSubj);
              setSelectedUnit(DEFAULT_OAK_CATALOGUE[newKS]?.[firstSubj]?.[0] || '');
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
              setSelectedSubject(newSubj);
              setSelectedUnit(DEFAULT_OAK_CATALOGUE[selectedKeyStage]?.[newSubj]?.[0] || '');
            }}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, color: '#0f172a' }}
          >
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', maxWidth: '280px' }}
          >
            {availableUnits.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <button
            onClick={() => dispatchIntent()}
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

        <span style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          background: isReady ? '#ecfdf5' : '#fef3c7',
          color: isReady ? '#059669' : '#d97706',
          border: `1px solid ${isReady ? '#a7f3d0' : '#fde68a'}`
        }}>
          ● {status}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={1080}
        height={700}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          display: 'block'
        }}
      />
    </div>
  );
}