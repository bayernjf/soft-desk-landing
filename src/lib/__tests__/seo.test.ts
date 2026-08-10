import { describe, it, expect } from 'vitest';
import { buildCanonicalUrl, buildHreflangTags, baseSchema, softwareApplicationSchema, faqSchema, breadcrumbSchema } from '@/lib/seo';

describe('buildCanonicalUrl()', () => {
  it('builds root URL', () => {
    const url = buildCanonicalUrl('/', 'zh');
    expect(url).toMatch(/\/zh\/$/);
  });

  it('builds path URL', () => {
    const url = buildCanonicalUrl('/privacy', 'en');
    expect(url).toMatch(/\/en\/privacy\/$/);
  });
});

describe('buildHreflangTags()', () => {
  it('returns 3 hreflang entries', () => {
    const tags = buildHreflangTags('/');
    expect(tags).toHaveLength(3);
    expect(tags.find((t) => t.hreflang === 'zh-CN')).toBeDefined();
    expect(tags.find((t) => t.hreflang === 'en')).toBeDefined();
    expect(tags.find((t) => t.hreflang === 'x-default')).toBeDefined();
  });

  it('zh and x-default point to same URL', () => {
    const tags = buildHreflangTags('/features');
    const zh = tags.find((t) => t.hreflang === 'zh-CN')!;
    const xDefault = tags.find((t) => t.hreflang === 'x-default')!;
    expect(zh.href).toBe(xDefault.href);
  });
});

describe('baseSchema()', () => {
  it('returns WebSite and Organization schemas', () => {
    const schemas = baseSchema('zh');
    expect(schemas).toHaveLength(2);
    expect(schemas[0]['@type']).toBe('WebSite');
    expect(schemas[1]['@type']).toBe('Organization');
  });

  it('sets correct language code', () => {
    const zhSchemas = baseSchema('zh');
    expect(zhSchemas[0].inLanguage).toBe('zh-CN');

    const enSchemas = baseSchema('en');
    expect(enSchemas[0].inLanguage).toBe('en');
  });
});

describe('softwareApplicationSchema()', () => {
  it('includes required fields', () => {
    const schema = softwareApplicationSchema('zh');
    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.name).toBe('SoftDesk');
    expect(schema.operatingSystem).toContain('macOS');
    expect(schema.offers.price).toBe('0');
  });

  it('has Chinese description for zh', () => {
    const schema = softwareApplicationSchema('zh');
    expect(schema.description).toContain('AI');
  });

  it('has English description for en', () => {
    const schema = softwareApplicationSchema('en');
    expect(schema.description).toContain('AI-powered');
  });
});

describe('faqSchema()', () => {
  it('generates FAQ structured data', () => {
    const faqs = [
      { question: 'Q1?', answer: 'A1' },
      { question: 'Q2?', answer: 'A2' },
    ];
    const schema = faqSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0].name).toBe('Q1?');
  });
});

describe('breadcrumbSchema()', () => {
  it('generates breadcrumb list', () => {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Features', path: '/features' },
    ];
    const schema = breadcrumbSchema(items, 'zh');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].name).toBe('Features');
  });
});
