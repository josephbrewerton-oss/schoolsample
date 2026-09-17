// src/engine/lessonSequencer.ts
/**
 * St Joseph's Lesson Sequencer & Pedagogical Flow Engine
 * 
 * Orchestrates pedagogical progression from Oak National Curriculum concepts
 * through to mastery:
 * 
 * 1. HOOK (Ignition / Real-World Engagement):
 *    Presents a relatable, curiosity-sparking scenario grounded in everyday experience.
 * 
 * 2. AXIOM (Core Principle & Ground Truth):
 *    Diagnostic verification of the invariant scientific, mathematical, or literary law.
 * 
 * 3. PRACTICE (Application & Distractor Navigation):
 *    Standard contextual application where pupils navigate authentic misconceptions.
 * 
 * 4. SOCRATIC_PIVOT (Decoupling / Remediation):
 *    Triggered dynamically if a misconception is selected, presenting counter-intuitive
 *    probes to reveal why the distractor fails.
 * 
 * 5. MASTERY (Transfer & Synthesis / Brain Buster):
 *    High-order transfer challenge or edge-case reasoning verifying deep retention.
 */

import { CurriculumTopicKnowledge, findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';
import { PRNG } from './prng';

export type PedagogicalStage = 'HOOK' | 'AXIOM' | 'PRACTICE' | 'SOCRATIC_PIVOT' | 'MASTERY';

export interface LessonProgressState {
  topicKey: string;
  stage: PedagogicalStage;
  stepNumber: number; // 1 to 4+
  totalSteps: number; // typically 4
  attemptsOnCurrentStage: number;
  lastWasCorrect: boolean | null;
  activeMisconception?: string;
  consecutiveCorrect: number;
}

export interface SequencedQuestionTemplate {
  pedagogicalStage: PedagogicalStage;
  stageBadge: string;
  stepLabel: string;
  pedagogicalIntent: string;
  prompt: string;
  options: string[];
  answerKey: number;
  hint: string;
  explanation: string;
  misconceptions: string[];
  socraticFollowUp: string;
  difficulty: 'warmup' | 'challenger' | 'brainbuster';
  axiom?: string;
  trap?: string;
  hook?: string;
  guidedStep?: string;
}

// In-memory per-topic progression tracker
const topicProgressMap = new Map<string, LessonProgressState>();

export class LessonSequencer {
  /**
   * Generates a normalized topic cache key
   */
  public static getTopicKey(keyStage: string, subject: string, unit: string): string {
    return `${keyStage}_${subject}_${unit}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  }

  /**
   * Gets or initializes the pedagogical progression state for a given topic
   */
  public static getProgress(keyStage: string, subject: string, unit: string): LessonProgressState {
    const key = this.getTopicKey(keyStage, subject, unit);
    let state = topicProgressMap.get(key);
    if (!state) {
      state = {
        topicKey: key,
        stage: 'HOOK',
        stepNumber: 1,
        totalSteps: 4,
        attemptsOnCurrentStage: 0,
        lastWasCorrect: null,
        consecutiveCorrect: 0,
      };
      topicProgressMap.set(key, state);
    }
    return { ...state };
  }

  /**
   * Records a student attempt on the current question and computes the next pedagogical stage
   */
  public static recordAttempt(params: {
    keyStage: string;
    subject: string;
    unit: string;
    isCorrect: boolean;
    misconceptionTag?: string;
  }): LessonProgressState {
    const { keyStage, subject, unit, isCorrect, misconceptionTag } = params;
    const key = this.getTopicKey(keyStage, subject, unit);
    const current = this.getProgress(keyStage, subject, unit);

    let nextStage: PedagogicalStage = current.stage;
    let nextStepNumber = current.stepNumber;
    let nextConsecutive = isCorrect ? current.consecutiveCorrect + 1 : 0;

    if (isCorrect) {
      // Progress forward along the pedagogical arc
      switch (current.stage) {
        case 'HOOK':
          nextStage = 'AXIOM';
          nextStepNumber = 2;
          break;
        case 'AXIOM':
          nextStage = 'PRACTICE';
          nextStepNumber = 3;
          break;
        case 'SOCRATIC_PIVOT':
          // Decoupled the misconception! Advance back to practice or forward to mastery
          nextStage = current.consecutiveCorrect >= 1 ? 'MASTERY' : 'PRACTICE';
          nextStepNumber = nextStage === 'MASTERY' ? 4 : 3;
          break;
        case 'PRACTICE':
          nextStage = 'MASTERY';
          nextStepNumber = 4;
          break;
        case 'MASTERY':
          // Reached mastery! Loop or advance to deep transfer
          nextStage = 'MASTERY';
          nextStepNumber = 4;
          break;
      }
    } else {
      // Error detected: dynamically deploy targeted Socratic remediation
      if (current.stage === 'MASTERY' || current.stage === 'PRACTICE' || current.stage === 'AXIOM') {
        nextStage = 'SOCRATIC_PIVOT';
      }
    }

    const updatedState: LessonProgressState = {
      topicKey: key,
      stage: nextStage,
      stepNumber: nextStepNumber,
      totalSteps: 4,
      attemptsOnCurrentStage: current.stage === nextStage ? current.attemptsOnCurrentStage + 1 : 0,
      lastWasCorrect: isCorrect,
      activeMisconception: !isCorrect ? misconceptionTag : undefined,
      consecutiveCorrect: nextConsecutive,
    };

    topicProgressMap.set(key, updatedState);
    return updatedState;
  }

  /**
   * Resets progression for a topic (e.g. when learner restarts unit)
   */
  public static resetProgress(keyStage: string, subject: string, unit: string): LessonProgressState {
    const key = this.getTopicKey(keyStage, subject, unit);
    const fresh: LessonProgressState = {
      topicKey: key,
      stage: 'HOOK',
      stepNumber: 1,
      totalSteps: 4,
      attemptsOnCurrentStage: 0,
      lastWasCorrect: null,
      consecutiveCorrect: 0,
    };
    topicProgressMap.set(key, fresh);
    return fresh;
  }

  /**
   * Synthesizes a teaching-focused question template anchored in the Oak Curriculum
   * corresponding to the current pedagogical stage (Hook -> Axiom -> Practice -> Pivot -> Mastery)
   */
  public static buildStageQuestion(params: {
    keyStage: string;
    subject: string;
    unit: string;
    stage: PedagogicalStage;
    seedToken: string;
    knowledge?: CurriculumTopicKnowledge | null;
    excludePrompt?: string;
  }): SequencedQuestionTemplate {
    const { keyStage, subject, unit, stage, seedToken, knowledge, excludePrompt } = params;
    const prng = new PRNG(seedToken);

    const safeKnowledge = knowledge || findCurriculumKnowledge(keyStage, subject, unit);
    const cleanUnit = unit || safeKnowledge?.title || 'Core Topic';

    const coreAxiom = safeKnowledge?.coreAxiom || `Fundamental invariant principles govern ${cleanUnit}.`;
    const cognitiveTrap = safeKnowledge?.cognitiveTrap || `Confusing surface observations with foundational laws in ${cleanUnit}.`;
    const socraticPivot = safeKnowledge?.socraticPivot || `How does this principle behave when you test opposing conditions in ${cleanUnit}?`;
    const hook = safeKnowledge?.hook || `How does ${cleanUnit} shape events in everyday physical and practical reality?`;
    const guidedStep = safeKnowledge?.guidedStep || `Analyze the foundational components and rules of ${cleanUnit}.`;

    const baseQuestions = safeKnowledge?.questions || [];

    switch (stage) {
      case 'HOOK': {
        // Step 1: Hook / Inquiry Engagement
        const hookStem = `🌍 [Step 1: Real-World Hook] ${hook}`;
        const hookCorrect = `It connects directly to the foundational law: ${coreAxiom.slice(0, 100)}`;
        const hookDistractor1 = `It happens entirely by chance with zero predictable natural rules.`;
        const hookDistractor2 = `It only applies inside a laboratory and never in real daily life.`;
        const hookDistractor3 = `Common assumption: ${cognitiveTrap.slice(0, 85)}`;

        const options = [hookCorrect, hookDistractor3, hookDistractor1, hookDistractor2];
        const shuffled = prng.shuffle(options.map((opt, i) => ({ opt, originalIndex: i })));
        const answerKey = shuffled.findIndex((item) => item.originalIndex === 0);

        return {
          pedagogicalStage: 'HOOK',
          stageBadge: 'Step 1 of 4: Real-World Hook',
          stepLabel: 'Ignition & Practical Scenario',
          pedagogicalIntent: 'Ground the abstract Oak curriculum concept in tangible real-world observation.',
          prompt: hookStem,
          options: shuffled.map((s) => s.opt),
          answerKey: answerKey >= 0 ? answerKey : 0,
          hint: safeKnowledge?.scaffoldHints.level1 || 'Observe how this plays out in normal everyday experience.',
          explanation: `In daily life, ${hook} This anchors the core Oak curriculum principle: ${coreAxiom}`,
          misconceptions: shuffled.map((s) => {
            if (s.originalIndex === 0) return 'Correct! Connects real-world observations directly to the foundational rule.';
            if (s.originalIndex === 1) return `Misconception Trap: ${cognitiveTrap}`;
            return 'Common pitfall: Detaching real-world observations from physical laws.';
          }),
          socraticFollowUp: `Why do you think this happens in real life before looking at the textbook rule?`,
          difficulty: 'warmup',
          axiom: coreAxiom,
          trap: cognitiveTrap,
          hook,
          guidedStep,
        };
      }

      case 'AXIOM': {
        // Step 2: Foundational Axiom verification
        const axiomStem = `📐 [Step 2: Core Axiom] In ${keyStage} ${subject}, which statement expresses the fundamental rule of "${cleanUnit}"?`;
        const axiomCorrect = coreAxiom;
        const distractor1 = `Misconception: ${cognitiveTrap}`;
        const distractor2 = `The rule is arbitrary and inverts whenever conditions change slightly.`;
        const distractor3 = `It only holds true for single-item instances and fails across general cases.`;

        const options = [axiomCorrect, distractor1, distractor2, distractor3];
        const shuffled = prng.shuffle(options.map((opt, i) => ({ opt, originalIndex: i })));
        const answerKey = shuffled.findIndex((item) => item.originalIndex === 0);

        return {
          pedagogicalStage: 'AXIOM',
          stageBadge: 'Step 2 of 4: Core Axiom',
          stepLabel: 'Foundational Law & Mechanism',
          pedagogicalIntent: 'Verify understanding of the core invariant law from the Oak curriculum.',
          prompt: axiomStem,
          options: shuffled.map((s) => s.opt),
          answerKey: answerKey >= 0 ? answerKey : 0,
          hint: safeKnowledge?.scaffoldHints.level2 || 'Focus on the definition that holds true across all standard cases.',
          explanation: `Core Axiom: ${coreAxiom} This forms the essential baseline for all problem-solving in ${cleanUnit}.`,
          misconceptions: shuffled.map((s) => {
            if (s.originalIndex === 0) return 'Correct! Accurately identifies the foundational Oak curriculum axiom.';
            if (s.originalIndex === 1) return `Cognitive Trap: ${cognitiveTrap}`;
            return 'Plausible surface distractor: Violates invariant curriculum definitions.';
          }),
          socraticFollowUp: socraticPivot,
          difficulty: 'warmup',
          axiom: coreAxiom,
          trap: cognitiveTrap,
          hook,
          guidedStep,
        };
      }

      case 'SOCRATIC_PIVOT': {
        // Step Remediation: Socratic Counter-Example / Diagnostic Decoupler
        const pivotStem = `⚖️ [Diagnostic Counter-Proof] ${socraticPivot}`;
        const pivotCorrect = `Because ${coreAxiom.slice(0, 110)}`;
        const distractor1 = `Because ${cognitiveTrap.slice(0, 100)}`;
        const distractor2 = `Both outcomes are identical, so the distinction does not matter.`;
        const distractor3 = `Because physical laws depend on personal perspective.`;

        const options = [pivotCorrect, distractor1, distractor2, distractor3];
        const shuffled = prng.shuffle(options.map((opt, i) => ({ opt, originalIndex: i })));
        const answerKey = shuffled.findIndex((item) => item.originalIndex === 0);

        return {
          pedagogicalStage: 'SOCRATIC_PIVOT',
          stageBadge: 'Socratic Decoupler',
          stepLabel: 'Misconception Resolution',
          pedagogicalIntent: 'Expose why the common trap fails through targeted counter-inquiry.',
          prompt: pivotStem,
          options: shuffled.map((s) => s.opt),
          answerKey: answerKey >= 0 ? answerKey : 0,
          hint: safeKnowledge?.scaffoldHints.level1 || 'Imagine what would go wrong if the misconception were true.',
          explanation: `Counter-proof insight: If we applied the common trap, the system would collapse. ${coreAxiom}`,
          misconceptions: shuffled.map((s) => {
            if (s.originalIndex === 0) return 'Well reasoned! You successfully resolved the cognitive contradiction.';
            if (s.originalIndex === 1) return `This re-triggers the trap: ${cognitiveTrap}`;
            return 'Distractor: Avoids confronting the physical paradox.';
          }),
          socraticFollowUp: `Can you state in your own words why the trap answer fails?`,
          difficulty: 'challenger',
          axiom: coreAxiom,
          trap: cognitiveTrap,
          hook,
          guidedStep,
        };
      }

      case 'MASTERY': {
        // Step 4: Mastery Synthesis & Deep Transfer
        // Select either a second verified Oak question or create a Brain Buster challenge
        const altQuestion = baseQuestions.length > 1
          ? baseQuestions.find((q) => !excludePrompt || q.prompt.trim() !== excludePrompt.trim()) || baseQuestions[1]
          : null;

        if (altQuestion) {
          return {
            pedagogicalStage: 'MASTERY',
            stageBadge: 'Step 4 of 4: Deep Mastery',
            stepLabel: 'Transfer & Synthesis Challenge',
            pedagogicalIntent: 'Demonstrate deep independent transfer across new variable conditions.',
            prompt: `🧠 [Step 4: Deep Mastery] ${altQuestion.prompt}`,
            options: [...altQuestion.options],
            answerKey: altQuestion.answerKey,
            hint: altQuestion.hint || safeKnowledge?.scaffoldHints.level3 || 'Apply the full chain of reasoning you built in previous steps.',
            explanation: altQuestion.explanation || `Mastery achieved: ${coreAxiom}`,
            misconceptions: altQuestion.options.map((_, i) =>
              i === altQuestion.answerKey
                ? 'Mastery confirmed! Flawlessly synthesized all steps to reach the correct answer.'
                : `Misconception distractor: ${cognitiveTrap}`
            ),
            socraticFollowUp: `How would you explain this rule to someone who has never studied ${cleanUnit}?`,
            difficulty: 'brainbuster',
            axiom: coreAxiom,
            trap: cognitiveTrap,
            hook,
            guidedStep,
          };
        }

        const masteryStem = `🧠 [Step 4: Deep Mastery] When applying "${cleanUnit}" to complex or unfamiliar situations, which multi-step deduction confirms the correct outcome?`;
        const masteryCorrect = `${guidedStep} to ensure that ${coreAxiom.slice(0, 90)}`;
        const distractor1 = `Skip verifying definitions and assume the surface answer is always right.`;
        const distractor2 = `Assume that ${cognitiveTrap.slice(0, 90)}`;
        const distractor3 = `Apply rules from an entirely unrelated subject without adaptation.`;

        const options = [masteryCorrect, distractor1, distractor2, distractor3];
        const shuffled = prng.shuffle(options.map((opt, i) => ({ opt, originalIndex: i })));
        const answerKey = shuffled.findIndex((item) => item.originalIndex === 0);

        return {
          pedagogicalStage: 'MASTERY',
          stageBadge: 'Step 4 of 4: Deep Mastery',
          stepLabel: 'Transfer & Synthesis Challenge',
          pedagogicalIntent: 'Demonstrate deep independent transfer across new variable conditions.',
          prompt: masteryStem,
          options: shuffled.map((s) => s.opt),
          answerKey: answerKey >= 0 ? answerKey : 0,
          hint: safeKnowledge?.scaffoldHints.level3 || 'Synthesize the axiom and the guided step.',
          explanation: `Mastery synthesis: By combining ${guidedStep} with ${coreAxiom}, pupils attain deep, lasting conceptual understanding.`,
          misconceptions: shuffled.map((s) => {
            if (s.originalIndex === 0) return 'Outstanding! Complete pedagogical mastery demonstrated.';
            return `Distractor: Falls back into surface intuition or unverified assumptions.`;
          }),
          socraticFollowUp: `What other real-world systems follow this exact same structural logic?`,
          difficulty: 'brainbuster',
          axiom: coreAxiom,
          trap: cognitiveTrap,
          hook,
          guidedStep,
        };
      }

      case 'PRACTICE':
      default: {
        // Step 3: Standard Practice & Application (Primary Oak Question)
        const primaryQuestion = baseQuestions.length > 0 ? baseQuestions[0] : null;

        if (primaryQuestion) {
          return {
            pedagogicalStage: 'PRACTICE',
            stageBadge: 'Step 3 of 4: Applied Practice',
            stepLabel: 'Curriculum Application',
            pedagogicalIntent: 'Apply the verified axiom to standard curriculum problem scenarios.',
            prompt: `🎯 [Step 3: Applied Practice] ${primaryQuestion.prompt}`,
            options: [...primaryQuestion.options],
            answerKey: primaryQuestion.answerKey,
            hint: primaryQuestion.hint || safeKnowledge?.scaffoldHints.level2 || 'Recall the core axiom from Step 2.',
            explanation: primaryQuestion.explanation || `Application of core rule: ${coreAxiom}`,
            misconceptions: primaryQuestion.options.map((_, i) =>
              i === primaryQuestion.answerKey
                ? 'Correct! Solid application of the core curriculum principle.'
                : `Misconception Trap: ${cognitiveTrap}`
            ),
            socraticFollowUp: socraticPivot,
            difficulty: 'challenger',
            axiom: coreAxiom,
            trap: cognitiveTrap,
            hook,
            guidedStep,
          };
        }

        const practiceStem = `🎯 [Step 3: Applied Practice] How is "${cleanUnit}" applied to solve problems in ${subject}?`;
        const practiceCorrect = `By applying: ${coreAxiom.slice(0, 100)}`;
        const distractor1 = `By relying on: ${cognitiveTrap.slice(0, 100)}`;
        const distractor2 = `By guessing without checking initial conditions.`;
        const distractor3 = `By inverting the relationship between cause and effect.`;

        const options = [practiceCorrect, distractor1, distractor2, distractor3];
        const shuffled = prng.shuffle(options.map((opt, i) => ({ opt, originalIndex: i })));
        const answerKey = shuffled.findIndex((item) => item.originalIndex === 0);

        return {
          pedagogicalStage: 'PRACTICE',
          stageBadge: 'Step 3 of 4: Applied Practice',
          stepLabel: 'Curriculum Application',
          pedagogicalIntent: 'Apply the verified axiom to standard curriculum problem scenarios.',
          prompt: practiceStem,
          options: shuffled.map((s) => s.opt),
          answerKey: answerKey >= 0 ? answerKey : 0,
          hint: safeKnowledge?.scaffoldHints.level2 || 'Apply the core axiom to solve this case.',
          explanation: `Consistent practice strengthens retention: ${coreAxiom}`,
          misconceptions: shuffled.map((s) => {
            if (s.originalIndex === 0) return 'Correct! Accurately applies the principle to the scenario.';
            if (s.originalIndex === 1) return `Cognitive Trap: ${cognitiveTrap}`;
            return 'Incorrect application: Fails to preserve foundational relationships.';
          }),
          socraticFollowUp: socraticPivot,
          difficulty: 'challenger',
          axiom: coreAxiom,
          trap: cognitiveTrap,
          hook,
          guidedStep,
        };
      }
    }
  }
}
