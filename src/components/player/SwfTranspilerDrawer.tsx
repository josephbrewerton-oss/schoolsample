// src/components/player/SwfTranspilerDrawer.tsx
/**
 * SWF / Adobe Flash Binary Transcompiler Drawer
 * Decompiles legacy .swf files (FWS/CWS) into native modern SVG + AST S-Expressions.
 */

import React from 'react';
import { transpileSwfToAst, type SwfTranspileResult } from '../../utils/swfAstParser';

export interface SwfTranspilerDrawerProps {
  swfResult: SwfTranspileResult | null;
  setSwfResult: (res: SwfTranspileResult | null) => void;
  isParsingSwf: boolean;
  setIsParsingSwf: (val: boolean) => void;
  swfError: string | null;
  setSwfError: (err: string | null) => void;
  swfDragActive: boolean;
  setSwfDragActive: (val: boolean) => void;
  setCustomSvgCode: (code: string) => void;
  setCustomAstCode: (code: string) => void;
  postToPlayer: (payload: Record<string, any>) => void;
  setHotReloadFlash: (val: boolean) => void;
}

export const SwfTranspilerDrawer: React.FC<SwfTranspilerDrawerProps> = ({
  swfResult,
  setSwfResult,
  isParsingSwf,
  setIsParsingSwf,
  swfError,
  setSwfError,
  swfDragActive,
  setSwfDragActive,
  setCustomSvgCode,
  setCustomAstCode,
  postToPlayer,
  setHotReloadFlash,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setSwfDragActive(true);
        }}
        onDragLeave={() => setSwfDragActive(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setSwfDragActive(false);
          const file = e.dataTransfer.files?.[0];
          if (!file) return;
          setIsParsingSwf(true);
          setSwfError(null);
          try {
            const buf = await file.arrayBuffer();
            const cleanName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
            const res = await transpileSwfToAst(buf, cleanName);
            if (res.success) {
              setSwfResult(res);
              setCustomSvgCode(res.svgMarkup);
              setCustomAstCode(res.astSource);
            } else {
              setSwfError(res.error || 'Failed to transpile SWF binary.');
            }
          } catch (err: any) {
            setSwfError(err?.message || 'Error processing SWF file.');
          } finally {
            setIsParsingSwf(false);
          }
        }}
        style={{
          border: swfDragActive ? '2px dashed var(--stj-primary, #6366f1)' : '2px dashed var(--stj-border)',
          background: swfDragActive ? 'var(--stj-primary-surface, rgba(99, 102, 241, 0.1))' : 'var(--stj-canvas)',
          borderRadius: '12px',
          padding: '24px 16px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
        <strong style={{ fontSize: '0.95rem', color: 'var(--stj-text)', display: 'block', marginBottom: '4px' }}>
          Drag &amp; Drop Legacy Adobe Flash (.swf) File Here
        </strong>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: 'var(--stj-text-muted)' }}>
          Decodes FWS (uncompressed) &amp; CWS (zlib-compressed) binary vector shapes, twips coordinates, and timeline frames into native 60 FPS SVG + AST S-Expressions.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <label className="stj-btn stj-btn-primary stj-btn-sm" style={{ cursor: 'pointer', fontSize: '0.76rem' }}>
            <span>Browse .swf File...</span>
            <input
              type="file"
              accept=".swf"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsParsingSwf(true);
                setSwfError(null);
                try {
                  const buf = await file.arrayBuffer();
                  const cleanName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
                  const res = await transpileSwfToAst(buf, cleanName);
                  if (res.success) {
                    setSwfResult(res);
                    setCustomSvgCode(res.svgMarkup);
                    setCustomAstCode(res.astSource);
                  } else {
                    setSwfError(res.error || 'Failed to transpile SWF binary.');
                  }
                } catch (err: any) {
                  setSwfError(err?.message || 'Error processing SWF file.');
                } finally {
                  setIsParsingSwf(false);
                }
              }}
            />
          </label>
          <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>or try an educational sample below</span>
        </div>
      </div>

      {/* Sample Flash Assets to Test Immediately */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--stj-text-muted)' }}>
          Legacy Samples:
        </span>
        {[
          {
            id: 'flash-pendulum',
            title: '⚖️ Physics Harmonic Pendulum',
            desc: 'Classic legacy science lab animation with angle sweep & potential energy.',
            mockBytes: () => {
              return new Uint8Array([
                0x46, 0x57, 0x53, 0x08,
                0x40, 0x00, 0x00, 0x00,
                0x78, 0x00, 0x07, 0xd0, 0x00, 0x00, 0x04, 0xb0,
                0x18, 0x00,
                0x3c, 0x00,
                0x43, 0x02, 0x0f, 0x17, 0x2a,
                0x00, 0x00,
              ]);
            }
          },
          {
            id: 'flash-fraction-clock',
            title: '⏰ Primary Math Fraction Clock',
            desc: 'Interactive clock face manipulative with rotating hands and sector fills.',
            mockBytes: () => {
              return new Uint8Array([
                0x46, 0x57, 0x53, 0x09,
                0x50, 0x00, 0x00, 0x00,
                0x78, 0x00, 0x09, 0xc4, 0x00, 0x00, 0x05, 0xdc,
                0x1e, 0x00,
                0x5a, 0x00,
                0x43, 0x02, 0x1e, 0x29, 0x3b,
                0x00, 0x00,
              ]);
            }
          },
        ].map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={async () => {
              setIsParsingSwf(true);
              setSwfError(null);
              try {
                const buf = sample.mockBytes();
                const res = await transpileSwfToAst(buf, sample.id);
                setSwfResult(res);
                setCustomSvgCode(res.svgMarkup);
                setCustomAstCode(res.astSource);
              } catch (err: any) {
                setSwfError(err?.message || 'Error processing sample.');
              } finally {
                setIsParsingSwf(false);
              }
            }}
            className="stj-btn stj-btn-secondary stj-btn-sm"
            style={{ fontSize: '0.72rem' }}
            title={sample.desc}
          >
            {sample.title}
          </button>
        ))}
      </div>

      {isParsingSwf && (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--stj-primary)' }}>
          <span>⏳ Decompressing and transpiling SWF vector display list...</span>
        </div>
      )}

      {swfError && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.76rem' }}>
          <strong>⚠️ SWF Transpile Notice:</strong> {swfError}
        </div>
      )}

      {swfResult && swfResult.metadata && (
        <div style={{ background: 'var(--stj-canvas)', border: '1px solid var(--stj-border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="stj-badge stj-badge-success stj-pill" style={{ fontWeight: 800 }}>✓ TRANSPILED</span>
              <strong style={{ fontSize: '0.86rem', color: 'var(--stj-text)' }}>
                Legacy Flash SWF v{swfResult.metadata.version} ({swfResult.metadata.signature})
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  postToPlayer({ type: 'HOT_RELOAD_SVG', svg: swfResult.svgMarkup });
                  postToPlayer({ type: 'HOT_RELOAD_AST', ast: swfResult.astSource });
                  postToPlayer({ type: 'SEEK', progress: 0 });
                  postToPlayer({ type: 'PLAY' });
                  setHotReloadFlash(true);
                  setTimeout(() => setHotReloadFlash(false), 2200);
                }}
                className="stj-btn stj-btn-primary stj-btn-sm"
                style={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                ⚡ Test &amp; Play in Stage
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([swfResult.svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `transpiled-${swfResult.metadata?.signature.toLowerCase() || 'swf'}.svg`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="stj-btn stj-btn-secondary stj-btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                💾 Download SVG
              </button>
            </div>
          </div>

          {/* Metadata Chips Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            <div style={{ padding: '6px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--stj-text-muted)', display: 'block' }}>Canvas Dimensions</span>
              <strong style={{ color: 'var(--stj-text)' }}>{swfResult.metadata.width} × {swfResult.metadata.height} px</strong>
            </div>
            <div style={{ padding: '6px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--stj-text-muted)', display: 'block' }}>Timeline &amp; Speed</span>
              <strong style={{ color: 'var(--stj-text)' }}>{swfResult.metadata.frameCount} Frames @ {swfResult.metadata.frameRate} FPS</strong>
            </div>
            <div style={{ padding: '6px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--stj-text-muted)', display: 'block' }}>Shapes Extracted</span>
              <strong style={{ color: 'var(--stj-text)' }}>{swfResult.metadata.shapeCount} Vector Paths</strong>
            </div>
            <div style={{ padding: '6px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--stj-text-muted)', display: 'block' }}>Background</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: swfResult.metadata.backgroundColor, border: '1px solid #64748b' }} />
                <strong style={{ color: 'var(--stj-text)' }}>{swfResult.metadata.backgroundColor}</strong>
              </div>
            </div>
          </div>

          {/* Generated AST S-Expression Preview */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--stj-primary)' }}>⚡ Generated Declarative AST S-Expressions:</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(swfResult.astSource);
                }}
                className="stj-btn stj-btn-ghost stj-btn-sm"
                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
              >
                📋 Copy AST
              </button>
            </div>
            <pre style={{ margin: 0, padding: '8px', background: 'var(--stj-surface)', border: '1px solid var(--stj-border)', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--stj-text-muted)', maxHeight: '110px', overflowY: 'auto', fontFamily: 'monospace' }}>
              {swfResult.astSource}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwfTranspilerDrawer;
