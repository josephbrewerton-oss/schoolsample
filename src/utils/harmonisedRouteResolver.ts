// src/utils/harmonisedRouteResolver.ts
/**
 * Route-matching utility for St Joseph's Zero-404 Sovereign Router.
 * Reconciles non-catalog paths, legacy aliases, and fuzzy search queries
 * with the National Curriculum knowledge tree.
 */

export interface RouteResolution {
  targetPath: string;
  targetLabel: string;
  category: string;
  reason: string;
  subject?: string;
  keyStage?: string;
  unit?: string;
}

export function resolveHarmonisedRoute(rawPath: string, search: string = ''): RouteResolution {
  let clean = (rawPath || '/').toLowerCase();
  if (clean.startsWith('/schoolsample')) {
    clean = clean.replace('/schoolsample', '');
  }
  clean = clean.replace(/\/+$/, '') || '/';

  const fullQuery = (clean + ' ' + (search || '')).toLowerCase();

  // 1. Primary Curriculum Aliases
  if (
    clean === '/primary' ||
    clean.includes('ks1') ||
    clean.includes('ks2') ||
    clean.includes('years-1-6') ||
    clean.includes('primary-years')
  ) {
    if (fullQuery.includes('sci') || fullQuery.includes('plant')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 2&sub=Science&unit=Plant Nutrition',
        targetLabel: 'KS2 Science • Plant Nutrition (Practice Arena)',
        category: 'Primary Curriculum (Years 1–6)',
        reason: 'Matched Primary Science curriculum standard from route path.',
        keyStage: 'Key Stage 2',
        subject: 'Science',
        unit: 'Plant Nutrition',
      };
    }
    if (fullQuery.includes('math') || fullQuery.includes('fraction')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 2&sub=Mathematics&unit=Fractions and Decimals',
        targetLabel: 'KS2 Mathematics • Fractions and Decimals (Practice Arena)',
        category: 'Primary Curriculum (Years 1–6)',
        reason: 'Matched Primary Mathematics curriculum standard from route path.',
        keyStage: 'Key Stage 2',
        subject: 'Mathematics',
        unit: 'Fractions and Decimals',
      };
    }
    return {
      targetPath: '/learning-zone?stage=Key Stage 2',
      targetLabel: 'Key Stage 2 Primary Curriculum Lessons',
      category: 'Primary Curriculum (Years 1–6)',
      reason: 'Reconciled primary stage request to National Curriculum Learning Zone.',
      keyStage: 'Key Stage 2',
    };
  }

  // 2. Secondary Core & GCSE Aliases
  if (
    clean === '/secondary' ||
    clean.includes('ks3') ||
    clean.includes('ks4') ||
    clean.includes('gcse') ||
    clean.includes('years-7-11') ||
    clean.includes('secondary-years')
  ) {
    if (fullQuery.includes('bio') || fullQuery.includes('cell') || fullQuery.includes('respiration')) {
      return {
        targetPath: '/practice-lab?ks=Key Stage 3&sub=Science&unit=Cell Biology and Respiration',
        targetLabel: 'KS3 Science • Cell Biology & Respiration (Practice Arena)',
        category: 'Secondary Core (Years 7–11)',
        reason: 'Matched Secondary Biology standard from route path.',
        keyStage: 'Key Stage 3',
        subject: 'Science',
        unit: 'Cell Biology and Respiration',
      };
    }
    return {
      targetPath: '/learning-zone?stage=Key Stage 3',
      targetLabel: 'Key Stage 3 Secondary Curriculum Lessons',
      category: 'Secondary Core (Years 7–11)',
      reason: 'Reconciled secondary stage request to National Curriculum Learning Zone.',
      keyStage: 'Key Stage 3',
    };
  }

  // 3. Sixth Form & Advanced
  if (
    clean.includes('sixth-form') ||
    clean.includes('alevel') ||
    clean.includes('ks5') ||
    clean.includes('years-12-14')
  ) {
    return {
      targetPath: '/learning-zone?stage=Key Stage 4',
      targetLabel: 'Upper Secondary & Advanced Curriculum Lessons',
      category: 'Advanced Study (Years 12–14)',
      reason: 'Reconciled sixth-form request to Advanced Learning Zone.',
      keyStage: 'Key Stage 4',
    };
  }

  // 4. Practice Lab / Arena / Quiz / Challenges
  if (
    clean.includes('practice') ||
    clean.includes('arena') ||
    clean.includes('lab') ||
    clean.includes('quiz') ||
    clean.includes('question') ||
    clean.includes('challenge')
  ) {
    return {
      targetPath: '/practice-lab',
      targetLabel: '⚡ Interactive Practice Arena',
      category: 'Interactive Practice Engine',
      reason: 'Reconciled practice request to the on-device Practice Arena.',
    };
  }

  // 5. Lessons / Learning Zone / Curriculum
  if (
    clean.includes('lesson') ||
    clean.includes('learn') ||
    clean.includes('curriculum') ||
    clean.includes('stream') ||
    clean.includes('unit')
  ) {
    return {
      targetPath: '/learning-zone',
      targetLabel: '📖 Curriculum Lessons & S-Expressions',
      category: 'National Curriculum Directory',
      reason: 'Reconciled lesson inquiry to the Curriculum Learning Zone.',
    };
  }

  // 6. International Curriculum Studio / Importer
  if (
    clean.includes('studio') ||
    clean.includes('import') ||
    clean.includes('pack') ||
    clean.includes('csv') ||
    clean.includes('overseas')
  ) {
    return {
      targetPath: '/curriculum-studio',
      targetLabel: '🌍 International Curriculum Studio',
      category: 'Curriculum Authoring & Importer',
      reason: 'Reconciled pack/import inquiry to the Curriculum Studio.',
    };
  }

  // 7. Student Profile / Passport / Stars / Progress
  if (
    clean.includes('profile') ||
    clean.includes('passport') ||
    clean.includes('progress') ||
    clean.includes('star') ||
    clean.includes('certificate') ||
    clean.includes('badge')
  ) {
    return {
      targetPath: '/profile',
      targetLabel: '⭐ Student Progress & Mastery Passport',
      category: 'Learner Sovereignty & Records',
      reason: 'Reconciled progress query to local GDPR-safe Student Profile.',
    };
  }

  // 8. Settings & Accessibility
  if (
    clean.includes('setting') ||
    clean.includes('config') ||
    clean.includes('font') ||
    clean.includes('theme') ||
    clean.includes('contrast') ||
    clean.includes('dyslexic') ||
    clean.includes('ollama')
  ) {
    return {
      targetPath: '/settings',
      targetLabel: '⚙️ Settings & Device Configuration',
      category: 'Portal Configuration',
      reason: 'Reconciled configuration request to Portal Settings.',
    };
  }

  // 9. Blog / News / Updates
  if (clean.includes('blog') || clean.includes('news') || clean.includes('breakthrough')) {
    return {
      targetPath: '/news',
      targetLabel: 'School News & Technical Dispatches',
      category: 'Dispatches & Announcements',
      reason: 'Reconciled news inquiry to the School Newsroom.',
    };
  }

  // 10. Documentation / Intro / Overview / About
  if (clean.includes('doc') || clean.includes('intro') || clean.includes('about') || clean.includes('overview')) {
    return {
      targetPath: '/',
      targetLabel: "St Joseph's Portal Overview & Gateway",
      category: 'Core Portal Gateway',
      reason: 'Reconciled legacy overview path to the main application gateway.',
    };
  }

  // 11. Specific Subjects
  if (fullQuery.includes('math') || fullQuery.includes('algebra') || fullQuery.includes('arithmetic')) {
    return {
      targetPath: '/practice-lab?ks=Key Stage 2&sub=Mathematics',
      targetLabel: 'Mathematics Practice Arena',
      category: 'STEM Discipline',
      reason: 'Subject keyword matched Mathematics.',
      subject: 'Mathematics',
    };
  }
  if (fullQuery.includes('sci') || fullQuery.includes('biology') || fullQuery.includes('physics') || fullQuery.includes('chem')) {
    return {
      targetPath: '/practice-lab?ks=Key Stage 2&sub=Science',
      targetLabel: 'Science Practice Arena',
      category: 'STEM Discipline',
      reason: 'Subject keyword matched Science.',
      subject: 'Science',
    };
  }
  if (fullQuery.includes('faith') || fullQuery.includes('reconcil') || fullQuery.includes('mass') || fullQuery.includes('catholic')) {
    return {
      targetPath: '/learning-zone?stage=Key Stage 2&sub=Religious Formation',
      targetLabel: 'Parish & Faith Formation Lessons',
      category: 'Faith Formation',
      reason: 'Subject keyword matched Religious Formation.',
      subject: 'Religious Formation',
    };
  }

  // Default Universal Harmonisation Target
  return {
    targetPath: '/practice-lab',
    targetLabel: '⚡ Interactive Practice Arena',
    category: 'Universal Curriculum Hub',
    reason: 'Non-catalog route seamlessly resolved to the core Interactive Practice Lab.',
  };
}
