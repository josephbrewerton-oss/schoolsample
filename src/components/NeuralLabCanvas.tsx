import React, { useEffect, useRef, useState, useMemo } from 'react';

const DEFAULT_OAK_CATALOGUE: Record<string, Record<string, string[]>> = {
  'Key Stage 1': {
    'English': ['Phonics & Simple Sentences', 'Capital Letters & Full Stops', 'Story Sequencing'],
    'Mathematics': ['Addition & Subtraction within 20', '2D & 3D Shapes', 'Place Value to 50'],
    'Science': ['Seasonal Changes', 'Animals and Humans', 'Materials and Properties'],
    'History': ['Changes Within Living Memory', 'Significant Historical Figures'],
    'Geography': ['Our Local Area', 'The Four Seasons & Weather Patterns'],
  },
  'Key Stage 2': {
    'Mathematics': ['Fractions and Decimals', 'Place Value and Rounding', 'Long Division & Multiplication', 'Perimeter and Area'],
    'English': ['Fronted Adverbials & Commas', 'Direct Speech Punctuation', 'Reading Comprehension: Inference'],
    'Science': ['States of Matter', 'The Water Cycle', 'Forces and Magnets', 'Earth and Space', 'Electricity & Circuits'],
    'History': ['Ancient Egypt & Pharaohs', 'The Roman Empire & Britain', 'The Vikings & Anglo-Saxons'],
    'Geography': ['Rivers & The Water Cycle', 'Volcanoes and Earthquakes', 'World Biomes & Climate Zones'],
    'Computing': ['Scratch Block Programming', 'Online Safety & Digital Literacy', 'Algorithms & Sequencing'],
  },
  'Key Stage 3': {
    'Mathematics': ['Algebraic Expressions & Indices', 'Linear Equations', 'Probability & Venn Diagrams', 'Pythagoras Theorem'],
    'Science': ['Atomic Structure & Periodic Table', 'Cell Biology & Microscopy', 'Energy Transfers & Conservation'],
    'English': ['Shakespeare: Key Themes', 'Gothic Literature', 'Persuasive Writing & Rhetoric'],
    'History': ['The Norman Conquest (1066)', 'The Industrial Revolution', 'The Transatlantic Slave Trade'],
    'Geography': ['Plate Tectonics & Hazards', 'Urbanisation & Mega Cities', 'Glacial Landscapes'],
    'Modern Foreign Languages': ['French: Present Tense & Daily Routine', 'Spanish: Free Time & Hobbies'],
  },
  'Key Stage 4 (GCSE)': {
    'Mathematics': ['Quadratic Equations & Graphs', 'Trigonometry (SOH CAH TOA)', 'Circle Theorems', 'Simultaneous Equations'],
    'Chemistry': ['Balancing Chemical Equations', 'Electrolysis & Electrolytes', 'Quantitative Chemistry & Moles'],
    'Physics': ['Newtonian Mechanics & Force', 'Waves and Electromagnetic Spectrum', 'Radioactivity & Half-Life'],
    'Biology': ['Genetics and Inheritance', 'Photosynthesis & Plant Transport', 'Homeostasis and Response'],
    'Religious Studies': ['Christian Practices & Sacraments', 'Ethics: Peace, Conflict and Justice'],
  }
};

