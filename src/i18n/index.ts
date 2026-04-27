import es from "./es.json";
import en from "./en.json";
import fr from "./fr.json";

export const translations = { es, en, fr };

export type Lang = keyof typeof translations;

export function useTranslations(lang: Lang = "es") {
  const dict = translations[lang];

  return function t(key: string): string {
    return dict[key as keyof typeof dict] || key;
  };
}