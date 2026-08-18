import { DomainManifest } from '../types/learning-ast';

export const COMMUNION_MANIFEST: DomainManifest = {
  meta: {
    domainId: 'communion-prep',
    portalName: 'Sacramental Formation Lab',
    badgeIcon: '🕊️',
    themeColor: '#7c3aed',
    tagline: 'First Holy Communion & Reconciliation Preparation',
  },
  tutorPersona: {
    name: 'Catechetical Guide',
    engineType: 'Catechetical',
    voicePitch: 0.95,
    voiceRate: 0.92,
  },
  cohorts: [
    { code: 'FHC-A', name: 'St. Peter Group', subtext: 'Year 3 Sacramental Class', defaultTopicId: 'euch-01' },
    { code: 'FHC-B', name: 'St. Mary Group', subtext: 'Family Catechesis', defaultTopicId: 'euch-01' },
  ],
  challenges: [
    {
      id: 'euch-01',
      cohortCode: 'FHC-A',
      topic: 'The Holy Eucharist',
      level: 1,
      prompt: 'What are the two outward signs of bread and wine transformed into during the Liturgy of the Eucharist?',
      expectedAnswer: 'body and blood',
      hint: 'Think about what Jesus said at the Last Supper: "This is my..."',
      explanation: 'Through Transubstantiation, the bread and wine become the Body, Blood, Soul, and Divinity of Christ.',
      starterTutorPrompt: 'Peace be with you! What special gift did Jesus give his disciples at the Last Supper?',
      semanticRules: [
        { keywords: ['jesus', 'christ', 'body', 'blood'], response: 'Exactly. In Holy Communion we receive Christ Himself, Truly Present.' },
        { keywords: ['supper', 'meal', 'bread'], response: 'Yes, at the Last Supper Christ instituted the Holy Sacrifice of the Mass.' },
      ],
    },
  ],
};