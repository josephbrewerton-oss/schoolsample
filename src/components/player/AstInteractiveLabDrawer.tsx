// src/components/player/AstInteractiveLabDrawer.tsx
import React, { useState } from 'react';

interface AstInteractiveLabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preset: string;
}

export default function AstInteractiveLabDrawer({
  isOpen,
  onClose,
  preset,
}: AstInteractiveLabDrawerProps): React.JSX.Element | null {
  // Pythagoras state
  const [pythA, setPythA] = useState<number>(3);
  const [pythB, setPythB] = useState<number>(4);

  // BODMAS state
  const [bodmasA, setBodmasA] = useState<number>(2);
  const [bodmasB, setBodmasB] = useState<number>(3);
  const [bodmasC, setBodmasC] = useState<number>(4);

  // Photosynthesis state
  const [sunlight, setSunlight] = useState<number>(75);
  const [co2, setCo2] = useState<number>(420);
  const [water, setWater] = useState<number>(80);

  // Velocity state
  const [speed, setSpeed] = useState<number>(20);
  const [angle, setAngle] = useState<number>(45);

  // Mountain Altitude state
  const [altitude, setAltitude] = useState<number>(2500);

  // Times tables state
  const [rows, setRows] = useState<number>(6);
  const [cols, setCols] = useState<number>(7);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '360px',
        maxWidth: '90%',
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-6px 0 25px rgba(0,0,0,0.5)',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🔬</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
              Reactive Invariant Lab
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
              Direct Variable Manipulation
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Body content based on preset */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* PYTHAGORAS LAB */}
        {preset === 'pythagoras' && (
          <div>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>
                Mathematical Invariant:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#60a5fa', margin: '2px 0' }}>
                a² + b² = c²
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                The sum of the geometric square areas on the two legs always equals the square area on the hypotenuse.
              </div>
            </div>

            {/* Sliders */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Leg a (Base):</span>
                <span style={{ color: '#38bdf8' }}>{pythA} units</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={pythA}
                onChange={(e) => setPythA(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Leg b (Height):</span>
                <span style={{ color: '#f59e0b' }}>{pythB} units</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={pythB}
                onChange={(e) => setPythB(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            {/* Real-Time Calculation */}
            {(() => {
              const a2 = pythA * pythA;
              const b2 = pythB * pythB;
              const c2 = a2 + b2;
              const c = Math.sqrt(c2);
              const isTriple = Number.isInteger(c);
              const angleDeg = (Math.atan(pythB / pythA) * (180 / Math.PI)).toFixed(1);

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                    LIVE GEOMETRIC PROOF:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Area a²</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>{a2}</div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#f59e0b' }}>Area b²</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>{b2}</div>
                    </div>
                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>Area c²</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>{c2}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Hypotenuse c = <strong style={{ color: '#4ade80' }}>{c.toFixed(2)}</strong> units
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Angle &theta; = <strong>{angleDeg}&deg;</strong>
                  </div>

                  {isTriple && (
                    <div style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '0.72rem', fontWeight: 800, textAlign: 'center' }}>
                      ⭐ Exact Pythagorean Integer Triple! ({pythA}, {pythB}, {c})
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* BODMAS LAB */}
        {preset === 'bodmas' && (
          <div>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                Order of Operations Invariant:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d8b4fe', margin: '2px 0' }}>
                A + (B &times; C)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Multiplication creates a locked 2D area before loose additive units can be combined.
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>A (Loose Units):</span>
                <span style={{ color: '#38bdf8' }}>{bodmasA}</span>
              </div>
              <input type="range" min="1" max="20" value={bodmasA} onChange={(e) => setBodmasA(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>B (Row Factor):</span>
                <span style={{ color: '#f59e0b' }}>{bodmasB}</span>
              </div>
              <input type="range" min="1" max="12" value={bodmasB} onChange={(e) => setBodmasB(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>C (Column Factor):</span>
                <span style={{ color: '#4ade80' }}>{bodmasC}</span>
              </div>
              <input type="range" min="1" max="12" value={bodmasC} onChange={(e) => setBodmasC(Number(e.target.value))} style={{ width: '100%', accentColor: '#4ade80' }} />
            </div>

            {/* Proof Box */}
            {(() => {
              const product = bodmasB * bodmasC;
              const correct = bodmasA + product;
              const wrongMistake = (bodmasA + bodmasB) * bodmasC;

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                    EVALUATION TRACE:
                  </div>

                  <div style={{ fontSize: '0.82rem', marginBottom: '4px', color: '#cbd5e1' }}>
                    1. Evaluate Forcefield Clamp: <strong>{bodmasB} &times; {bodmasC} = <span style={{ color: '#facc15' }}>{product}</span></strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', marginBottom: '8px', color: '#cbd5e1' }}>
                    2. Add Loose Units: <strong>{bodmasA} + {product} = <span style={{ color: '#4ade80', fontSize: '0.95rem' }}>{correct}</span></strong>
                  </div>

                  <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 800 }}>⚠️ VIOLATING BODMAS (LEFT-TO-RIGHT ERROR):</div>
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                      ({bodmasA} + {bodmasB}) &times; {bodmasC} = <strong>{wrongMistake}</strong> (Error: difference of {Math.abs(wrongMistake - correct)})
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PHOTOSYNTHESIS LAB */}
        {preset === 'photosynthesis' && (
          <div>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                Biochemical Rate Limiter:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ade80', margin: '2px 0' }}>
                6 CO₂ + 6 H₂O &rarr; C₆H₁₂O₆ + 6 O₂
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Liebig’s Law of the Minimum: The reaction rate is strictly governed by the scarcest reactant.
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>☀️ Sunlight Photon Flux:</span>
                <span style={{ color: '#facc15' }}>{sunlight}%</span>
              </div>
              <input type="range" min="0" max="100" value={sunlight} onChange={(e) => setSunlight(Number(e.target.value))} style={{ width: '100%', accentColor: '#facc15' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>💨 CO₂ Concentration:</span>
                <span style={{ color: '#38bdf8' }}>{co2} ppm</span>
              </div>
              <input type="range" min="200" max="1200" value={co2} onChange={(e) => setCo2(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>💧 Soil H₂O Transpiration:</span>
                <span style={{ color: '#60a5fa' }}>{water}%</span>
              </div>
              <input type="range" min="0" max="100" value={water} onChange={(e) => setWater(Number(e.target.value))} style={{ width: '100%', accentColor: '#60a5fa' }} />
            </div>

            {(() => {
              const co2Factor = Math.min(100, Math.round((co2 / 1000) * 100));
              const limitingFactorVal = Math.min(sunlight, co2Factor, water);
              let limitingName = 'Sunlight Photon Energy';
              if (limitingFactorVal === co2Factor) limitingName = 'Carbon Dioxide Supply';
              if (limitingFactorVal === water) limitingName = 'Water Transpiration';

              const glucoseRate = ((limitingFactorVal / 100) * 45).toFixed(1);
              const o2Rate = ((limitingFactorVal / 100) * 120).toFixed(0);

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                    CELLULAR SYNTHESIS OUTPUT:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#86efac' }}>Glucose (C₆H₁₂O₆)</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>{glucoseRate} g/hr</div>
                    </div>
                    <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#7dd3fc' }}>Oxygen (O₂)</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>{o2Rate} mL/min</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                    🛑 Current Limiting Reagent: <strong>{limitingName}</strong>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VELOCITY KINEMATICS LAB */}
        {preset === 'velocity' && (
          <div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>
                Vector Kinematics Invariant:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f87171', margin: '2px 0' }}>
                V = &radic;(Vx² + Vy²)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Perpendicular velocity vectors resolve independently using trigonometry.
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Launch Velocity (V₀):</span>
                <span style={{ color: '#ef4444' }}>{speed} m/s</span>
              </div>
              <input type="range" min="5" max="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Elevation Angle (&theta;):</span>
                <span style={{ color: '#38bdf8' }}>{angle}&deg;</span>
              </div>
              <input type="range" min="0" max="90" value={angle} onChange={(e) => setAngle(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>

            {(() => {
              const rad = (angle * Math.PI) / 180;
              const vx = (speed * Math.cos(rad)).toFixed(1);
              const vy = (speed * Math.sin(rad)).toFixed(1);
              const g = 9.81;
              const flightTime = ((2 * speed * Math.sin(rad)) / g).toFixed(2);
              const maxHeight = ((Math.pow(speed * Math.sin(rad), 2)) / (2 * g)).toFixed(1);
              const range = ((Math.pow(speed, 2) * Math.sin(2 * rad)) / g).toFixed(1);

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                    VECTOR TRAJECTORY TELEMETRY:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Vx (Horizontal)</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{vx} m/s</div>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#ef4444' }}>Vy (Vertical)</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{vy} m/s</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    <div>Apex Height: <strong style={{ color: '#facc15' }}>{maxHeight} m</strong></div>
                    <div>Flight Time: <strong style={{ color: '#4ade80' }}>{flightTime} s</strong></div>
                    <div>Ground Range: <strong style={{ color: '#38bdf8' }}>{range} m</strong></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* MOUNTAIN ELEVATION LAB */}
        {preset === 'mountain-elevation' && (
          <div>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>
                Atmospheric Altitude Thermodynamics:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#60a5fa', margin: '2px 0' }}>
                Lapse Rate: -6.5&deg;C / 1,000m
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Air pressure drops exponentially with elevation, driving cloud condensation and boiling point changes.
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Altitude:</span>
                <span style={{ color: '#38bdf8' }}>{altitude} m</span>
              </div>
              <input type="range" min="0" max="8848" step="100" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>

            {(() => {
              const seaLevelTemp = 15; // °C
              const currentTemp = (seaLevelTemp - (altitude / 1000) * 6.5).toFixed(1);
              const pressure = (1013.25 * Math.pow(1 - (0.0065 * altitude) / 288.15, 5.255)).toFixed(0);
              const boilingPt = (100 - (altitude / 300)).toFixed(1);
              const o2Pct = (Math.max(30, 100 - (altitude / 8848) * 67)).toFixed(0);

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                    HIGH ALTITUDE METEOROLOGY:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Ambient Temp</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{currentTemp}&deg;C</div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#f59e0b' }}>Air Pressure</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{pressure} hPa</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    <div>Water Boiling Point: <strong style={{ color: '#f87171' }}>{boilingPt}&deg;C</strong></div>
                    <div>Effective O₂ Availability: <strong style={{ color: '#4ade80' }}>{o2Pct}% of Sea Level</strong></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TIMES TABLES LAB */}
        {preset === 'times-tables' && (
          <div>
            <div style={{ background: 'rgba(234, 179, 8, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '14px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <div style={{ fontSize: '0.76rem', color: '#fde047', fontWeight: 700, textTransform: 'uppercase' }}>
                Multiplication Array Invariant:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#facc15', margin: '2px 0' }}>
                Rows &times; Columns = Total Tiles
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Geometric 2D area representation proves commutative and distributive properties.
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Rows:</span>
                <span style={{ color: '#38bdf8' }}>{rows}</span>
              </div>
              <input type="range" min="1" max="12" value={rows} onChange={(e) => setRows(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>Columns:</span>
                <span style={{ color: '#4ade80' }}>{cols}</span>
              </div>
              <input type="range" min="1" max="12" value={cols} onChange={(e) => setCols(Number(e.target.value))} style={{ width: '100%', accentColor: '#4ade80' }} />
            </div>

            {(() => {
              const total = rows * cols;
              const splitCol = Math.floor(cols / 2);
              const remCol = cols - splitCol;

              return (
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                    ARRAY PROPERTIES:
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f8fafc', marginBottom: '6px' }}>
                    {rows} &times; {cols} = <span style={{ color: '#facc15' }}>{total} tiles</span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Commutative Proof: {rows} &times; {cols} &equiv; {cols} &times; {rows} = {total}
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', padding: '6px 8px', borderRadius: '6px' }}>
                    Distributive Split: {rows} &times; ({splitCol} + {remCol}) = ({rows} &times; {splitCol}) + ({rows} &times; {remCol}) = {rows * splitCol} + {rows * remCol} = {total}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Default fallback for other presets */}
        {!['pythagoras', 'bodmas', 'photosynthesis', 'velocity', 'mountain-elevation', 'times-tables'].includes(preset) && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🔬</span>
            <h4 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '0.95rem' }}>General AST Telemetry Active</h4>
            <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.5 }}>
              This scene runs on declarative S-expression keyframes with real-time coordinate physics. Switch to Pythagoras, BODMAS, Photosynthesis, or Velocity to engage reactive mathematical parameter sliders!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
        ⚡ 100% Client-Side Invariant Calculator &bull; Zero Server Latency
      </div>
    </div>
  );
}
