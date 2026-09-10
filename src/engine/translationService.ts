// src/engine/translationService.ts
import { SUPPORTED_LANGUAGES, SupportedLanguage, getSavedLanguage } from './operational-language';
import { aiCaller, hasUserGrantedAiConsent } from './aicaller';

// In-memory LRU-like cache
const MEMORY_TRANSLATION_CACHE = new Map<string, string>();

function getCacheKey(text: string, targetLang: string, sourceLang = 'en'): string {
  return `trans_${sourceLang}_${targetLang}_${text.trim().toLowerCase().slice(0, 80)}`;
}

function getCached(text: string, targetLang: string, sourceLang = 'en'): string | null {
  const key = getCacheKey(text, targetLang, sourceLang);
  if (MEMORY_TRANSLATION_CACHE.has(key)) {
    return MEMORY_TRANSLATION_CACHE.get(key)!;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        MEMORY_TRANSLATION_CACHE.set(key, stored);
        return stored;
      }
    } catch {}
  }
  return null;
}

function setCached(text: string, targetLang: string, translated: string, sourceLang = 'en'): void {
  const key = getCacheKey(text, targetLang, sourceLang);
  MEMORY_TRANSLATION_CACHE.set(key, translated);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`cache_${key}`, translated);
    } catch {}
  }
}

