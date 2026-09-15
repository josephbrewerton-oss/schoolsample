// src/utils/astStyleCompiler.ts
import type { CSSProperties } from 'react';
import type { SExprAST, SExprNode } from '../types/sexpr';

/**
 * Liturgical Calendar Theme Color Substrates
 * Directly maps Catholic liturgical seasons to verified, accessible CSS values.
 */
export const LITURGICAL_AST_PALETTE: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  green: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#166534',
    accent: '#15803d',
  },
  'ordinary-time': {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#166534',
    accent: '#15803d',
  },
  violet: {
    bg: '#faf5ff',
    border: '#e9d5ff',
    text: '#6b21a8',
    accent: '#7e22ce',
  },
  lent: {
    bg: '#faf5ff',
    border: '#e9d5ff',
    text: '#6b21a8',
    accent: '#7e22ce',
  },
  advent: {
    bg: '#f5f3ff',
    border: '#ddd6fe',
    text: '#5b21b6',
    accent: '#6d28d9',
  },
  white: {
    bg: '#fffdf5',
    border: '#fef08a',
    text: '#854d0e',
    accent: '#ca8a04',
  },
  gold: {
    bg: '#fffdf0',
    border: '#fde047',
    text: '#713f12',
    accent: '#eab308',
  },
  easter: {
    bg: '#fffdf5',
    border: '#fef08a',
    text: '#854d0e',
    accent: '#ca8a04',
  },
  christmas: {
    bg: '#fffdf5',
    border: '#fef08a',
    text: '#854d0e',
    accent: '#ca8a04',
  },
  red: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    accent: '#dc2626',
  },
  pentecost: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    accent: '#dc2626',
  },
  rose: {
    bg: '#fff1f2',
    border: '#fecdd3',
    text: '#9f1239',
    accent: '#e11d48',
  },
};

/**
 * Normalizes CSS property keys from kebab-case or Lisp keywords (:min-height, :bg)
 * into standard React CSSProperties camelCase keys.
 */
const KEY_MAP: Record<string, keyof CSSProperties> = {
  bg: 'backgroundColor',
  background: 'backgroundColor',
  backgroundColor: 'backgroundColor',
  color: 'color',
  textColor: 'color',
  border: 'border',
  borderColor: 'borderColor',
  borderWidth: 'borderWidth',
  borderStyle: 'borderStyle',
  radius: 'borderRadius',
  borderRadius: 'borderRadius',
  padding: 'padding',
  p: 'padding',
  paddingX: 'paddingLeft', // will set both
  paddingY: 'paddingTop',  // will set both
  margin: 'margin',
  m: 'margin',
  gap: 'gap',
  display: 'display',
  flex: 'flex',
  flexDirection: 'flexDirection',
  alignItems: 'alignItems',
  align: 'alignItems',
  justifyContent: 'justifyContent',
  justify: 'justifyContent',
  width: 'width',
  w: 'width',
  height: 'height',
  h: 'height',
  minHeight: 'minHeight',
  maxHeight: 'maxHeight',
  maxWidth: 'maxWidth',
  minWidth: 'minWidth',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  lineHeight: 'lineHeight',
  textAlign: 'textAlign',
  shadow: 'boxShadow',
  boxShadow: 'boxShadow',
  opacity: 'opacity',
  overflow: 'overflow',
  cursor: 'cursor',
  zIndex: 'zIndex',
};

/**
 * Compiles a CSS AST or props object into React.CSSProperties
 * 
 * Supports:
 * - AST SExprNode (e.g. { tag: 'rule', props: { bg: '#fff', radius: '8px' } })
 * - SExpr AST array of rule expressions: [ [":bg", "#fff"], [":gap", "12px"] ]
 * - Direct Lisp keyword property overrides (:bg, :radius, :liturgical)
 * - Raw string styles (safely converted)
 */
