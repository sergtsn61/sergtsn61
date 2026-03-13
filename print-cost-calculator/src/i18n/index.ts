import React, { createContext, useContext, useState, useCallback } from 'react';
import ru, { TranslationKeys } from './ru';
import en from './en';

export type Lang = 'ru' | 'en';

const translations: Record<Lang, TranslationKeys> = { ru, en };

interface I18nContextValue {
  lang: Lang;
  t: TranslationKeys;
  setLang: (lang: Lang) => void;
  currency: string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'ru',
  t: ru,
  setLang: () => {},
  currency: '₽',
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('print_cost_lang');
    return (saved === 'en' ? 'en' : 'ru') as Lang;
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('print_cost_lang', l);
  }, []);

  const t = translations[lang];
  const currency = lang === 'ru' ? '₽' : '$';

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, t, setLang, currency } },
    children,
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