// Pre-compiled lexicon for instant offline translation of common educational UI terms & questions
const OFFLINE_LEXICON: Record<string, Record<string, string>> = {
  // Common UI Phrases
  'new question': {
    es: 'Nueva pregunta',
    fr: 'Nouvelle question',
    de: 'Neue Frage',
    pl: 'Nowe pytanie',
    uk: 'Нове питання',
    ar: 'سؤال جديد',
    bn: 'নতুন প্রশ্ন',
    ur: 'نیا سوال',
    hi: 'नया प्रश्न',
    pt: 'Nova pergunta',
    it: 'Nuova domanda',
    tr: 'Yeni Soru',
    zh: '新题目',
    sw: 'Swali Jipya',
    yo: 'Ibeere Titun',
    ig: 'Ajụjụ Ọhụrụ',
    ha: 'Sabon Tambaya',
    zu: 'Umbuzo Omusha',
    am: 'አዲስ ጥያቄ',
  },
  'next question': {
    es: 'Siguiente pregunta',
    fr: 'Question suivante',
    de: 'Nächste Frage',
    pl: 'Następne pytanie',
    uk: 'Наступне питання',
    ar: 'السؤال التالي',
    bn: 'পরবর্তী প্রশ্ন',
    ur: 'اگلا سوال',
    hi: 'अगला प्रश्न',
    pt: 'Próxima pergunta',
    it: 'Prossima domanda',
    tr: 'Sonraki Soru',
    zh: '下一题',
    sw: 'Swali Linalofuata',
    yo: 'Ibeere Ti O Kan',
    ig: 'Ajụjụ Na-esonụ',
    ha: 'Tambaya ta Gaba',
    zu: 'Umbuzo Olandelayo',
    am: 'ቀጣይ ጥያቄ',
  },
  'spot on! correct conceptual deduction.': {
    es: '¡Exacto! Deducción conceptual correcta.',
    fr: 'Exactement ! Déduction conceptuelle correcte.',
    de: 'Volltreffer! Korrekte konzeptionelle Schlussfolgerung.',
    pl: 'W samo sedno! Prawidłowy wniosek koncepcyjny.',
    uk: 'Влучно! Правильний концептуальний висновок.',
    ar: 'رائع! استنتاج مفاهيمي صحيح.',
    bn: 'একদম সঠিক! সঠিক ধারণাগত অনুমান।',
    ur: 'بالکل درست! درست تصوراتی نتیجہ۔',
    hi: 'बिल्कुल सही! सही वैचारिक निष्कर्ष।',
    pt: 'Em cheio! Dedução conceitual correta.',
    it: 'Esatto! Deduzione concettuale corretta.',
    tr: 'Tam isabet! Doğru kavramsal çıkarım.',
    zh: '太棒了！正确的概念推论。',
    sw: 'Umetoa jibu sahihi kabisa!',
    yo: 'O pege! Idahun to peye.',
    ig: 'Ọ bụ eziokwu! Nkwubi okwu ziri ezi.',
    ha: 'Daidai! Hankali mai kyau.',
    zu: 'Uqondile ncamashi!',
    am: 'ልክ ነዎት! ትክክለኛ ግንዛቤ።',
  },
  'review the core definition and eliminate options that contradict the rule.': {
    es: 'Revisa la definición central y elimina las opciones que contradigan la regla.',
    fr: 'Revois la définition principale et élimine les options contraires à la règle.',
    de: 'Überprüfe die Definition und schließe widersprüchliche Optionen aus.',
    pl: 'Przejrzyj podstawową definicję i wyeliminuj opcje sprzeczne z regułą.',
    uk: 'Перегляньте основне визначення та виключіть варіанти, що суперечать правилу.',
    ar: 'راجع التعريف الأساسي واستبعد الخيارات التي تخالف القاعدة.',
    bn: 'মূল সংজ্ঞাটি পর্যালোচনা করুন এবং নিয়মবিরোধী বিকল্পগুলি বাদ দিন।',
    ur: 'بنیادی تعریف کا جائزہ لیں اور ان اختیارات کو خارج کریں جو اصول سے متصادم ہوں۔',
    hi: 'मूल परिभाषा की समीक्षा करें और उन विकल्पों को हटा दें जो नियम के विरुद्ध हैं।',
    pt: 'Reveja a definição central e elimine opções que contradigam a regra.',
    it: 'Rivedi la definizione fondamentale ed elimina le opzioni che contraddicono la regola.',
    tr: 'Temel tanımı gözden geçirin ve kuralla çelişen seçenekleri eleyin.',
    zh: '请复习核心概念并排除矛盾的选项。',
    sw: 'Kagua ufafanuzi wa msingi na uondoe majibu yanayopingana na kanuni.',
    yo: 'Ṣe atunyẹwo itumọ pataki ki o yọ awọn aṣayan ti o tako ofin.',
    ig: 'Nyochaa nkọwa ya ma wepụ nhọrọ ndị na-emegide iwu ahụ.',
    ha: 'Duba ma\'anar asali kuma ka cire zaɓin da ya saba wa dokar.',
    zu: 'Buyekeza incazelo esemqoka bese ususa izinketho eziphikisana nomthetho.',
    am: 'ዋናውን ትርጓሜ ይከልሱ እና ከህጉ ጋር የሚጋጩትን አማራጮች ያስወግዱ።',
  },
  'correct! well done.': {
    es: '¡Correcto! Bien hecho.',
    fr: 'Correct ! Bien joué.',
    de: 'Richtig! Gut gemacht.',
    pl: 'Poprawnie! Dobra robota.',
    uk: 'Правильно! Молодець.',
    ar: 'صحيح! أحسنت صنعاً.',
    bn: 'সঠিক! চমৎকার হয়েছে।',
    ur: 'درست! بہت خوب۔',
    hi: 'सही! बहुत बढ़िया।',
    pt: 'Correto! Muito bem.',
    it: 'Corretto! Ottimo lavoro.',
    tr: 'Doğru! Tebrikler.',
    zh: '回答正确！干得好。',
    sw: 'Sahihi! Hongera sana.',
    yo: 'O tọ! O ku iṣẹ.',
    ig: 'Eziokwu! Ọ dị mma.',
    ha: 'Daidai! Barka da kokari.',
    zu: 'Uqinisile! Kwenziwe kahle.',
    am: 'ትክክል! ጎበዝ።',
  },
  'try again or pick another option!': {
    es: '¡Inténtalo de nuevo o elige otra opción!',
    fr: 'Réessaie ou choisis une autre option !',
    de: 'Versuche es erneut oder wähle eine andere Option!',
    pl: 'Spróbuj ponownie lub wybierz inną opcję!',
    uk: 'Спробуйте знову або оберіть інший варіант!',
    ar: 'حاول مجدداً أو اختر خياراً آخر!',
    bn: 'আবার চেষ্টা করুন বা অন্য বিকল্প বাছুন!',
    ur: 'دوبارہ کوشش کریں یا کوئی اور آپشن منتخب کریں!',
    hi: 'पुनः प्रयास करें या कोई अन्य विकल्प चुनें!',
    pt: 'Tente novamente ou escolha outra opção!',
    it: 'Riprova o seleziona un\'altra opzione!',
    tr: 'Tekrar deneyin veya başka bir seçenek seçin!',
    zh: '再试一次或选择其他选项！',
    sw: 'Jaribu tena au chagua jibu lingine!',
    yo: 'Gbiyanju lẹẹkansi tabi yan aṣayan miiran!',
    ig: 'Nwaa ọzọ ma ọ bụ họrọ nhọrọ ọzọ!',
    ha: 'Sake gwadawa ko zaɓi wani zaɓi!',
    zu: 'Zama futhi noma khetha enye inketho!',
    am: 'እንደገና ይሞክሩ ወይም ሌላ አማራጭ ይምረጡ!',
  },
};

