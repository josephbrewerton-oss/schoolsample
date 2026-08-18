import fs from 'fs';
import path from 'path';
import { DomainManifest, Challenge, MasterCatalog, CatalogItem } from '../src/types/learning-ast';

function getSubjectEmoji(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci')) return '🧪';
  if (s.includes('math')) return '📐';
  if (s.includes('hist')) return '🏛️';
  if (s.includes('eng')) return '📖';
  if (s.includes('geog')) return '🌍';
  if (s.includes('rel') || s.includes('faith') || s.includes('re')) return '⛪';
  return '🎓';
}

function getSubjectColor(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci')) return '#059669';
  if (s.includes('math')) return '#2563eb';
  if (s.includes('hist')) return '#991b1b';
  if (s.includes('eng')) return '#7c3aed';
  if (s.includes('geog')) return '#d97706';
  if (s.includes('rel') || s.includes('faith') || s.includes('re')) return '#b45309';
  return '#1e293b';
}

// Extended Multi-Subject Curriculum Dataset
const EXPANDED_CURRICULUM = [
  // --- ACADEMIC STREAM ---
  {
    slug: 'states-of-matter',
    stream: 'academic',
    title: 'States of Matter & Particle Arrangement',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3',
    subjectTitle: 'Science',
    unitTitle: 'Matter & Solutions',
    lessonCode: 'OAK-SCI3',
    questions: [
      {
        questionText: 'In which state of matter are particles arranged in a regular, tightly packed lattice?',
        correctAnswer: 'solid',
        hint: 'Particles vibrate about fixed positions and cannot move past one another.',
        explanation: 'In solids, particles are tightly bound in fixed, regular structures.',
        distractors: [
          { answerText: 'liquid', feedback: 'Liquid particles are close together but move randomly over each other.' },
          { answerText: 'gas', feedback: 'Gas particles are widely spaced and move rapidly in all directions.' }
        ]
      },
      {
        questionText: 'What process describes a solid turning directly into a gas without becoming a liquid?',
        correctAnswer: 'sublimation',
        hint: 'Dry ice (solid CO2) is a famous example of this phase change.',
        explanation: 'Sublimation occurs when thermal energy bypasses the liquid state entirely.',
        distractors: [
          { answerText: 'evaporation', feedback: 'Evaporation is the transition from liquid to gas at the surface.' },
          { answerText: 'condensation', feedback: 'Condensation is gas changing into a liquid.' }
        ]
      }
    ]
  },
  {
    slug: 'angles-triangles',
    stream: 'academic',
    title: 'Angles in Triangles and Polygons',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3',
    subjectTitle: 'Maths',
    unitTitle: 'Geometry & Angles',
    lessonCode: 'OAK-MTH3',
    questions: [
      {
        questionText: 'What is the sum of interior angles in any Euclidean triangle?',
        correctAnswer: '180',
        hint: 'It equals a straight line in degrees.',
        explanation: 'The interior angles of every standard triangle sum exactly to 180°.',
        distractors: [
          { answerText: '360', feedback: '360° is the sum of interior angles of a quadrilateral.' },
          { answerText: '90', feedback: '90° is a single right angle.' }
        ]
      },
      {
        questionText: 'In an isosceles triangle, how many angles are guaranteed to be equal in measure?',
        correctAnswer: '2',
        hint: 'An equilateral has 3 equal angles, but an isosceles has fewer.',
        explanation: 'An isosceles triangle has two equal sides and two equal base angles.',
        distractors: [
          { answerText: '3', feedback: 'A triangle with 3 equal angles is an equilateral triangle.' },
          { answerText: '0', feedback: 'A triangle with no equal angles is a scalene triangle.' }
        ]
      }
    ]
  },
  {
    slug: 'romans-britain',
    stream: 'academic',
    title: 'Roman Britain & Boudicca’s Revolt',
    keyStage: 'KS2',
    keyStageTitle: 'Key Stage 2',
    subjectTitle: 'History',
    unitTitle: 'Roman Empire Impact',
    lessonCode: 'OAK-HIS2',
    questions: [
      {
        questionText: 'Which Iceni queen led a major rebellion against Roman rule in Britain in AD 60 or 61?',
        correctAnswer: 'boudicca',
        hint: 'Her statues now stand near Westminster Pier in London.',
        explanation: 'Queen Boudicca led the Iceni tribe against Roman occupation, burning Camulodunum (Colchester) and Londinium.',
        distractors: [
          { answerText: 'cleopatra', feedback: 'Cleopatra was the last active ruler of the Ptolemaic Kingdom of Egypt.' },
          { answerText: 'cartimandua', feedback: 'Cartimandua was queen of the Brigantes who allied with Rome.' }
        ]
      }
    ]
  },
  {
    slug: 'cell-biology',
    stream: 'academic',
    title: 'Eukaryotic vs Prokaryotic Cell Structures',
    keyStage: 'KS4',
    keyStageTitle: 'Key Stage 4 (GCSE)',
    subjectTitle: 'Science',
    unitTitle: 'Cell Biology',
    lessonCode: 'OAK-BIO4',
    questions: [
      {
        questionText: 'Which organelle is known as the powerhouse of the cell where aerobic respiration occurs?',
        correctAnswer: 'mitochondria',
        hint: 'It produces ATP energy molecules for biological reactions.',
        explanation: 'Mitochondria generate most of the chemical energy needed to power cellular biochemical reactions.',
        distractors: [
          { answerText: 'ribosome', feedback: 'Ribosomes are responsible for protein synthesis.' },
          { answerText: 'nucleus', feedback: 'The nucleus contains the cell’s genetic material (DNA).' }
        ]
      }
    ]
  },

  // --- FAITH & FORMATION STREAM ---
  {
    slug: 'first-holy-communion',
    stream: 'faith',
    title: 'The Sacraments of Initiation: The Eucharist',
    keyStage: 'Parish',
    keyStageTitle: 'Primary Preparation',
    subjectTitle: 'Religious Formation',
    unitTitle: 'Sacramental Life',
    lessonCode: 'FHC-A',
    questions: [
      {
        questionText: 'What is the outward sign and theological effect of Holy Communion?',
        correctAnswer: 'body and blood of christ',
        hint: 'Think about the Last Supper and the words of consecration.',
        explanation: 'The Eucharist is the source and summit of Christian life, representing the Real Presence (CCC 1324).',
        distractors: [
          { answerText: 'just bread and wine', feedback: 'Catholic doctrine teaches transubstantiation—the bread and wine become the Real Presence of Christ.' }
        ]
      }
    ]
  },
  {
    slug: 'gcse-re-trinity',
    stream: 'faith',
    title: 'The Nature of God: The Holy Trinity',
    keyStage: 'GCSE',
    keyStageTitle: 'GCSE Religious Studies',
    subjectTitle: 'Catholic Christianity',
    unitTitle: 'Beliefs & Teachings',
    lessonCode: 'RE-TRINITY',
    questions: [
      {
        questionText: 'How does the Nicene Creed describe the relationship between God the Father and God the Son?',
        correctAnswer: 'consubstantial',
        hint: 'It means "of the same substance" or essence.',
        explanation: 'The Nicene Creed states the Son is consubstantial (homoousios) with the Father.',
        distractors: [
          { answerText: 'created', feedback: 'Catholic theology affirms the Son is "begotten, not made", avoiding the Arian heresy.' }
        ]
      }
    ]
  }
];

