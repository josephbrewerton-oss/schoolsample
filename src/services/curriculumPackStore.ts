// src/services/curriculumPackStore.ts
import { StandardStage, StandardSubject, StandardTopic } from '../curriculum/curriculumAdapter';
import { CurriculumTopicKnowledge } from '../data/oakCurriculumKnowledge';

export interface CustomQuestionDistractor {
  answerText: string;
  feedback: string;
}

export interface CustomQuestionItem {
  questionText: string;
  correctAnswer: string[];
  hint: string;
  explanation: string;
  distractors: CustomQuestionDistractor[];
}

export interface CustomCurriculumLesson {
  id: string; // unique slug
  stageTitle: string;
  subjectTitle: string;
  topicTitle: string;
  unitTitle?: string;
  axiom: string;
  hook?: string;
  guidedStep?: string;
  trap?: string;
  socraticCheck?: string;
  questions: CustomQuestionItem[];
}

export interface CustomCurriculumPack {
  id: string;
  title: string;
  countryOrRegion: string;
  authorOrMinistry: string;
  description: string;
  version: string;
  installedAt: number;
  stages: Record<string, {
    id: string;
    title: string;
    subjects: Array<{
      id: string;
      title: string;
      topics: Array<{
        id: string;
        title: string;
      }>;
    }>;
  }>;
  lessons: CustomCurriculumLesson[];
}

const STORAGE_KEY_CUSTOM_PACKS = 'stj_custom_curriculum_packs_v1';
const STORAGE_KEY_ACTIVE_PACK_ID = 'stj_active_custom_curriculum_pack';

// In-memory cache for fast synchronous lookups
let inMemoryPacksCache: CustomCurriculumPack[] | null = null;

export function getInstalledCurriculumPacks(): CustomCurriculumPack[] {
  if (typeof window === 'undefined') return [];
  if (inMemoryPacksCache) return inMemoryPacksCache;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PACKS);
    if (!raw) return [];
    inMemoryPacksCache = JSON.parse(raw);
    return inMemoryPacksCache || [];
  } catch (err) {
    console.warn('[curriculumPackStore] Failed to load custom packs:', err);
    return [];
  }
}

export function saveCurriculumPack(pack: CustomCurriculumPack): void {
  if (typeof window === 'undefined') return;
  const existing = getInstalledCurriculumPacks().filter((p) => p.id !== pack.id);
  const updated = [pack, ...existing];
  inMemoryPacksCache = updated;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_ACTIVE_PACK_ID, pack.id);
    window.dispatchEvent(new Event('curriculum_packs_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[curriculumPackStore] Storage error saving pack:', err);
  }
}

export function removeCurriculumPack(packId: string): void {
  if (typeof window === 'undefined') return;
  const filtered = getInstalledCurriculumPacks().filter((p) => p.id !== packId);
  inMemoryPacksCache = filtered;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKS, JSON.stringify(filtered));
    if (localStorage.getItem(STORAGE_KEY_ACTIVE_PACK_ID) === packId) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_PACK_ID);
    }
    window.dispatchEvent(new Event('curriculum_packs_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[curriculumPackStore] Error removing pack:', err);
  }
}

/**
 * Searches installed custom packs for a lesson or topic knowledge record
 * matching stage, subject, and topic strings.
 */