/**
 * Universal text translation function utilizing multi-tiered pipeline:
 * Tier 1: In-Memory / Local Storage cache
 * Tier 2: Offline Dictionary
 * Tier 3: Browser Native Translation API (Chrome Translation API)
 * Tier 4: Gemini Nano / On-device AI (via aiCaller)
 * Tier 5: Free Web Translation Service (MyMemory)
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = 'en'
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (!targetLang || targetLang === sourceLang) return text;

  // Tier 1: Cache check
  const cached = getCached(text, targetLang, sourceLang);
  if (cached) return cached;

  // Tier 2: Offline Lexicon lookup
  const cleanLower = text.trim().toLowerCase();
  if (OFFLINE_LEXICON[cleanLower] && OFFLINE_LEXICON[cleanLower][targetLang]) {
    const result = OFFLINE_LEXICON[cleanLower][targetLang];
    setCached(text, targetLang, result, sourceLang);
    return result;
  }

  // Tier 3: Chromium Native Translator API
  if (typeof window !== 'undefined') {
    const win = window as any;
    const transApi = win.translation || (self as any).translation || win.ai?.translator;
    if (transApi && typeof transApi.canTranslate === 'function') {
      try {
        const availability = await transApi.canTranslate({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
        if (availability === 'readily' || availability === 'after-download' || availability === 'available') {
          const translator = await transApi.createTranslator({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          });
          const translated = await translator.translate(text);
          if (translated && typeof translated === 'string' && translated.trim().length > 0) {
            setCached(text, targetLang, translated, sourceLang);
            return translated;
          }
        }
      } catch (err) {
        // Native translator failed, proceed to next tier
      }
    }
  }

  // Tier 4: On-Device AI / Gemini Nano (via aiCaller)
  const langMeta = SUPPORTED_LANGUAGES[targetLang];
  const langLabel = langMeta ? `${langMeta.label} (${langMeta.nativeLabel})` : targetLang;

  if (hasUserGrantedAiConsent()) {
    try {
      const prompt = `Translate the following educational text from English into ${langLabel}.
Text to translate:
"${text}"

Rules:
- Translate accurately for school students.
- Output strictly and ONLY the translated text. Do not add quotes, explanations, markdown headings, or introductory remarks.
- Keep numbers, math variables, and chemical symbols unchanged.`;

      const aiResult = await aiCaller.promptText({
        prompt,
        systemPrompt: `You are an expert bilingual educational translator translating into ${langLabel}. Output only the translation.`,
        preserveContext: false,
      });

      if (aiResult && aiResult.trim().length > 0) {
        const cleaned = aiResult.replace(/^"(.*)"$/, '$1').trim();
        setCached(text, targetLang, cleaned, sourceLang);
        return cleaned;
      }
    } catch {
      // AI translation failed or timed out, proceed to Web API fallback
    }
  }

  // Tier 5: Free Online Translation API (MyMemory)
  try {
    const encoded = encodeURIComponent(text);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${sourceLang}|${targetLang}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const candidate = data?.responseData?.translatedText;
      if (candidate && typeof candidate === 'string' && !candidate.startsWith('MYMEMORY WARNING')) {
        setCached(text, targetLang, candidate, sourceLang);
        return candidate;
      }
    }
  } catch {
    // Network fallback unavailable
  }

  // Fallback: return original text
  return text;
}

/**
 * Translates a complete question object (prompt, options, hint, explanation)
 */
