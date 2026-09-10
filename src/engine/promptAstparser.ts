// src/engine/promptAstparser.ts
import { 
  KEY_STAGE_CONSTRAINTS, 
  REGIONAL_CONSTRAINTS, 
  SUBJECT_DEFINITIONS,
  resolveKeyStageRule 
} from '@site/static/promptStrategies';
import { findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';

export interface PromptInferenceParams {
  subject?: string;
  topic?: string;
  keyStage?: string;
  curriculum?: 'uk_oak' | 'international' | string;
}

export class PromptASTPreParser {
  /**
   * Compresses verbose human descriptions into compact, high-density constraint tokens.
   */
  static compressText(text?: string): string {
    if (!text) return '';
    return text
      .replace(/Ages \d+-\d+\s*(\([^)]+\))?\.?/gi, '')
      .replace(/Follow UK National Curriculum Key Stage standard terminology/gi, 'UK Standard')
      .replace(/Follow international curriculum standard scientific terminology/gi, 'International Standard')
      .replace(/CURRICULUM FRAMEWORK:|DIALECT:|UNITS & CURRENCY:|TERMINOLOGY:/gi, '')
      .replace(/[\-\*\#\(\)]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Transforms configuration objects into an optimized AST prompt payload with 1-shot exemplar grounding.
   */
  static parseForInference(params: PromptInferenceParams = {}): string {
    const {
      subject = 'Science',
      topic = 'General',
      keyStage = 'KS3',
      curriculum = 'uk_oak'
    } = params;

    // 1. Resolve configs from promptStrategies
    const rawKs = (KEY_STAGE_CONSTRAINTS as Record<string, string>)[keyStage] || resolveKeyStageRule(keyStage);
    const rawRegional = (REGIONAL_CONSTRAINTS as Record<string, string>)[curriculum] || (REGIONAL_CONSTRAINTS as Record<string, string>).uk_oak;

    // 2. Pre-parse and strip fluff
    const cleanKs = this.compressText(rawKs);
    const cleanRegional = this.compressText(rawRegional);

    // 3. Resolve targeted subject focus
    const cleanSub = subject.toLowerCase().trim();
    const matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(
      (k) => k === cleanSub || (SUBJECT_DEFINITIONS as any)[k]?.aliases?.some((a: string) => cleanSub.includes(a))
    ) || 'humanities';
    
    const archetypes = (SUBJECT_DEFINITIONS as any)[matchedKey]?.archetypes || ['core conceptual mastery'];
    const targetFocus = archetypes[Math.floor(Math.random() * archetypes.length)];

    // 4. Ground with 1-shot exemplar knowledge if available
    const knowledge = findCurriculumKnowledge(keyStage, subject, topic);
    const exemplarSnippet = knowledge
      ? `\nExemplar Baseline: Rule: "${knowledge.coreAxiom}" | Trap: "${knowledge.cognitiveTrap}"`
      : '';

    // 5. Return clean, high-diagnostic prompt
    return `Generate 1 Oak Curriculum diagnostic multiple-choice question for ${keyStage} ${subject}: "${topic}".
Focus: ${targetFocus} | Constraints: ${cleanKs}, ${cleanRegional}.${exemplarSnippet}
Rule: Every distractor must embody an authentic student misconception.

Output ONLY a valid Lisp S-expression in this exact format:
(:route "quiz:mcq"
 :scratchpad "Short explanation of the concept"
 :prompt "Clear question about ${topic}?"
 :options ("Correct answer" "Plausible wrong answer 1" "Plausible wrong answer 2" "Plausible wrong answer 3")
 :misconceptions ("Correct deduction" "Trap: Explanation of error 1" "Trap: Explanation of error 2" "Trap: Explanation of error 3")
 :answer-key 0
 :hint "Concise Socratic clue under 15 words.")`.trim();
  }
}
