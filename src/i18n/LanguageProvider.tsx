import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, Language, translations } from './translations';

type TranslationValues = Record<string, string | number>;

type TranslationFunction = (key: string, values?: TranslationValues) => string;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationFunction;
  availableLanguages: Language[];
}

const STORAGE_KEY = 'app-language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const resolveInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && stored in translations) {
      return stored;
    }
  } catch {
    // Ignore storage errors and fallback to browser language
  }

  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language?.split('-')[0] : undefined;
  if (browserLanguage && browserLanguage in translations) {
    return browserLanguage as Language;
  }

  return DEFAULT_LANGUAGE;
};

const formatTemplate = (template: string, values?: TranslationValues) => {
  if (!values) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value === undefined || value === null ? '' : String(value);
  });
};

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => resolveInitialLanguage());

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextLanguage);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const translate = useCallback<TranslationFunction>((key, values) => {
    const template = translations[language]?.[key] ?? translations[DEFAULT_LANGUAGE]?.[key] ?? key;
    return formatTemplate(template, values);
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: translate,
    availableLanguages: Object.keys(translations) as Language[],
  }), [language, setLanguage, translate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  return context;
};
