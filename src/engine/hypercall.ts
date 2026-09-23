// src/engine/hypercall.ts
import { dispatchAstIntent, CurriculumPackage } from '../curriculum';
import { EngineFlow } from './engineflow';
import { ComponentsFlow } from '../components/componentsFlow';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getBufferedLesson, putBufferedLesson, CachedLessonRecord, getTopicAdapter, getBufferedQuestion } from '../services/dbStore';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { aiCaller } from './aicaller';
import { findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';
import { resolveCurriculumRoute, getQuestionForRoute, CurriculumRouteNode, ALL_CURRICULUM_ROUTES } from '../curriculum/curriculumMesh';
import { translateQuestionData, translateLessonData } from './translationService';
import { SUPPORTED_LANGUAGES } from './operational-language';
import { MathQuestionGenerator } from './mathQuestionGenerator';
import { ASTFlowGovernor } from './astGovernor';
import { hypervisor, setHypercallDispatcher } from './hypervisor';
import { extractQuestionFromAst } from '../utils/astQuestionExtractor';
import { PRNG } from './prng';
import { MindSpaceEngine } from './mindSpaceEngine';
import { LessonSequencer, PedagogicalStage } from './lessonSequencer';

export interface HyperMessage<T = any> {
  intent: string;
  payload?: T;
  meta?: Record<string, any>;
}

export interface HyperNodeResult<R = any> {
  ok: boolean;
  data?: R;
  error?: string;
}

const getStageGuidelines = (stage: string) => {
  const s = stage.toLowerCase();
  if (s.includes('ks1') || s.includes('1')) {
    return 'Target: KS1 (Ages 5-7). Sensory, tangible everyday language (bendy, stiff, rough). No formulas. Misconception: Object vs material confusion.';
  }
  if (s.includes('ks2') || s.includes('2')) {
    return 'Target: KS2 (Ages 7-11). Qualitative scientific relationships, simple models. Misconception: Intuitive friction and gravity traps.';
  }
  if (s.includes('ks3') || s.includes('3')) {
    return 'Target: KS3 (Ages 11-14). Scientific models, energy stores, balanced/unbalanced force arrows.';
  }
  return 'Target: KS4 / GCSE (Ages 14-16). Formal GCSE syllabus depth: quantitative relationships (e.g., F=ma, momentum, resultant forces), precise terminology, vector analysis, and Free Body Diagrams. Misconception: Aristotelian impetus (belief that motion requires continuous forward force).';
};

// Tracks recent question IDs to prevent back-to-back repetitions for the same topic
const recentTopicQuestionMap = new Map<string, string>();
const fallbackVariantMap = new Map<string, number>();

function getIntelligentTopicFallback(stage: string, subject: string, topic: string, variantIndex: number = 0) {
  const cleanSub = (subject || '').toLowerCase();
  const v = Math.abs(variantIndex) % 5;

  let stem = `Which statement accurately describes the core curriculum principle of "${topic}" (${stage})?`;
  let correct = `It accurately demonstrates the standard foundational rules, processes, or definitions of ${topic}.`;
  let distractor1 = `It inverts the key cause-and-effect relationship, producing the opposite outcome for ${topic}.`;
  let distractor2 = `It confuses ${topic} with a different concept in ${subject} that operates under contradictory rules.`;
  let distractor3 = `It assumes ${topic} remains completely static without interacting with any surrounding environmental or systematic factors.`;

  if (cleanSub.includes('relig') || cleanSub.includes('catholic') || cleanSub.includes('theology') || cleanSub.includes('faith')) {
    if (v === 0) {
      stem = `In Catholic theology and Religious Studies, what is the doctrinal definition of "${topic}" (${stage})?`;
      correct = `It expresses divine revelation transmitted through Sacred Scripture and Apostolic Tradition, articulated by the Church's Magisterium.`;
      distractor1 = `It was an ancient civil law code established purely for collecting secular taxes in medieval Europe.`;
      distractor2 = `It permits individuals to redefine core moral virtues according to personal convenience.`;
      distractor3 = `It claims that religious truth is entirely separated from worship, prayer, and human dignity.`;
    } else if (v === 1) {
      stem = `Which common misconception about "${topic}" is firmly refuted by Catholic Christian teaching?`;
      correct = `Confusing outward symbolic ritual with the real interior transmission of divine grace and spiritual communion.`;
      distractor1 = `Recognizing that prayer and the sacraments foster genuine personal holiness.`;
      distractor2 = `Affirming that Christ's redeeming love calls believers to care for the vulnerable.`;
      distractor3 = `Acknowledging the Holy Spirit as the Lord and Giver of Life.`;
    } else if (v === 2) {
      stem = `How does "${topic}" shape Catholic liturgical practice and sacramental life?`;
      correct = `It informs prayer, communal celebration, and the faithful response of the Church to God's covenant love.`;
      distractor1 = `It forbids believers from reciting the Nicene Creed during Sunday Mass.`;
      distractor2 = `It is only discussed in secular courts and has no place in church liturgies.`;
      distractor3 = `It requires complete silence and bans all scriptural readings during worship.`;
    } else if (v === 3) {
      stem = `In Catholic moral teaching, how does understanding "${topic}" guide Christian ethical decision-making?`;
      correct = `It grounds human dignity, conscience formation, and the universal call to love and serve God and neighbour.`;
      distractor1 = `It promotes material wealth and personal ambition as the highest moral goods.`;
      distractor2 = `It teaches that moral actions carry no consequence for the soul or society.`;
      distractor3 = `It separates moral virtue from honesty, justice, and compassion.`;
    } else {
      stem = `What is the historical and ecclesial significance of "${topic}" within the Catholic Church?`;
      correct = `It preserves orthodox apostolic faith across generations, defending foundational Christian truth through Ecumenical Councils.`;
      distractor1 = `It was abolished in the early Church and replaced with secular Roman philosophy.`;
      distractor2 = `It was created to discourage Christians from studying the Bible.`;
      distractor3 = `It applies only to cloistered monks and excludes all other believers.`;
    }
  } else if (cleanSub.includes('mfl') || cleanSub.includes('french') || cleanSub.includes('spanish') || cleanSub.includes('german') || cleanSub.includes('latin') || cleanSub.includes('lang')) {
    if (v === 0) {
      stem = `In modern foreign languages, which grammatical rule is essential when applying "${topic}" (${stage})?`;
      correct = `Ensuring correct tense selection, verb endings, and gender/number agreement with the subject.`;
      distractor1 = `Translating every single English word literally in exact word-for-word order regardless of syntax.`;
      distractor2 = `Using only the infinitive verb form for all tenses and persons.`;
      distractor3 = `Ignoring adjective agreement with masculine and feminine nouns.`;
    } else if (v === 1) {
      stem = `When translating "${topic}", which trap or "false friend" (faux ami) must students avoid?`;
      correct = `Assuming a word with similar spelling in English shares the exact same meaning in the target language.`;
      distractor1 = `Using correct accent marks and punctuation conventions.`;
      distractor2 = `Distinguishing between formal (vous/usted) and informal (tu/tú) address.`;
      distractor3 = `Pronouncing silent consonants accurately according to phonetic rules.`;
    } else if (v === 2) {
      stem = `How does sentence word order change when constructing phrases around "${topic}"?`;
      correct = `Pronouns, negatives, and qualifying adverbs must follow strict syntax positions relative to the conjugated verb.`;
      distractor1 = `Verbs must always be placed at the very end of every sentence in all Romance languages.`;
      distractor2 = `Nouns and adjectives can be placed in completely random positions without altering meaning.`;
      distractor3 = `Questions can never use inversion or question markers.`;
    } else if (v === 3) {
      stem = `Which communicative register is most appropriate when using "${topic}" in speaking or writing?`;
      correct = `Matching the formal or informal register to the audience and social context.`;
      distractor1 = `Always using informal slang in official academic essays.`;
      distractor2 = `Using archaic vocabulary in casual conversation with peers.`;
      distractor3 = `Refusing to express opinions or justifications.`;
    } else {
      stem = `What linguistic feature distinguishes "${topic}" in advanced language examination?`;
      correct = `Employing complex connectives, modal structures, or subjunctive forms to justify viewpoints.`;
      distractor1 = `Using simple single-word responses without connectives.`;
      distractor2 = `Omitting all subject pronouns in languages that require them.`;
      distractor3 = `Avoiding past or future tense structures altogether.`;
    }
  } else if (cleanSub.includes('hist')) {
    if (v === 0) {
      stem = `What is historically significant about "${topic}" in British and world history?`;
      correct = `It marked a transformative development that altered societal structures, governance, or international relations.`;
      distractor1 = `It had no recorded historical impact and was forgotten within months.`;
      distractor2 = `It occurred in prehistory thousands of years before human records began.`;
      distractor3 = `It only affected a single isolated household without wider repercussions.`;
    } else if (v === 1) {
      stem = `When evaluating historical sources concerning "${topic}", which factor is most crucial?`;
      correct = `Analyzing the provenance, purpose, and potential bias or perspective of the author within their historical context.`;
      distractor1 = `Accepting every written document as an absolute, unquestionable eyewitness truth.`;
      distractor2 = `Assuming all historical records created before the 20th century are completely fabricated.`;
      distractor3 = `Judging the source solely by how attractive the handwriting appears.`;
    } else if (v === 2) {
      stem = `Which cause-and-effect chain was directly triggered by "${topic}"?`;
      correct = `Socio-economic pressures or political conflicts prompted systemic institutional reforms or popular movements.`;
      distractor1 = `It immediately restored absolute peace and dissolved all nation-states overnight.`;
      distractor2 = `It prevented any technological or agricultural change for centuries.`;
      distractor3 = `It reversed the global climate back to the last Ice Age.`;
    } else if (v === 3) {
      stem = `How did "${topic}" impact daily life for ordinary people in that era?`;
      correct = `It shifted labor patterns, living conditions, rights, and religious or cultural expectations.`;
      distractor1 = `Ordinary people were completely unaware that the event had taken place for four centuries.`;
      distractor2 = `It gave every peasant equal ownership of all royal land immediately.`;
      distractor3 = `It eradicated all diseases and illnesses in Europe permanently.`;
    } else {
      stem = `Which historiographical interpretation of "${topic}" is supported by modern historical consensus?`;
      correct = `It involved multiple competing social, economic, and political factors rather than a single simple cause.`;
      distractor1 = `It was planned and executed entirely by a single anonymous soldier.`;
      distractor2 = `Historians agree that no real events happened during that entire century.`;
      distractor3 = `It was caused exclusively by a change in fashion styles.`;
    }
  } else if (cleanSub.includes('geo')) {
    if (v === 0) {
      stem = `Which geographical characteristic correctly explains how "${topic}" operates on Earth?`;
      correct = `It involves physical or human processes shaping landscapes, environments, and human settlements over time.`;
      distractor1 = `It occurs exclusively in outer space with zero interaction with Earth's crust or atmosphere.`;
      distractor2 = `It distributes resources and climate identically across every latitude on Earth.`;
      distractor3 = `It prevents any weathering, erosion, or migration from ever occurring.`;
    } else if (v === 1) {
      stem = `What is a primary environmental or human consequence associated with "${topic}"?`;
      correct = `Changes in land use, biodiversity, urban density, or vulnerability to natural hazards.`;
      distractor1 = `It turns all ocean water into fresh drinking water instantly.`;
      distractor2 = `It eliminates all atmospheric pressure around the globe.`;
      distractor3 = `It freezes the tectonic plates in place permanently.`;
    } else if (v === 2) {
      stem = `How does spatial distribution influence "${topic}" across different regions?`;
      correct = `Topography, climate zones, and economic infrastructure create significant regional disparities and patterns.`;
      distractor1 = `Every country on Earth experiences the identical effects at the exact same hour.`;
      distractor2 = `Geography plays no role in human population distribution.`;
      distractor3 = `Only landlocked countries are affected by ocean currents.`;
    } else if (v === 3) {
      stem = `What sustainable management strategy is used to mitigate challenges related to "${topic}"?`;
      correct = `Balancing environmental conservation, economic viability, and social well-being through planned regulation.`;
      distractor1 = `Exploiting all remaining non-renewable resources as quickly as possible.`;
      distractor2 = `Relocating the entire population of the planet to the South Pole.`;
      distractor3 = `Banning all agriculture, transport, and communication worldwide.`;
    } else {
      stem = `Which field-work or data-gathering methodology is best suited to investigate "${topic}"?`;
      correct = `Collecting quantitative and qualitative data through GIS mapping, sampling, and environmental surveys.`;
      distractor1 = `Guessing numbers without recording any observations or measurements.`;
      distractor2 = `Only measuring temperature inside a sealed domestic refrigerator.`;
      distractor3 = `Ignoring geographic coordinates when plotting spatial trends.`;
    }
  } else if (cleanSub.includes('sci')) {
    if (v === 0) {
      stem = `In science, which statement accurately reflects the fundamental mechanism of "${topic}"?`;
      correct = `Empirical evidence and physical laws confirm its behavior under tested experimental conditions.`;
      distractor1 = `It violates the conservation of energy and mass without any physical interaction.`;
      distractor2 = `It changes randomly depending on who happens to be observing the experiment.`;
      distractor3 = `It requires zero energy transfer or molecular interaction to take place.`;
    } else if (v === 1) {
      stem = `Which common scientific misconception regarding "${topic}" should be avoided?`;
      correct = `Confusing heat with temperature, or failing to recognize conservation of mass during chemical changes.`;
      distractor1 = `Observing that matter is made of discrete atoms and molecules.`;
      distractor2 = `Using a control variable to ensure fair test conditions.`;
      distractor3 = `Measuring dependent variables with calibrated laboratory instruments.`;
    } else if (v === 2) {
      stem = `When investigating "${topic}" experimentally, what is the purpose of the control variable?`;
      correct = `To keep all other conditions constant so that only the independent variable affects the dependent variable.`;
      distractor1 = `To change multiple variables simultaneously so the experiment finishes faster.`;
      distractor2 = `To alter the results to match pre-conceived predictions without data.`;
      distractor3 = `To eliminate the need for taking any measurements.`;
    } else if (v === 3) {
      stem = `How does "${topic}" apply at the microscopic or sub-atomic scale?`;
      correct = `Forces, bonds, and particle collisions dictate macroscopic properties and reaction rates.`;
      distractor1 = `Particles expand to the size of marbles and stop vibrating entirely.`;
      distractor2 = `Atoms cease to have mass when they join together in molecules.`;
      distractor3 = `Chemical reactions destroy electrons permanently.`;
    } else {
      stem = `What real-world technology or biological process depends directly on "${topic}"?`;
      correct = `It enables energy generation, medical diagnostics, or cellular metabolic functions in living organisms.`;
      distractor1 = `Perpetual motion machines that generate unlimited energy from nothing.`;
      distractor2 = `Teleportation devices that operate outside the laws of thermodynamics.`;
      distractor3 = `Substances that possess negative absolute temperatures and zero mass.`;
    }
  } else if (cleanSub.includes('eng')) {
    if (v === 0) {
      stem = `In English language and literature, how is "${topic}" effectively applied?`;
      correct = `It provides precise grammatical structure or evocative linguistic technique to convey clear meaning and atmosphere.`;
      distractor1 = `It replaces all punctuation marks with arbitrary capital letters without syntactic rules.`;
      distractor2 = `It is only used when writing in a completely different foreign language.`;
      distractor3 = `It strictly forbids the reader from understanding the sequence of events.`;
    } else if (v === 1) {
      stem = `What effect does "${topic}" create on the reader when used in descriptive or persuasive writing?`;
      correct = `It evokes sensory engagement, emotional resonance, or rhetorical impact to persuade or immerse the audience.`;
      distractor1 = `It confuses the reader so thoroughly that the book cannot be read.`;
      distractor2 = `It guarantees that every character in the story must die on page one.`;
      distractor3 = `It removes all vowels from every word in the paragraph.`;
    } else if (v === 2) {
      stem = `How does an author use structural positioning in "${topic}" to build tension?`;
      correct = `Through pacing, deliberate sentence length variation, and dramatic foreshadowing or contrast.`;
      distractor1 = `By printing every sentence in reverse alphabetical order.`;
      distractor2 = `By omitting all paragraphs, full stops, and capital letters.`;
      distractor3 = `By revealing the ending on the front cover in giant red lettering.`;
    } else if (v === 3) {
      stem = `Which punctuation or syntactic rule governs "${topic}" in standard written English?`;
      correct = `Clauses, commas, and coordinate conjunctions must maintain grammatical cohesion and clarify relationships.`;
      distractor1 = `Every sentence must contain exactly seven apostrophes regardless of possession.`;
      distractor2 = `Commas must be inserted between every word in a sentence.`;
      distractor3 = `Capital letters can only be used at the very end of sentences.`;
    } else {
      stem = `When analyzing poetic meter and sound in relation to "${topic}", what should be examined?`;
      correct = `Rhythm, alliteration, assonance, and cadence that reinforce the emotional meaning of the text.`;
      distractor1 = `The weight of the paper upon which the poem is printed.`;
      distractor2 = `Counting the total number of syllables without considering stress patterns.`;
      distractor3 = `Ignoring rhythm completely because poetry is identical to technical manuals.`;
    }
  }

  // Deterministically shuffle options so correct answer isn't always at index 0
  const allOptions = [
    { text: correct, isCorrect: true, reason: 'Correct! Accurately applies foundational curriculum rules.' },
    { text: distractor1, isCorrect: false, reason: 'Common misconception: Inverts key mechanisms or relationships.' },
    { text: distractor2, isCorrect: false, reason: 'Common trap: Confuses this concept with unrelated conditions or rules.' },
    { text: distractor3, isCorrect: false, reason: 'Common error: Over-generalizes or assumes an impossible extreme condition.' },
  ];

  // Rotate options based on variant index
  const shift = v % allOptions.length;
  const rotated = [...allOptions.slice(shift), ...allOptions.slice(0, shift)];
  const correctIdx = rotated.findIndex(item => item.isCorrect);

  return {
    prompt: stem,
    options: rotated.map(item => item.text),
    answerKey: correctIdx >= 0 ? correctIdx : 0,
    hint: `Focus on the foundational principles and defining characteristics of ${topic}.`,
    explanation: `This option correctly represents the core curriculum standard for ${topic} in ${subject}.`,
    misconceptions: rotated.map(item => item.reason)
  };
}

// 1. Concrete Node Execution Registry
const AST_NODE_MAP = new Map<string, { execute: (intent: string, payload: any) => Promise<any> }>([
  // Curriculum Graph Node
  [
    'curriculumnode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'resolve:tree') {
          const standard = (payload?.curriculum || 'uk_oak') as CurriculumProviderKey;
          return getActiveCurriculumTree(standard);
        }
        if (intent === 'resolve:route' || intent === 'resolve:urn') {
          return resolveCurriculumRoute(payload?.stage, payload?.subject, payload?.topic, payload?.lesson || payload?.lessonTitle);
        }
        if (intent === 'get:mesh') {
          return ALL_CURRICULUM_ROUTES;
        }
        if (intent === 'get:package') {
          // If stage, subject, and topic are provided, check IndexedDB dynamic adapters and oak knowledge
          if (payload?.topic && payload?.subject) {
            const topicKey = `${payload.subject}_${payload.topic}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
            const adapter = await getTopicAdapter(topicKey).catch(() => null);
            const knowledge = findCurriculumKnowledge(payload.stage || 'KS2', payload.subject, payload.topic);
            return {
              coreAxiom: knowledge?.coreAxiom || adapter?.curriculumGuardrails?.[0] || '',
              cognitiveTrap: knowledge?.cognitiveTrap || adapter?.commonMisconceptions?.[0] || '',
              exemplarAST: adapter?.exemplarAST || '',
              curriculumGuardrails: adapter?.curriculumGuardrails || [],
              commonMisconceptions: adapter?.commonMisconceptions || [],
              questions: knowledge?.questions || [],
              socraticPivot: knowledge?.socraticPivot || '',
            };
          }
          const standard = (payload?.curriculum || 'uk_oak') as CurriculumProviderKey;
          const tree = getActiveCurriculumTree(standard);
          return payload?.stage ? tree[payload.stage] : tree;
        }
        throw new Error(`Unknown CurriculumNode intent: "${intent}"`);
      },
    },
  ],

  // AI Question Generation & AST Governor Engine
  [
    'questionengine',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'synthesize:governed') {
          const stage = payload?.keyStage || 'Key Stage 1';
          const subject = payload?.subject || 'Science';
          const topic = payload?.topic || 'General Science';
          const lessonTitle = payload?.lessonTitle || payload?.lesson || '';
          const lessonId = payload?.lessonId || '';
          const curriculum = payload?.curriculum || 'uk_oak';
          const difficulty = (payload?.difficulty || 'challenger') as 'warmup' | 'challenger' | 'brainbuster';
          const lang = payload?.lang || 'en';
          const excludePrompt = (payload?.excludePrompt || '').trim();
          const providedSeed = payload?.seed !== undefined && payload?.seed !== '' ? String(payload.seed) : undefined;
          const activeSeedToken = providedSeed || PRNG.generateSeedToken();
          const prng = new PRNG(activeSeedToken);

          const stageGuidelines = getStageGuidelines(stage);
          const langMeta = SUPPORTED_LANGUAGES[lang];
          const langInstruction = lang !== 'en' && langMeta
            ? `Language Requirement: ${langMeta.promptCondition}`
            : '';

          let difficultyInstruction = 'Difficulty: Standard challenger level with a realistic scenario and a clever distractor.';
          if (difficulty === 'warmup') {
            difficultyInstruction = 'Difficulty: Warm-Up (Level 1). Keep vocabulary clear and encouraging for young learners. Single-step reasoning, straightforward options.';
          } else if (difficulty === 'brainbuster') {
            difficultyInstruction = 'Difficulty: Brain Buster (Level 3 - Deep Thinking). Multi-step reasoning problem or scenario that stretches thinking and tests tricky edge cases.';
          }

          // 1. Resolve deterministic Curriculum Route Node from the AST Mesh
          const route: CurriculumRouteNode | null = resolveCurriculumRoute(stage, subject, topic, lessonTitle);
          const executionEngine = route?.executionEngine || (MathQuestionGenerator.canGenerate(stage, subject, topic) ? 'procedural_generator' : 'curriculum_bank');

          // Deterministic Fast-Path for Procedural Mathematics & Calculations (< 1ms, 0% hallucination)
          if (executionEngine === 'procedural_generator' && MathQuestionGenerator.canGenerate(stage, subject, topic)) {
            const mathQ = MathQuestionGenerator.generate(stage, topic, activeSeedToken);
            let mathCandidate = {
              id: mathQ.id,
              seedToken: mathQ.seedToken || activeSeedToken,
              urn: route?.urn || `urn:curriculum:${stage}:${subject}:${topic}`,
              csn: route?.csn || `CSN-${(stage || 'KS').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3)}-MATH`,
              routeEngine: 'procedural_generator',
              axiom: route?.axiom || `Standard mathematical operations and principles for ${stage}.`,
              trap: route?.cognitiveTrap || `Common procedural or conceptual calculation slips.`,
              hook: route?.hook || `How do numbers and mathematical rules structure real-world quantities?`,
              guidedStep: route?.guidedStep || `Work through the calculation step-by-step applying precedence rules.`,
              prompt: mathQ.prompt,
              options: mathQ.options,
              answerKey: mathQ.answerKey,
              hint: mathQ.hint,
              explanation: mathQ.explanation,
              misconceptions: mathQ.misconceptions,
              socraticFollowUp: mathQ.socraticFollowUp,
              difficulty,
            };

            if (lang && lang !== 'en') {
              try {
                const translated = await translateQuestionData(
                  {
                    prompt: mathCandidate.prompt,
                    displayOptions: mathCandidate.options,
                    hint: mathCandidate.hint,
                    explanation: mathCandidate.explanation,
                  },
                  lang
                );
                mathCandidate = {
                  ...mathCandidate,
                  prompt: translated.prompt,
                  options: translated.displayOptions,
                  hint: translated.hint,
                  explanation: translated.explanation,
                };
              } catch {}
            }
            return mathCandidate;
          }

          // 2. Query deterministic Curriculum Route Mesh for Verified Questions & Invariants
          const topicCacheKey = `${stage}_${subject}_${topic}`.toLowerCase();
          const routeQuestion = route ? getQuestionForRoute(route, lessonTitle, payload?.forceVariation, activeSeedToken) : null;
          const offlineKnowledge = findCurriculumKnowledge(stage, subject, topic);

          // Determine current pedagogical stage (Hook -> Axiom -> Practice -> Pivot -> Mastery)
          let targetPedagogicalStage: PedagogicalStage = payload?.pedagogicalStage;
          if (!targetPedagogicalStage) {
            if (activeSeedToken.startsWith('SOCRATIC-')) {
              targetPedagogicalStage = 'SOCRATIC_PIVOT';
            } else if (activeSeedToken.startsWith('AXIOM-')) {
              targetPedagogicalStage = 'MASTERY';
            } else if (difficulty === 'brainbuster') {
              targetPedagogicalStage = 'MASTERY';
            } else if (difficulty === 'warmup') {
              targetPedagogicalStage = 'HOOK';
            } else {
              const currentProgress = LessonSequencer.getProgress(stage, subject, topic);
              targetPedagogicalStage = currentProgress.stage;
            }
          }

          // Build pedagogy-sequenced question template anchored in Oak curriculum
          const sequencedTemplate = LessonSequencer.buildStageQuestion({
            keyStage: stage,
            subject,
            unit: topic,
            stage: targetPedagogicalStage,
            seedToken: activeSeedToken,
            knowledge: offlineKnowledge,
            excludePrompt,
            lessonTitle,
            lessonId,
          });

          const currentVariant = fallbackVariantMap.get(topicCacheKey) || 0;
          fallbackVariantMap.set(topicCacheKey, currentVariant + 1);

          const fallbackData = (!routeQuestion && !offlineKnowledge)
            ? getIntelligentTopicFallback(stage, subject, topic, currentVariant)
            : null;

          let basePrompt: string;
          let rawOptions: string[];
          let rawAnswerKey: number;
          let rawMisconceptions: string[];

          if (routeQuestion && !activeSeedToken.startsWith('SOCRATIC-')) {
            recentTopicQuestionMap.set(topicCacheKey, routeQuestion.prompt.trim());
            basePrompt = routeQuestion.prompt;
            rawOptions = [...routeQuestion.options];
            rawAnswerKey = typeof routeQuestion.answerKey === 'number' ? routeQuestion.answerKey : 0;
            rawMisconceptions = [...routeQuestion.misconceptions];

            if (payload?.forceVariation) {
              const masteryVariations = [
                `🔄 [Mastery Check] ${routeQuestion.prompt}`,
                `🎯 [Concept Application] ${routeQuestion.prompt}`,
                `💡 [Deepening Understanding] ${routeQuestion.prompt}`,
              ];
              basePrompt = prng.pick(masteryVariations);
            }
          } else if (activeSeedToken.startsWith('SOCRATIC-') && (route?.socraticPivot || offlineKnowledge?.socraticPivot)) {
            basePrompt = `⚖️ [Cognitive Counter-Proof] ${route?.socraticPivot || offlineKnowledge?.socraticPivot}`;
            rawOptions = sequencedTemplate.options;
            rawAnswerKey = sequencedTemplate.answerKey;
            rawMisconceptions = sequencedTemplate.misconceptions;
          } else {
            basePrompt = sequencedTemplate.prompt || fallbackData?.prompt || `What is the key principle of ${topic}?`;
            rawOptions = sequencedTemplate.options.length >= 2
              ? [...sequencedTemplate.options]
              : (fallbackData ? [...fallbackData.options] : ['Accurate conceptual rule', 'Common misconception', 'Opposite condition', 'Unrelated property']);
            rawAnswerKey = sequencedTemplate.options.length >= 2
              ? sequencedTemplate.answerKey
              : (fallbackData ? fallbackData.answerKey : 0);
            rawMisconceptions = sequencedTemplate.misconceptions && sequencedTemplate.misconceptions.length === rawOptions.length
              ? sequencedTemplate.misconceptions
              : (fallbackData ? fallbackData.misconceptions : rawOptions.map((opt, idx) => {
                  if (idx === rawAnswerKey) return 'Correct! Accurately applies foundational curriculum rules.';
                  return `Common trap: ${route?.cognitiveTrap || offlineKnowledge?.cognitiveTrap || 'Confuses core subject definition or conditions.'}`;
                }));
          }

          const displayPrompt = basePrompt;

          let resultCandidate = {
            id: routeQuestion ? routeQuestion.id : `q_${activeSeedToken}`,
            seedToken: activeSeedToken,
            urn: route?.urn || `urn:curriculum:${stage}:${subject}:${topic}`,
            csn: route?.csn || `CSN-${(stage || 'KS').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3)}-GEN`,
            routeEngine: route?.executionEngine || 'curriculum_bank',
            pedagogicalStage: routeQuestion ? 'PRACTICE' : targetPedagogicalStage,
            stageBadge: route ? `${route.stageTitle} • ${route.subjectTitle}` : `${stage} • ${subject}`,
            stepLabel: route?.topicTitle || offlineKnowledge?.title || topic,
            pedagogicalIntent: routeQuestion ? 'Verified Oak National Academy curriculum application question.' : sequencedTemplate.pedagogicalIntent,
            axiom: route?.axiom || offlineKnowledge?.coreAxiom || sequencedTemplate.axiom || `Core curriculum rule established for ${topic} at ${stage}.`,
            trap: route?.cognitiveTrap || offlineKnowledge?.cognitiveTrap || sequencedTemplate.trap || `Common misconception regarding ${topic}.`,
            hook: route?.hook || offlineKnowledge?.hook || sequencedTemplate.hook || `How does ${topic} operate in everyday reality?`,
            guidedStep: route?.guidedStep || offlineKnowledge?.guidedStep || sequencedTemplate.guidedStep || `Analyze the core properties and behaviors of ${topic}.`,
            prompt: displayPrompt,
            options: rawOptions,
            answerKey: rawAnswerKey,
            hint: routeQuestion?.hint || sequencedTemplate.hint || fallbackData?.hint || route?.scaffoldHints?.level1 || offlineKnowledge?.scaffoldHints?.level1 || 'Focus on foundational concepts.',
            explanation: routeQuestion?.explanation || sequencedTemplate.explanation || fallbackData?.explanation || route?.axiom || offlineKnowledge?.coreAxiom || 'Review the core definition.',
            misconceptions: rawMisconceptions,
            socraticFollowUp: route?.socraticPivot || offlineKnowledge?.socraticPivot || sequencedTemplate.socraticFollowUp || `Can you identify the defining feature of ${topic}?`,
            scaffoldHints: route?.scaffoldHints || offlineKnowledge?.scaffoldHints,
            difficulty,
            scratchpad: '',
          };

          // 3. Supervised Inference (Only if Prompt API is natively present & consented to)
          let synthesized = false;

          // 3a. First check IndexedDB AST Bank for a pre-buffered, verified question for this topic
          try {
            const topicKey = `${stage}_${subject}_${topic}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
            const bufferedAST = await getBufferedQuestion(topicKey, excludePrompt);
            if (bufferedAST) {
              const extracted = extractQuestionFromAst(bufferedAST);
              if (extracted && extracted.options.length >= 2 && (!excludePrompt || extracted.prompt.trim() !== excludePrompt.trim())) {
                resultCandidate = {
                  ...resultCandidate,
                  prompt: extracted.prompt,
                  options: extracted.options,
                  answerKey: extracted.answerKey >= 0 ? extracted.answerKey : 0,
                  hint: extracted.hint || resultCandidate.hint,
                  misconceptions: extracted.misconceptions || resultCandidate.misconceptions,
                  socraticFollowUp: extracted.socraticFollowUp || resultCandidate.socraticFollowUp,
                };
                synthesized = true;
              }
            }
          } catch {}

          if (!synthesized && aiCaller.isPromptApiAvailableSync()) {
            const pedagogicalAngles = [
              'Real-World Scenario / Practical Application',
              'Diagnostic Misconception Trap (tests why plausible incorrect reasoning fails)',
              'Cause-and-Effect Relationship (investigating what happens when a variable or condition changes)',
              'Comparative Evaluation / Distinguishing Between Closely Related Concepts',
              'Step-by-Step Analytical Deduction'
            ];
            const chosenAngle = pedagogicalAngles[Math.floor(Math.random() * pedagogicalAngles.length)];
            const randomSeed = Math.floor(Math.random() * 100000);

            try {
              const vmResult = await hypervisor.executeInference({
                keyStage: stage,
                subject,
                unit: topic,
                curriculum,
                difficulty,
                lang,
                angle: chosenAngle,
                seed: randomSeed,
                timeoutMs: 15000,
                excludePrompt,
              });

              if (vmResult.ok && vmResult.question && vmResult.question.prompt.trim() !== excludePrompt) {
                resultCandidate = {
                  ...resultCandidate,
                  ...vmResult.question,
                  options: vmResult.question.options,
                  answerKey: vmResult.question.answerKey,
                  prompt: vmResult.question.prompt,
                };
                synthesized = true;
              }
            } catch {
              // Guest VM offline or timed out: fall back smoothly without console warnings
            }

            if (!synthesized) {
              try {
                // Fetch dynamic topic adapter from IndexedDB if present for few-shot guidance
                const topicKey = `${subject}_${topic}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                const adapter = await getTopicAdapter(topicKey).catch(() => null);
                const guardrails = adapter?.curriculumGuardrails?.join('; ') || '';
                const exemplarAST = adapter?.exemplarAST ? `\nReference AST Pattern: ${adapter.exemplarAST}` : '';

                // Project question into the Mind Space cognitive frame
                const projectedMindSpace = MindSpaceEngine.projectMindSpace({
                  keyStage: stage,
                  subject,
                  unit: topic,
                  prompt: offlineKnowledge?.questions?.[0]?.prompt || `Question regarding ${topic}`,
                  options: offlineKnowledge?.questions?.[0]?.options || ['Axiom', 'Trap', 'Opposite', 'Other'],
                  answerKey: 0,
                });
                const mindSpaceDescriptor = MindSpaceEngine.formatMindSpaceContext(projectedMindSpace);

                const prompt = `Topic: "${topic}" (${stage} ${subject}, Framework: ${curriculum}).
Mind Space Cognitive Frame:
${mindSpaceDescriptor}
Focus Angle: ${chosenAngle} (Randomization Seed: #${randomSeed})
Age/Stage Guidelines: ${stageGuidelines}
Challenge Level: ${difficultyInstruction}
${langInstruction}
${guardrails ? `Curriculum Guardrails: "${guardrails}"\n` : ''}${exemplarAST}
${routeQuestion ? `Verified Oak Exemplar Template for This Topic:
- Exemplar Prompt: "${routeQuestion.prompt}"
- Exemplar Options: ${JSON.stringify(routeQuestion.options)}
- Exemplar Key Misconception / Explanation: "${routeQuestion.explanation}"
Instruction: Use this verified Oak exemplar as a grounding pattern. Create an authentic parallel variation with a fresh context or numbers testing the exact same core concept.\n` : ''}
First, anchor your reasoning in this question's Mind Space: analyze why the core axiom holds and which authentic pupil misconception pulls students toward each distractor.
Then generate an interactive diagnostic multiple-choice question testing understanding of this exact cognitive frame.
Rule: Every distractor MUST target an authentic student misconception defined in the Mind Space.
${excludePrompt ? `Anti-Repetition Rule: Do NOT reuse or mirror this prior question stem: "${excludePrompt}"\n` : ''}Return strictly a single JSON object with no Markdown:
{
  "scratchpad": "Step-by-step reasoning on correct answer and diagnostic trap explanations",
  "axiom": "Stage-appropriate core rule",
  "trap": "Accurate pupil misconception",
  "hook": "Relatable real-world inquiry scenario",
  "guidedStep": "Practical or analytical activity",
  "prompt": "Direct multiple-choice question stem",
  "options": ["Correct answer", "Misconception distractor 1", "Misconception distractor 2", "Boundary distractor 3"],
  "misconceptions": [
    "Correct! Accurately applies the principle.",
    "Misconception explanation for why distractor 1 was chosen",
    "Misconception explanation for why distractor 2 was chosen",
    "Misconception explanation for why distractor 3 was chosen"
  ],
  "answerKey": 0,
  "hint": "Gentle Socratic clue guiding away from the misconception without giving answer",
  "socraticFollowUp": "Simpler scaffolding sub-question if the pupil gets stuck"
}`;

                const rawResponse = await aiCaller.promptText({
                  prompt,
                  systemPrompt: `You are an expert UK National Curriculum Educator anchored in the Mind Space of ${stage} ${subject}. ${stageGuidelines}. ${difficultyInstruction}. ${langInstruction}. Output strictly valid JSON with no markdown formatting or commentary.`,
                  preserveContext: false,
                  timeoutMs: 12000,
                });

                const match = rawResponse.match(/\{[\s\S]*?\}/);
                if (match) {
                  const parsed = JSON.parse(match[0]);
                  if (parsed.options && Array.isArray(parsed.options) && parsed.options.length >= 2) {
                    if (!excludePrompt || (parsed.prompt && parsed.prompt.trim() !== excludePrompt.trim())) {
                      resultCandidate = {
                        ...resultCandidate,
                        ...parsed,
                      };
                      synthesized = true;
                    }
                  }
                }
              } catch {
                // Silently proceed to verified governed candidate
              }
            }
          }

          // 4. Pass candidate through AST Flow Governor to guarantee syntax, deduping, and arithmetic verification
          const governed = ASTFlowGovernor.govern(
            {
              prompt: resultCandidate.prompt,
              options: resultCandidate.options,
              answerKey: resultCandidate.answerKey,
              scratchpad: (resultCandidate as any).scratchpad,
              hint: resultCandidate.hint,
              explanation: resultCandidate.explanation,
              misconceptions: resultCandidate.misconceptions,
              socraticFollowUp: resultCandidate.socraticFollowUp,
            },
            subject,
            topic
          );

          if (governed.isValid && governed.sanitizedQuestion) {
            resultCandidate = {
              ...resultCandidate,
              prompt: governed.sanitizedQuestion.prompt,
              options: governed.sanitizedQuestion.options,
              answerKey: governed.sanitizedQuestion.answerKey,
              scratchpad: governed.sanitizedQuestion.scratchpad || (resultCandidate as any).scratchpad,
              hint: governed.sanitizedQuestion.hint || resultCandidate.hint,
              explanation: governed.sanitizedQuestion.explanation || resultCandidate.explanation,
              misconceptions: governed.sanitizedQuestion.misconceptions || resultCandidate.misconceptions,
              socraticFollowUp: governed.sanitizedQuestion.socraticFollowUp || resultCandidate.socraticFollowUp,
            };
          }

          // 5. If target language is non-English, ensure question content is translated
          if (lang && lang !== 'en') {
            try {
              const translated = await translateQuestionData(
                {
                  prompt: resultCandidate.prompt,
                  displayOptions: resultCandidate.options,
                  hint: resultCandidate.hint,
                  explanation: resultCandidate.explanation,
                },
                lang
              );

              return {
                ...resultCandidate,
                prompt: translated.prompt,
                options: translated.displayOptions,
                hint: translated.hint,
                explanation: translated.explanation,
              };
            } catch (err) {
              // Gracefully keep resultCandidate in default English
            }
          }

          if (excludePrompt && resultCandidate.prompt.trim() === excludePrompt) {
            if (offlineKnowledge?.socraticPivot) {
              resultCandidate.prompt = `🤔 [Diagnostic Inquiry] ${offlineKnowledge.socraticPivot}`;
            } else if (offlineKnowledge?.hook) {
              resultCandidate.prompt = `🌍 [Real-World Application] ${offlineKnowledge.hook}`;
            } else {
              resultCandidate.prompt = `🔄 [Parallel Concept] ${resultCandidate.prompt}`;
            }
          }

          if (resultCandidate?.prompt) {
            recentTopicQuestionMap.set(topicCacheKey, resultCandidate.prompt.trim());
          }

          return resultCandidate;
        }
        throw new Error(`Unknown QuestionEngine intent: "${intent}"`);
      },
    },
  ],

  // Lesson Synthesis Node (IndexedDB Cache + Gemini Nano Full Narrative Expansion)
  [
    'lessonsynthesizer',
    {
      execute: async (intent: string, payload: any) => {
        const stage = payload?.stage || payload?.keyStage || 'Key Stage 1';
        const subject = payload?.subject || 'Science';
        const topic = payload?.topic || payload?.title || payload?.unit || 'General Topic';
        const lang = payload?.lang || 'en';
        const lessonKey = `${stage}:${subject}:${topic}`.toLowerCase().replace(/\s+/g, '-');
        const stageGuidelines = getStageGuidelines(stage);

        if (intent === 'inflate:baseline') {
          const cached = await getBufferedLesson(lessonKey);
          let recordToReturn: CachedLessonRecord;
          if (cached) {
            recordToReturn = cached;
          } else {
            const baselineRecord: CachedLessonRecord = {
              key: lessonKey,
              title: topic,
              stage,
              subject,
              axiom: payload?.axiom || '',
              trap: payload?.trap || '',
              hook: payload?.hook || '',
              guidedStep: payload?.guidedStep || '',
              socraticCheck: payload?.socraticCheck || '',
              fullText: payload?.fullText || '',
              updatedAt: Date.now(),
            };

            if (payload?.axiom && !payload.axiom.startsWith('Core curriculum rule')) {
              await putBufferedLesson(baselineRecord);
            }
            recordToReturn = baselineRecord;
          }

          if (lang && lang !== 'en') {
            try {
              const translated = await translateLessonData(
                {
                  title: recordToReturn.title,
                  axiom: recordToReturn.axiom,
                  trap: recordToReturn.trap,
                  hook: recordToReturn.hook,
                  guidedStep: recordToReturn.guidedStep,
                  socraticCheck: recordToReturn.socraticCheck,
                  fullText: recordToReturn.fullText,
                },
                lang
              );
              return {
                ...recordToReturn,
                ...translated,
              };
            } catch {
              // Return original record
            }
          }

          return recordToReturn;
        }

        if (intent === 'synthesize:full-lesson') {
          const cached = await getBufferedLesson(lessonKey);
          if (cached?.fullText && cached.fullText.trim().length > 20) {
            let resObj = {
              ...cached,
              content: cached.fullText,
              fullText: cached.fullText,
            };
            if (lang && lang !== 'en') {
              const trans = await translateLessonData(
                {
                  title: resObj.title,
                  axiom: resObj.axiom,
                  trap: resObj.trap,
                  hook: resObj.hook,
                  guidedStep: resObj.guidedStep,
                  socraticCheck: resObj.socraticCheck,
                  fullText: resObj.fullText,
                },
                lang
              );
              resObj = { ...resObj, ...trans, content: trans.fullText || resObj.content };
            }
            return resObj;
          }

          const langMeta = SUPPORTED_LANGUAGES[lang];
          const langInstruction = lang !== 'en' && langMeta ? `\nLanguage Requirement: ${langMeta.promptCondition}` : '';
          const prompt = `You are Super Teacher Nano, an expert UK Curriculum Educator.
Target Level: ${stage.toUpperCase()} • Subject: ${subject} • Topic: ${topic}
Age/Stage Guidelines: ${stageGuidelines}
Core Ground Truth: "${payload?.axiom || 'Fundamental curriculum standard'}"
Specific Misconception: "${payload?.trap || 'Common intuitive error'}"
${langInstruction}

Generate a comprehensive 4-part lesson plan in clear Markdown:
### 1. Conceptual Narrative
Explain the core principles in depth strictly matching the curriculum depth for ${stage}.

### 2. Worked Example & Demonstration
Step-by-step practical demonstration or analytical calculation suitable for this key stage.

### 3. Misconception Breakdown
Directly dismantle why "${payload?.trap || 'the intuitive error'}" is incorrect.

### 4. Socratic Check-In
One reflective question to verify understanding.`;

          let generatedText = '';

          if (aiCaller.isPromptApiAvailableSync()) {
            try {
              generatedText = await aiCaller.promptText({
                prompt,
                systemPrompt: `You are Super Teacher Nano. Return comprehensive structured UK curriculum lessons in clear Markdown strictly adhering to ${stageGuidelines}`,
                preserveContext: false,
                timeoutMs: 4000,
              });
            } catch {
              // Silently degrade to deterministic structured narrative
            }
          }

          if (!generatedText) {
            generatedText = `### ${topic}\n\n**1. Conceptual Narrative**\n${payload?.axiom || 'Core understanding of this topic.'}\n\n**2. Guided Demonstration**\n${payload?.steps?.[1] || 'Explore the properties and behaviors in detail.'}\n\n**3. Misconception Breakdown**\nMany students believe that "${payload?.trap || 'an incorrect assumption'}". In practice, we evaluate the evidence.\n\n**4. Socratic Check**\n${payload?.steps?.[2] || 'How would you explain this in your own words?'}`;
          }

          const cleanResult = generatedText.trim();

          const updatedRecord: CachedLessonRecord = {
            ...(cached || {
              key: lessonKey,
              title: topic,
              stage,
              subject,
              axiom: payload?.axiom || '',
              trap: payload?.trap || '',
              hook: payload?.steps?.[0] || '',
              guidedStep: payload?.steps?.[1] || '',
              socraticCheck: payload?.steps?.[2] || '',
            }),
            fullText: cleanResult,
            updatedAt: Date.now(),
          };

          try {
            await putBufferedLesson(updatedRecord);
          } catch {
            // Memory-only mode
          }

          return {
            ...updatedRecord,
            content: cleanResult,
            fullText: cleanResult,
          };
        }

        throw new Error(`Unknown LessonSynthesizer intent: "${intent}"`);
      },
    },
  ],

  // UI Toast & Socratic Feedback Substrate
  [
    'feedbacksubstrate',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'emit:toast') {
          ComponentsFlow.emitFeedback(payload.text, payload.isCorrect);
          return true;
        }
        throw new Error(`Unknown FeedbackSubstrate intent: "${intent}"`);
      },
    },
  ],

  // Telemetry & Metrics Node
  [
    'telemetrynode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'record:answer') {
          await ComponentsFlow.recordProgress({
            cohortCode: payload.cohortCode,
            challengeId: payload.challengeId,
            topicId: payload.topicId,
            isCorrect: payload.isCorrect,
            userAnswer: payload.userAnswer,
            seedToken: payload.seedToken,
            selectedCoordinate: payload.selectedCoordinate,
            correctCoordinate: payload.correctCoordinate,
            misconceptionTag: payload.misconceptionTag,
          });
          return true;
        }
        throw new Error(`Unknown TelemetryNode intent: "${intent}"`);
      },
    },
  ],

  // Diagnostic Reporting Engine
  [
    'reportengine',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'export:html') {
          const summary = await generateSessionReport(payload.sessionId);
          downloadReportAsHtml(summary);
          return true;
        }
        throw new Error(`Unknown ReportEngine intent: "${intent}"`);
      },
    },
  ],

  // Hypervisor Supervisory Control Node
  [
    'hypervisornode',
    {
      execute: async (intent: string, payload: any) => {
        if (intent === 'get:status') {
          return {
            state: hypervisor.getState(),
            metrics: hypervisor.getMetrics(),
          };
        }
        if (intent === 'reset:guest') {
          hypervisor.resetGuestInstance();
          return { ok: true };
        }
        if (intent === 'execute:inference') {
          return await hypervisor.executeInference(payload);
        }
        throw new Error(`Unknown HypervisorNode intent: "${intent}"`);
      },
    },
  ],
]);

