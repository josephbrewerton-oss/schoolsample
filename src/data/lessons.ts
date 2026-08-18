export interface Exercise {
  id: string;
  prompt: string;
  hint: string;
  expectedAnswer: string;
  explanation: string;
}

export interface LessonSection {
  heading: string;
  content: string[];
}

export interface RuntimeASTNode {
  type: 'RuntimeConfig';
  mode: 'inquiry' | 'socratic' | 'rigorous_debate';
  voiceProfile: string;
  starterPrompt: string;
  samplePrompts: string[];
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
  objectives: string[];
  sections: LessonSection[];
  exercise: Exercise;
  runtime: RuntimeASTNode;
}

export const LESSON_REGISTRY: readonly LessonASTNode[] = [
  {
    type: 'LessonNode',
    code: 'Y4-SCI-01',
    yearGroup: 'Primary (Years 1 - 6)',
    stage: 'KS2',
    subject: 'Science',
    title: 'Primary Discovery: Habitats & Food Webs',
    icon: '🌱',
    description: 'Explore living things, ecological classification, and energy transfer in nature.',
    objectives: [
      'Identify producers, primary consumers, and apex predators.',
      'Construct a food chain showing the flow of energy from sunlight.',
      'Predict how habitat changes impact local biodiversity.'
    ],
    sections: [
      {
        heading: '🌿 Energy Flow in an Ecosystem',
        content: [
          'All food chains start with a producer (plants) converting sunlight into glucose via photosynthesis.',
          'Herbivores consume plants, and carnivores consume herbivores. Energy decreases at each trophic level.'
        ]
      }
    ],
    exercise: {
      id: 'ex-y4-1',
      prompt: 'In a garden pond food chain (Algae → Tadpole → Water Beetle → Frog), which organism is the primary producer?',
      hint: 'Look for the organism that makes its own food using sunlight.',
      expectedAnswer: 'algae',
      explanation: 'Algae is the green photosynthetic organism that produces energy for the rest of the chain.'
    },
    runtime: {
      type: 'RuntimeConfig',
      mode: 'inquiry',
      voiceProfile: 'friendly_guide',
      starterPrompt: 'Hello! Ask me any question about habitats, animals, or food chains.',
      samplePrompts: [
        'Why are plants called producers?',
        'What happens if apex predators disappear?',
        'How do desert animals conserve water?'
      ]
    }
  },
  {
    type: 'LessonNode',
    code: 'Y10-MAT-01',
    yearGroup: 'Secondary (Years 7 - 11)',
    stage: 'GCSE',
    subject: 'Mathematics',
    title: 'GCSE Mathematics: Quadratic Equations & Factoring',
    icon: '📐',
    description: 'Solve quadratic equations using algebraic factoring, completing the square, and the quadratic formula.',
    objectives: [
      'Factorise quadratics in the form x² + bx + c = 0.',
      'Find the roots where the parabola intersects the x-axis (y = 0).',
      'Apply the Zero-Product Property to solve for x.'
    ],
    sections: [
      {
        heading: '📐 Factoring Method (a = 1)',
        content: [
          'To factor x² + bx + c = 0, find two numbers that multiply to c and add to b.',
          'For example, in x² + 5x + 6 = 0, 2 × 3 = 6 and 2 + 3 = 5, giving (x + 2)(x + 3) = 0.'
        ]
      }
    ],
    exercise: {
      id: 'ex-y10-1',
      prompt: 'Factorise and find the positive root of x² - 7x + 12 = 0. What is the highest value for x?',
      hint: 'Find two numbers that multiply to +12 and add to -7, then solve for x.',
      expectedAnswer: '4',
      explanation: '(x - 3)(x - 4) = 0 gives roots x = 3 and x = 4. The highest root is 4.'
    },
    runtime: {
      type: 'RuntimeConfig',
      mode: 'socratic',
      voiceProfile: 'math_coach',
      starterPrompt: "Let's factor x² + 5x + 6 = 0. What two numbers multiply to 6 and add to 5?",
      samplePrompts: [
        'How do I factorise when the x² coefficient is greater than 1?',
        'What does the discriminant (b² - 4ac) tell us?',
        'Step me through completing the square.'
      ]
    }
  },
  {
    type: 'LessonNode',
    code: 'Y12-ETH-01',
    yearGroup: 'Sixth Form (Years 12 - 14)',
    stage: 'A-Level',
    subject: 'Philosophy & Ethics',
    title: 'A-Level Ethics: Meta-Ethics & Autonomous AI Governance',
    icon: '⚖️',
    description: 'Evaluate normative ethical frameworks (Utilitarianism vs Deontology) applied to automated decision systems.',
    objectives: [
      'Compare Act Utilitarianism against Kantian Categorical Imperatives.',
      'Examine the moral liability problem in machine learning algorithms.',
      'Formulate structured dialectical counter-arguments.'
    ],
    sections: [
      {
        heading: '🏛️ Moral Agency & Autonomous Systems',
        content: [
          'Kantian deontology dictates that humans must never be treated purely as means to an end.',
          'Utilitarian frameworks attempt to minimize aggregate harm, raising profound dilemmas in automated triage and autonomous vehicles.'
        ]
      }
    ],
    exercise: {
      id: 'ex-y12-1',
      prompt: 'Which philosopher formulated the Categorical Imperative as a deontological duty?',
      hint: '18th-century German philosopher of the Enlightenment (Surname only or full name).',
      expectedAnswer: 'kant',
      explanation: 'Immanuel Kant formulated the Categorical Imperative in Groundwork of the Metaphysics of Morals (1785).'
    },
    runtime: {
      type: 'RuntimeConfig',
      mode: 'rigorous_debate',
      voiceProfile: 'academic_tutor',
      starterPrompt: 'Consider an autonomous vehicle crash algorithm. Which normative ethical framework do you defend?',
      samplePrompts: [
        'Defend Kantian ethics against utilitarian optimization.',
        'Why does algorithmic transparency matter in criminal sentencing?',
        'Can an AI ever be a moral agent?'
      ]
    }
  }
] as const;

export function resolveLessonByCode(query: string): LessonASTNode | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  // Exact code match
  const exact = LESSON_REGISTRY.find((node) => node.code.toLowerCase() === q);
  if (exact) return exact;

  // Flexible fuzzy match across code, stage, subject, title, and year group
  return LESSON_REGISTRY.find(
    (node) =>
      node.code.toLowerCase().includes(q) ||
      node.stage.toLowerCase().includes(q) ||
      node.subject.toLowerCase().includes(q) ||
      node.title.toLowerCase().includes(q) ||
      node.yearGroup.toLowerCase().includes(q)
  );
}