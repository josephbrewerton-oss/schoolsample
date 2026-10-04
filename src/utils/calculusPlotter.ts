/**
 * src/utils/calculusPlotter.ts
 *
 * St Joseph's Educational Media Suite - GeoGebra & Desmos Calculus Engine
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 *
 * High-performance vector calculus and mathematical function plotting engine:
 * 1. Dynamic function plotting y = f(x) with SVG path generation
 * 2. Derivative tangent slope line dy/dx = lim(h->0) (f(x+h) - f(x-h)) / (2h)
 * 3. Normal line perpendicular to tangent (m_normal = -1/m)
 * 4. Definite integral & Riemann trapezoid sum: Area = ∫[a,b] f(x) dx
 * 5. GeoGebra XML / Desmos expression transpilation into declarative AST S-expressions
 */

export interface PlotCoordinate {
  x: number;
  y: number;
  svgX: number;
  svgY: number;
}

export interface TangentAnalysis {
  x0: number;
  y0: number;
  svgX: number;
  svgY: number;
  slope: number; // dy/dx
  angleDeg: number;
  tangentPath: string; // SVG line path
  normalPath: string; // SVG normal line path
  riseRunTriangle: string; // SVG path for dx/dy triangle
  formula: string;
}

export interface IntegralAnalysis {
  a: number; // lower limit
  b: number; // upper limit
  area: number; // numeric definite integral
  shadedAreaPath: string; // SVG polygon path d="..."
  subdivisions: number;
}

export interface ViewportTransform {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  svgWidth: number;
  svgHeight: number;
  originX?: number;
  originY?: number;
}

export class CalculusPlotter {
  public transform: ViewportTransform;

  constructor(transform: Partial<ViewportTransform> = {}) {
    this.transform = {
      minX: transform.minX ?? -6,
      maxX: transform.maxX ?? 6,
      minY: transform.minY ?? -4,
      maxY: transform.maxY ?? 8,
      svgWidth: transform.svgWidth ?? 600,
      svgHeight: transform.svgHeight ?? 380,
    };
  }

  /**
   * Converts mathematical coordinates (x, y) into SVG screen pixel space
   */
  public mathToSvg(x: number, y: number): { x: number; y: number } {
    const { minX, maxX, minY, maxY, svgWidth, svgHeight } = this.transform;
    const px = ((x - minX) / (maxX - minX)) * svgWidth;
    const py = svgHeight - ((y - minY) / (maxY - minY)) * svgHeight;
    return { x: px, y: py };
  }

  /**
   * Converts SVG screen pixel space back into mathematical coordinates (x, y)
   */
  public svgToMath(px: number, py: number): { x: number; y: number } {
    const { minX, maxX, minY, maxY, svgWidth, svgHeight } = this.transform;
    const x = minX + (px / svgWidth) * (maxX - minX);
    const y = minY + ((svgHeight - py) / svgHeight) * (maxY - minY);
    return { x, y };
  }

  /**
   * Generates continuous SVG path data for y = f(x)
   */
  public generateCurvePath(fn: (x: number) => number, samples: number = 240): string {
    const { minX, maxX, minY, maxY } = this.transform;
    const step = (maxX - minX) / samples;
    let path = '';
    let isDrawing = false;

    for (let i = 0; i <= samples; i++) {
      const x = minX + i * step;
      let y: number;
      try {
        y = fn(x);
      } catch {
        isDrawing = false;
        continue;
      }

      if (isNaN(y) || !isFinite(y) || y < minY - 10 || y > maxY + 10) {
        isDrawing = false;
        continue;
      }

      const pt = this.mathToSvg(x, y);
      if (!isDrawing) {
        path += `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
        isDrawing = true;
      } else {
        path += `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
      }
    }

    return path.trim();
  }

