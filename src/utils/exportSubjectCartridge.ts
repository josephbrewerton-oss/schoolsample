// src/utils/exportSubjectCartridge.ts
/**
 * St. Joseph's Decentralized Offline Subject Cartridge Generator
 * 
 * Bundles interactive AST vector cartridges (built-in, PhET-imported, or teacher-authored)
 * into a single, self-contained, zero-dependency HTML file (< 75 KB) for air-gapped,
 * rural, and missionary classrooms.
 */

import { getAllCartridges, getCartridge, EMBEDDED_CORE_CARTRIDGES, CartridgeDefinition } from '../services/cartridgeStore';

export interface CartridgePackage {
  id: string;
  title: string;
  description: string;
  scenes: { id: string; title: string; category: string }[];
}

export const DEFAULT_CARTRIDGE_PACKAGES: CartridgePackage[] = [
  {
    id: 'complete-stem',
    title: 'Complete STEM Invariant Lab Toolkit (8-in-1)',
    description: 'All core mathematics and physics vector laboratories in a single 65 KB offline package.',
    scenes: [
      { id: 'algebra-balance', title: '⚖️ Algebraic Balance Scale (2x + 5 = 15)', category: 'Maths' },
      { id: 'electric-circuits', title: "💡 Circuits & Ohm's Law (V = I × R)", category: 'Physics' },
      { id: 'mountain-elevation', title: '🧗 Mountain Altitude & Trigonometry', category: 'Maths' },
      { id: 'bodmas', title: '🧮 BODMAS Forcefield Clamps', category: 'Maths' },
      { id: 'times-tables', title: '📐 2D Arrays & Distributive Splitter', category: 'Maths' },
      { id: 'fractions', title: '🥧 Fractions & Common Denominators', category: 'Maths' },
      { id: 'photosynthesis', title: '🌱 Photosynthesis Leaf Factory', category: 'Biology' },
      { id: 'velocity', title: '🏎️ Velocity Vectors & Kinematics', category: 'Physics' },
      { id: 'kinetic-gas', title: "🌡️ Kinetic Gas Theory & Boyle's Law", category: 'Physics & Chemistry' },
      { id: 'calculus-curves', title: '📐 Calculus: Tangents & Integrals', category: 'Maths' },
    ],
  },
  {
    id: 'maths-invariants',
    title: 'Pure Mathematics Foundations Cartridge (6-in-1)',
    description: 'Algebra, BODMAS, Times Tables, Fractions, Mountain trigonometry, and Calculus curves.',
    scenes: [
      { id: 'algebra-balance', title: '⚖️ Algebraic Balance Scale', category: 'Algebra' },
      { id: 'bodmas', title: '🧮 BODMAS Order of Operations', category: 'Arithmetic' },
      { id: 'times-tables', title: '📐 Times Tables (12×12)', category: 'Arithmetic' },
      { id: 'fractions', title: '🥧 Fraction Equivalence', category: 'Proportions' },
      { id: 'mountain-elevation', title: '🧗 Mountain Altitude & Hypotenuse', category: 'Geometry' },
      { id: 'calculus-curves', title: '📐 Calculus Tangents & Integrals', category: 'Calculus' },
    ],
  },
  {
    id: 'science-physics',
    title: 'Physical & Natural Sciences Cartridge (5-in-1)',
    description: 'Circuits, Kinetic Gas Laws, Photosynthesis, Velocity vectors, and Planetary orbits.',
    scenes: [
      { id: 'electric-circuits', title: "💡 Circuits & Ohm's Law", category: 'Physics' },
      { id: 'kinetic-gas', title: "🌡️ Kinetic Gas Theory & Boyle's Law", category: 'Physics & Chemistry' },
      { id: 'photosynthesis', title: '🌱 Photosynthesis Rate Limiter', category: 'Biology' },
      { id: 'velocity', title: '🏎️ Velocity Vectors', category: 'Physics' },
      { id: 'solar-system', title: '🪐 Solar System Orbits', category: 'Astronomy' },
    ],
  },
];

export const AVAILABLE_CARTRIDGES: CartridgePackage[] = DEFAULT_CARTRIDGE_PACKAGES;

