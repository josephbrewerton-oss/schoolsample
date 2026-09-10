import React, { useEffect, useState } from 'react';

export interface SupportedLanguage {
  code: string;
  label: string;
  nativeLabel: string;
  ttsVoiceLang: string; // For Web Speech API synthesis
  promptCondition: string;
}

export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'UK',
    ttsVoiceLang: 'en-GB',
    promptCondition: 'Formulate all explanations, question text, and hints in clear English.',
  },
  es: {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    ttsVoiceLang: 'es-ES',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in standard Spanish (Español).',
  },
  fr: {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    ttsVoiceLang: 'fr-FR',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in French (Français).',
  },
  de: {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    ttsVoiceLang: 'de-DE',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in German (Deutsch).',
  },
  pl: {
    code: 'pl',
    label: 'Polish',
    nativeLabel: 'Polski',
    ttsVoiceLang: 'pl-PL',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Polish (Język polski).',
  },
  uk: {
    code: 'uk',
    label: 'Ukrainian',
    nativeLabel: 'Українська',
    ttsVoiceLang: 'uk-UA',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Ukrainian (Українська мова).',
  },
  ar: {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    ttsVoiceLang: 'ar-SA',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Modern Standard Arabic (العربية).',
  },
  bn: {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    ttsVoiceLang: 'bn-BD',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Bengali (বাংলা).',
  },
  ur: {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    ttsVoiceLang: 'ur-PK',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Urdu (اردو).',
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    ttsVoiceLang: 'hi-IN',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Hindi (हिन्दी).',
  },
  pt: {
    code: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    ttsVoiceLang: 'pt-PT',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Portuguese (Português).',
  },
  it: {
    code: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    ttsVoiceLang: 'it-IT',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Italian (Italiano).',
  },
  tr: {
    code: 'tr',
    label: 'Turkish',
    nativeLabel: 'Türkçe',
    ttsVoiceLang: 'tr-TR',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Turkish (Türkçe).',
  },
  zh: {
    code: 'zh',
    label: 'Chinese',
    nativeLabel: '中文',
    ttsVoiceLang: 'zh-CN',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Simplified Chinese (简体中文).',
  },
  sw: {
    code: 'sw',
    label: 'Swahili',
    nativeLabel: 'Kiswahili',
    ttsVoiceLang: 'sw-KE',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Kiswahili.',
  },
  yo: {
    code: 'yo',
    label: 'Yoruba',
    nativeLabel: 'Èdè Yorùbá',
    ttsVoiceLang: 'yo-NG',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Yoruba.',
  },
  ig: {
    code: 'ig',
    label: 'Igbo',
    nativeLabel: 'Asụsụ Igbo',
    ttsVoiceLang: 'ig-NG',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Igbo.',
  },
  ha: {
    code: 'ha',
    label: 'Hausa',
    nativeLabel: 'Harshen Hausa',
    ttsVoiceLang: 'ha-NE',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Hausa.',
  },
  zu: {
    code: 'zu',
    label: 'Zulu',
    nativeLabel: 'isiZulu',
    ttsVoiceLang: 'zu-ZA',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in isiZulu.',
  },
  am: {
    code: 'am',
    label: 'Amharic',
    nativeLabel: 'አማርኛ',
    ttsVoiceLang: 'am-ET',
    promptCondition: 'Formulate all explanations, question text, and hints strictly in Amharic.',
  },
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.en;
export const PORTAL_LANG_STORAGE_KEY = 'portal_language';

export function getSavedLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem(PORTAL_LANG_STORAGE_KEY) || 'en';
}

export function setSavedLanguage(langCode: string): void {
  if (typeof window === 'undefined') return;
  const validCode = SUPPORTED_LANGUAGES[langCode] ? langCode : 'en';
  localStorage.setItem(PORTAL_LANG_STORAGE_KEY, validCode);

  // 1. Notify storage event listeners
  window.dispatchEvent(new Event('storage'));

  // 2. Custom event for local in-window subscribers
  window.dispatchEvent(new CustomEvent('portal_language_changed', { detail: validCode }));

  // 3. Broadcast across tabs and workers
  try {
    const channel = new BroadcastChannel('neural_hypervisor_bus');
    channel.postMessage({ type: 'SET_LANGUAGE', lang: validCode });
    channel.close();
  } catch {}
}

export function listenToLanguageChange(callback: (lang: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: any) => {
    if (e.detail) callback(e.detail);
  };

  const handleStorage = () => {
    callback(getSavedLanguage());
  };

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel('neural_hypervisor_bus');
    channel.onmessage = (event) => {
      if (event.data?.type === 'SET_LANGUAGE' && event.data.lang) {
        callback(event.data.lang);
      }
    };
  } catch {}

  window.addEventListener('portal_language_changed', handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('portal_language_changed', handleCustom);
    window.removeEventListener('storage', handleStorage);
    if (channel) {
      try { channel.close(); } catch {}
    }
  };
}

export function LanguageSelector({
  currentLang,
  onSelect,
  compact = false,
}: {
  currentLang?: string;
  onSelect?: (langCode: string) => void;
  compact?: boolean;
}) {
  const [activeLang, setActiveLang] = useState<string>(() => currentLang || getSavedLanguage());

  useEffect(() => {
    if (currentLang && currentLang !== activeLang) {
      setActiveLang(currentLang);
    }
  }, [currentLang]);

  useEffect(() => {
    const unsubscribe = listenToLanguageChange((newLang) => {
      setActiveLang(newLang);
    });
    return unsubscribe;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setActiveLang(val);
    setSavedLanguage(val);
    onSelect?.(val);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#f8fafc',
        padding: compact ? '2px 8px' : '4px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
      }}
    >
      <label
        htmlFor="lang-select"
        style={{
          fontSize: compact ? '0.8rem' : '0.85rem',
          fontWeight: 700,
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
        }}
      >
        <span role="img" aria-label="globe">🌐</span> {!compact && 'Translate:'}
      </label>
      <select
        id="lang-select"
        value={activeLang}
        onChange={handleChange}
        style={{
          padding: compact ? '0.25rem 0.5rem' : '0.35rem 0.65rem',
          borderRadius: '6px',
          border: '1px solid #94a3b8',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: compact ? '0.8rem' : '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label} ({lang.nativeLabel})
          </option>
        ))}
      </select>
    </div>
  );
}
