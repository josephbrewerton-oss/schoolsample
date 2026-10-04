/**
 * static/player/ast-scenes.js
 * 
 * AST-Guided Curriculum Scene Definitions & Scene Registry
 * Standalone, zero-dependency, 60 FPS budget.
 * Supports:
 * 1. mount(container): Builds initial SVG DOM tree once and caches element references.
 * 2. update(t, elements): Patches SVG element attributes directly (no innerHTML destruction).
 * 3. render(t): Pure SVG string output for headless/fallback usage.
 * 4. loadConfig(): Dynamic loading of scenes-config.json with .svg and .ast drivers.
 */

(function (global) {
  'use strict';

  const scenes = {
    'fractions': {
      id: 'fractions',
      stage: 'KS2 MATHS',
      title: 'Fractions: Why Common Denominators Rule',
      duration: 12.0,
      svgFile: 'scenes/fractions.svg',
      astFile: 'scenes/fractions.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: Unequal Slices', rule: 'You cannot count slices of different sizes (1/2 + 1/4)!' },
        { t: 0.35, title: 'Step 2: The Equivalence Cut', rule: 'Cut 1/2 in half: (1×2)/(2×2) = 2/4. Same area, new denominator!' },
        { t: 0.70, title: 'Step 3: Vector Fusion', rule: 'Keep denominator 4 and add numerators: 2/4 + 1/4 = 3/4.' },
        { t: 1.00, title: 'Step 4: Solved Proof', rule: '3/4 of the whole! Remember: NEVER add denominators (not 2/6).' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Look at 1/2 and 1/4: they are completely different sizes! We cannot count them yet.", es: "Mira 1/2 y 1/4: ¡tienen tamaños diferentes! No podemos sumarlas todavía." },
        { start: 0.35, end: 0.70, en: "Watch the laser slice cut 1/2 into two equal quarters (2/4). The area stays the exact same!", es: "Mira cómo la línea corta 1/2 en dos cuartos (2/4). ¡El área es exactamente igual!" },
        { start: 0.70, end: 1.00, en: "Now they share a common denominator! 2 quarters + 1 quarter equals exactly 3 quarters.", es: "¡Ahora comparten el mismo denominador! 2 cuartos + 1 cuarto son 3 cuartos." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.32,
            title: 'Equivalence Cut Challenge',
            prompt: 'Why must we cut the 1/2 slice before adding it to 1/4?',
            options: [
              'Because fractions cannot be added unless they share the same denominator (slice size)',
              'Because the total area becomes bigger when sliced',
              'Because 1 + 1 always equals 2'
            ],
            answer: 0,
            explanation: 'You cannot count slices of different unit sizes. Cutting 1/2 into two 1/4 slices gives a common denominator of 4 without changing total area.'
          },
          {
            t: 0.88,
            title: 'Common Denominator Addition',
            prompt: 'What is 2/4 + 1/4?',
            options: [
              '3/8 (add numerators and denominators)',
              '3/4 (keep the common denominator, add the numerators)',
              '2/4 (the fraction stays the same)'
            ],
            answer: 1,
            explanation: 'When adding fractions with a common denominator, KEEP the denominator (4) and ADD the numerators (2 + 1 = 3). NEVER add denominators!'
          }
        ]
      },
      mount(container) {
        const cx = 400, cy = 240, r = 140;
        container.innerHTML = `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6 6" />
          <path id="frac-slice1" d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="#3b82f6" fill-opacity="0.8" stroke="#60a5fa" stroke-width="3" />
          <text id="frac-slice1-txt" x="${cx + 60}" y="${cy + 8}" fill="#ffffff" font-size="24" font-weight="bold" text-anchor="middle">1/2</text>
          <path id="frac-qa" d="" fill="#2563eb" stroke="#93c5fd" stroke-width="2" style="display:none;" />
          <text id="frac-qa-txt" x="${cx + 50}" y="${cy - 40}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle" style="display:none;">1/4</text>
          <path id="frac-qb" d="" fill="#3b82f6" stroke="#93c5fd" stroke-width="2" style="display:none;" />
          <text id="frac-qb-txt" x="${cx + 50}" y="${cy + 55}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle" style="display:none;">1/4</text>
          <line id="frac-laser-line" x1="${cx - 10}" y1="${cy}" x2="${cx}" y2="${cy}" stroke="#f43f5e" stroke-width="4" filter="url(#glow)" style="display:none;" />
          <circle id="frac-laser-dot" cx="${cx}" cy="${cy}" r="6" fill="#ffe4e6" style="display:none;" />
          <path id="frac-qgreen" d="" fill="#10b981" fill-opacity="0.85" stroke="#34d399" stroke-width="3" />
          <text id="frac-qgreen-txt" x="${cx - 235}" y="${cy - 45}" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">1/4</text>
          <rect x="250" y="24" width="300" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
          <text id="frac-math-txt" x="400" y="51" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">1/2 + 1/4 = ?</text>
        `;
        return {
          slice1: container.querySelector('#frac-slice1'),
          slice1Txt: container.querySelector('#frac-slice1-txt'),
          qa: container.querySelector('#frac-qa'),
          qaTxt: container.querySelector('#frac-qa-txt'),
          qb: container.querySelector('#frac-qb'),
          qbTxt: container.querySelector('#frac-qb-txt'),
          laserLine: container.querySelector('#frac-laser-line'),
          laserDot: container.querySelector('#frac-laser-dot'),
          qgreen: container.querySelector('#frac-qgreen'),
          qgreenTxt: container.querySelector('#frac-qgreen-txt'),
          mathTxt: container.querySelector('#frac-math-txt'),
        };
      },
      update(t, el) {
        if (!el || !el.slice1) return;
        const cx = 400, cy = 240, r = 140;
        const sliceProgress = Math.min(1, Math.max(0, (t - 0.35) / 0.35));
        const mergeProgress = Math.min(1, Math.max(0, (t - 0.7) / 0.3));

        if (sliceProgress < 0.05) {
          el.slice1.style.display = 'inline';
          el.slice1Txt.style.display = 'inline';
          el.slice1.setAttribute('d', `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`);
          el.qa.style.display = 'none';
          el.qaTxt.style.display = 'none';
          el.qb.style.display = 'none';
          el.qbTxt.style.display = 'none';
          el.laserLine.style.display = 'none';
          el.laserDot.style.display = 'none';
        } else {
          el.slice1.style.display = 'none';
          el.slice1Txt.style.display = 'none';
          el.qa.style.display = 'inline';
          el.qaTxt.style.display = 'inline';
          el.qb.style.display = 'inline';
          el.qbTxt.style.display = 'inline';

          const cutGap = sliceProgress * 6;
          el.qa.setAttribute('d', `M ${cx} ${cy - r - cutGap/2} A ${r} ${r} 0 0 1 ${cx + r} ${cy - cutGap/2} L ${cx} ${cy - cutGap/2} Z`);
          el.qaTxt.setAttribute('y', `${cy - 40 - cutGap/2}`);

          el.qb.setAttribute('d', `M ${cx} ${cy + cutGap/2} L ${cx + r} ${cy + cutGap/2} A ${r} ${r} 0 0 1 ${cx} ${cy + r + cutGap/2} Z`);
          el.qbTxt.setAttribute('y', `${cy + 55 + cutGap/2}`);

          if (sliceProgress > 0 && sliceProgress < 0.95) {
            const bladeX = cx + sliceProgress * r;
            el.laserLine.style.display = 'inline';
            el.laserDot.style.display = 'inline';
            el.laserLine.setAttribute('x2', bladeX.toFixed(1));
            el.laserDot.setAttribute('cx', bladeX.toFixed(1));
          } else {
            el.laserLine.style.display = 'none';
            el.laserDot.style.display = 'none';
          }
        }

        const quarterStartX = cx - 180;
        const quarterEndX = cx;
        const quarterCurX = quarterStartX + mergeProgress * (quarterEndX - quarterStartX);
        el.qgreen.setAttribute('d', `M ${quarterCurX.toFixed(1)} ${cy} L ${(quarterCurX - r).toFixed(1)} ${cy} A ${r} ${r} 0 0 1 ${quarterCurX.toFixed(1)} ${cy - r} Z`);
        el.qgreenTxt.setAttribute('x', `${(quarterCurX - 55).toFixed(1)}`);

        let mathString = "1/2 + 1/4 = ?";
        if (t >= 0.35 && t < 0.70) mathString = "(1×2)/(2×2) + 1/4 = 2/4 + 1/4";
        if (t >= 0.70) mathString = "2/4 + 1/4 = 3/4 (Solved!)";
        el.mathTxt.textContent = mathString;
      },
      render(t) {
        const cx = 400, cy = 240, r = 140;
        let svg = '';
        svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6 6" />`;
        const sliceProgress = Math.min(1, Math.max(0, (t - 0.35) / 0.35));
        const mergeProgress = Math.min(1, Math.max(0, (t - 0.7) / 0.3));

        if (sliceProgress < 0.05) {
          svg += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="#3b82f6" fill-opacity="0.8" stroke="#60a5fa" stroke-width="3" />`;
          svg += `<text x="${cx + 60}" y="${cy + 8}" fill="#ffffff" font-size="24" font-weight="bold" text-anchor="middle">1/2</text>`;
        } else {
          const cutGap = sliceProgress * 6;
          svg += `<path d="M ${cx} ${cy - r - cutGap/2} A ${r} ${r} 0 0 1 ${cx + r} ${cy - cutGap/2} L ${cx} ${cy - cutGap/2} Z" fill="#2563eb" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<text x="${cx + 50}" y="${cy - 40 - cutGap/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">1/4</text>`;
          svg += `<path d="M ${cx} ${cy + cutGap/2} L ${cx + r} ${cy + cutGap/2} A ${r} ${r} 0 0 1 ${cx} ${cy + r + cutGap/2} Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<text x="${cx + 50}" y="${cy + 55 + cutGap/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">1/4</text>`;
          if (sliceProgress > 0 && sliceProgress < 0.95) {
            const bladeX = cx + sliceProgress * r;
            svg += `<line x1="${cx - 10}" y1="${cy}" x2="${bladeX}" y2="${cy}" stroke="#f43f5e" stroke-width="4" filter="url(#glow)" />`;
            svg += `<circle cx="${bladeX}" cy="${cy}" r="6" fill="#ffe4e6" />`;
          }
        }

        const quarterStartX = cx - 180;
        const quarterEndX = cx;
        const quarterCurX = quarterStartX + mergeProgress * (quarterEndX - quarterStartX);
        svg += `<path d="M ${quarterCurX} ${cy} L ${quarterCurX - r} ${cy} A ${r} ${r} 0 0 1 ${quarterCurX} ${cy - r} Z" fill="#10b981" fill-opacity="0.85" stroke="#34d399" stroke-width="3" />`;
        svg += `<text x="${quarterCurX - 55}" y="${cy - 45}" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">1/4</text>`;

        let mathString = "1/2 + 1/4 = ?";
        if (t >= 0.35 && t < 0.70) mathString = "(1×2)/(2×2) + 1/4 = 2/4 + 1/4";
        if (t >= 0.70) mathString = "2/4 + 1/4 = 3/4 (Solved!)";
        svg += `<rect x="250" y="24" width="300" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />`;
        svg += `<text x="400" y="51" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">${mathString}</text>`;
        return svg;
      }
    },

    'bodmas': {
      id: 'bodmas',
      stage: 'KS2/KS3 MATHS',
      title: 'BODMAS / BIDMAS: Forcefield Clamping & Area Physics',
      duration: 14.0,
      svgFile: 'scenes/bodmas.svg',
      astFile: 'scenes/bodmas.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: The Equation', rule: 'Analyze 5 + 3 × 4: Identify loose units versus grouped area multiplication.' },
        { t: 0.35, title: 'Step 2: Magnetic Clamping', rule: '3 × 4 binds into an unbroken 2D rectangular array of 12 tiles.' },
        { t: 0.65, title: 'Step 3: The Left-to-Right Trap', rule: '5 + 3 = 8 ➔ 8 × 4 = 32 is FALSE. It destroys the area model and invents 20 extra tiles.' },
        { t: 0.85, title: 'Step 4: Vector Addition', rule: 'Evaluate clamp: 3 × 4 = 12. Combine 5 loose coins + 12 tiles = 17.' },
        { t: 1.00, title: 'Step 5: Verified Proof', rule: '5 + 3 × 4 = 17. Q.E.D. Order of Operations mastered.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Look at 5 + 3 × 4. Many students make the classic mistake of adding 5 + 3 first. But watch what happens in physical geometry!", es: "Mira 5 + 3 × 4. Muchos cometen el error de sumar 5 + 3 primero. ¡Pero mira qué sucede en la geometría física!" },
        { start: 0.35, end: 0.70, en: "Multiplication creates a solid 3 by 4 rectangular array of 12 tiles! If you add 5 + 3 to get 8, you turn 3 groups into 8 groups, inventing 20 extra tiles from nothing!", es: "¡La multiplicación crea un bloque rectangular de 3 por 4 con 12 baldosas! ¡Si sumas 5 + 3 para hacer 8, inventas 20 baldosas de la nada!" },
        { start: 0.70, end: 1.00, en: "The high-voltage multiplication clamp evaluates first: 3 × 4 = 12. Then we add the 5 loose coins: 5 + 12 = 17! Solved correctly.", es: "La multiplicación se calcula primero: 3 × 4 = 12. Luego sumamos las 5 monedas sueltas: 5 + 12 = 17. ¡Resuelto correctamente!" }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.40,
            title: 'BODMAS Area Model Check',
            prompt: 'Why must 3 × 4 be calculated before adding 5?',
            options: [
              'Because 3 × 4 forms a solid 2D rectangular array of 12 tiles that cannot be broken by loose units',
              'Because multiplication is harder so we do it first',
              'Because 5 + 3 always equals 32'
            ],
            answer: 0,
            explanation: 'Multiplication represents geometric grouping (3 rows of 4). Adding 5 first would turn 3 groups into 8 groups, inventing 20 non-existent tiles!'
          }
        ]
      }
    },

    'times-tables': {
      id: 'times-tables',
      stage: 'KS1/KS2 MATHS',
      title: 'Times Tables: 2D Array & Distributive Splitter',
      duration: 14.0,
      svgFile: 'scenes/times-tables.svg',
      astFile: 'scenes/times-tables.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: The 7×8 Array', rule: 'A 2D matrix of 7 rows by 8 columns representing 56 total area units.' },
        { t: 0.35, title: 'Step 2: The Distributive Cut', rule: 'Decompose 8 into friendly chunks: 8 = 5 + 3.' },
        { t: 0.55, title: 'Step 3: Friendly 5s', rule: 'Evaluate the first block: 7 × 5 = 35 emerald units.' },
        { t: 0.75, title: 'Step 4: Remaining 3s', rule: 'Evaluate the second block: 7 × 3 = 21 amber units.' },
        { t: 1.00, title: 'Step 5: Mental Addition', rule: 'Combine: 35 + 21 = 56. 7 × 8 = 56 Q.E.D.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Memorizing times tables like 7 × 8 can feel intimidating. But you never need to panic when you understand the Distributive Property!", es: "Memorizar tablas de multiplicar como 7 × 8 puede dar miedo. ¡Pero nunca debes asustarte si comprendes la propiedad distributiva!" },
        { start: 0.35, end: 0.70, en: "Watch the splitter cut 8 columns into friendly chunks: 5 columns and 3 columns. 7 × 5 is easy: 35! And 7 × 3 is 21.", es: "Mira cómo la línea divide 8 columnas en partes fáciles: 5 columnas y 3 columnas. 7 × 5 es fácil: ¡35! Y 7 × 3 es 21." },
        { start: 0.70, end: 1.00, en: "Now simply combine the green and amber areas: 35 + 21 = 56! Any tricky table can be conquered using 5s and 2s.", es: "¡Ahora solo suma las áreas verde y ámbar: 35 + 21 = 56! Cualquier tabla difícil se resuelve usando 5 y 2." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.50,
            title: 'Distributive Decomposition',
            prompt: 'How can you mentally solve 7 × 8 without panic?',
            options: [
              'Split 8 into (5 + 3) to calculate (7 × 5 = 35) + (7 × 3 = 21) = 56',
              'Guess between 50 and 60',
              'Only calculate the odd numbers'
            ],
            answer: 0,
            explanation: 'The distributive property lets you split any difficult factor into friendly numbers like 5 and 2. 35 + 21 = 56!'
          }
        ]
      }
    },

    'phonics-lab': {
      id: 'phonics-lab',
      stage: 'EYFS/KS1 ENGLISH',
      title: 'Early Phonics: Sound Buttons & Blending Mat',
      duration: 12.0,
      svgFile: 'scenes/phonics-lab.svg',
      astFile: 'scenes/phonics-lab.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: Sound Buttons', rule: 'Place a dot under single letters (c, a, t) to isolate pure phonemes.' },
        { t: 0.25, title: 'Step 2: First Sound /k/', rule: 'Pronounce pure unvoiced /k/ — do not say "cuh".' },
        { t: 0.50, title: 'Step 3: Middle Vowel /æ/', rule: 'Short open vowel /a/ as in apple.' },
        { t: 0.75, title: 'Step 4: End Sound /t/', rule: 'Crisp unvoiced /t/ — do not say "tuh".' },
        { t: 1.00, title: 'Step 5: Blending Sweep', rule: 'Sweep across the arrow: /k/ - /a/ - /t/ ➔ "cat"!' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "In primary school, we read words using Sound Buttons! Under single sounds, we put a dot. Listen to the pure sounds: /k/ ... /a/ ... /t/.", es: "¡En la escuela primaria, leemos palabras con botones de sonido! Ponemos un punto bajo cada sonido puro: /k/ ... /a/ ... /t/." },
        { start: 0.35, end: 0.70, en: "Never add 'uh' at the end: say crisp /k/, not 'kuh'! Now sweep your finger along the arrow to blend the sounds together.", es: "¡Nunca agregues 'uh' al final: di /k/ nítido, no 'cuh'! Ahora desliza el dedo a lo largo de la flecha para unir los sonidos." },
        { start: 0.70, end: 1.00, en: "/k/ ... /a/ ... /t/ blends into 'cat'! 🐱 And remember: tricky words like 'said' have parts that cannot be sounded out.", es: "¡/k/ ... /a/ ... /t/ se une en 'cat' (gato)! Y recuerda: las palabras difíciles como 'said' tienen letras que no siguen la regla usual." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.30,
            title: 'Pure Phoneme Articulation',
            prompt: 'Why must we avoid saying "cuh" and instead say a crisp /k/?',
            options: [
              'Because adding "uh" (schwa) makes blending into words like "cat" impossible',
              'Because loud sounds are forbidden',
              'Because letters must always be whispered'
            ],
            answer: 0,
            explanation: 'Adding the schwa vowel ("cuh-a-tuh") results in "cuhatuh" instead of "cat". Pure sounds ensure clean blending.'
          }
        ]
      }
    },

    'solar-system': {
      id: 'solar-system',
      stage: 'KS3 SCIENCE',
      title: 'Solar System: Heliocentric Planetary Motion',
      duration: 14.0,
      has3D: true,
      svgFile: 'scenes/solar-system.svg',
      astFile: 'scenes/solar-system.ast',
      keyframes: [
        { t: 0.00, title: 'Heliocentric Sun', rule: 'The Sun sits at the focal center, providing gravitational attraction.' },
        { t: 0.33, title: 'Planetary Orbits', rule: 'Inner planets orbit faster than outer planets (Kepler\'s 3rd Law).' },
        { t: 0.66, title: 'Earth Axial Tilt', rule: 'Earth\'s 23.5° tilt causes seasonal changes, not distance from the Sun!' },
        { t: 1.00, title: 'Harmonic Alignment', rule: 'Deterministic orbital resonance across the solar system.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.33, en: "At the center sits our Sun. Watch how Mercury speeds around much faster than Earth.", es: "En el centro se encuentra el Sol. Observa cómo Mercurio gira mucho más rápido que la Tierra." },
        { start: 0.33, end: 0.66, en: "Kepler's Law: The closer a planet is to the Sun, the faster it travels in its orbit.", es: "Ley de Kepler: Cuanto más cerca está un planeta del Sol, más rápido orbita." },
        { start: 0.66, end: 1.00, en: "Earth completes 1 orbit per year with a 23.5° axial tilt creating our seasons.", es: "La Tierra completa una órbita al año con una inclinación de 23.5° que crea las estaciones." }
      ],
      mount(container) {
        const cx = 400, cy = 230;
        let simTimeYears = 0;
        let speedMultiplier = 1.0;
        let isPaused = false;
        let showOrbits = true;
        let showLabels = true;

        const defaultPlanets = [
          { id: 'mercury', name: 'Mercury', r: 5, orbR: 65, baseSpeed: 4.15, col: '#cbd5e1', symbol: '☿' },
          { id: 'venus',   name: 'Venus',   r: 8, orbR: 105, baseSpeed: 1.62, col: '#fde047', symbol: '♀' },
          { id: 'earth',   name: 'Earth',   r: 9, orbR: 155, baseSpeed: 1.00, col: '#38bdf8', symbol: '♁' },
          { id: 'mars',    name: 'Mars',    r: 6, orbR: 205, baseSpeed: 0.53, col: '#ef4444', symbol: '♂' }
        ];

        let html = `
          <svg id="sol-interactive-svg" viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#050811; user-select:none; touch-action:none;">
            <defs>
              <radialGradient id="sol-sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
                <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#ea580c" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="sol-earth-atm" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#93c5fd"/>
                <stop offset="40%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#1e3a8a"/>
              </radialGradient>
            </defs>

            <!-- Starfield -->
            <g id="sol-starfield-group">`;

        for (let i = 0; i < 55; i++) {
          const sx = (i * 127 + 31) % 800;
          const sy = (i * 97 + 17) % 480;
          const r = (i % 5 === 0) ? 1.6 : 1.0;
          html += `<circle class="sol-star" cx="${sx}" cy="${sy}" r="${r}" fill="#ffffff" opacity="${0.2 + (i % 7) * 0.1}"/>`;
        }

        html += `
            </g>

            <!-- Top HUD: Time & Astronomical Calendar -->
            <g transform="translate(400, 32)">
              <rect x="-370" y="-20" width="740" height="40" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1.5"/>
              
              <!-- Elapsed Time Readout -->
              <text id="sol-time-readout" x="-350" y="5" fill="#f8fafc" font-size="13" font-weight="800">
                ⏱ Time: 0.00 Earth Yrs (0 Days)
              </text>

              <!-- Earth Season Badge -->
              <g transform="translate(40, 0)">
                <rect id="sol-season-box" x="-70" y="-12" width="140" height="24" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
                <text id="sol-season-text" x="0" y="4" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">🌱 Vernal Equinox</text>
              </g>

              <!-- Kepler Harmonic Law Banner -->
              <text id="sol-kepler-text" x="350" y="5" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="end">
                Kepler III: T² ∝ a³ (Orbital Resonance)
              </text>
            </g>

            <!-- Orbits Group -->
            <g id="sol-orbits-group">`;

        defaultPlanets.forEach(p => {
          html += `<circle id="sol-orbit-${p.id}" cx="${cx}" cy="${cy}" r="${p.orbR}" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        });

        html += `
            </g>

            <!-- Sun Center -->
            <g id="sol-sun-group" transform="translate(${cx}, ${cy})">
              <!-- Corona Aura -->
              <circle r="46" fill="url(#sol-sun-glow)"/>
              <circle r="26" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>
              <text y="4" fill="#78350f" font-size="11" font-weight="900" text-anchor="middle">SUN</text>
            </g>

            <!-- Planets & Labels Layer -->
            <g id="sol-planets-group">`;

        defaultPlanets.forEach(p => {
          html += `
            <g id="sol-planet-node-${p.id}" style="cursor:grab;">
              <!-- Radial guide line on drag -->
              <line id="sol-radial-${p.id}" x1="${cx}" y1="${cy}" x2="${cx + p.orbR}" y2="${cy}" stroke="${p.col}" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
              <!-- Planet Body -->
              <circle id="sol-body-${p.id}" cx="${cx + p.orbR}" cy="${cy}" r="${p.r}" fill="${p.id === 'earth' ? 'url(#sol-earth-atm)' : p.col}" stroke="#ffffff" stroke-width="1"/>
              <!-- Label -->
              <text id="sol-label-${p.id}" x="${cx + p.orbR}" y="${cy + p.r + 14}" fill="#e2e8f0" font-size="11" font-weight="800" text-anchor="middle">
                ${p.symbol} ${p.name}
              </text>
            </g>
          `;
        });

        // Earth's Moon
        html += `<circle id="sol-moon-node" cx="${cx + 155 + 18}" cy="${cy}" r="2.5" fill="#f8fafc" stroke="#64748b" stroke-width="0.5"/>`;

        html += `
            </g>

            <!-- Bottom Interactive PhET Control Dock -->
            <g id="sol-dock" transform="translate(400, 442)">
              <rect x="-375" y="-24" width="750" height="48" rx="12" fill="#0f172a" fill-opacity="0.95" stroke="#334155" stroke-width="1.5"/>

              <!-- Speed Multiplier Buttons -->
              <g transform="translate(-320, 0)">
                <text x="-40" y="5" fill="#94a3b8" font-size="11" font-weight="800">Speed:</text>
                <rect id="sol-spd-025" x="2" y="-12" width="38" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="21" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">0.25x</text>

                <rect id="sol-spd-1" x="44" y="-12" width="34" height="24" rx="5" fill="#38bdf8" stroke="#38bdf8" style="cursor:pointer;"/>
                <text x="61" y="4" fill="#090d16" font-size="10" font-weight="900" text-anchor="middle" pointer-events="none">1x</text>

                <rect id="sol-spd-5" x="82" y="-12" width="34" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="99" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">5x</text>

                <rect id="sol-spd-25" x="120" y="-12" width="38" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="139" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">25x</text>
              </g>

              <!-- Step & Play/Pause Controls -->
              <g transform="translate(-60, 0)">
                <!-- -30 Days -->
                <rect id="sol-step-back" x="-42" y="-12" width="36" height="24" rx="5" fill="#1e293b" stroke="#475569" style="cursor:pointer;"/>
                <text x="-24" y="4" fill="#cbd5e1" font-size="11" font-weight="800" text-anchor="middle" pointer-events="none">⏪</text>

                <!-- Play/Pause -->
                <rect id="sol-btn-playpause" x="0" y="-14" width="46" height="28" rx="6" fill="#10b981" stroke="#34d399" style="cursor:pointer;"/>
                <text id="sol-playpause-icon" x="23" y="5" fill="#022c22" font-size="13" font-weight="900" text-anchor="middle" pointer-events="none">⏸</text>

                <!-- +30 Days -->
                <rect id="sol-step-fwd" x="52" y="-12" width="36" height="24" rx="5" fill="#1e293b" stroke="#475569" style="cursor:pointer;"/>
                <text x="70" y="4" fill="#cbd5e1" font-size="11" font-weight="800" text-anchor="middle" pointer-events="none">⏩</text>
              </g>

              <!-- Toggles: Orbits & Reset -->
              <g transform="translate(190, 0)">
                <rect id="sol-btn-orbits" x="0" y="-12" width="68" height="24" rx="5" fill="#1e293b" stroke="#38bdf8" style="cursor:pointer;"/>
                <text id="sol-txt-orbits" x="34" y="4" fill="#38bdf8" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">Orbits: ON</text>

                <rect id="sol-btn-reset" x="74" y="-12" width="60" height="24" rx="5" fill="#1e293b" stroke="#e2e8f0" style="cursor:pointer;"/>
                <text x="104" y="4" fill="#e2e8f0" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">Reset</text>
              </g>
            </g>
          </svg>
        `;

        container.innerHTML = html;

        const svgEl = container.querySelector('#sol-interactive-svg');
        const elements = {
          svg: svgEl,
          stars: Array.from(container.querySelectorAll('.sol-star')),
          timeReadout: container.querySelector('#sol-time-readout'),
          seasonText: container.querySelector('#sol-season-text'),
          seasonBox: container.querySelector('#sol-season-box'),
          keplerText: container.querySelector('#sol-kepler-text'),
          orbitsGroup: container.querySelector('#sol-orbits-group'),
          moon: container.querySelector('#sol-moon-node'),
          btnPlayPause: container.querySelector('#sol-btn-playpause'),
          playPauseIcon: container.querySelector('#sol-playpause-icon'),
          spd025: container.querySelector('#sol-spd-025'),
          spd1: container.querySelector('#sol-spd-1'),
          spd5: container.querySelector('#sol-spd-5'),
          spd25: container.querySelector('#sol-spd-25'),
          stepBack: container.querySelector('#sol-step-back'),
          stepFwd: container.querySelector('#sol-step-fwd'),
          btnOrbits: container.querySelector('#sol-btn-orbits'),
          txtOrbits: container.querySelector('#sol-txt-orbits'),
          btnReset: container.querySelector('#sol-btn-reset'),
          planets: defaultPlanets.map(p => ({
            ...p,
            node: container.querySelector(`#sol-planet-node-${p.id}`),
            orbitCircle: container.querySelector(`#sol-orbit-${p.id}`),
            radial: container.querySelector(`#sol-radial-${p.id}`),
            body: container.querySelector(`#sol-body-${p.id}`),
            label: container.querySelector(`#sol-label-${p.id}`),
          })),
          cx,
          cy,
          simTimeYears: 0,
          speedMultiplier: 1.0,
          isPaused: false,
          showOrbits: true,
          activeDragPlanet: null,
        };

        // Speed multi helper
        const setSpeed = (spd, activeBtn) => {
          elements.speedMultiplier = spd;
          [elements.spd025, elements.spd1, elements.spd5, elements.spd25].forEach(btn => {
            btn.setAttribute('fill', '#1e293b');
            btn.setAttribute('stroke', '#334155');
            const txt = btn.nextElementSibling;
            if (txt) txt.setAttribute('fill', '#cbd5e1');
          });
          activeBtn.setAttribute('fill', '#38bdf8');
          activeBtn.setAttribute('stroke', '#38bdf8');
          const actTxt = activeBtn.nextElementSibling;
          if (actTxt) actTxt.setAttribute('fill', '#090d16');
        };

        elements.spd025.onclick = (e) => { e.stopPropagation(); setSpeed(0.25, elements.spd025); };
        elements.spd1.onclick = (e) => { e.stopPropagation(); setSpeed(1.0, elements.spd1); };
        elements.spd5.onclick = (e) => { e.stopPropagation(); setSpeed(5.0, elements.spd5); };
        elements.spd25.onclick = (e) => { e.stopPropagation(); setSpeed(25.0, elements.spd25); };

        // Play/Pause
        elements.btnPlayPause.onclick = (e) => {
          e.stopPropagation();
          elements.isPaused = !elements.isPaused;
          elements.playPauseIcon.textContent = elements.isPaused ? '▶' : '⏸';
          elements.btnPlayPause.setAttribute('fill', elements.isPaused ? '#3b82f6' : '#10b981');
        };

        // Step Day Buttons
        elements.stepBack.onclick = (e) => {
          e.stopPropagation();
          elements.simTimeYears = Math.max(0, elements.simTimeYears - 30 / 365.25);
          elements.updatePositions();
        };
        elements.stepFwd.onclick = (e) => {
          e.stopPropagation();
          elements.simTimeYears += 30 / 365.25;
          elements.updatePositions();
        };

        // Orbits Toggle
        elements.btnOrbits.onclick = (e) => {
          e.stopPropagation();
          elements.showOrbits = !elements.showOrbits;
          elements.orbitsGroup.style.display = elements.showOrbits ? 'block' : 'none';
          elements.txtOrbits.textContent = elements.showOrbits ? 'Orbits: ON' : 'Orbits: OFF';
        };

        // Reset
        elements.btnReset.onclick = (e) => {
          e.stopPropagation();
          elements.simTimeYears = 0;
          defaultPlanets.forEach((p, idx) => {
            elements.planets[idx].orbR = p.orbR;
            elements.planets[idx].orbitCircle.setAttribute('r', p.orbR);
          });
          setSpeed(1.0, elements.spd1);
          elements.updatePositions();
        };

        // Drag to resize planet orbits (Keplerian physics playground)
        const getSvgPoint = (evt) => {
          const pt = svgEl.createSVGPoint();
          const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
          const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
          pt.x = clientX;
          pt.y = clientY;
          const ctm = svgEl.getScreenCTM();
          return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
        };

        elements.planets.forEach(p => {
          p.node.onpointerdown = (e) => {
            e.stopPropagation();
            elements.activeDragPlanet = p;
            p.node.setPointerCapture(e.pointerId);
          };
        });

        svgEl.onpointermove = (e) => {
          if (!elements.activeDragPlanet) return;
          const pt = getSvgPoint(e);
          const dx = pt.x - cx;
          const dy = pt.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const clampedR = Math.max(50, Math.min(235, Math.round(dist)));
          elements.activeDragPlanet.orbR = clampedR;
          elements.activeDragPlanet.orbitCircle.setAttribute('r', clampedR);
          elements.updatePositions();
        };

        svgEl.onpointerup = (e) => {
          if (elements.activeDragPlanet) {
            try {
              elements.activeDragPlanet.node.releasePointerCapture(e.pointerId);
            } catch {}
            elements.activeDragPlanet = null;
          }
        };

        // Position Updater
        elements.updatePositions = () => {
          const tYears = elements.simTimeYears;
          const totalDays = Math.round(tYears * 365.25);

          // Update Time Readout
          elements.timeReadout.textContent = `⏱ Time: ${tYears.toFixed(2)} Earth Yrs (${totalDays} Days)`;

          // Compute Earth Angle & Season
          const earthSpeed = Math.pow(155 / elements.planets[2].orbR, 1.5);
          const earthAngleRad = (tYears * earthSpeed * Math.PI * 2) % (Math.PI * 2);
          const earthDeg = (earthAngleRad * 180 / Math.PI + 360) % 360;

          let seasonName = '🌱 Vernal Equinox (Spring)';
          let seasonColor = '#38bdf8';
          if (earthDeg >= 90 && earthDeg < 180) {
            seasonName = '☀️ Summer Solstice';
            seasonColor = '#facc15';
          } else if (earthDeg >= 180 && earthDeg < 270) {
            seasonName = '🍂 Autumnal Equinox';
            seasonColor = '#fb923c';
          } else if (earthDeg >= 270) {
            seasonName = '❄️ Winter Solstice';
            seasonColor = '#a5b4fc';
          }

          elements.seasonText.textContent = seasonName;
          elements.seasonText.setAttribute('fill', seasonColor);
          elements.seasonBox.setAttribute('stroke', seasonColor);

          let earthX = 0, earthY = 0;

          // Update Planets
          elements.planets.forEach(p => {
            // Kepler's Third Law: T² ∝ a³ ➔ angular velocity ω ∝ a^(-1.5)
            // Baseline: 155px = 1.00 speed
            const keplerSpeed = Math.pow(155 / p.orbR, 1.5);
            const angle = tYears * Math.PI * 2 * keplerSpeed;
            const px = cx + Math.cos(angle) * p.orbR;
            const py = cy + Math.sin(angle) * p.orbR;

            p.body.setAttribute('cx', px.toFixed(1));
            p.body.setAttribute('cy', py.toFixed(1));
            p.label.setAttribute('x', px.toFixed(1));
            p.label.setAttribute('y', (py + p.r + 14).toFixed(1));

            p.radial.setAttribute('x2', px.toFixed(1));
            p.radial.setAttribute('y2', py.toFixed(1));

            if (p.id === 'earth') {
              earthX = px;
              earthY = py;
            }
          });

          // Moon orbit around Earth
          if (elements.moon && earthX) {
            const moonAngle = tYears * Math.PI * 2 * 13.37; // ~13.4 lunar months per year
            const mx = earthX + Math.cos(moonAngle) * 17;
            const my = earthY + Math.sin(moonAngle) * 17;
            elements.moon.setAttribute('cx', mx.toFixed(1));
            elements.moon.setAttribute('cy', my.toFixed(1));
          }
        };

        elements.lastT = 0;
        return elements;
      },
      update(t, el) {
        if (!el || !el.updatePositions) return;

        // Advance simulation time smoothly based on delta-t and speedMultiplier if not paused
        const dt = Math.max(0, t - (el.lastT || 0));
        el.lastT = t;

        if (!el.isPaused) {
          // 1 full timeline loop = 2.0 Earth years at 1x
          el.simTimeYears += dt * 2.0 * (el.speedMultiplier || 1.0);
        }

        // Twinkle starfield
        for (let i = 0; i < el.stars.length; i++) {
          const op = 0.2 + ((i * 13 + t * 4) % 1) * 0.7;
          el.stars[i].setAttribute('opacity', op.toFixed(2));
        }

        el.updatePositions();
      },
      render(t) {
        return `<svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#050811;"><text x="400" y="240" fill="#f8fafc" font-size="20" text-anchor="middle">Solar System Living Simulation Stage</text></svg>`;
      }
    },

    'photosynthesis': {
      id: 'photosynthesis',
      stage: 'KS3 BIOLOGY',
      title: 'Photosynthesis: The Green Solar Engine',
      duration: 10.0,
      svgFile: 'scenes/photosynthesis.svg',
      astFile: 'scenes/photosynthesis.ast',
      keyframes: [
        { t: 0.00, title: 'Phase 1: Reactant Influx', rule: 'Leaves absorb Water (H2O) through roots and Carbon Dioxide (CO2) through stomata.' },
        { t: 0.40, title: 'Phase 2: Light Absorption', rule: 'Chlorophyll in chloroplasts absorbs light energy to split water molecules.' },
        { t: 0.75, title: 'Phase 3: Glucose Synthesis', rule: 'Chemical rearrangement produces Glucose (C6H12O6) for plant food.' },
        { t: 1.00, title: 'Phase 4: Oxygen Release', rule: 'Oxygen (O2) is released as a vital by-product through stomatal pores.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.4, en: "The plant leaf absorbs sunlight, water from veins, and carbon dioxide from air.", es: "La hoja de la planta absorbe luz solar, agua de las venas y dióxido de carbono del aire." },
        { start: 0.4, end: 0.75, en: "Inside chloroplasts, chlorophyll traps light photons to power the chemical synthesis.", es: "Dentro de los cloroplastos, la clorofila atrapa fotones para impulsar la síntesis química." },
        { start: 0.75, end: 1.0, en: "The equation: 6CO2 + 6H2O + Light makes Glucose (energy) and releases Oxygen!", es: "Ecuación: 6CO2 + 6H2O + Luz produce Glucosa (energía) y libera Oxígeno." }
      ],
      mount(container) {
        let html = '';
        html += `<path d="M 120 240 C 200 80, 600 80, 680 240 C 600 400, 200 400, 120 240 Z" fill="url(#grad-leaf)" stroke="#4ade80" stroke-width="3" />`;
        html += `<path d="M 120 240 L 680 240 M 260 240 L 340 160 M 380 240 L 460 160 M 260 240 L 340 320 M 380 240 L 460 320" stroke="#86efac" stroke-width="2" fill="none" opacity="0.6" />`;
        for (let i = 0; i < 6; i++) {
          html += `<circle class="ps-photon" id="ps-photon-${i}" cx="${200 + i * 70}" cy="30" r="4" fill="#facc15" filter="url(#glow)" />`;
        }
        html += `<rect x="180" y="24" width="440" height="38" rx="8" fill="#1e293b" stroke="#334155" />`;
        html += `<text x="400" y="48" fill="#4ade80" font-size="16" font-weight="bold" text-anchor="middle">6CO₂ + 6H₂O + Light ➔ C₆H₁₂O₆ + 6O₂</text>`;
        container.innerHTML = html;
        return {
          photons: Array.from(container.querySelectorAll('.ps-photon'))
        };
      },
      update(t, el) {
        if (!el || !el.photons) return;
        for (let i = 0; i < el.photons.length; i++) {
          const photonT = (t * 2 + i / 6) % 1;
          const y = 30 + photonT * 180;
          el.photons[i].setAttribute('cy', y.toFixed(1));
        }
      },
      render(t) {
        let svg = '';
        svg += `<path d="M 120 240 C 200 80, 600 80, 680 240 C 600 400, 200 400, 120 240 Z" fill="url(#grad-leaf)" stroke="#4ade80" stroke-width="3" />`;
        svg += `<path d="M 120 240 L 680 240 M 260 240 L 340 160 M 380 240 L 460 160 M 260 240 L 340 320 M 380 240 L 460 320" stroke="#86efac" stroke-width="2" fill="none" opacity="0.6" />`;
        for (let i = 0; i < 6; i++) {
          const photonT = (t * 2 + i / 6) % 1;
          const x = 200 + i * 70;
          const y = 30 + photonT * 180;
          svg += `<circle cx="${x}" cy="${y}" r="4" fill="#facc15" filter="url(#glow)" />`;
        }
        svg += `<rect x="180" y="24" width="440" height="38" rx="8" fill="#1e293b" stroke="#334155" />`;
        svg += `<text x="400" y="48" fill="#4ade80" font-size="16" font-weight="bold" text-anchor="middle">6CO₂ + 6H₂O + Light ➔ C₆H₁₂O₆ + 6O₂</text>`;
        return svg;
      }
    },

    'pythagoras': {
      id: 'pythagoras',
      stage: 'KS3 GEOMETRY',
      title: 'Pythagoras Theorem: Area Conservation',
      duration: 11.0,
      svgFile: 'scenes/pythagoras.svg',
      astFile: 'scenes/pythagoras.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: The 3-4-5 Triangle', rule: 'A right-angled triangle with sides a = 3, b = 4, and hypotenuse c.' },
        { t: 0.35, title: 'Step 2: Square a² and b²', rule: 'Square of side 3 has area 9; square of side 4 has area 16.' },
        { t: 0.70, title: 'Step 3: Vector Area Sum', rule: 'Total area = 9 + 16 = 25 square units.' },
        { t: 1.00, title: 'Step 4: Hypotenuse Square c²', rule: 'c² = 25 ➔ c = √25 = 5. Q.E.D.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "In any right-angled triangle, squares formed on the legs equal the square on the hypotenuse.", es: "En un triángulo rectángulo, los cuadrados sobre los catetos equivalen al cuadrado de la hipotenusa." },
        { start: 0.35, end: 0.70, en: "Side 'a' produces a square of 9 units. Side 'b' produces a square of 16 units.", es: "El lado 'a' produce un cuadrado de 9 unidades. El lado 'b' produce un cuadrado de 16 unidades." },
        { start: 0.70, end: 1.0, en: "Together they sum to 25 units! The hypotenuse 'c' must be exactly 5. a² + b² = c².", es: "¡Juntos suman 25 unidades! La hipotenusa 'c' mide exactamente 5. a² + b² = c²." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.35,
            title: 'Area Conservation Check',
            prompt: 'If side a = 3 has square area 9, and side b = 4 has square area 16, what must the hypotenuse square area c² equal?',
            options: [
              '7 (3 + 4)',
              '25 (9 + 16)',
              '144 (9 × 16)'
            ],
            answer: 1,
            explanation: 'Pythagoras theorem states that the sum of the areas on the two shorter legs equals the area on the hypotenuse: a² + b² = c² (9 + 16 = 25).'
          },
          {
            t: 0.90,
            title: 'Hypotenuse Calculation',
            prompt: 'Given that the area of the hypotenuse square is 25, what is the length of side c?',
            options: [
              'c = 5 (since √25 = 5)',
              'c = 12.5 (since 25 / 2 = 12.5)',
              'c = 50 (since 25 × 2 = 50)'
            ],
            answer: 0,
            explanation: 'Because the area of a square is length², to find the side length from area 25 we take the square root: c = √25 = 5.'
          }
        ]
      },
      mount(container) {
        let curA = 3;
        let curB = 4;
        const ox = 330, oy = 290, s = 22;

        container.innerHTML = `
          <svg id="pyth-interactive-svg" viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; user-select:none; touch-action:none;">
            <defs>
              <linearGradient id="pythA-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.6"/>
              </linearGradient>
              <linearGradient id="pythB-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.6"/>
              </linearGradient>
              <linearGradient id="pythC-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#d97706" stop-opacity="0.6"/>
              </linearGradient>
              <filter id="pyth-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Background Grid -->
            <g opacity="0.08" stroke="#38bdf8" stroke-width="1">
              <line x1="0" y1="120" x2="800" y2="120"/><line x1="0" y1="200" x2="800" y2="200"/><line x1="0" y1="280" x2="800" y2="280"/><line x1="0" y1="360" x2="800" y2="360"/>
              <line x1="160" y1="0" x2="160" y2="480"/><line x1="320" y1="0" x2="320" y2="480"/><line x1="480" y1="0" x2="480" y2="480"/><line x1="640" y1="0" x2="640" y2="480"/>
            </g>

            <!-- Live Algebra Equation Banner -->
            <g transform="translate(400, 36)">
              <rect x="-310" y="-22" width="620" height="44" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
              <text id="pyth-formula-text" x="0" y="6" fill="#f8fafc" font-size="16" font-weight="800" text-anchor="middle">
                a² + b² = c²  ➔  3² + 4² = 9 + 16 = 25  ➔  c = √25 = 5.00
              </text>
            </g>

            <!-- Pythagorean Triple Badge -->
            <g id="pyth-triple-badge" transform="translate(680, 36)" style="display:block;">
              <rect x="-65" y="-14" width="130" height="28" rx="14" fill="#854d0e" stroke="#facc15" stroke-width="1.5"/>
              <text x="0" y="5" fill="#fef08a" font-size="11" font-weight="900" text-anchor="middle">★ INTEGER TRIPLE</text>
            </g>

            <!-- Squares & Shapes Layer -->
            <g id="pyth-geometry-root">
              <!-- Square A (Green) -->
              <polygon id="pyth-poly-a" fill="url(#pythA-grad)" stroke="#34d399" stroke-width="2"/>
              <text id="pyth-label-a" fill="#ecfdf5" font-size="16" font-weight="900" text-anchor="middle">a² = 9</text>

              <!-- Square B (Blue) -->
              <polygon id="pyth-poly-b" fill="url(#pythB-grad)" stroke="#60a5fa" stroke-width="2"/>
              <text id="pyth-label-b" fill="#eff6ff" font-size="16" font-weight="900" text-anchor="middle">b² = 16</text>

              <!-- Square C (Gold/Orange Hypotenuse) -->
              <polygon id="pyth-poly-c" fill="url(#pythC-grad)" stroke="#fbbf24" stroke-width="2"/>
              <text id="pyth-label-c" fill="#fffbeb" font-size="16" font-weight="900" text-anchor="middle">c² = 25</text>

              <!-- Main Right-Angled Triangle -->
              <polygon id="pyth-triangle" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5" filter="url(#pyth-glow)"/>

              <!-- Right-Angle Indicator Box -->
              <rect id="pyth-right-angle" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="1.8"/>

              <!-- Dimension Labels on Legs -->
              <text id="pyth-side-a-lbl" fill="#34d399" font-size="14" font-weight="800" text-anchor="end">a = 3</text>
              <text id="pyth-side-b-lbl" fill="#60a5fa" font-size="14" font-weight="800" text-anchor="middle">b = 4</text>
              <text id="pyth-side-c-lbl" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">c = 5.00</text>

              <!-- Draggable Vertex Handles -->
              <!-- Top Vertex Handle (controls side a) -->
              <g id="pyth-handle-a" style="cursor:ns-resize;">
                <circle id="pyth-handle-a-glow" r="16" fill="#10b981" fill-opacity="0.3"/>
                <circle id="pyth-handle-a-dot" r="9" fill="#10b981" stroke="#ffffff" stroke-width="2.5"/>
                <text x="18" y="5" fill="#34d399" font-size="11" font-weight="800">DRAG (a)</text>
              </g>

              <!-- Right Vertex Handle (controls side b) -->
              <g id="pyth-handle-b" style="cursor:ew-resize;">
                <circle id="pyth-handle-b-glow" r="16" fill="#3b82f6" fill-opacity="0.3"/>
                <circle id="pyth-handle-b-dot" r="9" fill="#3b82f6" stroke="#ffffff" stroke-width="2.5"/>
                <text x="0" y="24" fill="#60a5fa" font-size="11" font-weight="800" text-anchor="middle">DRAG (b)</text>
              </g>
            </g>

            <!-- Bottom Interactive Control Dock (PhET-Caliber Dimension Adjusters) -->
            <g id="pyth-control-dock" transform="translate(400, 442)">
              <rect x="-370" y="-24" width="740" height="48" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>

              <!-- Side A Stepper -->
              <g transform="translate(-270, 0)">
                <text x="-48" y="5" fill="#34d399" font-size="13" font-weight="800">Side a:</text>
                <!-- Dec Button -->
                <rect id="pyth-btn-dec-a" x="6" y="-14" width="28" height="28" rx="6" fill="#1e293b" stroke="#34d399" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="20" y="5" fill="#34d399" font-size="16" font-weight="900" text-anchor="middle" pointer-events="none">-</text>
                <!-- Val -->
                <text id="pyth-val-a" x="50" y="5" fill="#ffffff" font-size="15" font-weight="900" text-anchor="middle">3</text>
                <!-- Inc Button -->
                <rect id="pyth-btn-inc-a" x="64" y="-14" width="28" height="28" rx="6" fill="#1e293b" stroke="#34d399" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="78" y="5" fill="#34d399" font-size="16" font-weight="900" text-anchor="middle" pointer-events="none">+</text>
              </g>

              <!-- Side B Stepper -->
              <g transform="translate(-80, 0)">
                <text x="-48" y="5" fill="#60a5fa" font-size="13" font-weight="800">Side b:</text>
                <!-- Dec Button -->
                <rect id="pyth-btn-dec-b" x="6" y="-14" width="28" height="28" rx="6" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="20" y="5" fill="#60a5fa" font-size="16" font-weight="900" text-anchor="middle" pointer-events="none">-</text>
                <!-- Val -->
                <text id="pyth-val-b" x="50" y="5" fill="#ffffff" font-size="15" font-weight="900" text-anchor="middle">4</text>
                <!-- Inc Button -->
                <rect id="pyth-btn-inc-b" x="64" y="-14" width="28" height="28" rx="6" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="78" y="5" fill="#60a5fa" font-size="16" font-weight="900" text-anchor="middle" pointer-events="none">+</text>
              </g>

              <!-- Presets -->
              <g transform="translate(130, 0)">
                <text x="-40" y="5" fill="#94a3b8" font-size="11" font-weight="700">Triples:</text>
                <!-- Preset 3-4-5 -->
                <rect id="pyth-pre-345" x="8" y="-13" width="56" height="26" rx="6" fill="#1e293b" stroke="#facc15" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="36" y="4" fill="#facc15" font-size="11" font-weight="800" text-anchor="middle" pointer-events="none">3-4-5</text>
                <!-- Preset 5-12-13 (scaled) -->
                <rect id="pyth-pre-6810" x="72" y="-13" width="60" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="102" y="4" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle" pointer-events="none">6-8-10</text>
                <!-- Preset 5-5 (isosceles) -->
                <rect id="pyth-pre-55" x="140" y="-13" width="68" height="26" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5" style="cursor:pointer;"/>
                <text x="174" y="4" fill="#c084fc" font-size="11" font-weight="800" text-anchor="middle" pointer-events="none">5-5-√50</text>
              </g>
            </g>
          </svg>
        `;

        const svgEl = container.querySelector('#pyth-interactive-svg');
        const elements = {
          svg: svgEl,
          polyA: container.querySelector('#pyth-poly-a'),
          polyB: container.querySelector('#pyth-poly-b'),
          polyC: container.querySelector('#pyth-poly-c'),
          triangle: container.querySelector('#pyth-triangle'),
          labelA: container.querySelector('#pyth-label-a'),
          labelB: container.querySelector('#pyth-label-b'),
          labelC: container.querySelector('#pyth-label-c'),
          sideLblA: container.querySelector('#pyth-side-a-lbl'),
          sideLblB: container.querySelector('#pyth-side-b-lbl'),
          sideLblC: container.querySelector('#pyth-side-c-lbl'),
          handleA: container.querySelector('#pyth-handle-a'),
          handleB: container.querySelector('#pyth-handle-b'),
          rightAngle: container.querySelector('#pyth-right-angle'),
          formulaText: container.querySelector('#pyth-formula-text'),
          tripleBadge: container.querySelector('#pyth-triple-badge'),
          valA: container.querySelector('#pyth-val-a'),
          valB: container.querySelector('#pyth-val-b'),
          btnDecA: container.querySelector('#pyth-btn-dec-a'),
          btnIncA: container.querySelector('#pyth-btn-inc-a'),
          btnDecB: container.querySelector('#pyth-btn-dec-b'),
          btnIncB: container.querySelector('#pyth-btn-inc-b'),
          pre345: container.querySelector('#pyth-pre-345'),
          pre6810: container.querySelector('#pyth-pre-6810'),
          pre55: container.querySelector('#pyth-pre-55'),
          curA,
          curB,
          ox,
          oy,
          s,
          tProgress: 1.0,
        };

        // Render Geometry Function
        function renderPythagorasGeometry() {
          const a = elements.curA;
          const b = elements.curB;
          const aLen = a * s;
          const bLen = b * s;
          const c = Math.sqrt(a * a + b * b);
          const cLen = c * s;

          const topX = ox;
          const topY = oy - aLen;
          const rightX = ox + bLen;
          const rightY = oy;

          // Triangle Points
          elements.triangle.setAttribute('points', `${ox},${oy} ${rightX},${rightY} ${topX},${topY}`);

          // Right Angle Box
          elements.rightAngle.setAttribute('x', ox);
          elements.rightAngle.setAttribute('y', oy - 16);

          // Square A Points (Left of vertical leg)
          const pA1 = `${ox},${oy}`;
          const pA2 = `${topX},${topY}`;
          const pA3 = `${topX - aLen},${topY}`;
          const pA4 = `${ox - aLen},${oy}`;
          elements.polyA.setAttribute('points', `${pA1} ${pA2} ${pA3} ${pA4}`);
          elements.labelA.setAttribute('x', (ox - aLen / 2).toFixed(1));
          elements.labelA.setAttribute('y', (topY + aLen / 2 + 5).toFixed(1));
          elements.labelA.textContent = `a² = ${(a * a).toFixed(0)}`;

          // Square B Points (Below horizontal leg)
          const pB1 = `${ox},${oy}`;
          const pB2 = `${rightX},${rightY}`;
          const pB3 = `${rightX},${rightY + bLen}`;
          const pB4 = `${ox},${oy + bLen}`;
          elements.polyB.setAttribute('points', `${pB1} ${pB2} ${pB3} ${pB4}`);
          elements.labelB.setAttribute('x', (ox + bLen / 2).toFixed(1));
          elements.labelB.setAttribute('y', (oy + bLen / 2 + 5).toFixed(1));
          elements.labelB.textContent = `b² = ${(b * b).toFixed(0)}`;

          // Square C Points (Outward along hypotenuse)
          // Vector along hyp from right to top: (-bLen, -aLen)
          // Outward normal: (aLen, -bLen)
          const pC1 = `${rightX},${rightY}`;
          const pC2 = `${topX},${topY}`;
          const pC3 = `${topX + aLen},${topY - bLen}`;
          const pC4 = `${rightX + aLen},${rightY - bLen}`;
          elements.polyC.setAttribute('points', `${pC1} ${pC2} ${pC3} ${pC4}`);

          const centerCX = (rightX + topX + aLen) / 2;
          const centerCY = (rightY + topY - bLen) / 2;
          elements.labelC.setAttribute('x', centerCX.toFixed(1));
          elements.labelC.setAttribute('y', (centerCY + 5).toFixed(1));
          elements.labelC.textContent = `c² = ${(c * c).toFixed(1).replace('.0', '')}`;

          // Leg Dimension Labels
          elements.sideLblA.setAttribute('x', (ox - 8).toFixed(1));
          elements.sideLblA.setAttribute('y', (oy - aLen / 2 + 5).toFixed(1));
          elements.sideLblA.textContent = `a = ${a}`;

          elements.sideLblB.setAttribute('x', (ox + bLen / 2).toFixed(1));
          elements.sideLblB.setAttribute('y', (oy - 8).toFixed(1));
          elements.sideLblB.textContent = `b = ${b}`;

          const midHypX = (topX + rightX) / 2;
          const midHypY = (topY + rightY) / 2;
          elements.sideLblC.setAttribute('x', (midHypX + 16).toFixed(1));
          elements.sideLblC.setAttribute('y', (midHypY - 10).toFixed(1));
          elements.sideLblC.textContent = `c = ${c.toFixed(2)}`;

          // Draggable Handles Placement
          elements.handleA.setAttribute('transform', `translate(${topX}, ${topY})`);
          elements.handleB.setAttribute('transform', `translate(${rightX}, ${rightY})`);

          // Control Val Display
          elements.valA.textContent = a;
          elements.valB.textContent = b;

          // Formula Update
          const a2 = (a * a).toFixed(0);
          const b2 = (b * b).toFixed(0);
          const c2 = (c * c).toFixed(1).replace('.0', '');
          const isInt = Math.abs(c - Math.round(c)) < 0.001;
          const cDisplay = isInt ? Math.round(c) : c.toFixed(2);

          elements.formulaText.textContent = `a² + b² = c²  ➔  ${a}² + ${b}² = ${a2} + ${b2} = ${c2}  ➔  c = √${c2} = ${cDisplay}`;
          elements.tripleBadge.style.display = isInt ? 'block' : 'none';
        }

        elements.renderGeometry = renderPythagorasGeometry;
        renderPythagorasGeometry();

        // Attach Stepper Button Handlers
        const updateA = (delta) => {
          elements.curA = Math.max(2, Math.min(7, elements.curA + delta));
          renderPythagorasGeometry();
        };
        const updateB = (delta) => {
          elements.curB = Math.max(2, Math.min(8, elements.curB + delta));
          renderPythagorasGeometry();
        };

        elements.btnDecA.onclick = (e) => { e.stopPropagation(); updateA(-1); };
        elements.btnIncA.onclick = (e) => { e.stopPropagation(); updateA(1); };
        elements.btnDecB.onclick = (e) => { e.stopPropagation(); updateB(-1); };
        elements.btnIncB.onclick = (e) => { e.stopPropagation(); updateB(1); };

        elements.pre345.onclick = (e) => { e.stopPropagation(); elements.curA = 3; elements.curB = 4; renderPythagorasGeometry(); };
        elements.pre6810.onclick = (e) => { e.stopPropagation(); elements.curA = 6; elements.curB = 8; renderPythagorasGeometry(); };
        elements.pre55.onclick = (e) => { e.stopPropagation(); elements.curA = 5; elements.curB = 5; renderPythagorasGeometry(); };

        // Draggable Vertex Handle Gestures (Direct SVG Manipulation)
        let activeDrag = null;

        const getSvgPoint = (evt) => {
          const pt = svgEl.createSVGPoint();
          const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
          const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
          pt.x = clientX;
          pt.y = clientY;
          const ctm = svgEl.getScreenCTM();
          return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
        };

        elements.handleA.onpointerdown = (e) => {
          e.stopPropagation();
          activeDrag = 'a';
          elements.handleA.setPointerCapture(e.pointerId);
        };

        elements.handleB.onpointerdown = (e) => {
          e.stopPropagation();
          activeDrag = 'b';
          elements.handleB.setPointerCapture(e.pointerId);
        };

        svgEl.onpointermove = (e) => {
          if (!activeDrag) return;
          const pt = getSvgPoint(e);
          if (activeDrag === 'a') {
            const rawA = (oy - pt.y) / s;
            elements.curA = Math.max(2, Math.min(7, Math.round(rawA)));
            renderPythagorasGeometry();
          } else if (activeDrag === 'b') {
            const rawB = (pt.x - ox) / s;
            elements.curB = Math.max(2, Math.min(8, Math.round(rawB)));
            renderPythagorasGeometry();
          }
        };

        svgEl.onpointerup = (e) => {
          if (activeDrag) {
            try {
              if (activeDrag === 'a') elements.handleA.releasePointerCapture(e.pointerId);
              if (activeDrag === 'b') elements.handleB.releasePointerCapture(e.pointerId);
            } catch {}
            activeDrag = null;
          }
        };

        return elements;
      },
      update(t, el) {
        if (!el || !el.renderGeometry) return;
        el.tProgress = t;
        // Fade in squares according to pedagogical timeline if playing
        const fillB = Math.min(1, t / 0.4);
        const fillA = Math.min(1, Math.max(0, (t - 0.25) / 0.4));
        const fillC = Math.min(1, Math.max(0, (t - 0.6) / 0.4));

        if (el.polyB) el.polyB.setAttribute('opacity', (fillB * 0.9 + 0.1).toFixed(2));
        if (el.labelB) el.labelB.setAttribute('opacity', fillB > 0.4 ? '1' : '0');

        if (el.polyA) el.polyA.setAttribute('opacity', (fillA * 0.9 + 0.1).toFixed(2));
        if (el.labelA) el.labelA.setAttribute('opacity', fillA > 0.4 ? '1' : '0');

        if (el.polyC) el.polyC.setAttribute('opacity', (fillC * 0.9 + 0.1).toFixed(2));
        if (el.labelC) el.labelC.setAttribute('opacity', fillC > 0.4 ? '1' : '0');
      },
      render(t) {
        return `<svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;"><text x="400" y="240" fill="#f8fafc" font-size="20" text-anchor="middle">Pythagoras Living Simulation Stage</text></svg>`;
      }
    },

    'water-cycle': {
      id: 'water-cycle',
      stage: 'KS2 GEOGRAPHY',
      title: 'Water Cycle: Continuous Earth Cycle',
      duration: 10.0,
      svgFile: 'scenes/water-cycle.svg',
      astFile: 'scenes/water-cycle.ast',
      keyframes: [
        { t: 0.00, title: 'Solar Heating & Evaporation', rule: 'Sun warms ocean water, converting liquid into invisible water vapor.' },
        { t: 0.35, title: 'Atmospheric Condensation', rule: 'Rising vapor cools and condenses into cloud water droplets.' },
        { t: 0.70, title: 'Precipitation', rule: 'Heavy clouds release moisture as rain, sleet, or snow.' },
        { t: 1.00, title: 'Runoff & Collection', rule: 'Rivers carry precipitation back to oceans, completing the closed cycle.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Solar energy heats the ocean, driving evaporation into rising, invisible water vapor.", es: "La energía solar calienta el océano, impulsando la evaporación en vapor de agua." },
        { start: 0.35, end: 0.70, en: "As warm moist air ascends over the cold mountain (orographic lift), it condenses into clouds.", es: "El aire cálido asciende sobre la montaña fría y se condensa en nubes." },
        { start: 0.70, end: 1.00, en: "Droplets precipitate as rain or snow, feeding rivers and aquifers that cycle back to the sea.", es: "Las gotas caen como lluvia o nieve, alimentando ríos que regresan al mar." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.35,
            title: 'Orographic Lift & Condensation',
            prompt: 'Why does moist air rising over a mountain range form thick condensation clouds?',
            options: [
              'Because atmospheric temperature drops with altitude, cooling the vapor to its dew point',
              'Because the mountain pushes the water vapor into outer space',
              'Because mountain rocks emit steam'
            ],
            answer: 0,
            explanation: 'As air is forced upward over mountain topography (orographic lift), it expands and adiabatically cools. When it hits its dew point temperature, water vapor condenses into liquid cloud droplets.'
          },
          {
            t: 0.88,
            title: 'Hydrological Mass Conservation',
            prompt: 'In Earth\'s closed hydrological system, what happens to the total volume of water over time?',
            options: [
              'Total water is strictly conserved; water continuously cycles between ocean, atmosphere, and land',
              'Water is permanently destroyed when it rains',
              'The ocean is slowly running out of water because of rivers'
            ],
            answer: 0,
            explanation: 'The water cycle is a closed planetary loop. Water changes physical states (liquid, vapor, ice) and moves between reservoirs, but Earth\'s total mass of H2O remains constant.'
          }
        ]
      },
      mount(container) {
        let sunPower = 0.8; // 0.2 to 1.0
        let isSnow = false;
        let cloudX = 420;
        let cloudY = 130;
        let windSpeed = 1.0;

        let html = `
          <svg id="wc-interactive-svg" viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#030712; user-select:none; touch-action:none;">
            <defs>
              <linearGradient id="wcSkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0f172a"/>
                <stop offset="60%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.3"/>
              </linearGradient>
              <linearGradient id="wcOceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284c7"/>
                <stop offset="30%" stop-color="#0369a1"/>
                <stop offset="100%" stop-color="#082f49"/>
              </linearGradient>
              <linearGradient id="wcMountainGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#475569"/>
                <stop offset="50%" stop-color="#334155"/>
                <stop offset="100%" stop-color="#1e293b"/>
              </linearGradient>
              <linearGradient id="wcValleyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#15803d"/>
                <stop offset="60%" stop-color="#166534"/>
                <stop offset="100%" stop-color="#78350f"/>
              </linearGradient>
              <radialGradient id="wcSunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
                <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.8"/>
                <stop offset="75%" stop-color="#ea580c" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
              </radialGradient>
              <filter id="wcSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Sky Backdrop -->
            <rect width="800" height="480" fill="url(#wcSkyGrad)"/>

            <!-- Top HUD: Live Hydrological Rates & Conservation -->
            <g transform="translate(400, 32)">
              <rect x="-375" y="-20" width="750" height="40" rx="10" fill="#0f172a" fill-opacity="0.92" stroke="#334155" stroke-width="1.5"/>
              
              <!-- Solar Irradiance -->
              <text id="wc-solar-hud" x="-355" y="5" fill="#facc15" font-size="12" font-weight="800">
                ☀️ Solar Irradiance: 850 W/m²
              </text>

              <!-- Evap Rate -->
              <text id="wc-evap-hud" x="-120" y="5" fill="#38bdf8" font-size="12" font-weight="800">
                ♨ Evaporation: 14.5 mm/day
              </text>

              <!-- Precipitation State -->
              <g transform="translate(130, 0)">
                <rect id="wc-precip-badge" x="-60" y="-12" width="120" height="24" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
                <text id="wc-precip-text" x="0" y="4" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">🌧️ Rain (18°C)</text>
              </g>

              <!-- Conservation Law -->
              <text x="355" y="5" fill="#a7f3d0" font-size="11" font-weight="700" text-anchor="end">
                Σ H₂O = 100% Conserved
              </text>
            </g>

            <!-- Mountain Range -->
            <!-- Back Mountain -->
            <polygon points="440,360 580,180 720,360" fill="#1e293b" opacity="0.7"/>
            <!-- Main Alpine Peak -->
            <polygon points="520,380 670,140 820,380" fill="url(#wcMountainGrad)"/>
            <!-- Snow Cap Peak -->
            <polygon id="wc-snowcap" points="640,190 670,140 700,190 682,185 670,192 658,185" fill="#f8fafc" opacity="0.95"/>

            <!-- Valley & Soil Cross-Section -->
            <path d="M 280,360 Q 380,330 520,360 L 520,440 L 280,440 Z" fill="url(#wcValleyGrad)"/>
            <!-- Underground Aquifer / Groundwater Bed -->
            <rect x="0" y="400" width="800" height="80" fill="#1e1b4b" opacity="0.9"/>
            <text x="400" y="425" fill="#818cf8" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="2">
              UNDERGROUND PERMEABLE AQUIFER &amp; GROUNDWATER WATER TABLE
            </text>
            <!-- Groundwater Seepage Arrows -->
            <g stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5">
              <line x1="500" y1="410" x2="320" y2="410"/>
              <line x1="300" y1="410" x2="160" y2="410"/>
            </g>

            <!-- Alpine Lake Reservoir -->
            <ellipse cx="560" cy="340" rx="36" ry="12" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="560" y="344" fill="#e0f2fe" font-size="9" font-weight="800" text-anchor="middle">RESERVOIR</text>

            <!-- Mountain River cascading down to Ocean -->
            <path id="wc-river" d="M 540,346 Q 470,355 420,365 Q 360,375 290,380" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
            <path id="wc-river-flow" d="M 540,346 Q 470,355 420,365 Q 360,375 290,380" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 8" stroke-linecap="round"/>

            <!-- Trees in Valley -->
            <g id="wc-trees-group">
              <polygon points="340,350 332,365 348,365" fill="#15803d"/>
              <polygon points="360,345 352,360 368,360" fill="#166534"/>
              <polygon points="380,348 372,364 388,364" fill="#15803d"/>
              <polygon points="410,346 402,362 418,362" fill="#166534"/>
            </g>

            <!-- Ocean Body with Dynamic Waves -->
            <g id="wc-ocean-group">
              <path id="wc-ocean-body" d="M 0,350 Q 75,346 150,350 T 300,350 L 300,440 L 0,440 Z" fill="url(#wcOceanGrad)"/>
              <path id="wc-ocean-crest" d="M 0,350 Q 75,346 150,350 T 300,350" fill="none" stroke="#7dd3fc" stroke-width="2"/>
              <text x="140" y="385" fill="#bae6fd" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="1">
                PACIFIC OCEAN
              </text>
            </g>

            <!-- Interactive Sun Group -->
            <g id="wc-sun-group" transform="translate(130, 110)" style="cursor:pointer;">
              <!-- Outer Glow -->
              <circle id="wc-sun-aura" r="54" fill="url(#wcSunGlow)"/>
              <!-- Thermal Corona Rays -->
              <g id="wc-sun-rays" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity="0.8">
                <line x1="0" y1="-38" x2="0" y2="-48"/>
                <line x1="27" y1="-27" x2="34" y2="-34"/>
                <line x1="38" y1="0" x2="48" y2="0"/>
                <line x1="27" y1="27" x2="34" y2="34"/>
                <line x1="0" y1="38" x2="0" y2="48"/>
                <line x1="-27" y1="27" x2="-34" y2="34"/>
                <line x1="-38" y1="0" x2="-48" y2="0"/>
                <line x1="-27" y1="-27" x2="-34" y2="-34"/>
              </g>
              <!-- Sun Core -->
              <circle r="30" fill="#f59e0b" stroke="#fef08a" stroke-width="2.5"/>
              <text y="5" fill="#78350f" font-size="11" font-weight="900" text-anchor="middle">SUN</text>
            </g>

            <!-- Shimmering Rising Evaporation Vapor Particles -->
            <g id="wc-vapor-group"></g>

            <!-- Draggable Storm Cloud Group -->
            <g id="wc-cloud-group" transform="translate(420, 130)" style="cursor:grab;">
              <!-- Cloud Shadow / Base -->
              <path id="wc-cloud-base" d="M -90,20 Q -60,-25 0,-15 Q 40,-45 80,-15 Q 110,-10 110,20 Q 110,35 80,35 L -70,35 Q -90,35 -90,20 Z" fill="#94a3b8" opacity="0.95" filter="url(#wcSoftGlow)"/>
              <path id="wc-cloud-puff" d="M -85,18 Q -55,-22 5,-12 Q 45,-40 82,-12 Q 105,-8 105,18 Q 105,32 75,32 L -65,32 Q -85,32 -85,18 Z" fill="#e2e8f0"/>
              <text x="0" y="15" fill="#334155" font-size="11" font-weight="900" text-anchor="middle">DRAG CLOUD</text>
            </g>

            <!-- Precipitation Layer (Rain or Snow) -->
            <g id="wc-precip-layer"></g>

            <!-- Bottom Interactive PhET Hydrology Dock -->
            <g id="wc-dock" transform="translate(400, 442)">
              <rect x="-375" y="-24" width="750" height="48" rx="12" fill="#0f172a" fill-opacity="0.95" stroke="#334155" stroke-width="1.5"/>

              <!-- Solar Radiation Stepper -->
              <g transform="translate(-310, 0)">
                <text x="-48" y="5" fill="#facc15" font-size="11" font-weight="800">Sun Power:</text>
                <rect id="wc-btn-sun-25" x="20" y="-12" width="36" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="38" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">25%</text>

                <rect id="wc-btn-sun-50" x="60" y="-12" width="36" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="78" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">50%</text>

                <rect id="wc-btn-sun-80" x="100" y="-12" width="36" height="24" rx="5" fill="#f59e0b" stroke="#f59e0b" style="cursor:pointer;"/>
                <text x="118" y="4" fill="#090d16" font-size="10" font-weight="900" text-anchor="middle" pointer-events="none">80%</text>

                <rect id="wc-btn-sun-100" x="140" y="-12" width="42" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="161" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">100%</text>
              </g>

              <!-- Temperature / Weather Mode Toggle -->
              <g transform="translate(-30, 0)">
                <rect id="wc-toggle-weather" x="-10" y="-14" width="130" height="28" rx="6" fill="#0284c7" stroke="#38bdf8" style="cursor:pointer;"/>
                <text id="wc-toggle-weather-txt" x="55" y="5" fill="#f8fafc" font-size="11" font-weight="900" text-anchor="middle" pointer-events="none">
                  Mode: 💧 Rain (18°C)
                </text>
              </g>

              <!-- Wind Direction / Breeze Stepper -->
              <g transform="translate(170, 0)">
                <text x="-35" y="5" fill="#94a3b8" font-size="11" font-weight="800">Wind:</text>
                <rect id="wc-btn-wind-low" x="5" y="-12" width="38" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="24" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">Calm</text>

                <rect id="wc-btn-wind-med" x="48" y="-12" width="42" height="24" rx="5" fill="#38bdf8" stroke="#38bdf8" style="cursor:pointer;"/>
                <text x="69" y="4" fill="#090d16" font-size="10" font-weight="900" text-anchor="middle" pointer-events="none">Breeze</text>

                <rect id="wc-btn-wind-gale" x="95" y="-12" width="38" height="24" rx="5" fill="#1e293b" stroke="#334155" style="cursor:pointer;"/>
                <text x="114" y="4" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" pointer-events="none">Gale</text>
              </g>
            </g>
          </svg>
        `;

        container.innerHTML = html;

        const svgEl = container.querySelector('#wc-interactive-svg');
        const elements = {
          svg: svgEl,
          solarHud: container.querySelector('#wc-solar-hud'),
          evapHud: container.querySelector('#wc-evap-hud'),
          precipBadge: container.querySelector('#wc-precip-badge'),
          precipText: container.querySelector('#wc-precip-text'),
          snowCap: container.querySelector('#wc-snowcap'),
          riverFlow: container.querySelector('#wc-river-flow'),
          oceanCrest: container.querySelector('#wc-ocean-crest'),
          sunGroup: container.querySelector('#wc-sun-group'),
          sunAura: container.querySelector('#wc-sun-aura'),
          sunRays: container.querySelector('#wc-sun-rays'),
          vaporGroup: container.querySelector('#wc-vapor-group'),
          cloudGroup: container.querySelector('#wc-cloud-group'),
          cloudBase: container.querySelector('#wc-cloud-base'),
          cloudPuff: container.querySelector('#wc-cloud-puff'),
          precipLayer: container.querySelector('#wc-precip-layer'),
          btnSun25: container.querySelector('#wc-btn-sun-25'),
          btnSun50: container.querySelector('#wc-btn-sun-50'),
          btnSun80: container.querySelector('#wc-btn-sun-80'),
          btnSun100: container.querySelector('#wc-btn-sun-100'),
          toggleWeather: container.querySelector('#wc-toggle-weather'),
          toggleWeatherTxt: container.querySelector('#wc-toggle-weather-txt'),
          btnWindLow: container.querySelector('#wc-btn-wind-low'),
          btnWindMed: container.querySelector('#wc-btn-wind-med'),
          btnWindGale: container.querySelector('#wc-btn-wind-gale'),
          sunPower,
          isSnow,
          cloudX,
          cloudY,
          windSpeed,
          activeDragCloud: false,
          vapors: [],
          precipItems: [],
        };

        // Create initial pool of 16 vapor particles
        for (let i = 0; i < 16; i++) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('r', (2.5 + (i % 3) * 1).toFixed(1));
          circle.setAttribute('fill', '#93c5fd');
          circle.setAttribute('opacity', '0.6');
          elements.vaporGroup.appendChild(circle);
          elements.vapors.push({
            el: circle,
            seedX: 50 + (i * 15) % 220,
            speed: 0.8 + (i % 4) * 0.4,
            offset: i / 16,
          });
        }

        // Create initial pool of 20 precipitation items (rain lines or snow stars)
        for (let i = 0; i < 20; i++) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('stroke', '#60a5fa');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-linecap', 'round');
          elements.precipLayer.appendChild(line);
          elements.precipItems.push({
            el: line,
            offsetX: -70 + i * 7.5,
            speed: 1.2 + (i % 3) * 0.5,
            phase: (i * 0.17) % 1,
          });
        }

        // Sun Power Buttons
        const setSunPower = (pwr, activeBtn) => {
          elements.sunPower = pwr;
          [elements.btnSun25, elements.btnSun50, elements.btnSun80, elements.btnSun100].forEach(btn => {
            btn.setAttribute('fill', '#1e293b');
            btn.setAttribute('stroke', '#334155');
            const txt = btn.nextElementSibling;
            if (txt) txt.setAttribute('fill', '#cbd5e1');
          });
          activeBtn.setAttribute('fill', '#f59e0b');
          activeBtn.setAttribute('stroke', '#f59e0b');
          const actTxt = activeBtn.nextElementSibling;
          if (actTxt) actTxt.setAttribute('fill', '#090d16');

          const watts = Math.round(pwr * 1000);
          const evap = (pwr * 18.2).toFixed(1);
          elements.solarHud.textContent = `☀️ Solar Irradiance: ${watts} W/m²`;
          elements.evapHud.textContent = `♨ Evaporation: ${evap} mm/day`;
          elements.sunAura.setAttribute('r', (36 + pwr * 24).toFixed(0));
        };

        elements.btnSun25.onclick = (e) => { e.stopPropagation(); setSunPower(0.25, elements.btnSun25); };
        elements.btnSun50.onclick = (e) => { e.stopPropagation(); setSunPower(0.50, elements.btnSun50); };
        elements.btnSun80.onclick = (e) => { e.stopPropagation(); setSunPower(0.80, elements.btnSun80); };
        elements.btnSun100.onclick = (e) => { e.stopPropagation(); setSunPower(1.00, elements.btnSun100); };

        // Weather Toggle
        elements.toggleWeather.onclick = (e) => {
          e.stopPropagation();
          elements.isSnow = !elements.isSnow;
          if (elements.isSnow) {
            elements.toggleWeather.setAttribute('fill', '#475569');
            elements.toggleWeather.setAttribute('stroke', '#cbd5e1');
            elements.toggleWeatherTxt.textContent = 'Mode: ❄️ Snow (-4°C)';
            elements.precipText.textContent = '❄️ Alpine Snow (-4°C)';
            elements.precipText.setAttribute('fill', '#cbd5e1');
            elements.precipBadge.setAttribute('stroke', '#cbd5e1');
            elements.cloudBase.setAttribute('fill', '#64748b');
            elements.snowCap.setAttribute('opacity', '1');
          } else {
            elements.toggleWeather.setAttribute('fill', '#0284c7');
            elements.toggleWeather.setAttribute('stroke', '#38bdf8');
            elements.toggleWeatherTxt.textContent = 'Mode: 💧 Rain (18°C)';
            elements.precipText.textContent = '🌧️ Rain (18°C)';
            elements.precipText.setAttribute('fill', '#38bdf8');
            elements.precipBadge.setAttribute('stroke', '#38bdf8');
            elements.cloudBase.setAttribute('fill', '#94a3b8');
            elements.snowCap.setAttribute('opacity', '0.7');
          }
        };

        // Wind Speed Buttons
        const setWind = (spd, activeBtn) => {
          elements.windSpeed = spd;
          [elements.btnWindLow, elements.btnWindMed, elements.btnWindGale].forEach(btn => {
            btn.setAttribute('fill', '#1e293b');
            btn.setAttribute('stroke', '#334155');
            const txt = btn.nextElementSibling;
            if (txt) txt.setAttribute('fill', '#cbd5e1');
          });
          activeBtn.setAttribute('fill', '#38bdf8');
          activeBtn.setAttribute('stroke', '#38bdf8');
          const actTxt = activeBtn.nextElementSibling;
          if (actTxt) actTxt.setAttribute('fill', '#090d16');
        };

        elements.btnWindLow.onclick = (e) => { e.stopPropagation(); setWind(0.5, elements.btnWindLow); };
        elements.btnWindMed.onclick = (e) => { e.stopPropagation(); setWind(1.0, elements.btnWindMed); };
        elements.btnWindGale.onclick = (e) => { e.stopPropagation(); setWind(2.2, elements.btnWindGale); };

        // Direct Stage Manipulations (Zero-Slider Natural Physics)
        let activeDragTarget = null;

        // 1. Direct Sun Drag (drag up/down to increase/decrease solar energy)
        elements.sunGroup.onpointerdown = (e) => {
          e.stopPropagation();
          activeDragTarget = 'sun';
          elements.sunGroup.setPointerCapture(e.pointerId);
        };

        // 2. Direct Snowcap Tap (touch snow to toggle snow mode)
        elements.snowCap.style.cursor = 'pointer';
        elements.snowCap.onclick = (e) => {
          e.stopPropagation();
          elements.toggleWeather.click();
        };

        // 3. Direct Cloud Drag
        elements.cloudGroup.onpointerdown = (e) => {
          e.stopPropagation();
          activeDragTarget = 'cloud';
          elements.activeDragCloud = true;
          elements.cloudGroup.setPointerCapture(e.pointerId);
        };

        svgEl.onpointermove = (e) => {
          if (!activeDragTarget) return;
          const pt = getSvgPoint(e);

          if (activeDragTarget === 'cloud') {
            elements.cloudX = Math.max(160, Math.min(680, pt.x));
            elements.cloudY = Math.max(70, Math.min(220, pt.y));
            elements.cloudGroup.setAttribute('transform', `translate(${elements.cloudX}, ${elements.cloudY})`);
          } else if (activeDragTarget === 'sun') {
            // Dragging vertically alters solar power (higher = hotter, lower = cooler)
            const rawPwr = (200 - pt.y) / 120;
            const clampedPwr = Math.max(0.2, Math.min(1.0, rawPwr));
            elements.sunPower = clampedPwr;
            const watts = Math.round(clampedPwr * 1000);
            const evap = (clampedPwr * 18.2).toFixed(1);
            elements.solarHud.textContent = `☀️ Solar Irradiance: ${watts} W/m²`;
            elements.evapHud.textContent = `♨ Evaporation: ${evap} mm/day`;
            elements.sunAura.setAttribute('r', (36 + clampedPwr * 24).toFixed(0));
          }
        };

        svgEl.onpointerup = (e) => {
          if (activeDragTarget) {
            try {
              if (activeDragTarget === 'cloud') elements.cloudGroup.releasePointerCapture(e.pointerId);
              if (activeDragTarget === 'sun') elements.sunGroup.releasePointerCapture(e.pointerId);
            } catch {}
            activeDragTarget = null;
            elements.activeDragCloud = false;
          }
        };

        return elements;
      },
      update(t, el) {
        if (!el || !el.vapors) return;

        // Animate Ocean waves
        const waveShift = Math.sin(t * Math.PI * 4) * 4;
        el.oceanCrest.setAttribute('d', `M 0,${(350 + waveShift).toFixed(1)} Q 75,${(344 - waveShift).toFixed(1)} 150,${(350 + waveShift).toFixed(1)} T 300,${(350 - waveShift).toFixed(1)}`);

        // Animate River flow dashoffset
        el.riverFlow.setAttribute('stroke-dashoffset', (-t * 60).toFixed(1));

        // Animate Sun coronal rays pulsation
        const rayScale = 1 + Math.sin(t * Math.PI * 6) * 0.08 * el.sunPower;
        el.sunRays.setAttribute('transform', `scale(${rayScale.toFixed(3)})`);

        // Natural cloud drift if user is not actively dragging it
        if (!el.activeDragCloud) {
          const drift = Math.sin(t * Math.PI * 2 * el.windSpeed) * 35;
          const curCX = 420 + drift;
          el.cloudX = curCX;
          el.cloudGroup.setAttribute('transform', `translate(${curCX.toFixed(1)}, ${el.cloudY})`);
        }

        // Animate Evaporation Vapor Particles ascending from sea to cloud
        const activeVaporCount = Math.round(el.vapors.length * el.sunPower);
        for (let i = 0; i < el.vapors.length; i++) {
          const item = el.vapors[i];
          if (i < activeVaporCount) {
            item.el.style.display = 'inline';
            const progress = (t * 2 * item.speed + item.offset) % 1;
            const curY = 345 - progress * 190;
            // Drifts rightwards toward cloud with wind
            const curX = item.seedX + progress * (el.cloudX - item.seedX) * 0.7;
            const op = Math.sin(progress * Math.PI) * 0.75 * el.sunPower;

            item.el.setAttribute('cx', curX.toFixed(1));
            item.el.setAttribute('cy', curY.toFixed(1));
            item.el.setAttribute('opacity', op.toFixed(2));
          } else {
            item.el.style.display = 'none';
          }
        }

        // Animate Precipitation (Rain streaks or Snowflakes) falling from cloud base
        const cloudBaseY = el.cloudY + 30;
        const groundHitY = 360;

        for (let i = 0; i < el.precipItems.length; i++) {
          const drop = el.precipItems[i];
          const progress = (t * 3 * drop.speed + drop.phase) % 1;
          const dropX = el.cloudX + drop.offsetX;
          const dropY = cloudBaseY + progress * (groundHitY - cloudBaseY);

          if (el.isSnow) {
            // Snow falls gently with fluttering horizontal drift
            const snowDrift = Math.sin(t * 10 + i) * 6;
            drop.el.setAttribute('stroke', '#f8fafc');
            drop.el.setAttribute('stroke-width', '3');
            drop.el.setAttribute('x1', (dropX + snowDrift).toFixed(1));
            drop.el.setAttribute('y1', dropY.toFixed(1));
            drop.el.setAttribute('x2', (dropX + snowDrift + 1).toFixed(1));
            drop.el.setAttribute('y2', (dropY + 1).toFixed(1));
          } else {
            // Rain falls as fast angled streaks
            drop.el.setAttribute('stroke', '#60a5fa');
            drop.el.setAttribute('stroke-width', '2');
            drop.el.setAttribute('x1', dropX.toFixed(1));
            drop.el.setAttribute('y1', dropY.toFixed(1));
            drop.el.setAttribute('x2', (dropX - 3).toFixed(1));
            drop.el.setAttribute('y2', (dropY + 10).toFixed(1));
          }
        }
      },
      render(t) {
        return `<svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#030712;"><text x="400" y="240" fill="#f8fafc" font-size="20" text-anchor="middle">Water Cycle Living Simulation Stage</text></svg>`;
      }
    },

    'atom': {
      id: 'atom',
      stage: 'KS3 CHEMISTRY',
      title: 'Atomic Structure: Bohr Electron Shells',
      duration: 12.0,
      has3D: true,
      svgFile: 'scenes/atom.svg',
      astFile: 'scenes/atom.ast',
      keyframes: [
        { t: 0.00, title: 'Dense Nucleus', rule: 'Protons (+) and Neutrons (0) tightly bound in the atomic core.' },
        { t: 0.33, title: 'Inner K-Shell (n=1)', rule: 'Holds a maximum of 2 electrons in the lowest ground energy state.' },
        { t: 0.66, title: 'Outer L-Shell (n=2)', rule: 'Holds up to 8 electrons (Carbon has 4 valence electrons).' },
        { t: 1.00, title: 'Chemical Valence', rule: 'Valence electrons dictate bonding affinity with other elements.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.33, en: "At the center is the dense nucleus made of positively charged protons and neutral neutrons.", es: "En el centro está el núcleo denso con protones positivos y neutrones neutros." },
        { start: 0.33, end: 0.66, en: "Electrons orbit in quantized shells. The first shell can hold only 2 electrons.", es: "Los electrones orbitan en capas cuantizadas. La primera capa solo admite 2 electrones." },
        { start: 0.66, end: 1.00, en: "Carbon has 6 total electrons: 2 in the inner shell, and 4 in the valence shell.", es: "El carbono tiene 6 electrones: 2 en la capa interna y 4 en la capa de valencia." }
      ],
      mount(container) {
        const cx = 400, cy = 240;
        let html = '';
        html += `<circle cx="${cx}" cy="${cy}" r="75" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;
        html += `<circle cx="${cx}" cy="${cy}" r="145" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;
        html += `<circle cx="${cx - 5}" cy="${cy - 5}" r="11" fill="#ef4444" />`;
        html += `<circle cx="${cx + 6}" cy="${cy - 4}" r="11" fill="#94a3b8" />`;
        html += `<circle cx="${cx}" cy="${cy + 6}" r="11" fill="#ef4444" />`;
        html += `<text x="${cx}" y="${cy + 4}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">+ 0</text>`;

        html += `<circle id="atom-e1" cx="${cx + 75}" cy="${cy}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        html += `<circle id="atom-e2" cx="${cx - 75}" cy="${cy}" r="6" fill="#38bdf8" filter="url(#glow)" />`;

        for (let i = 0; i < 4; i++) {
          html += `<circle class="atom-oe" id="atom-oe-${i}" cx="${cx}" cy="${cy}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        }
        container.innerHTML = html;
        return {
          e1: container.querySelector('#atom-e1'),
          e2: container.querySelector('#atom-e2'),
          outer: Array.from(container.querySelectorAll('.atom-oe'))
        };
      },
      update(t, el) {
        if (!el || !el.e1) return;
        const cx = 400, cy = 240;
        const e1Angle = t * Math.PI * 2 * 3;
        el.e1.setAttribute('cx', (cx + Math.cos(e1Angle) * 75).toFixed(1));
        el.e1.setAttribute('cy', (cy + Math.sin(e1Angle) * 75).toFixed(1));
        el.e2.setAttribute('cx', (cx - Math.cos(e1Angle) * 75).toFixed(1));
        el.e2.setAttribute('cy', (cy - Math.sin(e1Angle) * 75).toFixed(1));

        const e2Angle = t * Math.PI * 2 * 1.2;
        for (let i = 0; i < el.outer.length; i++) {
          const a = e2Angle + (i * Math.PI / 2);
          el.outer[i].setAttribute('cx', (cx + Math.cos(a) * 145).toFixed(1));
          el.outer[i].setAttribute('cy', (cy + Math.sin(a) * 145).toFixed(1));
        }
      },
      render(t) {
        const cx = 400, cy = 240;
        let svg = '';
        svg += `<circle cx="${cx}" cy="${cy}" r="75" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="145" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;
        svg += `<circle cx="${cx - 5}" cy="${cy - 5}" r="11" fill="#ef4444" />`;
        svg += `<circle cx="${cx + 6}" cy="${cy - 4}" r="11" fill="#94a3b8" />`;
        svg += `<circle cx="${cx}" cy="${cy + 6}" r="11" fill="#ef4444" />`;
        svg += `<text x="${cx}" y="${cy + 4}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">+ 0</text>`;
        const e1Angle = t * Math.PI * 2 * 3;
        svg += `<circle cx="${(cx + Math.cos(e1Angle) * 75).toFixed(1)}" cy="${(cy + Math.sin(e1Angle) * 75).toFixed(1)}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        svg += `<circle cx="${(cx - Math.cos(e1Angle) * 75).toFixed(1)}" cy="${(cy - Math.sin(e1Angle) * 75).toFixed(1)}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        const e2Angle = t * Math.PI * 2 * 1.2;
        for (let i = 0; i < 4; i++) {
          const a = e2Angle + (i * Math.PI / 2);
          svg += `<circle cx="${(cx + Math.cos(a) * 145).toFixed(1)}" cy="${(cy + Math.sin(a) * 145).toFixed(1)}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        }
        return svg;
      }
    },

    'velocity': {
      id: 'velocity',
      stage: 'KS3 PHYSICS',
      title: 'Kinematics: Velocity & Distance-Time Vectors',
      duration: 10.0,
      svgFile: 'scenes/velocity.svg',
      astFile: 'scenes/velocity.ast',
      keyframes: [
        { t: 0.00, title: 'At Rest', rule: 'Position s = 0m, Velocity v = 0 m/s.' },
        { t: 0.35, title: 'Constant Acceleration', rule: 'Slope of Distance-Time curve steepens (v = u + at).' },
        { t: 0.70, title: 'Constant High Velocity', rule: 'Straight steep line represents high uniform speed.' },
        { t: 1.00, title: 'Deceleration to Stop', rule: 'Negative acceleration flattens curve back to zero velocity.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Watch the particle accelerate from rest along the vector track.", es: "Observa cómo la partícula acelera desde el reposo en la pista vectorial." },
        { start: 0.35, end: 0.70, en: "The slope on the distance-time graph represents instant velocity: steep slope = fast speed.", es: "La pendiente de la gráfica representa la velocidad instantánea: pendiente empinada = alta velocidad." },
        { start: 0.70, end: 1.00, en: "Braking applies negative acceleration, flattening the velocity graph to zero.", es: "El frenado aplica aceleración negativa, aplanando la gráfica a cero." }
      ],
      mount(container) {
        const trackY = 130, startX = 120, endX = 680;
        let html = '';
        html += `<line x1="${startX}" y1="${trackY}" x2="${endX}" y2="${trackY}" stroke="#334155" stroke-width="4" stroke-linecap="round" />`;
        for (let m = 0; m <= 4; m++) {
          const mx = startX + (m / 4) * (endX - startX);
          html += `<line x1="${mx}" y1="${trackY - 8}" x2="${mx}" y2="${trackY + 8}" stroke="#64748b" stroke-width="2" />`;
          html += `<text x="${mx}" y="${trackY + 24}" fill="#94a3b8" font-size="11" text-anchor="middle">${m * 25}m</text>`;
        }
        html += `<circle id="vel-particle" cx="${startX}" cy="${trackY}" r="12" fill="#38bdf8" filter="url(#glow)" />`;
        html += `<line id="vel-arrow-line" x1="${startX}" y1="${trackY - 18}" x2="${startX + 20}" y2="${trackY - 18}" stroke="#10b981" stroke-width="3" />`;
        html += `<polygon id="vel-arrow-head" points="${startX + 20},${trackY - 22} ${startX + 26},${trackY - 18} ${startX + 20},${trackY - 14}" fill="#10b981" />`;

        const gx = 200, gy = 230, gw = 400, gh = 180;
        html += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#0f172a" stroke="#1e293b" rx="8" />`;
        html += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + gw - 20}" y2="${gy + gh - 30}" stroke="#475569" stroke-width="2" />`;
        html += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + 40}" y2="${gy + 20}" stroke="#475569" stroke-width="2" />`;
        html += `<text x="${gx + 30}" y="${gy + 35}" fill="#94a3b8" font-size="11" text-anchor="end">s (m)</text>`;
        html += `<text x="${gx + gw - 20}" y="${gy + gh - 12}" fill="#94a3b8" font-size="11" text-anchor="end">t (s)</text>`;
        html += `<polyline id="vel-curve" points="" fill="none" stroke="#38bdf8" stroke-width="3" />`;

        container.innerHTML = html;
        return {
          particle: container.querySelector('#vel-particle'),
          arrowLine: container.querySelector('#vel-arrow-line'),
          arrowHead: container.querySelector('#vel-arrow-head'),
          curve: container.querySelector('#vel-curve'),
        };
      },
      update(t, el) {
        if (!el || !el.particle) return;
        const trackY = 130, startX = 120, endX = 680;
        const currentX = startX + t * (endX - startX);
        el.particle.setAttribute('cx', currentX.toFixed(1));

        const arrowLen = Math.sin(t * Math.PI) * 40 + 15;
        el.arrowLine.setAttribute('x1', currentX.toFixed(1));
        el.arrowLine.setAttribute('x2', (currentX + arrowLen).toFixed(1));
        el.arrowHead.setAttribute('points', `${(currentX + arrowLen).toFixed(1)},${trackY - 22} ${(currentX + arrowLen + 6).toFixed(1)},${trackY - 18} ${(currentX + arrowLen).toFixed(1)},${trackY - 14}`);

        const gx = 200, gy = 230, gw = 400, gh = 180;
        const curvePoints = [];
        const steps = Math.floor(t * 30);
        for (let i = 0; i <= steps; i++) {
          const ptT = i / 30;
          const px = gx + 40 + ptT * (gw - 70);
          const py = gy + gh - 30 - Math.pow(ptT, 1.6) * (gh - 60);
          curvePoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        el.curve.setAttribute('points', curvePoints.join(' '));
      },
      render(t) {
        let svg = '';
        const trackY = 130, startX = 120, endX = 680;
        const currentX = startX + t * (endX - startX);
        svg += `<line x1="${startX}" y1="${trackY}" x2="${endX}" y2="${trackY}" stroke="#334155" stroke-width="4" stroke-linecap="round" />`;
        for (let m = 0; m <= 4; m++) {
          const mx = startX + (m / 4) * (endX - startX);
          svg += `<line x1="${mx}" y1="${trackY - 8}" x2="${mx}" y2="${trackY + 8}" stroke="#64748b" stroke-width="2" />`;
          svg += `<text x="${mx}" y="${trackY + 24}" fill="#94a3b8" font-size="11" text-anchor="middle">${m * 25}m</text>`;
        }
        svg += `<circle cx="${currentX.toFixed(1)}" cy="${trackY}" r="12" fill="#38bdf8" filter="url(#glow)" />`;
        const arrowLen = Math.sin(t * Math.PI) * 40 + 15;
        svg += `<line x1="${currentX}" y1="${trackY - 18}" x2="${currentX + arrowLen}" y2="${trackY - 18}" stroke="#10b981" stroke-width="3" />`;
        svg += `<polygon points="${currentX + arrowLen},${trackY - 22} ${currentX + arrowLen + 6},${trackY - 18} ${currentX + arrowLen},${trackY - 14}" fill="#10b981" />`;
        const gx = 200, gy = 230, gw = 400, gh = 180;
        svg += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#0f172a" stroke="#1e293b" rx="8" />`;
        svg += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + gw - 20}" y2="${gy + gh - 30}" stroke="#475569" stroke-width="2" />`;
        svg += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + 40}" y2="${gy + 20}" stroke="#475569" stroke-width="2" />`;
        svg += `<text x="${gx + 30}" y="${gy + 35}" fill="#94a3b8" font-size="11" text-anchor="end">s (m)</text>`;
        svg += `<text x="${gx + gw - 20}" y="${gy + gh - 12}" fill="#94a3b8" font-size="11" text-anchor="end">t (s)</text>`;
        const curvePoints = [];
        const steps = Math.floor(t * 30);
        for (let i = 0; i <= steps; i++) {
          const ptT = i / 30;
          const px = gx + 40 + ptT * (gw - 70);
          const py = gy + gh - 30 - Math.pow(ptT, 1.6) * (gh - 60);
          curvePoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        if (curvePoints.length > 1) {
          svg += `<polyline points="${curvePoints.join(' ')}" fill="none" stroke="#38bdf8" stroke-width="3" />`;
        }
        return svg;
      }
    },

    'dna-helix': {
      id: 'dna-helix',
      stage: 'KS3 GENETICS',
      title: 'Genetics: DNA Base Pairing & Transcription',
      duration: 12.0,
      has3D: true,
      svgFile: 'scenes/dna-helix.svg',
      astFile: 'scenes/dna-helix.ast',
      keyframes: [
        { t: 0.00, title: 'Double Helix Geometry', rule: 'Anti-parallel sugar-phosphate backbones spiraling in 3D.' },
        { t: 0.35, title: 'Watson-Crick Base Pairs', rule: 'Adenine (A) always pairs with Thymine (T) via 2 hydrogen bonds.' },
        { t: 0.70, title: 'Cytosine-Guanine Pairs', rule: 'Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds.' },
        { t: 1.00, title: 'Replication Fork Unzip', rule: 'Helicase enzyme unzips hydrogen bonds for semi-conservative replication.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "DNA contains hereditary code structured as a winding double helix.", es: "El ADN contiene el código genético estructurado como una doble hélice." },
        { start: 0.35, end: 0.70, en: "Complementary base rule: Adenine binds to Thymine; Guanine binds to Cytosine.", es: "Regla complementaria: La Adenina se une a Timina; Guanina a Citosina." },
        { start: 0.70, end: 1.00, en: "Hydrogen bonds hold the rungs together, unzipping during cell division replication.", es: "Los puentes de hidrógeno unen las bases, abriéndose en la replicación celular." }
      ],
      mount(container) {
        const cx = 400, numPairs = 18, totalHeight = 360, startY = 60;
        let html = '';
        const baseColors = [
          { a: '#ef4444', b: '#10b981' },
          { a: '#3b82f6', b: '#f59e0b' },
        ];
        for (let i = 0; i < numPairs; i++) {
          const pair = baseColors[i % 2];
          const y = startY + (i / numPairs) * totalHeight;
          html += `<line id="dna-line-${i}" x1="${cx - 100}" y1="${y}" x2="${cx + 100}" y2="${y}" stroke="#64748b" stroke-width="2.5" />`;
          html += `<circle id="dna-ca-${i}" cx="${cx - 100}" cy="${y}" r="8" fill="${pair.a}" />`;
          html += `<circle id="dna-cb-${i}" cx="${cx + 100}" cy="${y}" r="8" fill="${pair.b}" />`;
        }
        container.innerHTML = html;
        const rungs = [];
        for (let i = 0; i < numPairs; i++) {
          rungs.push({
            line: container.querySelector(`#dna-line-${i}`),
            ca: container.querySelector(`#dna-ca-${i}`),
            cb: container.querySelector(`#dna-cb-${i}`),
            y: startY + (i / numPairs) * totalHeight,
            pairT: i / numPairs
          });
        }
        return { rungs };
      },
      update(t, el) {
        if (!el || !el.rungs) return;
        const cx = 400;
        for (let i = 0; i < el.rungs.length; i++) {
          const r = el.rungs[i];
          const angle = r.pairT * Math.PI * 3 + t * Math.PI * 2;
          const offset = Math.cos(angle) * 110;
          const x1 = cx - offset;
          const x2 = cx + offset;
          const zDepth = Math.sin(angle);
          const opacity = ((zDepth + 1.5) / 2.5).toFixed(2);

          r.line.setAttribute('x1', x1.toFixed(1));
          r.line.setAttribute('x2', x2.toFixed(1));
          r.line.setAttribute('opacity', opacity);
          r.ca.setAttribute('cx', x1.toFixed(1));
          r.ca.setAttribute('opacity', opacity);
          r.cb.setAttribute('cx', x2.toFixed(1));
          r.cb.setAttribute('opacity', opacity);
        }
      },
      render(t) {
        let svg = '';
        const cx = 400, numPairs = 18, totalHeight = 360, startY = 60;
        for (let i = 0; i < numPairs; i++) {
          const pairT = i / numPairs;
          const y = startY + pairT * totalHeight;
          const angle = pairT * Math.PI * 3 + t * Math.PI * 2;
          const offset = Math.cos(angle) * 110;
          const x1 = cx - offset;
          const x2 = cx + offset;
          const zDepth = Math.sin(angle);
          const baseColors = [
            { a: '#ef4444', b: '#10b981' },
            { a: '#3b82f6', b: '#f59e0b' },
          ];
          const pair = baseColors[i % 2];
          const opacity = (zDepth + 1.5) / 2.5;
          svg += `<line x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}" stroke="#64748b" stroke-width="2.5" opacity="${opacity.toFixed(2)}" />`;
          svg += `<circle cx="${x1.toFixed(1)}" cy="${y}" r="8" fill="${pair.a}" opacity="${opacity.toFixed(2)}" />`;
          svg += `<circle cx="${x2.toFixed(1)}" cy="${y}" r="8" fill="${pair.b}" opacity="${opacity.toFixed(2)}" />`;
        }
        return svg;
      }
    },

    'church-tour': {
      id: 'church-tour',
      stage: 'CATHOLIC LIFE',
      title: 'Tour of a Catholic Church: Sacred Architecture & Sacred Spaces',
      duration: 16.0,
      has3D: true,
      camera: { distance: 490, pitch: 22, yaw: 0, fov: 58 },
      svgFile: 'scenes/church-tour.svg',
      astFile: 'scenes/church-tour.ast',
      interactive: {
        hotspots: [
          { id: 'narthex', label: '1. Narthex & Holy Water Stoup', targetT: 0.00 },
          { id: 'nave', label: '2. Nave & Central Aisle', targetT: 0.20 },
          { id: 'ambo', label: '3. The Ambo (Lectern)', targetT: 0.40 },
          { id: 'altar', label: '4. Altar of Sacrifice', targetT: 0.60 },
          { id: 'tabernacle', label: '5. Tabernacle & Sanctuary Lamp', targetT: 0.80 },
          { id: 'lady-chapel', label: '6. Lady Chapel & Baptismal Font', targetT: 1.00 }
        ],
        checkpoints: [
          {
            t: 0.38,
            title: 'Pilgrim Station Check',
            prompt: 'Why do Catholics genuflect on the right knee when entering our pew in the Nave?',
            options: [
              'To show polite respect to the priest',
              'Because Christ is truly present in the Tabernacle',
              'It is a traditional medieval stretch'
            ],
            answer: 1,
            explanation: 'Genuflecting is an act of royal worship acknowledging Jesus Christ truly present in the Eucharist inside the Tabernacle.'
          },
          {
            t: 0.78,
            title: 'Sanctuary Liturgy Check',
            prompt: 'What burns constantly beside the Tabernacle to remind us that Jesus is present?',
            options: [
              'Incense grains in a boat',
              'The red Sanctuary Lamp',
              'The Paschal baptismal candle'
            ],
            answer: 1,
            explanation: 'The red Sanctuary Lamp is kept burning day and night to indicate the Real Presence of Christ in the Blessed Sacrament.'
          },
          {
            t: 0.98,
            title: 'Sacrament of Initiation Check',
            prompt: 'Which sacred area contains the holy waters where original sin is washed away?',
            options: [
              'The Baptismal Font',
              'The Sedilia',
              'The Credence Table'
            ],
            answer: 0,
            explanation: 'The Baptismal Font holds the sanctified waters of Holy Baptism, welcoming new Christians into God’s family.'
          }
        ]
      },
      keyframes: [
        { t: 0.00, title: '1. Narthex & Holy Water Stoup', rule: 'Vestibulum: We bless ourselves with Holy Water to recall our Baptism.' },
        { t: 0.20, title: '2. Nave & Central Aisle', rule: 'Navis: The Pilgrim People of God; we genuflect towards the Tabernacle before entering our pew.' },
        { t: 0.40, title: '3. Ambo (Lectern)', rule: 'Mensa Verbi: The Table of the Word from which the Holy Gospel is proclaimed.' },
        { t: 0.60, title: '4. Altar of Sacrifice', rule: 'Altare Christi: Represents Christ Himself and the Holy Sacrifice of the Mass.' },
        { t: 0.80, title: '5. Tabernacle & Sanctuary Lamp', rule: 'Tabernaculum: Houses the Blessed Sacrament; red lamp indicates Christ\'s Real Presence.' },
        { t: 1.00, title: '6. Lady Chapel & Baptismal Font', rule: 'Fons & Sacellum: Devotional side chapel of Our Lady and the waters of new birth.' }
      ],
      subtitles: [
        {
          start: 0.0,
          end: 0.20,
          en: "We enter through the Narthex, blessing ourselves with Holy Water in the Name of the Father, Son, and Holy Spirit.",
          es: "Entramos por el Nártex, bendiciéndonos con Agua Bendita en el Nombre del Padre, del Hijo y del Espíritu Santo.",
          la: "In nomine Patris, et Filii, et Spiritus Sancti. Aqua benedicta ad memoriam baptismi."
        },
        {
          start: 0.20,
          end: 0.40,
          en: "Walking up the central aisle of the Nave, we genuflect on our right knee toward the Tabernacle before entering our pew.",
          es: "Por el pasillo de la Nave, hacemos una genuflexión con la rodilla derecha hacia el Sagrario antes de sentarnos.",
          la: "Ad Tabernaculum flectamus genua, Christum Dominum verum Deum adorantes."
        },
        {
          start: 0.40,
          end: 0.60,
          en: "The Ambo is the Table of the Word, where the Holy Gospel and readings of Sacred Scripture are proclaimed.",
          es: "El Ambón es la Mesa de la Palabra, donde se proclaman las lecturas de la Sagrada Escritura y el Evangelio.",
          la: "Ambo est mensa Verbi Dei, unde Sanctum Evangelium fidelibus annuntiatur."
        },
        {
          start: 0.60,
          end: 0.80,
          en: "The Altar is the sacred center representing Christ Himself, where the bread and wine become His Body and Blood.",
          es: "El Altar es el centro sagrado que representa a Cristo, donde el pan y el vino se convierten en Su Cuerpo y Sangre.",
          la: "Altare est Christus: hic sacrificium eucharisticum in remissionem peccatorum offertur."
        },
        {
          start: 0.80,
          end: 1.00,
          en: "The golden Tabernacle holds the Real Presence of Christ in the Eucharist, watched over by the burning red Sanctuary Lamp.",
          es: "El Sagrario dorado guarda la Presencia Real de Jesús en la Eucaristía, acompañado por la lámpara roja del Santuario.",
          la: "Ecce panis angelorum: in Tabernaculo Christus vere et substantialiter praesens permanet."
        }
      ],
      mount(container) {
        let html = '';
        // 1. Deep Sacred Basilica Floor Architecture
        html += `<path d="M 310 440 L 310 240 L 160 240 L 160 160 L 310 160 L 310 50 Q 400 30, 490 50 L 490 160 L 640 160 L 640 240 L 490 240 L 490 440 Z" fill="#0b1120" stroke="#334155" stroke-width="3" />`;
        html += `<path d="M 310 390 L 490 390 M 310 340 L 490 340 M 310 290 L 490 290 M 310 240 L 490 240" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="2 4" />`;

        // 2. Nave Central Royal Carpet & Pews
        html += `<g class="ast-hotspot" data-target-t="0.20" data-label="2. The Nave & Central Aisle" style="cursor: pointer;">`;
        html += `<rect x="375" y="180" width="50" height="260" fill="#7f1d1d" opacity="0.85" rx="2" />`;
        html += `<line x1="375" y1="180" x2="375" y2="440" stroke="#dc2626" stroke-width="1.5" />`;
        html += `<line x1="425" y1="180" x2="425" y2="440" stroke="#dc2626" stroke-width="1.5" />`;
        for (let i = 0; i < 5; i++) {
          const pewY = 250 + i * 36;
          html += `<rect x="320" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          html += `<line x1="324" y1="${pewY + 4}" x2="362" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
          html += `<rect x="434" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          html += `<line x1="438" y1="${pewY + 4}" x2="476" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
        }
        html += `</g>`;

        // 3. Elevated Sanctuary Platform & Altar of Sacrifice
        html += `<path d="M 310 180 L 490 180 L 490 60 Q 400 45, 310 60 Z" fill="#1e293b" stroke="#475569" stroke-width="2" />`;
        html += `<path d="M 325 170 L 475 170 L 475 70 Q 400 58, 325 70 Z" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />`;
        html += `<g class="ast-hotspot" data-target-t="0.60" data-label="4. The Altar of Sacrifice" style="cursor: pointer;">`;
        html += `<rect x="360" y="115" width="80" height="34" rx="4" fill="#e2e8f0" stroke="#f8fafc" stroke-width="2" />`;
        html += `<rect x="366" y="119" width="68" height="26" rx="2" fill="#cbd5e1" />`;
        html += `<circle cx="372" cy="128" r="3.5" fill="#facc15" filter="url(#glow)" />`;
        html += `<circle cx="428" cy="128" r="3.5" fill="#facc15" filter="url(#glow)" />`;
        html += `<line x1="400" y1="110" x2="400" y2="124" stroke="#eab308" stroke-width="2.5" />`;
        html += `<line x1="394" y1="115" x2="406" y2="115" stroke="#eab308" stroke-width="2" />`;
        html += `<text x="400" y="138" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">ALTAR</text>`;
        html += `</g>`;

        // 4. Tabernacle of the Blessed Sacrament & Red Sanctuary Lamp
        html += `<g class="ast-hotspot" data-target-t="0.80" data-label="5. The Tabernacle & Sanctuary Lamp" style="cursor: pointer;">`;
        html += `<rect x="382" y="58" width="36" height="28" rx="3" fill="#eab308" stroke="#fef08a" stroke-width="2" filter="url(#glow)" />`;
        html += `<line x1="400" y1="62" x2="400" y2="76" stroke="#78350f" stroke-width="2" />`;
        html += `<line x1="392" y1="68" x2="408" y2="68" stroke="#78350f" stroke-width="1.5" />`;
        html += `<text x="400" y="82" fill="#78350f" font-size="7" font-weight="900" text-anchor="middle">IHS</text>`;
        html += `<circle id="church-lamp" cx="432" cy="72" r="7.5" fill="#ef4444" filter="url(#glow)" />`;
        html += `<circle cx="432" cy="72" r="4" fill="#fee2e2" />`;
        html += `<line x1="432" y1="52" x2="432" y2="66" stroke="#94a3b8" stroke-width="1" />`;
        html += `</g>`;

        // 5. Ambo (Table of the Word)
        html += `<g class="ast-hotspot" data-target-t="0.40" data-label="3. The Ambo (Lectern)" style="cursor: pointer;">`;
        html += `<rect x="330" y="125" width="22" height="24" rx="2" fill="#2563eb" stroke="#60a5fa" stroke-width="1.5" />`;
        html += `<path d="M 333 130 L 341 127 L 349 130" stroke="#ffffff" stroke-width="1.5" fill="none" />`;
        html += `<text x="341" y="145" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">AMBO</text>`;
        html += `</g>`;

        // 6. Lady Chapel Devotional Shrine (North Transept)
        html += `<g class="ast-hotspot" data-target-t="0.94" data-label="6A. Lady Chapel" style="cursor: pointer;">`;
        html += `<rect x="175" y="175" width="120" height="50" rx="4" fill="#172554" stroke="#2563eb" stroke-width="1.5" />`;
        html += `<circle cx="205" cy="200" r="10" fill="#38bdf8" filter="url(#glow)" />`;
        html += `<text x="205" y="204" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">★</text>`;
        html += `<text x="245" y="196" fill="#93c5fd" font-size="9" font-weight="bold">LADY CHAPEL</text>`;
        html += `<text x="245" y="208" fill="#bfdbfe" font-size="8">Devotional Prayer</text>`;
        html += `</g>`;

        // 7. Baptismal Font (South Transept)
        html += `<g class="ast-hotspot" data-target-t="1.00" data-label="6B. Baptismal Font" style="cursor: pointer;">`;
        html += `<rect x="505" y="175" width="120" height="50" rx="4" fill="#14532d" stroke="#16a34a" stroke-width="1.5" />`;
        html += `<polygon points="535,190 545,190 552,197 552,205 545,212 535,212 528,205 528,197" fill="#0284c7" stroke="#38bdf8" stroke-width="2" filter="url(#glow)" />`;
        html += `<circle cx="540" cy="201" r="4" fill="#e0f2fe" />`;
        html += `<text x="562" y="196" fill="#86efac" font-size="9" font-weight="bold">BAPTISMAL FONT</text>`;
        html += `<text x="562" y="208" fill="#bbf7d0" font-size="8">Sacrament of Initiation</text>`;
        html += `</g>`;

        // 8. Narthex & Holy Water Stoup (Entrance)
        html += `<g class="ast-hotspot" data-target-t="0.00" data-label="1. Narthex & Holy Water Stoup" style="cursor: pointer;">`;
        html += `<rect x="310" y="415" width="180" height="30" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5" />`;
        html += `<circle cx="330" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        html += `<circle cx="470" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        html += `<text x="400" y="434" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">NARTHEX &bull; ENTRANCE</text>`;
        html += `</g>`;

        // 9. Moving Pilgrim Spotlight & Avatar
        html += `<circle id="spot-halo" cx="400" cy="430" r="38" fill="rgba(56, 189, 248, 0.14)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" filter="url(#glow)" />`;
        html += `<circle id="spot-dot" cx="400" cy="430" r="8" fill="#38bdf8" filter="url(#glow)" />`;
        html += `<circle id="spot-core" cx="400" cy="430" r="4" fill="#ffffff" />`;

        // 10. Architectural Station HUD Banner
        html += `<rect x="110" y="12" width="580" height="42" rx="8" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />`;
        html += `<text id="church-hud-title" x="130" y="29" fill="#38bdf8" font-size="12" font-weight="800">1. NARTHEX & HOLY WATER STOUP</text>`;
        html += `<text id="church-hud-desc" x="130" y="44" fill="#94a3b8" font-size="10">Vestibulum & Aqua Benedicta &bull; Blessing ourselves with Holy Water...</text>`;
        html += `<circle cx="664" cy="33" r="11" fill="#2563eb" />`;
        html += `<text x="664" y="37" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle">⛪</text>`;

        container.innerHTML = html;
        return {
          lamp: container.querySelector('#church-lamp'),
          spotDot: container.querySelector('#spot-dot'),
          spotHalo: container.querySelector('#spot-halo'),
          spotCore: container.querySelector('#spot-core'),
          hudTitle: container.querySelector('#church-hud-title'),
          hudDesc: container.querySelector('#church-hud-desc'),
        };
      },
      update(t, el) {
        if (!el) return;
        const lampPulse = 0.7 + Math.sin(t * Math.PI * 8) * 0.3;
        if (el.lamp) el.lamp.setAttribute('opacity', lampPulse.toFixed(2));

        let camX = 400, camY = 430;
        let stationTitle = "1. NARTHEX & HOLY WATER STOUP";
        let stationLatin = "Vestibulum & Aqua Benedicta";
        let stationDesc = "Blessing ourselves with Holy Water in the Name of the Trinity to recall our Baptism.";

        if (t < 0.20) {
          const subT = t / 0.20;
          camX = 400;
          camY = 435 - subT * 35;
          stationTitle = "1. NARTHEX & HOLY WATER STOUP";
          stationLatin = "Vestibulum & Aqua Benedicta";
          stationDesc = "Blessing ourselves with Holy Water in the Name of the Trinity to recall our Baptism.";
        } else if (t < 0.40) {
          const subT = (t - 0.20) / 0.20;
          camX = 400;
          camY = 400 - subT * 120;
          stationTitle = "2. THE NAVE & PEWS";
          stationLatin = "Navis Ecclesiae";
          stationDesc = "The Pilgrim People of God. We genuflect toward the Tabernacle before entering our pew.";
        } else if (t < 0.60) {
          const subT = (t - 0.40) / 0.20;
          camX = 400 - subT * 59;
          camY = 280 - subT * 140;
          stationTitle = "3. THE AMBO (LECTERN)";
          stationLatin = "Mensa Verbi Dei";
          stationDesc = "The Table of the Word from which the Sacred Scriptures and Holy Gospel are proclaimed.";
        } else if (t < 0.80) {
          const subT = (t - 0.60) / 0.20;
          camX = 341 + subT * 59;
          camY = 140 - subT * 12;
          stationTitle = "4. THE ALTAR OF SACRIFICE";
          stationLatin = "Altare Christi";
          stationDesc = "The focal center representing Christ Himself, where the Holy Sacrifice of the Mass is celebrated.";
        } else if (t < 0.92) {
          const subT = (t - 0.80) / 0.12;
          camX = 400;
          camY = 128 - subT * 56;
          stationTitle = "5. THE TABERNACLE & SANCTUARY LAMP";
          stationLatin = "Tabernaculum Domini";
          stationDesc = "The sacred golden dwelling of the Blessed Sacrament. The red lamp burns for Christ's Real Presence.";
        } else {
          const subT = (t - 0.92) / 0.08;
          camX = 400 - Math.cos(subT * Math.PI) * 180;
          camY = 190;
          stationTitle = "6. LADY CHAPEL & BAPTISMAL FONT";
          stationLatin = "Sacellum Marianum & Fons";
          stationDesc = "Devotional prayer with Mary and St Joseph, and the holy waters of Christian new birth.";
        }

        if (el.spotDot) {
          el.spotDot.setAttribute('cx', camX.toFixed(1));
          el.spotDot.setAttribute('cy', camY.toFixed(1));
        }
        if (el.spotHalo) {
          el.spotHalo.setAttribute('cx', camX.toFixed(1));
          el.spotHalo.setAttribute('cy', camY.toFixed(1));
        }
        if (el.spotCore) {
          el.spotCore.setAttribute('cx', camX.toFixed(1));
          el.spotCore.setAttribute('cy', camY.toFixed(1));
        }
        if (el.hudTitle) el.hudTitle.textContent = stationTitle;
        if (el.hudDesc) el.hudDesc.textContent = `${stationLatin} • ${stationDesc.slice(0, 52)}...`;
      },
      render(t) {
        let svg = '';
        svg += `<path d="M 310 440 L 310 240 L 160 240 L 160 160 L 310 160 L 310 50 Q 400 30, 490 50 L 490 160 L 640 160 L 640 240 L 490 240 L 490 440 Z" fill="#0b1120" stroke="#334155" stroke-width="3" />`;
        svg += `<path d="M 310 390 L 490 390 M 310 340 L 490 340 M 310 290 L 490 290 M 310 240 L 490 240" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="2 4" />`;
        svg += `<g class="ast-hotspot" data-target-t="0.20" data-label="2. The Nave & Central Aisle">`;
        svg += `<rect x="375" y="180" width="50" height="260" fill="#7f1d1d" opacity="0.8" rx="2" />`;
        svg += `<line x1="375" y1="180" x2="375" y2="440" stroke="#b91c1c" stroke-width="1.5" />`;
        svg += `<line x1="425" y1="180" x2="425" y2="440" stroke="#b91c1c" stroke-width="1.5" />`;
        for (let i = 0; i < 5; i++) {
          const pewY = 250 + i * 36;
          svg += `<rect x="320" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          svg += `<line x1="324" y1="${pewY + 4}" x2="362" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
          svg += `<rect x="434" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          svg += `<line x1="438" y1="${pewY + 4}" x2="476" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
        }
        svg += `</g>`;
        svg += `<path d="M 310 180 L 490 180 L 490 60 Q 400 45, 310 60 Z" fill="#1e293b" stroke="#475569" stroke-width="2" />`;
        svg += `<path d="M 325 170 L 475 170 L 475 70 Q 400 58, 325 70 Z" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />`;
        svg += `<g class="ast-hotspot" data-target-t="0.60" data-label="4. The Altar of Sacrifice">`;
        svg += `<rect x="360" y="115" width="80" height="34" rx="4" fill="#e2e8f0" stroke="#f8fafc" stroke-width="2" />`;
        svg += `<rect x="366" y="119" width="68" height="26" rx="2" fill="#cbd5e1" />`;
        svg += `<circle cx="372" cy="128" r="3" fill="#facc15" filter="url(#glow)" />`;
        svg += `<circle cx="428" cy="128" r="3" fill="#facc15" filter="url(#glow)" />`;
        svg += `<line x1="400" y1="110" x2="400" y2="124" stroke="#eab308" stroke-width="2.5" />`;
        svg += `<line x1="394" y1="115" x2="406" y2="115" stroke="#eab308" stroke-width="2" />`;
        svg += `<text x="400" y="138" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">ALTAR</text>`;
        svg += `</g>`;
        const lampPulse = 0.7 + Math.sin(t * Math.PI * 8) * 0.3;
        svg += `<g class="ast-hotspot" data-target-t="0.80" data-label="5. The Tabernacle & Sanctuary Lamp">`;
        svg += `<rect x="382" y="58" width="36" height="28" rx="3" fill="#eab308" stroke="#fef08a" stroke-width="2" filter="url(#glow)" />`;
        svg += `<line x1="400" y1="62" x2="400" y2="76" stroke="#78350f" stroke-width="2" />`;
        svg += `<line x1="392" y1="68" x2="408" y2="68" stroke="#78350f" stroke-width="1.5" />`;
        svg += `<text x="400" y="82" fill="#78350f" font-size="7" font-weight="900" text-anchor="middle">IHS</text>`;
        svg += `<circle cx="432" cy="72" r="7" fill="#ef4444" opacity="${lampPulse.toFixed(2)}" filter="url(#glow)" />`;
        svg += `<circle cx="432" cy="72" r="4" fill="#fee2e2" />`;
        svg += `<line x1="432" y1="52" x2="432" y2="66" stroke="#94a3b8" stroke-width="1" />`;
        svg += `</g>`;
        svg += `<g class="ast-hotspot" data-target-t="0.40" data-label="3. The Ambo (Lectern)">`;
        svg += `<rect x="330" y="125" width="22" height="24" rx="2" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.5" />`;
        svg += `<path d="M 333 130 L 341 127 L 349 130" stroke="#ffffff" stroke-width="1.5" fill="none" />`;
        svg += `<text x="341" y="145" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">AMBO</text>`;
        svg += `</g>`;
        svg += `<rect x="448" y="128" width="20" height="18" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5" />`;
        svg += `<g class="ast-hotspot" data-target-t="0.94" data-label="6A. Lady Chapel">`;
        svg += `<rect x="175" y="175" width="120" height="50" rx="4" fill="#172554" stroke="#2563eb" stroke-width="1.5" />`;
        svg += `<circle cx="205" cy="200" r="10" fill="#38bdf8" filter="url(#glow)" />`;
        svg += `<text x="205" y="204" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">★</text>`;
        svg += `<text x="245" y="196" fill="#93c5fd" font-size="9" font-weight="bold">LADY CHAPEL</text>`;
        svg += `<text x="245" y="208" fill="#bfdbfe" font-size="8">Devotional Prayer</text>`;
        svg += `</g>`;
        svg += `<g class="ast-hotspot" data-target-t="1.00" data-label="6B. Baptismal Font">`;
        svg += `<rect x="505" y="175" width="120" height="50" rx="4" fill="#14532d" stroke="#16a34a" stroke-width="1.5" />`;
        svg += `<polygon points="535,190 545,190 552,197 552,205 545,212 535,212 528,205 528,197" fill="#0284c7" stroke="#38bdf8" stroke-width="2" filter="url(#glow)" />`;
        svg += `<circle cx="540" cy="201" r="4" fill="#e0f2fe" />`;
        svg += `<text x="562" y="196" fill="#86efac" font-size="9" font-weight="bold">BAPTISMAL FONT</text>`;
        svg += `<text x="562" y="208" fill="#bbf7d0" font-size="8">Sacrament of Initiation</text>`;
        svg += `</g>`;
        svg += `<g class="ast-hotspot" data-target-t="0.00" data-label="1. Narthex & Holy Water Stoup">`;
        svg += `<rect x="310" y="415" width="180" height="30" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5" />`;
        svg += `<circle cx="330" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        svg += `<circle cx="470" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        svg += `<text x="400" y="434" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">NARTHEX &bull; ENTRANCE</text>`;
        svg += `</g>`;

        let camX = 400, camY = 430;
        let stationTitle = "1. NARTHEX & HOLY WATER STOUP";
        let stationLatin = "Vestibulum & Aqua Benedicta";
        let stationDesc = "Blessing ourselves with Holy Water in the Name of the Trinity to recall our Baptism.";

        if (t < 0.20) {
          const subT = t / 0.20;
          camX = 400;
          camY = 435 - subT * 35;
          stationTitle = "1. NARTHEX & HOLY WATER STOUP";
          stationLatin = "Vestibulum & Aqua Benedicta";
          stationDesc = "Blessing ourselves with Holy Water in the Name of the Trinity to recall our Baptism.";
        } else if (t < 0.40) {
          const subT = (t - 0.20) / 0.20;
          camX = 400;
          camY = 400 - subT * 120;
          stationTitle = "2. THE NAVE & PEWS";
          stationLatin = "Navis Ecclesiae";
          stationDesc = "The Pilgrim People of God. We genuflect toward the Tabernacle before entering our pew.";
        } else if (t < 0.60) {
          const subT = (t - 0.40) / 0.20;
          camX = 400 - subT * 59;
          camY = 280 - subT * 140;
          stationTitle = "3. THE AMBO (LECTERN)";
          stationLatin = "Mensa Verbi Dei";
          stationDesc = "The Table of the Word from which the Sacred Scriptures and Holy Gospel are proclaimed.";
        } else if (t < 0.80) {
          const subT = (t - 0.60) / 0.20;
          camX = 341 + subT * 59;
          camY = 140 - subT * 12;
          stationTitle = "4. THE ALTAR OF SACRIFICE";
          stationLatin = "Altare Christi";
          stationDesc = "The focal center representing Christ Himself, where the Holy Sacrifice of the Mass is celebrated.";
        } else if (t < 0.92) {
          const subT = (t - 0.80) / 0.12;
          camX = 400;
          camY = 128 - subT * 56;
          stationTitle = "5. THE TABERNACLE & SANCTUARY LAMP";
          stationLatin = "Tabernaculum Domini";
          stationDesc = "The sacred golden dwelling of the Blessed Sacrament. The red lamp burns for Christ's Real Presence.";
        } else {
          const subT = (t - 0.92) / 0.08;
          camX = 400 - Math.cos(subT * Math.PI) * 180;
          camY = 190;
          stationTitle = "6. LADY CHAPEL & BAPTISMAL FONT";
          stationLatin = "Sacellum Marianum & Fons";
          stationDesc = "Devotional prayer with Mary and St Joseph, and the holy waters of Christian new birth.";
        }

        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="38" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" filter="url(#glow)" />`;
        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="8" fill="#38bdf8" />`;
        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="4" fill="#ffffff" />`;

        svg += `<rect x="140" y="16" width="520" height="42" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5" />`;
        svg += `<text x="154" y="32" fill="#38bdf8" font-size="12" font-weight="800">${stationTitle}</text>`;
        svg += `<text x="154" y="47" fill="#94a3b8" font-size="10">${stationLatin} &bull; ${stationDesc.slice(0, 52)}...</text>`;
        svg += `<circle cx="638" cy="37" r="10" fill="#2563eb" />`;
        svg += `<text x="638" y="41" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">⛪</text>`;

        return svg;
      }
    },

    'mountain-elevation': {
      id: 'mountain-elevation',
      stage: 'KS2/KS3 MATHS & GEOGRAPHY',
      title: 'Mountain Altitude: Elevation, Hypotenuse & Atmospheric Science',
      duration: 16.0,
      has3D: false,
      svgFile: 'scenes/mountain-elevation.svg',
      astFile: 'scenes/mountain-elevation.ast',
      interactive: {
        checkpoints: [
          {
            t: 0.34,
            title: 'Checkpoint 1: Slope Distance vs True Altitude',
            prompt: 'The climber has walked 2,000m along a 30° mountain slope. What is their true vertical height above sea level?',
            options: [
              '2,000m (same as walking distance)',
              '1,000m (2,000m × sin(30°) = 1,000m)',
              '4,000m (double the distance)'
            ],
            answer: 1,
            explanation: 'Walking along a slope is the hypotenuse! Vertical altitude is opposite the angle: 2,000m × sin(30°) = 1,000m.'
          },
          {
            t: 0.68,
            title: 'Checkpoint 2: Atmospheric Lapse Rate',
            prompt: 'If sea-level temperature is 20°C and drops ~6.5°C per 1,000m, what is the temperature at 2,400m altitude?',
            options: [
              '4.4°C (20 - 2.4 × 6.5)',
              '20.0°C (temperature remains constant)',
              '-15.0°C (instant freezing)'
            ],
            answer: 0,
            explanation: 'Air cools as atmospheric pressure drops. 20°C - (2.4 × 6.5°C) = 4.4°C!'
          }
        ]
      },
      keyframes: [
        { t: 0.00, title: 'Step 1: Base Camp (0m Sea Level)', rule: 'Walking distance along a hill ≠ Vertical height! Elevation is measured straight up.' },
        { t: 0.35, title: 'Step 2: Camp 1 The Ridge (1,500m)', rule: 'Trigonometry link: True Altitude = Slope Distance × sin(θ). The slope is the hypotenuse!' },
        { t: 0.70, title: 'Step 3: Camp 2 The Ice Shelf (2,400m)', rule: 'Atmospheric Lapse Rate: Temperature drops ~6.5°C per 1,000m rise as air pressure thins.' },
        { t: 1.00, title: 'Step 4: The Summit (3,000m Solved)', rule: 'Summit reached! Vertical rise = 3,000m. Pythagoras proof: Base² + Altitude² = Slope².' }
      ],
      subtitles: [
        { start: 0.00, end: 0.30, en: 'Watch the climber depart Base Camp (0m). Notice the difference between walking distance along the slope and true vertical height!', es: '¡Mira al escalador salir del campamento base (0m)! Nota la diferencia entre la distancia caminada y la altura vertical real.' },
        { start: 0.30, end: 0.65, en: 'At Camp 1 (1,500m), notice the right-angled triangle! The slope is the hypotenuse, but true altitude is the vertical rise.', es: 'En el Campamento 1 (1,500m), ¡mira el triángulo rectángulo! La pendiente es la hipotenusa, pero la altitud real es la línea vertical.' },
        { start: 0.65, end: 1.00, en: 'Approaching the 3,000m summit: temperature drops to -2°C, air pressure falls to 70 kPa, and altitude reaches peak height!', es: '¡Llegando a la cumbre de 3,000m! La temperatura baja a -2°C, la presión cae a 70 kPa y la altitud alcanza el máximo.' }
      ],
      render(t) {
        const cx = 180 + t * 220;
        const cy = 380 - t * 240;
        const altM = Math.round(t * 3000);
        return `
          <rect width="800" height="480" fill="#0284c7" />
          <polygon points="400,140 180,380 680,380" fill="#475569" />
          <polygon points="400,140 375,190 425,190" fill="#ffffff" />
          <line x1="180" y1="380" x2="${cx}" y2="380" stroke="#0ea5e9" stroke-width="3" />
          <line x1="${cx}" y1="380" x2="${cx}" y2="${cy}" stroke="#10b981" stroke-width="3" />
          <circle cx="${cx}" cy="${cy}" r="6" fill="#ef4444" />
          <rect x="250" y="20" width="300" height="40" rx="8" fill="#0f172a" />
          <text x="400" y="45" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Altitude: ${altM}m / 3000m</text>
        `;
      }
    },
    'fish-tank': {
      id: 'fish-tank',
      stage: 'BENCHMARK & STRESS LAB',
      title: 'Aquarium Stress Benchmark: Vector Point & FPS Limiter',
      duration: 12.0,
      svgFile: 'scenes/fish-tank.svg',
      astFile: 'scenes/fish-tank.ast',
      keyframes: [
        { t: 0.00, title: 'Baseline Aquarium', rule: 'Calibrating baseline frame rendering at 60 FPS' },
        { t: 0.33, title: 'Schooling Dynamics', rule: 'Evaluating multi-point fin undulation and collision vectors' },
        { t: 0.66, title: 'Vertex Stress Test', rule: 'Measuring composite reflow limits across hardware threads' },
        { t: 1.00, title: 'Hardware Safe Limit', rule: 'Optimal ceiling calculated and stored in local configuration' }
      ],
      subtitles: [
        { start: 0.00, end: 0.35, en: "Stress testing the SVG vector rendering pipeline with animated multi-point fish boids.", es: "Prueba de esfuerzo del pipeline SVG con peces animados de múltiples vértices." },
        { start: 0.35, end: 0.70, en: "Watch the live FPS and frame time budget as active points and vector DOM nodes increase.", es: "Observa los FPS y el tiempo de renderizado a medida que aumentan los vértices." },
        { start: 0.70, end: 1.00, en: "The computed safe ceiling determines the ideal point boundary for this hardware.", es: "El límite seguro calculado establece la frontera ideal de puntos para este dispositivo." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.50,
            title: "Vector Rendering Limits",
            prompt: "Why does an SVG vector player have a physical limit on animated points and DOM nodes?",
            options: [
              "Because browsers evaluate the DOM tree and re-rasterize vector bezier curves on each frame",
              "Because SVG files expire after 60 seconds of playback",
              "Because vector math only works on computers with liquid cooling"
            ],
            answer: 0,
            explanation: "Unlike flat pixel video, SVG vector rendering recalculates geometry and patches DOM element attributes every 16.6ms. Finding the point limit allows us to govern scenes safely for smooth 60 FPS on any Chromebook, mobile device, or PC."
          }
        ]
      },
      mount(container) {
        let fishGroup = container.querySelector('#fish-school-group');
        let bubbleGroup = container.querySelector('#bubbles-group');

        // Fallback: If SVG template nodes were not already injected, initialize complete aquarium DOM
        if (!fishGroup || !bubbleGroup) {
          container.innerHTML = `
            <defs>
              <linearGradient id="tank-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0369a1" />
                <stop offset="35%" stop-color="#0284c7" />
                <stop offset="70%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#020617" />
              </linearGradient>
              <linearGradient id="caustic-ray" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </linearGradient>
              <linearGradient id="seabed-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#b45309" />
                <stop offset="40%" stop-color="#78350f" />
                <stop offset="100%" stop-color="#451a03" />
              </linearGradient>
              <linearGradient id="fish-clown" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#f97316" /><stop offset="50%" stop-color="#ea580c" /><stop offset="100%" stop-color="#c2410c" />
              </linearGradient>
              <linearGradient id="fish-blue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#06b6d4" /><stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="fish-tang" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#eab308" /><stop offset="100%" stop-color="#ca8a04" />
              </linearGradient>
              <linearGradient id="fish-neon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#ec4899" /><stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
              <filter id="bubble-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect x="0" y="0" width="800" height="480" fill="url(#tank-water)" />
            <polygon points="120,0 240,0 360,440 200,440" fill="url(#caustic-ray)" />
            <polygon points="400,0 520,0 660,440 500,440" fill="url(#caustic-ray)" />
            <polygon points="620,0 720,0 800,440 700,440" fill="url(#caustic-ray)" />
            <path d="M 0,440 Q 200,420 400,435 T 800,430 L 800,480 L 0,480 Z" fill="url(#seabed-grad)" />
            <ellipse cx="140" cy="445" rx="35" ry="14" fill="#57534e" />
            <ellipse cx="180" cy="450" rx="20" ry="10" fill="#44403c" />
            <ellipse cx="640" cy="442" rx="45" ry="16" fill="#57534e" />
            <ellipse cx="690" cy="448" rx="28" ry="12" fill="#44403c" />
            <g id="kelp-forest">
              <path id="kelp-1" d="M 60,450 Q 80,340 50,240 T 70,120 T 40,30" fill="none" stroke="#16a34a" stroke-width="8" stroke-linecap="round" opacity="0.85" />
              <path id="kelp-2" d="M 90,460 Q 120,360 85,260 T 110,150 T 80,50" fill="none" stroke="#15803d" stroke-width="6" stroke-linecap="round" opacity="0.8" />
              <path id="kelp-3" d="M 720,450 Q 700,340 735,240 T 710,130 T 740,35" fill="none" stroke="#16a34a" stroke-width="9" stroke-linecap="round" opacity="0.85" />
              <path id="kelp-4" d="M 750,460 Q 730,370 760,270 T 735,160 T 765,60" fill="none" stroke="#15803d" stroke-width="6" stroke-linecap="round" opacity="0.8" />
            </g>
            <g id="fish-school-group"></g>
            <g id="bubbles-group"></g>
            <line x1="0" y1="2" x2="800" y2="2" stroke="#38bdf8" stroke-width="3" opacity="0.6" stroke-dasharray="16 8" />
            <g id="benchmark-hud" transform="translate(16, 16)">
              <rect x="0" y="0" width="310" height="152" rx="10" fill="#0f172a" fill-opacity="0.88" stroke="#334155" stroke-width="1.5" />
              <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="bold" font-family="system-ui, sans-serif">🐠 HARDWARE STRESS BENCHMARK</text>
              <rect x="238" y="12" width="58" height="16" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1" />
              <text id="hud-status-badge" x="267" y="24" fill="#34d399" font-size="9" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">60 FPS</text>
              <text x="14" y="48" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Render Performance:</text>
              <text id="hud-fps-val" x="120" y="48" fill="#34d399" font-size="12" font-weight="bold" font-family="monospace">60.0 FPS</text>
              <text id="hud-frametime-val" x="200" y="48" fill="#94a3b8" font-size="10" font-family="monospace">(16.6ms)</text>
              <text x="14" y="68" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Active Animated Fish:</text>
              <text id="hud-fish-count" x="120" y="68" fill="#f8fafc" font-size="11" font-weight="bold" font-family="monospace">100 Fish</text>
              <text x="175" y="68" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Points:</text>
              <text id="hud-points-count" x="220" y="68" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace">2,400 pts</text>
              <rect x="14" y="78" width="282" height="6" rx="3" fill="#1e293b" />
              <rect id="hud-budget-fill" x="14" y="78" width="80" height="6" rx="3" fill="#10b981" />
              <rect x="14" y="92" width="282" height="24" rx="4" fill="rgba(30, 41, 59, 0.7)" stroke="#334155" stroke-width="1" />
              <text id="hud-recommendation" x="22" y="108" fill="#cbd5e1" font-size="9.5" font-family="system-ui, sans-serif">Safe Device Limit: Calculating...</text>
              <text x="14" y="132" fill="#64748b" font-size="8.5" font-family="system-ui, sans-serif">Click aquarium to add +30 fish &amp; test frame limits</text>
            </g>
          `;
          fishGroup = container.querySelector('#fish-school-group');
          bubbleGroup = container.querySelector('#bubbles-group');
        }

        const svg = container.querySelector('svg') || container;
        const hudFps = container.querySelector('#hud-fps-val');
        const hudTime = container.querySelector('#hud-frametime-val');
        const hudFish = container.querySelector('#hud-fish-count');
        const hudPoints = container.querySelector('#hud-points-count');
        const hudBadge = container.querySelector('#hud-status-badge');
        const hudBudget = container.querySelector('#hud-budget-fill');
        const hudRec = container.querySelector('#hud-recommendation');

        // Boid species palettes
        const fishGradients = ['url(#fish-clown)', 'url(#fish-blue)', 'url(#fish-tang)', 'url(#fish-neon)'];
        const tailColors = ['#f97316', '#38bdf8', '#eab308', '#ec4899'];

        // Initial default fish count (100 fish = 2,400 active points)
        const initialCount = 100;
        const fishBoids = [];

        if (fishGroup) {
          fishGroup.innerHTML = '';
          for (let i = 0; i < initialCount; i++) {
            const speciesIdx = i % 4;
            const size = 0.65 + Math.random() * 0.75;
            const speed = (60 + Math.random() * 90) * (Math.random() > 0.15 ? 1 : -1);
            const x = Math.random() * 800;
            const y = 60 + Math.random() * 340;
            const phase = Math.random() * Math.PI * 2;
            const finFreq = 4 + Math.random() * 4;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'boid-fish');
            g.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)})`);

            // Fish body path (8 points)
            const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const direction = speed >= 0 ? 1 : -1;
            const bx = direction > 0 ? 12 : -12;
            body.setAttribute('d', `M ${bx*size},0 C ${(bx*0.5)*size},${-8*size} ${(-10*direction)*size},${-6*size} ${(-16*direction)*size},0 C ${(-10*direction)*size},${6*size} ${(bx*0.5)*size},${8*size} ${bx*size},0 Z`);
            body.setAttribute('fill', fishGradients[speciesIdx]);

            // Fish tail fin (4 points)
            const tail = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            tail.setAttribute('fill', tailColors[speciesIdx]);
            tail.setAttribute('opacity', '0.9');

            // Pectoral fin (3 points)
            const fin = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            fin.setAttribute('points', `0,0 ${(-6*direction)*size},${4*size} ${(-2*direction)*size},${7*size}`);
            fin.setAttribute('fill', tailColors[speciesIdx]);
            fin.setAttribute('opacity', '0.8');

            // Eye & Pupil (4 points)
            const eye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            eye.setAttribute('cx', `${(bx * 0.65).toFixed(1)}`);
            eye.setAttribute('cy', `${(-2 * size).toFixed(1)}`);
            eye.setAttribute('r', `${(2.2 * size).toFixed(1)}`);
            eye.setAttribute('fill', '#ffffff');

            const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            pupil.setAttribute('cx', `${(bx * 0.72).toFixed(1)}`);
            pupil.setAttribute('cy', `${(-2 * size).toFixed(1)}`);
            pupil.setAttribute('r', `${(1.1 * size).toFixed(1)}`);
            pupil.setAttribute('fill', '#0f172a');

            g.appendChild(tail);
            g.appendChild(body);
            g.appendChild(fin);
            g.appendChild(eye);
            g.appendChild(pupil);
            fishGroup.appendChild(g);

            fishBoids.push({
              el: g,
              tailEl: tail,
              x,
              y,
              speed,
              size,
              direction,
              phase,
              finFreq
            });
          }
        }

        // Bubbles with Microphysics
        const bubbles = [];
        if (bubbleGroup) {
          bubbleGroup.innerHTML = '';
          for (let b = 0; b < 24; b++) {
            const bx = 40 + Math.random() * 720;
            const by = 40 + Math.random() * 400;
            const r = 2 + Math.random() * 5;
            const vy = -(30 + Math.random() * 50);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', bx.toFixed(1));
            circle.setAttribute('cy', by.toFixed(1));
            circle.setAttribute('r', r.toFixed(1));
            circle.setAttribute('fill', '#38bdf8');
            circle.setAttribute('fill-opacity', '0.45');
            circle.setAttribute('stroke', '#7dd3fc');
            circle.setAttribute('stroke-width', '1');
            circle.setAttribute('filter', 'url(#bubble-glow)');
            bubbleGroup.appendChild(circle);

            bubbles.push({ el: circle, x: bx, y: by, r, vy, wobble: Math.random() * Math.PI * 2 });
          }
        }

        // Benchmarking state
        const state = {
          fishBoids,
          bubbles,
          lastTime: performance.now(),
          fps: 60.0,
          fpsHistory: [],
          renderDurationMs: 3.5,
          hudFps,
          hudTime,
          hudFish,
          hudPoints,
          hudBadge,
          hudBudget,
          hudRec
        };

        // Click on the stage allows incrementing fish count dynamically for stress testing
        if (svg) {
          svg.style.cursor = 'pointer';
          svg.onclick = (e) => {
            // If clicking benchmark panel, don't trigger
            if (e.target.closest('#benchmark-hud')) return;
            const newFishCount = Math.min(600, state.fishBoids.length + 30);
            if (hudFish) hudFish.textContent = `${newFishCount} Fish`;
          };
        }

        return state;
      },
      update(t, state) {
        if (!state) return;
        const now = performance.now();
        const frameTime = now - state.lastTime;
        state.lastTime = now;

        if (frameTime > 0 && frameTime < 500) {
          const instantFps = 1000.0 / frameTime;
          state.fps = state.fps * 0.88 + instantFps * 0.12;
          state.renderDurationMs = Math.max(1.0, frameTime * 0.35);
        }

        const boids = state.fishBoids || [];
        const dt = 0.016; // 60 FPS normalizer

        // Animate each vector fish boid
        for (let i = 0; i < boids.length; i++) {
          const b = boids[i];
          b.x += b.speed * dt;
          b.y += Math.sin(t * b.finFreq + b.phase) * 0.55;

          // Wrap horizontally around tank boundaries
          if (b.speed > 0 && b.x > 840) b.x = -40;
          if (b.speed < 0 && b.x < -40) b.x = 840;

          if (b.el) {
            b.el.setAttribute('transform', `translate(${b.x.toFixed(1)}, ${b.y.toFixed(1)})`);
          }

          // Oscillate tail fin vertices
          if (b.tailEl) {
            const tailSwing = Math.sin(t * b.finFreq * 2 + b.phase) * 4 * b.size;
            const tailX = (-14 * b.direction) * b.size;
            b.tailEl.setAttribute('points', `${tailX},0 ${(-24 * b.direction) * b.size},${(-7 * b.size + tailSwing).toFixed(1)} ${(-24 * b.direction) * b.size},${(7 * b.size + tailSwing).toFixed(1)}`);
          }
        }

        // Animate bubbles
        const bubbles = state.bubbles || [];
        for (let j = 0; j < bubbles.length; j++) {
          const bub = bubbles[j];
          bub.y += bub.vy * dt;
          bub.x += Math.sin(t * 3 + bub.wobble) * 0.6;
          if (bub.y < 5) {
            bub.y = 440;
            bub.x = 40 + Math.random() * 720;
          }
          if (bub.el) {
            bub.el.setAttribute('cx', bub.x.toFixed(1));
            bub.el.setAttribute('cy', bub.y.toFixed(1));
          }
        }

        // Diagnostics telemetry
        const pointsPerFish = 24;
        const totalPoints = boids.length * pointsPerFish + bubbles.length * 8 + 64; // kelp + seabed points
        const fpsVal = Math.min(60.0, Math.max(12.0, state.fps));
        const frameMs = (1000.0 / fpsVal).toFixed(1);

        if (state.hudFps) {
          state.hudFps.textContent = `${fpsVal.toFixed(1)} FPS`;
          state.hudFps.setAttribute('fill', fpsVal >= 55 ? '#34d399' : (fpsVal >= 35 ? '#fbbf24' : '#f87171'));
        }
        if (state.hudTime) {
          state.hudTime.textContent = `(${frameMs}ms)`;
        }
        if (state.hudFish) {
          state.hudFish.textContent = `${boids.length} Fish`;
        }
        if (state.hudPoints) {
          state.hudPoints.textContent = `${totalPoints.toLocaleString()} pts`;
        }
        if (state.hudBadge) {
          state.hudBadge.textContent = fpsVal >= 55 ? 'OPTIMAL' : (fpsVal >= 35 ? 'BALANCED' : 'BOTTLENECK');
          state.hudBadge.setAttribute('fill', fpsVal >= 55 ? '#34d399' : (fpsVal >= 35 ? '#fbbf24' : '#f87171'));
        }
        if (state.hudBudget) {
          const budgetPct = Math.min(1.0, Math.max(0.1, (1000.0 / fpsVal) / 33.3));
          state.hudBudget.setAttribute('width', `${(budgetPct * 282).toFixed(1)}`);
          state.hudBudget.setAttribute('fill', fpsVal >= 55 ? '#10b981' : (fpsVal >= 35 ? '#f59e0b' : '#ef4444'));
        }

        // Calculate and cache recommended hardware ceiling
        if (state.hudRec && Math.random() < 0.05) {
          let safePoints = 4000;
          if (fpsVal >= 58) {
            safePoints = Math.round(totalPoints * 1.6);
          } else if (fpsVal >= 50) {
            safePoints = Math.round(totalPoints * 1.1);
          } else {
            safePoints = Math.max(1200, Math.round(totalPoints * (fpsVal / 60.0)));
          }
          const safeFish = Math.round(safePoints / pointsPerFish);
          state.hudRec.textContent = `Safe Limit: ~${safePoints.toLocaleString()} pts (~${safeFish} fish) for 60 FPS`;
          try {
            localStorage.setItem('stj_player_safe_point_limit', String(safePoints));
          } catch (_) {}
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#0369a1"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Aquarium Vector Stress Benchmark (60 FPS)</text>`;
      }
    },
    'math-fishing': {
      id: 'math-fishing',
      stage: 'KS1/KS2 MATHS',
      title: 'Math Pond: Number Bonds Fishing Game',
      duration: 14.0,
      svgFile: 'scenes/math-fishing.svg',
      astFile: 'scenes/math-fishing.ast',
      keyframes: [
        { t: 0.00, title: 'Step 1: Pond Inspection', rule: 'Scanning swimming fish numerals and ten-frame dots' },
        { t: 0.35, title: 'Step 2: First Catch (4)', rule: 'Reeling in 4: calculating complement needed to reach target 10' },
        { t: 0.70, title: 'Step 3: Number Bond Hook (6)', rule: 'Matching 4 + 6 = 10 with tactile audio chime' },
        { t: 1.00, title: 'Step 4: Mastery Victory', rule: 'Bonds to 10 and 20 provide the foundation for mental arithmetic' }
      ],
      subtitles: [
        { start: 0.00, end: 0.35, en: "Welcome to the Math Pond! Watch how catching fish with numbers builds our number bonds.", es: "¡Bienvenidos a la laguna matemática! Mira cómo pescar números construye los vínculos numéricos." },
        { start: 0.35, end: 0.70, en: "We have a 4 on our line. To make 10, we must find and catch a fish with 6!", es: "Tenemos un 4 en la caña. ¡Para formar 10, debemos buscar y pescar un 6!" },
        { start: 0.70, end: 1.00, en: "4 plus 6 equals 10! A perfect number bond stored right in our tackle bucket.", es: "¡4 más 6 es igual a 10! Un vínculo numérico perfecto guardado en la cubeta." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.50,
            title: "Number Bond Challenge",
            prompt: "If you catch a fish with the number 3, which fish should you catch next to make 10?",
            options: [
              "A fish with 7 (because 3 + 7 = 10)",
              "A fish with 3 (because 3 + 3 = 10)",
              "A fish with 10 (because 3 + 10 = 10)"
            ],
            answer: 0,
            explanation: "Number bonds to 10 are pairs that sum to 10. 3 + 7 = 10. Knowing these pairs by heart gives pupils quick mental math fluency for addition and subtraction."
          },
          {
            t: 0.85,
            title: "Concrete to Abstract Progression",
            prompt: "Why do the fish display ten-frame dots alongside numerals?",
            options: [
              "To help early learners count concrete quantities (subitising) before reading abstract numerals",
              "Because fish prefer polka dots",
              "To increase the weight of the fishing hook"
            ],
            answer: 0,
            explanation: "The Concrete-Pictorial-Abstract (CPA) approach allows younger learners to visually group and count dots (subitising) to understand the value of the number before transitioning to pure abstract digits."
          }
        ]
      },
      mount(container) {
        let fishGroup = container.querySelector('#fish-school-group');
        let rodGroup = container.querySelector('#fishing-rod-group');
        let hook = container.querySelector('#fishing-hook');
        let line = container.querySelector('#fishing-line');
        let eqText = container.querySelector('#math-hud-equation');

        if (!fishGroup) {
          container.innerHTML = `
            <defs>
              <linearGradient id="pond-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="50%" stop-color="#0369a1" />
                <stop offset="100%" stop-color="#0c4a6e" />
              </linearGradient>
              <linearGradient id="pond-bank" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#15803d" />
                <stop offset="100%" stop-color="#14532d" />
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="url(#pond-water)" />
            <path d="M 0,0 L 220,0 C 200,60 140,110 0,130 Z" fill="url(#pond-bank)" />
            <g id="fish-school-group"></g>
            <g id="fishing-rod-group">
              <line id="fishing-rod" x1="80" y1="30" x2="320" y2="70" stroke="#78350f" stroke-width="5" stroke-linecap="round" />
              <line id="fishing-line" x1="320" y1="70" x2="320" y2="240" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3" />
              <circle id="fishing-bobber" cx="320" cy="140" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
              <path id="fishing-hook" d="M 320,240 C 320,252 328,252 328,244 L 328,242" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
            </g>
            <g id="math-hud-panel" transform="translate(420, 16)">
              <rect width="360" height="96" rx="10" fill="#0f172a" fill-opacity="0.92" stroke="#334155" stroke-width="1.5" />
              <text x="16" y="24" fill="#38bdf8" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">🎣 NUMBER BONDS POND: TARGET 10</text>
              <text id="math-hud-equation" x="16" y="60" fill="#ffffff" font-size="22" font-weight="900" font-family="system-ui, sans-serif">4 + 6 = 10 🌟</text>
              <text x="16" y="82" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Catch pairs of swimming fish that bond to make the target</text>
            </g>
          `;
          fishGroup = container.querySelector('#fish-school-group');
          rodGroup = container.querySelector('#fishing-rod-group');
          hook = container.querySelector('#fishing-hook');
          line = container.querySelector('#fishing-line');
          eqText = container.querySelector('#math-hud-equation');
        }

        const fishItems = [
          { val: 4, x: 280, y: 240, vx: 35, color: '#f97316', belly: '#fdba74' },
          { val: 6, x: 480, y: 290, vx: -30, color: '#06b6d4', belly: '#a5f3fc' },
          { val: 2, x: 160, y: 350, vx: 40, color: '#eab308', belly: '#fef08a' },
          { val: 8, x: 620, y: 220, vx: -25, color: '#ec4899', belly: '#fbcfe8' },
          { val: 5, x: 380, y: 380, vx: 30, color: '#10b981', belly: '#a7f3d0' },
          { val: 7, x: 520, y: 340, vx: -35, color: '#8b5cf6', belly: '#ddd6fe' },
          { val: 3, x: 690, y: 370, vx: 25, color: '#f97316', belly: '#fdba74' },
          { val: 9, x: 120, y: 260, vx: -30, color: '#06b6d4', belly: '#a5f3fc' }
        ];

        const fishEls = [];
        if (fishGroup) {
          fishGroup.innerHTML = '';
          fishItems.forEach((f, idx) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', `math-fish-item math-fish-${f.val}`);
            g.innerHTML = `
              <polygon points="0,0 -18,-9 -24,0 -18,9" fill="${f.color}" />
              <ellipse cx="4" cy="0" rx="20" ry="13" fill="${f.color}" stroke="#ffffff" stroke-width="1.5" />
              <path d="M -10,0 Q 4,11 16,0 Z" fill="${f.belly}" opacity="0.8" />
              <circle cx="14" cy="-4" r="3.5" fill="#ffffff" />
              <circle cx="15.5" cy="-4" r="1.8" fill="#0f172a" />
              <circle cx="2" cy="0" r="10" fill="#0f172a" fill-opacity="0.8" stroke="#ffffff" stroke-width="1.2" />
              <text x="2" y="4" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="900">${f.val}</text>
            `;
            fishGroup.appendChild(g);
            fishEls.push({ el: g, ...f, phase: Math.random() * Math.PI * 2 });
          });
        }

        return {
          fishEls,
          hook,
          line,
          eqText
        };
      },
      update(t, state) {
        if (!state) return;
        const { fishEls, hook, line, eqText } = state;

        // Fish swimming
        if (fishEls) {
          fishEls.forEach((f) => {
            const phase = t * 6 + f.phase;
            const curX = ((f.x + t * f.vx * 15) % 700) + 50;
            const curY = f.y + Math.sin(phase) * 6;
            if (f.el) {
              f.el.setAttribute('transform', `translate(${curX.toFixed(1)}, ${curY.toFixed(1)})`);
            }
          });
        }

        // Animate line, hook, and equation as progression moves
        if (t < 0.35) {
          if (eqText) eqText.textContent = 'Scan Pond: Find fish that bond to 10!';
          if (hook) hook.setAttribute('transform', `translate(480, 180)`);
          if (line) {
            line.setAttribute('x2', '480');
            line.setAttribute('y2', '180');
          }
        } else if (t < 0.70) {
          if (eqText) eqText.textContent = 'Caught 4! Needed: 10 - 4 = 6';
          if (hook) hook.setAttribute('transform', `translate(320, 240)`);
          if (line) {
            line.setAttribute('x2', '320');
            line.setAttribute('y2', '240');
          }
        } else {
          if (eqText) eqText.textContent = '🌟 Solved: 4 + 6 = 10 (Bond Complete!)';
          if (hook) hook.setAttribute('transform', `translate(400, 120)`);
          if (line) {
            line.setAttribute('x2', '400');
            line.setAttribute('y2', '120');
          }
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#0369a1"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Math Pond: Number Bonds Fishing Game</text>`;
      }
    },
    'shakespeare': {
      id: 'shakespeare',
      stage: 'KS3/KS4 ENGLISH LITERATURE',
      title: 'The Globe Theatre: Shakespeare & Iambic Pentameter',
      duration: 15.0,
      keyframes: [
        { t: 0.00, title: 'Step 1: The Globe Thrust Stage', rule: 'Built 1599 on Bankside. Thrust stage surrounded on three sides by 3,000 spectators.' },
        { t: 0.30, title: 'Step 2: The Iambic Heartbeat', rule: 'Five metrical feet per line: da-DUM da-DUM da-DUM da-DUM da-DUM (10 syllables).' },
        { t: 0.65, title: 'Step 3: The Meter Breaks', rule: 'Feminine endings (11th unstressed beat) mirror moral hesitation and psychological collapse.' },
        { t: 1.00, title: 'Step 4: The Tragic Catastrophe', rule: 'Verse structure reveals inner psychology: Shakespeare turns meter into character.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.30, en: "Welcome to the 1599 Globe Theatre. Actors perform on a raised thrust stage surrounded by 1,000 groundlings.", es: "Bienvenidos al Globe Theatre de 1599. Los actores actúan en un escenario rodeado de espectadores." },
        { start: 0.30, end: 0.65, en: "Shakespeare writes in Iambic Pentameter: five pairs of unstressed and stressed syllables matching human heartbeat.", es: "Shakespeare escribe en pentámetro yámbico: cinco pares de sílabas que siguen el latido del corazón." },
        { start: 0.65, end: 1.00, en: "Notice when Macbeth wavers: 'Is this a dagger which I see before me' adds an 11th beat to show a fractured mind.", es: "Observa cuando Macbeth duda: la línea añade una undécima sílaba débil reflejando su mente fracturada." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.32,
            title: 'Iambic Pentameter Rhythm Challenge',
            prompt: 'What rhythm does Shakespearean Iambic Pentameter naturally follow?',
            options: [
              'The rhythm of the human heartbeat: five beats of da-DUM (10 syllables total)',
              'A military waltz (ONE-two-three, ONE-two-three)',
              'Completely random unmetered rhyming prose'
            ],
            answer: 0,
            explanation: 'An iamb is an unstressed beat followed by a stressed beat (da-DUM). Pentameter means 5 feet per line (5 × 2 = 10 syllables), mirroring the natural human pulse and spoken English breathing.'
          },
          {
            t: 0.70,
            title: 'The Feminine Ending Insight',
            prompt: 'Why does Shakespeare give Macbeth an 11th syllable in "Is this a dagger which I see before me,"?',
            options: [
              'To show Macbeth’s hesitation, wavering resolve, and moral instability before regicide',
              'Because Shakespeare miscounted the syllables on his quill',
              'To signal a change in the weather'
            ],
            answer: 0,
            explanation: 'In Elizabethan poetry, breaking strict meter with a weak, falling 11th syllable (a feminine ending) signifies uncertainty, grief, or mental fracturing.'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="globe-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0c0a09"/>
                <stop offset="100%" stop-color="#1c1917"/>
              </linearGradient>
              <linearGradient id="heavens-canopy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0369a1"/>
                <stop offset="100%" stop-color="#1e1b4b"/>
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="url(#globe-bg)"/>

            <!-- The Heavens Canopy -->
            <polygon points="180,90 620,90 570,40 230,40" fill="url(#heavens-canopy)" stroke="#38bdf8" stroke-width="2"/>
            <text x="400" y="65" text-anchor="middle" fill="#fef08a" font-size="14" font-weight="bold">THE HEAVENS (Sun, Moon & Zodiac Roof)</text>

            <!-- Upper Gallery / Frons Scenae -->
            <rect x="200" y="90" width="400" height="80" rx="4" fill="#292524" stroke="#78350f" stroke-width="2"/>
            <text x="400" y="125" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">BALCONY / TARRAS (Juliet’s Window)</text>
            <rect x="360" y="135" width="80" height="35" rx="3" fill="#1c1917" stroke="#b45309" stroke-width="1.5"/>
            <text x="400" y="157" text-anchor="middle" fill="#d97706" font-size="10">Discovery Space</text>

            <!-- Main Wooden Thrust Stage -->
            <polygon points="220,170 580,170 540,360 260,360" fill="#451a03" stroke="#d97706" stroke-width="3"/>
            <text x="400" y="240" text-anchor="middle" fill="#fef3c7" font-size="16" font-weight="900" letter-spacing="1">THE GLOBE THRUST STAGE</text>
            <text x="400" y="262" text-anchor="middle" fill="#fde68a" font-size="11">Surrounded by Groundlings on Three Sides</text>

            <!-- Trapdoor to Hell -->
            <rect x="370" y="280" width="60" height="30" rx="3" fill="#1c1917" stroke="#ef4444" stroke-width="2"/>
            <text x="400" y="300" text-anchor="middle" fill="#fca5a5" font-size="9" font-weight="bold">TRAPDOOR</text>

            <!-- Stage Pillars Supporting the Heavens -->
            <rect x="250" y="90" width="16" height="150" fill="#d97706" rx="3"/>
            <rect x="534" y="90" width="16" height="150" fill="#d97706" rx="3"/>

            <!-- Real-Time Iambic Pulse Line (EKG Heartbeat of the Bard) -->
            <g id="iambic-pulse-bar" transform="translate(150, 390)">
              <rect width="500" height="60" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
              <text x="250" y="24" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold" id="iambic-status-text">
                IAMBIC PENTAMETER: da-DUM da-DUM da-DUM da-DUM da-DUM
              </text>
              <path id="iambic-wave" d="M 20 42 L 80 42 L 95 28 L 110 42 L 170 42 L 185 24 L 200 42 L 260 42 L 275 24 L 290 42 L 350 42 L 365 24 L 380 42 L 440 42 L 455 24 L 480 42" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
              <circle id="iambic-dot" cx="20" cy="42" r="5" fill="#ef4444"/>
            </g>
          </svg>
        `;
        return {
          wave: container.querySelector('#iambic-wave'),
          dot: container.querySelector('#iambic-dot'),
          text: container.querySelector('#iambic-status-text')
        };
      },
      update(t, elements) {
        if (!elements) return;
        const progressInCycle = (t * 4) % 1; // 4 beats per cycle
        const dotX = 20 + progressInCycle * 460;
        if (elements.dot) {
          elements.dot.setAttribute('cx', String(dotX));
          const isStressPeak = Math.sin(progressInCycle * Math.PI * 10) > 0.5;
          elements.dot.setAttribute('r', isStressPeak ? '7' : '4');
          elements.dot.setAttribute('fill', isStressPeak ? '#38bdf8' : '#ef4444');
        }
        if (elements.text) {
          if (t < 0.3) {
            elements.text.textContent = 'THE 1599 GLOBE: 360° Thrust Stage & Standing Yard';
          } else if (t < 0.65) {
            elements.text.textContent = 'IAMBIC PENTAMETER (10 beats): da-DUM da-DUM da-DUM da-DUM da-DUM';
          } else {
            elements.text.textContent = 'METER BREAK: Feminine Ending (11th syllable waver in Macbeth)';
          }
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#1c1917"/><text x="400" y="240" fill="#fef08a" font-size="20" font-weight="bold" text-anchor="middle">The Globe Theatre: Shakespeare & Iambic Pentameter</text>`;
      }
    },
    'languages': {
      id: 'languages',
      stage: 'KS2/KS3 MFL',
      title: 'MFL & Polyglot Studio: Spanish, French & Latin',
      duration: 15.0,
      keyframes: [
        { t: 0.00, title: 'Step 1: The Soundboard', rule: 'Phonics first: Sound-to-spelling correspondence across European languages.' },
        { t: 0.35, title: 'Step 2: The Stem & Ending', rule: 'Morphology: Stripping the infinitive (-ar, -er, -ir) and attaching person markers.' },
        { t: 0.70, title: 'Step 3: Pro-Drop Syntax', rule: 'Spanish & Latin omit pronouns ("Hablo") because the ending encodes the subject.' },
        { t: 1.00, title: 'Step 4: Polyglot Mastery', rule: '60% of academic English connects back to Latin and Romance language cognates.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Welcome to the Polyglot Lab. Let's explore how Spanish, French, and Latin construct meaning through sounds and stems.", es: "Bienvenidos al Laboratorio Políglota. Exploremos cómo el español, francés y latín construyen significado." },
        { start: 0.35, end: 0.70, en: "Notice how the verb stem stays stable while the ending signals WHO is doing the action.", es: "Observa cómo la raíz del verbo se mantiene estable mientras la terminación indica QUIÉN realiza la acción." },
        { start: 0.70, end: 1.00, en: "Because the ending uniquely tells us the subject, Spanish and Latin drop the pronoun: 'Hablo' means 'I speak'.", es: "Debido a que la terminación indica el sujeto, el español no necesita el pronombre: 'Hablo' ya significa 'Yo hablo'." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.38,
            title: 'Verb Morphology Challenge',
            prompt: 'In Spanish, what does the verb ending "-o" indicate in words like "hablo" and "como"?',
            options: [
              'First person singular: "I" (yo)',
              'Plural: "we" (nosotros)',
              'Past tense yesterday'
            ],
            answer: 0,
            explanation: 'The "-o" ending in Spanish regular present tense uniquely signals the first person singular ("I").'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lang-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#0b132b"/>
                <stop offset="100%" stop-color="#1c2541"/>
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="url(#lang-bg)"/>
            <text x="400" y="55" text-anchor="middle" fill="#fef08a" font-size="20" font-weight="900" letter-spacing="1">MFL &amp; POLYGLOT MORPHOLOGY ENGINE</text>
            <text x="400" y="80" text-anchor="middle" fill="#94a3b8" font-size="12">Spanish &bull; French &bull; Latin &bull; English Etymology</text>

            <g transform="translate(100, 110)">
              <rect x="0" y="0" width="180" height="120" rx="12" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
              <text x="90" y="32" text-anchor="middle" fill="#fef3c7" font-size="16" font-weight="bold">🇪🇸 Español</text>
              <text x="90" y="60" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="900">habl + <tspan fill="#f59e0b">o</tspan></text>
              <text x="90" y="85" text-anchor="middle" fill="#cbd5e1" font-size="11">"I speak" (Pro-drop)</text>

              <rect x="210" y="0" width="180" height="120" rx="12" fill="#1e1b4b" stroke="#3b82f6" stroke-width="2"/>
              <text x="300" y="32" text-anchor="middle" fill="#fef3c7" font-size="16" font-weight="bold">🇫🇷 Français</text>
              <text x="300" y="60" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="900">je parl + <tspan fill="#f59e0b">e</tspan></text>
              <text x="300" y="85" text-anchor="middle" fill="#cbd5e1" font-size="11">Silent final "-e"</text>

              <rect x="420" y="0" width="180" height="120" rx="12" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="2"/>
              <text x="510" y="32" text-anchor="middle" fill="#fef3c7" font-size="16" font-weight="bold">🏛️ Lingua Latina</text>
              <text x="510" y="60" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="900">am + <tspan fill="#f59e0b">o</tspan></text>
              <text x="510" y="85" text-anchor="middle" fill="#cbd5e1" font-size="11">English: "Amiable"</text>
            </g>

            <g id="morphology-interactive-bar" transform="translate(100, 260)">
              <rect width="600" height="180" rx="14" fill="#0f172a" stroke="#d97706" stroke-width="2"/>
              <text x="300" y="35" text-anchor="middle" fill="#fde68a" font-size="14" font-weight="bold">DYNAMIC CONJUGATION PARADIGM</text>
              
              <text x="120" y="75" text-anchor="middle" fill="#94a3b8" font-size="12">Subject Pronoun</text>
              <rect x="60" y="90" width="120" height="50" rx="8" fill="#1e293b"/>
              <text id="pronoun-display" x="120" y="122" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">Yo (I)</text>

              <text x="240" y="124" text-anchor="middle" fill="#d97706" font-size="24" font-weight="900">+</text>

              <text x="340" y="75" text-anchor="middle" fill="#94a3b8" font-size="12">Invariable Stem</text>
              <rect x="280" y="90" width="120" height="50" rx="8" fill="#1e293b"/>
              <text x="340" y="122" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="900">habl-</text>

              <text x="440" y="124" text-anchor="middle" fill="#d97706" font-size="24" font-weight="900">+</text>

              <text x="520" y="75" text-anchor="middle" fill="#94a3b8" font-size="12">Person Suffix</text>
              <rect x="460" y="90" width="120" height="50" rx="8" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
              <text id="suffix-display" x="520" y="122" text-anchor="middle" fill="#fde68a" font-size="20" font-weight="900">-o</text>
            </g>
          </svg>
        `;
        return {
          pronoun: container.querySelector('#pronoun-display'),
          suffix: container.querySelector('#suffix-display')
        };
      },
      update(t, elements) {
        if (!elements) return;
        const cycle = Math.floor(t * 6) % 6;
        const pronouns = ['Yo (I)', 'Tú (You)', 'Él (He)', 'Nosotros (We)', 'Vosotros (You all)', 'Ellos (They)'];
        const suffixes = ['-o', '-as', '-a', '-amos', '-áis', '-an'];
        if (elements.pronoun) elements.pronoun.textContent = pronouns[cycle];
        if (elements.suffix) elements.suffix.textContent = suffixes[cycle];
      },
      render(t) {
        return `<rect width="800" height="480" fill="#1c2541"/><text x="400" y="240" fill="#fef08a" font-size="20" font-weight="bold" text-anchor="middle">MFL &amp; Polyglot Studio</text>`;
      }
    },

    'algebra-balance': {
      id: 'algebra-balance',
      stage: 'KS2/KS3 MATHS',
      title: '⚖️ Algebraic Balance Scale: Preserving Equality (2x + 5 = 15)',
      duration: 14.0,
      keyframes: [
        { t: 0.00, title: 'Initial Equation', rule: 'Left Pan: 2x + 5 blocks. Right Pan: 15 unit weights. Both sides balance equally.' },
        { t: 0.35, title: 'Step 1: Isolate Variable Terms', rule: 'Subtract 5 from BOTH pans simultaneously: (2x + 5 - 5) = (15 - 5) => 2x = 10.' },
        { t: 0.70, title: 'Step 2: Divide Equally', rule: 'Divide both pans by 2: (2x ÷ 2) = (10 ÷ 2) => x = 5.' },
        { t: 1.00, title: 'Equality Verified', rule: 'Each x block weighs exactly 5 units! Scale remains in perfect equilibrium.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "An equation is a physical balance scale! 2 unknown 'x' boxes plus 5 unit weights balance 15 weights.", es: "¡Una ecuación es una balanza física! 2 cajas 'x' más 5 unidades equilibran 15 unidades." },
        { start: 0.35, end: 0.70, en: "To solve for x, whatever you do to one side, you MUST do to the other. Subtract 5 from both pans!", es: "Para despejar x, lo que hagas a un lado, ¡DEBES hacerlo al otro! Resta 5 de ambos lados." },
        { start: 0.70, end: 1.00, en: "Now 2x balances 10. Divide both pans in half: one single x equals exactly 5 units!", es: "Ahora 2x equilibra 10. Divide ambos lados a la mitad: ¡una sola x vale exactamente 5 unidades!" }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.34,
            title: 'Golden Rule of Algebra',
            prompt: 'Why must we subtract 5 from BOTH pans rather than just the left pan?',
            options: [
              'To preserve equality and keep the balance scale level',
              'Because the right side cannot have weights',
              'Because subtracting only from one side makes it heavier'
            ],
            answer: 0,
            explanation: 'An equation states that two expressions have equal value. Performing the exact same operation to both sides keeps the scale perfectly balanced.'
          },
          {
            t: 0.69,
            title: 'Division Step',
            prompt: 'If 2x = 10, how do we find the weight of a single x box?',
            options: [
              'Divide both sides by 2 (x = 10 ÷ 2 = 5)',
              'Subtract 2 from both sides (x = 8)',
              'Multiply both sides by 2 (x = 20)'
            ],
            answer: 0,
            explanation: 'Since x is multiplied by 2, we apply the inverse operation: divide both sides by 2 to isolate a single x.'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="#090d16"/>
            <!-- Title Header -->
            <text x="400" y="40" fill="#f8fafc" font-size="20" font-weight="900" text-anchor="middle">Algebraic Balance Scale: Golden Rule of Equality</text>
            <text id="eq-display" x="400" y="70" fill="#38bdf8" font-size="22" font-weight="900" text-anchor="middle">2x + 5 = 15</text>

            <!-- Fulcrum / Stand -->
            <polygon points="400,240 370,410 430,410" fill="#334155" stroke="#475569" stroke-width="2"/>
            <circle cx="400" cy="240" r="14" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>
            <rect x="300" y="410" width="200" height="20" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2"/>

            <!-- Moving Balance Beam Assembly -->
            <g id="balance-beam" transform="rotate(0, 400, 240)">
              <!-- Horizontal Beam -->
              <rect x="120" y="235" width="560" height="10" rx="5" fill="url(#goldBeam)" stroke="#b45309" stroke-width="1.5"/>
              
              <!-- Left Pan Strings & Tray -->
              <line x1="200" y1="240" x2="160" y2="330" stroke="#94a3b8" stroke-width="2"/>
              <line x1="200" y1="240" x2="240" y2="330" stroke="#94a3b8" stroke-width="2"/>
              <ellipse cx="200" cy="330" rx="70" ry="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
              
              <!-- Left Pan Weights Group -->
              <g id="left-pan-weights">
                <!-- 2x Boxes -->
                <rect x="150" y="280" width="40" height="40" rx="6" fill="#3b82f6" stroke="#60a5fa" stroke-width="2"/>
                <text x="170" y="306" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">x</text>
                <rect x="195" y="280" width="40" height="40" rx="6" fill="#3b82f6" stroke="#60a5fa" stroke-width="2"/>
                <text x="215" y="306" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">x</text>
                <!-- 5 unit dots -->
                <g id="left-5-units">
                  <circle cx="160" cy="265" r="7" fill="#f59e0b"/>
                  <circle cx="180" cy="265" r="7" fill="#f59e0b"/>
                  <circle cx="200" cy="265" r="7" fill="#f59e0b"/>
                  <circle cx="220" cy="265" r="7" fill="#f59e0b"/>
                  <circle cx="240" cy="265" r="7" fill="#f59e0b"/>
                  <text x="200" y="250" fill="#fde68a" font-size="12" font-weight="800" text-anchor="middle">+5 units</text>
                </g>
              </g>

              <!-- Right Pan Strings & Tray -->
              <line x1="600" y1="240" x2="560" y2="330" stroke="#94a3b8" stroke-width="2"/>
              <line x1="600" y1="240" x2="640" y2="330" stroke="#94a3b8" stroke-width="2"/>
              <ellipse cx="600" cy="330" rx="70" ry="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>

              <!-- Right Pan Weights -->
              <g id="right-pan-weights">
                <rect x="560" y="280" width="80" height="40" rx="6" fill="#22c55e" stroke="#4ade80" stroke-width="2"/>
                <text id="right-weight-text" x="600" y="306" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">15</text>
              </g>
            </g>

            <!-- Status Indicator -->
            <rect x="250" y="440" width="300" height="30" rx="6" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" stroke-width="1"/>
            <text id="balance-status" x="400" y="460" fill="#4ade80" font-size="13" font-weight="800" text-anchor="middle">⚖️ Scale Balanced &bull; Left (15) = Right (15)</text>
          </svg>
        `;
        return {
          beam: container.querySelector('#balance-beam'),
          eqDisplay: container.querySelector('#eq-display'),
          left5Units: container.querySelector('#left-5-units'),
          rightWeightText: container.querySelector('#right-weight-text'),
          balanceStatus: container.querySelector('#balance-status')
        };
      },
      update(t, elements) {
        if (!elements) return;
        // Step progression:
        // 0.0 - 0.35: 2x + 5 = 15 (Balanced)
        // 0.35 - 0.70: 2x = 10 (5 removed from both sides)
        // 0.70 - 1.00: x = 5 (Divided by 2)
        if (t < 0.35) {
          if (elements.eqDisplay) elements.eqDisplay.textContent = '2x + 5 = 15';
          if (elements.left5Units) elements.left5Units.style.display = 'block';
          if (elements.rightWeightText) elements.rightWeightText.textContent = '15';
          if (elements.balanceStatus) elements.balanceStatus.textContent = '⚖️ Scale Balanced • Left (2x + 5) = Right (15)';
        } else if (t < 0.70) {
          if (elements.eqDisplay) elements.eqDisplay.textContent = 'Step 1: 2x = 10 (-5 from both sides)';
          if (elements.left5Units) elements.left5Units.style.display = 'none';
          if (elements.rightWeightText) elements.rightWeightText.textContent = '10';
          if (elements.balanceStatus) elements.balanceStatus.textContent = '⚖️ Scale Balanced • Left (2x) = Right (10)';
        } else {
          if (elements.eqDisplay) elements.eqDisplay.textContent = 'Step 2: x = 5 (Divide both sides by 2)';
          if (elements.left5Units) elements.left5Units.style.display = 'none';
          if (elements.rightWeightText) elements.rightWeightText.textContent = '5';
          if (elements.balanceStatus) elements.balanceStatus.textContent = '⭐ Solved! Each x = 5 units (5 + 5 + 5 = 15)';
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#090d16"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Algebraic Balance Scale</text>`;
      }
    },

    'electric-circuits': {
      id: 'electric-circuits',
      stage: 'KS2/KS3 PHYSICS',
      title: '💡 Electrical Circuits & Ohm\'s Law (V = I × R)',
      duration: 12.0,
      keyframes: [
        { t: 0.00, title: 'Closed Loop Circuit', rule: 'Current (I) only flows through an unbroken conductive loop from positive to negative terminal.' },
        { t: 0.35, title: 'Voltage Drives Potential', rule: 'Voltage (V) is electrical pressure. Higher voltage pushes more coulombs per second.' },
        { t: 0.70, title: 'Resistance Opposes Flow', rule: 'Resistance (R) in ohms restricts electron velocity. Ohm’s Law: I = V / R.' },
        { t: 1.00, title: 'Energy Dissipation', rule: 'Electrons collide with tungsten filament atoms, converting electrical energy into radiant photon light (Power P = I²R)!' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "An electrical circuit is a closed loop! The battery voltage pushes electrons through the copper wires.", es: "¡Un circuito eléctrico es un lazo cerrado! El voltaje de la batería empuja electrones por los cables." },
        { start: 0.35, end: 0.70, en: "Watch the yellow electrons move! Current is the rate of charge flow: I = Voltage divided by Resistance.", es: "¡Mira cómo se mueven los electrones! La corriente es la tasa de flujo: I = Voltaje dividido entre Resistencia." },
        { start: 0.70, end: 1.00, en: "Inside the lightbulb, resistance forces electrons to collide, heating the filament into brilliant glowing light!", es: "Dentro de la bombilla, la resistencia hace chocar los electrones, ¡calentando el filamento y emitiendo luz!" }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.34,
            title: 'Ohm’s Law Formula',
            prompt: 'According to Ohm’s Law (I = V / R), what happens if we double the battery voltage while keeping resistance the same?',
            options: [
              'The electrical current (I) doubles and the lightbulb shines brighter',
              'The electrical current is cut in half',
              'The resistance increases automatically'
            ],
            answer: 0,
            explanation: 'Current is directly proportional to voltage. Doubling the voltage doubles the rate of electron flow (amperage).'
          },
          {
            t: 0.85,
            title: 'Energy Transformation',
            prompt: 'What form of energy is electrical energy converted into inside the incandescent lightbulb?',
            options: [
              'Thermal (heat) and Radiant (light) energy',
              'Nuclear potential energy',
              'Chemical bonding energy'
            ],
            answer: 0,
            explanation: 'High resistance in the filament causes electrons to collide with tungsten ions, releasing intense thermal heat and visible light photons.'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
                <stop offset="60%" stop-color="#facc15" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <rect width="800" height="480" fill="#090d16"/>
            <!-- Title -->
            <text x="400" y="40" fill="#f8fafc" font-size="20" font-weight="900" text-anchor="middle">Electrical Circuit: Ohm's Law (V = I &times; R)</text>
            <text id="telemetry-display" x="400" y="70" fill="#38bdf8" font-size="16" font-weight="700" text-anchor="middle">Voltage: 12V | Resistance: 4&Omega; | Current: 3.0A | Power: 36W</text>

            <!-- Circuit Wire Loop (Rounded Rect) -->
            <rect x="150" y="110" width="500" height="260" rx="30" fill="none" stroke="#475569" stroke-width="8"/>
            <rect x="150" y="110" width="500" height="260" rx="30" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 8"/>

            <!-- Moving Electron Dots Group -->
            <g id="electron-charges">
              <circle class="e-dot" cx="150" cy="180" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="150" cy="240" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="250" cy="110" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="350" cy="110" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="450" cy="110" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="550" cy="110" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="650" cy="180" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="650" cy="280" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="550" cy="370" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="450" cy="370" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="350" cy="370" r="5" fill="#fde047"/>
              <circle class="e-dot" cx="250" cy="370" r="5" fill="#fde047"/>
            </g>

            <!-- Component 1: DC Battery (Left side) -->
            <g transform="translate(110, 200)">
              <rect x="0" y="0" width="80" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
              <text x="40" y="28" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">BATTERY</text>
              <text x="40" y="52" fill="#60a5fa" font-size="16" font-weight="900" text-anchor="middle">12V</text>
              <line x1="40" y1="-10" x2="40" y2="0" stroke="#ef4444" stroke-width="4"/>
              <text x="55" y="-2" fill="#ef4444" font-size="14" font-weight="900">+</text>
              <line x1="40" y1="70" x2="40" y2="80" stroke="#38bdf8" stroke-width="4"/>
              <text x="55" y="80" fill="#38bdf8" font-size="16" font-weight="900">-</text>
            </g>

            <!-- Component 2: Resistor (Top side) -->
            <g transform="translate(360, 80)">
              <rect x="0" y="10" width="80" height="40" rx="6" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
              <text x="40" y="28" fill="#f8fafc" font-size="11" font-weight="800" text-anchor="middle">RESISTOR</text>
              <text x="40" y="44" fill="#fde047" font-size="13" font-weight="900" text-anchor="middle">4 &Omega;</text>
            </g>

            <!-- Component 3: Lightbulb (Right side) -->
            <g transform="translate(650, 240)">
              <!-- Bulb Glow Aura -->
              <circle id="bulb-halo" cx="0" cy="0" r="60" fill="url(#bulbGlow)" opacity="0.8"/>
              <!-- Glass Dome -->
              <circle cx="0" cy="0" r="26" fill="rgba(255, 255, 255, 0.2)" stroke="#facc15" stroke-width="2"/>
              <!-- Filament -->
              <path d="M -8 10 L -4 -6 L 0 6 L 4 -6 L 8 10" fill="none" stroke="#fef08a" stroke-width="2"/>
              <text x="0" y="45" fill="#facc15" font-size="12" font-weight="800" text-anchor="middle">LIGHTBULB</text>
            </g>

            <!-- Component 4: Switch (Bottom side) -->
            <g transform="translate(370, 350)">
              <circle cx="0" cy="20" r="5" fill="#22c55e"/>
              <line x1="0" y1="20" x2="60" y2="20" stroke="#22c55e" stroke-width="4"/>
              <circle cx="60" cy="20" r="5" fill="#22c55e"/>
              <text x="30" y="48" fill="#4ade80" font-size="11" font-weight="800" text-anchor="middle">SWITCH: CLOSED</text>
            </g>

            <!-- Legend Card -->
            <rect x="180" y="420" width="440" height="40" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="#1e293b" stroke-width="1"/>
            <text x="400" y="445" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle">
              Formula: Current I = 12V &divide; 4&Omega; = 3.0 Amperes &bull; Power P = 12V &times; 3.0A = 36 Watts
            </text>
          </svg>
        `;
        return {
          glow: container.querySelector('#bulb-halo'),
          dots: container.querySelectorAll('.e-dot')
        };
      },
      update(t, elements) {
        if (!elements || !elements.dots) return;
        const pulse = Math.sin(t * 12) * 0.15 + 0.85;
        if (elements.glow) {
          elements.glow.setAttribute('opacity', pulse.toFixed(2));
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#090d16"/><text x="400" y="240" fill="#facc15" font-size="20" font-weight="bold" text-anchor="middle">Electrical Circuits &amp; Ohm's Law</text>`;
      }
    },

    'kinetic-gas': {
      id: 'kinetic-gas',
      stage: 'KS3/KS4 PHYSICS & CHEMISTRY',
      title: '🌡️ Kinetic Gas Theory & Boyle\'s Law (PV = nRT)',
      duration: 14.0,
      svgFile: 'scenes/kinetic-gas.svg',
      astFile: 'scenes/kinetic-gas.ast',
      keyframes: [
        { t: 0.00, title: 'Equilibrium Gas State', rule: 'V = 100%, T = 300K -> P = 101.3 kPa baseline atmospheric pressure.' },
        { t: 0.35, title: 'Boyle\'s Compression', rule: 'Piston compresses V to 50% -> Collision frequency doubles -> P rises to 202.6 kPa.' },
        { t: 0.70, title: 'Gay-Lussac Heating', rule: 'Temperature spikes to 600K -> v_rms increases -> Harder wall impacts push P to 405.2 kPa.' },
        { t: 1.00, title: 'Solid Phase Condensation', rule: 'Cryogenic cooling locks particles into vibrating crystal lattice sites.' }
      ],
      subtitles: [
        { start: 0.0, end: 3.5, en: "Kinetic Molecular Theory explains that gas pressure arises from billions of elastic collisions against the walls.", es: "La teoría cinética explica que la presión de un gas surge de millones de colisiones elásticas contra las paredes." },
        { start: 3.5, end: 7.2, en: "Boyle's Law states that at constant temperature, halving the volume doubles collision frequency, doubling pressure.", es: "La ley de Boyle establece que a temperatura constante, reducir el volumen a la mitad duplica las colisiones y la presión." },
        { start: 7.2, end: 10.8, en: "Gay-Lussac's Law shows heating gas increases particle speed (v_rms), producing harder, more frequent impacts.", es: "La ley de Gay-Lussac demuestra que calentar el gas aumenta la velocidad de las partículas, produciendo impactos más fuertes." },
        { start: 10.8, end: 14.0, en: "When thermal energy drops, intermolecular bonds overcome kinetic chaos, condensing gas into crystal solid.", es: "Al bajar la energía térmica, los enlaces intermoleculares superan el caos cinético, condensando el gas en sólido." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.34,
            title: 'Boyle\'s Law Invariant',
            prompt: 'At constant temperature, what happens to the gas pressure if the piston compresses the chamber to half its volume?',
            options: [
              'Pressure doubles because wall collisions occur twice as frequently (P ∝ 1/V)',
              'Pressure is halved because there is less space',
              'Pressure remains unchanged because temperature is constant'
            ],
            answer: 0,
            explanation: 'Boyle\'s Law dictates that P1 × V1 = P2 × V2. Halving the volume halves the distance between walls, doubling collision frequency and doubling measured pressure.'
          },
          {
            t: 0.69,
            title: 'Gay-Lussac\'s Law',
            prompt: 'Why does heating a sealed, rigid container increase internal gas pressure?',
            options: [
              'Particles gain kinetic energy, moving faster (v_rms) and exerting greater momentum impulses on walls',
              'Particles expand in size and push against each other',
              'The container walls shrink when heated'
            ],
            answer: 0,
            explanation: 'Thermal energy directly scales the root-mean-square velocity v_rms = √(3kT/m). Particles strike walls with greater velocity and higher frequency.'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">
            <defs>
              <linearGradient id="kgPistonShaft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#64748b"/>
                <stop offset="50%" stop-color="#94a3b8"/>
                <stop offset="100%" stop-color="#475569"/>
              </linearGradient>
              <linearGradient id="kgMercuryTube" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#ef4444"/>
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="#090d16"/>
            <!-- Title -->
            <text x="400" y="38" fill="#f8fafc" font-size="20" font-weight="900" text-anchor="middle">Kinetic Gas Theory &amp; Thermodynamics (PV = nRT)</text>
            <text x="400" y="58" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Elastic Wall Collisions, Boyle's Law &amp; Thermal Molecular Chaos</text>

            <!-- Chamber Cylinder -->
            <rect x="40" y="80" width="460" height="300" rx="16" fill="#0b1120" stroke="#334155" stroke-width="6"/>

            <!-- Grid Lines inside chamber -->
            <g opacity="0.12" stroke="#38bdf8" stroke-width="1">
              <line x1="40" y1="140" x2="500" y2="140"/><line x1="40" y1="200" x2="500" y2="200"/><line x1="40" y1="260" x2="500" y2="260"/><line x1="40" y1="320" x2="500" y2="320"/>
              <line x1="120" y1="80" x2="120" y2="380"/><line x1="200" y1="80" x2="200" y2="380"/><line x1="280" y1="80" x2="280" y2="380"/><line x1="360" y1="80" x2="360" y2="380"/><line x1="440" y1="80" x2="440" y2="380"/>
            </g>

            <!-- Gas Particles Group -->
            <g id="kg-particles-group">
              <circle class="kg-dot" cx="80" cy="140" r="6" fill="#38bdf8"/>
              <circle class="kg-dot" cx="120" cy="220" r="6" fill="#4ade80"/>
              <circle class="kg-dot" cx="210" cy="110" r="6" fill="#facc15"/>
              <circle class="kg-dot" cx="160" cy="300" r="6" fill="#f43f5e"/>
              <circle class="kg-dot" cx="290" cy="180" r="6" fill="#38bdf8"/>
              <circle class="kg-dot" cx="240" cy="260" r="6" fill="#4ade80"/>
              <circle class="kg-dot" cx="340" cy="130" r="6" fill="#facc15"/>
              <circle class="kg-dot" cx="180" cy="160" r="6" fill="#38bdf8"/>
              <circle class="kg-dot" cx="320" cy="310" r="6" fill="#4ade80"/>
              <circle class="kg-dot" cx="100" cy="270" r="6" fill="#f43f5e"/>
              <circle class="kg-dot" cx="260" cy="340" r="6" fill="#38bdf8"/>
              <circle class="kg-dot" cx="380" cy="230" r="6" fill="#facc15"/>
              <circle id="kg-brownian" cx="200" cy="210" r="16" fill="#f59e0b" stroke="#fef3c7" stroke-width="3" opacity="0.9"/>
            </g>

            <!-- Movable Piston -->
            <g id="kg-piston" transform="translate(430, 0)">
              <rect x="0" y="80" width="28" height="300" rx="4" fill="url(#kgPistonShaft)" stroke="#cbd5e1" stroke-width="2"/>
              <line x1="14" y1="95" x2="14" y2="365" stroke="#334155" stroke-width="4"/>
              <rect x="28" y="215" width="80" height="30" rx="6" fill="#475569" stroke="#64748b" stroke-width="2"/>
              <circle cx="100" cy="230" r="14" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
              <text x="14" y="235" fill="#090d16" font-size="11" font-weight="900" text-anchor="middle" transform="rotate(-90 14 235)">PISTON</text>
            </g>

            <!-- Bourdon Pressure Gauge -->
            <g transform="translate(630, 160)">
              <circle cx="0" cy="0" r="64" fill="#0f172a" stroke="#475569" stroke-width="6"/>
              <circle cx="0" cy="0" r="56" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
              <path d="M -40 25 A 50 50 0 1 1 40 25" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="2 8"/>
              <g id="kg-gauge-needle" transform="rotate(-45 0 0)">
                <line x1="0" y1="8" x2="0" y2="-44" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                <circle cx="0" cy="0" r="6" fill="#f8fafc"/>
              </g>
              <text x="0" y="24" fill="#94a3b8" font-size="9" font-weight="800" text-anchor="middle">PRESSURE</text>
              <text id="kg-gauge-val" x="0" y="42" fill="#38bdf8" font-size="14" font-weight="900" text-anchor="middle" font-family="monospace">101.3 kPa</text>
            </g>

            <!-- Thermometer Cylinder -->
            <g transform="translate(730, 90)">
              <rect x="0" y="0" width="22" height="180" rx="11" fill="#1e293b" stroke="#475569" stroke-width="2"/>
              <rect id="kg-thermo-fluid" x="4" y="60" width="14" height="116" rx="7" fill="url(#kgMercuryTube)"/>
              <circle cx="11" cy="180" r="16" fill="#ef4444" stroke="#475569" stroke-width="2"/>
              <text id="kg-thermo-val" x="11" y="215" fill="#fca5a5" font-size="12" font-weight="900" text-anchor="middle" font-family="monospace">300 K</text>
            </g>

            <!-- State of Matter Indicators -->
            <g transform="translate(560, 310)">
              <rect width="210" height="42" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
              <rect id="kg-ind-solid" x="10" y="8" width="58" height="26" rx="4" fill="#1e293b"/>
              <text x="39" y="24" fill="#64748b" font-size="10" font-weight="900" text-anchor="middle">SOLID</text>
              <rect id="kg-ind-liquid" x="76" y="8" width="58" height="26" rx="4" fill="#1e293b"/>
              <text x="105" y="24" fill="#64748b" font-size="10" font-weight="900" text-anchor="middle">LIQUID</text>
              <rect id="kg-ind-gas" x="142" y="8" width="58" height="26" rx="4" fill="#2563eb"/>
              <text x="171" y="24" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">GAS</text>
            </g>

            <!-- Bottom Formula Card -->
            <g transform="translate(40, 400)">
              <rect width="720" height="58" rx="10" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>
              <text x="20" y="22" fill="#86efac" font-size="11" font-weight="800">BOYLE'S LAW INVARIANT (T = CONSTANT):</text>
              <text id="kg-pv-eq" x="20" y="44" fill="#22c55e" font-size="16" font-weight="900" font-family="monospace">P &times; V = k &nbsp;&bull;&nbsp; (101.3 kPa &times; 100% Volume = 10,130)</text>
            </g>
          </svg>
        `;
        return {
          piston: container.querySelector('#kg-piston'),
          needle: container.querySelector('#kg-gauge-needle'),
          gaugeVal: container.querySelector('#kg-gauge-val'),
          thermoFluid: container.querySelector('#kg-thermo-fluid'),
          thermoVal: container.querySelector('#kg-thermo-val'),
          pvEq: container.querySelector('#kg-pv-eq'),
          indSolid: container.querySelector('#kg-ind-solid'),
          indGas: container.querySelector('#kg-ind-gas'),
          brownian: container.querySelector('#kg-brownian'),
          dots: container.querySelectorAll('.kg-dot')
        };
      },
      update(t, el) {
        if (!el || !el.piston) return;
        // Piston position
        const pistonX = t < 0.25 ? 430 : (t < 0.60 ? (430 - 180 * Math.min(1, (t - 0.25) / 0.25)) : (t < 0.85 ? 250 : (250 + 180 * ((t - 0.85) / 0.15))));
        el.piston.setAttribute('transform', `translate(${pistonX.toFixed(1)}, 0)`);

        // Gauge needle rotation & reading
        const angle = -45 + (t < 0.25 ? 0 : (t < 0.60 ? 70 * ((t - 0.25) / 0.25) : (t < 0.85 ? 120 : (120 - 100 * ((t - 0.85) / 0.15)))));
        if (el.needle) el.needle.setAttribute('transform', `rotate(${angle.toFixed(1)} 0 0)`);
        
        const pressure = (101.3 + (t < 0.25 ? 0 : (t < 0.60 ? 101.3 * ((t - 0.25) / 0.25) : (t < 0.85 ? 202.6 : 0)))).toFixed(1);
        if (el.gaugeVal) el.gaugeVal.textContent = `${pressure} kPa`;

        // Thermometer
        const isHot = t > 0.60 && t < 0.85;
        const isCold = t >= 0.85;
        if (el.thermoFluid) {
          el.thermoFluid.setAttribute('height', isHot ? '150' : (isCold ? '40' : '116'));
          el.thermoFluid.setAttribute('y', isHot ? '30' : (isCold ? '140' : '64'));
        }
        if (el.thermoVal) el.thermoVal.textContent = isHot ? '600 K' : (isCold ? '90 K' : '300 K');

        // State indicator pills
        if (el.indGas) el.indGas.setAttribute('fill', isCold ? '#1e293b' : '#2563eb');
        if (el.indSolid) el.indSolid.setAttribute('fill', isCold ? '#22c55e' : '#1e293b');

        // Brownian pollen motion
        if (el.brownian) {
          el.brownian.setAttribute('cx', (200 + Math.sin(t * 24) * 25).toFixed(1));
          el.brownian.setAttribute('cy', (210 + Math.cos(t * 31) * 20).toFixed(1));
        }

        // Particle jitter
        if (el.dots) {
          const speedFactor = isHot ? 2.5 : (isCold ? 0.3 : 1.0);
          el.dots.forEach((dot, idx) => {
            const jitterX = Math.sin(t * (10 + idx) * speedFactor) * 8;
            const jitterY = Math.cos(t * (12 + idx) * speedFactor) * 8;
            dot.setAttribute('transform', `translate(${jitterX.toFixed(1)}, ${jitterY.toFixed(1)})`);
          });
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#090d16"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Kinetic Gas Theory &amp; Boyle's Law</text>`;
      }
    },

    'calculus-curves': {
      id: 'calculus-curves',
      stage: 'GCSE & A-LEVEL MATHS',
      title: '📐 Calculus: Tangent Slopes & Definite Integrals (dy/dx & ∫)',
      duration: 14.0,
      svgFile: 'scenes/calculus-curves.svg',
      astFile: 'scenes/calculus-curves.ast',
      keyframes: [
        { t: 0.00, title: 'Function Graph f(x)', rule: 'Quadratic parabola f(x) = x² - 2x with vertex minimum at (1, -1).' },
        { t: 0.35, title: 'Tangent Gradient dy/dx', rule: 'Slope probe moves along curve: dy/dx = 2x - 2 evaluates instantaneous rate of change.' },
        { t: 0.70, title: 'Stationary Turning Point', rule: 'At x = 1, dy/dx = 0 -> Horizontal tangent marks local minimum vertex.' },
        { t: 1.00, title: 'Definite Integration Area', rule: 'Definite integral ∫[0, 3] (x² - 2x) dx computes net accumulated area.' }
      ],
      subtitles: [
        { start: 0.0, end: 3.5, en: "Calculus reveals how mathematical curves change locally and accumulate globally.", es: "El cálculo revela cómo las curvas matemáticas cambian localmente y se acumulan globalmente." },
        { start: 3.5, end: 7.2, en: "Differentiation finds the derivative dy/dx, the exact instantaneous gradient of the tangent line.", es: "La diferenciación encuentra la derivada dy/dx, la pendiente instantánea exacta de la recta tangente." },
        { start: 7.2, end: 10.8, en: "At stationary points where dy/dx = 0, the tangent line is completely horizontal, marking maximums and minimums.", es: "En los puntos estacionarios donde dy/dx = 0, la recta tangente es horizontal, marcando máximos y mínimos." },
        { start: 10.8, end: 14.0, en: "Integration reverses differentiation, accumulating continuous area under the curve between boundaries a and b.", es: "La integración invierte la diferenciación, acumulando el área continua bajo la curva entre los límites a y b." }
      ],
      interactive: {
        checkpoints: [
          {
            t: 0.34,
            title: 'Derivative Slope Definition',
            prompt: 'What does the derivative dy/dx evaluate at any specific point on a function curve?',
            options: [
              'The exact instantaneous gradient of the tangent line (rate of change)',
              'The total area between the curve and the x-axis',
              'The length of the curve from origin to point'
            ],
            answer: 0,
            explanation: 'The derivative dy/dx represents the limit of Δy/Δx as Δx approaches zero, yielding the instantaneous slope of the tangent line at that exact coordinate.'
          },
          {
            t: 0.69,
            title: 'Stationary Point Condition',
            prompt: 'When the tangent probe reaches a local minimum or maximum, what is the value of dy/dx?',
            options: [
              'dy/dx = 0 (the tangent line is completely horizontal)',
              'dy/dx = 1 (a 45-degree angle)',
              'dy/dx is infinite'
            ],
            answer: 0,
            explanation: 'At turning points (local extrema), the curve momentarily stops rising or falling, meaning the rate of change is zero (horizontal tangent line).'
          }
        ]
      },
      mount(container) {
        container.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090d16;">
            <defs>
              <linearGradient id="calcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="50%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#c084fc"/>
              </linearGradient>
              <linearGradient id="calcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(34, 197, 94, 0.45)"/>
                <stop offset="100%" stop-color="rgba(34, 197, 94, 0.08)"/>
              </linearGradient>
            </defs>
            <rect width="800" height="480" fill="#090d16"/>
            <!-- Title -->
            <text x="400" y="38" fill="#f8fafc" font-size="20" font-weight="900" text-anchor="middle">Calculus: Differentiation &amp; Integration</text>
            <text x="400" y="58" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Tangent Slope (dy/dx) &amp; Shaded Area Under Curve ∫f(x)dx</text>

            <!-- Coordinate Grid Box -->
            <g transform="translate(50, 80)">
              <rect width="500" height="300" rx="12" fill="#0b1120" stroke="#334155" stroke-width="3"/>
              <!-- Grid Lines -->
              <g opacity="0.15" stroke="#38bdf8" stroke-width="1">
                <line x1="50" y1="0" x2="50" y2="300"/><line x1="100" y1="0" x2="100" y2="300"/><line x1="150" y1="0" x2="150" y2="300"/><line x1="200" y1="0" x2="200" y2="300"/>
                <line x1="250" y1="0" x2="250" y2="300"/><line x1="300" y1="0" x2="300" y2="300"/><line x1="350" y1="0" x2="350" y2="300"/><line x1="400" y1="0" x2="400" y2="300"/><line x1="450" y1="0" x2="450" y2="300"/>
                <line x1="0" y1="60" x2="500" y2="60"/><line x1="0" y1="120" x2="500" y2="120"/><line x1="0" y1="180" x2="500" y2="180"/><line x1="0" y1="210" x2="500" y2="210"/><line x1="0" y1="240" x2="500" y2="240"/>
              </g>
              <!-- Axes -->
              <line x1="0" y1="210" x2="500" y2="210" stroke="#64748b" stroke-width="2"/>
              <line x1="250" y1="0" x2="250" y2="300" stroke="#64748b" stroke-width="2"/>
              <text x="490" y="202" fill="#94a3b8" font-size="12" font-weight="800">x</text>
              <text x="258" y="16" fill="#94a3b8" font-size="12" font-weight="800">y</text>

              <!-- Shaded Integral Area -->
              <path id="cc-integral-area" d="M 250 210 L 250 210 Q 325 150 400 90 L 400 210 Z" fill="url(#calcAreaGrad)" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 3"/>

              <!-- Parabola Curve y = x² - 2x -->
              <path d="M 50 270 Q 150 240 250 210 T 450 60" fill="none" stroke="url(#calcGrad)" stroke-width="4" stroke-linecap="round"/>

              <!-- Tangent Assembly -->
              <g id="cc-tangent-assembly" transform="translate(300, 180)">
                <line id="cc-tangent-line" x1="-90" y1="45" x2="90" y2="-45" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
                <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#f43f5e" stroke-width="3"/>
              </g>
            </g>

            <!-- Right Instrument Rack -->
            <g transform="translate(570, 80)">
              <rect width="190" height="74" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
              <text x="14" y="24" fill="#94a3b8" font-size="10" font-weight="800">FUNCTION f(x):</text>
              <text x="14" y="48" fill="#38bdf8" font-size="16" font-weight="900" font-family="monospace">f(x) = x² - 2x</text>

              <g transform="translate(0, 86)">
                <rect width="190" height="96" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5"/>
                <text x="14" y="22" fill="#fda4af" font-size="10" font-weight="800">DERIVATIVE (TANGENT):</text>
                <text x="14" y="42" fill="#cbd5e1" font-size="12" font-weight="700" font-family="monospace">f'(x) = 2x - 2</text>
                <text x="14" y="64" fill="#94a3b8" font-size="11" font-weight="700">Slope dy/dx at probe:</text>
                <text id="cc-slope-val" x="14" y="86" fill="#f43f5e" font-size="18" font-weight="900" font-family="monospace">m = +2.00</text>
              </g>

              <g transform="translate(0, 194)">
                <rect width="190" height="106" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>
                <text x="14" y="22" fill="#86efac" font-size="10" font-weight="800">DEFINITE INTEGRAL (AREA):</text>
                <text x="14" y="44" fill="#cbd5e1" font-size="13" font-weight="700" font-family="monospace">Area = ∫ f(x) dx</text>
                <text x="14" y="72" fill="#94a3b8" font-size="11" font-weight="700">Riemann Sum:</text>
                <text x="14" y="96" fill="#22c55e" font-size="18" font-weight="900" font-family="monospace">Area = 4.500</text>
              </g>
            </g>

            <!-- Bottom Banner -->
            <g transform="translate(50, 400)">
              <rect width="710" height="58" rx="10" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>
              <text x="20" y="24" fill="#a5b4fc" font-size="11" font-weight="800">FUNDAMENTAL THEOREM OF CALCULUS:</text>
              <text id="cc-note" x="20" y="44" fill="#e0e7ff" font-size="13" font-weight="700">Differentiation gives the instantaneous gradient; Integration calculates cumulative area.</text>
            </g>
          </svg>
        `;
        return {
          assembly: container.querySelector('#cc-tangent-assembly'),
          line: container.querySelector('#cc-tangent-line'),
          slopeVal: container.querySelector('#cc-slope-val'),
          area: container.querySelector('#cc-integral-area'),
          note: container.querySelector('#cc-note')
        };
      },
      update(t, el) {
        if (!el || !el.assembly) return;
        const interp = Math.min(1, t / 0.85);
        const posX = 150 + 200 * interp;
        const mathX = (posX - 250) / 50;
        const mathY = mathX * mathX - 2 * mathX;
        const posY = 210 - mathY * 25;

        el.assembly.setAttribute('transform', `translate(${posX.toFixed(1)}, ${posY.toFixed(1)})`);

        const slope = 2 * mathX - 2;
        const angle = -Math.atan(slope) * 180 / Math.PI;
        if (el.line) el.line.setAttribute('transform', `rotate(${angle.toFixed(1)})`);

        if (el.slopeVal) {
          el.slopeVal.textContent = `m = ${slope >= 0 ? '+' : ''}${slope.toFixed(2)}`;
        }

        if (el.area) {
          el.area.setAttribute('opacity', t > 0.65 ? Math.min(1, (t - 0.65) / 0.25).toFixed(2) : '0.25');
        }
      },
      render(t) {
        return `<rect width="800" height="480" fill="#090d16"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">Calculus: Tangents &amp; Integrals</text>`;
      }
    }
  };

  /**
   * SceneRegistry - Singleton API for managing and querying AST scenes
   */
  const SceneRegistry = {
    normalizeId(id) {
      if (!id) return '';
      const clean = String(id).trim().toLowerCase().replace(/\.(ast|json|svg)$/, '');
      const aliases = {
        'church': 'church-tour',
        'church_tour': 'church-tour',
        'churchtour': 'church-tour',
        'church-tour': 'church-tour',
        'catholic-church': 'church-tour',
        'catholic_church': 'church-tour',
        'shakespeare': 'shakespeare',
        'globe': 'shakespeare',
        'globe-theatre': 'shakespeare',
        'globetheatre': 'shakespeare',
        'macbeth': 'shakespeare',
        'hamlet': 'shakespeare',
        'romeo': 'shakespeare',
        'juliet': 'shakespeare',
        'languages': 'languages',
        'mfl': 'languages',
        'spanish': 'languages',
        'french': 'languages',
        'latin': 'languages',
        'polyglot': 'languages',
        'fraction': 'fractions',
        'fractions': 'fractions',
        'solarsystem': 'solar-system',
        'solar_system': 'solar-system',
        'space': 'solar-system',
        'photosyn': 'photosynthesis',
        'pythagorean': 'pythagoras',
        'watercycle': 'water-cycle',
        'water_cycle': 'water-cycle',
        'dna': 'dna-helix',
        'dna_helix': 'dna-helix',
        'mountain': 'mountain-elevation',
        'mountain_elevation': 'mountain-elevation',
        'mountainelevation': 'mountain-elevation',
        'altitude': 'mountain-elevation',
        'elevation': 'mountain-elevation',
        'climb': 'mountain-elevation',
        'climber': 'mountain-elevation',
        'fishtank': 'fish-tank',
        'fish_tank': 'fish-tank',
        'fish-tank': 'fish-tank',
        'aquarium': 'fish-tank',
        'benchmark': 'fish-tank',
        'stress': 'fish-tank',
        'math-fishing': 'math-fishing',
        'math_fishing': 'math-fishing',
        'mathfishing': 'math-fishing',
        'fishing': 'math-fishing',
        'pond': 'math-fishing',
        'number-bonds': 'math-fishing',
        'balance': 'algebra-balance',
        'algebra': 'algebra-balance',
        'algebra-balance': 'algebra-balance',
        'scale': 'algebra-balance',
        'circuits': 'electric-circuits',
        'circuit': 'electric-circuits',
        'ohms-law': 'electric-circuits',
        'electric-circuits': 'electric-circuits',
        'electricity': 'electric-circuits',
        'kinetic-gas': 'kinetic-gas',
        'kinetic_gas': 'kinetic-gas',
        'gas': 'kinetic-gas',
        'boyle': 'kinetic-gas',
        'thermodynamics': 'kinetic-gas',
        'calculus': 'calculus-curves',
        'calculus-curves': 'calculus-curves',
        'calculus_curves': 'calculus-curves',
        'curves': 'calculus-curves',
        'differentiation': 'calculus-curves',
        'derivatives': 'calculus-curves'
      };
      return aliases[clean] || clean;
    },

    register(id, scene) {
      if (!id || !scene) return;
      scenes[id] = scene;
      const norm = this.normalizeId(id);
      if (norm && norm !== id) scenes[norm] = scene;
    },

    get(id) {
      const norm = this.normalizeId(id);
      return scenes[norm] || scenes[id] || null;
    },

    list() {
      const seen = new Set();
      const result = [];
      Object.values(scenes).forEach((s) => {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          result.push({
            id: s.id,
            stage: s.stage,
            title: s.title,
            duration: s.duration,
            svgFile: s.svgFile,
            astFile: s.astFile,
            keyframeCount: s.keyframes?.length || 0
          });
        }
      });
      return result;
    },

    has(id) {
      const norm = this.normalizeId(id);
      return Object.prototype.hasOwnProperty.call(scenes, norm) || Object.prototype.hasOwnProperty.call(scenes, id);
    },

    defineScene(config) {
      if (!config || !config.id || !config.title) {
        throw new Error('Scene definition must include at least id and title');
      }
      const validated = Object.assign({
        stage: 'CURRICULUM',
        duration: 10.0,
        viewBox: '0 0 800 480',
        keyframes: [],
        subtitles: [],
        render: () => '<text x="400" y="240" fill="#fff" text-anchor="middle">Scene Ready</text>'
      }, config);
      this.register(validated.id, validated);
      return validated;
    },

    parseAstScene(definition) {
      if (typeof definition === 'object' && definition !== null) {
        return definition;
      }
      if (typeof definition !== 'string') return null;

      const trimmed = definition.trim();
      if (trimmed.startsWith('{')) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }

      if (trimmed.startsWith('(')) {
        try {
          const extractSlot = (regex) => {
            const match = trimmed.match(regex);
            return match ? match[1].trim().replace(/^"|"$/g, '') : null;
          };
          const id = extractSlot(/:id\s+("[^"]+"|[^\s\)]+)/i);
          const title = extractSlot(/:title\s+"([^"]+)"/i);
          const stage = extractSlot(/:stage\s+"([^"]+)"/i) || 'CURRICULUM';
          const duration = parseFloat(extractSlot(/:duration\s+([\d\.]+)/i) || '10.0');

          // Extract keyframes if present
          const keyframes = [];
          const kfRegex = /\(:t\s+([\d\.]+)\s+:title\s+"([^"]+)"\s+:rule\s+"([^"]+)"\)/gi;
          let match;
          while ((match = kfRegex.exec(trimmed)) !== null) {
            keyframes.push({ t: parseFloat(match[1]), title: match[2], rule: match[3] });
          }

          // Extract subtitles
          const subtitles = [];
          const subRegex = /\(:start\s+([\d\.]+)\s+:end\s+([\d\.]+)\s+:en\s+"([^"]+)"(?:\s+:es\s+"([^"]+)")?(?:\s+:la\s+"([^"]+)")?\)/gi;
          while ((match = subRegex.exec(trimmed)) !== null) {
            subtitles.push({ start: parseFloat(match[1]), end: parseFloat(match[2]), en: match[3], es: match[4] || '', la: match[5] || '' });
          }

          // Extract bindings
          const bindings = [];
          const bindRegex = /\(:target\s+"([^"]+)"\s+:attr\s+"([^"]+)"\s+:expr\s+"([^"]+)"\)/gi;
          while ((match = bindRegex.exec(trimmed)) !== null) {
            bindings.push({ target: match[1], attr: match[2], expr: match[3] });
          }

          if (id && title) {
            return {
              id,
              stage,
              title,
              duration,
              keyframes,
              subtitles,
              bindings,
              render: () => `<rect x="250" y="200" width="300" height="80" rx="8" fill="#1e293b"/><text x="400" y="248" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">${title}</text>`
            };
          }
        } catch (err) {
          console.warn('Could not parse S-expression scene:', err);
        }
      }

      return null;
    },

    async loadConfig(url = './scenes.manifest.json') {
      try {
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('./scenes-config.json').catch(() => null);
        }
        if (!res || !res.ok) return null;
        const config = await res.json();
        if (config && Array.isArray(config.scenes)) {
          config.scenes.forEach(sc => {
            if (sc && sc.id && scenes[sc.id]) {
              if (sc.title) scenes[sc.id].title = sc.title;
              if (sc.stage) scenes[sc.id].stage = sc.stage;
              if (sc.duration) scenes[sc.id].duration = sc.duration;
              if (sc.keyframes) scenes[sc.id].keyframes = sc.keyframes;
              if (sc.subtitles) scenes[sc.id].subtitles = sc.subtitles;
              if (sc.svgFile) scenes[sc.id].svgFile = sc.svgFile;
              if (sc.astFile) scenes[sc.id].astFile = sc.astFile;
            }
          });
        }
        return config;
      } catch (err) {
        console.warn('ASTSceneRegistry.loadConfig notice:', err);
        return null;
      }
    }
  };

  // Expose globally
  global.ASTScenes = scenes;
  global.ASTSceneRegistry = SceneRegistry;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scenes, SceneRegistry };
  }
})(typeof window !== 'undefined' ? window : globalThis);
