import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { enDict, locales } from './locales/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('vote_lang') || 'en');

  const dict = useMemo(() => {
    const localePath = `./locales/${lang}.json`;
    return locales[localePath] || enDict;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('vote_lang', lang);
  }, [lang]);

  const t = (key) => dict[key] || enDict[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
