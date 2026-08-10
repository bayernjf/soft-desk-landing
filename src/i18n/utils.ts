import { ui, defaultLang, type Language, type UIKey } from './ui';

/**
 * Extract language code from URL path.
 * Pattern B: root = en, /zh/* = zh.
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'zh') return 'zh';
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

/**
 * Build a localized path.
 * Pattern B: en has no prefix (root), zh gets /zh prefix.
 * Pass path without locale prefix, e.g. '/features/ai'.
 */
export function localizedPath(path: string, lang: Language): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) {
    // English lives at root: '/' -> '/', '/features' -> '/features'
    return clean;
  }
  // zh gets /zh prefix: '/' -> '/zh', '/features' -> '/zh/features'
  return clean === '/' ? '/zh' : `/zh${clean}`;
}

/**
 * Get the equivalent path in another language (for language switcher).
 * Pattern B: en root <-> /zh/*.
 */
export function getAltLangPath(pathname: string, targetLang: Language): string {
  const segments = pathname.split('/').filter(Boolean);
  const isZhPath = segments[0] === 'zh';

  if (targetLang === 'zh') {
    // Switching to zh: strip nothing (en has no prefix), prepend /zh
    // If already on zh path, just replace the lang segment
    const rest = isZhPath ? segments.slice(1) : segments;
    return rest.length === 0 ? '/zh' : `/zh/${rest.join('/')}`;
  }

  // Switching to en: strip /zh prefix, root stays root
  const rest = isZhPath ? segments.slice(1) : segments;
  return rest.length === 0 ? '/' : `/${rest.join('/')}`;
}

export { defaultLang, type Language, type UIKey };
