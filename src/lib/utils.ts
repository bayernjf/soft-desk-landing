import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Language } from '@/i18n/ui';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  return n.toString();
}

const timeAgoLabels: Record<Language, { justNow: string; minAgo: (_n: number) => string; hrAgo: (_n: number) => string; dayAgo: (_n: number) => string; moAgo: (_n: number) => string }> = {
  zh: {
    justNow: '刚刚',
    minAgo: (n) => `${n} 分钟前`,
    hrAgo: (n) => `${n} 小时前`,
    dayAgo: (n) => `${n} 天前`,
    moAgo: (n) => `${n} 个月前`,
  },
  en: {
    justNow: 'just now',
    minAgo: (n) => `${n}m ago`,
    hrAgo: (n) => `${n}h ago`,
    dayAgo: (n) => `${n}d ago`,
    moAgo: (n) => `${n}mo ago`,
  },
};

export function formatTimeAgo(dateStr: string, lang: Language = 'zh'): string {
  const now = new Date().getTime();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const labels = timeAgoLabels[lang];

  if (minutes < 1) return labels.justNow;
  if (minutes < 60) return labels.minAgo(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return labels.hrAgo(hours);
  const days = Math.floor(hours / 24);
  if (days < 30) return labels.dayAgo(days);
  return labels.moAgo(Math.floor(days / 30));
}

const minuteLabels: Record<Language, { min: string; hr: string; day: string; hrMin: string; dayHr: string }> = {
  zh: { min: '分钟', hr: '小时', day: '天', hrMin: '小时', dayHr: '小时' },
  en: { min: 'min', hr: 'h', day: 'd', hrMin: 'h', dayHr: 'h' },
};

export function formatMinutes(mins: number, lang: Language = 'zh'): string {
  const l = minuteLabels[lang];
  if (lang === 'en') {
    if (mins < 60) return `${mins}${l.min}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}${l.hr}`;
    const days = Math.floor(hours / 24);
    return `${days}${l.day}`;
  }
  if (mins < 60) return `${mins} ${l.min}`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours < 24) return `${hours} ${l.hrMin} ${remaining} 分`;
  const days = Math.floor(hours / 24);
  return `${days} ${l.day} ${hours % 24} ${l.dayHr}`;
}

export function formatSize(mb: number): string {
  if (mb < 1024) return `${mb} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}
