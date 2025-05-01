import { ReactNode, createContext, useEffect, useState } from 'react';
import i18n from '../i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLanguage: () => {}
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize with the current i18n language or from localStorage
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    return savedLang || i18n.language || 'en';
  });

  // When language changes, update i18n
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 