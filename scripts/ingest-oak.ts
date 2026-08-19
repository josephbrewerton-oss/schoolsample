import fs from 'fs';
import path from 'path';
import { MasterCatalog, CatalogItem } from '../src/types/learning-ast';

// Custom streams preserved alongside Oak
const CUSTOM_EXPANDED_CURRICULUM = [
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
        correctAnswer: ['body and blood of christ', 'body and blood', 'eucharist', 'real presence'],
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
        correctAnswer: ['consubstantial', 'homoousios', 'same substance'],
        hint: 'It means "of the same substance" or essence.',
        explanation: 'The Nicene Creed states the Son is consubstantial (homoousios) with the Father.',
        distractors: [
          { answerText: 'created', feedback: 'Catholic theology affirms the Son is "begotten, not made", avoiding the Arian heresy.' }
        ]
      }
    ]
  }
];

function getSubjectEmoji(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return '🧪';
  if (s.includes('math')) return '📐';
  if (s.includes('hist')) return '🏛️';
  if (s.includes('eng')) return '📖';
  if (s.includes('geog')) return '🌍';
  if (s.includes('rel') || s.includes('faith') || s.includes('re') || s.includes('catholic')) return '⛪';
  if (s.includes('comp') || s.includes('tech')) return '💻';
  if (s.includes('art')) return '🎨';
  if (s.includes('french') || s.includes('german') || s.includes('span')) return '🗣️';
  if (s.includes('cook') || s.includes('nutr')) return '🍳';
  if (s.includes('citizen')) return '⚖️';
  return '🎓';
}

function getSubjectColor(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return '#059669';
  if (s.includes('math')) return '#2563eb';
  if (s.includes('hist')) return '#991b1b';
  if (s.includes('eng')) return '#7c3aed';
  if (s.includes('geog')) return '#d97706';
  if (s.includes('rel') || s.includes('faith') || s.includes('re')) return '#b45309';
  if (s.includes('comp') || s.includes('tech')) return '#0284c7';
  if (s.includes('art')) return '#db2777';
  return '#1e293b';
}

function formatTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function buildSystem() {
  const localOakDir = path.join(process.cwd(), 'scripts', 'data', 'oak');
  const manifestsDir = path.join(process.cwd(), 'static', 'manifests');
  const lessonsDir = path.join(manifestsDir, 'lessons');

  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const catalogItems: CatalogItem[] = [];

  // 1. Ingest Custom Streams (Faith & CPD)
  for (const item of CUSTOM_EXPANDED_CURRICULUM) {
    const challenges = (item.questions || []).map((q: any, index: number) => {
      const distractors = q.distractors || [];
      const semanticRules: [string, string][] = distractors.map((d: any) => [
        d.answerText.toLowerCase().split(' ').filter((w: string) => w.length > 2).join(' '),
        d.feedback || `Misconception flagged regarding "${d.answerText}".`
      ]);

      const rawExpected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];

      return {
        i: `${item.slug}-q${index + 1}`,
        p: q.questionText,
        ip: (q as any).immersionQuestionText || undefined,
        a: rawExpected.join(' | '),
        h: q.hint,
        e: q.explanation,
        r: semanticRules,
      };
    });

    const manifest = {
      m: {
        d: item.slug,
        n: item.title,
        i: getSubjectEmoji(item.subjectTitle),
        c: getSubjectColor(item.subjectTitle),
        t: `${item.keyStageTitle} • ${item.subjectTitle}`,
        l: 'en-US'
      },
      tp: {
        n: `${item.subjectTitle} Guide`,
        e: 'Socratic',
        p: 1.0,
        r: 1.0
      },
      co: [
        {
          c: item.lessonCode || 'GEN-1',
          n: `${item.title} Cohort`,
          s: `${item.keyStageTitle} ${item.subjectTitle}`,
          d: `${item.slug}-q1`
        }
      ],
      c: challenges
    };

    const fileName = `${item.slug}.json`;
    fs.writeFileSync(path.join(lessonsDir, fileName), JSON.stringify(manifest), 'utf-8');

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

    console.log(`📦 Compiled Custom AST: ${fileName}`);
  }

  // 2. Ingest Offline Oak Bulk JSON Files from scripts/data/oak/
  if (fs.existsSync(localOakDir)) {
    const rawFiles = fs.readdirSync(localOakDir).filter(f => f.endsWith('.json'));
    console.log(`\n📂 Found ${rawFiles.length} local Oak bulk files. Compiling AST manifests...`);

    for (const file of rawFiles) {
      const filePath = path.join(localOakDir, file);
      const fileSlug = file.replace('.json', '');
      const [subjectSlug, phase] = fileSlug.split('-');
      const subjectTitle = formatTitle(subjectSlug);
      const phaseTitle = phase ? formatTitle(phase) : 'Standard';

      try {
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawContent);

        // Normalize units/lessons from Oak schema
        const lessons = Array.isArray(data) ? data : (data.lessons || data.units || data.data || []);
        if (!lessons.length) continue;

        // Group into concise interactive modules
        const maxModules = 12; // Index top units per subject to keep catalog balanced
        const selectedLessons = lessons.slice(0, maxModules);

        selectedLessons.forEach((lesson: any, lIdx: number) => {
          const lessonSlug = `oak-${fileSlug}-unit-${lIdx + 1}`;
          const lessonTitle = lesson.lessonTitle || lesson.unitTitle || lesson.title || `${subjectTitle} Unit ${lIdx + 1}`;
          const rawQuestions = lesson.questions || lesson.quiz || lesson.keyLearningPoints || [];

          const challenges = rawQuestions.slice(0, 8).map((q: any, qIdx: number) => {
            const prompt = typeof q === 'string' ? q : (q.question || q.prompt || q.title || 'Analyze the concept');
            const answers = q.answers || q.correctAnswers || [q.answer || 'Standard Definition'];
            const distractors = q.distractors || q.misconceptions || [];

            const semanticRules: [string, string][] = Array.isArray(distractors) 
              ? distractors.map((d: any) => [
                  typeof d === 'string' ? d.toLowerCase() : (d.text || d.answer || '').toLowerCase(),
                  typeof d === 'string' ? `Note the definition for: ${d}` : (d.feedback || d.misconception || 'Review core terms.')
                ])
              : [];

            return {
              i: `${lessonSlug}-q${qIdx + 1}`,
              p: prompt,
              a: Array.isArray(answers) ? answers.join(' | ') : String(answers),
              h: q.hint || `Focus on foundational concepts in ${subjectTitle}.`,
              e: q.explanation || `Refer to Key Stage ${phaseTitle} guidance.`,
              r: semanticRules
            };
          });

          if (!challenges.length) {
            challenges.push({
              i: `${lessonSlug}-q1`,
              p: `What is the primary concept addressed in ${lessonTitle}?`,
              a: lessonTitle,
              h: `Consider the unit title and context.`,
              e: `Core focus: ${lessonTitle}`,
              r: []
            });
          }

          const manifest = {
            m: {
              d: lessonSlug,
              n: lessonTitle,
              i: getSubjectEmoji(subjectTitle),
              c: getSubjectColor(subjectTitle),
              t: `${phaseTitle} • ${subjectTitle}`,
              l: 'en-US'
            },
            tp: {
              n: `${subjectTitle} Tutor`,
              e: 'Socratic',
              p: 1.0,
              r: 1.0
            },
            co: [
              {
                c: `OAK-${fileSlug.toUpperCase()}-${lIdx + 1}`,
                n: `${lessonTitle} Cohort`,
                s: `${phaseTitle} ${subjectTitle}`,
                d: `${lessonSlug}-q1`
              }
            ],
            c: challenges
          };

          const outFileName = `${lessonSlug}.json`;
          fs.writeFileSync(path.join(lessonsDir, outFileName), JSON.stringify(manifest), 'utf-8');

          catalogItems.push({
            id: lessonSlug,
            stream: 'academic',
            keyStage: phaseTitle.toUpperCase(),
            subject: subjectTitle,
            unit: lessonTitle,
            title: lessonTitle,
            badgeIcon: getSubjectEmoji(subjectTitle),
            manifestPath: `/manifests/lessons/${outFileName}`,
          });
        });

        console.log(`✅ Processed ${file} (${selectedLessons.length} modular manifests generated)`);
      } catch (err: any) {
        console.warn(`⚠️ Error compiling ${file}: ${err.message}`);
      }
    }
  } else {
    console.warn(`⚠️ Oak folder not found at ${localOakDir}`);
  }

  // 3. Write Master Catalog
  const masterCatalog: MasterCatalog = {
    version: '1.2.0-compact',
    generatedAt: Date.now(),
    streams: [
      { id: 'academic', title: 'National Curriculum (Oak)', description: 'Key Stage 1–4 Academic Mastery', icon: '🎓' },
      { id: 'faith', title: 'Parish & Faith Formation', description: 'Catechesis and Sacramental Preparation', icon: '⛪' },
      { id: 'cpd', title: 'Professional & CPD', description: 'Staff training & vocational standards', icon: '💼' },
    ],
    items: catalogItems,
  };

  fs.writeFileSync(path.join(manifestsDir, 'catalog.json'), JSON.stringify(masterCatalog, null, 2), 'utf-8');
  console.log(`\n🚀 Ingestion Complete! Generated ${catalogItems.length} interactive manifests in static/manifests/`);
}

buildSystem();