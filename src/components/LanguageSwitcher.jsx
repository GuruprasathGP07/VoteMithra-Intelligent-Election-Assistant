import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { logLanguageSwitched } from '../utils/analytics';
import { LANGUAGE_DETAILS } from '../utils/constants';

const LanguageSwitcher = ({ currentLang, onChange }) => {
  const { i18n } = useTranslation();

  const languages = LANGUAGE_DETAILS;

  const activeLang = currentLang || i18n.language;

  const changeLanguage = (e) => {
    const lang = e.target.value;
    const oldLang = i18n.language;

    // Always change i18next language first
    i18n.changeLanguage(lang);
    localStorage.setItem('voteMitra_lang', lang);
    logLanguageSwitched(oldLang, lang);

    // Also notify parent if it needs to know
    if (onChange) {
      onChange(lang);
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-1.5 bg-bg-main border border-border-gray rounded-md px-2 py-1.5 focus-within:border-blue-main transition-all">
        <span className="material-icons text-blue-main text-lg">
          g_translate
        </span>
        <select
          value={activeLang}
          onChange={changeLanguage}
          aria-label="Select Interface Language"
          className="bg-transparent text-ink text-sm font-bold focus:outline-none cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

LanguageSwitcher.propTypes = {
  currentLang: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LanguageSwitcher;