export function findCustomTopicKnowledge(
  stage: string,
  subject: string,
  topic: string
): CurriculumTopicKnowledge | null {
  const packs = getInstalledCurriculumPacks();
  if (!packs || packs.length === 0) return null;

  const clean = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const cleanStage = clean(stage);
  const cleanSub = clean(subject);
  const cleanTop = clean(topic);

  for (const pack of packs) {
    for (const lesson of pack.lessons) {
      const lStage = clean(lesson.stageTitle);
      const lSub = clean(lesson.subjectTitle);
      const lTop = clean(lesson.topicTitle);

      const isTopicMatch = lTop === cleanTop || lTop.includes(cleanTop) || cleanTop.includes(lTop);
      const isSubMatch = !subject || lSub === cleanSub || lSub.includes(cleanSub) || cleanSub.includes(lSub);
      const isStageMatch = !stage || lStage === cleanStage || lStage.includes(cleanStage) || cleanStage.includes(lStage);

      if (isTopicMatch && (isSubMatch || isStageMatch)) {
        // Convert custom questions into CurriculumTopicKnowledge format
        const formattedQuestions = lesson.questions.map((q, idx) => {
          const correct = q.correctAnswer[0] || 'Correct concept';
          const distractors = (q.distractors || []).slice(0, 3).map((d) => d.answerText);
          while (distractors.length < 3) {
            distractors.push(`Alternative perspective ${distractors.length + 1}`);
          }
          // Put correct answer at index 0 and shuffle options
          const allOptions = [correct, ...distractors];
          const targetIndex = (idx * 2) % allOptions.length; // deterministic placement
          const finalOptions = [...allOptions];
          const temp = finalOptions[0];
          finalOptions[0] = finalOptions[targetIndex];
          finalOptions[targetIndex] = temp;

          return {
            id: `${lesson.id}-q${idx + 1}`,
            prompt: q.questionText,
            options: finalOptions,
            answerKey: targetIndex,
            hint: q.hint,
            explanation: q.explanation,
          };
        });

        return {
          topicId: lesson.id,
          title: lesson.topicTitle,
          subject: lesson.subjectTitle,
          stage: lesson.stageTitle,
          coreAxiom: lesson.axiom,
          cognitiveTrap: lesson.trap || 'Failing to apply the core principle consistently.',
          hook: lesson.hook || `How does ${lesson.topicTitle} operate in real world contexts?`,
          guidedStep: lesson.guidedStep || 'Review the core rules, observe key components, and verify results.',
          socraticPivot: lesson.socraticCheck || `Can you summarize the primary rule of ${lesson.topicTitle}?`,
          scaffoldHints: {
            level1: lesson.questions[0]?.hint || 'Review the foundational concept.',
            level2: lesson.questions[0]?.explanation || 'Check the primary principle and avoid common traps.',
            level3: `Remember: ${lesson.axiom}`,
          },
          questions: formattedQuestions,
        };
      }
    }
  }

  return null;
}

/**
 * Converts all installed custom packs into StandardStage tree format
 * so that they seamlessly appear in stage, subject, and topic dropdowns.
 */
export function getCustomStandardStages(): Record<string, StandardStage> {
  const packs = getInstalledCurriculumPacks();
  const stages: Record<string, StandardStage> = {};

  for (const pack of packs) {
    for (const [stageKey, stageDef] of Object.entries(pack.stages)) {
      const uniqueStageKey = `custom_${pack.id}_${stageKey}`;
      stages[uniqueStageKey] = {
        id: uniqueStageKey,
        title: `${stageDef.title} [${pack.countryOrRegion}]`,
        subjects: stageDef.subjects.map((sub): StandardSubject => ({
          id: sub.id,
          title: sub.title,
          domain: 'stem',
          topics: sub.topics.map((t): StandardTopic => ({
            id: t.id,
            title: t.title,
            scope: 'universal',
          })),
        })),
      };
    }
  }

  return stages;
}

/**
 * Generates sample CSV starter file content for educators
 */
export function generateSampleCsvTemplate(): string {
  return `Grade or Stage,Subject,Topic or Lesson Title,Core Axiom (The Rule),Cognitive Trap (Common Mistake),Question,Correct Answer,Distractor 1,Distractor 1 Feedback,Distractor 2,Distractor 2 Feedback,Distractor 3,Distractor 3 Feedback,Hint,Explanation
Grade 7 (JSS),Integrated Science,Separation of Soil Mixtures,Filtration separates insoluble solids from liquids via a porous medium.,Confusing evaporation (which evaporates liquid) with filtration (which catches solid).,Which method is best to separate muddy sand from water while keeping both?,filtration,evaporation,Evaporation turns the water into vapor rather than collecting it as liquid.,magnetic separation,Sand and water are not magnetic substances.,dissolution,Dissolving will not separate an insoluble solid from liquid.,Think about using a porous filter that holds back solid sand particles.,Filtration allows the liquid filtrate to pass through while retaining the solid residue.
Grade 7 (JSS),Agriculture & Nutrition,Soil Water Conservation,Mulching preserves soil moisture and suppresses weed germination.,Believing mulching deprives crops of sunlight or air.,What is the primary benefit of organic mulching around crop beds?,conserving soil moisture,attracting harmful insects,Mulch helps soil health and does not primarily serve to attract pests.,reducing root growth,Mulch keeps the soil cool and moist which promotes healthy root growth.,increasing soil erosion,Mulching protects topsoil from wind and rain runoff.,Think about covering the soil with organic matter to prevent evaporation.,Organic mulches reduce evaporation from the soil surface and moderate soil temperatures.
Grade 8 (JSS),Social Studies,Water Resources in Africa,Sustainable water management balances agricultural irrigation and community access.,Assuming river water is limitless and never needs rationing.,Why is drip irrigation preferred over flood irrigation in arid zones?,it delivers water directly to plant roots with minimal evaporation,it is much noisier,Noise has no relation to water conservation benefits.,it requires flooding the entire field,That is flood irrigation which wastes water through high evaporation.,it only works in winter,Drip systems operate year-round to deliver precise moisture.,Consider how delivering water droplet by droplet prevents surface loss.,Drip irrigation targets crop roots directly, cutting evaporation waste by up to 60%.`;
}

