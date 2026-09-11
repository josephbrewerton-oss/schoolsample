// src/engine/hypercall.ts
import { dispatchAstIntent, CurriculumPackage } from '../curriculum';
import { EngineFlow } from './engineflow';
import { ComponentsFlow } from '../components/componentsFlow';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getBufferedLesson, putBufferedLesson, CachedLessonRecord } from '../services/dbStore';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { aiCaller } from './aicaller';
import { findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';
import { translateQuestionData, translateLessonData } from './translationService';
import { SUPPORTED_LANGUAGES } from './operational-language';
import { MathQuestionGenerator } from './mathQuestionGenerator';
import { ASTFlowGovernor } from './astGovernor';
import { hypervisor, setHypercallDispatcher } from './hypervisor';

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
        if (intent === 'get:package') {
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
          const curriculum = payload?.curriculum || 'uk_oak';
          const difficulty = (payload?.difficulty || 'challenger') as 'warmup' | 'challenger' | 'brainbuster';
          const lang = payload?.lang || 'en';
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

          // 1. Deterministic Fast-Path for Mathematics & Calculations (< 1ms, 0% hallucination)
          if (MathQuestionGenerator.isMathSubject(subject, topic)) {
            const mathQ = MathQuestionGenerator.generate(stage, topic);
            let mathCandidate = {
              id: mathQ.id,
              axiom: `Standard mathematical operations and principles for ${stage}.`,
              trap: `Common procedural or conceptual calculation slips.`,
              hook: `How do numbers and mathematical rules structure real-world quantities?`,
              guidedStep: `Work through the calculation step-by-step applying precedence rules.`,
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

          // 2. Query verified offline curriculum knowledge base
          const offlineKnowledge = findCurriculumKnowledge(stage, subject, topic);
          let offlineQuestion = null;
          if (offlineKnowledge && offlineKnowledge.questions.length > 0) {
            const qIdx = Math.floor(Math.random() * offlineKnowledge.questions.length);
            offlineQuestion = offlineKnowledge.questions[qIdx];
          }

          const basePrompt = offlineQuestion?.prompt || offlineKnowledge?.socraticPivot || `What is the key principle of ${topic}?`;
          const displayPrompt = difficulty === 'brainbuster' 
            ? `🧠 [Brain Buster] ${basePrompt}` 
            : difficulty === 'warmup' 
            ? `🌱 [Warm-Up] ${basePrompt}` 
            : basePrompt;

          let rawOptions = offlineQuestion ? [...offlineQuestion.options] : ['Accurate conceptual rule', 'Common misconception', 'Opposite condition', 'Unrelated property'];
          let rawAnswerKey = offlineQuestion !== null ? offlineQuestion.answerKey : 0;
          let rawMisconceptions: string[] = rawOptions.map((opt, idx) => {
            if (idx === rawAnswerKey) return 'Correct! Accurately applies foundational curriculum rules.';
            return `Common trap: ${offlineKnowledge?.cognitiveTrap || 'Confuses core subject definition or conditions.'}`;
          });

          let resultCandidate = {
            axiom: offlineKnowledge?.coreAxiom || `Core curriculum rule established for ${topic} at ${stage}.`,
            trap: offlineKnowledge?.cognitiveTrap || `Common misconception regarding ${topic}.`,
            hook: offlineKnowledge?.hook || `How does ${topic} operate in everyday reality?`,
            guidedStep: offlineKnowledge?.guidedStep || `Analyze the core properties and behaviors of ${topic}.`,
            prompt: displayPrompt,
            options: rawOptions,
            answerKey: rawAnswerKey,
            hint: offlineQuestion?.hint || offlineKnowledge?.scaffoldHints.level1 || 'Focus on foundational concepts.',
            explanation: offlineQuestion?.explanation || offlineKnowledge?.scaffoldHints.level2 || 'Review the core definition.',
            misconceptions: rawMisconceptions,
            socraticFollowUp: offlineKnowledge?.socraticPivot || `Can you identify the defining feature of ${topic}?`,
            scaffoldHints: offlineKnowledge?.scaffoldHints,
            difficulty,
          };

          // 3. Primary Execution: Supervised Guest VM Inference with Armed Watchdog
          let synthesized = false;
          try {
            const vmResult = await hypervisor.executeInference({
              keyStage: stage,
              subject,
              unit: topic,
              curriculum,
              difficulty,
              lang,
              timeoutMs: 28000,
            });

            if (vmResult.ok && vmResult.question) {
              resultCandidate = {
                ...resultCandidate,
                ...vmResult.question,
                options: vmResult.question.options,
                answerKey: vmResult.question.answerKey,
                prompt: vmResult.question.prompt,
              };
              synthesized = true;
            }
          } catch (vmErr) {
            // Guest VM offline or timed out: try local prompt or fallback smoothly
          }

          // If Guest VM was offline, attempt local browser prompt or fallback to verified offline curriculum
          if (!synthesized) {
            try {
              const prompt = `Topic: "${topic}" (${stage} ${subject}, Framework: ${curriculum}).
Age/Stage Guidelines: ${stageGuidelines}
Challenge Level: ${difficultyInstruction}
${langInstruction}
${offlineKnowledge ? `Ground Truth Axiom: "${offlineKnowledge.coreAxiom}"\nKnown Pupil Misconception: "${offlineKnowledge.cognitiveTrap}"` : ''}

Generate an interactive diagnostic multiple-choice question and pedagogical feedback.
Rule: Every distractor MUST target an authentic student misconception.
Return strictly a single JSON object with no Markdown:
{
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
                systemPrompt: `You are an expert UK National Curriculum Educator specializing in ${stage} ${subject}. ${stageGuidelines}. ${difficultyInstruction}. ${langInstruction}. Output strictly valid JSON with no markdown formatting or commentary.`,
                preserveContext: false,
              });

              const match = rawResponse.match(/\{[\s\S]*?\}/);
              if (match) {
                const parsed = JSON.parse(match[0]);
                if (parsed.options && Array.isArray(parsed.options) && parsed.options.length >= 2) {
                  resultCandidate = {
                    ...resultCandidate,
                    ...parsed,
                  };
                }
              }
            } catch (err) {
              // Offline / on-device LLM unready: use verified offline curriculum knowledge
            }
          }

          // 4. Pass candidate through AST Flow Governor to guarantee syntax, deduping, and arithmetic verification
          const governed = ASTFlowGovernor.govern(
            {
              prompt: resultCandidate.prompt,
              options: resultCandidate.options,
              answerKey: resultCandidate.answerKey,
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
              console.warn('[QuestionEngine Translation Fallback]:', err);
            }
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
            } catch (err) {
              console.warn('[Lesson Baseline Translation Fallback]:', err);
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

          try {
            generatedText = await aiCaller.promptText({
              prompt,
              systemPrompt: `You are Super Teacher Nano. Return comprehensive structured UK curriculum lessons in clear Markdown strictly adhering to ${stageGuidelines}`,
              preserveContext: false,
            });
          } catch (err) {
            console.warn('[Lesson Synthesis Fallback Activated]:', err);
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
          } catch (e) {
            console.warn('[DB putBufferedLesson Skip]:', e);
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
 * Universal Primitive: Single point of dispatch for all substrate nodes
 */
export async function dispatch(
  target: string,
  message: HyperMessage
): Promise<HyperNodeResult> {
  const symbol = target.toLowerCase();
  const node = AST_NODE_MAP.get(symbol);

  if (!node) {
    console.error(`[Hypercall] Unreachable target node: "${target}"`);
    return { ok: false, error: `AST Node '${target}' not reachable in substrate.` };
  }

  try {
    const result = await node.execute(message.intent, message.payload);
    return { ok: true, data: result };
  } catch (err: any) {
    console.error(`[Hypercall Execution Error] Target: "${target}", Intent: "${message.intent}"`, err);
    return { ok: false, error: err?.message || 'Unknown substrate execution error' };
  }
}

// Wire the Universal Dispatcher to the Hypervisor Host for guest VM hypercalls (VM-exits)
setHypercallDispatcher(dispatch);