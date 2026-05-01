import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';
import knTranslation from './locales/kn.json';
import hiTranslation from './locales/hi.json';
import mlTranslation from './locales/ml.json';

const resources = {
  en: { translation: enTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  kn: { translation: knTranslation },
  hi: { translation: hiTranslation },
  ml: { translation: mlTranslation },
};

const savedLanguage = localStorage.getItem('voteMitra_lang') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Set initial attributes
document.documentElement.lang = i18n.language;
document.documentElement.setAttribute('xml:lang', i18n.language);

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.setAttribute('xml:lang', lng);
});

export default i18n;