export default function NeuralLabCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState('Connecting to On-Device Hypervisor...');
  const [isReady, setIsReady] = useState(false);

  // Cascading Oak Selectors
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

  // --- S-EXPRESSION PARSER ---
  const tokenize = (input: string) => {
    return input
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
    for (let i = 1; i < list.length; i += 2) {
      const key = String(list[i]).replace(/^:/, '');
      kwargs[key] = list[i + 1];
    }
    return kwargs;
  };

  // --- CANVAS RENDERER ---
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
      ctx.fillText('✨ Generating an Oak National Academy practice question...', 60, 100);
      return;
    }

    interactiveButtonsRef.current = [];
    const root = compiledASTRef.current;

    if (Array.isArray(root) && root[0] === 'view') {
      const viewProps = extractKwargs(root);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 20, 1020, 660);

      // Header Banner
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(viewProps.title || `${selectedSubject} Practice`, 60, 65);

      // Score & Streak
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`⭐ Stars: ${scoreRef.current}   🔥 Streak: ${streakRef.current}`, 760, 65);

      const body = viewProps.body;
      if (Array.isArray(body) && body[0] === 'quiz') {
        const quizProps = extractKwargs(body);
        const rawOpts = quizProps.opts;
        const options = Array.isArray(rawOpts) && rawOpts[0] === 'list' ? rawOpts.slice(1) : [];

        let ansIdx = 0;
        const rawAns = quizProps.ans;
        if (typeof rawAns === 'number') {
          ansIdx = rawAns;
        } else if (typeof rawAns === 'string') {
          const clean = rawAns.trim().toUpperCase();
          ansIdx = ['A', 'B', 'C', 'D'].includes(clean)
            ? clean.charCodeAt(0) - 65
            : parseInt(clean, 10) || 0;
        }

        const qText = String(quizProps.q || '');

        // Non-blocking math equivalency evaluation
        const parseVal = (str: string): number | null => {
          const clean = str.trim();
          const frac = clean.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
          if (frac) {
            const denom = Number(frac[2]);
            return denom !== 0 ? Number(frac[1]) / denom : null;
          }
          const num = parseFloat(clean);
          return isNaN(num) ? null : num;
        };

        const fracInPrompt = qText.match(/(\d+\/\d+)/);
        const decInPrompt = qText.match(/(?:(?:is|to)\s+)?(\d+\.\d+|\b0\.\d+\b)/i);

        let targetVal: number | null = null;
        if (fracInPrompt) {
          targetVal = parseVal(fracInPrompt[1]);
        } else if (decInPrompt) {
          targetVal = parseVal(decInPrompt[1]);
        }

        if (targetVal !== null) {
          let matchIdx = options.findIndex((opt: string) => {
            const optVal = parseVal(String(opt));
            return optVal !== null && Math.abs(optVal - targetVal!) < 0.001;
          });

          if (matchIdx === -1) {
            let closestDiff = Infinity;
            options.forEach((opt: string, idx: number) => {
              const optVal = parseVal(String(opt));
              if (optVal !== null) {
                const diff = Math.abs(optVal - targetVal!);
                if (diff < closestDiff) {
                  closestDiff = diff;
                  matchIdx = idx;
                }
              }
            });
          }

          if (matchIdx !== -1) ansIdx = matchIdx;
        }

        correctIndexRef.current = ansIdx;

        // Question Prompt
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(quizProps.q || '', 60, 135);

        options.forEach((opt: string, idx: number) => {
          const bx = 60;
          const by = 175 + idx * 72;
          const bw = 960;
          const bh = 56;

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
          ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillText(`Option ${String.fromCharCode(65 + idx)}:   ${opt}`, bx + 24, by + 35);
        });

        // Feedback & Next Button
        if (selectedAnswerRef.current !== null) {
          const isCorrect = selectedAnswerRef.current === correctIndexRef.current;

          ctx.fillStyle = isCorrect ? '#059669' : '#ea580c';
          ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const msg = isCorrect
            ? '🎉 Brilliant work! That is correct!'
            : '💡 Great effort! Take a look at this hint:';
          ctx.fillText(msg, 60, 490);

          if (!isCorrect && hintTextRef.current) {
            ctx.fillStyle = '#475569';
            ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText(hintTextRef.current, 60, 525);
          }

          const nbx = 60;
          const nby = 575;
          const nbw = 220;
          const nbh = 48;

          interactiveButtonsRef.current.push({ id: 'btn_next', x: nbx, y: nby, w: nbw, h: nbh });

          ctx.fillStyle = '#2563eb';
          ctx.fillRect(nbx, nby, nbw, nbh);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillText('Next Question ➔', nbx + 36, nby + 30);
        }
      }
    }
  };

  const dispatchIntent = () => {
    if (!channelRef.current || channelRef.current.readyState !== 'open') return;
    rawAstStreamRef.current = '';
    compiledASTRef.current = null;
    selectedAnswerRef.current = null;
    hintTextRef.current = null;
    renderScreen();

    const intent = `Generate a kid-friendly practice quiz for Key Stage: "${selectedKeyStage}", Subject: "${selectedSubject}", Topic: "${selectedUnit}" in S-expression format.`;
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
            hintTextRef.current = null;
          } else {
            setStreak(0);
            hintTextRef.current = `Tip: Review the core concept of "${selectedUnit}" and try again!`;
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
            setStatus('Ready to Learn');
            setIsReady(true);
            setTimeout(() => {
              dispatchIntent();
            }, 200);
          };

          channel.onmessage = (msg) => {
            if (msg.data === '__EOF__') {
              try {
                const tokens = tokenize(rawAstStreamRef.current);
                compiledASTRef.current = parseSExpr(tokens);
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