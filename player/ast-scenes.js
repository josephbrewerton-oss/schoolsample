/**
 * static/player/ast-scenes.js
 * 
 * AST-Guided Curriculum Scene Definitions & Scene Registry
 * Can be loaded as a standalone module or bundled into micro-frontends.
 */

(function (global) {
  'use strict';

  const scenes = {
    'fractions': {
      id: 'fractions',
      stage: 'KS2 MATHS',
      title: 'Fractions: Why Common Denominators Rule',
      duration: 12.0,
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
      render(t) {
        const cx = 400, cy = 240, r = 140;
        let svg = '';

        // Outer guideline ring
        svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6 6" />`;

        const sliceProgress = Math.min(1, Math.max(0, (t - 0.35) / 0.35));
        const mergeProgress = Math.min(1, Math.max(0, (t - 0.7) / 0.3));

        // Slice 1: Original 1/2
        if (sliceProgress < 0.05) {
          svg += `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="#3b82f6" fill-opacity="0.8" stroke="#60a5fa" stroke-width="3" />`;
          svg += `<text x="${cx + 60}" y="${cy + 8}" fill="#ffffff" font-size="24" font-weight="bold" text-anchor="middle">1/2</text>`;
        } else {
          const cutGap = sliceProgress * 6;
          // Quarter A
          svg += `<path d="M ${cx} ${cy - r - cutGap/2} A ${r} ${r} 0 0 1 ${cx + r} ${cy - cutGap/2} L ${cx} ${cy - cutGap/2} Z" fill="#2563eb" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<text x="${cx + 50}" y="${cy - 40 - cutGap/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">1/4</text>`;

          // Quarter B
          svg += `<path d="M ${cx} ${cy + cutGap/2} L ${cx + r} ${cy + cutGap/2} A ${r} ${r} 0 0 1 ${cx} ${cy + r + cutGap/2} Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<text x="${cx + 50}" y="${cy + 55 + cutGap/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">1/4</text>`;

          if (sliceProgress > 0 && sliceProgress < 0.95) {
            const bladeX = cx + sliceProgress * r;
            svg += `<line x1="${cx - 10}" y1="${cy}" x2="${bladeX}" y2="${cy}" stroke="#f43f5e" stroke-width="4" filter="url(#glow)" />`;
            svg += `<circle cx="${bladeX}" cy="${cy}" r="6" fill="#ffe4e6" />`;
          }
        }

        // Slice 2: The 1/4 piece sliding in
        const quarterStartX = cx - 180;
        const quarterEndX = cx;
        const quarterCurX = quarterStartX + mergeProgress * (quarterEndX - quarterStartX);
        const quarterCurY = cy;

        svg += `<path d="M ${quarterCurX} ${quarterCurY} L ${quarterCurX - r} ${quarterCurY} A ${r} ${r} 0 0 1 ${quarterCurX} ${quarterCurY - r} Z" fill="#10b981" fill-opacity="0.85" stroke="#34d399" stroke-width="3" />`;
        svg += `<text x="${quarterCurX - 55}" y="${quarterCurY - 45}" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">1/4</text>`;

        // Notation callout
        let mathString = "1/2 + 1/4 = ?";
        if (t >= 0.35 && t < 0.70) mathString = "(1×2)/(2×2) + 1/4 = 2/4 + 1/4";
        if (t >= 0.70) mathString = "2/4 + 1/4 = 3/4 (Solved!)";

        svg += `<rect x="250" y="24" width="300" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />`;
        svg += `<text x="400" y="51" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">${mathString}</text>`;

        return svg;
      }
    },

    'solar-system': {
      id: 'solar-system',
      stage: 'KS3 SCIENCE',
      title: 'Solar System: Heliocentric Planetary Motion',
      duration: 14.0,
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
      render(t) {
        const cx = 400, cy = 240;
        let svg = '';

        // Stars background
        for (let i = 0; i < 40; i++) {
          const sx = (i * 97) % 800;
          const sy = (i * 71) % 480;
          const op = 0.2 + ((i + t * 5) % 1) * 0.6;
          svg += `<circle cx="${sx}" cy="${sy}" r="1" fill="#ffffff" opacity="${op.toFixed(2)}" />`;
        }

        // Sun
        svg += `<circle cx="${cx}" cy="${cy}" r="32" fill="url(#grad-sun)" filter="url(#glow)" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="26" fill="#f59e0b" />`;

        const planets = [
          { name: 'Mercury', r: 5, orbR: 65, speed: 4.15, col: '#94a3b8' },
          { name: 'Venus',   r: 8, orbR: 105, speed: 1.62, col: '#fde047' },
          { name: 'Earth',   r: 9, orbR: 155, speed: 1.00, col: '#38bdf8' },
          { name: 'Mars',    r: 6, orbR: 205, speed: 0.53, col: '#ef4444' }
        ];

        planets.forEach((p) => {
          svg += `<circle cx="${cx}" cy="${cy}" r="${p.orbR}" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" />`;
          const angle = t * Math.PI * 2 * p.speed;
          const px = cx + Math.cos(angle) * p.orbR;
          const py = cy + Math.sin(angle) * p.orbR;

          svg += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${p.r}" fill="${p.col}" />`;
          svg += `<text x="${px.toFixed(1)}" y="${(py + p.r + 13).toFixed(1)}" fill="#cbd5e1" font-size="11" font-weight="600" text-anchor="middle">${p.name}</text>`;

          if (p.name === 'Earth') {
            const moonAngle = t * Math.PI * 2 * 12;
            const mx = px + Math.cos(moonAngle) * 18;
            const my = py + Math.sin(moonAngle) * 18;
            svg += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="2.5" fill="#f8fafc" />`;
          }
        });

        return svg;
      }
    },

    'photosynthesis': {
      id: 'photosynthesis',
      stage: 'KS3 BIOLOGY',
      title: 'Photosynthesis: The Green Solar Engine',
      duration: 10.0,
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
      render(t) {
        const ox = 360, oy = 280;
        const a = 90;  // 3 * 30px
        const b = 120; // 4 * 30px
        let svg = '';

        // Triangle
        svg += `<polygon points="${ox},${oy} ${ox + b},${oy} ${ox},${oy - a}" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />`;
        svg += `<rect x="${ox}" y="${oy - 16}" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="1.5" />`;

        const fillB = Math.min(1, t / 0.5);
        svg += `<rect x="${ox}" y="${oy}" width="${b}" height="${b * fillB}" fill="#3b82f6" fill-opacity="0.6" stroke="#60a5fa" stroke-width="2" />`;
        if (fillB > 0.5) {
          svg += `<text x="${ox + b/2}" y="${oy + b/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">b² = 16</text>`;
        }

        const fillA = Math.min(1, Math.max(0, (t - 0.25) / 0.5));
        svg += `<rect x="${ox - a * fillA}" y="${oy - a}" width="${a * fillA}" height="${a}" fill="#10b981" fill-opacity="0.6" stroke="#34d399" stroke-width="2" />`;
        if (fillA > 0.5) {
          svg += `<text x="${ox - a/2}" y="${oy - a/2}" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">a² = 9</text>`;
        }

        svg += `<rect x="230" y="24" width="340" height="40" rx="8" fill="#1e293b" stroke="#334155" />`;
        svg += `<text x="400" y="49" fill="#f59e0b" font-size="18" font-weight="bold" text-anchor="middle">3² + 4² = 5² ➔ 9 + 16 = 25</text>`;

        return svg;
      }
    },

    'water-cycle': {
      id: 'water-cycle',
      stage: 'KS2 GEOGRAPHY',
      title: 'Water Cycle: Continuous Earth Cycle',
      duration: 10.0,
      keyframes: [
        { t: 0.00, title: 'Solar Heating & Evaporation', rule: 'Sun warms ocean water, converting liquid into invisible water vapor.' },
        { t: 0.35, title: 'Atmospheric Condensation', rule: 'Rising vapor cools and condenses into cloud water droplets.' },
        { t: 0.70, title: 'Precipitation', rule: 'Heavy clouds release moisture as rain, sleet, or snow.' },
        { t: 1.00, title: 'Runoff & Collection', rule: 'Rivers carry precipitation back to oceans, completing the closed cycle.' }
      ],
      subtitles: [
        { start: 0.0, end: 0.35, en: "Solar energy heats water surfaces, causing evaporation into rising gas molecules.", es: "La energía solar calienta el agua provocando la evaporación en moléculas de gas." },
        { start: 0.35, end: 0.70, en: "As vapor climbs into cold upper air, it condenses into visible fluffy clouds.", es: "Al subir al aire frío, el vapor se condensa en nubes esponjosas." },
        { start: 0.70, end: 1.00, en: "When droplets become too heavy, gravity pulls them down as precipitation.", es: "Cuando las gotas son pesadas, la gravedad las hace caer en precipitación." }
      ],
      render(t) {
        let svg = '';
        svg += `<path d="M 0 340 Q 200 320, 450 350 L 800 350 L 800 480 L 0 480 Z" fill="#1d4ed8" />`;
        svg += `<path d="M 0 340 Q 200 240, 400 310 L 400 480 L 0 480 Z" fill="#334155" />`;
        svg += `<circle cx="700" cy="90" r="38" fill="url(#grad-sun)" filter="url(#glow)" />`;

        // Rising vapor
        for (let i = 0; i < 6; i++) {
          const vt = (t * 2 + i / 6) % 1;
          const x = 520 + i * 35;
          const y = 330 - vt * 160;
          svg += `<circle cx="${x}" cy="${y}" r="4" fill="#93c5fd" opacity="0.6" />`;
        }

        // Cloud
        svg += `<path d="M 280 140 Q 320 100, 380 130 Q 420 90, 480 130 Q 520 110, 550 140 Q 560 170, 520 180 L 310 180 Z" fill="#e2e8f0" opacity="0.9" />`;

        // Rain
        if (t > 0.45) {
          for (let r = 0; r < 8; r++) {
            const rt = (t * 3 + r / 8) % 1;
            const rx = 320 + r * 25;
            const ry = 190 + rt * 130;
            svg += `<line x1="${rx}" y1="${ry}" x2="${rx - 3}" y2="${ry + 8}" stroke="#60a5fa" stroke-width="2" />`;
          }
        }

        return svg;
      }
    },

    'atom': {
      id: 'atom',
      stage: 'KS3 CHEMISTRY',
      title: 'Atomic Structure: Bohr Electron Shells',
      duration: 12.0,
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
      render(t) {
        const cx = 400, cy = 240;
        let svg = '';

        svg += `<circle cx="${cx}" cy="${cy}" r="75" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;
        svg += `<circle cx="${cx}" cy="${cy}" r="145" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3" />`;

        // Nucleus
        svg += `<circle cx="${cx - 5}" cy="${cy - 5}" r="11" fill="#ef4444" />`;
        svg += `<circle cx="${cx + 6}" cy="${cy - 4}" r="11" fill="#94a3b8" />`;
        svg += `<circle cx="${cx}" cy="${cy + 6}" r="11" fill="#ef4444" />`;
        svg += `<text x="${cx}" y="${cy + 4}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">+ 0</text>`;

        // Inner electrons
        const e1Angle = t * Math.PI * 2 * 3;
        svg += `<circle cx="${(cx + Math.cos(e1Angle) * 75).toFixed(1)}" cy="${(cy + Math.sin(e1Angle) * 75).toFixed(1)}" r="6" fill="#38bdf8" filter="url(#glow)" />`;
        svg += `<circle cx="${(cx - Math.cos(e1Angle) * 75).toFixed(1)}" cy="${(cy - Math.sin(e1Angle) * 75).toFixed(1)}" r="6" fill="#38bdf8" filter="url(#glow)" />`;

        // Outer electrons (4 for Carbon)
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
      render(t) {
        let svg = '';
        const trackY = 130;
        const startX = 120;
        const endX = 680;
        const currentX = startX + t * (endX - startX);

        // Particle track
        svg += `<line x1="${startX}" y1="${trackY}" x2="${endX}" y2="${trackY}" stroke="#334155" stroke-width="4" stroke-linecap="round" />`;
        // Markers
        for (let m = 0; m <= 4; m++) {
          const mx = startX + (m / 4) * (endX - startX);
          svg += `<line x1="${mx}" y1="${trackY - 8}" x2="${mx}" y2="${trackY + 8}" stroke="#64748b" stroke-width="2" />`;
          svg += `<text x="${mx}" y="${trackY + 24}" fill="#94a3b8" font-size="11" text-anchor="middle">${m * 25}m</text>`;
        }

        // Particle
        svg += `<circle cx="${currentX.toFixed(1)}" cy="${trackY}" r="12" fill="#38bdf8" filter="url(#glow)" />`;
        // Velocity vector arrow
        const arrowLen = Math.sin(t * Math.PI) * 40 + 15;
        svg += `<line x1="${currentX}" y1="${trackY - 18}" x2="${currentX + arrowLen}" y2="${trackY - 18}" stroke="#10b981" stroke-width="3" />`;
        svg += `<polygon points="${currentX + arrowLen},${trackY - 22} ${currentX + arrowLen + 6},${trackY - 18} ${currentX + arrowLen},${trackY - 14}" fill="#10b981" />`;

        // Kinematics Graph Box
        const gx = 200, gy = 230, gw = 400, gh = 180;
        svg += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#0f172a" stroke="#1e293b" rx="8" />`;
        svg += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + gw - 20}" y2="${gy + gh - 30}" stroke="#475569" stroke-width="2" />`;
        svg += `<line x1="${gx + 40}" y1="${gy + gh - 30}" x2="${gx + 40}" y2="${gy + 20}" stroke="#475569" stroke-width="2" />`;
        svg += `<text x="${gx + 30}" y="${gy + 35}" fill="#94a3b8" font-size="11" text-anchor="end">s (m)</text>`;
        svg += `<text x="${gx + gw - 20}" y="${gy + gh - 12}" fill="#94a3b8" font-size="11" text-anchor="end">t (s)</text>`;

        // Distance curve up to current t
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
      render(t) {
        let svg = '';
        const cx = 400;
        const numPairs = 18;
        const totalHeight = 360;
        const startY = 60;

        for (let i = 0; i < numPairs; i++) {
          const pairT = i / numPairs;
          const y = startY + pairT * totalHeight;
          const angle = pairT * Math.PI * 3 + t * Math.PI * 2;
          const offset = Math.cos(angle) * 110;
          const x1 = cx - offset;
          const x2 = cx + offset;
          const zDepth = Math.sin(angle); // -1 to 1

          const baseColors = [
            { a: '#ef4444', b: '#10b981', labelA: 'A', labelB: 'T' },
            { a: '#3b82f6', b: '#f59e0b', labelA: 'C', labelB: 'G' },
          ];
          const pair = baseColors[i % 2];
          const opacity = (zDepth + 1.5) / 2.5;

          // Hydrogen bond rung
          svg += `<line x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}" stroke="#64748b" stroke-width="2.5" opacity="${opacity.toFixed(2)}" />`;
          // Left strand base
          svg += `<circle cx="${x1.toFixed(1)}" cy="${y}" r="8" fill="${pair.a}" opacity="${opacity.toFixed(2)}" />`;
          // Right strand base
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
      render(t) {
        let svg = '';

        // 1. Church Cruciform Architectural Walls & Ground (Latin Cross Floor Plan)
        // Outer stone outline
        svg += `<path d="M 310 440 L 310 240 L 160 240 L 160 160 L 310 160 L 310 50 Q 400 30, 490 50 L 490 160 L 640 160 L 640 240 L 490 240 L 490 440 Z" fill="#0b1120" stroke="#334155" stroke-width="3" />`;

        // Pavement grid lines
        svg += `<path d="M 310 390 L 490 390 M 310 340 L 490 340 M 310 290 L 490 290 M 310 240 L 490 240" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="2 4" />`;

        // Central Nave Red Carpet Runner (Pilgrim Way) and Pews
        svg += `<g class="ast-hotspot" data-target-t="0.20" data-label="2. The Nave & Central Aisle">`;
        svg += `<rect x="375" y="180" width="50" height="260" fill="#7f1d1d" opacity="0.8" rx="2" />`;
        svg += `<line x1="375" y1="180" x2="375" y2="440" stroke="#b91c1c" stroke-width="1.5" />`;
        svg += `<line x1="425" y1="180" x2="425" y2="440" stroke="#b91c1c" stroke-width="1.5" />`;

        // Pews in the Nave (Left & Right banks)
        for (let i = 0; i < 5; i++) {
          const pewY = 250 + i * 36;
          // Left pews
          svg += `<rect x="320" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          svg += `<line x1="324" y1="${pewY + 4}" x2="362" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
          // Right pews
          svg += `<rect x="434" y="${pewY}" width="46" height="18" rx="3" fill="#451a03" stroke="#78350f" stroke-width="1" />`;
          svg += `<line x1="438" y1="${pewY + 4}" x2="476" y2="${pewY + 4}" stroke="#92400e" stroke-width="1" />`;
        }
        svg += `</g>`;

        // Sanctuary Platform Steps (Elevated Presbyterium)
        svg += `<path d="M 310 180 L 490 180 L 490 60 Q 400 45, 310 60 Z" fill="#1e293b" stroke="#475569" stroke-width="2" />`;
        svg += `<path d="M 325 170 L 475 170 L 475 70 Q 400 58, 325 70 Z" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />`;

        // Altar of Sacrifice (Center of Sanctuary) - Hotspot
        svg += `<g class="ast-hotspot" data-target-t="0.60" data-label="4. The Altar of Sacrifice">`;
        svg += `<rect x="360" y="115" width="80" height="34" rx="4" fill="#e2e8f0" stroke="#f8fafc" stroke-width="2" />`;
        svg += `<rect x="366" y="119" width="68" height="26" rx="2" fill="#cbd5e1" />`;
        // Golden Altar Cross & 2 Candles
        svg += `<circle cx="372" cy="128" r="3" fill="#facc15" filter="url(#glow)" />`;
        svg += `<circle cx="428" cy="128" r="3" fill="#facc15" filter="url(#glow)" />`;
        svg += `<line x1="400" y1="110" x2="400" y2="124" stroke="#eab308" stroke-width="2.5" />`;
        svg += `<line x1="394" y1="115" x2="406" y2="115" stroke="#eab308" stroke-width="2" />`;
        svg += `<text x="400" y="138" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">ALTAR</text>`;
        svg += `</g>`;

        // The Tabernacle & Sanctuary Lamp - Hotspot
        const lampPulse = 0.7 + Math.sin(t * Math.PI * 8) * 0.3;
        svg += `<g class="ast-hotspot" data-target-t="0.80" data-label="5. The Tabernacle & Sanctuary Lamp">`;
        svg += `<rect x="382" y="58" width="36" height="28" rx="3" fill="#eab308" stroke="#fef08a" stroke-width="2" filter="url(#glow)" />`;
        svg += `<line x1="400" y1="62" x2="400" y2="76" stroke="#78350f" stroke-width="2" />`;
        svg += `<line x1="392" y1="68" x2="408" y2="68" stroke="#78350f" stroke-width="1.5" />`;
        svg += `<text x="400" y="82" fill="#78350f" font-size="7" font-weight="900" text-anchor="middle">IHS</text>`;
        // Sanctuary Lamp
        svg += `<circle cx="432" cy="72" r="7" fill="#ef4444" opacity="${lampPulse.toFixed(2)}" filter="url(#glow)" />`;
        svg += `<circle cx="432" cy="72" r="4" fill="#fee2e2" />`;
        svg += `<line x1="432" y1="52" x2="432" y2="66" stroke="#94a3b8" stroke-width="1" />`;
        svg += `</g>`;

        // The Ambo (Lectern / Table of the Word) on Sanctuary Left - Hotspot
        svg += `<g class="ast-hotspot" data-target-t="0.40" data-label="3. The Ambo (Lectern)">`;
        svg += `<rect x="330" y="125" width="22" height="24" rx="2" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.5" />`;
        svg += `<path d="M 333 130 L 341 127 L 349 130" stroke="#ffffff" stroke-width="1.5" fill="none" />`;
        svg += `<text x="341" y="145" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">AMBO</text>`;
        svg += `</g>`;

        // Sedilia (Presider's Chair) on Sanctuary Right
        svg += `<rect x="448" y="128" width="20" height="18" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5" />`;

        // Left Transept: Lady Chapel & Marian Statue - Hotspot
        svg += `<g class="ast-hotspot" data-target-t="0.94" data-label="6A. Lady Chapel">`;
        svg += `<rect x="175" y="175" width="120" height="50" rx="4" fill="#172554" stroke="#2563eb" stroke-width="1.5" />`;
        svg += `<circle cx="205" cy="200" r="10" fill="#38bdf8" filter="url(#glow)" />`;
        svg += `<text x="205" y="204" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">★</text>`;
        svg += `<text x="245" y="196" fill="#93c5fd" font-size="9" font-weight="bold">LADY CHAPEL</text>`;
        svg += `<text x="245" y="208" fill="#bfdbfe" font-size="8">Devotional Prayer</text>`;
        svg += `</g>`;

        // Right Transept: Baptismal Font & St Joseph Shrine - Hotspot
        svg += `<g class="ast-hotspot" data-target-t="1.00" data-label="6B. Baptismal Font">`;
        svg += `<rect x="505" y="175" width="120" height="50" rx="4" fill="#14532d" stroke="#16a34a" stroke-width="1.5" />`;
        // Octagonal Baptismal Font
        svg += `<polygon points="535,190 545,190 552,197 552,205 545,212 535,212 528,205 528,197" fill="#0284c7" stroke="#38bdf8" stroke-width="2" filter="url(#glow)" />`;
        svg += `<circle cx="540" cy="201" r="4" fill="#e0f2fe" />`;
        svg += `<text x="562" y="196" fill="#86efac" font-size="9" font-weight="bold">BAPTISMAL FONT</text>`;
        svg += `<text x="562" y="208" fill="#bbf7d0" font-size="8">Sacrament of Initiation</text>`;
        svg += `</g>`;

        // Narthex / Entrance (Bottom) - Hotspot
        svg += `<g class="ast-hotspot" data-target-t="0.00" data-label="1. Narthex & Holy Water Stoup">`;
        svg += `<rect x="310" y="415" width="180" height="30" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5" />`;
        // Holy water stoups
        svg += `<circle cx="330" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        svg += `<circle cx="470" cy="430" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />`;
        svg += `<text x="400" y="434" fill="#cbd5e1" font-size="10" font-weight="bold" text-anchor="middle">NARTHEX &bull; ENTRANCE</text>`;
        svg += `</g>`;

        // 2. Guided Camera Spotlight & Pilgrim Position Marker
        // Tour path waypoints:
        // 0.00-0.20: Narthex (400, 430)
        // 0.20-0.40: Nave (400, 310)
        // 0.40-0.60: Ambo (341, 140)
        // 0.60-0.80: Altar (400, 130)
        // 0.80-0.92: Tabernacle (400, 72)
        // 0.92-1.00: Lady Chapel / Font (230, 200) -> (540, 200)
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

        // Spotlight cone
        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="38" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" filter="url(#glow)" />`;
        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="8" fill="#38bdf8" />`;
        svg += `<circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="4" fill="#ffffff" />`;

        // 3. Floating HUD Station Banner
        svg += `<rect x="140" y="16" width="520" height="42" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5" />`;
        svg += `<text x="154" y="32" fill="#38bdf8" font-size="12" font-weight="800">${stationTitle}</text>`;
        svg += `<text x="154" y="47" fill="#94a3b8" font-size="10">${stationLatin} &bull; ${stationDesc.slice(0, 52)}...</text>`;
        svg += `<circle cx="638" cy="37" r="10" fill="#2563eb" />`;
        svg += `<text x="638" y="41" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">⛪</text>`;

        return svg;
      }
    }
  };

  /**
   * SceneRegistry - Singleton API for managing and querying AST scenes
   */
  const SceneRegistry = {
    register(id, scene) {
      if (!id || !scene) return;
      scenes[id] = scene;
    },

    get(id) {
      return scenes[id] || scenes['fractions'];
    },

    list() {
      return Object.values(scenes).map((s) => ({
        id: s.id,
        stage: s.stage,
        title: s.title,
        duration: s.duration,
        keyframeCount: s.keyframes?.length || 0
      }));
    },

    has(id) {
      return Object.prototype.hasOwnProperty.call(scenes, id);
    },

    /**
     * Standardized builder helper to validate and register a scene
     */
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

    /**
     * Parses S-Expression or JSON AST Scene Definition
     */
    parseAstScene(definition) {
      if (typeof definition === 'object' && definition !== null) {
        return definition;
      }
      if (typeof definition !== 'string') return null;

      // Check if JSON
      const trimmed = definition.trim();
      if (trimmed.startsWith('{')) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }

      // Check if Lisp-like S-expression (media:scene ...)
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

          if (id && title) {
            return {
              id,
              stage,
              title,
              duration,
              keyframes: [],
              subtitles: [],
              render: () => `<rect x="250" y="200" width="300" height="80" rx="8" fill="#1e293b"/><text x="400" y="248" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">${title}</text>`
            };
          }
        } catch (err) {
          console.warn('Could not parse S-expression scene:', err);
        }
      }

      return null;
    }
  };

  // Expose globally
  global.ASTScenes = scenes;
  global.ASTSceneRegistry = SceneRegistry;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scenes, SceneRegistry };
  }
})(typeof window !== 'undefined' ? window : globalThis);
