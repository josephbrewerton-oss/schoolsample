/**
 * static/player/ast-registry.js
 *
 * St Joseph's Educational Media Suite - Zero-Bloat AST Scene Registry
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 *
 * Declarative catalog loader for .ast and .svg curriculum scenes.
 * Replaces legacy monolithic ast-scenes.js with on-demand streaming.
 */

(function (global) {
  'use strict';

  const BUILTIN_CATALOG = [
    { id: "algebra-balance", title: "⚖️ Algebraic Balance Scale (2x + 5 = 15)", stage: "KS2/KS3 MATHS", duration: 14, svgFile: "scenes/algebra-balance.svg", astFile: "scenes/algebra-balance.ast" },
    { id: "atom", title: "Atomic Structure: Bohr Electron Shells", stage: "KS3 CHEMISTRY", duration: 12, has3D: true, svgFile: "scenes/atom.svg", astFile: "scenes/atom.ast" },
    { id: "bodmas", title: "BODMAS / BIDMAS: Forcefield Clamping & Area Physics", stage: "KS2/KS3 MATHS", duration: 14, svgFile: "scenes/bodmas.svg", astFile: "scenes/bodmas.ast" },
    { id: "calculus-curves", title: "Calculus: Tangent Slopes & Definite Integrals", stage: "GCSE & A-LEVEL MATHS", duration: 14, svgFile: "scenes/calculus-curves.svg", astFile: "scenes/calculus-curves.ast" },
    { id: "church-tour", title: "Tour of a Catholic Church: Sacred Architecture & Sacred Spaces", stage: "CATHOLIC LIFE", duration: 16, svgFile: "scenes/church-tour.svg", astFile: "scenes/church-tour.ast" },
    { id: "dna-helix", title: "Genetics: DNA Base Pairing & Transcription", stage: "KS3 GENETICS", duration: 12, has3D: true, svgFile: "scenes/dna-helix.svg", astFile: "scenes/dna-helix.ast" },
    { id: "electric-circuits", title: "💡 Electrical Circuits & Ohm's Law (V = I × R)", stage: "KS2/KS3 PHYSICS", duration: 12, svgFile: "scenes/electric-circuits.svg", astFile: "scenes/electric-circuits.ast" },
    { id: "fish-tank", title: "Aquarium Stress Benchmark: Vector Point & FPS Limiter", stage: "BENCHMARK & STRESS LAB", duration: 12, svgFile: "scenes/fish-tank.svg", astFile: "scenes/fish-tank.ast" },
    { id: "fractions", title: "Fractions: Why Common Denominators Rule", stage: "KS2 MATHS", duration: 12, svgFile: "scenes/fractions.svg", astFile: "scenes/fractions.ast" },
    { id: "kinetic-gas", title: "Kinetic Gas Theory & Boyle's Law", stage: "KS3/KS4 PHYSICS & CHEMISTRY", duration: 14, svgFile: "scenes/kinetic-gas.svg", astFile: "scenes/kinetic-gas.ast" },
    { id: "languages", title: "MFL & Polyglot Studio: Spanish, French & Latin", stage: "KS2/KS3 MFL", duration: 15, svgFile: "scenes/languages.svg", astFile: "scenes/languages.ast" },
    { id: "math-fishing", title: "Math Pond: Number Bonds Fishing Game", stage: "KS1/KS2 MATHS", duration: 14, svgFile: "scenes/math-fishing.svg", astFile: "scenes/math-fishing.ast" },
    { id: "mountain-elevation", title: "Mountain Altitude: Elevation, Hypotenuse & Atmospheric Science", stage: "KS2/KS3 MATHS & GEOGRAPHY", duration: 16, svgFile: "scenes/mountain-elevation.svg", astFile: "scenes/mountain-elevation.ast" },
    { id: "phonics-lab", title: "Early Phonics: Sound Buttons & Blending Mat", stage: "EYFS/KS1 ENGLISH", duration: 12, svgFile: "scenes/phonics-lab.svg", astFile: "scenes/phonics-lab.ast" },
    { id: "photosynthesis", title: "Photosynthesis: The Green Solar Engine", stage: "KS3 BIOLOGY", duration: 10, svgFile: "scenes/photosynthesis.svg", astFile: "scenes/photosynthesis.ast" },
    { id: "pythagoras", title: "Pythagoras Theorem: Area Conservation", stage: "KS3 GEOMETRY", duration: 11, svgFile: "scenes/pythagoras.svg", astFile: "scenes/pythagoras.ast" },
    { id: "shakespeare", title: "The Globe Theatre: Shakespeare & Iambic Pentameter", stage: "KS3/KS4 ENGLISH LITERATURE", duration: 15, svgFile: "scenes/shakespeare.svg", astFile: "scenes/shakespeare.ast" },
    { id: "solar-system", title: "Solar System: Heliocentric Planetary Motion", stage: "KS3 SCIENCE", duration: 14, has3D: true, svgFile: "scenes/solar-system.svg", astFile: "scenes/solar-system.ast" },
    { id: "times-tables", title: "Times Tables: 2D Array & Distributive Splitter", stage: "KS1/KS2 MATHS", duration: 14, svgFile: "scenes/times-tables.svg", astFile: "scenes/times-tables.ast" },
    { id: "velocity", title: "Kinematics: Velocity & Distance-Time Vectors", stage: "KS3 PHYSICS", duration: 10, svgFile: "scenes/velocity.svg", astFile: "scenes/velocity.ast" },
    { id: "water-cycle", title: "Water Cycle: Continuous Earth Cycle", stage: "KS2 GEOGRAPHY", duration: 10, svgFile: "scenes/water-cycle.svg", astFile: "scenes/water-cycle.ast" }
  ];

  const scenes = {};
  BUILTIN_CATALOG.forEach(s => { scenes[s.id] = s; });

  // Embedded Zero-Network Fallback for Core Cartridges (guarantees 100% determinism on GitHub Pages)
  const EMBEDDED_FALLBACKS = {
    pythagoras: {
      id: 'pythagoras',
      title: "Pythagoras' Theorem (a² + b² = c²)",
      stage: 'KS3 GEOMETRY',
      duration: 11.0,
      svgMarkup: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pyth-bg-glow" cx="50%" cy="55%" r="70%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="pyth-grad-a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.7" />
    </linearGradient>
    <linearGradient id="pyth-grad-b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.7" />
    </linearGradient>
    <linearGradient id="pyth-grad-c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.7" />
    </linearGradient>
    <filter id="pyth-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="800" height="480" fill="url(#pyth-bg-glow)" />
  <g transform="translate(180, 20)">
    <rect width="440" height="44" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="220" y="28" fill="#f8fafc" font-size="16" font-weight="800" text-anchor="middle">
      <tspan fill="#34d399">a² (9)</tspan> + <tspan fill="#60a5fa">b² (16)</tspan> = <tspan fill="#fbbf24">c² (25)</tspan> ➔ 3² + 4² = 5²
    </text>
  </g>
  <g id="pyth-group-a">
    <rect id="pyth-rect-a" x="360" y="190" width="0" height="90" fill="url(#pyth-grad-a)" stroke="#10b981" stroke-width="2" rx="4" data-draggable="pyth-handle-a" style="cursor:ns-resize;" />
    <g id="pyth-grid-a" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
    <text id="pyth-txt-a" x="315" y="240" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle" opacity="1" filter="url(#pyth-glow)" pointer-events="none">a² = 9</text>
  </g>
  <g id="pyth-group-b">
    <rect id="pyth-rect-b" x="360" y="280" width="120" height="0" fill="url(#pyth-grad-b)" stroke="#3b82f6" stroke-width="2" rx="4" data-draggable="pyth-handle-b" style="cursor:ew-resize;" />
    <g id="pyth-grid-b" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
    <text id="pyth-txt-b" x="420" y="345" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle" opacity="1" filter="url(#pyth-glow)" pointer-events="none">b² = 16</text>
  </g>
  <g id="pyth-group-c">
    <g id="pyth-rot-c" transform="translate(360, 190) rotate(-36.87)">
      <rect id="pyth-rect-c" x="0" y="-150" width="150" height="150" fill="url(#pyth-grad-c)" stroke="#f59e0b" stroke-width="2" rx="4" />
      <g id="pyth-grid-c" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
      <text id="pyth-txt-c" x="75" y="-70" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle" filter="url(#pyth-glow)" pointer-events="none">c² = 25</text>
    </g>
  </g>
  <polygon id="pyth-triangle" points="360,280 480,280 360,190" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round" />
  <rect id="pyth-right-angle" x="360" y="262" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="2" />
  <g id="pyth-handle-a" data-draggable="pyth-handle-a" style="cursor:ns-resize;">
    <circle cx="360" cy="190" r="14" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#pyth-glow)" />
    <text x="360" y="195" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" pointer-events="none">a</text>
  </g>
  <g id="pyth-handle-b" data-draggable="pyth-handle-b" style="cursor:ew-resize;">
    <circle cx="480" cy="280" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="3" filter="url(#pyth-glow)" />
    <text x="480" y="285" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" pointer-events="none">b</text>
  </g>
</svg>`,
      astSource: `(:scene :id "pythagoras" :title "Pythagoras Theorem: Area Conservation" :stage "KS3 GEOMETRY" :duration 11.0
  (:vars (
    (:var :name "sideA" :val 3 :min 1 :max 8 :step 1 :unit "units" :label "Leg a")
    (:var :name "sideB" :val 4 :min 1 :max 8 :step 1 :unit "units" :label "Leg b")
  ))
  (:inputs (
    (:number :var "sideA" :label "Triangle Leg a" :min 1 :max 10 :step 1)
    (:number :var "sideB" :label "Triangle Leg b" :min 1 :max 10 :step 1)
  ))
  (:computed (
    (:name "hypotenuse" :expr "Math.sqrt(vars.sideA * vars.sideA + vars.sideB * vars.sideB).toFixed(2)")
    (:name "areaA" :expr "vars.sideA * vars.sideA")
    (:name "areaB" :expr "vars.sideB * vars.sideB")
    (:name "areaC" :expr "vars.sideA * vars.sideA + vars.sideB * vars.sideB")
  ))
  (:gestures (
    (:draggable :target "#pyth-handle-a" :axis "y" :min 100 :max 250)
    (:draggable :target "#pyth-handle-b" :axis "x" :min 380 :max 640)
    (:draggable :target "#pyth-rect-a" :axis "y" :min 100 :max 250)
    (:draggable :target "#pyth-rect-b" :axis "x" :min 380 :max 640)
  ))
  (:subtitles (
    (:start 0.00 :end 0.35 :en "Drag the handles, pans, or type your own figures for leg a and leg b." :es "Arrastra los controles o introduce tus propios números para los catetos a y b.")
    (:start 0.35 :end 0.70 :en "Observe area conservation: square a² (emerald) plus square b² (sapphire) always equals square c² (amber)." :es "Observa la conservación de área: el cuadrado a² más el cuadrado b² siempre es igual a c².")
    (:start 0.70 :end 1.00 :en "a² + b² = c². The total number of unit tiles is strictly conserved for all right triangles." :es "a² + b² = c². El número total de baldosas unitarias se conserva estrictamente.")
  ))
  (:keyframes (
    (:t 0.00 :title "Interactive Manipulative" :rule "Drag handles or enter custom figures to test Pythagorean triples")
    (:t 0.35 :title "Area Conservation" :rule "Square of side a has area a²; square of side b has area b²")
    (:t 0.70 :title "Vector Area Sum" :rule "Total square units: a² + b² = c²")
    (:t 1.00 :title "Hypotenuse Square c²" :rule "c = √(a² + b²) preserved across continuous geometry")
  ))
  (:bindings (
    (:target "#pyth-txt-a" :attr "opacity" :expr "1")
    (:target "#pyth-txt-b" :attr "opacity" :expr "1")
    (:target "#pyth-txt-c" :attr "opacity" :expr "1")
  ))
)`
    }
  };

  const SceneRegistry = {
    register(id, scene) {
      if (!id) return;
      const norm = this.normalizeId(id);
      scenes[norm] = Object.assign({ id: norm }, scene);
      if (norm !== id) scenes[id] = scenes[norm];
      return scenes[norm];
    },

    get(id) {
      if (!id) return null;
      const norm = this.normalizeId(id);
      if (scenes[norm]) return scenes[norm];
      if (scenes[id]) return scenes[id];

      // Check decentralized localStorage for custom or imported PhET cartridges
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem('stj_custom_cartridges_v1');
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const found = list.find(c => c && (c.id === norm || c.id === id));
              if (found) {
                return this.register(found.id, {
                  id: found.id,
                  title: found.title || found.id,
                  stage: found.stage || 'CUSTOM CARTRIDGE',
                  duration: found.duration || 12.0,
                  svgMarkup: found.svgMarkup || found.svgText,
                  svgText: found.svgMarkup || found.svgText,
                  astSource: found.astSource || found.astText,
                  astText: found.astSource || found.astText,
                });
              }
            }
          }
        } catch (_) {}
      }

      // Check embedded fallbacks (e.g. pythagoras on GitHub Pages)
      if (EMBEDDED_FALLBACKS[norm]) {
        return this.register(norm, EMBEDDED_FALLBACKS[norm]);
      }

      return null;
    },

    getScene(id) {
      return this.get(id);
    },

    has(id) {
      if (!id) return false;
      const norm = this.normalizeId(id);
      return Boolean(scenes[norm] || scenes[id] || EMBEDDED_FALLBACKS[norm]);
    },

    list() {
      const seen = new Set();
      const result = [];
      Object.keys(scenes).forEach(k => {
        const s = scenes[k];
        if (s && s.id && !seen.has(s.id)) {
          seen.add(s.id);
          result.push({
            id: s.id,
            title: s.title || s.id,
            stage: s.stage || 'CURRICULUM',
            duration: s.duration || 14.0,
            has3D: Boolean(s.has3D),
            svgFile: s.svgFile || `scenes/${s.id}.svg`,
            astFile: s.astFile || `scenes/${s.id}.ast`,
            keyframeCount: s.keyframeCount || (s.keyframes ? s.keyframes.length : 0),
            subtitleCount: s.subtitleCount || (s.subtitles ? s.subtitles.length : 0)
          });
        }
      });
      return result;
    },

    normalizeId(id) {
      if (!id || typeof id !== 'string') return '';
      const clean = id.toLowerCase().trim()
        .replace(/^(demo-|scene-|preset-)/, '')
        .replace(/\.(ast|svg|json)$/, '');
      const aliases = {
        'pythagorus': 'pythagoras',
        'pythagoras-theorem': 'pythagoras',
        'pythagoras-proof': 'pythagoras',
        'ohms-law': 'electric-circuits',
        'phet-ohms-law': 'electric-circuits',
        'circuits': 'electric-circuits',
        'circuit': 'electric-circuits',
        'gas': 'kinetic-gas',
        'boyles-law': 'kinetic-gas',
        'curves': 'calculus-curves',
        'calculus': 'calculus-curves',
        'aquarium': 'fish-tank',
        'fish': 'fish-tank',
        'fishing': 'math-fishing',
        'mountain': 'mountain-elevation',
        'climber': 'mountain-elevation',
        'photosynth': 'photosynthesis',
        'leaf': 'photosynthesis',
        'stars': 'solar-system',
        'space': 'solar-system'
      };
      return aliases[clean] || clean;
    },

    parseAstMetadata(content, id) {
      if (!content || typeof content !== 'string') return null;
      const titleMatch = content.match(/:title\s+"([^"]+)"/i);
      const stageMatch = content.match(/:stage\s+"([^"]+)"/i);
      const durationMatch = content.match(/:duration\s+([\d\.]+)/i);
      const keyframeCount = (content.match(/\(:t\s+[\d\.]+/gi) || []).length;
      const subtitleCount = (content.match(/\(:start\s+[\d\.]+/gi) || []).length;
      const has3D = content.includes(':3d-') || content.includes(':camera');

      return {
        id: id || 'custom-scene',
        title: titleMatch ? titleMatch[1] : (id || 'Custom Scene'),
        stage: stageMatch ? stageMatch[1] : 'CURRICULUM',
        duration: durationMatch ? parseFloat(durationMatch[1]) : 14.0,
        has3D: Boolean(has3D),
        keyframeCount,
        subtitleCount,
        svgFile: `scenes/${id}.svg`,
        astFile: `scenes/${id}.ast`
      };
    },

    registerFromAstText(id, content) {
      const meta = this.parseAstMetadata(content, id);
      if (meta) {
        return this.register(id, meta);
      }
      return null;
    },

    /**
     * Auto-Finds available scenes dynamically without requiring teachers to edit index files:
     * 1. Probes live dynamic API (/api/scenes or /player/api/scenes)
     * 2. Scrapes HTML directory index (e.g. static server directory listing)
     * 3. Falls back to pre-compiled manifest
     */
    async autoDiscover(basePath = './') {
      if (Object.keys(scenes).length >= 20) {
        return { totalScenes: Object.keys(scenes).length, scenes: SceneRegistry.list() };
      }
      const currentDir = (typeof window !== 'undefined' && window.location && window.location.pathname)
        ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)
        : './';
      const base = (basePath || currentDir || './').replace(/\/?$/, '/');

      // 1. Try Live Dynamic Discovery Endpoints (Vite / Dev / API Server)
      const dynamicUrls = ['/api/scenes', '/player/api/scenes', `${base}api/scenes`];
      for (const endpoint of dynamicUrls) {
        try {
          const res = await fetch(endpoint).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.scenes) && data.scenes.length > 0) {
              data.scenes.forEach(sc => {
                if (sc && sc.id) SceneRegistry.register(sc.id, sc);
              });
              return data;
            }
          }
        } catch (_) {}
      }

      // 2. Try HTML directory index probe on scenes/ (Nginx autoindex, Python http.server, Apache)
      try {
        const scenesIndexRes = await fetch(`${base}scenes/`).catch(() => null);
        if (scenesIndexRes && scenesIndexRes.ok) {
          const html = await scenesIndexRes.text();
          const hrefRegex = /href=["']([^"']+\.ast)["']/gi;
          let match;
          let discovered = 0;
          while ((match = hrefRegex.exec(html)) !== null) {
            const rawFile = match[1].split('/').pop();
            const id = rawFile.replace('.ast', '');
            if (id && !SceneRegistry.has(id)) {
              SceneRegistry.register(id, {
                id,
                title: id.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                stage: 'CURRICULUM',
                duration: 14.0,
                svgFile: `scenes/${id}.svg`,
                astFile: `scenes/${id}.ast`
              });
              discovered++;
            }
          }
          if (discovered > 0) {
            return { totalScenes: Object.keys(scenes).length, scenes: SceneRegistry.list() };
          }
        }
      } catch (_) {}

      // 3. Fallback: Load static configuration manifest with resilient fallback cascade
      const candidateUrls = [
        './scenes.manifest.json',
        './scenes-config.json',
        `${currentDir}scenes.manifest.json`,
        `${currentDir}scenes-config.json`,
        `${base}player/scenes.manifest.json`,
        `${base}player/scenes-config.json`,
        `${base}scenes.manifest.json`,
        `${base}scenes-config.json`,
        '/player/scenes.manifest.json',
        '/player/scenes-config.json',
        '/scenes.manifest.json',
        '/scenes-config.json'
      ];

      for (const url of candidateUrls) {
        const manifestRes = await this.loadConfig(url);
        if (manifestRes) return manifestRes;
      }

      return { totalScenes: Object.keys(scenes).length, scenes: SceneRegistry.list() };
    },

    async loadConfig(url = './scenes.manifest.json') {
      try {
        const res = await fetch(url).catch(() => null);
        if (!res || !res.ok) return null;

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) return null;

        const text = await res.text();
        const trimmed = (text || '').trim();
        if (!trimmed || trimmed.startsWith('<') || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
          return null; // Reject SPA HTML fallbacks
        }

        const config = JSON.parse(trimmed);
        if (config && Array.isArray(config.scenes) && config.scenes.length > 0) {
          config.scenes.forEach(sc => {
            if (sc && sc.id) {
              SceneRegistry.register(sc.id, sc);
            }
          });
          return config;
        }
        return null;
      } catch (err) {
        return null;
      }
    }
  };

  global.ASTScenes = scenes;
  global.ASTSceneRegistry = SceneRegistry;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scenes, SceneRegistry };
  }
})(typeof window !== 'undefined' ? window : globalThis);
