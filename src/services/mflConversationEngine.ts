// src/services/mflConversationEngine.ts
/**
 * On-Device Conversational Language Engine (MFL & Polyglot Studio)
 * 
 * Powered by Chrome Prompt API (Gemini Nano) with intelligent on-device
 * conversational pattern-matching fallback.
 * 
 * Key Principles:
 * - CEFR A1/A2 beginner level: Short, encouraging, rhythmic sentences.
 * - Dual-Text: Every response includes target language audio text + English translation.
 * - Zero Cloud Egress: Runs 100% on-device inside the pupil's browser.
 */

import { aiCaller, hasUserGrantedAiConsent } from '../engine/aicaller';
import { validateStudentInput, sanitizeAiOutput } from './childSafetyFilter';

export interface MflPartnerPersona {
  code: string;
  name: string;
  age: number;
  avatar: string;
  location: string;
  flag: string;
  ttsCode: string;
  greetingTarget: string;
  greetingEnglish: string;
  description: string;
  starterSuggestions: {
    target: string;
    english: string;
  }[];
}

export interface MflChatMessage {
  id: string;
  sender: 'user' | 'partner';
  targetText: string;
  translation: string;
  coachingTip?: string;
  timestamp: number;
}

export const MFL_PERSONAS: Record<string, MflPartnerPersona> = {
  es: {
    code: 'es',
    name: 'Mateo',
    age: 10,
    avatar: '👦🏽',
    location: 'Madrid, España',
    flag: '🇪🇸',
    ttsCode: 'es-ES',
    greetingTarget: '¡Hola! Me llamo Mateo y tengo diez años. Vivo en Madrid. ¿Cómo te llamas tú y cuántos años tienes?',
    greetingEnglish: 'Hello! My name is Mateo and I am ten years old. I live in Madrid. What is your name and how old are you?',
    description: 'A friendly pupil at Colegio San José in Madrid who loves football, tapas, science, and learning together.',
    starterSuggestions: [
      { target: '¡Hola Mateo! Me llamo...', english: 'Hello Mateo! My name is...' },
      { target: 'Tengo diez años y vivo en Inglaterra.', english: 'I am ten years old and live in England.' },
      { target: '¿Qué te gusta comer en el desayuno?', english: 'What do you like to eat for breakfast?' },
      { target: '¿Tienes mascotas en casa?', english: 'Do you have pets at home?' },
      { target: 'Me gusta mucho jugar al fútbol.', english: 'I really like playing football.' },
      { target: '¿Dónde está la estación de tren?', english: 'Where is the train station?' },
      { target: '¡Hasta luego, amigo!', english: 'See you later, friend!' },
    ],
  },
  fr: {
    code: 'fr',
    name: 'Amélie',
    age: 10,
    avatar: '👧🏻',
    location: 'Paris, France',
    flag: '🇫🇷',
    ttsCode: 'fr-FR',
    greetingTarget: 'Bonjour ! Je m’appelle Amélie et j’habite à Paris près de la Tour Eiffel. Et toi, comment t’appelles-tu ?',
    greetingEnglish: 'Hello! My name is Amélie and I live in Paris near the Eiffel Tower. And you, what is your name?',
    description: 'A lively Parisian pupil who loves cycling by the Seine, croissants, art, and reading stories.',
    starterSuggestions: [
      { target: 'Bonjour Amélie ! Je m’appelle...', english: 'Hello Amélie! My name is...' },
      { target: 'J’ai dix ans et j’habite à Londres.', english: 'I am ten years old and I live in London.' },
      { target: 'Qu’est-ce que tu aimes faire le week-end ?', english: 'What do you like doing at the weekend?' },
      { target: 'J’adore les croissants et le chocolat chaud !', english: 'I love croissants and hot chocolate!' },
      { target: 'Est-ce que tu as un chien ou un chat ?', english: 'Do you have a dog or a cat?' },
      { target: 'Où se trouve le musée du Louvre ?', english: 'Where is the Louvre museum?' },
      { target: 'Au revoir et bonne journée !', english: 'Goodbye and have a good day!' },
    ],
  },
  la: {
    code: 'la',
    name: 'Marcus',
    age: 11,
    avatar: '🏛️',
    location: 'Roma Antiqua',
    flag: '🏛️',
    ttsCode: 'it-IT', // Italian ecclesiastical pronunciation phonetic match for Latin
    greetingTarget: 'Salve! Marcus sum, discipulus Romanus. In urbe Roma habito. Quid est nomen tibi?',
    greetingEnglish: 'Greetings! I am Marcus, a Roman pupil. I live in the city of Rome. What is your name?',
    description: 'A young Roman scholar studying history, rhetoric, and arithmetic in the ancient Forum Romanum.',
    starterSuggestions: [
      { target: 'Salve Marce! Nomen mihi est...', english: 'Greetings Marcus! My name is...' },
      { target: 'In Britannia habito.', english: 'I live in Britain.' },
      { target: 'Quid hodie in Foro agis?', english: 'What are you doing today in the Forum?' },
      { target: 'Placetne tibi legere libros?', english: 'Do you like reading books?' },
      { target: 'Gratias tibi ago, amice!', english: 'Thank you very much, friend!' },
      { target: 'Vale, Marce!', english: 'Farewell, Marcus!' },
    ],
  },
  en: {
    code: 'en',
    name: 'Oliver',
    age: 10,
    avatar: '👦🏼',
    location: 'Oxford, United Kingdom',
    flag: '🇬🇧',
    ttsCode: 'en-GB',
    greetingTarget: 'Hello there! My name is Oliver and I live in Oxford. What is your name and what do you like to learn?',
    greetingEnglish: 'Hello there! My name is Oliver and I live in Oxford. What is your name and what do you like to learn?',
    description: 'A friendly Oxford student passionate about English grammar, nature, and creative writing.',
    starterSuggestions: [
      { target: 'Hello Oliver! My name is...', english: 'Hello Oliver! My name is...' },
      { target: 'I am ten years old and my favourite subject is science.', english: 'I am ten years old and my favourite subject is science.' },
      { target: 'What sports or hobbies do you enjoy?', english: 'What sports or hobbies do you enjoy?' },
      { target: 'Could you explain how to describe the weather?', english: 'Could you explain how to describe the weather?' },
    ],
  },
};

