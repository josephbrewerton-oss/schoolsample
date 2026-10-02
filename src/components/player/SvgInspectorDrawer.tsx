// src/components/player/SvgInspectorDrawer.tsx
/**
 * SVG Element Inspector Drawer
 * Provides real-time inspection, bounding box diagnostics, and live styling attribute manipulation
 * for selected SVG nodes on the vector stage.
 */

import React from 'react';

export interface InspectedElementData {
  selector: string;
  tag: string;
  id: string;
  bbox: { x: number; y: number; width: number; height: number };
  attributes: { fill?: string; stroke?: string; strokeWidth?: string; opacity?: string; transform?: string };
}

export interface SvgInspectorDrawerProps {
  inspectedElement: InspectedElementData | null;
  setInspectedElement: React.Dispatch<React.SetStateAction<InspectedElementData | null>>;
  postToPlayer: (payload: Record<string, any>) => void;
}

export const SvgInspectorDrawer: React.FC<SvgInspectorDrawerProps> = ({
  inspectedElement,
  setInspectedElement,
  postToPlayer,
}) => {
  return (
    <div
      style={{
        background: 'var(--stj-canvas)',
        border: '1px solid var(--stj-border)',
        borderRadius: 'var(--stj-radius-sm)',
        padding: '12px',
      }}
    >
      {inspectedElement ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="stj-badge stj-badge-primary">&lt;{inspectedElement.tag}&gt;</span>
              <code style={{ color: 'var(--stj-primary)', fontWeight: 700 }}>{inspectedElement.selector}</code>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
              Bounds: {Math.round(inspectedElement.bbox.width)}×{Math.round(inspectedElement.bbox.height)} px
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                Fill Color
              </label>
              <input
                type="text"
                value={inspectedElement.attributes.fill || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setInspectedElement({
                    ...inspectedElement,
                    attributes: { ...inspectedElement.attributes, fill: val }
                  });
                  postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'fill', value: val });
                }}
                className="stj-input"
                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                Stroke Color
              </label>
              <input
                type="text"
                value={inspectedElement.attributes.stroke || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setInspectedElement({
                    ...inspectedElement,
                    attributes: { ...inspectedElement.attributes, stroke: val }
                  });
                  postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'stroke', value: val });
                }}
                className="stj-input"
                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                Stroke Width
              </label>
              <input
                type="number"
                step="0.5"
                value={inspectedElement.attributes.strokeWidth || '1'}
                onChange={(e) => {
                  const val = e.target.value;
                  setInspectedElement({
                    ...inspectedElement,
                    attributes: { ...inspectedElement.attributes, strokeWidth: val }
                  });
                  postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'stroke-width', value: val });
                }}
                className="stj-input"
                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                Transform Expr
              </label>
              <input
                type="text"
                value={inspectedElement.attributes.transform || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setInspectedElement({
                    ...inspectedElement,
                    attributes: { ...inspectedElement.attributes, transform: val }
                  });
                  postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'transform', value: val });
                }}
                className="stj-input"
                placeholder="e.g. translate(20, 10)"
                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(inspectedElement.selector);
              }}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{ fontSize: '0.74rem' }}
            >
              📋 Copy Selector
            </button>
            <button
              type="button"
              onClick={() => {
                const rule = `(:target "${inspectedElement.selector}" :attr "transform" :expr "'rotate(' + (t * 360) + ')'")`;
                navigator.clipboard.writeText(rule);
              }}
              className="stj-btn stj-btn-primary stj-btn-sm"
              style={{ fontSize: '0.74rem' }}
            >
              ⚡ Copy AST Rule Snippet
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--stj-text-muted)' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🎯</div>
          <strong>No Element Selected</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
            Turn on <strong>🛠️ Inspect</strong> above and click any element on the vector stage to inspect its selector, bounding box, and live styling!
          </p>
        </div>
      )}
    </div>
  );
};

export default SvgInspectorDrawer;
