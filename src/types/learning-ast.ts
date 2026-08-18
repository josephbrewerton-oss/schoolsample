export interface SemanticRule {
  keywords: string[];
  response: string;
}

export interface Challenge {
  id: string;
  cohortCode: string;
  topic: string;
  level: number;
  prompt: string;
  expectedAnswer: string;
  hint: string;
  explanation: string;
  starterTutorPrompt: string;
  semanticRules: SemanticRule[];
}

export interface Cohort {
  code: string;
  name: string;
  subtext: string;
  defaultTopicId: string;
}

export interface TutorPersona {
  name: string;
  engineType: 'Socratic' | 'Catechetical' | 'Inquiry' | 'Diagnostic';
  voicePitch: number;
  voiceRate: number;
}

export interface DomainManifest {
  meta: {
    domainId: string;
    portalName: string;
    badgeIcon: string;
    themeColor: string; // e.g. '#2563eb' or '#7c3aed'
    tagline: string;
  };
  tutorPersona: TutorPersona;
  cohorts: Cohort[];
  challenges: Challenge[];
}

// --- Multi-Stream Catalog Index Types ---

export type LearningStream = 'academic' | 'faith' | 'cpd';

export interface CatalogItem {
  id: string;
  stream: LearningStream;
  keyStage?: string;
  subject: string;
  unit: string;
  title: string;
  badgeIcon: string;
  manifestPath: string; // e.g. '/manifests/lessons/states-of-matter.json'
}

export interface StreamCategory {
  id: LearningStream;
  title: string;
  description: string;
  icon: string;
}

export interface MasterCatalog {
  version: string;
  generatedAt: number;
  streams: StreamCategory[];
  items: CatalogItem[];
}