/**
 * Builds and exports an air-gapped single-file HTML cartridge
 */
export function exportSubjectCartridge(cartridgeIdOrPackageId: string): void {
  // Check if it's a multi-scene package
  const pkg = DEFAULT_CARTRIDGE_PACKAGES.find((c) => c.id === cartridgeIdOrPackageId);

  let targetScenes: Array<{
    id: string;
    title: string;
    category: string;
    svgMarkup: string;
    astSource?: string;
  }> = [];

  let bundleTitle = '';
  let bundleDesc = '';
  let filename = '';

  if (pkg) {
    bundleTitle = pkg.title;
    bundleDesc = pkg.description;
    filename = `stj-cartridge-${pkg.id}.html`;

    targetScenes = pkg.scenes.map((sc) => {
      const cart = getCartridge(sc.id);
      return {
        id: sc.id,
        title: sc.title,
        category: sc.category,
        svgMarkup: (cart && cart.svgMarkup) || (EMBEDDED_CORE_CARTRIDGES[sc.id]?.svg) || '',
        astSource: (cart && cart.astSource) || (EMBEDDED_CORE_CARTRIDGES[sc.id]?.ast) || '',
      };
    });
  } else {
    // Individual cartridge export
    const cart = getCartridge(cartridgeIdOrPackageId);
    if (!cart) return;

    bundleTitle = cart.title;
    bundleDesc = cart.desc;
    filename = `stj-cartridge-${cart.id}.html`;

    targetScenes = [{
      id: cart.id,
      title: cart.title,
      category: cart.category,
      svgMarkup: cart.svgMarkup || (EMBEDDED_CORE_CARTRIDGES[cart.id]?.svg) || '',
      astSource: cart.astSource || (EMBEDDED_CORE_CARTRIDGES[cart.id]?.ast) || '',
    }];
  }

  exportCustomCartridgeBundle(targetScenes, bundleTitle, bundleDesc, filename);
}

/**
 * Exports ANY arbitrary selection of cartridges (Built-in, PhET, or Teacher-Authored) into an offline HTML cartridge
 */
