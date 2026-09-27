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
  const [focusedNodeCsn, setFocusedNodeCsn] = useState<string | null>(null);
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
    if (status === 'mastered') return 'var(--stj-success)';
    if (status === 'remediation_needed') return 'var(--stj-danger)';
    if (status === 'in_progress') return 'var(--stj-primary)';
    if (status === 'locked') return 'var(--stj-text-muted)';
    return isSacramental ? 'var(--stj-warning)' : 'var(--stj-primary)';
  };

  return (
    <div
      className="stj-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: compact ? '480px' : '720px',
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--stj-shadow-lg)',
        position: 'relative',
        color: 'var(--stj-text)',
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
          background: 'var(--stj-surface-raised)',
          borderBottom: '1px solid var(--stj-border)',
          zIndex: 10,
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>✨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--stj-text)' }}>
              Concept Constellation Graph
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
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
            className="stj-input"
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.78rem',
              width: '180px',
            }}
          />

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="stj-select"
            style={{
              padding: '4px 8px',
              minHeight: '32px',
              fontSize: '0.78rem',
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
            className="stj-select"
            style={{
              padding: '4px 8px',
              minHeight: '32px',
              fontSize: '0.78rem',
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
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{ minHeight: '30px', padding: '2px 8px' }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{ minHeight: '30px', padding: '2px 8px' }}
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="stj-btn stj-btn-ghost stj-btn-sm"
              style={{ minHeight: '30px', padding: '2px 8px', fontSize: '0.72rem', border: '1px solid var(--stj-border)' }}
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
          background: 'var(--stj-canvas)',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          role="region"
          aria-label="Curriculum Concept Constellation Graph"
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
                <stop offset="0%" stopColor="var(--stj-primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--stj-primary)" stopOpacity="0" />
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
                  ? 'var(--stj-warning)'
                  : 'var(--stj-primary)'
                : 'var(--stj-border)';
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
                      fill={isSacramental ? 'var(--stj-warning)' : 'var(--stj-primary)'}
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

              const isFocused = focusedNodeCsn === node.csn;

              return (
                <g
                  key={node.csn}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={node.topicTitle}
                  aria-pressed={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNodeClick(node);
                    }
                  }}
                  onFocus={() => setFocusedNodeCsn(node.csn)}
                  onBlur={() => setFocusedNodeCsn((curr) => (curr === node.csn ? null : curr))}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {/* Keyboard Visible Focus Ring */}
                  {isFocused && (
                    <circle
                      r={radius + 7}
                      fill="none"
                      stroke="var(--stj-primary)"
                      strokeWidth="2.5"
                      strokeDasharray="4,3"
                    />
                  )}

                  {/* Outer pulse ring for Remediation or Mastered */}
                  {node.status === 'remediation_needed' && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="var(--stj-danger)"
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
                      stroke="var(--stj-success)"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    r={radius}
                    fill={nodeColor}
                    stroke={isSelected ? 'var(--stj-primary)' : isFocused ? 'var(--stj-primary)' : 'var(--stj-surface)'}
                    strokeWidth={isSelected || isFocused ? 3 : 1.5}
                    filter={isSelected ? 'url(#glowEffect)' : undefined}
                  />

                  {/* Node Title Label */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--stj-primary)' : 'var(--stj-text)'}
                    fontSize={isSelected ? '11px' : '9.5px'}
                    fontWeight={isSelected ? 700 : 500}
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none',
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
                    fill="var(--stj-text-muted)"
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

        {/* Full WCAG Screen-Reader DOM Mirror for Concept Dependency Tree */}
        <div
          id="sr-constellation-mirror"
          className="sr-only"
          role="region"
          aria-label="Concept Constellation Screen Reader DOM Mirror"
          aria-live="polite"
        >
          <h3>Concept Knowledge Tree Screen-Reader Navigation</h3>
          <p>
            Currently displaying {filteredNodes.length} curriculum concepts across {selectedStage === 'all' ? 'all stages' : selectedStage} and {selectedSubject === 'all' ? 'all subjects' : selectedSubject}.
          </p>
          {selectedNode ? (
            <div tabIndex={0} aria-label={`Selected Concept: ${selectedNode.topicTitle}`}>
              <h4>Selected Concept: {selectedNode.topicTitle} ({selectedNode.csn})</h4>
              <p>Stage: {selectedNode.stageTitle}, Subject: {selectedNode.subjectTitle}</p>
              <p>Status: {selectedNode.status.replace(/_/g, ' ')}, Tier: {selectedNode.tier}</p>
              <p>Invariant Axiom: {selectedNode.axiom}</p>
              {selectedNode.cognitiveTrap && <p>Cognitive Trap: {selectedNode.cognitiveTrap}</p>}
              <p>Prerequisites: {selectedNode.prerequisites.length > 0 ? selectedNode.prerequisites.join(', ') : 'Foundational Root (no prerequisites)'}</p>
            </div>
          ) : (
            <p>No concept currently selected. Tab through the nodes and press Enter to inspect.</p>
          )}
          <ul>
            {filteredNodes.map((n) => (
              <li key={n.csn}>
                <button
                  type="button"
                  onClick={() => handleNodeClick(n)}
                  aria-label={`${n.topicTitle} (${n.csn}) - Status: ${n.status.replace(/_/g, ' ')}`}
                >
                  Inspect {n.topicTitle} ({n.csn}) - Status: {n.status.replace(/_/g, ' ')}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating Remediation Beacon Alert (if any misconceptions are active) */}
        {remediations.length > 0 && !selectedNode && (
          <div
            className="stj-card"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              maxWidth: '380px',
              background: 'var(--stj-surface-raised)',
              border: '1.5px solid var(--stj-warning)',
              borderRadius: 'var(--stj-radius-md)',
              padding: '12px 16px',
              boxShadow: 'var(--stj-shadow-lg)',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1rem' }}>🧭</span>
              <strong style={{ fontSize: '0.82rem', color: 'var(--stj-warning)' }}>
                Logseq Diagnostic Remediation Active
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text)', lineHeight: 1.4 }}>
              {remediations[0].reason}
            </p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate(remediations[0].remedialPath)}
                className="stj-btn stj-btn-primary stj-btn-sm"
              >
                Launch Remedial Drill
              </button>
            </div>
          </div>
        )}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div
            className="stj-card"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '320px',
              background: 'var(--stj-surface-raised)',
              border: '1px solid var(--stj-border)',
              borderRadius: 'var(--stj-radius-md)',
              padding: '16px',
              boxShadow: 'var(--stj-shadow-lg)',
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
                    background: 'var(--stj-canvas)',
                    color: 'var(--stj-text-muted)',
                    border: '1px solid var(--stj-border)',
                    padding: '2px 6px',
                    borderRadius: 'var(--stj-radius-sm)',
                  }}
                >
                  {selectedNode.csn}
                </span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '1.05rem', color: 'var(--stj-text)' }}>
                  {selectedNode.topicTitle}
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--stj-primary)', marginBottom: '10px' }}>
                  {selectedNode.stageTitle} • {selectedNode.subjectTitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                aria-label="Close concept inspector drawer"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--stj-text-muted)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--stj-text)', marginBottom: '12px', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--stj-text)' }}>Invariant Axiom:</strong> {selectedNode.axiom}
            </div>

            {selectedNode.cognitiveTrap && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--stj-danger)',
                  background: 'var(--stj-danger-surface)',
                  padding: '8px 10px',
                  borderRadius: 'var(--stj-radius-sm)',
                  border: '1px solid var(--stj-danger)',
                  marginBottom: '12px',
                }}
              >
                ⚠️ <strong>Cognitive Trap:</strong> {selectedNode.cognitiveTrap}
              </div>
            )}

            {/* Prerequisites */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--stj-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Prerequisites ({selectedNode.prerequisites.length})
              </div>
              {selectedNode.prerequisites.length === 0 ? (
                <div style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>Foundational Root (No prior requirements)</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedNode.prerequisites.map((pCsn) => (
                    <button
                      key={pCsn}
                      type="button"
                      onClick={() => {
                        const target = ConceptGraphEngine.findNode(pCsn);
                        if (target) setSelectedNode(target);
                      }}
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'monospace',
                        background: 'var(--stj-canvas)',
                        color: 'var(--stj-primary)',
                        padding: '2px 8px',
                        minHeight: '26px',
                        borderRadius: 'var(--stj-radius-sm)',
                        cursor: 'pointer',
                        border: '1px solid var(--stj-border)',
                      }}
                      aria-label={`Inspect prerequisite concept ${pCsn}`}
                    >
                      🔗 {pCsn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Practice Lab Action */}
            <button
              onClick={() => {
                navigate(`/practice-lab?topic=${encodeURIComponent(selectedNode.topicId)}`);
              }}
              className="stj-btn stj-btn-primary"
              style={{
                width: '100%',
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
          background: 'var(--stj-surface-raised)',
          borderTop: '1px solid var(--stj-border)',
          fontSize: '0.7rem',
          color: 'var(--stj-text-muted)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--stj-success)' }} />
            Mastered
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--stj-primary)' }} />
            In Progress
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--stj-danger)' }} />
            Remediation Needed
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--stj-warning)' }} />
            Sacramental Progression
          </span>
        </div>
        <div>Drag to pan • Scroll or buttons to zoom • Click node to inspect</div>
      </div>
    </div>
  );
}
