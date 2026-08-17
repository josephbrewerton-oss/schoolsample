export interface RuntimeASTNode {
  type: 'RuntimeConfig';
  mode: 'inquiry' | 'socratic' | 'rigorous_debate';
  voiceProfile: string;
  starterPrompt: string;
}

export interface LessonASTNode {
  type: 'LessonNode';
  code: string;
  yearGroup: 'Primary (Years 1 - 6)' | 'Secondary (Years 7 - 11)' | 'Sixth Form (Years 12 - 14)';
  stage: 'KS1' | 'KS2' | 'KS3' | 'GCSE' | 'A-Level';
  subject: string;
  title: string;
  icon: string;
  description: string;
  bodyAst?: Record<string, unknown>;
  runtime: RuntimeASTNode;
}

export const LESSON_REGISTRY: readonly LessonASTNode[] = [
  {
    type: 'LessonNode',
    code: 'Y4-SCI-01',
    yearGroup: 'Primary (Years 1 - 6)',
    stage: 'KS2',
    subject: 'Science',
    title: 'Primary Discovery & Inquiry Lab',
    icon: '🌱',
    description: 'Explore living things, habitats, and ecological relationships with your voice tutor.',
    runtime: {
      type: 'RuntimeConfig',
      mode: 'inquiry',
      voiceProfile: 'friendly_guide',
      starterPrompt: 'What habitat would you like to investigate today?',
    },
  },
  {
    type: 'LessonNode',
    code: 'Y10-MAT-01',
    yearGroup: 'Secondary (Years 7 - 11)',
    stage: 'GCSE',
    subject: 'Mathematics',
    title: 'Quadratic Equations & Factoring',
    icon: '📐',
    description: 'Master solving quadratics by factoring, completing the square, and using the formula.',
    runtime: {
      type: 'RuntimeConfig',
      mode: 'socratic',
      voiceProfile: 'math_coach',
      starterPrompt: "Let's factor x² + 5x + 6 = 0. What two numbers multiply to 6 and add to 5?",
    },
  },
  {
    type: 'LessonNode',
    code: 'Y12-ETH-01',
    yearGroup: 'Sixth Form (Years 12 - 14)',
    stage: 'A-Level',
    subject: 'Philosophy & Ethics',
    title: 'Meta-Ethics and Autonomous AI Systems',
    icon: '⚖️',
    description: 'Critically analyze normative ethical frameworks applied to artificial intelligence.',
    runtime: {
      type: 'RuntimeConfig',
      mode: 'rigorous_debate',
      voiceProfile: 'academic_tutor',
      starterPrompt: 'Consider the ethical implications of autonomous decision-making.',
    },
  },
] as const;

export function resolveLessonByCode(query: string): LessonASTNode | undefined {
  const q = query.trim().toUpperCase();
  if (!q) return undefined;

  // 1. Exact match (e.g., "Y4-SCI-01")
  const exact = LESSON_REGISTRY.find((node) => node.code.toUpperCase() === q);
  if (exact) return exact;

  // 2. Prefix or keyword match (e.g., "y4", "math", "ks2")
  return LESSON_REGISTRY.find(
    (node) =>
      node.code.toUpperCase().includes(q) ||
      node.stage.toUpperCase().includes(q) ||
      node.subject.toUpperCase().includes(q) ||
      node.yearGroup.toUpperCase().includes(q)
  );
}