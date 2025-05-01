import { useLocalization } from '../../lib/hooks';

export default function LanguageSwitcher() {
  const { t, changeLanguage, currentLanguage } = useLocalization();

  return (
    <div className="flex items-center gap-2">
      <button
        className={`text-sm ${currentLanguage === 'en' ? 'font-bold' : 'font-normal'}`}
        onClick={() => changeLanguage('en')}
      >
        {t('language.en')}
      </button>
      <span className="text-muted">|</span>
      <button
        className={`text-sm ${currentLanguage === 'da' ? 'font-bold' : 'font-normal'}`}
        onClick={() => changeLanguage('da')}
      >
        {t('language.da')}
      </button>
    </div>
  );
} 