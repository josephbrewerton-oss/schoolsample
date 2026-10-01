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

interface LanguageDataset {
  code: string;
  name: string;
  flag: string;
  ttsCode: string;
  description: string;
  phonemes: PhonemeItem[];
  verbs: VerbConjugation[];
  vocabulary: VocabCard[];
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
  },
};

export default function MflLanguageLab({
  onClose,
  initialLanguage = 'es',
}: MflLanguageLabProps) {
  const [selectedLang, setSelectedLang] = useState<string>(initialLanguage);
  const [activeTab, setActiveTab] = useState<'phonics' | 'verbs' | 'vocab'>('phonics');
  const [activeVerbIdx, setActiveVerbIdx] = useState<number>(0);
  const [selectedPronounIdx, setSelectedPronounIdx] = useState<number>(0);
  const [vocabCardIdx, setVocabCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(() => {
    return typeof window !== 'undefined' ? Number(localStorage.getItem('stj_mfl_stars') || '0') : 0;
  });
  const [speechRate, setSpeechRate] = useState<number>(0.85); // Gentle cadence for language acquisition

  const dataset = LANGUAGE_DATASETS[selectedLang] || LANGUAGE_DATASETS.es;
  const currentVerb = dataset.verbs[activeVerbIdx] || dataset.verbs[0];
  const currentVocab = dataset.vocabulary[vocabCardIdx] || dataset.vocabulary[0];

  const handleSpeak = (text: string, customCode?: string) => {
    playClickTone();
    triggerHapticClick();
    speakInLanguage(text, customCode || dataset.ttsCode, { rate: speechRate });
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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
        {[
          { id: 'phonics', label: '🗣️ Phonics & Soundboard', icon: '👄' },
          { id: 'verbs', label: '⚙️ Verb Conjugator Wheel', icon: '🔄' },
          { id: 'vocab', label: '⚡ Rapid Vocab Sprint', icon: '🃏' },
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
    </div>
  );
}
