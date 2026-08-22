import React from 'react';

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

export function LanguageSelector({
  currentLang,
  onSelect,
}: {
  currentLang: string;
  onSelect: (langCode: string) => void;
}) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <label htmlFor="lang-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
        🌐 Language:
      </label>
      <select
        id="lang-select"
        value={currentLang}
        onChange={(e) => onSelect(e.target.value)}
        style={{
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          background: 'var(--ifm-background-color, #ffffff)',
          color: 'var(--ifm-font-color-base, #0f172a)',
          fontSize: '0.875rem',
          cursor: 'pointer',
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