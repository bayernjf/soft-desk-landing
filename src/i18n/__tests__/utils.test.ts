import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations, getAltLang, localizedPath, getAltLangPath } from '@/i18n/utils';

describe('getLangFromUrl()', () => {
  it('extracts zh from URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/zh/'))).toBe('zh');
  });

  it('extracts en from URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/en/features'))).toBe('en');
  });

  it('falls back to zh for unknown language', () => {
    expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('zh');
  });

  it('falls back to zh for root URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe('zh');
  });
});

describe('useTranslations()', () => {
  it('returns Chinese translations', () => {
    const t = useTranslations('zh');
    expect(t('nav.features')).toBe('功能特性');
    expect(t('hero.title')).toContain('AI');
  });

  it('returns English translations', () => {
    const t = useTranslations('en');
    expect(t('nav.features')).toBe('Features');
    expect(t('hero.title')).toContain('AI');
  });

  it('returns key for missing translation', () => {
    const t = useTranslations('zh');
    expect(t('nonexistent.key' as never)).toBe('nonexistent.key');
  });
});

describe('getAltLang()', () => {
  it('returns en for zh', () => {
    expect(getAltLang('zh')).toBe('en');
  });

  it('returns zh for en', () => {
    expect(getAltLang('en')).toBe('zh');
  });
});

describe('localizedPath()', () => {
  it('builds zh path', () => {
    expect(localizedPath('/', 'zh')).toBe('/zh');
    expect(localizedPath('/features', 'zh')).toBe('/zh/features');
  });

  it('builds en path', () => {
    expect(localizedPath('/', 'en')).toBe('/en');
    expect(localizedPath('/privacy', 'en')).toBe('/en/privacy');
  });
});

describe('getAltLangPath()', () => {
  it('switches from zh to en', () => {
    expect(getAltLangPath('/zh/features', 'en')).toBe('/en/features');
  });

  it('switches from en to zh', () => {
    expect(getAltLangPath('/en/privacy', 'zh')).toBe('/zh/privacy');
  });

  it('handles root path', () => {
    expect(getAltLangPath('/zh', 'en')).toBe('/en');
  });
});
