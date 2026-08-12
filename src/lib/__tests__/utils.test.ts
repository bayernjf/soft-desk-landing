import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatNumber, formatTimeAgo, formatMinutes, formatSize } from '@/lib/utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional classes', () => {
    const isHidden = false;
    expect(cn('base', isHidden && 'hidden', 'extra')).toBe('base extra');
  });

  it('handles undefined/null inputs', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});

describe('formatNumber()', () => {
  it('returns plain number for values under 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with k suffix', () => {
    expect(formatNumber(1000)).toBe('1.0k');
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(12345)).toBe('12.3k');
  });
});

describe('formatTimeAgo()', () => {
  const now = Date.now();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "刚刚" for very recent times (zh)', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 10_000).toISOString(), 'zh')).toBe('刚刚');
  });

  it('returns minutes ago (zh)', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 5 * 60_000).toISOString(), 'zh')).toBe('5 分钟前');
  });

  it('returns hours ago (zh)', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 3 * 3600_000).toISOString(), 'zh')).toBe('3 小时前');
  });

  it('returns days ago (zh)', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 7 * 86400_000).toISOString(), 'zh')).toBe('7 天前');
  });

  it('returns months ago (zh)', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 90 * 86400_000).toISOString(), 'zh')).toBe('3 个月前');
  });

  it('returns English labels', () => {
    vi.setSystemTime(now);
    expect(formatTimeAgo(new Date(now - 10_000).toISOString(), 'en')).toBe('just now');
    expect(formatTimeAgo(new Date(now - 5 * 60_000).toISOString(), 'en')).toBe('5m ago');
    expect(formatTimeAgo(new Date(now - 3 * 3600_000).toISOString(), 'en')).toBe('3h ago');
    expect(formatTimeAgo(new Date(now - 7 * 86400_000).toISOString(), 'en')).toBe('7d ago');
  });
});

describe('formatMinutes()', () => {
  it('formats minutes only (zh)', () => {
    expect(formatMinutes(30, 'zh')).toBe('30 分钟');
  });

  it('formats hours and minutes (zh)', () => {
    expect(formatMinutes(90, 'zh')).toBe('1 小时 30 分');
  });

  it('formats days and hours (zh)', () => {
    expect(formatMinutes(1500, 'zh')).toBe('1 天 1 小时');
  });

  it('formats English short form', () => {
    expect(formatMinutes(30, 'en')).toBe('30min');
    expect(formatMinutes(90, 'en')).toBe('1h');
    expect(formatMinutes(1500, 'en')).toBe('1d');
  });
});

describe('formatSize()', () => {
  it('formats MB for values under 1024', () => {
    expect(formatSize(100)).toBe('100 MB');
    expect(formatSize(1023)).toBe('1023 MB');
  });

  it('formats GB for values >= 1024', () => {
    expect(formatSize(1024)).toBe('1.0 GB');
    expect(formatSize(2048)).toBe('2.0 GB');
    expect(formatSize(1536)).toBe('1.5 GB');
  });
});
