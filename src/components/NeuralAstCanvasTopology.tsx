// src/components/NeuralAstCanvasTopology.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface NeuralNode {
  id: number;
  label: string;
  letter: string;
  x: number;
  y: number;
  radius: number;
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
}

interface NeuralAstCanvasTopologyProps {
  prompt: string;
  options: string[];
  selectedAnswer: number | null;
  correctIndex: number | null;
  onSelectOption: (idx: number) => void;
  fps?: number;
  zeroCopyFrames?: number;
}

/**
 * High-Performance 2D Canvas Neural AST Visualizer with Full WCAG Screen-Reader DOM Mirror.
 *
 * Provides visual 2D rendering of the S-Expression AST decision topology on an HTML5 Canvas,
 * paired with a 100% accessible DOM mirror with aria-live announcements and full keyboard/screen-reader navigation.
 */
export default function NeuralAstCanvasTopology({
  prompt,
  options,
  selectedAnswer,
  correctIndex,
  onSelectOption,
  fps = 60,
  zeroCopyFrames = 0,
}: NeuralAstCanvasTopologyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRectRef = useRef<DOMRect | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');

  // Dimensions
  const width = 760;
  const height = 240;

  // Invalidate cached canvas rect on window scroll or resize to prevent stale coordinates
  useEffect(() => {
    const invalidate = () => {
      canvasRectRef.current = null;
    };
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
    };
  }, []);

  // One-time Canvas Buffer Resolution setup — avoids dirtying DOM layout on every hover/render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [width, height]);

  // Compute node positions
  const getNodes = useCallback((): NeuralNode[] => {
    const nodes: NeuralNode[] = [];
    const count = options.length;
    if (count === 0) return nodes;

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radiusX = 260;
    const radiusY = 75;

    options.forEach((opt, idx) => {
      // Semi-elliptical layout around central prompt
      const angle = Math.PI + (Math.PI / (count + 1)) * (idx + 1);
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle) * 1.1;

      nodes.push({
        id: idx,
        label: opt,
        letter: String.fromCharCode(65 + idx),
        x,
        y,
        radius: 26,
        isCorrect: correctIndex !== null && idx === correctIndex,
        isSelected: selectedAnswer === idx,
        disabled: selectedAnswer !== null,
      });
    });

    return nodes;
  }, [options, selectedAnswer, correctIndex]);

  // Update screen-reader announcement when answer state changes
  useEffect(() => {
    if (selectedAnswer !== null) {
      if (correctIndex !== null && selectedAnswer === correctIndex) {
        setAnnouncement(`Option ${String.fromCharCode(65 + selectedAnswer)} selected. Correct conceptual deduction!`);
      } else {
        setAnnouncement(`Option ${String.fromCharCode(65 + selectedAnswer)} selected. Review the conceptual hint.`);
      }
    } else {
      setAnnouncement(`New question loaded: ${prompt}. Choose from ${options.length} options.`);
    }
  }, [selectedAnswer, correctIndex, prompt, options.length]);

  // Visual 2D Canvas rendering loop (Zero-reflow: uses clearRect instead of resetting canvas DOM width/height)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Zero-reflow buffer clear
    ctx.clearRect(0, 0, width, height);

    // Background fill
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const nodes = getNodes();
    const centerX = width / 2;
    const centerY = height / 2 - 15;

    // 1. Draw Synapse Connections (Center -> Option Nodes)
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.quadraticCurveTo(
        (centerX + node.x) / 2,
        (centerY + node.y) / 2 - 15,
        node.x,
        node.y
      );

      const isNodeActive = node.isSelected || hoveredIndex === node.id || focusedIndex === node.id;
      if (node.isSelected && node.isCorrect) {
        ctx.strokeStyle = '#10b981'; // Emerald
        ctx.lineWidth = 3;
      } else if (node.isSelected) {
        ctx.strokeStyle = '#f59e0b'; // Amber
        ctx.lineWidth = 3;
      } else if (isNodeActive) {
        ctx.strokeStyle = '#38bdf8'; // Sky cyan
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'; // Muted slate
        ctx.lineWidth = 1.5;
      }
      ctx.stroke();
    });

    // 2. Draw Central Prompt Root Node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Central Node Label
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AST ROOT', centerX, centerY - 8);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillText('DECISION TREE', centerX, centerY + 8);

    // 3. Draw Option Synaptic Nodes
    nodes.forEach((node) => {
      const isHovered = hoveredIndex === node.id;
      const isFocused = focusedIndex === node.id;
      const isHighlit = isHovered || isFocused;

      // Outer focus / selection glow
      if (isHighlit || node.isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.isSelected
          ? node.isCorrect
            ? 'rgba(16, 185, 129, 0.25)'
            : 'rgba(245, 158, 11, 0.25)'
          : 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
      }

      // Main Node Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      if (node.isSelected) {
        ctx.fillStyle = node.isCorrect ? '#065f46' : '#78350f';
        ctx.strokeStyle = node.isCorrect ? '#34d399' : '#fbbf24';
        ctx.lineWidth = 3;
      } else if (isHighlit) {
        ctx.fillStyle = '#0369a1';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
      }
      ctx.fill();
      ctx.stroke();

      // Node Letter
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.letter, node.x, node.y);

      // Truncated Option Label below/above node
      const maxLen = 22;
      const labelSnippet =
        node.label.length > maxLen ? `${node.label.substring(0, maxLen)}...` : node.label;

      ctx.fillStyle = isHighlit || node.isSelected ? '#f8fafc' : '#94a3b8';
      ctx.font = isHighlit ? 'bold 11px system-ui, sans-serif' : '10px system-ui, sans-serif';
      const labelY = node.y > centerY ? node.y + node.radius + 14 : node.y - node.radius - 8;
      ctx.fillText(labelSnippet, node.x, labelY);
    });

    // 4. Zero-Copy & FPS HUD Overlay in Top-Right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(width - 170, 8, 162, 32);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 170, 8, 162, 32);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ ${fps} FPS • WCAG a11y`, width - 162, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText(`Zero-Copy: ${zeroCopyFrames} frames`, width - 162, 34);
  }, [width, height, getNodes, hoveredIndex, focusedIndex, fps, zeroCopyFrames]);

  // Canvas Mouse Move (Hit-Testing) — Uses cached rect to eliminate forced synchronous reflows
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvasRectRef.current || (canvasRectRef.current = canvas.getBoundingClientRect());
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const nodes = getNodes();
    let foundIndex: number | null = null;
    for (const node of nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= node.radius + 4) {
        foundIndex = node.id;
        break;
      }
    }
    setHoveredIndex(foundIndex);
  };

  // Canvas Click (Option Selection)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvasRectRef.current || (canvasRectRef.current = canvas.getBoundingClientRect());
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const nodes = getNodes();
    for (const node of nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= node.radius + 6 && !node.disabled) {
        onSelectOption(node.id);
        break;
      }
    }
  };

  // Keyboard navigation across nodes
  const handleCanvasKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (options.length === 0) return;
    const current = focusedIndex ?? -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (current + 1) % options.length;
      setFocusedIndex(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = current <= 0 ? options.length - 1 : current - 1;
      setFocusedIndex(prev);
    } else if ((e.key === 'Enter' || e.key === ' ') && focusedIndex !== null) {
      e.preventDefault();
      if (selectedAnswer === null) {
        onSelectOption(focusedIndex);
      }
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto 1.25rem auto',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        background: '#090d16',
      }}
    >
      {/* Visual 2D Canvas Render */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Neural AST Knowledge Topology: ${options.length} options radiating from central prompt.`}
        tabIndex={0}
        onMouseEnter={(e) => {
          canvasRectRef.current = e.currentTarget.getBoundingClientRect();
        }}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => {
          canvasRectRef.current = null;
          setHoveredIndex(null);
        }}
        onClick={handleCanvasClick}
        onKeyDown={handleCanvasKeyDown}
        onFocus={() => {
          if (focusedIndex === null) setFocusedIndex(0);
        }}
        onBlur={() => setFocusedIndex(null)}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${width}/${height}`,
          cursor: hoveredIndex !== null ? 'pointer' : 'default',
          outline: focusedIndex !== null ? '2px solid #38bdf8' : 'none',
        }}
      />

      {/* 
        Full Screen-Reader DOM Mirror for WCAG 2.1 AA Compliance.
        This provides semantic, accessible HTML buttons mirroring every canvas interaction point,
        readable by NVDA, JAWS, VoiceOver, and Orca, with live state announcements.
      */}
      <div
        className="canvas-sr-mirror"
        role="region"
        aria-label="Neural Decision Topology Screen-Reader Mirror"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        <div role="status" aria-live="polite">
          {announcement}
        </div>

        <nav aria-label="Interactive Canvas Options">
          <ul>
            {options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === idx;
              const isCorrect = correctIndex !== null && idx === correctIndex;

              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onSelectOption(idx)}
                    onFocus={() => setFocusedIndex(idx)}
                    onBlur={() => setFocusedIndex(null)}
                    aria-pressed={isSelected}
                    aria-label={`Option ${letter}: ${opt}.${
                      isSelected ? (isCorrect ? ' Correct deduction.' : ' Selected.') : ''
                    }`}
                  >
                    Select Option {letter}: {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
