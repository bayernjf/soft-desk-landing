import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations, getAltLang, localizedPath, getAltLangPath } from '@/i18n/utils';

describe('getLangFromUrl()', () => {
  it('extracts zh from URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/zh/'))).toBe('zh');
  });

  it('extracts zh from nested zh URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/zh/features'))).toBe('zh');
  });

  it('returns en (default) for root URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe('en');
  });

  it('returns en (default) for non-zh path', () => {
    expect(getLangFromUrl(new URL('https://example.com/features'))).toBe('en');
  });

  it('falls back to en for unknown language', () => {
    expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('en');
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
  it('builds zh path with prefix', () => {
    expect(localizedPath('/', 'zh')).toBe('/zh');
    expect(localizedPath('/features', 'zh')).toBe('/zh/features');
  });

  it('builds en path without prefix (root)', () => {
    expect(localizedPath('/', 'en')).toBe('/');
    expect(localizedPath('/privacy', 'en')).toBe('/privacy');
  });
});

describe('getAltLangPath()', () => {
  it('switches from zh to en (strips /zh prefix)', () => {
    expect(getAltLangPath('/zh/features', 'en')).toBe('/features');
  });

  it('switches from en to zh (adds /zh prefix)', () => {
    expect(getAltLangPath('/privacy', 'zh')).toBe('/zh/privacy');
  });

  it('handles zh root path to en root', () => {
    expect(getAltLangPath('/zh', 'en')).toBe('/');
  });

  it('handles en root path to zh root', () => {
    expect(getAltLangPath('/', 'zh')).toBe('/zh');
  });

  it('handles logical path (no prefix) from en to zh', () => {
    expect(getAltLangPath('/features/ai-classification', 'zh')).toBe('/zh/features/ai-classification');
  });
});
