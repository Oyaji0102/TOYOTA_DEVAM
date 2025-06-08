import React, { createContext, useContext, useState } from 'react';
import i18n from '../src/i18n/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.locale);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
