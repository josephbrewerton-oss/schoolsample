// src/components/ProceduralManipulative.tsx
import React, { useState } from 'react';
import { ASTKnowledgeSeed } from '../engine/seedInflationEngine';

interface Props {
  cpaType: ASTKnowledgeSeed['cpaType'];
  seedTopic: string;
  onMisconceptionInspect?: (misconceptionId: string) => void;
}

export const ProceduralManipulative: React.FC<Props> = ({
  cpaType,
  seedTopic,
}) => {
  // Fractions state
  const [f1Num, setF1Num] = useState(1);
  const [f1Den, setF1Den] = useState(3);
  const [f2Num, setF2Num] = useState(1);
  const [f2Den, setF2Den] = useState(4);
  const [showMirrorComparison, setShowMirrorComparison] = useState(true);

  // Balance Scale state (e.g. 3x + 5 = 20)
  const [lhsExtra, setLhsExtra] = useState(5);
  const [rhsValue, setRhsValue] = useState(20);
  const [coefficient] = useState(3);
  const [balanceActionLog, setBalanceActionLog] = useState<string>('Initial state: 3x + 5 = 20 (Balanced)');

  // Circuit state
  const [switchClosed, setSwitchClosed] = useState(true);
  const [activeModel, setActiveModel] = useState<'loop' | 'clashing'>('loop');

  // Atomic state
  const [protons] = useState(6);
  const [neutrons] = useState(6);
  const [electrons] = useState(6);

  // Place Value state
  const [pvTens, setPvTens] = useState(2);
  const [pvOnes, setPvOnes] = useState(4);
  const [showPvReversal, setShowPvReversal] = useState(true);

  // Ratio Bar state
  const [ratioA, setRatioA] = useState(2);
  const [ratioB, setRatioB] = useState(3);
  const [ratioTotal, setRatioTotal] = useState(60);

  // Number Line state
  const [nlStart, setNlStart] = useState(3);
  const [nlOperation, setNlOperation] = useState<'+' | '-'>('-');
  const [nlStep, setNlStep] = useState(-2);

  // Photosynthesis state
  const [treeYear, setTreeYear] = useState<number>(5); // 0 = seedling, 5 = grown tree
  const [showHelmontData, setShowHelmontData] = useState(true);

  // Force Vectors state
  const [engineThrust, setEngineThrust] = useState(1200);
  const [frictionDrag, setFrictionDrag] = useState(1200);
  const [showSpaceVacuum, setShowSpaceVacuum] = useState(false);

  // Chemical Balance state
  const [coeffH2, setCoeffH2] = useState(2);
  const [coeffO2, setCoeffO2] = useState(1);
  const [coeffH2O, setCoeffH2O] = useState(2);
  const [showSubscriptTrap, setShowSubscriptTrap] = useState(false);

  // ==========================================
  // FRACTIONS MANIPULATIVE
  // ==========================================
  const renderFractions = () => {
    // True common denominator
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (f1Den * f2Den) / gcd(f1Den, f2Den);
    const scaled1 = (f1Num * lcm) / f1Den;
    const scaled2 = (f2Num * lcm) / f2Den;
    const trueSumNum = scaled1 + scaled2;

    // Flawed direct adder (a+c)/(b+d)
    const flawedNum = f1Num + f2Num;
    const flawedDen = f1Den + f2Den;

    const f1Value = f1Num / f1Den;
    const f2Value = f2Num / f2Den;
    const trueSumValue = trueSumNum / lcm;
    const flawedSumValue = flawedNum / flawedDen;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Interactive Controls */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            alignItems: 'center',
          }}
        >
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Fraction 1: {f1Num}/{f1Den}
            </label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem' }}>Top:</span>
              <button
                type="button"
                onClick={() => setF1Num((n) => Math.max(1, n - 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                -
              </button>
              <strong style={{ minWidth: '16px', textAlign: 'center' }}>{f1Num}</strong>
              <button
                type="button"
                onClick={() => setF1Num((n) => Math.min(f1Den - 1, n + 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                +
              </button>
              <span style={{ fontSize: '0.85rem', marginLeft: '6px' }}>Bottom:</span>
              <button
                type="button"
                onClick={() => setF1Den((d) => Math.max(2, d - 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                -
              </button>
              <strong style={{ minWidth: '16px', textAlign: 'center' }}>{f1Den}</strong>
              <button
                type="button"
                onClick={() => setF1Den((d) => Math.min(12, d + 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748b' }}>+</div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Fraction 2: {f2Num}/{f2Den}
            </label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem' }}>Top:</span>
              <button
                type="button"
                onClick={() => setF2Num((n) => Math.max(1, n - 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                -
              </button>
              <strong style={{ minWidth: '16px', textAlign: 'center' }}>{f2Num}</strong>
              <button
                type="button"
                onClick={() => setF2Num((n) => Math.min(f2Den - 1, n + 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                +
              </button>
              <span style={{ fontSize: '0.85rem', marginLeft: '6px' }}>Bottom:</span>
              <button
                type="button"
                onClick={() => setF2Den((d) => Math.max(2, d - 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                -
              </button>
              <strong style={{ minWidth: '16px', textAlign: 'center' }}>{f2Den}</strong>
              <button
                type="button"
                onClick={() => setF2Den((d) => Math.min(12, d + 1))}
                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMirrorComparison(!showMirrorComparison)}
            style={{
              marginLeft: 'auto',
              padding: '6px 14px',
              borderRadius: '8px',
              background: showMirrorComparison ? '#eff6ff' : '#ffffff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {showMirrorComparison ? '🪞 Hide Mental Mirror' : '🪞 Show Misconception Mirror'}
          </button>
        </div>

        {/* Dynamic Dual-Coding Fraction Bar Visualizer (Pure SVG - 0 Bytes Network) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            Input Quantities (Visualized as Proportional Partition Bars)
          </h4>

          {/* Fraction 1 Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: '#2563eb' }}>Fraction 1: {f1Num}/{f1Den} ({Math.round(f1Value * 100)}% of whole)</span>
              <span style={{ color: '#64748b' }}>Partition size: 1/{f1Den}</span>
            </div>
            <svg width="100%" height="32" viewBox="0 0 400 32" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              {Array.from({ length: f1Den }).map((_, i) => (
                <rect
                  key={i}
                  x={(400 / f1Den) * i}
                  y="0"
                  width={400 / f1Den}
                  height="32"
                  fill={i < f1Num ? '#3b82f6' : '#f1f5f9'}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Fraction 2 Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: '#7c3aed' }}>Fraction 2: {f2Num}/{f2Den} ({Math.round(f2Value * 100)}% of whole)</span>
              <span style={{ color: '#64748b' }}>Partition size: 1/{f2Den}</span>
            </div>
            <svg width="100%" height="32" viewBox="0 0 400 32" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              {Array.from({ length: f2Den }).map((_, i) => (
                <rect
                  key={i}
                  x={(400 / f2Den) * i}
                  y="0"
                  width={400 / f2Den}
                  height="32"
                  fill={i < f2Num ? '#8b5cf6' : '#f1f5f9'}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Mental Model Mirror: Flawed vs Reality Juxtaposition */}
          {showMirrorComparison && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px dashed #e2e8f0',
              }}
            >
              {/* Flawed Mental Model Card */}
              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>❌</span>
                  <strong style={{ color: '#9a3412', fontSize: '0.9rem' }}>
                    Flawed Model: &quot;Direct Denominator Addition&quot;
                  </strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#7c2d12', margin: 0 }}>
                  Pupil calculates: ({f1Num}+{f2Num}) / ({f1Den}+{f2Den}) = <strong>{flawedNum}/{flawedDen}</strong> ({Math.round(flawedSumValue * 100)}%)
                </p>
                <svg width="100%" height="28" viewBox="0 0 400 28" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #fdba74' }}>
                  {Array.from({ length: flawedDen }).map((_, i) => (
                    <rect
                      key={i}
                      x={(400 / flawedDen) * i}
                      y="0"
                      width={400 / flawedDen}
                      height="28"
                      fill={i < flawedNum ? '#ea580c' : '#ffedd5'}
                      stroke="#fb923c"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
                <div style={{ fontSize: '0.78rem', color: '#b45309', background: '#fef3c7', padding: '6px 8px', borderRadius: '6px', lineHeight: 1.4 }}>
                  <strong>Cognitive Conflict:</strong> Notice that {flawedNum}/{flawedDen} ({Math.round(flawedSumValue * 100)}%) is{' '}
                  {flawedSumValue < f1Value ? (
                    <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                      LESS than the starting fraction {f1Num}/{f1Den} ({Math.round(f1Value * 100)}%)!
                    </span>
                  ) : (
                    'distorted because slice sizes were arbitrarily altered.'
                  )}
                </div>
              </div>

              {/* Scientific Reality Card */}
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>✅</span>
                  <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>
                    Scientific Ground Truth: &quot;Common Partitions&quot;
                  </strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0 }}>
                  Equalise to {lcm}ths: ({scaled1}/{lcm}) + ({scaled2}/{lcm}) = <strong>{trueSumNum}/{lcm}</strong> ({Math.round(trueSumValue * 100)}%)
                </p>
                <svg width="100%" height="28" viewBox="0 0 400 28" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #6ee7b7' }}>
                  {Array.from({ length: lcm }).map((_, i) => (
                    <rect
                      key={i}
                      x={(400 / lcm) * i}
                      y="0"
                      width={400 / lcm}
                      height="28"
                      fill={i < trueSumNum ? '#059669' : '#d1fae5'}
                      stroke="#34d399"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
                <div style={{ fontSize: '0.78rem', color: '#065f46', background: '#d1fae5', padding: '6px 8px', borderRadius: '6px', lineHeight: 1.4 }}>
                  <strong>Axiomatic Truth:</strong> Both inputs are partitioned into uniform {lcm}th slices. Total combined volume increases accurately to {Math.round(trueSumValue * 100)}%.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // BALANCE SCALE MANIPULATIVE (Algebra)
  // ==========================================
  const renderBalanceScale = () => {
    // Current LHS weight: coefficient * x + lhsExtra, where true x = 5
    const trueX = 5;
    const currentLhs = coefficient * trueX + lhsExtra;
    const currentRhs = rhsValue;
    const isBalanced = currentLhs === currentRhs;
    const tiltAngle = Math.max(-12, Math.min(12, (currentRhs - currentLhs) * 1.5));

    const handleSubBoth = () => {
      setLhsExtra((v) => Math.max(0, v - 5));
      setRhsValue((v) => Math.max(0, v - 5));
      setBalanceActionLog('Applied -5 to BOTH pans: 3x = 15. Equilibrium preserved! (Balanced)');
    };

    const handleSubLeftOnly = () => {
      setLhsExtra((v) => Math.max(0, v - 5));
      setBalanceActionLog('⚠️ Error: Subtracted 5 from LEFT pan only! Scale tilts out of balance.');
    };

    const handleReset = () => {
      setLhsExtra(5);
      setRhsValue(20);
      setBalanceActionLog('Reset to initial equation: 3x + 5 = 20');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleSubBoth}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ⚖️ Subtract 5 from BOTH Sides (Inverse Rule)
          </button>
          <button
            type="button"
            onClick={handleSubLeftOnly}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ⚠️ Try One-Sided Operation (Misconception)
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ↺ Reset Equation
          </button>
        </div>

        {/* Procedural SVG Balance Beam */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
          <svg width="100%" height="180" viewBox="0 0 500 180" style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}>
            {/* Base stand */}
            <polygon points="230,170 270,170 250,90" fill="#64748b" />
            <circle cx="250" cy="90" r="8" fill="#334155" />

            {/* Tilting Balance Beam */}
            <g transform={`rotate(${tiltAngle} 250 90)`} style={{ transition: 'transform 0.4s ease-out' }}>
              {/* The beam */}
              <line x1="60" y1="90" x2="440" y2="90" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
              <circle cx="60" cy="90" r="4" fill="#0f172a" />
              <circle cx="440" cy="90" r="4" fill="#0f172a" />

              {/* Left Pan Strings & Plate */}
              <line x1="60" y1="90" x2="30" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="60" y1="90" x2="90" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="20" y="140" width="80" height="8" rx="3" fill="#3b82f6" />
              {/* Left Weights */}
              <text x="60" y="132" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">
                3x {lhsExtra > 0 ? `+ ${lhsExtra}` : ''}
              </text>

              {/* Right Pan Strings & Plate */}
              <line x1="440" y1="90" x2="410" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="440" y1="90" x2="470" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="400" y="140" width="80" height="8" rx="3" fill="#10b981" />
              {/* Right Weights */}
              <text x="440" y="132" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#065f46">
                {rhsValue}
              </text>
            </g>
          </svg>

          <div
            style={{
              marginTop: '1rem',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: isBalanced ? '#ecfdf5' : '#fff7ed',
              color: isBalanced ? '#065f46' : '#9a3412',
              border: `1px solid ${isBalanced ? '#a7f3d0' : '#fed7aa'}`,
            }}
          >
            {balanceActionLog}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // ELECTRIC CIRCUITS MANIPULATIVE
  // ==========================================
  const renderCircuits = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setSwitchClosed(!switchClosed)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: switchClosed ? '#dc2626' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {switchClosed ? '🔴 Open Switch (Break Loop)' : '🟢 Close Switch (Complete Loop)'}
          </button>

          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveModel('loop')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: activeModel === 'loop' ? '#ffffff' : 'transparent',
                color: activeModel === 'loop' ? '#0f172a' : '#64748b',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              ✅ Scientific Loop Model
            </button>
            <button
              type="button"
              onClick={() => setActiveModel('clashing')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: activeModel === 'clashing' ? '#ffffff' : 'transparent',
                color: activeModel === 'clashing' ? '#ea580c' : '#64748b',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              ❌ Clashing Currents Fallacy
            </button>
          </div>
        </div>

        {/* Procedural SVG Circuit (Zero network download) */}
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', color: '#f8fafc', textAlign: 'center' }}>
          <svg width="100%" height="200" viewBox="0 0 500 200" style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}>
            {/* Wire loop */}
            <rect
              x="50"
              y="30"
              width="400"
              height="140"
              rx="12"
              fill="none"
              stroke={switchClosed ? '#38bdf8' : '#64748b'}
              strokeWidth="4"
              strokeDasharray={switchClosed ? '6,6' : 'none'}
            />

            {/* Battery Cell at top */}
            <rect x="220" y="20" width="60" height="20" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" rx="3" />
            <line x1="240" y1="15" x2="240" y2="45" stroke="#f59e0b" strokeWidth="3" />
            <line x1="260" y1="22" x2="260" y2="38" stroke="#38bdf8" strokeWidth="2" />
            <text x="235" y="14" fontSize="10" fill="#f59e0b" fontWeight="bold">+</text>
            <text x="265" y="14" fontSize="10" fill="#38bdf8" fontWeight="bold">-</text>

            {/* Switch on right side */}
            <circle cx="450" cy="80" r="5" fill="#f8fafc" />
            <circle cx="450" cy="120" r="5" fill="#f8fafc" />
            <line
              x1="450"
              y1="80"
              x2={switchClosed ? '450' : '475'}
              y2={switchClosed ? '120' : '100'}
              stroke={switchClosed ? '#22c55e' : '#ef4444'}
              strokeWidth="3"
            />
            <text x="465" y="70" fontSize="10" fill="#94a3b8">Switch ({switchClosed ? 'Closed' : 'Open'})</text>

            {/* Bulb 1 at bottom left */}
            <circle cx="150" cy="170" r="14" fill={switchClosed ? '#fef08a' : '#334155'} stroke="#e2e8f0" strokeWidth="2" />
            <text x="150" y="174" fontSize="10" textAnchor="middle" fill="#0f172a" fontWeight="bold">💡</text>
            <text x="150" y="196" fontSize="10" textAnchor="middle" fill="#94a3b8">Bulb 1 (0.5A)</text>

            {/* Bulb 2 at bottom right */}
            <circle cx="350" cy="170" r="14" fill={switchClosed ? '#fef08a' : '#334155'} stroke="#e2e8f0" strokeWidth="2" />
            <text x="350" y="174" fontSize="10" textAnchor="middle" fill="#0f172a" fontWeight="bold">💡</text>
            <text x="350" y="196" fontSize="10" textAnchor="middle" fill="#94a3b8">Bulb 2 (0.5A)</text>
          </svg>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.75rem', marginBottom: 0 }}>
            {switchClosed ? (
              activeModel === 'loop' ? (
                <span>✅ <strong>Continuous Loop Law:</strong> Current is conserved everywhere. Ammeter readings before Bulb 1 and after Bulb 2 are identical (0.5A). Electrons are NOT consumed like fuel.</span>
              ) : (
                <span style={{ color: '#fed7aa' }}>⚠️ <strong>Clashing Model Fallacy:</strong> If current rushed from both ends to collide, opening the right switch wouldn&apos;t affect the left side immediately—which violates physics!</span>
              )
            ) : (
              <span style={{ color: '#fca5a5' }}>🔴 <strong>Circuit Broken:</strong> Current stops everywhere instantaneously because charge drift requires an unbroken return path.</span>
            )}
          </p>
        </div>
      </div>
    );
  };

  // ==========================================
  // ATOMIC STRUCTURE MANIPULATIVE
  // ==========================================
  const renderAtomic = () => {
    return (
      <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', color: '#f8fafc' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
          Carbon Atom ($^{12}_6\text{C}$): Nucleus vs Empty Space
        </h4>
        <svg width="100%" height="220" viewBox="0 0 500 220" style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}>
          {/* Shell 2 (Outer - 4 valence electrons) */}
          <circle cx="250" cy="110" r="85" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />
          <circle cx="250" cy="25" r="4" fill="#38bdf8" />
          <circle cx="250" cy="195" r="4" fill="#38bdf8" />
          <circle cx="165" cy="110" r="4" fill="#38bdf8" />
          <circle cx="335" cy="110" r="4" fill="#38bdf8" />

          {/* Shell 1 (Inner - 2 electrons) */}
          <circle cx="250" cy="110" r="45" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx="250" cy="65" r="4" fill="#38bdf8" />
          <circle cx="250" cy="155" r="4" fill="#38bdf8" />

          {/* Central Dense Nucleus */}
          <circle cx="250" cy="110" r="16" fill="#ef4444" opacity="0.85" />
          <circle cx="245" cy="106" r="6" fill="#f87171" />
          <circle cx="255" cy="108" r="6" fill="#fb923c" />
          <circle cx="248" cy="115" r="6" fill="#f87171" />
          <circle cx="253" cy="114" r="6" fill="#fb923c" />

          {/* Label Nucleus */}
          <text x="250" y="113" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">99.9% Mass</text>
        </svg>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}>
            <strong style={{ color: '#ef4444' }}>Central Nucleus (Dense Core):</strong>
            <div>{protons} Protons + {neutrons} Neutrons = <strong>Relative Mass 12</strong></div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Contains 99.95% of total atomic weight in 1/100,000th diameter.</div>
          </div>
          <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem' }}>
            <strong style={{ color: '#38bdf8' }}>Outer Electron Shells:</strong>
            <div>{electrons} Electrons (2 in inner shell, 4 valence)</div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Mass is negligible (1/1836th of proton). Atom is 99.999% empty space.</div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PLACE VALUE MANIPULATIVE
  // ==========================================
  const renderPlaceValue = () => {
    const trueValue = pvTens * 10 + pvOnes;
    const reversedValue = pvOnes * 10 + pvTens;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Interactive Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
              Tens Bundles: <strong>{pvTens}</strong> (Value: {pvTens * 10})
            </label>
            <input
              type="range"
              min={1}
              max={6}
              value={pvTens}
              onChange={(e) => setPvTens(parseInt(e.target.value))}
              style={{ width: '130px', accentColor: '#2563eb' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', display: 'block', marginBottom: '4px' }}>
              Loose Units: <strong>{pvOnes}</strong> (Value: {pvOnes})
            </label>
            <input
              type="range"
              min={0}
              max={9}
              value={pvOnes}
              onChange={(e) => setPvOnes(parseInt(e.target.value))}
              style={{ width: '130px', accentColor: '#f59e0b' }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setShowPvReversal(!showPvReversal)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: showPvReversal ? '#fef3c7' : '#f1f5f9',
                color: showPvReversal ? '#92400e' : '#475569',
                border: '1px solid #fde68a',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showPvReversal ? '⚠️ Reversal Trap Visualized' : 'Hide Reversal Trap'}
            </button>
          </div>
        </div>

        {/* Visual Base-10 Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: showPvReversal ? '1fr 1fr' : '1fr', gap: '1rem' }}>
          {/* True Partition: e.g. 24 */}
          <div style={{ border: '2px solid #3b82f6', borderRadius: '10px', padding: '1rem', background: '#eff6ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>
                True Representation: {trueValue}
              </span>
              <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                {pvTens} Tens + {pvOnes} Ones
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', minHeight: '120px', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              {/* Tens Rods */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: pvTens }).map((_, i) => (
                  <div key={i} title={`Ten-rod #${i + 1} = 10 units`} style={{ width: '18px', height: '100px', background: '#3b82f6', borderRadius: '3px', border: '1px solid #1d4ed8', display: 'flex', flexDirection: 'column' }}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} style={{ flex: 1, borderBottom: j < 9 ? '1px solid #60a5fa' : 'none' }} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Loose Units */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '100px', alignSelf: 'flex-end' }}>
                {Array.from({ length: pvOnes }).map((_, i) => (
                  <div key={i} title={`Unit Cube #${i + 1}`} style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px', border: '1px solid #d97706' }} />
                ))}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 600 }}>
              Calculation: ({pvTens} × 10) + ({pvOnes} × 1) = <strong>{trueValue}</strong>
            </div>
          </div>

          {/* Reversal Trap Comparison: e.g. 42 */}
          {showPvReversal && (
            <div style={{ border: '2px solid #ef4444', borderRadius: '10px', padding: '1rem', background: '#fff1f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                  Phonetic Trap: {reversedValue}
                </span>
                <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {pvOnes} Tens + {pvTens} Ones
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', minHeight: '120px', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                {/* Reversed Tens Rods */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: Math.min(6, pvOnes) }).map((_, i) => (
                    <div key={i} title={`Ten-rod #${i + 1}`} style={{ width: '18px', height: '100px', background: '#ef4444', borderRadius: '3px', border: '1px solid #b91c1c', display: 'flex', flexDirection: 'column' }}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <div key={j} style={{ flex: 1, borderBottom: j < 9 ? '1px solid #f87171' : 'none' }} />
                      ))}
                    </div>
                  ))}
                  {pvOnes === 0 && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', alignSelf: 'center' }}>0 Ten-rods</span>}
                </div>

                {/* Loose Units */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '100px', alignSelf: 'flex-end' }}>
                  {Array.from({ length: pvTens }).map((_, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px', border: '1px solid #d97706' }} />
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#991b1b', fontWeight: 600 }}>
                Discrepancy: Magnitude is off by <strong>{Math.abs(reversedValue - trueValue)}</strong> units!
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // RATIO BAR (TAPE DIAGRAM) MANIPULATIVE
  // ==========================================
  const renderRatioBar = () => {
    const parts = ratioA + ratioB;
    const unitVal = ratioTotal / parts;
    const shareA = Math.round((ratioA * unitVal) * 10) / 10;
    const shareB = Math.round((ratioB * unitVal) * 10) / 10;
    const flawedDivA = Math.round((ratioTotal / ratioA) * 10) / 10;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
              Ratio A: <strong>{ratioA}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={ratioA}
              onChange={(e) => setRatioA(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: '#2563eb' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', display: 'block', marginBottom: '4px' }}>
              Ratio B: <strong>{ratioB}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={ratioB}
              onChange={(e) => setRatioB(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: '#10b981' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Total Quantity: <strong>£{ratioTotal}</strong>
            </label>
            <input
              type="range"
              min={20}
              max={120}
              step={10}
              value={ratioTotal}
              onChange={(e) => setRatioTotal(parseInt(e.target.value))}
              style={{ width: '120px', accentColor: '#0f172a' }}
            />
          </div>
        </div>

        {/* Tape Diagram Vector */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>
              Total: £{ratioTotal} partitioned into ({ratioA} + {ratioB}) = {parts} Equal Units
            </span>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>
              Value of 1 Box = £{ratioTotal} ÷ {parts} = <strong>£{unitVal.toFixed(1)}</strong>
            </span>
          </div>

          {/* Bar Diagram */}
          <div style={{ display: 'flex', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #334155', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
            {Array.from({ length: ratioA }).map((_, i) => (
              <div
                key={`a-${i}`}
                style={{
                  flex: 1,
                  background: '#3b82f6',
                  borderRight: '1px solid #ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                <span>A</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>£{unitVal.toFixed(1)}</span>
              </div>
            ))}
            {Array.from({ length: ratioB }).map((_, i) => (
              <div
                key={`b-${i}`}
                style={{
                  flex: 1,
                  background: '#10b981',
                  borderRight: i < ratioB - 1 ? '1px solid #ffffff' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                <span>B</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>£{unitVal.toFixed(1)}</span>
              </div>
            ))}
          </div>

          {/* Result Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <strong style={{ color: '#1e40af', fontSize: '0.85rem' }}>Person A ({ratioA} parts):</strong>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>
                {ratioA} × £{unitVal.toFixed(1)} = £{shareA}
              </div>
            </div>
            <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
              <strong style={{ color: '#065f46', fontSize: '0.85rem' }}>Person B ({ratioB} parts):</strong>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>
                {ratioB} × £{unitVal.toFixed(1)} = £{shareB}
              </div>
            </div>
          </div>

          {/* Cognitive Trap Mirror */}
          <div style={{ marginTop: '0.75rem', background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e' }}>
            <strong>⚠️ Cognitive Trap Warning:</strong> If you divided £{ratioTotal} by {ratioA} directly, you would get £{flawedDivA}. That would mean Person A alone takes £{flawedDivA}, leaving only £{(ratioTotal - flawedDivA).toFixed(1)} for Person B—destroying the {ratioA}:{ratioB} proportion!
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // NUMBER LINE (NEGATIVE ARITHMETIC) MANIPULATIVE
  // ==========================================
  const renderNumberLine = () => {
    const result = nlOperation === '+' ? nlStart + nlStep : nlStart - nlStep;
    const isDoubleMinus = nlOperation === '-' && nlStep < 0;

    // Coordinate mapping: range from -10 to +10, SVG width 500
    const svgWidth = 500;
    const svgHeight = 90;
    const xToSvg = (val: number) => 250 + val * 22;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Start Position: <strong>{nlStart}</strong>
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              value={nlStart}
              onChange={(e) => setNlStart(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: '#2563eb' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Operation:
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setNlOperation('+')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  background: nlOperation === '+' ? '#2563eb' : '#ffffff',
                  color: nlOperation === '+' ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + (Face Right)
              </button>
              <button
                type="button"
                onClick={() => setNlOperation('-')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  background: nlOperation === '-' ? '#2563eb' : '#ffffff',
                  color: nlOperation === '-' ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                - (Face Left)
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Step Value: <strong>{nlStep}</strong> ({nlStep < 0 ? 'Walk Backwards' : 'Walk Forwards'})
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              value={nlStep}
              onChange={(e) => setNlStep(parseInt(e.target.value))}
              style={{ width: '110px', accentColor: '#ef4444' }}
            />
          </div>
        </div>

        {/* Vector SVG Number Line */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', overflowX: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            <span>{nlStart}</span>
            <span style={{ color: '#2563eb', margin: '0 6px' }}>{nlOperation}</span>
            <span>({nlStep})</span>
            <span style={{ margin: '0 8px' }}>=</span>
            <span style={{ color: '#16a34a' }}>{result}</span>
          </div>

          <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ display: 'block' }}>
            {/* Main axis line */}
            <line x1="20" y1="55" x2="480" y2="55" stroke="#94a3b8" strokeWidth="2" />

            {/* Tick marks & numbers from -10 to +10 */}
            {Array.from({ length: 21 }).map((_, i) => {
              const val = i - 10;
              const x = xToSvg(val);
              const isZero = val === 0;
              return (
                <g key={val}>
                  <line x1={x} y1={isZero ? '45' : '50'} x2={x} y2={isZero ? '65' : '60'} stroke={isZero ? '#0f172a' : '#94a3b8'} strokeWidth={isZero ? '3' : '1.5'} />
                  <text x={x} y="78" textAnchor="middle" fontSize={isZero ? '11' : '9'} fontWeight={isZero ? '800' : '500'} fill={isZero ? '#0f172a' : '#64748b'}>
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Displacement Arc */}
            {xToSvg(nlStart) !== xToSvg(result) && (
              <path
                d={`M ${xToSvg(nlStart)} 48 Q ${(xToSvg(nlStart) + xToSvg(result)) / 2} 15 ${xToSvg(result)} 48`}
                fill="none"
                stroke={isDoubleMinus ? '#16a34a' : '#2563eb'}
                strokeWidth="3"
                strokeDasharray="4 2"
              />
            )}

            {/* Start Marker */}
            <circle cx={xToSvg(nlStart)} cy="55" r="6" fill="#3b82f6" />

            {/* End Marker */}
            <circle cx={xToSvg(result)} cy="55" r="7" fill="#16a34a" />
          </svg>

          {/* Inversion Rule Callout */}
          <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '6px', background: isDoubleMinus ? '#f0fdf4' : '#f8fafc', border: isDoubleMinus ? '1px solid #bbf7d0' : '1px solid #e2e8f0', fontSize: '0.82rem' }}>
            {isDoubleMinus ? (
              <strong style={{ color: '#15803d' }}>
                💡 Direction Inversion Proof: Subtraction (-) faces you left. Taking a negative step (-{Math.abs(nlStep)}) means walking backwards. Walking backwards while facing left carries you to the RIGHT (positive displacement)!
              </strong>
            ) : (
              <span style={{ color: '#475569' }}>
                Moving along the 1D real vector line: current net displacement is {result - nlStart > 0 ? `+${result - nlStart}` : result - nlStart} units.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PHOTOSYNTHESIS (BIOMASS ORIGIN) MANIPULATIVE
  // ==========================================
  const renderPhotosynthesis = () => {
    // Van Helmont's classic data
    const treeMass = treeYear === 0 ? 2.27 : 76.74; // kg
    const soilLoss = treeYear === 0 ? 0.0 : 0.057; // kg (only 57 grams!)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '4px' }}>
              Growth Timeline: <strong>Year {treeYear}</strong> ({treeYear === 0 ? 'Planted Seedling' : '5-Year Mature Tree'})
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setTreeYear(0)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: treeYear === 0 ? '#16a34a' : '#ffffff',
                  color: treeYear === 0 ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🌱 Year 0 (Seedling)
              </button>
              <button
                type="button"
                onClick={() => setTreeYear(5)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: treeYear === 5 ? '#16a34a' : '#ffffff',
                  color: treeYear === 5 ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🌳 Year 5 (Full Tree)
              </button>
            </div>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setShowHelmontData(!showHelmontData)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: showHelmontData ? '#f0fdf4' : '#ffffff',
                color: '#166534',
                border: '1px solid #86efac',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showHelmontData ? '🧪 Van Helmont 1648 Experiment: Active' : 'Show Scientific Data'}
            </button>
          </div>
        </div>

        {/* Dynamic Visual Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Van Helmont Weighing Experiment */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', background: '#ffffff' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              ⚖️ Van Helmont Mass Experiment (1648)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Tree Solid Biomass</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d' }}>
                  {treeMass.toFixed(2)} kg
                </div>
                <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                  {treeYear === 5 ? 'Gain of +74.47 kg of solid wood & leaves' : 'Initial mass'}
                </span>
              </div>

              <div style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Dry Soil Mass in Pot</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309' }}>
                  {(90.0 - soilLoss).toFixed(3)} kg
                </div>
                <span style={{ fontSize: '0.75rem', color: '#92400e' }}>
                  {treeYear === 5 ? 'Soil lost only 0.057 kg (57 grams / ~0.06%)' : 'Initial dried soil: 90.000 kg'}
                </span>
              </div>
            </div>
          </div>

          {/* Biochemical Stomata Reactor */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', background: '#0f172a', color: '#ffffff' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.75rem' }}>
              🍃 Biochemical Origin: Carbon from Gas
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#38bdf8', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>AIR (95%)</span>
                <span>CO₂ absorbed via leaf stomata provides the <strong>Carbon atoms</strong> for cellulose wood.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#fbbf24', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>LIGHT</span>
                <span>Photons energize chlorophyll to split water molecules. Light is <strong>energy, not matter</strong>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#34d399', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>ROOTS (&lt;1%)</span>
                <span>Absorb H₂O and dissolved mineral co-factors. <strong>Roots do NOT eat soil</strong>.</span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', border: '1px solid #334155', fontSize: '0.75rem', color: '#94a3b8' }}>
              Chemical equation: 6CO₂ (gas) + 6H₂O (liquid) + Light → C₆H₁₂O₆ (solid glucose) + 6O₂ (gas)
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // FORCE VECTORS (NEWTON'S 1ST LAW) MANIPULATIVE
  // ==========================================
  const renderForceVectors = () => {
    const netForce = engineThrust - frictionDrag;
    const isEquilibrium = netForce === 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', display: 'block', marginBottom: '4px' }}>
              Forward Thrust: <strong>{engineThrust} N</strong>
            </label>
            <input
              type="range"
              min={0}
              max={2500}
              step={100}
              value={engineThrust}
              onChange={(e) => setEngineThrust(parseInt(e.target.value))}
              style={{ width: '130px', accentColor: '#16a34a' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '4px' }}>
              Resistive Drag: <strong>{frictionDrag} N</strong>
            </label>
            <input
              type="range"
              min={0}
              max={2500}
              step={100}
              value={frictionDrag}
              onChange={(e) => setFrictionDrag(parseInt(e.target.value))}
              style={{ width: '130px', accentColor: '#dc2626' }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => {
                setEngineThrust(0);
                setFrictionDrag(0);
                setShowSpaceVacuum(true);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: showSpaceVacuum ? '#0f172a' : '#ffffff',
                color: showSpaceVacuum ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🚀 Deep Space Vacuum Mode (0 N / 0 N)
            </button>
          </div>
        </div>

        {/* Free-Body Diagram Vector Canvas */}
        <div style={{ background: '#0f172a', borderRadius: '10px', padding: '1.5rem', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Dynamic Vector State &bull; Newton's First Law (ΣF = ma)
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isEquilibrium ? '#34d399' : '#fbbf24' }}>
                Resultant Net Force: {netForce > 0 ? `+${netForce} N (Forwards)` : netForce < 0 ? `${netForce} N (Backwards)` : '0 N (Equilibrium)'}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '8px 14px', borderRadius: '8px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Motion Status:</div>
              <strong style={{ color: isEquilibrium ? '#34d399' : '#f87171', fontSize: '0.95rem' }}>
                {isEquilibrium ? 'Constant Velocity (Cruising steady)' : netForce > 0 ? 'Accelerating (Speeding up)' : 'Decelerating (Slowing down)'}
              </strong>
            </div>
          </div>

          {/* SVG Free Body Vehicle & Vector Arrows */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '130px' }}>
            <svg width="100%" height="110" viewBox="0 0 500 110">
              {/* Vehicle Body at center x=250, y=55 */}
              <rect x="200" y="35" width="100" height="40" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <text x="250" y="58" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800">
                Vehicle (1,000 kg)
              </text>

              {/* Backward Resistance Arrow (Red) */}
              {frictionDrag > 0 && (
                <g>
                  <line x1="200" y1="55" x2={Math.max(30, 200 - (frictionDrag / 2500) * 160)} y2="55" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arrow-red)" />
                  <text x={Math.max(30, 200 - (frictionDrag / 2500) * 160)} y="45" fill="#fca5a5" fontSize="10" fontWeight="700">
                    Drag: {frictionDrag} N
                  </text>
                </g>
              )}

              {/* Forward Thrust Arrow (Green) */}
              {engineThrust > 0 && (
                <g>
                  <line x1="300" y1="55" x2={Math.min(470, 300 + (engineThrust / 2500) * 160)} y2="55" stroke="#22c55e" strokeWidth="4" />
                  <text x={Math.min(470, 300 + (engineThrust / 2500) * 160) - 20} y="45" fill="#86efac" fontSize="10" fontWeight="700">
                    Thrust: {engineThrust} N
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Pedagogical Takeaway */}
          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            {isEquilibrium ? (
              <span>
                ✅ <strong>Zero Net Force Paradox Solved:</strong> Even though the vehicle is moving at high speed (e.g. 100 km/h), the resultant force is <strong>exactly 0 N</strong>. A forward force does NOT cause speed—it causes <em>acceleration</em>.
              </span>
            ) : (
              <span>
                ⚠️ Non-zero resultant force (ΣF ≠ 0) means the vehicle cannot maintain steady velocity; it must either accelerate or decelerate.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // CHEMICAL BALANCE MANIPULATIVE
  // ==========================================
  const renderChemicalBalance = () => {
    // Equation: coeffH2 * H2 + coeffO2 * O2 -> coeffH2O * H2O
    // Tampered: H2 + O2 -> H2O2
    const totalReactantH = coeffH2 * 2;
    const totalReactantO = coeffO2 * 2;
    const totalProductH = showSubscriptTrap ? 2 : coeffH2O * 2;
    const totalProductO = showSubscriptTrap ? 2 : coeffH2O * 1;

    const isBalanced = totalReactantH === totalProductH && totalReactantO === totalProductO;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Coeff H₂: <strong>{coeffH2}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={coeffH2}
              onChange={(e) => setCoeffH2(parseInt(e.target.value))}
              style={{ width: '80px', accentColor: '#2563eb' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Coeff O₂: <strong>{coeffO2}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={coeffO2}
              onChange={(e) => setCoeffO2(parseInt(e.target.value))}
              style={{ width: '80px', accentColor: '#dc2626' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Coeff H₂O: <strong>{coeffH2O}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={coeffH2O}
              disabled={showSubscriptTrap}
              onChange={(e) => setCoeffH2O(parseInt(e.target.value))}
              style={{ width: '80px', accentColor: '#16a34a' }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setShowSubscriptTrap(!showSubscriptTrap)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: showSubscriptTrap ? '#fee2e2' : '#ffffff',
                color: showSubscriptTrap ? '#991b1b' : '#334155',
                border: '1px solid #fecdd3',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showSubscriptTrap ? '⚠️ Subscript Trap Active (H₂O₂)' : 'Test Subscript Tampering Trap'}
            </button>
          </div>
        </div>

        {/* Live Equation Display */}
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', fontSize: '1.4rem', fontWeight: 800, margin: '0.5rem 0' }}>
            <span style={{ color: '#2563eb' }}>{coeffH2}H₂</span>
            <span>+</span>
            <span style={{ color: '#dc2626' }}>{coeffO2}O₂</span>
            <span>➔</span>
            {showSubscriptTrap ? (
              <span style={{ color: '#991b1b', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
                H₂O₂ (Hydrogen Peroxide!)
              </span>
            ) : (
              <span style={{ color: '#16a34a' }}>{coeffH2O}H₂O (Water)</span>
            )}
          </div>

          {/* Atom Inventory Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Reactants (Left Side)</span>
              <div style={{ fontSize: '0.9rem', color: '#1e3a8a', marginTop: '4px' }}>
                <div>• Hydrogen (H) atoms: <strong>{totalReactantH}</strong></div>
                <div>• Oxygen (O) atoms: <strong>{totalReactantO}</strong></div>
              </div>
            </div>

            <div style={{ background: isBalanced ? '#ecfdf5' : '#fff1f2', padding: '0.75rem', borderRadius: '6px', border: isBalanced ? '1px solid #a7f3d0' : '1px solid #fecdd3' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isBalanced ? '#065f46' : '#991b1b', textTransform: 'uppercase' }}>Products (Right Side)</span>
              <div style={{ fontSize: '0.9rem', color: isBalanced ? '#065f46' : '#991b1b', marginTop: '4px' }}>
                <div>• Hydrogen (H) atoms: <strong>{totalProductH}</strong></div>
                <div>• Oxygen (O) atoms: <strong>{totalProductO}</strong></div>
              </div>
            </div>
          </div>

          {/* Balance Status Callout */}
          <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: isBalanced ? '#f0fdf4' : '#fffbeb', border: isBalanced ? '1px solid #bbf7d0' : '1px solid #fef3c7', fontSize: '0.82rem' }}>
            {showSubscriptTrap ? (
              <strong style={{ color: '#991b1b' }}>
                ☠️ FATAL ERROR: Changing the subscript to H₂O₂ balances the atom count, but converts drinking water into toxic hydrogen peroxide bleach! In chemistry, you must ONLY change the coefficients (multipliers).
              </strong>
            ) : isBalanced ? (
              <strong style={{ color: '#15803d' }}>
                ✅ Law of Conservation of Mass Obeyed: Exact same number of Hydrogen (4) and Oxygen (2) atoms exist before and after the reaction.
              </strong>
            ) : (
              <span style={{ color: '#b45309' }}>
                ⚠️ Unbalanced equation: Total atoms do not match. Adjust the multipliers to balance both H and O.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        background: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          ⚡ Procedural Vector Manipulative &bull; {seedTopic}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            background: '#ecfdf5',
            color: '#065f46',
            borderRadius: '9999px',
            fontWeight: 700,
            border: '1px solid #a7f3d0',
          }}
        >
          0 Bytes Downloaded (Pure Code)
        </span>
      </div>

      {cpaType === 'fractions' && renderFractions()}
      {cpaType === 'balance-scale' && renderBalanceScale()}
      {cpaType === 'circuits' && renderCircuits()}
      {cpaType === 'atomic' && renderAtomic()}
      {cpaType === 'place-value' && renderPlaceValue()}
      {cpaType === 'ratio-bar' && renderRatioBar()}
      {cpaType === 'number-line' && renderNumberLine()}
      {cpaType === 'photosynthesis' && renderPhotosynthesis()}
      {cpaType === 'force-vectors' && renderForceVectors()}
      {cpaType === 'chemical-balance' && renderChemicalBalance()}
    </div>
  );
};
