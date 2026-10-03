// src/components/player/AstChalkboardOverlay.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface AstChalkboardOverlayProps {
  isActive: boolean;
  onClose: () => void;
  width?: string | number;
  height?: string | number;
}

export default function AstChalkboardOverlay({
  isActive,
  onClose,
}: AstChalkboardOverlayProps): React.JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#f59e0b'); // Default amber gold
  const [brushSize, setBrushSize] = useState<number>(4);
  const [isHighlighter, setIsHighlighter] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas resolution to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // Preserve current drawing if resizing
      const ctx = canvas.getContext('2d');
      let imgData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        try {
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (_) {}
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      if (ctx && imgData) {
        try {
          ctx.putImageData(imgData, 0, 0);
        } catch (_) {}
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [isActive, resizeCanvas]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-10), data]);
    } catch (_) {}
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = isHighlighter ? 18 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = isHighlighter ? 0.35 : 1.0;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    ctx.putImageData(previous, 0, 0);
  };

  const downloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ast-slide-annotation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* Interactive Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: isHighlighter ? 'crosshair' : 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 16 16\'><circle cx=\'8\' cy=\'8\' r=\'4\' fill=\'white\' stroke=\'black\'/></svg>") 8 8, crosshair',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {/* Floating Chalkboard Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '30px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'auto',
          zIndex: 60,
          flexWrap: 'wrap',
          maxWidth: '96%',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>✏️</span> Chalkboard
        </span>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Color Palette */}
        {[
          { label: 'Amber Gold', val: '#f59e0b' },
          { label: 'Crimson Red', val: '#ef4444' },
          { label: 'Emerald Green', val: '#22c55e' },
          { label: 'Cyan Blue', val: '#38bdf8' },
          { label: 'Pure White', val: '#ffffff' },
        ].map((c) => (
          <button
            key={c.val}
            type="button"
            onClick={() => {
              setColor(c.val);
              setIsHighlighter(false);
            }}
            title={c.label}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: c.val,
              border: color === c.val && !isHighlighter ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.3)',
              cursor: 'pointer',
              padding: 0,
              boxShadow: color === c.val && !isHighlighter ? '0 0 8px ' + c.val : 'none',
              transform: color === c.val && !isHighlighter ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.15s ease',
            }}
          />
        ))}

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Highlighter Tool */}
        <button
          type="button"
          onClick={() => setIsHighlighter((prev) => !prev)}
          style={{
            background: isHighlighter ? '#facc15' : 'rgba(255,255,255,0.1)',
            color: isHighlighter ? '#1e1b4b' : '#f8fafc',
            border: 'none',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Semi-transparent broad highlighter"
        >
          🖍️ Highlighter
        </button>

        {/* Stroke Size */}
        {!isHighlighter && (
          <div style={{ display: 'flex', gap: '3px' }}>
            {[2, 4, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setBrushSize(s)}
                style={{
                  background: brushSize === s ? 'rgba(255,255,255,0.25)' : 'none',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {s === 2 ? 'Fine' : s === 4 ? 'Med' : 'Thick'}
              </button>
            ))}
          </div>
        )}

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Undo */}
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          style={{
            background: 'none',
            color: history.length > 0 ? '#cbd5e1' : '#64748b',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: history.length > 0 ? 'pointer' : 'default',
          }}
          title="Undo last stroke"
        >
          ↩ Undo
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={clearCanvas}
          style={{
            background: 'none',
            color: '#f87171',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Clear all annotations"
        >
          🧽 Clear
        </button>

        {/* Snapshot */}
        <button
          type="button"
          onClick={downloadSnapshot}
          style={{
            background: 'rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Download snapshot of drawing"
        >
          📸 Snapshot
        </button>

        {/* Exit Chalkboard */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginLeft: '4px',
          }}
          title="Close Chalkboard"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