/**
 * Intelligent deterministic dialogue matrix for A1/A2 fallback.
 * Ensures fluent, authentic conversational practice even if Nano is not downloaded yet.
 */
function getConversationalFallback(
  input: string,
  lang: string,
  persona: MflPartnerPersona
): { targetText: string; translation: string; coachingTip?: string } {
  const norm = input.toLowerCase().trim();

  if (lang === 'es') {
    if (norm.includes('hola') || norm.includes('buenos días') || norm.includes('buenas tardes')) {
      return {
        targetText: '¡Hola! Es un gran placer hablar contigo. ¿Cómo estás hoy?',
        translation: 'Hello! It is a great pleasure to talk with you. How are you today?',
        coachingTip: '¡Excelente saludo! Recuerda que "hola" siempre lleva la "h" muda.',
      };
    }
    if (norm.includes('me llamo') || norm.includes('mi nombre es') || norm.includes('soy ')) {
      return {
        targetText: '¡Mucho gusto! Qué bonito nombre. ¿De qué ciudad eres tú?',
        translation: 'Nice to meet you! What a nice name. What city are you from?',
        coachingTip: 'Usar "me llamo" es la forma más natural y común en español.',
      };
    }
    if (norm.includes('año') || norm.includes('años') || norm.includes('edad') || /\b\d+\b/.test(norm)) {
      return {
        targetText: '¡Genial! Yo tengo diez años y voy al colegio todos los días en bicicleta. ¿Cuál es tu asignatura favorita?',
        translation: 'Great! I am ten years old and I go to school every day by bike. What is your favourite subject?',
        coachingTip: 'En español decimos "Tener X años" (con el verbo tener, no ser).',
      };
    }
    if (norm.includes('fútbol') || norm.includes('jugar') || norm.includes('deporte') || norm.includes('nadar')) {
      return {
        targetText: '¡A mí también me encanta el deporte! Los sábados juego al fútbol con mis amigos en el parque. ¿Juegas tú en algún equipo?',
        translation: 'I love sports too! On Saturdays I play football with my friends in the park. Do you play on a team?',
        coachingTip: '"Jugar al fútbol" siempre lleva la preposición "a" + "el" = "al".',
      };
    }
    if (norm.includes('comer') || norm.includes('comida') || norm.includes('desayun') || norm.includes('tapas') || norm.includes('pizza') || norm.includes('paella')) {
      return {
        targetText: '¡Qué rico! Me encanta la tortilla de patatas y los churros con chocolate caliente. ¿Qué comida te gusta más a ti?',
        translation: 'How delicious! I love potato omelette and churros with hot chocolate. What food do you like best?',
        coachingTip: '"Qué rico" o "qué delicioso" es la frase perfecta para hablar de comida.',
      };
    }
    if (norm.includes('perro') || norm.includes('gato') || norm.includes('mascota') || norm.includes('animal')) {
      return {
        targetText: '¡Qué simpático! Yo tengo un perro pequeño de color marrón que se llama Toby. ¿Cómo se llama tu mascota?',
        translation: 'How nice! I have a small brown dog named Toby. What is your pet\'s name?',
      };
    }
    if (norm.includes('estación') || norm.includes('tren') || norm.includes('dónde está') || norm.includes('calle')) {
      return {
        targetText: 'Está muy cerca de aquí. Cruza la plaza mayor y gira a la derecha en la segunda calle.',
        translation: 'It is very close to here. Cross the main square and turn right at the second street.',
        coachingTip: '"A la derecha" (right) y "a la izquierda" (left) son esenciales para orientarse.',
      };
    }
    if (norm.includes('adiós') || norm.includes('hasta luego') || norm.includes('chao') || norm.includes('hasta pronto')) {
      return {
        targetText: '¡Hasta luego, amigo! Ha sido un placer charlar contigo. ¡Que tengas un día estupendo!',
        translation: 'See you later, friend! It has been a pleasure chatting with you. Have a wonderful day!',
      };
    }

    // Default engaging response
    return {
      targetText: '¡Qué interesante! Me gusta mucho hablar español contigo. Cuéntame, ¿qué planes tienes para el fin de semana?',
      translation: 'How interesting! I really like speaking Spanish with you. Tell me, what plans do you have for the weekend?',
      coachingTip: '¡Sigue practicando! Cada frase te acerca más a la fluidez.',
    };
  }

  if (lang === 'fr') {
    if (norm.includes('bonjour') || norm.includes('salut') || norm.includes('bonsoir')) {
      return {
        targetText: 'Bonjour ! C’est un grand plaisir de discuter avec toi. Comment vas-tu aujourd’hui ?',
        translation: 'Hello! It is a great pleasure to chat with you. How are you today?',
        coachingTip: '"Comment vas-tu ?" est parfait pour demander des nouvelles poliment.',
      };
    }
    if (norm.includes('je m’appelle') || norm.includes('mon nom est') || norm.includes('je mappelle')) {
      return {
        targetText: 'Enchantée ! C’est un très joli prénom. Dans quelle ville habites-tu ?',
        translation: 'Delighted! That is a very lovely name. Which city do you live in?',
        coachingTip: 'On dit "Enchanté" (garçon) ou "Enchantée" (fille) quand on rencontre quelqu’un.',
      };
    }
    if (norm.includes('an') || norm.includes('ans') || /\b\d+\b/.test(norm)) {
      return {
        targetText: 'Formidable ! Moi j’ai dix ans et j’adore aller à l’école à vélo. Quelle est ta matière préférée ?',
        translation: 'Wonderful! I am ten years old and I love going to school by bicycle. What is your favourite subject?',
        coachingTip: 'En français on utilise le verbe "avoir" pour l’âge : "J\'ai 10 ans".',
      };
    }
    if (norm.includes('croissant') || norm.includes('manger') || norm.includes('chocolat') || norm.includes('baguette') || norm.includes('fromage')) {
      return {
        targetText: 'Miam, quel délice ! J’adore les croissants au beurre et le chocolat chaud le matin. Et toi, que prends-tu au petit-déjeuner ?',
        translation: 'Yum, what a treat! I love butter croissants and hot chocolate in the morning. And you, what do you have for breakfast?',
      };
    }
    if (norm.includes('sport') || norm.includes('football') || norm.includes('vélo') || norm.includes('nager') || norm.includes('musique')) {
      return {
        targetText: 'C’est super ! Le samedi, je fais du vélo le long de la Seine avec ma famille. Tu fais du sport souvent ?',
        translation: 'That is great! On Saturdays, I cycle along the Seine with my family. Do you do sports often?',
      };
    }
    if (norm.includes('chien') || norm.includes('chat') || norm.includes('animal')) {
      return {
        targetText: 'Trop mignon ! J’ai un petit chat tigré qui s’appelle Minou. Tu aimes les animaux ?',
        translation: 'So cute! I have a little tabby cat named Minou. Do you like animals?',
      };
    }
    if (norm.includes('au revoir') || norm.includes('à bientôt') || norm.includes('bonne journée') || norm.includes('salut')) {
      return {
        targetText: 'Au revoir et merci pour cette belle conversation ! Passe une excellente journée à bientôt.',
        translation: 'Goodbye and thank you for this lovely conversation! Have an excellent day and see you soon.',
      };
    }

    return {
      targetText: 'C’est très intéressant ! Dis-moi, qu’est-ce que tu as envie de faire demain après l’école ?',
      translation: 'That is very interesting! Tell me, what do you feel like doing tomorrow after school?',
      coachingTip: 'Bravo ! Tu t\'exprimes de mieux en mieux en français.',
    };
  }

  if (lang === 'la') {
    if (norm.includes('salve') || norm.includes('ave') || norm.includes('bonum')) {
      return {
        targetText: 'Salve, amice! Laetus sum te videre in Foro Romano. Quomodo te habes hodie?',
        translation: 'Greetings, friend! I am joyful to see you in the Roman Forum. How are you today?',
      };
    }
    if (norm.includes('nomen') || norm.includes('sum') || norm.includes('vocor')) {
      return {
        targetText: 'Optime! Libenter te cognosco. In qua terra habitas?',
        translation: 'Excellent! I gladly get to know you. In which land do you live?',
      };
    }
    if (norm.includes('vale') || norm.includes('valete')) {
      return {
        targetText: 'Vale, amice! Dii te tueantur et faustum iter habeas!',
        translation: 'Farewell, friend! May the gods protect you and may you have a blessed journey!',
      };
    }

    return {
      targetText: 'Verba tua libenter audio! Lingua Latina pulchra et clara est. Visne plura de Roma discere?',
      translation: 'I gladly hear your words! The Latin tongue is beautiful and clear. Do you wish to learn more of Rome?',
    };
  }

  // English
  return {
    targetText: 'That is wonderful to hear! English has so many expressive words. What else would you like to explore today?',
    translation: 'That is wonderful to hear! English has so many expressive words. What else would you like to explore today?',
  };
}

