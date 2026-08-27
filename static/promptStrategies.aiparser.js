// static/promptAstParser.js
import { KEY_STAGE_CONSTRAINTS, REGIONAL_CONSTRAINTS } from './age-regional-instructions.js';
import { SUBJECT_DEFINITIONS, buildUniversalPrompt } from './promptStrategies.js';

export class PromptASTPreParser {
  /**
   * Compresses verbose human descriptions into compact, high-density constraint tokens.
   */
  private static compressText(text) {
    if (!text) return '';
    return text
      // Remove conversational human phrases
      .replace(/Ages \d+-\d+\s*(\([^)]+\))?\.?/gi, '')
      .replace(/Follow UK National Curriculum Key Stage standard terminology/gi, 'UK Standard')
      .replace(/Follow international curriculum standard scientific terminology/gi, 'International Standard')
      .replace(/CURRICULUM FRAMEWORK:|DIALECT:|UNITS & CURRENCY:|TERMINOLOGY:/gi, '')
      // Strip markdown bullets, redundant punctuation, and line breaks
      .replace(/[\-\*\#\(\)]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Transforms human-edited configuration objects into an optimized AST prompt payload.
   */
  public static parseForInference(params) {
    const {
      subject = 'Science',
      topic = 'General',
      keyStage = 'KS3',
      curriculum = 'uk_oak'
    } = params;

    // 1. Resolve human configs
    const rawKs = KEY_STAGE_CONSTRAINTS[keyStage] || KEY_STAGE_CONSTRAINTS.KS3;
    const rawRegional = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

    // 2. Pre-parse and strip human fluff
    const cleanKs = this.compressText(rawKs);
    const cleanRegional = this.compressText(rawRegional);

    // 3. Resolve targeted subject focus
    const cleanSub = subject.toLowerCase();
    const matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(
      k => k === cleanSub || SUBJECT_DEFINITIONS[k].aliases.some(a => cleanSub.includes(a))
    ) || 'humanities';
    
    const archetypes = SUBJECT_DEFINITIONS[matchedKey].archetypes;
    const targetFocus = archetypes[Math.floor(Math.random() * archetypes.length)];

    // 4. Return pure AST schema contract for the edge model
    return `[AST_SCHEMA: LISP_S_EXPRESSION]
(:route "quiz:mcq" :scratchpad "<STEP_REASONING>" :prompt "<STEM>" :options (list "<CORRECT>" "<DISTRACTOR_1>" "<DISTRACTOR_2>" "<DISTRACTOR_3>") :hint "<CLUE>" :answer-key 0)

[EXEMPLAR]
(:route "quiz:mcq" :scratchpad "Deciduous trees lose leaves in winter to conserve energy." :prompt "Which feature characterizes winter weather in the UK?" :options (list "Freezing temperatures and shorter days" "Warm sunny days with blossom" "Hot dry afternoons" "Humid tropical monsoons") :hint "Consider daylight hours and temperature during the coldest season." :answer-key 0)

[TARGET: ${subject} | ${topic} | ${keyStage} | ${cleanKs} | ${targetFocus} | ${cleanRegional}]
(:route "quiz:mcq" :scratchpad "`.trim();
  }
}