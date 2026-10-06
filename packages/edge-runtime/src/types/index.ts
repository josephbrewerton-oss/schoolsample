/**
 * St Joseph's Universal AST Grammar & Edge-Runtime Type Definitions
 * 
 * Unifies the S-Expression dialects across:
 * 1. Vector Media Player (:scene, :keyframes, :bindings, :subtitles, :checkpoints, :physics)
 * 2. Curriculum Question Engine (:route, :calc, :prompt, :options, :answer-key, :hint, :explanation)
 * 3. Structured Lesson Units (:lesson, :stage, :units, :steps)
 * 
 * Provides strong TypeScript contracts to prevent schema drift across runtime, player,
 * and external curriculum authoring tools.
 */

// ============================================================================
// 1. Core S-Expression Primitives & Generalized Node
// ============================================================================

export type SExprAtom = string | number | boolean | null;

export interface SExprNode {
  tag: string;
  props: Record<string, any>;
  children: (SExprNode | SExprAtom)[];
}

export type SExprAST = SExprNode | SExprAtom | SExprAST[];

// ============================================================================
// 2. Curriculum Question Dialect (:route, :calc, :prompt, :options, :answer-key)
// ============================================================================

/**
 * Standard multiple-choice and formative assessment question unit.
 * Used by the curriculum engine, question banks, and player checkpoint overlays.
 */
export interface AstQuestionNode {
  /** Curriculum hierarchy route or unit locator (e.g., 'maths/ks2/fractions/step-1') */
  route?: string;
  /** Mathematical calculation, formula, or algorithmic rule */
  calc?: string;
  /** Formative question prompt presented to the student */
  prompt: string;
  /** Set of distinct multiple-choice option strings */
  options: string[];
  /** Zero-based index of the correct answer (supports :answer-key and :answer) */
  answerKey: number;
  /** Alias for answerKey for cross-dialect compatibility with player checkpoints */
  answer?: number;
  /** Socratic hint or conceptual clue */
  hint?: string;
  /** In-depth pedagogical explanation of the correct solution */
  explanation?: string;
  /** Subject area or topic strand (e.g., 'mathematics', 'physics', 're') */
  category?: string;
  /** Educational stage or key stage (e.g., 'KS1', 'KS2', 'KS3', 'KS4') */
  stage?: string;
  /** Optional timeline timestamp if embedded as an active recall checkpoint (0.0 to 1.0) */
  t?: number;
  /** Checkpoint title when presented in player timeline */
  title?: string;
  /** Tagging metadata */
  tags?: string[];
}

/**
 * Backwards-compatible interface for legacy parsers expecting ParsedAstNode.
 */
export interface ParsedAstNode extends AstQuestionNode {
  route: string;
  prompt: string;
  options: string[];
  answerKey: number;
}

// ============================================================================
// 3. Player Keyframe Dialect (:keyframes (:t ... :title ... :rule ...))
// ============================================================================

export interface AstCameraOrbit {
  yaw?: number;
  pitch?: number;
  roll?: number;
  distance?: number;
  scale?: number;
  fov?: number;
}

export interface AstKeyframeNode {
  /** Normalized progress marker on the timeline (0.000 to 1.000) */
  t: number;
  /** Descriptive milestone or checkpoint label */
  title: string;
  /** Mathematical theorem, pedagogical rule, or physical observation */
  rule: string;
  /** Optional 3D camera orientation for spatial scenes */
  cam?: AstCameraOrbit;
  /** Optional audio narration script for this keyframe */
  narration?: string;
  /** Teacher notes or didactic instructions */
  notes?: string;
}

// ============================================================================
// 4. Player Attribute & 3D Binding Dialect (:bindings (:target ... :attr ... :expr ...))
// ============================================================================

export type AstBindingType = 
  | '2d-attr'
  | '3d-node'
  | '3d-line'
  | '3d-ring'
  | '3d-polygon';

export interface AstBindingNode {
  /** Binding classification */
  type?: AstBindingType;
  /** CSS selector targeting the SVG DOM element (e.g. '#pendulum-rod') */
  target: string;
  /** SVG or HTML attribute being animated (e.g., 'transform', 'opacity', 'cx', 'd') */
  attr?: string;
  /** Evaluated JavaScript mathematical expression f(t, Math) returning string or number */
  expr?: string;

  // 3D Spatial Node Attributes (:3d-node)
  x?: string | number;
  y?: string | number;
  z?: string | number;
  baseR?: number;

