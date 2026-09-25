'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { translations, type DashboardCopy, type Language } from '@/src/i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: DashboardCopy;
  formatLocale: 'en-US' | 'fr-FR';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy: translations[language],
      formatLocale: (language === 'fr' ? 'fr-FR' : 'en-US') as 'en-US' | 'fr-FR',
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