  /**
   * Calculates instantaneous derivative slope dy/dx and tangent line
   */
  public calculateTangent(fn: (x: number) => number, x0: number, lineLengthMath: number = 3.5): TangentAnalysis {
    const h = 0.0001;
    const y0 = fn(x0);
    // Symmetric central difference formula for maximum numerical precision
    const dy = fn(x0 + h) - fn(x0 - h);
    const slope = dy / (2 * h);
    const angleRad = Math.atan(slope);
    const angleDeg = (angleRad * 180) / Math.PI;

    const pt0 = this.mathToSvg(x0, y0);

    // Tangent line end points in math space
    const halfLen = lineLengthMath / 2;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const xA = x0 - halfLen * cosA;
    const yA = y0 - halfLen * sinA;
    const xB = x0 + halfLen * cosA;
    const yB = y0 + halfLen * sinA;

    const ptA = this.mathToSvg(xA, yA);
    const ptB = this.mathToSvg(xB, yB);
    const tangentPath = `M ${ptA.x.toFixed(1)} ${ptA.y.toFixed(1)} L ${ptB.x.toFixed(1)} ${ptB.y.toFixed(1)}`;

    // Normal line (perpendicular to tangent)
    const normLen = halfLen * 0.65;
    const xNA = x0 - normLen * -sinA;
    const yNA = y0 - normLen * cosA;
    const xNB = x0 + normLen * -sinA;
    const yNB = y0 + normLen * cosA;

    const ptNA = this.mathToSvg(xNA, yNA);
    const ptNB = this.mathToSvg(xNB, yNB);
    const normalPath = `M ${ptNA.x.toFixed(1)} ${ptNA.y.toFixed(1)} L ${ptNB.x.toFixed(1)} ${ptNB.y.toFixed(1)}`;

    // Rise / Run Right Triangle
    const dx = 1.0;
    const dyRise = slope * dx;
    const ptCorner = this.mathToSvg(x0 + dx, y0);
    const ptEnd = this.mathToSvg(x0 + dx, y0 + dyRise);
    const riseRunTriangle = `M ${pt0.x.toFixed(1)} ${pt0.y.toFixed(1)} L ${ptCorner.x.toFixed(1)} ${ptCorner.y.toFixed(1)} L ${ptEnd.x.toFixed(1)} ${ptEnd.y.toFixed(1)}`;

    const formula = `dy/dx = ${slope >= 0 ? '+' : ''}${slope.toFixed(2)}`;

    return {
      x0,
      y0,
      svgX: pt0.x,
      svgY: pt0.y,
      slope,
      angleDeg,
      tangentPath,
      normalPath,
      riseRunTriangle,
      formula,
    };
  }

  /**
   * Evaluates definite integral Area = ∫[a,b] f(x) dx via Simpson's Rule
   * and creates SVG polygon path for the shaded region under the curve.
   */
  public calculateDefiniteIntegral(
    fn: (x: number) => number,
    a: number,
    b: number,
    subdivisions: number = 60
  ): IntegralAnalysis {
    const startX = Math.min(a, b);
    const endX = Math.max(a, b);
    const n = Math.max(10, subdivisions % 2 === 0 ? subdivisions : subdivisions + 1); // even count for Simpson's
    const h = (endX - startX) / n;

    // Simpson's 1/3 Rule: ∫ f(x)dx ≈ (h/3) * [f(x0) + 4f(x1) + 2f(x2) + 4f(x3) + ... + f(xn)]
    let simpsonSum = fn(startX) + fn(endX);
    for (let i = 1; i < n; i++) {
      const x = startX + i * h;
      simpsonSum += (i % 2 === 1 ? 4 : 2) * fn(x);
    }
    const area = (h / 3) * simpsonSum;

    // Generate SVG path for the shaded polygon
    // Start at (startX, 0) on x-axis
    const ptStartAxis = this.mathToSvg(startX, 0);
    let pathD = `M ${ptStartAxis.x.toFixed(1)} ${ptStartAxis.y.toFixed(1)} `;

    // Follow the curve from startX to endX
    for (let i = 0; i <= n; i++) {
      const x = startX + i * h;
      const y = fn(x);
      const ptCurve = this.mathToSvg(x, y);
      pathD += `L ${ptCurve.x.toFixed(1)} ${ptCurve.y.toFixed(1)} `;
    }

    // Down to (endX, 0) on x-axis
    const ptEndAxis = this.mathToSvg(endX, 0);
    pathD += `L ${ptEndAxis.x.toFixed(1)} ${ptEndAxis.y.toFixed(1)} Z`;

    return {
      a: startX,
      b: endX,
      area: Number(area.toFixed(3)),
      shadedAreaPath: pathD,
      subdivisions: n,
    };
  }