/**
 * Executes a conversational turn with the language partner.
 * Checks student input safety, attempts on-device Gemini Nano inference,
 * and gracefully falls back to the deterministic A1/A2 conversation model.
 */
export async function sendMflChatMessage(
  userInput: string,
  lang: string,
  previousHistory: MflChatMessage[] = []
): Promise<{ targetText: string; translation: string; coachingTip?: string; isAiGenerated: boolean }> {
  const persona = MFL_PERSONAS[lang] || MFL_PERSONAS.es;

  // 1. Child Safety Validation
  const safety = validateStudentInput(userInput);
  if (!safety.isSafe) {
    return {
      targetText: persona.greetingTarget,
      translation: persona.greetingEnglish,
      coachingTip: 'Please keep our conversation polite and focused on school topics.',
      isAiGenerated: false,
    };
  }

  // 2. Check for On-Device Gemini Nano Availability
  const canUseNano = hasUserGrantedAiConsent() && aiCaller.isPromptApiAvailableSync();

  if (canUseNano) {
    try {
      const recentHistoryPrompt = previousHistory
        .slice(-4)
        .map((m) => `${m.sender === 'user' ? 'Pupil' : persona.name}: ${m.targetText}`)
        .join('\n');

      const systemPrompt = `You are ${persona.name}, a friendly ${persona.age}-year-old pupil in ${persona.location}.
You are talking to a British primary/secondary school pupil learning ${persona.name}'s native language (${persona.ttsCode}).
Your role is to help them reach conversational fluency (CEFR A1/A2).
Rules:
1. Reply in exactly 1 or 2 clear, natural, friendly sentences in ${persona.name}'s language.
2. Immediately follow with the English translation in parentheses: (English translation here).
3. If the pupil made a minor grammatical mistake or spoke in English, add a 1-line encouraging tip at the very end starting with "Tip: ...".
4. Always ask a simple follow-up question to keep the conversation going.
5. Keep language strictly safe, wholesome, and appropriate for children.`;

      const prompt = `${recentHistoryPrompt ? recentHistoryPrompt + '\n' : ''}Pupil: ${userInput}\n${persona.name}:`;

      const rawAiResponse = await aiCaller.promptText({
        prompt,
        systemPrompt,
        temperature: 0.3,
        topK: 3,
        preserveContext: false,
        timeoutMs: 12000,
      });

      const sanitized = sanitizeAiOutput(rawAiResponse);

      // Parse Target Text, (Translation), and optional Tip:
      const parenMatch = sanitized.match(/\(([^)]+)\)/);
      const tipMatch = sanitized.match(/Tip:\s*(.+)$/i);

      let targetText = sanitized;
      let translation = '';
      let coachingTip: string | undefined = undefined;

      if (parenMatch) {
        translation = parenMatch[1].trim();
        targetText = sanitized.replace(/\([^)]+\)/g, '').replace(/Tip:.+$/i, '').trim();
      }

      if (tipMatch) {
        coachingTip = tipMatch[1].trim();
      }

      if (!translation) {
        // If parentheses were missing, extract fallback translation
        const fallback = getConversationalFallback(userInput, lang, persona);
        translation = fallback.translation;
      }

      if (targetText.length > 5) {
        return {
          targetText,
          translation,
          coachingTip,
          isAiGenerated: true,
        };
      }
    } catch (err) {
      console.warn('[MflConversationEngine] On-device AI inference failed, falling back to deterministic matrix:', err);
    }
  }

  // 3. Deterministic Conversational Fallback
  const fallback = getConversationalFallback(userInput, lang, persona);
  return {
    ...fallback,
    isAiGenerated: false,
  };
}