export function compileAstStyle(
  styleAst?: SExprAST | string | CSSProperties | null,
  nodeProps?: Record<string, any>
): CSSProperties {
  const result: CSSProperties = {};

  // 1. If base props have direct shortcut styling keywords (e.g., :bg, :radius, :liturgical)
  if (nodeProps) {
    if (nodeProps.liturgical) {
      const liturgicalKey = String(nodeProps.liturgical).toLowerCase().replace(/^:/, '');
      const palette = LITURGICAL_AST_PALETTE[liturgicalKey];
      if (palette) {
        result.backgroundColor = palette.bg;
        result.borderColor = palette.border;
        result.color = palette.text;
        result.border = `1px solid ${palette.border}`;
      }
    }

    if (nodeProps.contain === 'content-visibility' || nodeProps.contain === 'auto' || nodeProps.virtualized) {
      result.contentVisibility = 'auto';
      result.containIntrinsicSize = '0 120px';
    }

    // Direct shortcut styling props on node
    for (const [rawKey, rawVal] of Object.entries(nodeProps)) {
      if (rawVal === undefined || rawVal === null) continue;
      const cleanKey = rawKey.replace(/^:/, '');
      if (KEY_MAP[cleanKey]) {
        applyStyleKeyValue(result, KEY_MAP[cleanKey], rawVal);
      }
    }
  }

  // 2. If styleAst is null/undefined, return what we have
  if (!styleAst) return result;

  // 3. If styleAst is already a JS CSSProperties object
  if (typeof styleAst === 'object' && !Array.isArray(styleAst) && !('tag' in styleAst)) {
    return { ...result, ...(styleAst as CSSProperties) };
  }

  // 4. If styleAst is a raw CSS string (e.g., "background: #fff; padding: 12px;")
  if (typeof styleAst === 'string') {
    return { ...result, ...parseCssString(styleAst) };
  }

  // 5. If styleAst is an SExprNode (e.g., { tag: 'style' | 'rule', props: {...}, children: [...] })
  if (typeof styleAst === 'object' && 'tag' in styleAst) {
    const node = styleAst as SExprNode;
    
    // Process liturgical theme inside AST rule
    if (node.props?.liturgical) {
      const key = String(node.props.liturgical).toLowerCase().replace(/^:/, '');
      const palette = LITURGICAL_AST_PALETTE[key];
      if (palette) {
        result.backgroundColor = palette.bg;
        result.borderColor = palette.border;
        result.color = palette.text;
        result.border = `1px solid ${palette.border}`;
      }
    }

    // Process props in rule
    if (node.props) {
      for (const [key, val] of Object.entries(node.props)) {
        const cleanKey = key.replace(/^:/, '');
        if (KEY_MAP[cleanKey]) {
          applyStyleKeyValue(result, KEY_MAP[cleanKey], val);
        }
      }
    }

    // Process children if children are sub-rules or [prop, val] tuples
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        const anyChild = child as any;
        if (anyChild && typeof anyChild === 'object') {
          if ('tag' in anyChild) {
            const childKey = anyChild.tag.replace(/^:/, '');
            if (KEY_MAP[childKey]) {
              const childVal = anyChild.children?.[0] ?? anyChild.props?.value;
              if (childVal !== undefined) {
                applyStyleKeyValue(result, KEY_MAP[childKey], childVal);
              }
            }
          } else if (Array.isArray(anyChild) && anyChild.length >= 2) {
            const keyStr = String(anyChild[0]).replace(/^:/, '');
            if (KEY_MAP[keyStr]) {
              applyStyleKeyValue(result, KEY_MAP[keyStr], anyChild[1]);
            }
          }
        }
      }
    }

    return result;
  }

  // 6. If styleAst is an array of AST expressions [[":bg", "#fff"], [":radius", "8px"]]
  if (Array.isArray(styleAst)) {
    for (const item of styleAst) {
      if (Array.isArray(item) && item.length >= 2) {
        const key = String(item[0]).replace(/^:/, '');
        if (KEY_MAP[key]) {
          applyStyleKeyValue(result, KEY_MAP[key], item[1]);
        }
      } else if (item && typeof item === 'object' && 'tag' in item) {
        const sub = compileAstStyle(item);
        Object.assign(result, sub);
      }
    }
    return result;
  }

  return result;
}

/**
 * Safely applies an AST key-value pair to a CSSProperties object
 */
function applyStyleKeyValue(target: CSSProperties, key: keyof CSSProperties, value: any): void {
  if (value === null || value === undefined) return;
  const strVal = typeof value === 'string' ? value.replace(/^:/, '') : value;

  // Handle special compound helpers
  if (key === 'paddingLeft' && strVal) {
    target.paddingLeft = strVal;
    target.paddingRight = strVal;
    return;
  }
  if (key === 'paddingTop' && strVal) {
    target.paddingTop = strVal;
    target.paddingBottom = strVal;
    return;
  }

  // Convert numbers to pixel strings where appropriate
  if (
    typeof strVal === 'number' &&
    ['width', 'height', 'minHeight', 'maxHeight', 'maxWidth', 'minWidth', 'padding', 'margin', 'borderRadius', 'fontSize', 'gap'].includes(key)
  ) {
    (target as any)[key] = `${strVal}px`;
    return;
  }

  (target as any)[key] = strVal;
}

/**
 * Parses a standard CSS string into a typed React.CSSProperties object
 */
function parseCssString(css: string): CSSProperties {
  const result: Record<string, string> = {};
  if (!css || typeof css !== 'string') return result;

  const declarations = css.split(';');
  for (const decl of declarations) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex <= 0) continue;

    const rawProp = trimmed.slice(0, colonIndex).trim();
    const rawVal = trimmed.slice(colonIndex + 1).trim();

    // Convert kebab-case to camelCase
    const camelProp = rawProp.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelProp] = rawVal;
  }

  return result as CSSProperties;
}
