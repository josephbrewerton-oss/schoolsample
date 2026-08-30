// static/promptAstParser.aiparser.js
import { KEY_STAGE_CONSTRAINTS, REGIONAL_CONSTRAINTS } from './age-regional-instructions.js';
import { SUBJECT_DEFINITIONS } from './promptStrategies.js';

export class PromptASTPreParser {
  /**
   * Compresses verbose human descriptions into compact, high-density constraint tokens.
   */
  static compressText(text) {
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
  static parseForInference(params = {}) {
    const {
      subject = 'Science',
      topic = 'General',
      keyStage = 'Key Stage 1',
      curriculum = 'uk_oak'
    } = params;

    // 1. Resolve key stage and regional constraints
    const rawKs = KEY_STAGE_CONSTRAINTS?.[keyStage] || KEY_STAGE_CONSTRAINTS?.KS1 || 'Primary level';
    const rawRegional = REGIONAL_CONSTRAINTS?.[curriculum] || REGIONAL_CONSTRAINTS?.uk_oak || 'UK National Curriculum';

    // 2. Clean constraints
    const cleanKs = this.compressText(rawKs);
    const cleanRegional = this.compressText(rawRegional);

    // 3. Resolve targeted subject focus
    const cleanSub = String(subject).toLowerCase().trim();
    const matchedKey = Object.keys(SUBJECT_DEFINITIONS || {}).find(
      k => k === cleanSub || SUBJECT_DEFINITIONS[k]?.aliases?.some(a => cleanSub.includes(a))
    ) || 'humanities';
    
    const archetypes = SUBJECT_DEFINITIONS?.[matchedKey]?.archetypes || ['core conceptual mastery'];
    const targetFocus = archetypes[Math.floor(Math.random() * archetypes.length)];

    // 4. Return clean, complete AST generation instruction
    return `Generate 1 Oak Curriculum multiple choice question for ${keyStage} ${subject}: "${topic}".
Focus: ${targetFocus} | Constraints: ${cleanKs}, ${cleanRegional}.

Output ONLY a valid Lisp S-expression in this exact format:
(:route "quiz:mcq"
 :scratchpad "Explanation of why the correct answer is true"
 :prompt "Question about ${topic}?"
 :options ("Correct answer" "Wrong answer 1" "Wrong answer 2" "Wrong answer 3")
 :answer-key 0
 :hint "Short Socratic clue under 15 words.")`.trim();
  }
}