/**
 * Universal Primitive: Single point of dispatch for all substrate nodes.
 * Supports both signatures:
 *   - dispatch('questionengine', { intent: 'synthesize:governed', payload: ... })
 *   - dispatch({ intent: 'synthesize:governed', payload: ... })  [infers node from intent]
 */
export async function dispatch(
  targetOrMessage: string | HyperMessage,
  maybeMessage?: HyperMessage
): Promise<HyperNodeResult> {
  let targetNode: string;
  let message: HyperMessage;

  if (typeof targetOrMessage === 'string') {
    targetNode = targetOrMessage;
    message = maybeMessage || { intent: '' };
  } else {
    message = targetOrMessage;
    // Automatically infer target substrate node from intent namespace
    const intent = message?.intent || '';
    if (intent.startsWith('synthesize:') || intent.startsWith('question:')) {
      targetNode = 'questionengine';
    } else if (intent.startsWith('curriculum:')) {
      targetNode = 'curriculumnode';
    } else if (intent.startsWith('telemetry:')) {
      targetNode = 'telemetrynode';
    } else if (intent.startsWith('report:') || intent.startsWith('export:')) {
      targetNode = 'reportengine';
    } else if (intent.startsWith('hypervisor:') || intent.startsWith('execute:')) {
      targetNode = 'hypervisornode';
    } else {
      targetNode = 'questionengine';
    }
  }

  const symbol = (targetNode || '').toLowerCase();
  const node = AST_NODE_MAP.get(symbol);

  if (!node) {
    console.error(`[Hypercall] Unreachable target node: "${targetNode}"`);
    return { ok: false, error: `AST Node '${targetNode}' not reachable in substrate.` };
  }

  try {
    const result = await node.execute(message.intent, message.payload);
    return { ok: true, data: result };
  } catch (err: any) {
    console.error('[Hypercall Execution Error]', { target: targetNode, intent: message?.intent, err });
    return { ok: false, error: err?.message || 'Unknown substrate execution error' };
  }
}

// Wire the Universal Dispatcher to the Hypervisor Host for guest VM hypercalls (VM-exits)
setHypercallDispatcher(dispatch);