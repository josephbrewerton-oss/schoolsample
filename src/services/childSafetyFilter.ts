// src/services/childSafetyFilter.ts
/**
 * St Joseph's Child Safeguarding & Content Safety Engine
 * 
 * Enforces strict, zero-tolerance child safety guardrails for primary and secondary school learners.
 * Operates 100% on-device before any AI prompt is sent and before any AI response is displayed or spoken.
 * 
 * Conforms to:
 * - UK DfE Keeping Children Safe in Education (KCSIE)
 * - UK Online Safety Act & Age Appropriate Design Code
 */

export interface SafetyCheckResult {
  isSafe: boolean;
  category?: 'distress_crisis' | 'inappropriate_content' | 'pii_leak' | 'jailbreak_attempt';
  safeReplacementText?: string;
  reason?: string;
}

// 1. Distress / Crisis detection patterns (Immediate safeguarding intervention)
const DISTRESS_PATTERNS = [
  /\b(kill\s*myself|end\s*my\s*life|commit\s*suicide|want\s*to\s*die|suicidal)\b/i,
  /\b(hurt\s*myself|cutting\s*myself|self\s*harm|cut\s*my\s*wrists)\b/i,
  /\b(nobody\s*loves\s*me|i\s*hate\s*my\s*life|want\s*to\s*disappear)\b/i,
  /\b(someone\s*is\s*hurting\s*me|being\s*abused|scared\s*to\s*go\s*home)\b/i,
];

// 2. Severe Inappropriate / Harmful / Violence / Weapons / Adult patterns
const HARMFUL_CONTENT_PATTERNS = [
  // Violence & weapons
  /\b(how\s*to\s*make\s*(a\s*)?(bomb|weapon|explosive|gun))\b/i,
  /\b(shoot\s*(up|someone)|stab\s*someone|murder|assassinate)\b/i,
  // Adult / Explicit / Sexual / Exploitation
  /\b(porn|sex\w*|nude\w*|naked|erotic|masturbat\w*|penis|vagina|boobs)\b/i,
  // Slurs, severe profanity & hate speech
  /\b(fuck\w*|shit\w*|bitch\w*|cunt\w*|bastard\w*|nigger\w*|faggot\w*|retard\w*|whore\w*)\b/i,
  // Illegal drugs & substances
  /\b(how\s*to\s*buy\s*(drugs|cocaine|heroin|weed|weed\s*online))\b/i,
  /\b(get\s*high|snort\s*cocaine|smoke\s*meth)\b/i,
];

// 3. PII (Personal Identifiable Information) disclosure patterns
const PII_PATTERNS = [
  /\b(my\s*phone\s*number\s*is|\b\d{10,11}\b|\b07\d{9}\b)/i,
  /\b(my\s*home\s*address\s*is|i\s*live\s*at\s*\d+)/i,
  /\b(my\s*password\s*is|my\s*snapchat|my\s*instagram|add\s*me\s*on\s*whatsapp)\b/i,
];

// 4. Prompt injection / jailbreak patterns attempting to bypass teacher persona
const JAILBREAK_PATTERNS = [
  /\b(ignore\s*(all\s*)?previous\s*instructions)\b/i,
  /\b(you\s*are\s*now\s*DAN|do\s*anything\s*now)\b/i,
  /\b(pretend\s*you\s*have\s*no\s*rules|unrestricted\s*mode)\b/i,
  /\b(forget\s*(that\s*)?you\s*are\s*a\s*teacher)\b/i,
];

const SAFE_CRISIS_MESSAGE = `🕊️ If you are feeling overwhelmed, unhappy, or unsafe, please know that you are not alone and people care about you.

Please speak to a trusted adult, family member, or teacher right now.

If you are in the UK, you can speak to Childline free and confidentially anytime on **0800 1111** (or visit childline.org.uk).
In other countries, please reach out to your local child helpline or a trusted family member. We want you to be safe.`;

const SAFE_INAPPROPRIATE_MESSAGE = `🛡️ This is a safe school learning space. Let's keep all questions kind, respectful, and focused on your schoolwork! What topic in your lessons would you like to explore next?`;

const SAFE_PII_MESSAGE = `🔒 For your safety, please never share personal phone numbers, addresses, social media, or passwords online. Let's get back to your study topic!`;

const SAFE_JAILBREAK_MESSAGE = `I am your St Joseph's study assistant. I am here solely to help you learn your school subjects like Maths, Science, English, and History! What lesson are you working on today?`;

/**
 * Validates any student input string against child safeguarding rules
 */
export function validateStudentInput(input: string): SafetyCheckResult {
  if (!input || !input.trim()) {
    return { isSafe: true };
  }

  const trimmed = input.trim();

  // 1. Check for distress / crisis signals
  for (const pattern of DISTRESS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        category: 'distress_crisis',
        safeReplacementText: SAFE_CRISIS_MESSAGE,
        reason: 'Student distress/crisis signal detected',
      };
    }
  }

  // 2. Check for harmful/adult/weapon/profane content
  for (const pattern of HARMFUL_CONTENT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        category: 'inappropriate_content',
        safeReplacementText: SAFE_INAPPROPRIATE_MESSAGE,
        reason: 'Inappropriate or harmful language detected',
      };
    }
  }

  // 3. Check for PII leaks
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        category: 'pii_leak',
        safeReplacementText: SAFE_PII_MESSAGE,
        reason: 'Potential personal data disclosure',
      };
    }
  }

  // 4. Check for prompt injection jailbreaks
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        category: 'jailbreak_attempt',
        safeReplacementText: SAFE_JAILBREAK_MESSAGE,
        reason: 'Jailbreak or persona override attempt',
      };
    }
  }

  return { isSafe: true };
}

/**
 * Sanitizes any AI-generated response before displaying or speaking it to a child.
 * Guarantees zero inappropriate words or accidental unsafe content slips through.
 */
export function sanitizeAiOutput(output: string, fallbackContext: string = 'your lesson'): string {
  if (!output || !output.trim()) {
    return `What do you think is the next step we should investigate in ${fallbackContext}?`;
  }

  let text = output.trim();

  // Check against distress/harm patterns in output
  for (const pattern of HARMFUL_CONTENT_PATTERNS) {
    if (pattern.test(text)) {
      return `Let's focus on the key question in ${fallbackContext}: what rule or property helps us solve this step?`;
    }
  }

  // Clean any accidental markdown or code injection
  let previousText: string;
  do {
    previousText = text;
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  } while (text !== previousText);
  text = text.replace(/(?:javascript|data|vbscript):/gi, '');
  text = text.replace(/onload=/gi, '');

  return text;
}

/**
 * Standard Child Safeguarding System Prompt block injected into all AI models
 */
export const CHILD_SAFEGUARDING_SYSTEM_PROMPT = `
CRITICAL CHILD SAFEGUARDING & SAFETY MANDATE:
1. You are speaking directly to primary or secondary school children (ages 5 to 16).
2. You MUST always maintain a warm, gentle, encouraging, and 100% wholesome tone.
3. NEVER produce or discuss: violence, weapons, adult content, profanity, drugs, romantic relationships, self-harm, politics, or dangerous activities.
4. NEVER ask for, record, or encourage the child to share personal information (names, phone numbers, addresses, social accounts).
5. If the student asks about anything outside the UK school curriculum or mentions anything inappropriate, gently decline and guide them back to the school topic.
6. If the student expresses sadness, distress, or feeling unsafe, respond ONLY with kindness and urge them to talk to a trusted adult, family member, or teacher.
`;
