import { describe, it, expect, afterEach } from 'vitest';
import { formatBytes, detectPlatform, FALLBACK_URL } from '@/lib/download-urls';

describe('formatBytes()', () => {
  it('returns empty string for 0 or negative', () => {
    expect(formatBytes(0)).toBe('');
    expect(formatBytes(-100)).toBe('');
  });

  it('formats MB correctly', () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatBytes(150 * 1024 * 1024)).toBe('150.0 MB');
  });

  it('formats GB for large values', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.50 GB');
  });
});

describe('detectPlatform()', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('detects macOS', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe('mac');
  });

  it('detects Windows', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe('win');
  });

  it('returns unknown for other platforms', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' },
      writable: true,
      configurable: true,
    });
    expect(detectPlatform()).toBe('unknown');
  });
});

describe('FALLBACK_URL', () => {
  it('points to GitHub releases', () => {
    expect(FALLBACK_URL).toContain('github.com');
    expect(FALLBACK_URL).toContain('releases');
  });
});
