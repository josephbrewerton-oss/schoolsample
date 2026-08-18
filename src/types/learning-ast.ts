export interface DomainManifest {
  meta: {
    domainId: string;
    portalName: string;
    badgeIcon: string;
    themeColor: string; // e.g. '#2563eb' or '#7c3aed'
    tagline: string;
  };
  tutorPersona: {
    name: string;
    engineType: 'Socratic' | 'Catechetical' | 'Inquiry' | 'Diagnostic';
    voicePitch: number;
    voiceRate: number;
  };
  cohorts: Array<{
    code: string;
    name: string;
    subtext: string;
    defaultTopicId: string;
  }>;
  challenges: Array<{
    id: string;
    cohortCode: string;
    topic: string;
    level: number;
    prompt: string;
    expectedAnswer: string;
    hint: string;
    explanation: string;
    starterTutorPrompt: string;
    semanticRules: Array<{
      keywords: string[];
      response: string;
    }>;
  }>;
}