// src/components/MflLanguageLab.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticClick,
} from '../services/soundHaptics';
import { triggerCorrectConfetti, triggerMasteryConfetti } from '../utils/confetti';
import { speakInLanguage } from '../engine/translationService';

export interface MflLanguageLabProps {
  onClose?: () => void;
  initialLanguage?: 'es' | 'fr' | 'la' | 'en';
}

interface PhonemeItem {
  id: string;
  symbol: string;
  ipa: string;
  mouthTip: string;
  exampleWord: string;
  translation: string;
}

interface VerbConjugation {
  infinitive: string;
  translation: string;
  type: string;
  stem: string;
  forms: {
    pronoun: string;
    ending: string;
    full: string;
    english: string;
  }[];
}

interface VocabCard {
  id: string;
  targetWord: string;
  english: string;
  phonetic: string;
  category: string;
  partOfSpeech: string;
  exampleSentence: string;
}

export interface DialogueTurnOption {
  text: string;
  english: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DialogueTurn {
  id: string;
  speaker: string;
  avatar: string;
  isNpc: boolean;
  phrase: string;
  english: string;
  audioPrompt: string;
  culturalNote?: string;
  options?: DialogueTurnOption[];
}

export interface DialogueScenario {
  id: string;
  title: string;
  setting: string;
  themeColor: string;
  icon: string;
  stageType: 'cafe' | 'market' | 'station' | 'library' | 'roman';
  turns: DialogueTurn[];
}

interface LanguageDataset {
  code: string;
  name: string;
  flag: string;
  ttsCode: string;
  description: string;
  phonemes: PhonemeItem[];
  verbs: VerbConjugation[];
  vocabulary: VocabCard[];
  scenarios: DialogueScenario[];
}

const LANGUAGE_DATASETS: Record<string, LanguageDataset> = {
  es: {
    code: 'es',
    name: 'Spanish (Español)',
    flag: '🇪🇸',
    ttsCode: 'es-ES',
    description: 'KS2 & KS3 Modern Foreign Language: Phonetic consistency, three verb paradigms (-ar, -er, -ir), and pro-drop syntax.',
    phonemes: [
      { id: 'es-1', symbol: 'ñ', ipa: '/ɲ/', mouthTip: 'Tongue presses against hard palate, like "ny" in canyon.', exampleWord: 'mañana', translation: 'tomorrow / morning' },
      { id: 'es-2', symbol: 'rr', ipa: '/r/', mouthTip: 'Tip of tongue vibrates rapidly against upper gum ridge.', exampleWord: 'perro', translation: 'dog' },
      { id: 'es-3', symbol: 'll', ipa: '/ʝ/ or /ʎ/', mouthTip: 'Pronounced like English "y" in yes or "ly" in million.', exampleWord: 'lluvia', translation: 'rain' },
      { id: 'es-4', symbol: 'j / ge,gi', ipa: '/x/', mouthTip: 'Strong breathy throat friction, like Scottish "loch" or German "Bach".', exampleWord: 'jirafa', translation: 'giraffe' },
      { id: 'es-5', symbol: 'z / ce,ci', ipa: '/θ/ or /s/', mouthTip: 'Castilian lisp like "th" in think, or soft "s" in Latin America.', exampleWord: 'corazón', translation: 'heart' },
      { id: 'es-6', symbol: 'h', ipa: 'silent', mouthTip: 'Always completely silent in Spanish! Never pronounce an initial h.', exampleWord: 'hola', translation: 'hello' },
    ],
    verbs: [
      {
        infinitive: 'hablar',
        translation: 'to speak',
        type: '-ar regular',
        stem: 'habl',
        forms: [
          { pronoun: 'yo', ending: 'o', full: 'hablo', english: 'I speak' },
          { pronoun: 'tú', ending: 'as', full: 'hablas', english: 'you speak (informal)' },
          { pronoun: 'él / ella', ending: 'a', full: 'habla', english: 'he / she speaks' },
          { pronoun: 'nosotros', ending: 'amos', full: 'hablamos', english: 'we speak' },
          { pronoun: 'vosotros', ending: 'áis', full: 'habláis', english: 'you all speak (Spain)' },
          { pronoun: 'ellos / ellas', ending: 'an', full: 'hablan', english: 'they speak' },
        ],
      },
      {
        infinitive: 'comer',
        translation: 'to eat',
        type: '-er regular',
        stem: 'com',
        forms: [
          { pronoun: 'yo', ending: 'o', full: 'como', english: 'I eat' },
          { pronoun: 'tú', ending: 'es', full: 'comes', english: 'you eat' },
          { pronoun: 'él / ella', ending: 'e', full: 'come', english: 'he / she eats' },
          { pronoun: 'nosotros', ending: 'emos', full: 'comemos', english: 'we eat' },
          { pronoun: 'vosotros', ending: 'éis', full: 'coméis', english: 'you all eat' },
          { pronoun: 'ellos / ellas', ending: 'en', full: 'comen', english: 'they eat' },
        ],
      },
      {
        infinitive: 'vivir',
        translation: 'to live',
        type: '-ir regular',
        stem: 'viv',
        forms: [
          { pronoun: 'yo', ending: 'o', full: 'vivo', english: 'I live' },
          { pronoun: 'tú', ending: 'es', full: 'vives', english: 'you live' },
          { pronoun: 'él / ella', ending: 'e', full: 'vive', english: 'he / she lives' },
          { pronoun: 'nosotros', ending: 'imos', full: 'vivimos', english: 'we live' },
          { pronoun: 'vosotros', ending: 'ís', full: 'vivís', english: 'you all live' },
          { pronoun: 'ellos / ellas', ending: 'en', full: 'viven', english: 'they live' },
        ],
      },
    ],
    vocabulary: [
      { id: 'v-es-1', targetWord: 'buenos días', english: 'good morning', phonetic: 'BWEH-nohs DEE-ahs', category: 'Greetings', partOfSpeech: 'phrase', exampleSentence: '¡Buenos días, profesor!' },
      { id: 'v-es-2', targetWord: 'por favor', english: 'please', phonetic: 'pohr fah-BVOHR', category: 'Courtesy', partOfSpeech: 'phrase', exampleSentence: 'Un agua mineral, por favor.' },
      { id: 'v-es-3', targetWord: 'muchas gracias', english: 'thank you very much', phonetic: 'MOO-chahs GRAH-syahs', category: 'Courtesy', partOfSpeech: 'phrase', exampleSentence: 'Muchas gracias por tu ayuda.' },
      { id: 'v-es-4', targetWord: 'el libro', english: 'the book', phonetic: 'ehl LEE-broh', category: 'School & Desk', partOfSpeech: 'noun (m)', exampleSentence: 'Abro el libro de matemáticas.' },
      { id: 'v-es-5', targetWord: 'la biblioteca', english: 'the library', phonetic: 'lah bee-blyoh-TEH-kah', category: 'School & Town', partOfSpeech: 'noun (f)', exampleSentence: 'Estudio en la biblioteca en silencio.' },
      { id: 'v-es-6', targetWord: '¿cómo te llamas?', english: 'what is your name?', phonetic: 'KOH-moh teh YAH-mahs', category: 'Greetings', partOfSpeech: 'phrase', exampleSentence: 'Hola, ¿cómo te llamas tú?' },
    ],
    scenarios: [
      {
        id: 'cafe-madrid',
        title: 'Café de la Plaza (Madrid)',
        setting: 'Sunlit sidewalk café on the Plaza Mayor',
        themeColor: '#ea580c',
        icon: '☕',
        stageType: 'cafe',
        turns: [
          {
            id: 'es-c1',
            speaker: 'Camarero',
            avatar: '👨‍🍳',
            isNpc: true,
            phrase: '¡Hola, buenos días! Bienvenido. ¿Qué le pongo para desayunar?',
            english: 'Hello, good morning! Welcome. What can I get you for breakfast?',
            audioPrompt: 'Hola, buenos días. Bienvenido. ¿Qué le pongo para desayunar?',
            culturalNote: 'In Spain, "buenos días" is spoken until lunchtime (around 2:00 PM).',
            options: [
              {
                text: 'Buenos días. Un café con leche y una tostada con tomate, por favor.',
                english: 'Good morning. A coffee with milk and tomato toast, please.',
                isCorrect: true,
                feedback: '¡Excelente! "Café con leche" and "tostada con tomate" is the quintessential Spanish breakfast.',
              },
              {
                text: 'Me gusta mucho nadar en la piscina grande.',
                english: 'I really like swimming in the big swimming pool.',
                isCorrect: false,
                feedback: 'Swimming is great, but the waiter asked what you would like to eat!',
              },
              {
                text: 'Hasta luego, muchas gracias señor.',
                english: 'See you later, thank you very much sir.',
                isCorrect: false,
                feedback: 'Don\'t leave yet—you just sat down to order!',
              },
            ],
          },
          {
            id: 'es-c2',
            speaker: 'Camarero',
            avatar: '👨‍🍳',
            isNpc: true,
            phrase: '¡Marchando! ¿Quiere el café caliente o templado? ¿Y con azúcar?',
            english: 'Coming right up! Would you like the coffee hot or warm? And with sugar?',
            audioPrompt: 'Marchando. ¿Quiere el café caliente o templado? ¿Y con azúcar?',
            culturalNote: 'Spaniards often specify "caliente" (steaming hot) or "templado" (warm/drinkable).',
            options: [
              {
                text: 'Caliente y con un sobre de azúcar, por favor.',
                english: 'Hot and with a packet of sugar, please.',
                isCorrect: true,
                feedback: '¡Perfecto! Clear, polite, and authentic.',
              },
              {
                text: 'Yo tengo doce años y vivo en Londres.',
                english: 'I am 12 years old and I live in London.',
                isCorrect: false,
                feedback: 'Good grammar, but the barista needs to know how you like your coffee!',
              },
            ],
          },
          {
            id: 'es-c3',
            speaker: 'Camarero',
            avatar: '👨‍🍳',
            isNpc: true,
            phrase: 'Aquí tiene su desayuno. Son tres euros con cincuenta céntimos.',
            english: 'Here is your breakfast. That is three euros and fifty cents.',
            audioPrompt: 'Aquí tiene su desayuno. Son tres euros con cincuenta céntimos.',
            culturalNote: 'In Spanish cafés, it is customary to say "quédese con el cambio" if leaving a small tip.',
            options: [
              {
                text: 'Aquí tiene cuatro euros. Quédese con el cambio, ¡muchas gracias!',
                english: 'Here are four euros. Keep the change, thank you very much!',
                isCorrect: true,
                feedback: '¡Bravo! You completed the café order with genuine Spanish hospitality.',
              },
              {
                text: 'No me gustan los gatos negros.',
                english: 'I do not like black cats.',
                isCorrect: false,
                feedback: 'Random! The waiter is asking for payment for the delicious breakfast.',
              },
            ],
          },
        ],
      },
      {
        id: 'mercado-valencia',
        title: 'Mercado Central (Valencia)',
        setting: 'Bustling art-nouveau covered market with fresh Mediterranean produce',
        themeColor: '#16a34a',
        icon: '🍎',
        stageType: 'market',
        turns: [
          {
            id: 'es-m1',
            speaker: 'Frutero',
            avatar: '👨‍🌾',
            isNpc: true,
            phrase: '¡Hola! Buenas tardes. Mire qué fresas tan ricas y qué naranjas de la huerta. ¿Qué le pongo?',
            english: 'Hello! Good afternoon. Look at these delicious strawberries and orchard oranges. What can I get you?',
            audioPrompt: 'Hola, buenas tardes. ¿Qué le pongo?',
            culturalNote: 'In Spanish markets, saying "Póngame..." ("put me...") is the authentic polite imperative to order produce.',
            options: [
              {
                text: 'Buenas tardes. Póngame un kilo de naranjas y medio kilo de fresas, por favor.',
                english: 'Good afternoon. Please give me one kilo of oranges and half a kilo of strawberries.',
                isCorrect: true,
                feedback: '¡Genial! "Póngame un kilo" is the perfect native expression at any Spanish market stall.',
              },
              {
                text: 'El bolígrafo está en la mesa azul.',
                english: 'The pen is on the blue table.',
                isCorrect: false,
                feedback: 'Incorrect context! The greengrocer is waiting for your fruit order.',
              },
            ],
          },
          {
            id: 'es-m2',
            speaker: 'Frutero',
            avatar: '👨‍🌾',
            isNpc: true,
            phrase: '¡Marchando! Las naranjas están a dos euros el kilo. ¿Desea algo más?',
            english: 'Coming right up! Oranges are €2/kg. Would you like anything else?',
            audioPrompt: 'Marchando. Las naranjas están a dos euros el kilo. ¿Desea algo más?',
            culturalNote: 'Asking "¿Cuánto es todo?" (How much is everything?) is the natural closing question.',
            options: [
              {
                text: 'Nada más, muchas gracias. ¿Cuánto es todo?',
                english: 'Nothing else, thank you very much. How much is everything?',
                isCorrect: true,
                feedback: '¡Estupendo! Natural phrasing for wrapping up your purchases.',
              },
              {
                text: 'Yo juego al fútbol todos los martes.',
                english: 'I play football every Tuesday.',
                isCorrect: false,
                feedback: 'Irrelevant! Confirm whether you want more fruit or the total price.',
              },
            ],
          },
          {
            id: 'es-m3',
            speaker: 'Frutero',
            avatar: '👨‍🌾',
            isNpc: true,
            phrase: 'Son cuatro euros con veinte en total. ¿Paga en efectivo o con tarjeta?',
            english: 'That is four euros twenty in total. Do you pay in cash or with card?',
            audioPrompt: 'Son cuatro euros con veinte en total. ¿Paga en efectivo o con tarjeta?',
            culturalNote: 'Saying "en efectivo" (cash) or "con tarjeta" (card) completes the transaction smoothly.',
            options: [
              {
                text: 'En efectivo, aquí tiene cinco euros exactos. ¡Hasta la próxima!',
                english: 'In cash, here are five euros. Until next time!',
                isCorrect: true,
                feedback: '¡Perfecto! You handled local weights, prices, and payments like a native.',
              },
              {
                text: 'Mi hermano se llama Carlos.',
                english: 'My brother is called Carlos.',
                isCorrect: false,
                feedback: 'The vendor needs to know your payment method!',
              },
            ],
          },
        ],
      },
      {
        id: 'estacion-madrid',
        title: 'Estación de Atocha (Madrid)',
        setting: 'Major central train terminus beneath iron vaults and tropical garden',
        themeColor: '#2563eb',
        icon: '🚆',
        stageType: 'station',
        turns: [
          {
            id: 'es-t1',
            speaker: 'Taquillera',
            avatar: '👩‍💼',
            isNpc: true,
            phrase: 'Buenos días. Siguiente en la fila, por favor. ¿Adónde desea viajar?',
            english: 'Good morning. Next in line, please. Where do you wish to travel?',
            audioPrompt: 'Buenos días. ¿Adónde desea viajar?',
            culturalNote: 'High-speed trains in Spain are called AVE (Alta Velocidad Española).',
            options: [
              {
                text: 'Buenos días. Quisiera un billete para Barcelona en el tren de alta velocidad, por favor.',
                english: 'Good morning. I would like a ticket to Barcelona on the high-speed train, please.',
                isCorrect: true,
                feedback: '¡Muy bien! "Quisiera un billete" is the polite conditional used at ticket windows.',
              },
              {
                text: 'Tengo un perro marrón que ladra mucho.',
                english: 'I have a brown dog that barks a lot.',
                isCorrect: false,
                feedback: 'Nice dog, but the ticket officer needs to know your destination!',
              },
            ],
          },
          {
            id: 'es-t2',
            speaker: 'Taquillera',
            avatar: '👩‍💼',
            isNpc: true,
            phrase: '¿Lo prefiere de ida solamente, o de ida y vuelta para este fin de semana?',
            english: 'Do you prefer single ticket only, or return for this weekend?',
            audioPrompt: '¿Lo prefiere de ida solamente, o de ida y vuelta?',
            culturalNote: '"Ida" means single; "ida y vuelta" means round-trip / return.',
            options: [
              {
                text: 'De ida y vuelta, por favor. Salgo hoy y regreso el domingo por la tarde.',
                english: 'Return, please. I leave today and return on Sunday afternoon.',
                isCorrect: true,
                feedback: '¡Exacto! Specifying both departure and return dates is crucial at ticket desks.',
              },
              {
                text: 'Ayer comí paella con marisco.',
                english: 'Yesterday I ate paella with seafood.',
                isCorrect: false,
                feedback: 'Tasty, but please select single (ida) or return (ida y vuelta).',
              },
            ],
          },
          {
            id: 'es-t3',
            speaker: 'Taquillera',
            avatar: '👩‍💼',
            isNpc: true,
            phrase: 'Aquí tiene sus billetes. El tren sale del andén número cuatro a las diez. ¡Buen viaje!',
            english: 'Here are your tickets. The train departs from platform 4 at ten o\'clock. Have a good trip!',
            audioPrompt: 'El tren sale del andén número cuatro. ¡Buen viaje!',
            culturalNote: '"Andén" is the Spanish word for railway platform.',
            options: [
              {
                text: 'Muchas gracias por su ayuda. ¡Que tenga un buen día!',
                english: 'Thank you very much for your help. Have a good day!',
                isCorrect: true,
                feedback: '¡Excelente! You successfully booked inter-city train travel in Spanish.',
              },
              {
                text: 'No me gusta el frío.',
                english: 'I do not like the cold.',
                isCorrect: false,
                feedback: 'Say thank you and wish the officer a good day!',
              },
            ],
          },
        ],
      },
    ],
  },
  fr: {
    code: 'fr',
    name: 'French (Français)',
    flag: '🇫🇷',
    ttsCode: 'fr-FR',
    description: 'KS2 & KS3 Modern Foreign Language: Nasal vowels, liaison links, silent final letters, and noun gender agreement.',
    phonemes: [
      { id: 'fr-1', symbol: 'u vs ou', ipa: '/y/ vs /u/', mouthTip: 'For "u" (tu), purse lips tight as for "ooh" but say "ee". For "ou" (tout), lips rounded relaxed.', exampleWord: 'la lune / la soupe', translation: 'the moon / the soup' },
      { id: 'fr-2', symbol: 'on / an / in', ipa: '/ɔ̃, ɑ̃, ɛ̃/', mouthTip: 'Nasal vowels: Air flows simultaneously through nose and mouth without closing lips.', exampleWord: 'bonbon / enfant / vin', translation: 'sweet / child / wine' },
      { id: 'fr-3', symbol: 'r', ipa: '/ʁ/', mouthTip: 'Uvular friction at back of soft palate, like gentle gargling.', exampleWord: 'rouge', translation: 'red' },
      { id: 'fr-4', symbol: 'ç (c-cedilla)', ipa: '/s/', mouthTip: 'Forces the letter c to sound soft like "s" before a, o, u.', exampleWord: 'garçon', translation: 'boy' },
      { id: 'fr-5', symbol: 'silent finals', ipa: 'silent', mouthTip: 'Final -d, -s, -t, -x, and -ent are usually silent unless liaison occurs.', exampleWord: 'grand / ils parlent', translation: 'big / they speak' },
    ],
    verbs: [
      {
        infinitive: 'parler',
        translation: 'to speak',
        type: '-er regular',
        stem: 'parl',
        forms: [
          { pronoun: 'je', ending: 'e', full: 'je parle', english: 'I speak' },
          { pronoun: 'tu', ending: 'es', full: 'tu parles', english: 'you speak' },
          { pronoun: 'il / elle', ending: 'e', full: 'il parle', english: 'he / she speaks' },
          { pronoun: 'nous', ending: 'ons', full: 'nous parlons', english: 'we speak' },
          { pronoun: 'vous', ending: 'ez', full: 'vous parlez', english: 'you all speak' },
          { pronoun: 'ils / elles', ending: 'ent', full: 'ils parlent', english: 'they speak' },
        ],
      },
      {
        infinitive: 'finir',
        translation: 'to finish',
        type: '-ir regular',
        stem: 'fin',
        forms: [
          { pronoun: 'je', ending: 'is', full: 'je finis', english: 'I finish' },
          { pronoun: 'tu', ending: 'is', full: 'tu finis', english: 'you finish' },
          { pronoun: 'il / elle', ending: 'it', full: 'il finit', english: 'he / she finishes' },
          { pronoun: 'nous', ending: 'issons', full: 'nous finissons', english: 'we finish' },
          { pronoun: 'vous', ending: 'issez', full: 'vous finissez', english: 'you all finish' },
          { pronoun: 'ils / elles', ending: 'issent', full: 'ils finissent', english: 'they finish' },
        ],
      },
    ],
    vocabulary: [
      { id: 'v-fr-1', targetWord: 'bonjour', english: 'hello / good day', phonetic: 'bohn-ZHOOR', category: 'Greetings', partOfSpeech: 'interjection', exampleSentence: 'Bonjour madame la directrice.' },
      { id: 'v-fr-2', targetWord: "s'il vous plaît", english: 'please (formal)', phonetic: 'seel voo PLEH', category: 'Courtesy', partOfSpeech: 'phrase', exampleSentence: 'Un croissant, s’il vous plaît.' },
      { id: 'v-fr-3', targetWord: 'merci beaucoup', english: 'thank you very much', phonetic: 'mehr-SEE boh-KOO', category: 'Courtesy', partOfSpeech: 'phrase', exampleSentence: 'Merci beaucoup pour votre aide.' },
      { id: 'v-fr-4', targetWord: 'le stylo', english: 'the pen', phonetic: 'luh stee-LOH', category: 'School & Desk', partOfSpeech: 'noun (m)', exampleSentence: 'J’écris avec mon stylo bleu.' },
      { id: 'v-fr-5', targetWord: 'la pomme', english: 'the apple', phonetic: 'lah POHM', category: 'Food & Drink', partOfSpeech: 'noun (f)', exampleSentence: 'Je mange une pomme rouge à midi.' },
      { id: 'v-fr-6', targetWord: 'je m’appelle', english: 'my name is', phonetic: 'zhuh mah-PEHL', category: 'Greetings', partOfSpeech: 'phrase', exampleSentence: 'Bonjour, je m’appelle Claire.' },
    ],
    scenarios: [
      {
        id: 'bistro-paris',
        title: 'Le Petit Bistro (Paris)',
        setting: 'Charming sidewalk terrace near the River Seine',
        themeColor: '#2563eb',
        icon: '🥐',
        stageType: 'cafe',
        turns: [
          {
            id: 'fr-c1',
            speaker: 'Serveur',
            avatar: '🥖',
            isNpc: true,
            phrase: 'Bonjour madame, bonjour monsieur ! Vous avez choisi votre commande ?',
            english: 'Hello! Have you chosen your order?',
            audioPrompt: 'Bonjour ! Vous avez choisi votre commande ?',
            culturalNote: 'Always say "Bonjour" before asking for anything in a French café; skipping it is considered abrupt.',
            options: [
              {
                text: 'Bonjour ! Je voudrais un café crème et un croissant chaud, s’il vous plaît.',
                english: 'Hello! I would like a white coffee and a warm croissant, please.',
                isCorrect: true,
                feedback: 'Parfait ! "Je voudrais" is the polite conditional tense expected when ordering.',
              },
              {
                text: 'La tour Eiffel est très grande et jolie.',
                english: 'The Eiffel tower is very big and pretty.',
                isCorrect: false,
                feedback: 'True, but the waiter is waiting for your breakfast order!',
              },
            ],
          },
          {
            id: 'fr-c2',
            speaker: 'Serveur',
            avatar: '🥖',
            isNpc: true,
            phrase: 'Très bien. Ce sera sur place en terrasse ou bien à emporter ?',
            english: 'Very good. Will that be here on the terrace or to go?',
            audioPrompt: 'Très bien. Ce sera sur place en terrasse ou à emporter ?',
            culturalNote: 'In France, drinks cost slightly more when seated "en terrasse" than standing at the zinc counter.',
            options: [
              {
                text: 'En terrasse sur place, merci beaucoup !',
                english: 'On the terrace here, thank you very much!',
                isCorrect: true,
                feedback: 'Magnifique ! Ready to enjoy the Paris atmosphere.',
              },
              {
                text: 'Je n’aime pas faire mes devoirs.',
                english: 'I do not like doing my homework.',
                isCorrect: false,
                feedback: 'Homework can wait; choose your seating location!',
              },
            ],
          },
          {
            id: 'fr-c3',
            speaker: 'Serveur',
            avatar: '🥖',
            isNpc: true,
            phrase: 'Et voilà pour vous ! Ça fait quatre euros vingt, s’il vous plaît.',
            english: 'And here you go! That comes to four euros and twenty cents, please.',
            audioPrompt: 'Et voilà pour vous ! Ça fait quatre euros vingt, s’il vous plaît.',
            culturalNote: 'Saying "merci, bonne journée" finishes your interaction with classic French courtesy.',
            options: [
              {
                text: 'Voici cinq euros. Gardez la monnaie ! Merci et bonne journée.',
                english: 'Here are five euros. Keep the change! Thank you and have a good day.',
                isCorrect: true,
                feedback: 'Très bien ! A polite, natural French café dialogue mastered.',
              },
              {
                text: 'Bonne nuit à demain matin.',
                english: 'Good night until tomorrow morning.',
                isCorrect: false,
                feedback: 'It is morning right now, not bedtime!',
              },
            ],
          },
        ],
      },
      {
        id: 'marche-provence',
        title: 'Le Marché Provençal (Aix)',
        setting: 'Open-air market square with lavender, olives, and fresh cheeses',
        themeColor: '#16a34a',
        icon: '🧀',
        stageType: 'market',
        turns: [
          {
            id: 'fr-m1',
            speaker: 'Fromagère',
            avatar: '👩‍🌾',
            isNpc: true,
            phrase: 'Bonjour ! Regardez nos beaux fromages et nos fruits frais. Qu’est-ce qui vous ferait plaisir ?',
            english: 'Hello! Look at our beautiful cheeses and fresh fruit. What would you like?',
            audioPrompt: 'Bonjour ! Qu’est-ce qui vous ferait plaisir ?',
            culturalNote: '"Qu’est-ce qui vous ferait plaisir ?" is the classic warm French market greeting.',
            options: [
              {
                text: 'Bonjour madame ! Je voudrais un morceau de fromage et deux baguettes, s’il vous plaît.',
                english: 'Hello! I would like a piece of cheese and two baguettes, please.',
                isCorrect: true,
                feedback: 'Parfait ! Polite greeting with "madame" and precise conditional ordering.',
              },
              {
                text: 'J’ai perdu mes clés de maison hier.',
                english: 'I lost my house keys yesterday.',
                isCorrect: false,
                feedback: 'Unfortunate, but tell the cheesemonger what you want to buy!',
              },
            ],
          },
          {
            id: 'fr-m2',
            speaker: 'Fromagère',
            avatar: '👩‍🌾',
            isNpc: true,
            phrase: 'Très bien. Ce morceau fait environ deux cents grammes. Et avec ceci ?',
            english: 'Very good. This piece is about 200 grams. And with this?',
            audioPrompt: 'Et avec ceci ?',
            culturalNote: '"Et avec ceci ?" is the standard question vendors ask to check if you need more items.',
            options: [
              {
                text: 'Ce sera tout pour aujourd’hui, merci. Combien je vous dois ?',
                english: 'That will be all for today, thank you. How much do I owe you?',
                isCorrect: true,
                feedback: 'Très élégant ! "Combien je vous dois ?" is the authentic way to ask for the total.',
              },
              {
                text: 'Le train part à midi.',
                english: 'The train departs at noon.',
                isCorrect: false,
                feedback: 'Wrong scene! Tell the vendor you are done shopping.',
              },
            ],
          },
          {
            id: 'fr-m3',
            speaker: 'Fromagère',
            avatar: '👩‍🌾',
            isNpc: true,
            phrase: 'Ça vous fait six euros cinquante au total. Vous réglez par carte ou en espèces ?',
            english: 'That makes €6.50 in total. Do you pay by card or in cash?',
            audioPrompt: 'Ça vous fait six euros cinquante au total.',
            culturalNote: '"En espèces" is the official French term for physical cash coins and notes.',
            options: [
              {
                text: 'Par carte bancaire sans contact, s’il vous plaît. Bonne journée madame !',
                english: 'By contactless bank card, please. Have a good day madam!',
                isCorrect: true,
                feedback: 'Bravo ! Flawless French market transaction completed.',
              },
              {
                text: 'Je déteste les tomates.',
                english: 'I hate tomatoes.',
                isCorrect: false,
                feedback: 'Select your payment method (card or cash)!',
              },
            ],
          },
        ],
      },
      {
        id: 'gare-lyon',
        title: 'La Gare de Lyon (Billetterie SNCF)',
        setting: 'Busy central train station terminal under the iconic clock tower',
        themeColor: '#2563eb',
        icon: '🚄',
        stageType: 'station',
        turns: [
          {
            id: 'fr-t1',
            speaker: 'Guichetier',
            avatar: '👨‍✈️',
            isNpc: true,
            phrase: 'Bonjour. Quel est votre voyage aujourd’hui ?',
            english: 'Hello. What is your journey today?',
            audioPrompt: 'Bonjour. Quel est votre voyage aujourd’hui ?',
            culturalNote: 'SNCF is the French national railway company; TGV is the high-speed train.',
            options: [
              {
                text: 'Bonjour ! Je voudrais réserver un aller-retour pour Lyon en TGV, s’il vous plaît.',
                english: 'Hello! I would like to book a return to Lyon on the TGV, please.',
                isCorrect: true,
                feedback: 'Exactement ! "Un aller-retour" is the standard phrase for a round-trip ticket.',
              },
              {
                text: 'Je porte un chapeau bleu.',
                english: 'I am wearing a blue hat.',
                isCorrect: false,
                feedback: 'The ticket agent needs your travel destination!',
              },
            ],
          },
          {
            id: 'fr-t2',
            speaker: 'Guichetier',
            avatar: '👨‍✈️',
            isNpc: true,
            phrase: 'Très bien. Vous préférez voyager côté couloir ou côté fenêtre ?',
            english: 'Very good. Do you prefer to travel aisle side or window side?',
            audioPrompt: 'Vous préférez voyager côté couloir ou côté fenêtre ?',
            culturalNote: '"Côté couloir" = aisle seat; "côté fenêtre" = window seat.',
            options: [
              {
                text: 'Côté fenêtre s’il reste de la place, s’il vous plaît.',
                english: 'Window side if there is space remaining, please.',
                isCorrect: true,
                feedback: 'Superbe ! Specifying seat preferences is tested in GCSE speaking.',
              },
              {
                text: 'Je vais chanter une chanson.',
                english: 'I am going to sing a song.',
                isCorrect: false,
                feedback: 'Please choose aisle (couloir) or window (fenêtre)!',
              },
            ],
          },
          {
            id: 'fr-t3',
            speaker: 'Guichetier',
            avatar: '👨‍✈️',
            isNpc: true,
            phrase: 'Voici votre billet. Le train partira voie A à quatorze heures quinze. Bon voyage !',
            english: 'Here is your ticket. The train will depart from track A at 14:15. Have a good journey!',
            audioPrompt: 'Le train partira voie A. Bon voyage !',
            culturalNote: 'French trains use 24-hour military time exclusively for timetables.',
            options: [
              {
                text: 'Merci beaucoup pour votre aide. Au revoir et bonne journée !',
                english: 'Thank you very much for your help. Goodbye and have a good day!',
                isCorrect: true,
                feedback: 'Félicitations ! You booked French train travel with complete confidence.',
              },
              {
                text: 'Mon vélo est cassé.',
                english: 'My bicycle is broken.',
                isCorrect: false,
                feedback: 'Thank the conductor and take your ticket!',
              },
            ],
          },
        ],
      },
    ],
  },
  la: {
    code: 'la',
    name: 'Latin Roots (Lingua Latina)',
    flag: '🏛️',
    ttsCode: 'it-IT',
    description: 'Etymology & Classical Substrate: 60% of English academic words and 90% of scientific vocabulary stem from Latin roots.',
    phonemes: [
      { id: 'la-1', symbol: 'v = w', ipa: '/w/', mouthTip: 'Classical Latin "v" is pronounced as English "w" (Veni = Weh-nee).', exampleWord: 'veni, vidi, vici', translation: 'I came, I saw, I conquered' },
      { id: 'la-2', symbol: 'c = k', ipa: '/k/', mouthTip: 'Classical Latin "c" is always hard like k, never soft like s.', exampleWord: 'Cicero (Kikero)', translation: 'Cicero (famous Roman orator)' },
      { id: 'la-3', symbol: 'ae = eye', ipa: '/aɪ/', mouthTip: 'Diphthong "ae" sounds like the English word "eye".', exampleWord: 'caelum', translation: 'sky / the heavens' },
      { id: 'la-4', symbol: 'gn = ng-n', ipa: '/ŋn/', mouthTip: 'Sounded distinctly like hang-nail (ma-g-nus).', exampleWord: 'magnus', translation: 'great / large' },
    ],
    verbs: [
      {
        infinitive: 'amare',
        translation: 'to love',
        type: '1st conjugation',
        stem: 'am',
        forms: [
          { pronoun: 'ego', ending: 'o', full: 'amo', english: 'I love (amiable, amorous)' },
          { pronoun: 'tu', ending: 'as', full: 'amas', english: 'you love' },
          { pronoun: 'is / ea', ending: 'at', full: 'amat', english: 'he / she loves' },
          { pronoun: 'nos', ending: 'amus', full: 'amamus', english: 'we love' },
          { pronoun: 'vos', ending: 'atis', full: 'amatis', english: 'you all love' },
          { pronoun: 'ii / eae', ending: 'ant', full: 'amant', english: 'they love' },
        ],
      },
    ],
    vocabulary: [
      { id: 'v-la-1', targetWord: 'aqua', english: 'water', phonetic: 'AH-kwah', category: 'Roots -> English', partOfSpeech: 'noun (f)', exampleSentence: 'Derivatives: Aquarium, aquatic, aqueduct.' },
      { id: 'v-la-2', targetWord: 'scribere / scriptum', english: 'to write', phonetic: 'SKREE-beh-reh', category: 'Roots -> English', partOfSpeech: 'verb', exampleSentence: 'Derivatives: Scribe, script, manuscript, describe.' },
      { id: 'v-la-3', targetWord: 'spectare', english: 'to look at / watch', phonetic: 'spehk-TAH-reh', category: 'Roots -> English', partOfSpeech: 'verb', exampleSentence: 'Derivatives: Spectator, inspect, spectacle.' },
      { id: 'v-la-4', targetWord: 'pes / pedis', english: 'foot', phonetic: 'pehs / PEH-dis', category: 'Roots -> English', partOfSpeech: 'noun (m)', exampleSentence: 'Derivatives: Pedestrian, pedal, pedestal, impede.' },
      { id: 'v-la-5', targetWord: 'terra', english: 'earth / land', phonetic: 'TEHR-rah', category: 'Roots -> English', partOfSpeech: 'noun (f)', exampleSentence: 'Derivatives: Terrestrial, terrain, subterranean.' },
    ],
    scenarios: [
      {
        id: 'in-atrio',
        title: 'In Atrio Villae (The Roman Domus)',
        setting: 'Classical marble atrium and impluvium pool in a Roman town house',
        themeColor: '#7c3aed',
        icon: '🏛️',
        stageType: 'roman',
        turns: [
          {
            id: 'la-a1',
            speaker: 'Caecilius',
            avatar: '🏛️',
            isNpc: true,
            phrase: 'Salve, amice! Quid novi in urbe Pompeiana hodie?',
            english: 'Greetings, friend! What is new in the city of Pompeii today?',
            audioPrompt: 'Salve, amice! Quid novi in urbe Pompeiana hodie?',
            culturalNote: 'The atrium was the formal reception hall where the Roman paterfamilias welcomed guests (salutatio).',
            options: [
              {
                text: 'Salve, Caecili! Mercatores multi in foro clamant et navem in portu exspectant.',
                english: 'Greetings, Caecilius! Many merchants are shouting in the forum and awaiting a ship in the port.',
                isCorrect: true,
                feedback: 'Optime! Classical Cambridge Latin Course greeting and natural accusative phrasing.',
              },
              {
                text: 'Lupus in silva currit.',
                english: 'The wolf runs in the woods.',
                isCorrect: false,
                feedback: 'Dramatic, but Caecilius is asking for news from the town!',
              },
            ],
          },
          {
            id: 'la-a2',
            speaker: 'Caecilius',
            avatar: '🏛️',
            isNpc: true,
            phrase: 'Placetne tibi nobiscum cenare in triclinio vespere?',
            english: 'Would you like to dine with us in the dining room this evening?',
            audioPrompt: 'Placetne tibi nobiscum cenare in triclinio vespere?',
            culturalNote: 'Roman dinner parties (cena) took place in the triclinium where guests reclined on couches.',
            options: [
              {
                text: 'Libenter! Gratias maximas tibi ago pro benignitate tua.',
                english: 'Gladly! I give you the greatest thanks for your kindness.',
                isCorrect: true,
                feedback: 'Praeclarum! "Libenter" (gladly/with pleasure) is the polite classical acceptance.',
              },
              {
                text: 'Equus dormit in campo.',
                english: 'The horse sleeps in the field.',
                isCorrect: false,
                feedback: 'Accept Caecilius\'s invitation to the triclinium for dinner!',
              },
            ],
          },
        ],
      },
      {
        id: 'in-foro',
        title: 'In Foro Romano (Senate & Oratory)',
        setting: 'The bustling Forum Romanum before the marble steps of the Senate',
        themeColor: '#b45309',
        icon: '📜',
        stageType: 'roman',
        turns: [
          {
            id: 'la-f1',
            speaker: 'Senator',
            avatar: '🏛️',
            isNpc: true,
            phrase: 'Salve civis. Audivistine orationem hodie de legibus reipublicae?',
            english: 'Greetings citizen. Did you hear the speech today concerning the laws of the republic?',
            audioPrompt: 'Salve civis. Audivistine orationem hodie de legibus reipublicae?',
            culturalNote: 'Root alert: "oratio" -> oration; "legibus" -> legislation, legal; "reipublicae" -> republic.',
            options: [
              {
                text: 'Salve senator! Verba tua magna cum cura audivi; iustitia conservanda est.',
                english: 'Greetings senator! I heard your words with great care; justice must be preserved.',
                isCorrect: true,
                feedback: 'Praestans! High-register rhetorical Latin demonstrating respect to a Roman magistrate.',
              },
              {
                text: 'Nubes in caelo sunt.',
                english: 'There are clouds in the sky.',
                isCorrect: false,
                feedback: 'Engage with the senator\'s speech on civic law and justice!',
              },
            ],
          },
          {
            id: 'la-f2',
            speaker: 'Senator',
            avatar: '🏛️',
            isNpc: true,
            phrase: 'Bene dixisti! Iustitia et virtus fundamenta Romae sunt. Vale!',
            english: 'Well said! Justice and virtue are the foundations of Rome. Farewell!',
            audioPrompt: 'Bene dixisti! Iustitia et virtus fundamenta Romae sunt. Vale!',
            culturalNote: '"Virtus" meant civic courage and excellence in ancient Roman stoic philosophy.',
            options: [
              {
                text: 'Semper fidelis patriae! Vale, senator clarissime!',
                english: 'Always faithful to the fatherland! Farewell, most distinguished senator!',
                isCorrect: true,
                feedback: 'Feliciter! You mastered classical civic discourse in authentic Latin.',
              },
              {
                text: 'Agricola terram arat.',
                english: 'The farmer plows the earth.',
                isCorrect: false,
                feedback: 'Wish the distinguished senator farewell ("Vale, senator")!',
              },
            ],
          },
        ],
      },
    ],
  },
  en: {
    code: 'en',
    name: 'EAL Academic English',
    flag: '🇬🇧',
    ttsCode: 'en-GB',
    description: 'English as an Additional Language: Connectives, tier-2 academic vocabulary, and sentence structures.',
    phonemes: [
      { id: 'en-1', symbol: 'th (voiced vs unvoiced)', ipa: '/ð/ vs /θ/', mouthTip: 'Voiced: this, that (vocal cords buzz). Unvoiced: think, thin (gentle breath).', exampleWord: 'this thought', translation: 'voiced + unvoiced contrast' },
      { id: 'en-2', symbol: 'r vs l', ipa: '/ɹ/ vs /l/', mouthTip: 'For "r", tongue curls back without touching roof. For "l", tongue taps upper front teeth.', exampleWord: 'read vs lead', translation: 'curl back vs tap teeth' },
      { id: 'en-3', symbol: 'sh vs ch', ipa: '/ʃ/ vs /tʃ/', mouthTip: '"sh" is a continuous hush (ship); "ch" has a sharp stop first (chip).', exampleWord: 'share vs chair', translation: 'smooth flow vs stop burst' },
      { id: 'en-4', symbol: 'silent letters', ipa: 'silent', mouthTip: 'English preserves historical spelling: k in knight, b in doubt, w in write.', exampleWord: 'knife / subtle', translation: 'silent k, silent b' },
    ],
    verbs: [
      {
        infinitive: 'to analyze',
        translation: 'to examine methodically',
        type: 'Academic verb',
        stem: 'analyz',
        forms: [
          { pronoun: 'I', ending: 'e', full: 'I analyze', english: 'examine data' },
          { pronoun: 'you', ending: 'e', full: 'you analyze', english: 'examine evidence' },
          { pronoun: 'he / she / it', ending: 'es', full: 'she analyzes', english: 'examines closely' },
          { pronoun: 'we', ending: 'e', full: 'we analyze', english: 'collaborative inquiry' },
          { pronoun: 'they', ending: 'e', full: 'they analyze', english: 'synthesize results' },
        ],
      },
    ],
    vocabulary: [
      { id: 'v-en-1', targetWord: 'furthermore', english: 'in addition / moreover', phonetic: 'FER-ther-mor', category: 'Academic Connectives', partOfSpeech: 'adverb', exampleSentence: 'The experiment was valid; furthermore, results were repeatable.' },
      { id: 'v-en-2', targetWord: 'consequently', english: 'as a result / therefore', phonetic: 'KAHN-suh-kwent-lee', category: 'Cause & Effect', partOfSpeech: 'adverb', exampleSentence: 'The ice melted; consequently, water levels rose.' },
      { id: 'v-en-3', targetWord: 'in contrast', english: 'comparing differences', phonetic: 'in KAHN-trast', category: 'Comparison', partOfSpeech: 'phrase', exampleSentence: 'Metals conduct heat; in contrast, wood acts as an insulator.' },
      { id: 'v-en-4', targetWord: 'hypothesis', english: 'testable scientific prediction', phonetic: 'hy-POTH-uh-sis', category: 'Scientific Vocabulary', partOfSpeech: 'noun', exampleSentence: 'Pupils form a hypothesis before testing the chemical reaction.' },
    ],
    scenarios: [
      {
        id: 'london-tearoom',
        title: 'The London Tearoom (Polite Requests)',
        setting: 'Traditional British tearoom with china teacups and scones',
        themeColor: '#059669',
        icon: '🫖',
        stageType: 'cafe',
        turns: [
          {
            id: 'en-c1',
            speaker: 'Barista',
            avatar: '🫖',
            isNpc: true,
            phrase: 'Good morning! Welcome to the tearoom. What can I get started for you today?',
            english: 'Formal British greeting and inquiry',
            audioPrompt: 'Good morning! Welcome to the tearoom. What can I get started for you today?',
            culturalNote: 'In British English, using modal verbs like "Could I please have" is essential for polite ordering.',
            options: [
              {
                text: 'Good morning! Could I please have a pot of Earl Grey tea and a warm scone?',
                english: 'Polite modal request + please',
                isCorrect: true,
                feedback: 'Spot on! Using "Could I please have" makes your request polite and natural.',
              },
              {
                text: 'Give me tea right now!',
                english: 'Imperative command (rude)',
                isCorrect: false,
                feedback: 'Too blunt! In English cafés, direct commands sound impolite without "could I please".',
              },
            ],
          },
          {
            id: 'en-c2',
            speaker: 'Barista',
            avatar: '🫖',
            isNpc: true,
            phrase: 'Splendid choice! Would you like clotted cream and strawberry jam with that?',
            english: 'Inquiring about classic afternoon tea accompaniments',
            audioPrompt: 'Splendid choice! Would you like clotted cream and strawberry jam with that?',
            culturalNote: 'Whether cream or jam goes first is a famous friendly debate between Devon and Cornwall!',
            options: [
              {
                text: 'Yes please, both would be lovely. Thank you!',
                english: 'Affirmative response with courtesy',
                isCorrect: true,
                feedback: 'Brilliant! "Both would be lovely" is an elegant idiomatic British response.',
              },
              {
                text: 'The weather is raining outside.',
                english: 'Small talk about rain',
                isCorrect: false,
                feedback: 'Talking about the weather is very British, but first confirm your cream and jam!',
              },
            ],
          },
        ],
      },
      {
        id: 'school-library',
        title: 'Academic Library Inquiry (Research)',
        setting: 'Quiet secondary school research library with high bookshelves',
        themeColor: '#0d9488',
        icon: '📚',
        stageType: 'library',
        turns: [
          {
            id: 'en-l1',
            speaker: 'Librarian',
            avatar: '📖',
            isNpc: true,
            phrase: 'Good morning. How may I assist your academic research today?',
            english: 'Polite formal assistance inquiry',
            audioPrompt: 'Good morning. How may I assist your academic research today?',
            culturalNote: 'In academic contexts, asking for "guidance" or "primary sources" shows academic register.',
            options: [
              {
                text: 'Good morning. Could you please guide me toward non-fiction sources on renewable energy and climate systems?',
                english: 'High-tier academic request with modal auxiliary',
                isCorrect: true,
                feedback: 'Outstanding! Precise vocabulary and courteous academic tone.',
              },
              {
                text: 'Where are the comic books?',
                english: 'Informal colloquial inquiry',
                isCorrect: false,
                feedback: 'Fun, but practice formal academic inquiry for coursework research!',
              },
            ],
          },
          {
            id: 'en-l2',
            speaker: 'Librarian',
            avatar: '📖',
            isNpc: true,
            phrase: 'Certainly. Those volumes are located in aisle four under the Dewey Decimal 577 classification. Would you like to check them out?',
            english: 'Directing to library classification and offering book loan',
            audioPrompt: 'Those volumes are located in aisle four. Would you like to check them out?',
            culturalNote: 'Library book loans in British schools usually last for two weeks before renewal.',
            options: [
              {
                text: 'Yes please, I would like to borrow these two volumes for two weeks with my student card.',
                english: 'Complete polite confirmation with timeframe',
                isCorrect: true,
                feedback: 'Excellent! Clear, precise, and courteous library protocol.',
              },
              {
                text: 'I forgot my lunchbox in the canteen.',
                english: 'Unrelated remark',
                isCorrect: false,
                feedback: 'Confirm your intention to borrow the reference books!',
              },
            ],
          },
        ],
      },
    ],
  },
};

export default function MflLanguageLab({
  onClose,
  initialLanguage = 'es',
}: MflLanguageLabProps) {
  const [selectedLang, setSelectedLang] = useState<string>(initialLanguage);
  const [activeTab, setActiveTab] = useState<'phonics' | 'verbs' | 'vocab' | 'dialogue'>('phonics');
  const [activeVerbIdx, setActiveVerbIdx] = useState<number>(0);
  const [selectedPronounIdx, setSelectedPronounIdx] = useState<number>(0);
  const [vocabCardIdx, setVocabCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(() => {
    return typeof window !== 'undefined' ? Number(localStorage.getItem('stj_mfl_stars') || '0') : 0;
  });
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Gentle cadence for language acquisition

  // Dialogue / Roleplay Studio State
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [turnIdx, setTurnIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  const dataset = LANGUAGE_DATASETS[selectedLang] || LANGUAGE_DATASETS.es;
  const currentVerb = dataset.verbs[activeVerbIdx] || dataset.verbs[0];
  const currentVocab = dataset.vocabulary[vocabCardIdx] || dataset.vocabulary[0];
  const currentScenario = dataset.scenarios?.[scenarioIdx] || dataset.scenarios?.[0];
  const currentTurn = currentScenario?.turns?.[turnIdx] || currentScenario?.turns?.[0];

  const handleSpeak = (text: string, customCode?: string) => {
    playClickTone();
    triggerHapticClick();
    speakInLanguage(text, customCode || dataset.ttsCode, { rate: speechRate });
  };

  const handleStartVoicePractice = (targetText: string) => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechFeedback('Voice recognition supported natively in Chromium/Safari browsers.');
      return;
    }
    try {
      setIsListening(true);
      setSpokenTranscript(null);
      setSpeechFeedback('Listening... speak now into your microphone!');
      playClickTone();

      const recognition = new SpeechRec();
      recognition.lang = dataset.ttsCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setSpokenTranscript(transcript);
        setIsListening(false);

        // Simple similarity match on normalized tokens
        const normSpoken = transcript.toLowerCase().replace(/[^a-z0-9áéíóúüñàâçèêëîïôùû]/gi, '');
        const normTarget = targetText.toLowerCase().replace(/[^a-z0-9áéíóúüñàâçèêëîïôùû]/gi, '');

        if (normSpoken.length > 0 && (normTarget.includes(normSpoken) || normSpoken.includes(normTarget) || normSpoken.slice(0, 4) === normTarget.slice(0, 4))) {
          playSuccessChime();
          triggerHapticSuccess();
          const newStars = stars + 2;
          setStars(newStars);
          localStorage.setItem('stj_mfl_stars', String(newStars));
          setSpeechFeedback('🎉 Outstanding pronunciation! +2 Stars awarded.');
        } else {
          setSpeechFeedback(`Heard: "${transcript}". Keep practicing to match the native cadence!`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechFeedback('Could not detect audio. Try speaking closer to the microphone.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechFeedback('Microphone permission or native speech engine unavailable.');
    }
  };

  const handleNextVocab = (mastered: boolean) => {
    if (mastered) {
      playSuccessChime();
      triggerHapticSuccess();
      const newStars = stars + 1;
      setStars(newStars);
      localStorage.setItem('stj_mfl_stars', String(newStars));
      if (newStars % 5 === 0) {
        triggerMasteryConfetti();
      }
    } else {
      playIncorrectTone();
    }
    setIsCardFlipped(false);
    setVocabCardIdx((prev) => (prev + 1) % dataset.vocabulary.length);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Banner: Track Selector & Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          border: '1.5px solid #3730a3',
          borderRadius: '14px',
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🌍</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#6366f1',
                  color: '#ffffff',
                }}
              >
                MFL &amp; Polyglot Lab
              </span>
              <span style={{ fontSize: '0.78rem', color: '#a5b4fc' }}>
                Phonics &bull; Morphology &bull; Native Audio
              </span>
            </div>
            <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '2px 0 0', color: '#fef3c7' }}>
              {dataset.flag} {dataset.name} Mastery Studio
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Selector Buttons */}
          <div style={{ display: 'flex', gap: '4px', background: '#0c0a09', padding: '3px', borderRadius: '10px', border: '1px solid #334155' }}>
            {Object.values(LANGUAGE_DATASETS).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  playClickTone();
                  setSelectedLang(l.code);
                  setActiveVerbIdx(0);
                  setSelectedPronounIdx(0);
                  setVocabCardIdx(0);
                  setIsCardFlipped(false);
                }}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: selectedLang === l.code ? '#4f46e5' : 'transparent',
                  color: selectedLang === l.code ? '#ffffff' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: selectedLang === l.code ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#312e81',
              border: '1px solid #6366f1',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#fef3c7',
            }}
          >
            <span>⭐</span>
            <span>{stars} Stars</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '5px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'phonics', label: '🗣️ Phonics & Soundboard', icon: '👄' },
          { id: 'verbs', label: '⚙️ Verb Conjugator Wheel', icon: '🔄' },
          { id: 'vocab', label: '⚡ Rapid Vocab Sprint', icon: '🃏' },
          { id: 'dialogue', label: '☕ Café & Roleplay Studio', icon: '🎭' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              triggerHapticClick();
              setActiveTab(tab.id as any);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#4338ca' : 'transparent',
              color: activeTab === tab.id ? '#fef3c7' : '#94a3b8',
              border: activeTab === tab.id ? '1px solid #6366f1' : '1px solid transparent',
              fontSize: '0.84rem',
              fontWeight: activeTab === tab.id ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: PHONICS & SOUNDBOARD STUDIO */}
      {activeTab === 'phonics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <strong style={{ fontSize: '0.94rem', color: '#f8fafc' }}>
                Phonetic Map &amp; Articulation Studio
              </strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Tap each sound to hear the native pronunciation, study mouth formation, and reinforce sound-to-spelling correspondence.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Audio Speed:</span>
              {[0.75, 0.85, 1.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: speechRate === rate ? '#4f46e5' : '#1e293b',
                    color: speechRate === rate ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {dataset.phonemes.map((ph) => (
              <div
                key={ph.id}
                style={{
                  background: '#1e1b4b',
                  border: '1.5px solid #4338ca',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef3c7' }}>
                      {ph.symbol}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                      {ph.ipa}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(ph.exampleWord)}
                    style={{
                      background: '#4f46e5',
                      border: 'none',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>🔊 Listen</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  👄 <strong>Mouth Guide:</strong> {ph.mouthTip}
                </div>

                <div
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Key Example</span>
                    <strong style={{ fontSize: '0.92rem', color: '#38bdf8' }}>{ph.exampleWord}</strong>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#e2e8f0', fontStyle: 'italic' }}>
                    &ldquo;{ph.translation}&rdquo;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERB CONJUGATION ENGINE */}
      {activeTab === 'verbs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Verb Selector Strip */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Choose Verb:</span>
            {dataset.verbs.map((verb, idx) => (
              <button
                key={verb.infinitive}
                type="button"
                onClick={() => {
                  playClickTone();
                  setActiveVerbIdx(idx);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: activeVerbIdx === idx ? '#4f46e5' : '#0f172a',
                  color: activeVerbIdx === idx ? '#ffffff' : '#94a3b8',
                  border: activeVerbIdx === idx ? '1px solid #818cf8' : '1px solid #334155',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {verb.infinitive} ({verb.type})
              </button>
            ))}
          </div>

          {/* Dynamic Conjugation Wheel Card */}
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #4338ca',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fef3c7' }}>
                    {currentVerb.infinitive}
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', background: '#312e81', color: '#c7d2fe', border: '1px solid #6366f1' }}>
                    {currentVerb.type}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  English: &ldquo;{currentVerb.translation}&rdquo; &bull; Root Stem: <code>{currentVerb.stem}-</code>
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#fde68a', background: 'rgba(217, 119, 6, 0.15)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #d97706' }}>
                💡 <strong>Morphology Rule:</strong> Strip the ending and attach the person suffix.
              </div>
            </div>

            {/* Conjugation Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {currentVerb.forms.map((form, fIdx) => {
                const isSelected = selectedPronounIdx === fIdx;
                return (
                  <button
                    key={form.pronoun}
                    type="button"
                    onClick={() => {
                      setSelectedPronounIdx(fIdx);
                      handleSpeak(form.full);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? '#312e81' : '#0f172a',
                      border: isSelected ? '1.5px solid #818cf8' : '1px solid #334155',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      {form.pronoun}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                        {currentVerb.stem}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', textDecoration: 'underline' }}>
                        {form.ending}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.9rem' }}>🔊</span>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                      {form.english}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAPID VOCAB SPRINT (FLASHCARD ACTIVE RECALL) */}
      {activeTab === 'vocab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Word {vocabCardIdx + 1} of {dataset.vocabulary.length} &bull; Category: <strong>{currentVocab.category}</strong>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>
              Tap Card to Flip &bull; Instant Self-Assessment
            </span>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            onClick={() => {
              playClickTone();
              setIsCardFlipped(!isCardFlipped);
            }}
            style={{
              width: '100%',
              maxWidth: '520px',
              minHeight: '260px',
              borderRadius: '18px',
              background: isCardFlipped
                ? 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
              border: isCardFlipped ? '2px solid #10b981' : '2px solid #6366f1',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'center',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
                {currentVocab.partOfSpeech}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentVocab.targetWord);
                }}
                style={{
                  background: '#4f46e5',
                  border: 'none',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>🔊 Hear Pronunciation</span>
              </button>
            </div>

            <div style={{ margin: '16px 0' }}>
              {!isCardFlipped ? (
                <>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef3c7', margin: 0 }}>
                    {currentVocab.targetWord}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '6px', fontFamily: 'monospace' }}>
                    [{currentVocab.phonetic}]
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '12px' }}>
                    (Tap card to reveal English translation)
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '0.85rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 800 }}>
                    English Translation:
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 8px' }}>
                    {currentVocab.english}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px' }}>
                    &ldquo;{currentVocab.exampleSentence}&rdquo;
                  </div>
                </>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {isCardFlipped ? '✔ Mastered? Rate your recall below:' : '💡 Did you recall the meaning and pronunciation?'}
            </div>
          </div>

          {/* Assessment Action Bar */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', width: '100%', maxWidth: '520px' }}>
            <button
              type="button"
              onClick={() => handleNextVocab(false)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#334155',
                color: '#f8fafc',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🔄 Still Practicing
            </button>
            <button
              type="button"
              onClick={() => handleNextVocab(true)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span>⭐ I Know This! (+1 Star)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CAFÉ & REAL-WORLD DIALOGUE ROLEPLAY STUDIO */}
      {activeTab === 'dialogue' && currentScenario && currentTurn && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Scenario Selector & Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              background: '#1e1b4b',
              border: '1.5px solid #4338ca',
              borderRadius: '12px',
              padding: '12px 16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>{currentScenario.icon}</span>
                <strong style={{ fontSize: '1.05rem', color: '#fef3c7' }}>
                  {currentScenario.title}
                </strong>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: currentScenario.themeColor,
                    color: '#ffffff',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Step {turnIdx + 1} of {currentScenario.turns.length}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                {currentScenario.setting}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowSubtitles((s) => !s)}
                style={{
                  background: showSubtitles ? '#312e81' : '#1e293b',
                  color: showSubtitles ? '#c7d2fe' : '#94a3b8',
                  border: '1px solid #6366f1',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {showSubtitles ? '👁️ Subtitles: ON' : '🙈 Subtitles: OFF'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTurnIdx(0);
                  setSelectedOptionIdx(null);
                  setSpeechFeedback(null);
                  setSpokenTranscript(null);
                }}
                style={{
                  background: '#0f172a',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ↺ Restart Scene
              </button>
            </div>
          </div>

          {/* Scenario Selector Strip */}
          {dataset.scenarios && dataset.scenarios.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {dataset.scenarios.map((scen, idx) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    playClickTone();
                    setScenarioIdx(idx);
                    setTurnIdx(0);
                    setSelectedOptionIdx(null);
                    setSpeechFeedback(null);
                    setSpokenTranscript(null);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: scenarioIdx === idx ? `1.5px solid ${scen.themeColor}` : '1px solid #334155',
                    background: scenarioIdx === idx ? 'rgba(99, 102, 241, 0.25)' : '#1e1b4b',
                    color: scenarioIdx === idx ? '#fef3c7' : '#94a3b8',
                    fontWeight: scenarioIdx === idx ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{scen.icon}</span>
                  <span>{scen.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Procedural Vector SVG Stage (Resolution Independent, <3KB) */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #3730a3',
              background: '#090d16',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
          >
            <svg
              viewBox="0 0 800 240"
              width="100%"
              height="240"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="cafeSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0b132b" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
                <linearGradient id="awningGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    stopColor={
                      currentScenario.stageType === 'market'
                        ? '#15803d'
                        : currentScenario.stageType === 'station'
                        ? '#1e40af'
                        : currentScenario.stageType === 'library'
                        ? '#78350f'
                        : '#b91c1c'
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      currentScenario.stageType === 'market'
                        ? '#166534'
                        : currentScenario.stageType === 'station'
                        ? '#1e3a8a'
                        : currentScenario.stageType === 'library'
                        ? '#451a03'
                        : '#991b1b'
                    }
                  />
                </linearGradient>
                <linearGradient id="tableWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>

              {/* Background Wall & Ground Paving */}
              <rect width="800" height="240" fill="url(#cafeSky)" />
              <rect y="195" width="800" height="45" fill="#1e293b" />
              {/* Paving lines */}
              <line x1="0" y1="210" x2="800" y2="210" stroke="#334155" strokeWidth="1" strokeDasharray="16,8" />
              <line x1="0" y1="225" x2="800" y2="225" stroke="#334155" strokeWidth="1" strokeDasharray="12,12" />

              {/* Canopy / Classical Roman Lintel */}
              {currentScenario.stageType === 'roman' ? (
                <g transform="translate(0, 0)">
                  {/* Classical Marble Architrave & Frieze */}
                  <rect width="800" height="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  <rect y="24" width="800" height="12" fill="#cbd5e1" />
                  {/* Classical Dentil Moulding */}
                  {[...Array(26)].map((_, i) => (
                    <rect key={i} x={i * 31 + 4} y="26" width="16" height="8" fill="#64748b" rx="1" />
                  ))}
                  {/* Classical Stone Pediment Centerpiece */}
                  <polygon points="340,0 400,-15 460,0" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  <text x="400" y="16" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold" letterSpacing="4">
                    SENATVS &bull; POPVLVSQVE &bull; ROMANVS
                  </text>
                  {/* Classical Fluted Marble Columns */}
                  <rect x="18" y="24" width="22" height="175" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="25" y1="24" x2="25" y2="199" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="32" y1="24" x2="32" y2="199" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Column Capital & Base */}
                  <rect x="14" y="24" width="30" height="10" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                  <rect x="14" y="195" width="30" height="8" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                </g>
              ) : (
                <g transform="translate(0, 0)">
                  <polygon points="0,0 800,0 800,45 0,45" fill="url(#awningGrad)" />
                  {/* White Awning Stripes */}
                  {[40, 120, 200, 280, 360, 440, 520, 600, 680, 760].map((x) => (
                    <rect key={x} x={x} y="0" width="40" height="45" fill="#ffffff" opacity="0.9" />
                  ))}
                  {/* Scalloped Awning Valance */}
                  <path
                    d="M0,45 Q20,58 40,45 Q60,58 80,45 Q100,58 120,45 Q140,58 160,45 Q180,58 200,45 Q220,58 240,45 Q260,58 280,45 Q300,58 320,45 Q340,58 360,45 Q380,58 400,45 Q420,58 440,45 Q460,58 480,45 Q500,58 520,45 Q540,58 560,45 Q580,58 600,45 Q620,58 640,45 Q660,58 680,45 Q700,58 720,45 Q740,58 760,45 Q780,58 800,45"
                    fill={
                      currentScenario.stageType === 'market'
                        ? '#15803d'
                        : currentScenario.stageType === 'station'
                        ? '#1e40af'
                        : currentScenario.stageType === 'library'
                        ? '#78350f'
                        : '#b91c1c'
                    }
                  />
                </g>
              )}

              {/* Setting Signboard */}
              <g transform="translate(52, 60)">
                <rect width="130" height="60" rx="6" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
                <text x="65" y="24" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" letterSpacing="1">
                  {currentScenario.stageType === 'market'
                    ? 'MERCADO'
                    : currentScenario.stageType === 'station'
                    ? 'TERMINAL'
                    : currentScenario.stageType === 'library'
                    ? 'ARCHIVE'
                    : currentScenario.stageType === 'roman'
                    ? 'S • P • Q • R'
                    : 'MENÚ DEL DÍA'}
                </text>
                <text x="65" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9">
                  {currentScenario.stageType === 'market'
                    ? 'Frescos &bull; Kilos'
                    : currentScenario.stageType === 'station'
                    ? 'Billets &bull; AVE'
                    : currentScenario.stageType === 'library'
                    ? 'Reference &bull; Loan'
                    : currentScenario.stageType === 'roman'
                    ? 'Forum &bull; Atrium'
                    : 'Café &bull; Croissant'}
                </text>
              </g>

              {/* Stage Props (Procedural SVGs based on stageType) */}
              <g transform="translate(195, 140)">
                {/* Table or Pedestal Stand */}
                {currentScenario.stageType === 'roman' ? (
                  <>
                    {/* Fluted Roman Marble Pedestal */}
                    <rect x="52" y="32" width="38" height="48" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="32" x2="60" y2="80" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="71" y1="32" x2="71" y2="80" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="82" y1="32" x2="82" y2="80" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect x="46" y="24" width="50" height="8" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                    <rect x="46" y="80" width="50" height="8" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                    {/* Terracotta Amphora */}
                    <ellipse cx="71" cy="14" rx="11" ry="14" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
                    <rect x="67" y="-2" width="8" height="6" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
                    {/* Amphora Handles */}
                    <path d="M60,6 C54,10 54,18 61,20" fill="none" stroke="#7c2d12" strokeWidth="2" />
                    <path d="M82,6 C88,10 88,18 81,20" fill="none" stroke="#7c2d12" strokeWidth="2" />
                    {/* Papyrus Scroll */}
                    <rect x="74" y="16" width="22" height="6" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                    <rect x="82" y="16" width="3" height="6" fill="#dc2626" />
                  </>
                ) : (
                  <>
                    <rect x="68" y="35" width="6" height="45" fill="#475569" />
                    <ellipse cx="71" cy="80" rx="28" ry="6" fill="#334155" />
                    <ellipse cx="71" cy="35" rx="55" ry="14" fill="url(#tableWood)" stroke="#d97706" strokeWidth="2" />

                    {currentScenario.stageType === 'cafe' && (
                      <>
                        <ellipse cx="70" cy="30" rx="14" ry="4" fill="#ffffff" />
                        <rect x="62" y="18" width="16" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                        <ellipse cx="70" cy="20" rx="7" ry="2" fill="#78350f" />
                        <path d="M66,16 Q64,10 68,6" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.75" />
                        <path d="M72,16 Q75,10 71,5" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.75" />
                      </>
                    )}

                    {currentScenario.stageType === 'market' && (
                      <>
                        <rect x="48" y="14" width="44" height="20" rx="2" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
                        <circle cx="58" cy="18" r="6" fill="#ea580c" />
                        <circle cx="70" cy="17" r="5.5" fill="#dc2626" />
                        <circle cx="82" cy="18" r="6" fill="#ea580c" />
                      </>
                    )}

                    {currentScenario.stageType === 'station' && (
                      <>
                        <rect x="52" y="14" width="38" height="20" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                        <line x1="56" y1="20" x2="84" y2="20" stroke="#ffffff" strokeWidth="1.5" />
                        <line x1="56" y1="26" x2="74" y2="26" stroke="#bae6fd" strokeWidth="1.5" />
                      </>
                    )}

                    {currentScenario.stageType === 'library' && (
                      <>
                        <rect x="54" y="24" width="34" height="8" rx="1" fill="#b91c1c" />
                        <rect x="56" y="18" width="30" height="7" rx="1" fill="#1d4ed8" />
                        <rect x="58" y="12" width="26" height="7" rx="1" fill="#047857" />
                      </>
                    )}
                  </>
                )}
              </g>

              {/* Character Avatar Stage Node */}
              <g transform="translate(360, 68)">
                <circle cx="35" cy="35" r="32" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
                <text x="35" y="44" textAnchor="middle" fontSize="30">
                  {currentTurn.avatar}
                </text>
                <rect x="2" y="74" width="66" height="18" rx="5" fill="#312e81" />
                <text x="35" y="87" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  {currentTurn.speaker}
                </text>
              </g>

              {/* Dynamic Speech Bubble */}
              <g transform="translate(450, 60)">
                <rect width="320" height="92" rx="12" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
                {/* Speech Bubble Pointer */}
                <polygon points="0,35 -14,40 0,47" fill="#ffffff" />
                {/* Target Language Phrase */}
                <text x="16" y="28" fill="#0f172a" fontSize="13" fontWeight="bold">
                  {currentTurn.phrase.length > 40 ? currentTurn.phrase.slice(0, 38) + '...' : currentTurn.phrase}
                </text>
                {/* English Subtitle */}
                {showSubtitles && (
                  <text x="16" y="48" fill="#64748b" fontSize="11" fontStyle="italic">
                    "{currentTurn.english.length > 44 ? currentTurn.english.slice(0, 42) + '...' : currentTurn.english}"
                  </text>
                )}
                {/* Cultural Etiquette Tooltip */}
                {currentTurn.culturalNote && (
                  <text x="16" y="74" fill="#2563eb" fontSize="9.5" fontWeight="600">
                    💡 Note: {currentTurn.culturalNote.length > 50 ? currentTurn.culturalNote.slice(0, 48) + '...' : currentTurn.culturalNote}
                  </text>
                )}
              </g>
            </svg>

            {/* Quick Action Floating Bar on SVG Canvas */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => handleSpeak(currentTurn.audioPrompt || currentTurn.phrase)}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)',
                }}
              >
                <span>🔊 Hear Speaker</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartVoicePractice(currentTurn.options?.[0]?.text || currentTurn.phrase)}
                style={{
                  background: isListening ? '#dc2626' : '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)',
                  animation: isListening ? 'pulse 1.2s infinite' : 'none',
                }}
              >
                <span>{isListening ? '🛑 Listening...' : '🎙️ Practice Speaking'}</span>
              </button>
            </div>
          </div>

          {/* Voice Practice Real-Time Feedback */}
          {speechFeedback && (
            <div
              style={{
                background: speechFeedback.includes('🎉') ? 'rgba(5, 150, 105, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                border: speechFeedback.includes('🎉') ? '1px solid #10b981' : '1px solid #475569',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.84rem',
                color: '#f8fafc',
              }}
            >
              <span>{speechFeedback}</span>
              {spokenTranscript && (
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  Microphone: "{spokenTranscript}"
                </span>
              )}
            </div>
          )}

          {/* Student Response Stage: Conversational Options */}
          {currentTurn.options && currentTurn.options.length > 0 && (
            <div
              style={{
                background: '#090d16',
                border: '1.5px solid #1e293b',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fef3c7' }}>
                  🧑‍🎓 Your Turn to Reply: Select the most authentic response
                </span>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Tap speaker 🔊 on any option to hear before answering
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentTurn.options.map((opt, oIdx) => {
                  const isSelected = selectedOptionIdx === oIdx;
                  return (
                    <div
                      key={oIdx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        background: isSelected
                          ? opt.isCorrect
                            ? 'rgba(5, 150, 105, 0.2)'
                            : 'rgba(220, 38, 38, 0.2)'
                          : '#1e1b4b',
                        border: isSelected
                          ? opt.isCorrect
                            ? '2px solid #10b981'
                            : '2px solid #ef4444'
                          : '1px solid #3730a3',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOptionIdx(oIdx);
                            if (opt.isCorrect) {
                              playSuccessChime();
                              triggerHapticSuccess();
                              const newStars = stars + 1;
                              setStars(newStars);
                              localStorage.setItem('stj_mfl_stars', String(newStars));
                            } else {
                              playIncorrectTone();
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f8fafc',
                            textAlign: 'left',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            flex: 1,
                            padding: '4px 0',
                          }}
                        >
                          <span>{opt.text}</span>
                          {showSubtitles && (
                            <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>
                              "{opt.english}"
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(opt.text);
                          }}
                          style={{
                            background: 'rgba(99, 102, 241, 0.25)',
                            border: '1px solid #6366f1',
                            color: '#c7d2fe',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                          }}
                          title="Listen with native TTS"
                        >
                          🔊
                        </button>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: opt.isCorrect ? '#86efac' : '#fca5a5',
                            marginTop: '4px',
                            borderTop: '1px dashed rgba(255,255,255,0.1)',
                            paddingTop: '6px',
                          }}
                        >
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Between Turns */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  disabled={turnIdx === 0}
                  onClick={() => {
                    setTurnIdx((t) => Math.max(0, t - 1));
                    setSelectedOptionIdx(null);
                    setSpeechFeedback(null);
                  }}
                  style={{
                    background: turnIdx === 0 ? '#1e293b' : '#334155',
                    color: turnIdx === 0 ? '#64748b' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: turnIdx === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ⬅ Previous Step
                </button>

                {turnIdx < currentScenario.turns.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTurnIdx((t) => t + 1);
                      setSelectedOptionIdx(null);
                      setSpeechFeedback(null);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Next Interaction</span>
                    <span>➔</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      triggerMasteryConfetti();
                      playSuccessChime();
                      setStars((s) => s + 5);
                      setSpeechFeedback('🎉 Scene Completed! You demonstrated fluent polite conversational skills.');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <span>🎉 Complete Scenario (+5 Stars!)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
