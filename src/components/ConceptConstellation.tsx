// src/components/ConceptConstellation.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConceptGraphEngine,
  ConceptGraphNode,
  ConceptGraphEdge,
  DiagnosticRemediationRoute,
} from '../curriculum/conceptGraphEngine';

interface ConceptConstellationProps {
  onSelectConcept?: (node: ConceptGraphNode) => void;
  filterSubject?: string;
  filterStage?: string;
  compact?: boolean;
}

export default function ConceptConstellation({
  onSelectConcept,
  filterSubject,
  filterStage,
  compact = false,
}: ConceptConstellationProps): React.JSX.Element {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<ConceptGraphNode[]>([]);
  const [edges, setEdges] = useState<ConceptGraphEdge[]>([]);
  const [remediations, setRemediations] = useState<DiagnosticRemediationRoute[]>([]);
  const [selectedNode, setSelectedNode] = useState<ConceptGraphNode | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>(filterSubject || 'all');
  const [selectedStage, setSelectedStage] = useState<string>(filterStage || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Load graph state from in-memory engine and IndexedDB records
  useEffect(() => {
    let isMounted = true;
    ConceptGraphEngine.computeDynamicState('default').then((state) => {
      if (isMounted) {
        setNodes(state.nodes);
        setEdges(state.edges);
        setRemediations(state.remediations);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter nodes based on user selections
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (selectedSubject !== 'all' && n.subjectId !== selectedSubject) return false;
      if (selectedStage !== 'all' && n.stageId !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.topicTitle.toLowerCase().includes(q) ||
          n.csn.toLowerCase().includes(q) ||
          n.axiom.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [nodes, selectedSubject, selectedStage, searchQuery]);

  // Compute 2D Constellation Coordinates (Deterministic Polar/Hierarchical layout)
  const nodePositions = useMemo(() => {
    const coords = new Map<string, { x: number; y: number }>();
    const count = filteredNodes.length;
    if (count === 0) return coords;

    // Center point of canvas
    const cx = 500;
    const cy = 350;

    // Group nodes by subject for stellar clustering
    const subjects = Array.from(new Set(filteredNodes.map((n) => n.subjectId)));
    const subjectAngles = new Map<string, number>();
    subjects.forEach((s, idx) => {
      subjectAngles.set(s, (idx / subjects.length) * 2 * Math.PI);
    });

    filteredNodes.forEach((node, idx) => {
      const baseAngle = subjectAngles.get(node.subjectId) || 0;
      const angleJitter = ((idx % 7) - 3) * 0.18;
      const angle = baseAngle + angleJitter;

      // Distance from center governed by Tier and Key Stage
      let radius = 140;
      if (node.tier === 2) radius = 240;
      if (node.tier === 3) radius = 330;

      // Small deterministic offset based on CSN hash to prevent overlapping
      const hash = node.csn.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const rJitter = (hash % 40) - 20;

      const x = cx + (radius + rJitter) * Math.cos(angle);
      const y = cy + (radius + rJitter) * Math.sin(angle);

      coords.set(node.csn, { x, y });
    });

    return coords;
  }, [filteredNodes]);

  // Filter visible edges between currently rendered nodes
  const visibleEdges = useMemo(() => {
    const activeCsns = new Set(filteredNodes.map((n) => n.csn));
    return edges.filter((e) => activeCsns.has(e.from) && activeCsns.has(e.to));
  }, [edges, filteredNodes]);

  // Canvas interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = (node: ConceptGraphNode) => {
    setSelectedNode(node);
    if (onSelectConcept) {
      onSelectConcept(node);
    }
  };

  // Node color mapping
  const getNodeColor = (status: ConceptGraphNode['status'], isSacramental: boolean) => {
    if (status === 'mastered') return '#10b981'; // Emerald
    if (status === 'remediation_needed') return '#ef4444'; // Red pulse
    if (status === 'in_progress') return '#3b82f6'; // Blue
    if (status === 'locked') return '#475569'; // Muted Slate
    return isSacramental ? '#d97706' : '#8b5cf6'; // Gold for sacramental, purple for standard
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: compact ? '480px' : '720px',
        background: '#0a0e17',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
        position: 'relative',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Control Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1e293b',
          zIndex: 10,
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              Concept Constellation Graph
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
              In-Memory AST Knowledge Web • NATO Stock Number Routing
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search concepts or CSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              outline: 'none',
              width: '180px',
            }}
          />

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Stages</option>
            <option value="ks1">Key Stage 1</option>
            <option value="ks2">Key Stage 2</option>
            <option value="ks3">Key Stage 3</option>
            <option value="ks4">Key Stage 4</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Subjects</option>
            <option value="maths">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="religious-education-catholic">Catholic RE</option>
            <option value="religious-studies">Religious Studies</option>
          </select>

          {/* Zoom controls */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.5))}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              style={{
                background: '#1e293b',
                color: '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.72rem',
              }}
              title="Reset View"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 700"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <g
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: '500px 350px', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
          >
            {/* Grid & Background Constellation Starfield */}
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Invariant Prerequisite Edge Lines */}
            {visibleEdges.map((edge, idx) => {
              const fromPos = nodePositions.get(edge.from);
              const toPos = nodePositions.get(edge.to);
              if (!fromPos || !toPos) return null;

              const isSacramental = edge.relation === 'sacramental_progression';
              const strokeColor = edge.isActive
                ? isSacramental
                  ? '#f59e0b'
                  : '#38bdf8'
                : 'rgba(71, 85, 105, 0.4)';
              const strokeWidth = edge.isActive ? 2.5 : 1.2;
              const strokeDasharray = edge.isActive ? 'none' : '4,4';

              return (
                <g key={`edge_${edge.from}_${edge.to}_${idx}`}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeOpacity={0.8}
                  />
                  {/* Subtle directional pulse on active paths */}
                  {edge.isActive && (
                    <circle
                      cx={(fromPos.x + toPos.x) / 2}
                      cy={(fromPos.y + toPos.y) / 2}
                      r="2.5"
                      fill={isSacramental ? '#fbbf24' : '#7dd3fc'}
                    />
                  )}
                </g>
              );
            })}

            {/* Concept Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodePositions.get(node.csn);
              if (!pos) return null;

              const isSelected = selectedNode?.csn === node.csn;
              const isSacramental =
                node.subjectId.includes('religious') || node.subjectId.includes('catholic');
              const nodeColor = getNodeColor(node.status, isSacramental);
              const radius = isSelected ? 12 : node.tier === 1 ? 8 : node.tier === 2 ? 10 : 12;

              return (
                <g
                  key={node.csn}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse ring for Remediation or Mastered */}
                  {node.status === 'remediation_needed' && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      opacity="0.75"
                    >
                      <animate
                        attributeName="r"
                        values={`${radius + 4};${radius + 14};${radius + 4}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.2;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {node.status === 'mastered' && (
                    <circle
                      r={radius + 5}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    r={radius}
                    fill={nodeColor}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? 'url(#glowEffect)' : undefined}
                  />

                  {/* Node Title Label */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '11px' : '9.5px'}
                    fontWeight={isSelected ? 700 : 500}
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {node.topicTitle.length > 24
                      ? `${node.topicTitle.slice(0, 22)}…`
                      : node.topicTitle}
                  </text>

                  {/* Stock Number Badge below title */}
                  <text
                    y={radius + 24}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="7.5px"
                    fontFamily="monospace"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.csn}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Remediation Beacon Alert (if any misconceptions are active) */}
        {remediations.length > 0 && !selectedNode && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              maxWidth: '380px',
              background: 'rgba(30, 27, 75, 0.95)',
              border: '1px solid #6366f1',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1rem' }}>🧭</span>
              <strong style={{ fontSize: '0.82rem', color: '#a5b4fc' }}>
                Logseq Diagnostic Remediation Active
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#e0e7ff', lineHeight: 1.4 }}>
              {remediations[0].reason}
            </p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate(remediations[0].remedialPath)}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Launch Remedial Drill
              </button>
            </div>
          </div>
        )}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '320px',
              background: 'rgba(15, 23, 42, 0.96)',
              border: '1px solid #334155',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 15px 35px -5px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(12px)',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    background: '#1e293b',
                    color: '#94a3b8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {selectedNode.csn}
                </span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '1.05rem', color: '#f8fafc' }}>
                  {selectedNode.topicTitle}
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '10px' }}>
                  {selectedNode.stageTitle} • {selectedNode.subjectTitle}
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.45 }}>
              <strong style={{ color: '#f1f5f9' }}>Invariant Axiom:</strong> {selectedNode.axiom}
            </div>

            {selectedNode.cognitiveTrap && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#fca5a5',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginBottom: '12px',
                }}
              >
                ⚠️ <strong>Cognitive Trap:</strong> {selectedNode.cognitiveTrap}
              </div>
            )}

            {/* Prerequisites */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                Prerequisites ({selectedNode.prerequisites.length})
              </div>
              {selectedNode.prerequisites.length === 0 ? (
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Foundational Root (No prior requirements)</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedNode.prerequisites.map((pCsn) => (
                    <span
                      key={pCsn}
                      onClick={() => {
                        const target = ConceptGraphEngine.findNode(pCsn);
                        if (target) setSelectedNode(target);
                      }}
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'monospace',
                        background: '#1e293b',
                        color: '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid #334155',
                      }}
                    >
                      🔗 {pCsn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Practice Lab Action */}
            <button
              onClick={() => {
                navigate(`/practice-lab?topic=${encodeURIComponent(selectedNode.topicId)}`);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              ⚡ Enter Topic Practice Lab
            </button>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px',
          background: '#090d16',
          borderTop: '1px solid #1e293b',
          fontSize: '0.7rem',
          color: '#64748b',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            Mastered
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
            In Progress
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            Remediation Needed
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} />
            Sacramental Progression
          </span>
        </div>
        <div>Drag to pan • Scroll or buttons to zoom • Click node to inspect</div>
      </div>
    </div>
  );
}
