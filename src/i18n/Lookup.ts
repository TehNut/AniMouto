import LanguageEnglish from './LanguageEnglish';
import en from "./LanguageEnglish";

export default function getLanguage(language: SupportedLanguages) {
  switch (language) {
    case SupportedLanguages.ENGLISH: return en;
    default: return en;
  }
}

export function formatHandlebars(template: string, data?: any) {
  if (!data)
    return template;

  Object.entries(data).forEach(([k, v]) => {
    template = template.replace(new RegExp(`\{${k}\}`, "g"), v + "");
  });
  
  return template;
}

export enum SupportedLanguages {
  ENGLISH = "ENGLISH",
}