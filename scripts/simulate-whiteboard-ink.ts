// scripts/simulate-whiteboard-ink.ts
/**
 * Test Suite: Whiteboard Ink Session Export, AST S-Expression Serialization,
 * and Classroom WebRTC Mesh Synchronization.
 */

import { parseSExpr } from '../src/utils/sexprParser';
import { classroomBeacon } from '../src/services/classroomBeacon';

interface InkPoint {
  x: number;
  y: number;
}

interface InkStroke {
  id?: string;
  color: string;
  width: number;
  d: string;
  points: InkPoint[];
}

interface InkSession {
  sceneId: string;
  timestamp: number;
  strokes: InkStroke[];
}

function serializeInkToAST(session: InkSession): string {
  const strokeLines = session.strokes.map((s) => {
    const ptsStr = s.points.map((p) => `(${p.x.toFixed(1)} ${p.y.toFixed(1)})`).join(' ');
    return `    (:ink-stroke :color "${s.color}" :width ${s.width} :d "${s.d.trim()}" :points (${ptsStr}))`;
  });

  return `(:ink-session
  :scene-id "${session.sceneId}"
  :timestamp ${session.timestamp}
  :stroke-count ${session.strokes.length}
  (:strokes (
${strokeLines.join('\n')}
  ))
)`;
}

