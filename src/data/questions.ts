export type Discipline = 'all' | 'science' | 'maths' | 'ethics';

export interface QuestionNode {
  id: string;
  discipline: 'science' | 'maths' | 'ethics';
  level: number; // 1 (Introductory) to 5 (Advanced)
  topic: string;
  badge: string;
  question: string;
  expectedAnswer: string;
  hint: string;
  explanation: string;
  tutorStarter: string;
  rules: Array<{
    keywords: string[];
    response: string;
  }>;
}

export const QUESTION_STREAM: QuestionNode[] = [
  {
    id: 'sci-01',
    discipline: 'science',
    level: 1,
    topic: 'Habitats & Food Chains',
    badge: '🌱 KS2 Science',
    question: 'In a garden pond food chain (Algae → Tadpole → Water Beetle → Frog), which organism is the primary producer?',
    expectedAnswer: 'algae',
    hint: 'Look for the organism that makes its own food using sunlight.',
    explanation: 'Algae is the green photosynthetic organism producing energy for the entire chain.',
    tutorStarter: 'Welcome to Science Level 1! What role do producers play in this pond ecosystem?',
    rules: [
      {
        keywords: ['sun', 'light', 'energy'],
        response: 'Sunlight is the origin of all energy in this ecosystem. Algae captures this to synthesize sugars.'
      },
      {
        keywords: ['food', 'produce', 'make', 'glucose'],
        response: 'Spot on! Producers produce their own food, forming the foundational base for consumers.'
      }
    ]
  },
  {
    id: 'mat-01',
    discipline: 'maths',
    level: 3,
    topic: 'Quadratic Equations',
    badge: '📐 GCSE Maths',
    question: 'Factorise and find the highest positive root of x² - 7x + 12 = 0. What is the value of x?',
    expectedAnswer: '4',
    hint: 'Find two numbers that multiply to +12 and add to -7, then solve (x - a)(x - b) = 0.',
    explanation: '(x - 3)(x - 4) = 0 gives roots x = 3 and x = 4. The highest root is 4.',
    tutorStarter: 'Let us solve x² - 7x + 12 = 0. What two numbers multiply to 12 and add to -7?',
    rules: [
      {
        keywords: ['3', '4', 'factor'],
        response: 'Exactly. -3 and -4 multiply to +12 and add to -7. Thus roots are x=3 and x=4.'
      },
      {
        keywords: ['formula', 'discriminant'],
        response: 'The quadratic formula works here too: b² - 4ac = 49 - 48 = 1, giving roots (7 ± 1)/2.'
      }
    ]
  },
  {
    id: 'eth-01',
    discipline: 'ethics',
    level: 5,
    topic: 'Deontological Governance',
    badge: '⚖️ A-Level Ethics',
    question: 'Which philosopher formulated the Categorical Imperative as a universal moral duty?',
    expectedAnswer: 'kant',
    hint: '18th-century German philosopher of the Enlightenment (Surname only or full name).',
    explanation: 'Immanuel Kant established the Categorical Imperative in Groundwork of the Metaphysics of Morals (1785).',
    tutorStarter: 'Welcome to A-Level Ethics. How does a duty-based framework evaluate autonomous algorithms?',
    rules: [
      {
        keywords: ['kant', 'duty', 'imperative'],
        response: 'Kant asserts moral duties are absolute imperatives, forbidding treating humans merely as instruments.'
      },
      {
        keywords: ['utilitarian', 'harm', 'consequence'],
        response: 'Utilitarianism focuses on minimizing aggregate harm, which directly clashes with Kantian rights.'
      }
    ]
  }
];