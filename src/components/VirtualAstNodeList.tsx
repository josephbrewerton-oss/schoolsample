// src/components/VirtualAstNodeList.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { SExprAST, SExprNode } from '../types/sexpr';
import SExprViewRenderer from './SExprViewRenderer';

interface Props {
  nodes: (SExprAST | SExprNode)[];
  onAction?: (action: string, payload?: any) => void;
  virtualizeThreshold?: number;
  estimatedItemHeight?: number;
}

/**
 * VirtualAstNodeList
 * 
 * Virtualizes the AST DOM for large trees:
 * - Only mounts subtrees that intersect the visible viewport (+ 350px buffer)
 * - Offscreen AST subtrees are held in lightweight placeholder containers
 * - Uses IntersectionObserver + contentVisibility: auto for browser compositor acceleration
 * - Zero Cumulative Layout Shift (CLS)
 */
export default function VirtualAstNodeList({
  nodes,
  onAction,
  virtualizeThreshold = 10,
  estimatedItemHeight = 84,
}: Props): React.JSX.Element {
  return (
    <div className="virtual-ast-list flex flex-col space-y-3 w-full">
      {nodes.map((node, index) => (
        <VirtualAstNodeItem
          key={index}
          index={index}
          node={node}
          onAction={onAction}
          virtualizeThreshold={virtualizeThreshold}
          estimatedHeight={estimatedItemHeight}
        />
      ))}
    </div>
  );
}

interface ItemProps {
  index: number;
  node: SExprAST | SExprNode;
  onAction?: (action: string, payload?: any) => void;
  virtualizeThreshold: number;
  estimatedHeight: number;
}

function VirtualAstNodeItem({
  node,
  onAction,
  virtualizeThreshold,
  estimatedHeight,
}: ItemProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [measuredHeight, setMeasuredHeight] = useState<number>(estimatedHeight);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting && entry.boundingClientRect.height > 0) {
            setMeasuredHeight(entry.boundingClientRect.height);
          }
        }
      },
      {
        root: null,
        rootMargin: '350px 0px 350px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="virtual-ast-node-wrapper w-full"
      style={{
        minHeight: isVisible ? undefined : `${measuredHeight}px`,
        contentVisibility: 'auto',
        containIntrinsicSize: `0 ${measuredHeight}px`,
      }}
    >
      {isVisible ? (
        <SExprViewRenderer
          ast={node}
          onAction={onAction}
          virtualizeThreshold={virtualizeThreshold}
        />
      ) : (
        <div 
          className="ast-virtual-placeholder w-full rounded bg-slate-50/40 border border-dashed border-slate-200/50" 
          style={{ height: `${measuredHeight}px` }} 
        />
      )}
    </div>
  );
}
