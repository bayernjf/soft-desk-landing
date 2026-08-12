import { useState, useMemo } from 'react';
import type { CategoryMeta, Software, SoftwareCategory } from '@/data/types';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import SoftwareCard, { type SoftwareCardStrings } from './SoftwareCard';

const sortIds = ['recent', 'usage', 'name', 'size'] as const;

type SortId = (typeof sortIds)[number];

export interface LibraryStrings {
  title: string;
  subtitle: string;
  countLabel: string;
  searchPlaceholder: string;
  allCategories: string;
  sortLabels: Record<SortId, string>;
  emptyResults: string;
  softwareCard: SoftwareCardStrings;
}

interface LibraryAppProps {
  software: Software[];
  categories: CategoryMeta[];
  strings: LibraryStrings;
}

export default function LibraryApp({ software, categories, strings }: LibraryAppProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortId>('recent');

  const filtered = useMemo(() => {
    let result = software;
    if (selectedCategory !== 'all') {
      result = result.filter((s) => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'usage':
        result = [...result].sort((a, b) => b.usageMinutes - a.usageMinutes);
        break;
      case 'recent':
        result = [...result].sort(
          (a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime(),
        );
        break;
      case 'size':
        result = [...result].sort((a, b) => b.size - a.size);
        break;
    }
    return result;
  }, [software, selectedCategory, searchQuery, sortBy]);

  const handleLaunchSoftware = (id: string) => {
    const sw = software.find((s) => s.id === id);
    if (sw) {
      track('software_launch', {
        software_id: sw.id,
        software_name: sw.name,
        software_category: sw.category,
      });
    }
  };

  const availableCategories = categories.filter((c) => software.some((s) => s.category === c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{strings.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{strings.subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums text-white">{filtered.length}</div>
          <div className="text-xs text-slate-500">{strings.countLabel}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={strings.searchPlaceholder}
          className={cn(
            'w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 pl-11 pr-10',
            'text-sm text-slate-100 placeholder:text-slate-600',
            'focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-800"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filters + Sort options */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              selectedCategory === 'all'
                ? 'border-brand/30 bg-brand/20 text-brand'
                : 'border-slate-800/60 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300',
            )}
          >
            {strings.allCategories}
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                selectedCategory === cat.id
                  ? 'border-brand/30 bg-brand/20 text-brand'
                  : 'border-slate-800/60 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="10" y2="18" />
          </svg>
          {sortIds.map((id) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs transition-all',
                sortBy === id ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300',
              )}
            >
              {strings.sortLabels[id]}
            </button>
          ))}
        </div>
      </div>

      {/* Software grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sw, i) => (
          <SoftwareCard
            key={sw.id}
            software={sw}
            categories={categories}
            strings={strings.softwareCard}
            index={i}
            onLaunch={handleLaunchSoftware}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="text-sm text-slate-600">{strings.emptyResults}</div>
          </div>
        )}
      </div>
    </div>
  );
}
