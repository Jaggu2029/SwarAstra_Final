import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import gu from '../locales/gu.json';

const LocaleContext = createContext();

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem('swarAstra_locale') || 'en');

  useEffect(() => {
    localStorage.setItem('swarAstra_locale', locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'gu' : 'en'));
  };

  const t = (key, params = {}) => {
    const translations = locale === 'en' ? en : gu;
    let text = translations[key] || key;
    
    // Simple interpolation for params like {name}
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};
