// src/components/MathRenderer.tsx
import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Converts simple procedural math notation into LaTeX format.
 * e.g., "3/4" -> "\frac{3}{4}", "1 1/2" -> "1\frac{1}{2}"
 */
function normalizeMathText(raw: string): string {
  if (!raw) return '';

  // Check if string already contains LaTeX commands or delimiters
  if (raw.includes('\\') || raw.includes('$')) {
    return raw;
  }

  // Standalone mixed fraction: "2 3/4" -> "$2\frac{3}{4}$"
  const mixedFractionRegex = /^([+-]?\d+)\s+(\d+)\/(\d+)$/;
  const mixedMatch = raw.trim().match(mixedFractionRegex);
  if (mixedMatch) {
    return `$${mixedMatch[1]}\\frac{${mixedMatch[2]}}{${mixedMatch[3]}}$`;
  }

  // Standalone fraction: "3/4" or "-5/8" -> "$\frac{3}{4}$"
  const singleFractionRegex = /^([+-]?\d+)\/(\d+)$/;
  const fracMatch = raw.trim().match(singleFractionRegex);
  if (fracMatch) {
    return `$${fracMatch[1].startsWith('-') ? '-' : ''}\\frac{${fracMatch[1].replace('-', '')}}{${fracMatch[2]}}$`;
  }

  // Square roots like "sqrt(49)" -> "$\sqrt{49}$"
  if (raw.includes('sqrt(')) {
    return raw.replace(/sqrt\(([^)]+)\)/g, '$\\sqrt{$1}$');
  }

  return raw;
}

/**
 * Safely renders a LaTeX snippet into HTML using KaTeX.
 */
function renderKatexHtml(tex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch (err) {
    return tex;
  }
}

/**
 * MathRenderer parses text with inline ($...$) or block ($$...$$) math,
 * rendering crisp typographic equations via KaTeX without layout shift.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  text,
  inline = true,
  className = '',
  style,
}) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    const normalized = normalizeMathText(text);

    // If no math markers exist, return simple text
    if (!normalized.includes('$')) {
      return <span>{text}</span>;
    }

    // Split text by display math ($$...$$) and inline math ($...$)
    // Regex matches $$...$$ or $...$
    const tokens = normalized.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);

    return tokens.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const tex = part.slice(2, -2).trim();
        const html = renderKatexHtml(tex, true);
        return (
          <span
            key={index}
            className="katex-display-wrapper inline-block my-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const tex = part.slice(1, -1).trim();
        const html = renderKatexHtml(tex, false);
        return (
          <span
            key={index}
            className="katex-inline-wrapper inline-block align-middle mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [text]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag className={`math-renderer ${className}`} style={style}>
      {renderedContent}
    </Tag>
  );
};

export default MathRenderer;
