import { describe, it, expect } from 'vitest';
import { features, getFeatureBySlug } from '@/data/features';

describe('features data', () => {
  it('contains 4 features', () => {
    expect(features).toHaveLength(4);
  });

  it('each feature has required fields', () => {
    for (const f of features) {
      expect(f.slug).toBeTruthy();
      expect(f.title.zh).toBeTruthy();
      expect(f.title.en).toBeTruthy();
      expect(f.description.zh).toBeTruthy();
      expect(f.description.en).toBeTruthy();
      expect(f.sections.length).toBeGreaterThan(0);
    }
  });

  it('each feature has bilingual sections', () => {
    for (const f of features) {
      for (const s of f.sections) {
        expect(s.heading.zh).toBeTruthy();
        expect(s.heading.en).toBeTruthy();
        expect(s.body.zh).toBeTruthy();
        expect(s.body.en).toBeTruthy();
      }
    }
  });
});

describe('getFeatureBySlug()', () => {
  it('finds existing feature', () => {
    const feature = getFeatureBySlug('ai-classification');
    expect(feature).toBeDefined();
    expect(feature!.title.zh).toBe('AI 智能分类');
  });

  it('returns undefined for unknown slug', () => {
    expect(getFeatureBySlug('nonexistent')).toBeUndefined();
  });

  it('finds all features by their slugs', () => {
    for (const f of features) {
      expect(getFeatureBySlug(f.slug)).toBe(f);
    }
  });
});