/**
 * Generates sample JSON starter template
 */
export function generateSampleJsonTemplate(): string {
  return JSON.stringify(
    {
      id: 'kenya-kicd-jss-sample',
      title: 'Kenya Junior Secondary Curriculum (KICD Sample)',
      countryOrRegion: 'Kenya',
      authorOrMinistry: 'Ministry of Education / KICD',
      description: 'Grade 7-8 Competency-Based Curriculum for Integrated Science and Agriculture.',
      version: '1.0.0',
      stages: {
        'grade-7': {
          id: 'grade-7',
          title: 'Junior Secondary (Grade 7)',
          subjects: [
            {
              id: 'integrated-science',
              title: 'Integrated Science',
              topics: [
                { id: 'separation-of-mixtures', title: 'Separation of Soil Mixtures' },
              ],
            },
            {
              id: 'agriculture',
              title: 'Agriculture & Nutrition',
              topics: [
                { id: 'soil-water-conservation', title: 'Soil Water Conservation' },
              ],
            },
          ],
        },
      },
      lessons: [
        {
          id: 'separation-of-mixtures',
          stageTitle: 'Junior Secondary (Grade 7)',
          subjectTitle: 'Integrated Science',
          topicTitle: 'Separation of Soil Mixtures',
          axiom: 'Filtration separates insoluble solids from liquids via a porous medium.',
          trap: 'Confusing evaporation with filtration.',
          hook: 'How can we turn muddy river water into clear water for filtering?',
          guidedStep: 'Identify insoluble particulate matter, set up filter funnel, and collect filtrate.',
          socraticCheck: 'What physical property allows filtration to separate sand from water?',
          questions: [
            {
              questionText: 'Which method is best to separate muddy sand from water while keeping both?',
              correctAnswer: ['filtration', 'filtering'],
              hint: 'Think about using a porous filter that holds back solid sand particles.',
              explanation: 'Filtration allows the liquid filtrate to pass through while retaining the solid residue.',
              distractors: [
                { answerText: 'evaporation', feedback: 'Evaporation turns the water into vapor rather than collecting it as liquid.' },
                { answerText: 'magnetic separation', feedback: 'Sand and water are not magnetic substances.' },
                { answerText: 'freezing', feedback: 'Freezing solidifies both without separating the particles.' },
              ],
            },
          ],
        },
      ],
    },
    null,
    2
  );
}

/**
 * Parses CSV text into a structured CustomCurriculumPack
 */