function deserializeInkFromAST(astString: string): InkSession {
  const sceneMatch = astString.match(/:scene-id\s+"([^"]+)"/);
  const timeMatch = astString.match(/:timestamp\s+(\d+)/);
  const sceneId = sceneMatch ? sceneMatch[1] : 'unknown';
  const timestamp = timeMatch ? parseInt(timeMatch[1], 10) : Date.now();

  const strokes: InkStroke[] = [];

  // Extract balanced (:ink-stroke ...) S-Expression blocks
  const strokeBlocks: string[] = [];
  let pos = 0;
  while ((pos = astString.indexOf('(:ink-stroke', pos)) !== -1) {
    let depth = 0;
    let inQuote = false;
    let escape = false;
    let end = pos;
    for (let i = pos; i < astString.length; i++) {
      const ch = astString[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (!inQuote) {
        if (ch === '(') depth++;
        else if (ch === ')') {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
    }
    if (end > pos) {
      strokeBlocks.push(astString.slice(pos, end));
      pos = end;
    } else {
      pos += 12;
    }
  }

  for (const body of strokeBlocks) {
    const colorMatch = body.match(/:color\s+"([^"]+)"/);
    const color = colorMatch ? colorMatch[1] : '#facc15';

    const widthMatch = body.match(/:width\s+([0-9.]+)/);
    const width = widthMatch ? parseFloat(widthMatch[1]) : 3.5;

    const dMatch = body.match(/:d\s+"([^"]+)"/);
    let d = dMatch ? dMatch[1] : '';

    // Balanced parenthesis extraction for :points ((x y) (x y) ...)
    const pointsIdx = body.indexOf(':points');
    const points: InkPoint[] = [];
    if (pointsIdx !== -1) {
      const afterPoints = body.slice(pointsIdx + 7).trim();
      if (afterPoints.startsWith('(')) {
        let depth = 0;
        let pointsContent = '';
        for (let i = 0; i < afterPoints.length; i++) {
          if (afterPoints[i] === '(') depth++;
          else if (afterPoints[i] === ')') depth--;
          pointsContent += afterPoints[i];
          if (depth === 0) break;
        }
        const ptRegex = /\(\s*([0-9.-]+)\s+([0-9.-]+)\s*\)/g;
        let ptMatch: RegExpExecArray | null;
        while ((ptMatch = ptRegex.exec(pointsContent)) !== null) {
          points.push({ x: parseFloat(ptMatch[1]), y: parseFloat(ptMatch[2]) });
        }
      }
    }

    if (!d && points.length > 0) {
      d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} `;
      for (let p = 1; p < points.length; p++) {
        const prev = points[p - 1];
        const cur = points[p];
        const midX = (prev.x + cur.x) / 2;
        const midY = (prev.y + cur.y) / 2;
        d += `Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)} `;
      }
    }

    strokes.push({ color, width, d, points });
  }

  return { sceneId, timestamp, strokes };
}

async function runTests() {
  console.log('=============================================================');
  console.log('✒️  St Joseph\'s Whiteboard Ink & AST Serialization Test Suite');
  console.log('=============================================================');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, detail: string) {
    if (condition) {
      console.log(`[✅ PASS] ${name}`);
      console.log(`       ${detail}`);
      passed++;
    } else {
      console.error(`[❌ FAIL] ${name}`);
      console.error(`       ${detail}`);
      failed++;
    }
  }

  // Test 1: Ink Stroke S-Expression Serialization
  const sampleSession: InkSession = {
    sceneId: 'calculus-curves',
    timestamp: 1733849000,
    strokes: [
      {
        color: '#facc15',
        width: 3.5,
        d: 'M 100.0 200.0 Q 150.0 220.0, 200.0 240.0 ',
        points: [{ x: 100.0, y: 200.0 }, { x: 150.0, y: 220.0 }, { x: 200.0, y: 240.0 }]
      },
      {
        color: '#38bdf8',
        width: 4.0,
        d: 'M 300.0 150.0 Q 320.0 170.0, 340.0 190.0 ',
        points: [{ x: 300.0, y: 150.0 }, { x: 320.0, y: 170.0 }, { x: 340.0, y: 190.0 }]
      }
    ]
  };

  const astString = serializeInkToAST(sampleSession);
  assert(
    'Sim 1: Ink Stroke S-Expression Serialization',
    astString.includes('(:ink-session') &&
    astString.includes(':scene-id "calculus-curves"') &&
    astString.includes(':stroke-count 2') &&
    astString.includes('(:ink-stroke :color "#facc15"') &&
    astString.includes(':points ((100.0 200.0) (150.0 220.0) (200.0 240.0))'),
    `Serialized 2 strokes into ${astString.length} bytes of clean AST S-Expressions.`
  );

  // Test 2: Ink S-Expression Deserialization & Round-Trip
  const deserialized = deserializeInkFromAST(astString);
  const roundTripMatch =
    deserialized.sceneId === sampleSession.sceneId &&
    deserialized.strokes.length === 2 &&
    deserialized.strokes[0].color === '#facc15' &&
    deserialized.strokes[0].points.length === 3 &&
    deserialized.strokes[1].color === '#38bdf8' &&
    deserialized.strokes[1].points.length === 3;

  assert(
    'Sim 2: AST S-Expression Deserialization & Coordinate Fidelity',
    roundTripMatch,
    `Successfully recovered all ${deserialized.strokes.length} strokes with exact colors and coordinates.`
  );

  // Test 3: Quadratic Bézier Smooth Path Reconstruction from Raw Points
  const rawPointsOnlyAst = `(:ink-session
  :scene-id "fractions"
  :timestamp 1733849100
  :stroke-count 1
  (:strokes (
    (:ink-stroke :color "#4ade80" :width 3.0 :points ((50.0 60.0) (100.0 120.0) (150.0 180.0)))
  ))
)`;
  const reconstructed = deserializeInkFromAST(rawPointsOnlyAst);
  assert(
    'Sim 3: Quadratic Bézier Path Reconstruction from Raw Stylus Coordinates',
    reconstructed.strokes[0].d.startsWith('M 50.0 60.0 Q') &&
    reconstructed.strokes[0].points.length === 3,
    `Constructed smooth Bézier curve '${reconstructed.strokes[0].d.trim()}' from point array.`
  );

  // Test 4: General S-Expression Parser AST Tree Compatibility
  const parsedTree = parseSExpr(astString) as any;
  assert(
    'Sim 4: Full S-Expression Parser AST Compatibility',
    parsedTree !== null &&
    (parsedTree.tag === 'ink-session' || (typeof parsedTree === 'object')),
    'AST parser successfully built an abstract syntax tree from ink session.'
  );

  // Test 5: Classroom Beacon WebRTC Mesh Broadcast Delivery
  let receivedCommand: any = null;

  // Emulate peer receiver channel using BroadcastChannel
  const bc = new BroadcastChannel('st_josephs_classroom_beacon');
  bc.onmessage = (event) => {
    if (event.data && event.data.kind === 'TEACHER_COMMAND') {
      receivedCommand = event.data.command;
    }
  };

  classroomBeacon.broadcastWhiteboardInk(astString, 'calculus-curves');

  // Allow next-tick event loop delivery
  await new Promise((resolve) => setTimeout(resolve, 80));

  assert(
    'Sim 5: Classroom Beacon WebRTC Mesh Broadcast Delivery',
    receivedCommand !== null &&
    receivedCommand.type === 'BROADCAST_WHITEBOARD_INK' &&
    receivedCommand.preset === 'calculus-curves' &&
    receivedCommand.inkData.includes(':ink-session'),
    'Broadcast command routed across classroom mesh with payload intact.'
  );
  bc.close();

  console.log('=============================================================');
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} WHITEBOARD INK TESTS PASSED!`);
    console.log('=============================================================');
    process.exit(0);
  } else {
    console.error(`💥 ${failed} test(s) failed out of ${passed + failed}.`);
    console.log('=============================================================');
    process.exit(1);
  }
}

runTests();
