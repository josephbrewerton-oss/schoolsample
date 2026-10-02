// src/components/player/DevStudioDrawer.tsx
/**
 * Developer Code Studio Drawer
 * Houses the live DOM Inspector, Raw SVG Editor, AST S-Expression Editor,
 * Curriculum Starter Templates, and the SWF Transcompiler Lathe.
 */

import React from 'react';
import SvgInspectorDrawer, { InspectedElementData } from './SvgInspectorDrawer';
import SwfTranspilerDrawer from './SwfTranspilerDrawer';
import { type SwfTranspileResult } from '../../utils/swfAstParser';

export type StudioTabType = 'inspector' | 'svg' | 'ast' | 'templates' | 'swf';

export interface DevStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studioTab: StudioTabType;
  setStudioTab: (tab: StudioTabType) => void;
  inspectedElement: InspectedElementData | null;
  setInspectedElement: React.Dispatch<React.SetStateAction<InspectedElementData | null>>;
  customSvgCode: string;
  setCustomSvgCode: (code: string) => void;
  customAstCode: string;
  setCustomAstCode: (code: string) => void;
  hotReloadFlash: boolean;
  setHotReloadFlash: (val: boolean) => void;
  postToPlayer: (payload: Record<string, any>) => void;
  // SWF state
  swfResult: SwfTranspileResult | null;
  setSwfResult: (res: SwfTranspileResult | null) => void;
  isParsingSwf: boolean;
  setIsParsingSwf: (val: boolean) => void;
  swfError: string | null;
  setSwfError: (err: string | null) => void;
  swfDragActive: boolean;
  setSwfDragActive: (val: boolean) => void;
}