export function parseCsvToCurriculumPack(
  csvContent: string,
  metadata: {
    packId?: string;
    packTitle?: string;
    countryOrRegion?: string;
    authorOrMinistry?: string;
    description?: string;
  }
): CustomCurriculumPack {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row.');
  }

  // Parse CSV line handling quoted commas
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return result;
  };

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());

  // Find column indices
  const getCol = (...names: string[]) => {
    for (const name of names) {
      const idx = headers.findIndex((h) => h.includes(name));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idxStage = getCol('grade', 'stage', 'year', 'level');
  const idxSub = getCol('subject', 'discipline');
  const idxTopic = getCol('topic', 'title', 'lesson', 'unit');
  const idxAxiom = getCol('axiom', 'rule', 'concept', 'summary');
  const idxTrap = getCol('trap', 'mistake', 'misconception');
  const idxQuestion = getCol('question', 'prompt');
  const idxAnswer = getCol('correct', 'answer');
  const idxD1 = getCol('distractor 1', 'wrong 1', 'incorrect 1');
  const idxD1Feed = getCol('distractor 1 feed', 'feedback 1', 'mistake 1 explanation');
  const idxD2 = getCol('distractor 2', 'wrong 2', 'incorrect 2');
  const idxD2Feed = getCol('distractor 2 feed', 'feedback 2', 'mistake 2 explanation');
  const idxD3 = getCol('distractor 3', 'wrong 3', 'incorrect 3');
  const idxD3Feed = getCol('distractor 3 feed', 'feedback 3', 'mistake 3 explanation');
  const idxHint = getCol('hint', 'clue');
  const idxExplanation = getCol('explanation', 'reason');

  if (idxQuestion === -1 || idxAnswer === -1) {
    throw new Error('CSV must contain columns for "Question" and "Correct Answer".');
  }

  const stagesMap: Record<string, {
    id: string;
    title: string;
    subjects: Map<string, { id: string; title: string; topics: Map<string, { id: string; title: string }> }>;
  }> = {};

  const lessonsMap = new Map<string, CustomCurriculumLesson>();

  for (let r = 1; r < lines.length; r++) {
    const cols = parseCsvLine(lines[r]);
    if (cols.length <= Math.max(idxQuestion, idxAnswer)) continue;

    const stageTitle = (idxStage !== -1 && cols[idxStage]) ? cols[idxStage] : 'General Stage';
    const subjectTitle = (idxSub !== -1 && cols[idxSub]) ? cols[idxSub] : 'General Studies';
    const topicTitle = (idxTopic !== -1 && cols[idxTopic]) ? cols[idxTopic] : `Lesson ${r}`;
    const axiom = (idxAxiom !== -1 && cols[idxAxiom]) ? cols[idxAxiom] : `Core principles of ${topicTitle}.`;
    const trap = (idxTrap !== -1 && cols[idxTrap]) ? cols[idxTrap] : `Common confusion regarding ${topicTitle}.`;
    const questionText = cols[idxQuestion];
    const correctAnswer = cols[idxAnswer];
    const hint = (idxHint !== -1 && cols[idxHint]) ? cols[idxHint] : 'Review the fundamental concept.';
    const explanation = (idxExplanation !== -1 && cols[idxExplanation]) ? cols[idxExplanation] : 'Review the underlying rule.';

    if (!questionText || !correctAnswer) continue;

    const distractors: CustomQuestionDistractor[] = [];
    if (idxD1 !== -1 && cols[idxD1]) {
      distractors.push({
        answerText: cols[idxD1],
        feedback: (idxD1Feed !== -1 && cols[idxD1Feed]) ? cols[idxD1Feed] : 'This is a common misconception.',
      });
    }
    if (idxD2 !== -1 && cols[idxD2]) {
      distractors.push({
        answerText: cols[idxD2],
        feedback: (idxD2Feed !== -1 && cols[idxD2Feed]) ? cols[idxD2Feed] : 'Incorrect based on foundational definitions.',
      });
    }
    if (idxD3 !== -1 && cols[idxD3]) {
      distractors.push({
        answerText: cols[idxD3],
        feedback: (idxD3Feed !== -1 && cols[idxD3Feed]) ? cols[idxD3Feed] : 'Does not satisfy the requirements.',
      });
    }

    // Slug generation
    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const stageKey = slug(stageTitle);
    const subKey = slug(subjectTitle);
    const topKey = slug(topicTitle);

    // Build hierarchy
    if (!stagesMap[stageKey]) {
      stagesMap[stageKey] = {
        id: stageKey,
        title: stageTitle,
        subjects: new Map(),
      };
    }

    const subMap = stagesMap[stageKey].subjects;
    if (!subMap.has(subKey)) {
      subMap.set(subKey, {
        id: subKey,
        title: subjectTitle,
        topics: new Map(),
      });
    }

    const topMap = subMap.get(subKey)!.topics;
    if (!topMap.has(topKey)) {
      topMap.set(topKey, {
        id: topKey,
        title: topicTitle,
      });
    }

    // Build or append to lesson
    const lessonKey = `${stageKey}_${subKey}_${topKey}`;
    const existingLesson = lessonsMap.get(lessonKey);
    const newQuestion: CustomQuestionItem = {
      questionText,
      correctAnswer: [correctAnswer],
      hint,
      explanation,
      distractors,
    };

    if (existingLesson) {
      existingLesson.questions.push(newQuestion);
    } else {
      lessonsMap.set(lessonKey, {
        id: topKey,
        stageTitle,
        subjectTitle,
        topicTitle,
        axiom,
        trap,
        hook: `How does ${topicTitle} apply in real life?`,
        guidedStep: `Carefully examine the definitions and practical applications of ${topicTitle}.`,
        socraticCheck: `What is the key takeaway of ${topicTitle}?`,
        questions: [newQuestion],
      });
    }
  }

  // Convert nested Maps to structured objects
  const finalStages: CustomCurriculumPack['stages'] = {};
  for (const [stKey, stVal] of Object.entries(stagesMap)) {
    finalStages[stKey] = {
      id: stVal.id,
      title: stVal.title,
      subjects: Array.from(stVal.subjects.values()).map((sub) => ({
        id: sub.id,
        title: sub.title,
        topics: Array.from(sub.topics.values()),
      })),
    };
  }

  const packId = metadata.packId || `custom-${Date.now()}`;
  return {
    id: packId,
    title: metadata.packTitle || 'Imported Curriculum Pack',
    countryOrRegion: metadata.countryOrRegion || 'International / Regional',
    authorOrMinistry: metadata.authorOrMinistry || 'Local School / Ministry of Education',
    description: metadata.description || 'Custom imported educational curriculum pack for offline learning.',
    version: '1.0.0',
    installedAt: Date.now(),
    stages: finalStages,
    lessons: Array.from(lessonsMap.values()),
  };
}

/**
 * Built-in overseas preset packs that any teacher can preview and install with one click
 */
export const PRESET_OVERSEAS_PACKS: CustomCurriculumPack[] = [
  {
    id: 'kenya-kicd-jss',
    title: 'Kenya Junior Secondary School (CBC / KICD Standards)',
    countryOrRegion: 'Kenya',
    authorOrMinistry: 'Kenya Institute of Curriculum Development (KICD)',
    description: 'Aligned with the Kenyan Competency-Based Curriculum (CBC) for Grade 7 & 8 in Integrated Science, Agriculture, and Social Studies.',
    version: '2026.1',
    installedAt: Date.now(),
    stages: {
      'kenya-grade-7': {
        id: 'kenya-grade-7',
        title: 'Grade 7 (Kenya Junior Secondary)',
        subjects: [
          {
            id: 'integrated-science',
            title: 'Integrated Science',
            topics: [
              { id: 'separation-of-mixtures', title: 'Separation of Soil Mixtures' },
              { id: 'human-circulatory-system', title: 'The Human Circulatory System' },
            ],
          },
          {
            id: 'agriculture-nutrition',
            title: 'Agriculture & Nutrition',
            topics: [
              { id: 'soil-water-conservation', title: 'Soil Water Conservation & Mulching' },
              { id: 'indigenous-food-crops', title: 'Nutritional Value of Indigenous Vegetables' },
            ],
          },
        ],
      },
      'kenya-grade-8': {
        id: 'kenya-grade-8',
        title: 'Grade 8 (Kenya Junior Secondary)',
        subjects: [
          {
            id: 'social-studies',
            title: 'Social Studies',
            topics: [
              { id: 'african-physical-environment', title: 'The Great Rift Valley & Drainage Systems' },
              { id: 'sustainable-water-management', title: 'Water Resource Stewardship in Arid Lands' },
            ],
          },
        ],
      },
    },
    lessons: [
      {
        id: 'separation-of-mixtures',
        stageTitle: 'Grade 7 (Kenya Junior Secondary)',
        subjectTitle: 'Integrated Science',
        topicTitle: 'Separation of Soil Mixtures',
        axiom: 'Filtration separates insoluble solids from liquids via a porous medium.',
        trap: 'Confusing evaporation with filtration.',
        hook: 'How can communities purify water collected from turbid seasonal rivers?',
        guidedStep: 'Assemble filter paper, funnel, and collection beaker. Pour the suspended solution carefully.',
        socraticCheck: 'Why does filtration leave clear water in the flask while trapping sand on the paper?',
        questions: [
          {
            questionText: 'Which separation method is most suitable for recovering both water and clean sand from a river silt mixture?',
            correctAnswer: ['filtration', 'filtering'],
            hint: 'Think of using a porous barrier that blocks sand grains while letting water pass.',
            explanation: 'Filtration retains the solid residue on the filter while the liquid filtrate collects in the beaker.',
            distractors: [
              { answerText: 'evaporation to dryness', feedback: 'Evaporation vaporizes water into the atmosphere, so the water liquid is lost unless complex condensing equipment is used.' },
              { answerText: 'magnetic extraction', feedback: 'Soil sand and water are non-magnetic substances.' },
              { answerText: 'chemical neutralization', feedback: 'Neutralization is for acid-base reactions, not separating insoluble suspended solids.' },
            ],
          },
        ],
      },
      {
        id: 'soil-water-conservation',
        stageTitle: 'Grade 7 (Kenya Junior Secondary)',
        subjectTitle: 'Agriculture & Nutrition',
        topicTitle: 'Soil Water Conservation & Mulching',
        axiom: 'Mulching minimizes moisture evaporation, regulates soil temperature, and enriches soil organic matter upon decay.',
        trap: 'Believing that mulching suffocates plant roots.',
        hook: 'Why do farms with dry maize stalks spread across their beds survive long dry spells better?',
        guidedStep: 'Spread dry organic matter evenly around crop stems without piling directly against the plant crown.',
        socraticCheck: 'How does a layer of organic mulch reduce the rate of capillary water loss from topsoil?',
        questions: [
          {
            questionText: 'What is the primary agronomic benefit of applying organic grass mulch to kitchen garden beds during drought?',
            correctAnswer: ['conserving soil moisture and reducing evaporation', 'soil moisture conservation', 'reducing water evaporation'],
            hint: 'Consider how shielding the bare ground from the tropical sun prevents moisture loss.',
            explanation: 'Mulch forms an insulating barrier that shields the soil surface from direct solar radiation, drastically curbing evaporation.',
            distractors: [
              { answerText: 'attracting foraging rodents to the garden', feedback: 'Rodents are a pest concern; the primary intended agricultural purpose of mulching is moisture retention and weed control.' },
              { answerText: 'accelerating soil compaction by rain', feedback: 'Mulch actually cushions the soil against torrential rain impact, reducing compaction.' },
            ],
          },
        ],
      },
      {
        id: 'sustainable-water-management',
        stageTitle: 'Grade 8 (Kenya Junior Secondary)',
        subjectTitle: 'Social Studies',
        topicTitle: 'Water Resource Stewardship in Arid Lands',
        axiom: 'Micro-irrigation and sand dams capture seasonal runoff to provide drought-resilient community water supply.',
        trap: 'Assuming groundwater in arid regions is infinite and automatically replenished.',
        hook: 'How do dry sand riverbeds retain fresh drinkable water months after the rains stop?',
        guidedStep: 'Map catchment areas, construct low concrete weirs to trap coarse sand, and extract water via sub-surface wells.',
        socraticCheck: 'Why do sand dams prevent evaporation better than open surface reservoirs in tropical climates?',
        questions: [
          {
            questionText: 'Why are sand dams particularly effective for community water security in arid and semi-arid lands (ASALs)?',
            correctAnswer: ['water is stored beneath the sand, which protects it from extreme evaporation and mosquito breeding', 'sub-surface storage prevents evaporation', 'it protects water under sand from evaporation'],
            hint: 'Think about what happens to open water under 35°C equatorial sun compared to water buried in deep coarse sand.',
            explanation: 'By holding water beneath coarse sand, sand dams prevent high evaporative loss and eliminate open breeding grounds for malaria-carrying mosquitoes.',
            distractors: [
              { answerText: 'they generate hydroelectric power for the national grid', feedback: 'Sand dams are small seasonal community water-storage weirs, not large hydroelectric facilities.' },
              { answerText: 'they make riverbeds completely dry permanently', feedback: 'Sand dams actually elevate the local water table, recharging surrounding vegetation and boreholes.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'india-cbse-middle-school',
    title: 'India National Curriculum (CBSE / NCERT Standards Class 6–8)',
    countryOrRegion: 'India',
    authorOrMinistry: 'NCERT / Central Board of Secondary Education (CBSE)',
    description: 'Standardized modules for Class 6–8 in General Science, Mathematics (Algebraic Equations & Vedic Geometry), and Environmental Studies.',
    version: '2026.2',
    installedAt: Date.now(),
    stages: {
      'cbse-class-7': {
        id: 'cbse-class-7',
        title: 'Class 7 (CBSE / NCERT)',
        subjects: [
          {
            id: 'science',
            title: 'Science',
            topics: [
              { id: 'nutrition-in-plants', title: 'Nutrition in Plants: Autotrophs & Photosynthesis' },
              { id: 'acids-bases-salts', title: 'Acids, Bases & Indicators: Litmus & Turmeric' },
            ],
          },
          {
            id: 'mathematics',
            title: 'Mathematics',
            topics: [
              { id: 'algebraic-expressions', title: 'Algebraic Expressions & Like Terms' },
              { id: 'lines-and-angles', title: 'Parallel Lines & Transversals: Angle Relationships' },
            ],
          },
        ],
      },
      'cbse-class-8': {
        id: 'cbse-class-8',
        title: 'Class 8 (CBSE / NCERT)',
        subjects: [
          {
            id: 'science',
            title: 'Science',
            topics: [
              { id: 'crop-production-management', title: 'Crop Production & Kharif/Rabi Crops' },
              { id: 'conservation-plants-animals', title: 'Biodiversity & Wildlife Sanctuaries' },
            ],
          },
        ],
      },
    },
    lessons: [
      {
        id: 'nutrition-in-plants',
        stageTitle: 'Class 7 (CBSE / NCERT)',
        subjectTitle: 'Science',
        topicTitle: 'Nutrition in Plants: Autotrophs & Photosynthesis',
        axiom: 'Autotrophic nutrition utilizes chlorophyll, sunlight, carbon dioxide, and water to synthesize glucose and release oxygen (6CO2 + 6H2O -> C6H12O6 + 6O2).',
        trap: 'Believing plants take in food directly from soil rather than manufacturing it in leaves.',
        hook: 'Why do non-green plants like Cuscuta (Amarbel) have to cling onto host trees to survive?',
        guidedStep: 'Observe stomatal pore function, chloroplast pigments, and test starch formation using iodine solution.',
        socraticCheck: 'What happens to the rate of photosynthesis if stomata are blocked by heavy road dust?',
        questions: [
          {
            questionText: 'What are the essential raw materials required by green leaves to synthesize carbohydrates during photosynthesis?',
            correctAnswer: ['carbon dioxide, water, sunlight, and chlorophyll', 'carbon dioxide water and sunlight', 'co2 h2o sunlight chlorophyll'],
            hint: 'Recall the gas absorbed from air, liquid absorbed by roots, and solar energy captured by leaf pigments.',
            explanation: 'Leaves absorb CO2 through stomata, draw water via xylem vessels, and capture sunlight with chlorophyll to produce glucose and oxygen (NCERT Class 7 Ch. 1).',
            distractors: [
              { answerText: 'oxygen, glucose, and soil fertilizer only', feedback: 'Oxygen and glucose are the products of photosynthesis, not the initial reactants.' },
              { answerText: 'nitrogen gas and mineral oils', feedback: 'Plants cannot directly fix atmospheric nitrogen through leaves for photosynthesis; they require carbon dioxide.' },
            ],
          },
        ],
      },
      {
        id: 'acids-bases-salts',
        stageTitle: 'Class 7 (CBSE / NCERT)',
        subjectTitle: 'Science',
        topicTitle: 'Acids, Bases & Indicators: Litmus & Turmeric',
        axiom: 'Acids turn blue litmus red; bases turn red litmus blue; turmeric turns reddish-brown in basic solutions.',
        trap: 'Thinking all acids are dangerous poisons (lemon juice and curd contain edible citric and lactic acids).',
        hook: 'Why does a yellow curry stain on a white shirt turn reddish-brown when washed with soap?',
        guidedStep: 'Apply soap solution (a base) to turmeric indicator and observe the rapid chromic shift.',
        socraticCheck: 'What is formed when hydrochloric acid is precisely neutralized with sodium hydroxide?',
        questions: [
          {
            questionText: 'When a piece of turmeric paper indicator comes into contact with a basic cleaning solution (like soap or lime water), what color change occurs?',
            correctAnswer: ['it turns reddish-brown', 'reddish brown', 'turns red'],
            hint: 'Turmeric is a natural indicator that remains yellow in acids, but shifts in bases.',
            explanation: 'Turmeric paper is yellow in acidic and neutral media, but turns reddish-brown in the presence of basic substances like soap (NCERT Class 7 Ch. 5).',
            distractors: [
              { answerText: 'it turns bright blue', feedback: 'Litmus turns blue in bases, but turmeric turns reddish-brown.' },
              { answerText: 'it becomes completely colorless', feedback: 'Phenolphthalein is colorless in acids, not turmeric in bases.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ghana-ges-basic',
    title: 'Ghana National Curriculum (GES / NaCCA Basic 7–9)',
    countryOrRegion: 'Ghana',
    authorOrMinistry: 'Ghana Education Service (GES) / NaCCA',
    description: 'Standards-based syllabus for Junior High School (Basic 7 to 9) in Integrated Science, Computing, and Religious & Moral Education (RME).',
    version: '2026.1',
    installedAt: Date.now(),
    stages: {
      'ghana-basic-7': {
        id: 'ghana-basic-7',
        title: 'Basic 7 (JHS 1 - Ghana)',
        subjects: [
          {
            id: 'integrated-science',
            title: 'Integrated Science',
            topics: [
              { id: 'water-pollution-galamsey', title: 'Water Body Conservation & River Siltation' },
              { id: 'cells-and-living-systems', title: 'Plant and Animal Cell Structures' },
            ],
          },
          {
            id: 'computing-ict',
            title: 'Computing & ICT',
            topics: [
              { id: 'data-security-privacy', title: 'Computer Hardware, Malware & Data Safety' },
            ],
          },
        ],
      },
      'ghana-basic-8': {
        id: 'ghana-basic-8',
        title: 'Basic 8 (JHS 2 - Ghana)',
        subjects: [
          {
            id: 'religious-moral-education',
            title: 'Religious & Moral Education (RME)',
            topics: [
              { id: 'stewardship-creation', title: 'God as Creator & Human Stewardship in Indigenous Traditions' },
            ],
          },
        ],
      },
    },
    lessons: [
      {
        id: 'water-pollution-galamsey',
        stageTitle: 'Basic 7 (JHS 1 - Ghana)',
        subjectTitle: 'Integrated Science',
        topicTitle: 'Water Body Conservation & River Siltation',
        axiom: 'Illegal alluvial mining and industrial effluent contaminate rivers with heavy metals (mercury and lead) and excessive suspended solids, destroying aquatic ecosystems.',
        trap: 'Believing that settling turbid water in a bucket makes heavy metal contaminants safe to drink.',
        hook: 'Why have historical rivers like the Pra, Ankobra, and Birim become turbid and yellow-brown?',
        guidedStep: 'Examine turbidity samples, distinguish between physical silt suspension and chemical toxicity, and review watershed reclamation.',
        socraticCheck: 'Can boiling remove toxic dissolved heavy metals like mercury from contaminated river water?',
        questions: [
          {
            questionText: 'Why is boiling water insufficient to make river water contaminated by illegal alluvial mining safe for drinking?',
            correctAnswer: ['boiling kills biological microbes but does not remove toxic dissolved heavy metals like mercury or arsenic', 'boiling cannot remove heavy metals', 'heavy metals remain in water after boiling'],
            hint: 'Consider the difference between living bacteria and dissolved chemical elements.',
            explanation: 'Boiling disinfects water by eliminating pathogenic bacteria, but heavy metals like mercury and lead do not boil off; boiling actually concentrates them as water evaporates (GES Basic 7 Science).',
            distractors: [
              { answerText: 'boiling turns pure water into dangerous poison', feedback: 'Boiling pure water is safe; the issue is that it does not neutralize chemical toxins already present.' },
              { answerText: 'heavy metals are living creatures that thrive in boiling water', feedback: 'Heavy metals are chemical elements, not biological organisms.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'philippines-deped-matatag',
    title: 'Philippines Basic Education (DepEd MATATAG Curriculum)',
    countryOrRegion: 'Philippines',
    authorOrMinistry: 'Department of Education (DepEd Philippines)',
    description: 'MATATAG Curriculum for Junior High School in General Science (Disaster Preparedness & Typhoon Meteorology), Mathematics, and Values Education.',
    version: '2026.1',
    installedAt: Date.now(),
    stages: {
      'deped-grade-7': {
        id: 'deped-grade-7',
        title: 'Grade 7 (DepEd Philippines)',
        subjects: [
          {
            id: 'science',
            title: 'Science',
            topics: [
              { id: 'typhoons-weather-systems', title: 'Typhoons, Tropical Cyclones & PAGASA Warning Signals' },
              { id: 'philippine-fault-systems', title: 'Earthquakes & Active Fault Lines along the Ring of Fire' },
            ],
          },
          {
            id: 'values-education',
            title: 'Values Education (Edukasyon sa Pagpapakatao)',
            topics: [
              { id: 'bayanihan-community-solidarity', title: 'Bayanihan & Disaster Risk Reduction in Communities' },
            ],
          },
        ],
      },
    },
    lessons: [
      {
        id: 'typhoons-weather-systems',
        stageTitle: 'Grade 7 (DepEd Philippines)',
        subjectTitle: 'Science',
        topicTitle: 'Typhoons, Tropical Cyclones & PAGASA Warning Signals',
        axiom: 'Tropical cyclones gain energy from warm ocean waters (26.5°C or higher) and lose strength when making landfall over mountainous terrain.',
        trap: 'Thinking the eye of the typhoon is the most violent part of the storm (the eye is calm; the eye wall has the strongest winds).',
        hook: 'Why do typhoons that form over the warm Philippine Sea weaken significantly after crossing the Sierra Madre mountain range?',
        guidedStep: 'Track typhoon coordinates on the Philippine Area of Responsibility (PAR) map and correlate barometric pressure with wind intensity.',
        socraticCheck: 'What weather conditions characterize the eye of a tropical cyclone compared to its eyewall?',
        questions: [
          {
            questionText: 'What causes a powerful tropical cyclone (bagyo) to rapidly lose strength after making landfall over large landmasses like Luzon or Mindanao?',
            correctAnswer: ['loss of warm ocean moisture that fuels the storm and increased surface friction from terrain', 'loss of warm ocean water and land friction', 'cutting off the warm moisture source'],
            hint: 'Think about what heat engine powers tropical storms and what happens when they leave the open ocean.',
            explanation: 'Typhoons are fueled by latent heat released from warm ocean water; upon landfall, they are cut off from moisture and experience intense friction from mountains and trees (DepEd Grade 7 Science).',
            distractors: [
              { answerText: 'land masses are colder than the stratosphere', feedback: 'Surface temperature contrast is not the main reason; loss of evaporating ocean water and friction are the key factors.' },
              { answerText: 'the moon pushes the typhoon backward into the sea', feedback: 'Lunar gravity causes ocean tides, but does not extinguish atmospheric cyclone vorticity.' },
            ],
          },
        ],
      },
    ],
  },
];