export async function translateQuestionData(
  question: {
    prompt: string;
    displayOptions: string[];
    hint?: string;
    explanation?: string;
    misconceptions?: string[];
    socraticFollowUp?: string;
  },
  targetLang: string
): Promise<{
  prompt: string;
  displayOptions: string[];
  hint?: string;
  explanation?: string;
  misconceptions?: string[];
  socraticFollowUp?: string;
}> {
  if (targetLang === 'en' || !targetLang) {
    return question;
  }

  try {
    const [translatedPrompt, ...translatedOptions] = await Promise.all([
      translateText(question.prompt, targetLang),
      ...question.displayOptions.map((opt) => translateText(opt, targetLang)),
    ]);

    let translatedHint = question.hint;
    if (question.hint) {
      translatedHint = await translateText(question.hint, targetLang);
    }

    let translatedExplanation = question.explanation;
    if (question.explanation) {
      translatedExplanation = await translateText(question.explanation, targetLang);
    }

    let translatedMisconceptions = question.misconceptions;
    if (question.misconceptions && Array.isArray(question.misconceptions)) {
      translatedMisconceptions = await Promise.all(
        question.misconceptions.map((m) => translateText(m, targetLang))
      );
    }

    let translatedSocratic = question.socraticFollowUp;
    if (question.socraticFollowUp) {
      translatedSocratic = await translateText(question.socraticFollowUp, targetLang);
    }

    return {
      prompt: translatedPrompt || question.prompt,
      displayOptions: translatedOptions.length === question.displayOptions.length ? translatedOptions : question.displayOptions,
      hint: translatedHint,
      explanation: translatedExplanation,
      misconceptions: translatedMisconceptions,
      socraticFollowUp: translatedSocratic,
    };
  } catch (err) {
    console.warn('[Question Translation Error]:', err);
    return question;
  }
}

/**
 * Translates curriculum lesson fields
 */
export async function translateLessonData(
  lesson: {
    title: string;
    axiom: string;
    trap: string;
    hook: string;
    guidedStep: string;
    socraticCheck: string;
    fullText?: string;
  },
  targetLang: string
): Promise<{
  title: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
  fullText?: string;
}> {
  if (targetLang === 'en' || !targetLang) {
    return lesson;
  }

  try {
    const [title, axiom, trap, hook, guidedStep, socraticCheck] = await Promise.all([
      translateText(lesson.title, targetLang),
      translateText(lesson.axiom, targetLang),
      translateText(lesson.trap, targetLang),
      translateText(lesson.hook, targetLang),
      translateText(lesson.guidedStep, targetLang),
      translateText(lesson.socraticCheck, targetLang),
    ]);

    let fullText = lesson.fullText;
    if (lesson.fullText) {
      fullText = await translateText(lesson.fullText, targetLang);
    }

    return {
      title: title || lesson.title,
      axiom: axiom || lesson.axiom,
      trap: trap || lesson.trap,
      hook: hook || lesson.hook,
      guidedStep: guidedStep || lesson.guidedStep,
      socraticCheck: socraticCheck || lesson.socraticCheck,
      fullText,
    };
  } catch (err) {
    console.warn('[Lesson Translation Error]:', err);
    return lesson;
  }
}

/**
 * Text-to-speech reading in the target language
 */
export function speakInLanguage(text: string, langCode: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMeta = SUPPORTED_LANGUAGES[langCode];
    const targetTag = langMeta?.ttsVoiceLang || langCode;

    utterance.lang = targetTag;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) =>
        v.lang === targetTag ||
        v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
        v.name.toLowerCase().includes(langMeta?.label.toLowerCase() || '')
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[Speech Synthesis Error]:', e);
  }
}