function buildSystem() {
  const manifestsDir = path.join(process.cwd(), 'static', 'manifests');
  const lessonsDir = path.join(manifestsDir, 'lessons');

  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const catalogItems: CatalogItem[] = [];

  for (const item of EXPANDED_CURRICULUM) {
    const rawQuestions = item.questions || [];

// Replace the challenge mapping in scripts/ingest-oak.ts
const challenges: Challenge[] = rawQuestions.map((q: any, index: number) => {
  const distractors = q.distractors || [];
  const semanticRules = distractors.map((d: any) => ({
    keywords: d.answerText.toLowerCase().split(' ').filter((w: string) => w.length > 2),
    response: d.feedback || `Misconception flagged regarding "${d.answerText}".`,
  }));

  // Support array of acceptable answers or extract key terms
  const rawExpected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];

  return {
    id: `${item.slug}-q${index + 1}`,
    cohortCode: item.lessonCode || 'GEN-1',
    topic: item.unitTitle,
    level: index + 1,
    prompt: q.questionText,
    expectedAnswer: rawExpected.join(' | '),
    hint: q.hint,
    explanation: q.explanation,
    starterTutorPrompt: `Let's tackle this concept from ${item.title}: ${q.questionText}`,
    semanticRules,
  };
});

    const manifest: DomainManifest = {
      meta: {
        domainId: item.slug,
        portalName: item.title,
        badgeIcon: getSubjectEmoji(item.subjectTitle),
        themeColor: getSubjectColor(item.subjectTitle),
        tagline: `${item.keyStageTitle} • ${item.subjectTitle}`,
      },
      tutorPersona: {
        name: `${item.subjectTitle} Guide`,
        engineType: 'Socratic',
        voicePitch: 1.0,
        voiceRate: 1.0,
      },
      cohorts: [
        {
          code: item.lessonCode || 'GEN-1',
          name: `${item.title} Cohort`,
          subtext: `${item.keyStageTitle} ${item.subjectTitle}`,
          defaultTopicId: `${item.slug}-q1`,
        },
      ],
      challenges,
    };

    const fileName = `${item.slug}.json`;
    fs.writeFileSync(path.join(lessonsDir, fileName), JSON.stringify(manifest, null, 2), 'utf-8');

    catalogItems.push({
      id: item.slug,
      stream: item.stream as any,
      keyStage: item.keyStage,
      subject: item.subjectTitle,
      unit: item.unitTitle,
      title: item.title,
      badgeIcon: getSubjectEmoji(item.subjectTitle),
      manifestPath: `/manifests/lessons/${fileName}`,
    });

    console.log(`📦 Compiled AST Lesson: ${fileName}`);
  }

  const masterCatalog: MasterCatalog = {
    version: '1.1.0',
    generatedAt: Date.now(),
    streams: [
      { id: 'academic', title: 'National Curriculum (Oak)', description: 'Key Stage 1–4 Academic Mastery', icon: '🎓' },
      { id: 'faith', title: 'Parish & Faith Formation', description: 'Catechesis and Sacramental Preparation', icon: '⛪' },
      { id: 'cpd', title: 'Professional & CPD', description: 'Staff training & vocational standards', icon: '💼' },
    ],
    items: catalogItems,
  };

  fs.writeFileSync(path.join(manifestsDir, 'catalog.json'), JSON.stringify(masterCatalog, null, 2), 'utf-8');
  console.log(`\n🚀 Ingestion Complete! Catalog updated at static/manifests/catalog.json (${catalogItems.length} modules indexed across multiple streams)`);
}

buildSystem();