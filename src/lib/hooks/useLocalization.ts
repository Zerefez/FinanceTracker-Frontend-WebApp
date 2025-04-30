import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../providers/LanguageProvider';

export function useLocalization() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };
  
  return {
    t,
    changeLanguage,
    currentLanguage: language
  };
} 