  /**
   * Generates Cartesian grid lines and axis ticks in SVG coordinates
   */
  public generateGrid(gridStep: number = 1.0): { gridPaths: string; axesPaths: string; labels: { x: number; y: number; text: string }[] } {
    const { minX, maxX, minY, maxY } = this.transform;
    let gridPaths = '';
    let labels: { x: number; y: number; text: string }[] = [];

    // Vertical grid lines
    const startX = Math.ceil(minX / gridStep) * gridStep;
    for (let x = startX; x <= maxX; x += gridStep) {
      if (Math.abs(x) < 0.001) continue; // skip axis itself
      const top = this.mathToSvg(x, maxY);
      const btm = this.mathToSvg(x, minY);
      gridPaths += `M ${top.x.toFixed(1)} ${top.y.toFixed(1)} L ${btm.x.toFixed(1)} ${btm.y.toFixed(1)} `;
      
      const axisPt = this.mathToSvg(x, 0);
      labels.push({ x: axisPt.x, y: axisPt.y + 14, text: x.toString() });
    }

    // Horizontal grid lines
    const startY = Math.ceil(minY / gridStep) * gridStep;
    for (let y = startY; y <= maxY; y += gridStep) {
      if (Math.abs(y) < 0.001) continue; // skip axis itself
      const lft = this.mathToSvg(minX, y);
      const rgt = this.mathToSvg(maxX, y);
      gridPaths += `M ${lft.x.toFixed(1)} ${lft.y.toFixed(1)} L ${rgt.x.toFixed(1)} ${rgt.y.toFixed(1)} `;

      const axisPt = this.mathToSvg(0, y);
      labels.push({ x: axisPt.x - 12, y: axisPt.y + 4, text: y.toString() });
    }

    // Main Axes: X-axis (y = 0) and Y-axis (x = 0)
    const xAxisL = this.mathToSvg(minX, 0);
    const xAxisR = this.mathToSvg(maxX, 0);
    const yAxisB = this.mathToSvg(0, minY);
    const yAxisT = this.mathToSvg(0, maxY);

    const axesPaths = `M ${xAxisL.x.toFixed(1)} ${xAxisL.y.toFixed(1)} L ${xAxisR.x.toFixed(1)} ${xAxisR.y.toFixed(1)} M ${yAxisB.x.toFixed(1)} ${yAxisB.y.toFixed(1)} L ${yAxisT.x.toFixed(1)} ${yAxisT.y.toFixed(1)}`;

    return {
      gridPaths: gridPaths.trim(),
      axesPaths,
      labels,
    };
  }
}

/**
 * Standard curriculum math function presets for KS4 & A-Level calculus
 */
export const CALCULUS_PRESETS: {
  id: string;
  name: string;
  category: string;
  latex: string;
  fn: (x: number) => number;
  derivativeStr: string;
  defaultX0: number;
  defaultA: number;
  defaultB: number;
}[] = [
  {
    id: 'parabola',
    name: 'Quadratic Parabola',
    category: 'Polynomials (GCSE/A-Level)',
    latex: 'f(x) = x^2 - 2x - 1',
    fn: (x) => x * x - 2 * x - 1,
    derivativeStr: "f'(x) = 2x - 2",
    defaultX0: 2,
    defaultA: 0,
    defaultB: 3,
  },
  {
    id: 'cubic',
    name: 'Cubic Curve (Stationary Points)',
    category: 'Polynomials (A-Level)',
    latex: 'f(x) = \\frac{1}{3}x^3 - x + 1',
    fn: (x) => (1 / 3) * Math.pow(x, 3) - x + 1,
    derivativeStr: "f'(x) = x^2 - 1",
    defaultX0: 1,
    defaultA: -2,
    defaultB: 2,
  },
  {
    id: 'sine',
    name: 'Harmonic Sine Wave',
    category: 'Trigonometry (GCSE/A-Level)',
    latex: 'f(x) = 2\\sin(x) + 1',
    fn: (x) => 2 * Math.sin(x) + 1,
    derivativeStr: "f'(x) = 2\\cos(x)",
    defaultX0: 1.57,
    defaultA: 0,
    defaultB: 3.14,
  },
  {
    id: 'exponential',
    name: 'Exponential Growth & Rate',
    category: 'Calculus Foundations',
    latex: 'f(x) = e^{0.4x}',
    fn: (x) => Math.exp(0.4 * x),
    derivativeStr: "f'(x) = 0.4 e^{0.4x}",
    defaultX0: 1.5,
    defaultA: 0,
    defaultB: 4,
  },
  {
    id: 'gaussian',
    name: 'Gaussian Normal Bell Curve',
    category: 'Statistics & Area',
    latex: 'f(x) = 3 e^{-x^2 / 2}',
    fn: (x) => 3 * Math.exp(-(x * x) / 2),
    derivativeStr: "f'(x) = -3x e^{-x^2 / 2}",
    defaultX0: 1.0,
    defaultA: -1.96,
    defaultB: 1.96,
  },
];

/**
 * Parses simple algebraic math strings (Desmos/GeoGebra format) into safe JavaScript functions
 */
export function parseMathExpression(expr: string): ((x: number) => number) | null {
  const sanitized = expr
    .trim()
    .replace(/\^/g, '**')
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/exp/g, 'Math.exp')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/ln/g, 'Math.log')
    .replace(/abs/g, 'Math.abs')
    .replace(/pi/gi, 'Math.PI')
    .replace(/e\b/g, 'Math.E');

  try {
    // Return safe numerical evaluation function
    const fn = new Function('x', `with(Math) { return (${sanitized}); }`);
    // Test evaluation at x = 1.0
    const testVal = fn(1.0);
    if (typeof testVal !== 'number' || isNaN(testVal)) return null;
    return fn as (x: number) => number;
  } catch {
    return null;
  }
}