export const DevStudioDrawer: React.FC<DevStudioDrawerProps> = ({
  isOpen,
  onClose,
  studioTab,
  setStudioTab,
  inspectedElement,
  setInspectedElement,
  customSvgCode,
  setCustomSvgCode,
  customAstCode,
  setCustomAstCode,
  hotReloadFlash,
  setHotReloadFlash,
  postToPlayer,
  swfResult,
  setSwfResult,
  isParsingSwf,
  setIsParsingSwf,
  swfError,
  setSwfError,
  swfDragActive,
  setSwfDragActive,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        background: 'var(--stj-surface-raised)',
        borderTop: '2px solid var(--stj-primary)',
        padding: '14px',
        color: 'var(--stj-text)',
        fontSize: '0.82rem',
      }}
    >
      {/* Studio Header & Tab Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setStudioTab('inspector')}
            className={`stj-btn ${studioTab === 'inspector' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
            style={{ fontSize: '0.76rem' }}
          >
            🎯 Live Inspector
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('svg')}
            className={`stj-btn ${studioTab === 'svg' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
            style={{ fontSize: '0.76rem' }}
          >
            🎨 Raw SVG Source
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('ast')}
            className={`stj-btn ${studioTab === 'ast' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
            style={{ fontSize: '0.76rem' }}
          >
            ⚡ AST Expressions
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('templates')}
            className={`stj-btn ${studioTab === 'templates' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
            style={{ fontSize: '0.76rem' }}
          >
            🚀 Scratchpad Templates
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('swf')}
            className={`stj-btn ${studioTab === 'swf' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
            style={{ fontSize: '0.76rem' }}
            title="Transpile legacy Adobe Flash (.swf) into modern SVG + AST vectors"
          >
            📦 SWF / Flash Importer
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hotReloadFlash && (
            <span
              className="stj-badge stj-badge-success stj-pill"
              style={{ fontSize: '0.72rem' }}
            >
              ✓ Hot-Reloaded!
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              if (studioTab === 'svg') {
                postToPlayer({ type: 'HOT_RELOAD_SVG', svg: customSvgCode });
              } else if (studioTab === 'ast') {
                postToPlayer({ type: 'HOT_RELOAD_AST', ast: customAstCode });
              } else {
                postToPlayer({ type: 'HOT_RELOAD_SVG', svg: customSvgCode });
                postToPlayer({ type: 'HOT_RELOAD_AST', ast: customAstCode });
              }
            }}
            className="stj-btn stj-btn-primary stj-btn-sm"
            style={{ fontSize: '0.76rem', fontWeight: 700 }}
          >
            ⚡ Run / Hot Reload
          </button>

          <button
            type="button"
            onClick={() => postToPlayer({ type: 'GET_STAGE_SVG' })}
            className="stj-btn stj-btn-secondary stj-btn-sm"
            style={{ fontSize: '0.76rem' }}
            title="Sync current stage SVG and AST source from player"
          >
            ↺ Pull from Stage
          </button>

          <button
            type="button"
            onClick={onClose}
            className="stj-btn stj-btn-ghost stj-btn-sm"
            style={{ fontSize: '0.76rem' }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Tab 1: Live Inspector */}
      {studioTab === 'inspector' && (
        <SvgInspectorDrawer
          inspectedElement={inspectedElement}
          setInspectedElement={setInspectedElement}
          postToPlayer={postToPlayer}
        />
      )}

      {/* Tab 2: Raw SVG Markup */}
      {studioTab === 'svg' && (
        <div>
          <textarea
            value={customSvgCode}
            onChange={(e) => setCustomSvgCode(e.target.value)}
            placeholder="Click '↺ Pull from Stage' or paste SVG markup here..."
            style={{
              width: '100%',
              height: '180px',
              background: 'var(--stj-canvas)',
              color: 'var(--stj-text)',
              border: '1px solid var(--stj-border)',
              borderRadius: 'var(--stj-radius-sm)',
              padding: '10px',
              fontSize: '0.76rem',
              fontFamily: 'monospace',
              lineHeight: '1.4',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
              Edit raw SVG elements directly. Click 'Run / Hot Reload' to apply instantly without reloading.
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(customSvgCode);
              }}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              📋 Copy SVG
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: AST S-Expressions */}
      {studioTab === 'ast' && (
        <div>
          <textarea
            value={customAstCode}
            onChange={(e) => setCustomAstCode(e.target.value)}
            placeholder="Click '↺ Pull from Stage' or write AST S-expressions here..."
            style={{
              width: '100%',
              height: '180px',
              background: 'var(--stj-canvas)',
              color: 'var(--stj-primary)',
              border: '1px solid var(--stj-border)',
              borderRadius: 'var(--stj-radius-sm)',
              padding: '10px',
              fontSize: '0.76rem',
              fontFamily: 'monospace',
              lineHeight: '1.4',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
              Defines continuous mathematical bindings: (:target &quot;#id&quot; :attr &quot;transform&quot; :expr &quot;Math.sin(t * Math.PI * 2)&quot;)
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(customAstCode);
              }}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              📋 Copy AST
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Starter Templates */}
      {studioTab === 'templates' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: 'var(--stj-canvas)',
              border: '1px solid var(--stj-border)',
              padding: '12px',
              borderRadius: 'var(--stj-radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                🪐 Planetary Orbit
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                Parametric heliocentric revolution using cos(t) and sin(t) trigonometry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                postToPlayer({
                  type: 'HOT_RELOAD_SVG',
                  svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><circle cx="400" cy="240" r="140" fill="none" stroke="#334155" stroke-dasharray="4 4" /><circle id="star-sun" cx="400" cy="240" r="32" fill="#f59e0b" filter="url(#glow)" /><circle id="planet-earth" cx="540" cy="240" r="14" fill="#38bdf8" /><text id="orbit-txt" x="400" y="440" fill="#94a3b8" font-size="16" text-anchor="middle">Planetary Orbit Period: 1.0 Cycle</text></svg>`
                });
                postToPlayer({
                  type: 'HOT_RELOAD_AST',
                  ast: `(:scene :id "simple-orbit" :title "Simple Planetary Orbit" :stage "KS3 SCIENCE" :duration 6.0 (:keyframes ((:t 0.00 :title "Perihelion" :rule "Planet starts at 0 rad") (:t 0.50 :title "Aphelion" :rule "Planet reaches opposite orbital pole"))) (:bindings ((:target "#planet-earth" :attr "cx" :expr "400 + Math.cos(t * Math.PI * 2) * 140") (:target "#planet-earth" :attr "cy" :expr "240 + Math.sin(t * Math.PI * 2) * 140") (:target "#orbit-txt" :attr "textContent" :expr "'Orbit Angle: ' + Math.round(t * 360) + '°'"))))`
                });
                setHotReloadFlash(true);
                setTimeout(() => setHotReloadFlash(false), 2000);
              }}
              className="stj-btn stj-btn-primary stj-btn-sm"
              style={{ marginTop: '10px', fontSize: '0.74rem' }}
            >
              Load Template ➜
            </button>
          </div>

          <div
            style={{
              background: 'var(--stj-canvas)',
              border: '1px solid var(--stj-border)',
              padding: '12px',
              borderRadius: 'var(--stj-radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                🌊 Harmonic Wave
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                Continuous wave motion demonstrating frequency, amplitude, and crests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                postToPlayer({
                  type: 'HOT_RELOAD_SVG',
                  svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="240" x2="700" y2="240" stroke="#334155" stroke-width="2" /><path id="harmonic-wave" d="M 100 240 Q 250 140 400 240 T 700 240" fill="none" stroke="#38bdf8" stroke-width="4" /><circle id="wave-tracer" cx="400" cy="240" r="10" fill="#f43f5e" filter="url(#glow)" /><text id="wave-label" x="400" y="80" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">y = A · sin(ωt + φ)</text></svg>`
                });
                postToPlayer({
                  type: 'HOT_RELOAD_AST',
                  ast: `(:scene :id "sine-wave" :title "Harmonic Sine Wave" :stage "KS4 PHYSICS" :duration 4.0 (:keyframes ((:t 0.00 :title "Initial Phase" :rule "Zero displacement at origin") (:t 0.25 :title "Crest Amplitude" :rule "Maximum positive displacement +A"))) (:bindings ((:target "#wave-tracer" :attr "cy" :expr "240 - Math.sin(t * Math.PI * 2) * 90") (:target "#wave-tracer" :attr "cx" :expr "100 + (t * 600)") (:target "#wave-label" :attr "textContent" :expr "'Displacement y = ' + (Math.sin(t * Math.PI * 2) * 10).toFixed(1) + ' cm'"))))`
                });
                setHotReloadFlash(true);
                setTimeout(() => setHotReloadFlash(false), 2000);
              }}
              className="stj-btn stj-btn-primary stj-btn-sm"
              style={{ marginTop: '10px', fontSize: '0.74rem' }}
            >
              Load Template ➜
            </button>
          </div>

          <div
            style={{
              background: 'var(--stj-canvas)',
              border: '1px solid var(--stj-border)',
              padding: '12px',
              borderRadius: 'var(--stj-radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                ⏱️ Harmonic Pendulum
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                Conservation of energy demonstrating kinetic vs potential oscillation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                postToPlayer({
                  type: 'HOT_RELOAD_SVG',
                  svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><circle cx="400" cy="80" r="6" fill="#64748b" /><line id="pendulum-rod" x1="400" y1="80" x2="400" y2="340" stroke="#94a3b8" stroke-width="3" /><circle id="pendulum-bob" cx="400" cy="340" r="28" fill="#10b981" stroke="#34d399" stroke-width="2" /><text id="energy-txt" x="400" y="420" fill="#34d399" font-size="16" font-weight="bold" text-anchor="middle">E = Ep + Ek</text></svg>`
                });
                postToPlayer({
                  type: 'HOT_RELOAD_AST',
                  ast: `(:scene :id "physics-pendulum" :title "Harmonic Pendulum" :stage "KS3 PHYSICS" :duration 3.0 (:keyframes ((:t 0.00 :title "Max Left Amplitude" :rule "Ep is maximal, Ek = 0") (:t 0.25 :title "Equilibrium Pass" :rule "Ek is maximal at center, Ep is minimum"))) (:bindings ((:target "#pendulum-rod" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'") (:target "#pendulum-bob" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'") (:target "#energy-txt" :attr "textContent" :expr "'Potential Energy: ' + (Math.abs(Math.sin(t * Math.PI * 2)) * 100).toFixed(0) + '% | Kinetic: ' + ((1 - Math.abs(Math.sin(t * Math.PI * 2))) * 100).toFixed(0) + '%'"))))`
                });
                setHotReloadFlash(true);
                setTimeout(() => setHotReloadFlash(false), 2000);
              }}
              className="stj-btn stj-btn-primary stj-btn-sm"
              style={{ marginTop: '10px', fontSize: '0.74rem' }}
            >
              Load Template ➜
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: SWF / Flash Transcompiler */}
      {studioTab === 'swf' && (
        <SwfTranspilerDrawer
          swfResult={swfResult}
          setSwfResult={setSwfResult}
          isParsingSwf={isParsingSwf}
          setIsParsingSwf={setIsParsingSwf}
          swfError={swfError}
          setSwfError={setSwfError}
          swfDragActive={swfDragActive}
          setSwfDragActive={setSwfDragActive}
          setCustomSvgCode={setCustomSvgCode}
          setCustomAstCode={setCustomAstCode}
          postToPlayer={postToPlayer}
          setHotReloadFlash={setHotReloadFlash}
        />
      )}
    </div>
  );
};

export default DevStudioDrawer;
