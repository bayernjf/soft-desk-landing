import { ui, defaultLang, type Language, type UIKey } from './ui';

/** Extract language code from URL path (e.g. /zh/features → zh) */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Language;
  return defaultLang;
}

/** Build a translation function for the given language */
export function useTranslations(lang: Language) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/** Get the opposite language for the switcher */
export function getAltLang(lang: Language): Language {
  return lang === 'zh' ? 'en' : 'zh';
}

/** Build a localized path. Pass path without locale prefix, e.g. '/features/ai' */
export function localizedPath(path: string, lang: Language): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

/** Get the equivalent path in another language (for language switcher) */
export function getAltLangPath(pathname: string, targetLang: Language): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${targetLang}`;
  // Replace the first segment (current lang) with target lang
  segments[0] = targetLang;
  return `/${segments.join('/')}`;
}

export { defaultLang, type Language, type UIKey };
