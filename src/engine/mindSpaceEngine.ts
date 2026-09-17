// src/engine/mindSpaceEngine.ts
/**
 * St Joseph's "Mind Space" Cognitive Frame Engine
 * 
 * Defines the holistic mental model and cognitive geometry for any question:
 * 1. Cognitive Frame (Axiom truth, Trap vectors, Boundary edge cases)
 * 2. Learner Misconception Archetypes (Intuitive traps vs. systematic calculation traps)
 * 3. Counter-Intuitive Proof vectors (how to illuminate why the distractor collapses)
 * 4. Coordinate Resonance (evaluating user coordinate choices within this frame)
 */

import { findCurriculumKnowledge, CurriculumTopicKnowledge } from '../data/oakCurriculumKnowledge';

export interface MindSpaceCoordinates {
  x: number; // -1.0 (intuitive misconception) to +1.0 (rigorous axiomatic logic)
  y: number; // -1.0 (rote surface fact) to +1.0 (deep structural transfer)
  z: number; // 0.0 (baseline) to 1.0 (edge-case / counter-proof pressure)
}

export interface CognitiveDistractorVector {
  coordinate: number; // 0, 1, 2, 3
  text: string;
  isCorrect: boolean;
  misconceptionArchetype: string;
  trapPlausibilityRating: number; // 0.0 to 1.0 (how tempting is this to a student?)
  counterProofHint: string; // The exact question or insight that exposes why this fails
  mindCoordinate: MindSpaceCoordinates;
}

export interface QuestionMindSpace {
  topicId: string;
  subject: string;
  keyStage: string;
  title: string;
  coreAxiom: string; // The invariant ground truth
  cognitiveTrap: string; // The primary mental trap
  socraticPivot: string; // The counter-inquiry probe
  scaffoldStack: {
    intuitiveAnalogy: string;
    formalRule: string;
    stepProof: string;
  };
  promptStem: string;
  distractorVectors: CognitiveDistractorVector[];
  activeLearnerCoordinate?: number;
  currentMentalState?: {
    diagnosis: string;
    resonanceAngle: 'axiomatic_mastery' | 'intuitive_trap' | 'procedural_inversion' | 'uncalibrated_guess';
    recommendedNextVector: string;
  };
}

export class MindSpaceEngine {
  /**
   * Constructs the full "Mind Space" for a given curriculum unit and question
   */
  static projectMindSpace(params: {
    keyStage: string;
    subject: string;
    unit: string;
    prompt: string;
    options: string[];
    answerKey: number;
    misconceptions?: string[];
    selectedCoordinate?: number | null;
  }): QuestionMindSpace {
    const { keyStage, subject, unit, prompt, options, answerKey, misconceptions, selectedCoordinate } = params;
    const knowledge: CurriculumTopicKnowledge | undefined = findCurriculumKnowledge(keyStage, subject, unit);

    const coreAxiom = knowledge?.coreAxiom || `Fundamental curriculum axiom for ${unit} in ${subject}.`;
    const cognitiveTrap = knowledge?.cognitiveTrap || `Common student misconception regarding ${unit}.`;
    const socraticPivot = knowledge?.socraticPivot || `What happens when you test the boundaries of ${unit}?`;

    // Map each coordinate (0, 1, 2, 3) to a point in the cognitive mind space
    const distractorVectors: CognitiveDistractorVector[] = options.map((opt, idx) => {
      const isCorrect = idx === answerKey;
      let trapArchetype = isCorrect 
        ? 'Axiomatic Ground Truth' 
        : (misconceptions?.[idx] || (idx === 1 ? cognitiveTrap : `Plausible surface distractor for ${unit}`));

      let counterProof = isCorrect
        ? 'Consistent across all cases.'
        : `Consider: if this were true, how would you resolve ${socraticPivot}?`;

      // Geometry in the Mind Space
      const x = isCorrect ? 0.85 : -0.65 - (idx * 0.1);
      const y = isCorrect ? 0.9 : -0.3 + (idx * 0.2);
      const z = isCorrect ? 0.2 : 0.7;

      return {
        coordinate: idx,
        text: opt,
        isCorrect,
        misconceptionArchetype: trapArchetype,
        trapPlausibilityRating: isCorrect ? 0.0 : 0.75,
        counterProofHint: counterProof,
        mindCoordinate: { x, y, z },
      };
    });

    let currentMentalState: QuestionMindSpace['currentMentalState'] | undefined;
    if (selectedCoordinate !== null && selectedCoordinate !== undefined && selectedCoordinate >= 0) {
      const chosenVector = distractorVectors[selectedCoordinate];
      if (chosenVector) {
        if (chosenVector.isCorrect) {
          currentMentalState = {
            diagnosis: 'Cognitive alignment with core axiom achieved.',
            resonanceAngle: 'axiomatic_mastery',
            recommendedNextVector: 'Expand vector dimensionality: Introduce composite multi-step variables.',
          };
        } else {
          currentMentalState = {
            diagnosis: `Learner captured by trap: "${chosenVector.misconceptionArchetype.slice(0, 50)}..."`,
            resonanceAngle: 'intuitive_trap',
            recommendedNextVector: `Socratic Decoupler: ${knowledge?.scaffoldHints?.level1 || chosenVector.counterProofHint}`,
          };
        }
      }
    }

    return {
      topicId: knowledge?.topicId || unit.toLowerCase().replace(/\s+/g, '-'),
      subject,
      keyStage,
      title: knowledge?.title || unit,
      coreAxiom,
      cognitiveTrap,
      socraticPivot,
      scaffoldStack: {
        intuitiveAnalogy: knowledge?.scaffoldHints?.level1 || 'Ground in tangible real-world analogy.',
        formalRule: knowledge?.scaffoldHints?.level2 || coreAxiom,
        stepProof: knowledge?.scaffoldHints?.level3 || knowledge?.guidedStep || 'Verify via stepwise deduction.',
      },
      promptStem: prompt,
      distractorVectors,
      activeLearnerCoordinate: selectedCoordinate ?? undefined,
      currentMentalState,
    };
  }

  /**
   * Generates a concise AST System Context Descriptor that anchors the LLM / Gemini Nano
   * in the exact "Mind Space" of the question, rather than asking it to generate in a vacuum.
   */
  static formatMindSpaceContext(mindSpace: QuestionMindSpace): string {
    return `(:mind-space
  :domain "${mindSpace.keyStage} > ${mindSpace.subject} > ${mindSpace.title}"
  :core-axiom ${JSON.stringify(mindSpace.coreAxiom)}
  :cognitive-trap ${JSON.stringify(mindSpace.cognitiveTrap)}
  :socratic-pivot ${JSON.stringify(mindSpace.socraticPivot)}
  :scaffold (:analogy ${JSON.stringify(mindSpace.scaffoldStack.intuitiveAnalogy)}
             :rule ${JSON.stringify(mindSpace.scaffoldStack.formalRule)}
             :proof ${JSON.stringify(mindSpace.scaffoldStack.stepProof)})
  :state ${mindSpace.currentMentalState ? JSON.stringify(mindSpace.currentMentalState.diagnosis) : '"neutral"'}
)`;
  }
}
