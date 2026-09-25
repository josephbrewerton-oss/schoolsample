// src/engine/socraticOfflineBrain.ts
/**
 * St Joseph's Socratic Offline Brain
 * 
 * Provides instantaneous, 100% offline, zero-cloud, zero-latency pedagogical guidance.
 * Designed specifically for developing-world, rural, low-spec, and air-gapped devices
 * where Gemini Nano / WebGPU may not be supported or downloaded.
 * 
 * Leverages the rich 90-topic National Curriculum knowledge base (coreAxioms, cognitiveTraps,
 * socraticPivots, hooks, guidedSteps, scaffoldHints, and 547 verified question explanations).
 */

import { CurriculumTopicKnowledge } from '../data/oakCurriculumKnowledge';
import { validateStudentInput } from '../services/childSafetyFilter';
import { ASTFlowGovernor } from './astGovernor';

export interface SocraticQueryContext {
  query: string;
  topicKnowledge: CurriculumTopicKnowledge | null;
  keyStage: string;
  subject: string;
  currentTopic: string;
  customInstruction?: string;
  activePrompt?: string;
  recentMessages?: Array<{ role: string; text: string }>;
}

/**
 * Tokenizes text into lowercase normalized words without common stop words
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of',
    'and', 'or', 'but', 'it', 'its', 'my', 'your', 'me', 'i', 'you', 'he', 'she', 'we',
    'they', 'this', 'that', 'these', 'those', 'do', 'does', 'did', 'can', 'could', 'would',
    'should', 'will', 'just', 'so', 'then', 'be', 'been', 'being', 'have', 'has', 'had'
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Generates an age-tailored, Socratic, guided educational response completely offline.
 */
