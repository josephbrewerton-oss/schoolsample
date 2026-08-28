// src/engine/promptAstparser.ts
import { 
  KEY_STAGE_CONSTRAINTS, 
  REGIONAL_CONSTRAINTS, 
  SUBJECT_DEFINITIONS,
  resolveKeyStageRule 
} from '@site/static/promptStrategies';

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
   * Transforms configuration objects into an optimized AST prompt payload.
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

    // 4. Return AST schema contract with prefilled trigger prefix
    return `[AST_SCHEMA: LISP_S_EXPRESSION]
(:route "quiz:mcq" :scratchpad "<STEP_REASONING>" :prompt "<STEM>" :options (list "<CORRECT>" "<DISTRACTOR_1>" "<DISTRACTOR_2>" "<DISTRACTOR_3>") :hint "<CLUE>" :answer-key 0)

[EXEMPLAR]
(:route "quiz:mcq" :scratchpad "Deciduous trees lose leaves in winter to conserve energy." :prompt "Which feature characterizes winter weather in the UK?" :options (list "Freezing temperatures and shorter days" "Warm sunny days with blossom" "Hot dry afternoons" "Humid tropical monsoons") :hint "Consider daylight hours and temperature during the coldest season." :answer-key 0)

[TARGET: ${subject} | ${topic} | ${keyStage} | ${cleanKs} | ${targetFocus} | ${cleanRegional}]
(:route "quiz:mcq" :scratchpad "`.trim();
  }
}