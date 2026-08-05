import type { Language } from './ui';

export interface LocaleConfig {
  code: Language;
  name: string;
  htmlLang: string;
  hreflang: string;
}

export const locales: LocaleConfig[] = [
  { code: 'zh', name: '中文', htmlLang: 'zh-CN', hreflang: 'zh' },
  { code: 'en', name: 'English', htmlLang: 'en', hreflang: 'en' },
];