export function generateOfflineSocraticAnswer(ctx: SocraticQueryContext): string {
  const { query, topicKnowledge, keyStage, subject, currentTopic, customInstruction, activePrompt } = ctx;
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  // 1. Mandatory Child Safeguarding Check
  const safety = validateStudentInput(trimmed);
  if (!safety.isSafe) {
    return safety.safeReplacementText || 'Let us keep our learning safe, kind, and focused on school topics.';
  }

  // 2. Explicit Scaffolding Button Commands
  if (customInstruction) {
    const ci = customInstruction.toLowerCase();
    if (ci.includes('analogy') || ci.includes('nudge')) {
      if (topicKnowledge?.scaffoldHints.level1) {
        return `💡 Here is a helpful way to picture this: ${topicKnowledge.scaffoldHints.level1}\n\nHow does this mental picture help you think about ${currentTopic}?`;
      }
    }
    if (ci.includes('rule') || ci.includes('property')) {
      if (topicKnowledge?.scaffoldHints.level2) {
        return `🔍 Remember the golden curriculum rule: ${topicKnowledge.scaffoldHints.level2}\n\nCan you see how this rule applies to what we are solving?`;
      }
    }
    if (ci.includes('step') || ci.includes('example') || ci.includes('break')) {
      if (topicKnowledge?.scaffoldHints.level3) {
        return `🧩 Let's take it one step at a time:\n\n${topicKnowledge.scaffoldHints.level3}\n\nWhat would be your next move from here?`;
      }
    }
  }

  // If no specific topic knowledge is loaded, provide a supportive subject inquiry
  if (!topicKnowledge) {
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `Hello! I'm Professor Turing, your St Joseph's study coach for ${keyStage} ${subject}. What topic would you like to explore today?`;
    }
    return `In ${currentTopic} (${subject}), what idea or question is on your mind? Tell me what you already know, and we will build from there!`;
  }

  const { coreAxiom, cognitiveTrap, socraticPivot, hook, guidedStep, scaffoldHints, questions } = topicKnowledge;

  // 3. Greetings & Introductory Politeness
  if (/^(hi|hello|hey|good\s+morning|good\s+afternoon|howdy)\b/i.test(lower) && lower.split(/\s+/).length <= 4) {
    return `Hello! It's wonderful to learn with you today. In ${topicKnowledge.title}: ${hook || socraticPivot}\n\nWhat do you think?`;
  }

  // 4. Thank You / Encouragement acknowledgement
  if (/^(thanks|thank\s+you|cheers|got\s+it|i\s+understand|makes\s+sense)/i.test(lower)) {
    return `You're very welcome! Brilliant effort. Would you like to try another practice question or explore another part of ${topicKnowledge.title}?`;
  }

  // 5. Deterministic AST Math Checkup & Calculation Evaluator (Zero Hallucination)
  const mathCheck = ASTFlowGovernor.evaluateMathCheckup(trimmed, activePrompt);
  if (mathCheck && mathCheck.isMath) {
    if (mathCheck.isStudentCorrect === true) {
      return `Brilliant work! 🎯 You got it spot on: ${mathCheck.groundTruth}.\n\nHere is why your reasoning works:\n${mathCheck.steps.join('\n')}\n\nCan you explain the main step in your own words?`;
    }
    if (mathCheck.isStudentCorrect === false) {
      return `You're making a great effort! Let's check our steps carefully so we don't slip up:\n\n${mathCheck.steps[0]}\n\n💡 Remember: ${mathCheck.explanation}\n\nWhat do you get when you try that step?`;
    }
    return `Let's work this out step-by-step using our National Curriculum rules: 🧩\n\n${mathCheck.steps.join('\n')}\n\nSo the exact result is ${mathCheck.groundTruth}! ${mathCheck.explanation}\n\nDoes this step-by-step method make sense?`;
  }

  // 6. Match Student Query against Topic Questions & Explanations (High Precision Search)
  const queryTokens = extractKeywords(lower);
  const topicTitleTokens = new Set(extractKeywords(topicKnowledge.title));
  // Exclude common title words so generic topic words don't skew individual question selection
  const discriminativeQueryTokens = queryTokens.filter((t) => !topicTitleTokens.has(t));

  let bestMatchQuestion: typeof questions[0] | null = null;
  let highestScore = 0;

  if (discriminativeQueryTokens.length > 0) {
    for (const q of questions) {
      let score = 0;
      const promptTokens = new Set(extractKeywords(q.prompt));
      const explanationTokens = new Set(extractKeywords(q.explanation));
      const optionTokens = new Set(q.options.flatMap((o) => extractKeywords(o)));

      for (const token of discriminativeQueryTokens) {
        if (promptTokens.has(token)) score += 3;
        if (explanationTokens.has(token)) score += 2;
        if (optionTokens.has(token)) score += 1;
      }

      if (score > highestScore && score >= 4) {
        highestScore = score;
        bestMatchQuestion = q;
      }
    }
  }

  // If strong question match found (e.g. asking about a specific term in the quiz like "mitochondria", "tangent", "resuscitation", "fraction")
  if (bestMatchQuestion && highestScore >= 4) {
    const isAskingForDirectAnswer = lower.includes('answer') || lower.includes('which one') || lower.includes('is it a') || lower.includes('is it b');
    if (isAskingForDirectAnswer) {
      return `I want to help you discover the answer yourself! 💡 Hint: ${bestMatchQuestion.hint}\n\nLook closely at the key rule: ${coreAxiom}. Which choice matches this best?`;
    }
    return `Great inquiry! Here is the key concept: ${bestMatchQuestion.explanation}\n\n💡 Helpful clue: ${bestMatchQuestion.hint}\n\nHow would you put that into your own words?`;
  }

  // 6. Misconception / Cognitive Trap Detection
  // Check if student's query touches on the common misconception
  const trapTokens = extractKeywords(cognitiveTrap);
  const trapOverlap = queryTokens.filter((t) => trapTokens.includes(t)).length;
  if (trapOverlap >= 2 || (lower.includes('why') && trapTokens.some((t) => lower.includes(t)))) {
    return `That is a really common thing that confuses many students! 💡\n\nWatch out for this trap: ${cognitiveTrap}.\n\nInstead, remember: ${coreAxiom}.\n\n${scaffoldHints.level1}\n\nCan you see why that makes a big difference?`;
  }

  // 7. Intent: "What is...", "What did...", "What was...", "Define...", "Explain...", "What does X mean?"
  if (
    lower.startsWith('what is') ||
    lower.startsWith('what are') ||
    lower.startsWith('what did') ||
    lower.startsWith('what was') ||
    lower.startsWith('what were') ||
    lower.startsWith('what does') ||
    lower.startsWith('who is') ||
    lower.startsWith('who was') ||
    lower.includes('explain') ||
    lower.includes('tell me about') ||
    lower.includes('mean')
  ) {
    // If asking about speech/words or actions in a historical/religious context
    if ((lower.includes('say') || lower.includes('words') || lower.includes('command')) && guidedStep) {
      return `🌟 At the heart of this lesson:\n\n${guidedStep}\n\n💡 Remember: "${coreAxiom}"\n\nHow do you think those words or actions made the disciples feel?`;
    }

    const stageIntro = keyStage.includes('1') || keyStage.includes('2')
      ? 'Here is an easy way to understand it:'
      : 'In our curriculum, here is the core definition:';

    return `🌟 ${stageIntro}\n\n${coreAxiom}\n\n💡 Picture it like this: ${scaffoldHints.level1}\n\nNow, how would you explain this in your own words?`;
  }

  // 8. Intent: "Why...", "How come...", "Reason for..."
  if (lower.startsWith('why') || lower.includes('how come') || lower.includes('reason')) {
    return `Curious question! Here is why: ${coreAxiom}\n\n🔍 Watch out: ${cognitiveTrap}\n\n${socraticPivot}\n\nWhat do you predict?`;
  }

  // 9. Intent: "How do I...", "Steps...", "How to solve...", "Work it out"
  if (lower.startsWith('how do i') || lower.startsWith('how to') || lower.includes('step') || lower.includes('solve') || lower.includes('calculate') || lower.includes('work out')) {
    return `Here is how to tackle it step-by-step: 🧩\n\n${guidedStep}\n\n${scaffoldHints.level3}\n\nTry following step 1 right now: what value or word do you get first?`;
  }

  // 10. Intent: "Example...", "Analogy...", "Like what?"
  if (lower.includes('example') || lower.includes('analogy') || lower.includes('picture') || lower.includes('like what')) {
    return `Here is a real-world example to make it crystal clear: 🌟\n\n${scaffoldHints.level1}\n\n${hook || socraticPivot}\n\nWhat do you think happens next?`;
  }

  // 11. Intent: Student expressing confusion ("I don't get it", "I'm stuck", "confused", "help me")
  if (lower.includes("don't get") || lower.includes("dont get") || lower.includes('stuck') || lower.includes('confused') || lower.includes('help me') || lower.includes('hard')) {
    return `Don't worry at all — getting stuck is where real learning begins! 🌱\n\nLet's reset and make it simple:\n1. Picture this: ${scaffoldHints.level1}\n2. The main rule: ${scaffoldHints.level2}\n\nWhich of those two makes the most sense so far?`;
  }

  // 12. Intent: Student guessing a short answer (e.g. "is it 4?", "is it winter?", "water", "gravity")
  if (trimmed.length < 35 && (lower.startsWith('is it') || lower.endsWith('?') || questions.some((q) => q.options.some((opt) => opt.toLowerCase().includes(lower))))) {
    // Check against question answer options
    for (const q of questions) {
      const correctOption = q.options[q.answerKey].toLowerCase();
      if (correctOption.includes(lower) || lower.includes(correctOption.split(' ')[0])) {
        return `Spot on! 🎯 You are thinking along the exact right lines.\n\n${q.explanation}\n\nCan you explain why that works?`;
      }
    }
    return `Interesting thought! Let's test that against our core rule:\n"${coreAxiom}"\n\nDoes your answer fit with that rule, or is there another factor we need to consider?`;
  }

  // 13. Default Socratic Guidance
  return `In ${topicKnowledge.title}, remember our central principle:\n"${coreAxiom}"\n\n💡 Clue: ${scaffoldHints.level1}\n\n${socraticPivot}\n\nWhat is your first thought?`;
}