export function exportCustomCartridgeBundle(
  scenes: Array<{
    id: string;
    title: string;
    category: string;
    svgMarkup?: string;
    astSource?: string;
  }>,
  title: string,
  description: string,
  filename = 'stj-decentralized-cartridge.html'
): void {
  // Enrich scenes with SVG & AST from store if missing
  const enrichedScenes = scenes.map((sc) => {
    const fromStore = getCartridge(sc.id);
    const svg = sc.svgMarkup || fromStore?.svgMarkup || EMBEDDED_CORE_CARTRIDGES[sc.id]?.svg || '';
    const ast = sc.astSource || fromStore?.astSource || EMBEDDED_CORE_CARTRIDGES[sc.id]?.ast || '';
    return {
      id: sc.id,
      title: sc.title || fromStore?.title || sc.id,
      category: sc.category || fromStore?.category || 'General',
      svgMarkup: svg,
      astSource: ast,
    };
  });

  const payloadJson = JSON.stringify(enrichedScenes);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>St. Joseph's Offline Cartridge: ${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      user-select: none;
    }
    header {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .badge {
      background: #16a34a;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    nav {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      display: flex;
      overflow-x: auto;
      padding: 6px 12px;
      gap: 6px;
    }
    .tab-btn {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border: 1px solid transparent;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }
    .tab-btn.active {
      background: #2563eb;
      color: #ffffff;
      border-color: #3b82f6;
    }
    #stage-area {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%);
      overflow: hidden;
    }
    #stage-viewport {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      max-width: 95%;
      max-height: 90%;
      filter: drop-shadow(0 10px 25px rgba(0,0,0,0.5));
    }
    /* Dynamic In-Stage Parameters Dock */
    #param-dock {
      position: absolute;
      bottom: 14px;
      left: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.35);
      backdrop-filter: blur(8px);
      padding: 8px 14px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      z-index: 50;
    }
    .param-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .param-input {
      width: 50px;
      background: #1e293b;
      border: 1px solid #38bdf8;
      color: #38bdf8;
      border-radius: 4px;
      padding: 3px 6px;
      font-weight: 800;
      text-align: center;
    }
    footer {
      background: #0f172a;
      border-top: 1px solid #1e293b;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      gap: 12px;
    }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 7px 16px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover { background: #1d4ed8; }
    .scrubber {
      flex: 1;
      height: 6px;
      accent-color: #38bdf8;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="font-size: 1.05rem; font-weight: 800; color: #f8fafc;">${escapeHtml(title)}</h1>
      <span style="font-size: 0.75rem; color: #94a3b8;">${escapeHtml(description)}</span>
    </div>
    <span class="badge">100% AIR-GAPPED DECENTRALIZED CARTRIDGE</span>
  </header>

  <nav id="cartridge-nav"></nav>

  <div id="stage-area">
    <div id="stage-viewport"></div>
    <div id="param-dock" style="display:none;"></div>
  </div>

  <footer>
    <button class="btn" id="playBtn" onclick="togglePlay()">⏸️ Pause</button>
    <input type="range" class="scrubber" id="timeScrubber" min="0" max="100" value="0" oninput="scrub(this.value)">
    <span id="timeLabel" style="font-weight: 800; color: #38bdf8; min-width: 48px;">0%</span>
  </footer>

  <script>
    const scenes = ${payloadJson};
    let currentIdx = 0;
    let isPlaying = true;
    let t = 0;

    // Active Reactive State
    const state = {
      sideA: 3,
      sideB: 4,
      magnitude: 5
    };

    const nav = document.getElementById('cartridge-nav');
    const viewport = document.getElementById('stage-viewport');
    const scrubber = document.getElementById('timeScrubber');
    const timeLabel = document.getElementById('timeLabel');
    const playBtn = document.getElementById('playBtn');
    const paramDock = document.getElementById('param-dock');

    // Web Audio Procedural Synthesis
    let audioCtx = null;
    function playClick() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.035);
      } catch(_) {}
    }

    // Render Navigation Tabs
    scenes.forEach((sc, idx) => {
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (idx === 0 ? ' active' : '');
      btn.innerText = sc.title;
      btn.onclick = () => switchScene(idx);
      nav.appendChild(btn);
    });

    function switchScene(idx) {
      playClick();
      currentIdx = idx;
      t = 0;
      document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.className = 'tab-btn' + (i === idx ? ' active' : '');
      });
      renderScene();
    }

    function renderScene() {
      const cur = scenes[currentIdx];
      paramDock.style.display = 'none';
      paramDock.innerHTML = '';

      if (cur.svgMarkup && cur.svgMarkup.includes('<svg')) {
        viewport.innerHTML = cur.svgMarkup;
      } else {
        // Fallback default vector stage
        viewport.innerHTML = \`<svg viewBox="0 0 800 480" width="800" height="480">
          <rect width="800" height="480" fill="#090d16" />
          <text x="400" y="240" fill="#38bdf8" font-size="22" font-weight="900" text-anchor="middle">\${cur.title}</text>
        </svg>\`;
      }

      // Specialized Reactive Manipulative Hooks
      if (cur.id === 'pythagoras') {
        setupPythagorasControls();
      }

      applyReactiveBindings();
    }

    function setupPythagorasControls() {
      paramDock.style.display = 'flex';
      paramDock.innerHTML = \`
        <span style="color:#94a3b8;">Pythagoras Inputs:</span>
        <div class="param-group">
          <label style="color:#34d399;">Leg a:</label>
          <input type="number" id="in-sideA" class="param-input" min="1" max="10" value="\${state.sideA}" onchange="updatePythagoras('a', this.value)">
        </div>
        <div class="param-group">
          <label style="color:#60a5fa;">Leg b:</label>
          <input type="number" id="in-sideB" class="param-input" min="1" max="10" value="\${state.sideB}" onchange="updatePythagoras('b', this.value)">
        </div>
        <div class="param-group" style="margin-left: 8px;">
          <span style="color:#fbbf24;" id="txt-hypotenuse">Hypotenuse c: 5.00 (Area: 25)</span>
        </div>
      \`;

      // Attach handle listeners
      const handleA = document.getElementById('pyth-handle-a');
      const handleB = document.getElementById('pyth-handle-b');
      if (handleA) handleA.onclick = () => updatePythagoras('a', state.sideA >= 8 ? 3 : state.sideA + 1);
      if (handleB) handleB.onclick = () => updatePythagoras('b', state.sideB >= 8 ? 4 : state.sideB + 1);
    }

    window.updatePythagoras = function(leg, val) {
      playClick();
      const num = Math.max(1, Math.min(10, parseInt(val, 10) || 3));
      if (leg === 'a') state.sideA = num;
      if (leg === 'b') state.sideB = num;
      const inA = document.getElementById('in-sideA');
      const inB = document.getElementById('in-sideB');
      if (inA) inA.value = state.sideA;
      if (inB) inB.value = state.sideB;
      renderPythagorasMath();
    };

    function renderPythagorasMath() {
      const a = state.sideA;
      const b = state.sideB;
      const c = Math.sqrt(a * a + b * b);
      const hypLabel = document.getElementById('txt-hypotenuse');
      if (hypLabel) hypLabel.innerText = \`Hypotenuse c: \${c.toFixed(2)} (Area: \${a * a + b * b})\`;

      const rectA = document.getElementById('pyth-rect-a');
      const rectB = document.getElementById('pyth-rect-b');
      const txtA = document.getElementById('pyth-txt-a');
      const txtB = document.getElementById('pyth-txt-b');
      const txtC = document.getElementById('pyth-txt-c');

      const s = 28;
      const originX = 360, originY = 280;

      if (rectA) {
        rectA.setAttribute('x', originX - a * s);
        rectA.setAttribute('y', originY - a * s);
        rectA.setAttribute('width', a * s);
        rectA.setAttribute('height', a * s);
      }
      if (rectB) {
        rectB.setAttribute('x', originX);
        rectB.setAttribute('y', originY);
        rectB.setAttribute('width', b * s);
        rectB.setAttribute('height', b * s);
      }
      if (txtA) {
        txtA.setAttribute('x', originX - (a * s) / 2);
        txtA.setAttribute('y', originY - (a * s) / 2 + 5);
        txtA.textContent = \`a² = \${a * a}\`;
      }
      if (txtB) {
        txtB.setAttribute('x', originX + (b * s) / 2);
        txtB.setAttribute('y', originY + (b * s) / 2 + 5);
        txtB.textContent = \`b² = \${b * b}\`;
      }
      if (txtC) {
        txtC.textContent = \`c² = \${a * a + b * b}\`;
      }

      // Update triangle
      const tri = document.getElementById('pyth-triangle');
      if (tri) {
        tri.setAttribute('points', \`\${originX},\${originY} \${originX + b * s},\${originY} \${originX},\${originY - a * s}\`);
      }
      const handA = document.getElementById('pyth-handle-a');
      const handB = document.getElementById('pyth-handle-b');
      if (handA) {
        const cA = handA.querySelector('circle');
        const tA = handA.querySelector('text');
        if (cA) { cA.setAttribute('cx', originX); cA.setAttribute('cy', originY - a * s); }
        if (tA) { tA.setAttribute('x', originX); tA.setAttribute('y', originY - a * s + 5); }
      }
      if (handB) {
        const cB = handB.querySelector('circle');
        const tB = handB.querySelector('text');
        if (cB) { cB.setAttribute('cx', originX + b * s); cB.setAttribute('cy', originY); }
        if (tB) { tB.setAttribute('x', originX + b * s); tB.setAttribute('y', originY + 5); }
      }
    }

    function applyReactiveBindings() {
      if (scenes[currentIdx]?.id === 'pythagoras') {
        renderPythagorasMath();
      }
    }

    function loop() {
      if (isPlaying) {
        t = (t + 0.3) % 100;
        scrubber.value = t;
        timeLabel.innerText = Math.round(t) + '%';
      }
      requestAnimationFrame(loop);
    }

    function togglePlay() {
      playClick();
      isPlaying = !isPlaying;
      playBtn.innerText = isPlaying ? '⏸️ Pause' : '▶️ Play';
    }

    function scrub(val) {
      t = Number(val);
      playClick();
    }

    renderScene();
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  return (str || '').replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}
