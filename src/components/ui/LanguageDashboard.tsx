import { useLocalization } from '../../lib/hooks';
import i18n from '../../lib/i18n';

export default function LanguageDashboard() {
  const { t, changeLanguage, currentLanguage } = useLocalization();
  
  // Get all available languages from i18n
  const languages = Object.keys(i18n.options.resources || {});

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('language.currentLanguage')}: {currentLanguage}</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {languages.map(lang => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`
              p-2 rounded-md transition-colors
              ${currentLanguage === lang 
                ? 'bg-accent text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            {t(`language.${lang}`)}
          </button>
        ))}
      </div>
    </div>
  );
} 