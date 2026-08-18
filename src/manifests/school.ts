import { DomainManifest } from '../types/learning-ast';

export const SCHOOL_MANIFEST: DomainManifest = {
  meta: {
    domainId: 'school-core',
    portalName: 'School AI Portal',
    badgeIcon: '🏫',
    themeColor: '#2563eb',
    tagline: 'Interactive Mastery Powered by Edge AI',
  },
  tutorPersona: {
    name: 'Curriculum Tutor',
    engineType: 'Socratic',
    voicePitch: 1.05,
    voiceRate: 0.98,
  },
  cohorts: [
    { code: '4B', name: 'Year 4 Science', subtext: 'Primary KS2', defaultTopicId: 'sci-01' },
    { code: '10M', name: 'Year 10 Maths', subtext: 'Secondary GCSE', defaultTopicId: 'mat-01' },
  ],
  challenges: [
    {
      id: 'sci-01',
      cohortCode: '4B',
      topic: 'Ecosystems & Energy',
      level: 1,
      prompt: 'In a pond food chain (Algae → Tadpole → Beetle → Frog), which organism is the primary producer?',
      expectedAnswer: 'algae',
      hint: 'Find the photosynthetic organism that makes food from light.',
      explanation: 'Algae produces energy from sunlight through photosynthesis.',
      starterTutorPrompt: 'Welcome to Science Level 1! What role do producers play in this pond ecosystem?',
      semanticRules: [
        { keywords: ['food', 'produce', 'make'], response: 'Spot on! Producers produce their own sugars via photosynthesis.' },
        { keywords: ['sun', 'light'], response: 'Exactly. Sunlight drives photosynthesis at the base of the chain.' },
      ],
    },
  ],
};