  // 3D Spatial Vector Line Attributes (:3d-line)
  x1?: string | number;
  y1?: string | number;
  z1?: string | number;
  x2?: string | number;
  y2?: string | number;
  z2?: string | number;
  cap1?: string;
  cap2?: string;

  // 3D Ring Attributes (:3d-ring)
  r?: string | number;
  cx?: string | number;
  cy?: string | number;
  cz?: string | number;
  tiltX?: string | number;
  tiltY?: string | number;
  tiltZ?: string | number;
  segments?: number;
  depthFog?: boolean;

  // 3D Polygon Attributes (:3d-polygon)
  pointsExpr?: string;
  cullBackface?: boolean;
}

// ============================================================================
// 5. Player Multilingual Subtitles Dialect (:subtitles (:start ... :end ... :en ...))
// ============================================================================

export interface AstSubtitleNode {
  /** Timestamp offset in seconds when subtitle begins */
  start: number;
  /** Timestamp offset in seconds when subtitle ends */
  end: number;
  /** English reference subtitle string */
  en: string;
  /** Localized translations */
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
  pl?: string;
  pt?: string;
  uk?: string;
  ar?: string;
  la?: string;
  [langCode: string]: string | number | undefined;
}

// ============================================================================
// 6. Zero-Bloat Micro-Physics Subsystem (:physics (:gravity ... :body ...))
// ============================================================================

export interface AstPhysicsBody {
  id?: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius?: number;
  mass?: number;
  bounce?: number;
  friction?: number;
  isStatic?: boolean;
}

export interface AstPhysicsConfig {
  gravity?: number;
  friction?: number;
  groundY?: number;
  bodies?: AstPhysicsBody[];
}

// ============================================================================
// 7. Full Parametric Scene Dialect (:scene :id ... :duration ...)
// ============================================================================

export interface AstSceneNode {
  /** Unique preset identifier (e.g., 'fractions', 'pythagoras', 'church-tour') */
  id: string;
  /** High-contrast human readable title */
  title: string;
  /** UK National Curriculum stage or topic */
  stage?: string;
  /** Playback loop duration in seconds */
  duration: number;
  /** Chronological pedagogical keyframes */
  keyframes?: AstKeyframeNode[];
  /** Continuous mathematical bindings driving SVG attributes at 60 FPS */
  bindings?: AstBindingNode[];
  /** Multilingual timed closed-captions */
  subtitles?: AstSubtitleNode[];
  /** Interactive socratic active recall checkpoints */
  checkpoints?: AstQuestionNode[];
  /** Zero-bloat micro-physics configuration */
  physics?: AstPhysicsConfig;
  /** Static SVG layout backdrop */
  svgTemplate?: string;
  /** Raw Lisp-style S-expression AST string */
  astSource?: string;
}

// ============================================================================
// 8. Curriculum Lesson Unit Dialect (:lesson :id ... :steps ...)
// ============================================================================

export interface AstLessonNode {
  id: string;
  title: string;
  stage: string;
  subject: string;
  summary?: string;
  questions?: AstQuestionNode[];
  interactiveScenes?: AstSceneNode[];
  prerequisites?: string[];
  learningOutcomes?: string[];
}

// ============================================================================
// 9. Unified AST Grammar Type & Type Guards
// ============================================================================

export type UnifiedAstUnit = AstQuestionNode | AstSceneNode | AstLessonNode;

/**
 * Type guard for Question / Assessment AST units
 */
export function isAstQuestion(node: any): node is AstQuestionNode {
  return Boolean(
    node &&
    typeof node === 'object' &&
    typeof node.prompt === 'string' &&
    Array.isArray(node.options) &&
    (typeof node.answerKey === 'number' || typeof node.answer === 'number')
  );
}

/**
 * Type guard for Vector Scene AST units
 */
export function isAstScene(node: any): node is AstSceneNode {
  return Boolean(
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    typeof node.duration === 'number' &&
    (Array.isArray(node.keyframes) || Array.isArray(node.bindings))
  );
}

/**
 * Type guard for Lesson Curriculum AST units
 */
export function isAstLesson(node: any): node is AstLessonNode {
  return Boolean(
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    typeof node.stage === 'string' &&
    (Array.isArray(node.questions) || Array.isArray(node.interactiveScenes))
  );
}

// ============================================================================
// 10. Engine Execution & Inference Pipeline Types
// ============================================================================

export type BackendTier = "chrome-nano" | "webrtc-daemon" | "rule-engine";

export interface EngineExecutionResult {
  output: string;
  source: BackendTier;
  ast?: UnifiedAstUnit;
  correctionsCount: number;
}

export interface EngineOptions {
  model?: string;
  channelName?: string;
}

