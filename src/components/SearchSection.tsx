import { useState } from 'react';
import type { CategoryMeta, Software, SoftwareCategory } from '@/data/types';
import { track } from '@/lib/analytics';

interface SearchResult {
  app: Software;
  reason: string;
}

export interface SearchPredefinedQuery {
  /** Localized query text, also used as the quick-pick chip label. */
  text: string;
  /** Localized explanation shown above the results. */
  reason: string;
  /** Non-localized category hint used by the matcher. */
  category: SoftwareCategory;
}

export interface SearchSectionStrings {
  badge: string;
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  /** Shown while the fake AI search spinner runs. */
  searching: string;
  /** Fallback reason for free-text queries; `{n}` = number of matches. */
  matchCount: string;
  emptyResult: string;
  predefinedQueries: SearchPredefinedQuery[];
}

function useNaturalSearch(software: Software[], strings: SearchSectionStrings) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchReason, setSearchReason] = useState('');

  const search = (text: string) => {
    setQuery(text);
    setIsSearching(true);
    setTimeout(() => {
      const q = strings.predefinedQueries.find((item) => item.text === text);
      const matched = software.filter(
        (s) =>
          s.name.toLowerCase().includes(text.toLowerCase()) ||
          s.description.toLowerCase().includes(text.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(text.toLowerCase())) ||
          (q !== undefined && q.category === s.category)
      );

      const reason = q?.reason || strings.matchCount.replace('{n}', String(matched.length));

      setResults(matched.slice(0, 4).map((app) => ({ app, reason })));
      setSearchReason(reason);
      setIsSearching(false);
    }, 800);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setSearchReason('');
  };

  return { query, results, isSearching, searchReason, search, clear };
}

export default function SearchSection({
  software,
  categories,
  strings,
}: {
  software: Software[];
  categories: CategoryMeta[];
  strings: SearchSectionStrings;
}) {
  const { query, results, isSearching, searchReason, search, clear } = useNaturalSearch(
    software,
    strings,
  );
  const quickQueries = strings.predefinedQueries.map((q) => q.text);

  return (
    <section
      id="search"
      className="border-y border-slate-800/60 bg-slate-900/20 px-4 py-24 sm:px-6"
      data-analytics-section="search"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {strings.badge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {strings.title}
          </h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            {strings.subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 sm:p-8">
          <div className="relative mb-6">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => {
                search(e.target.value);
                if (e.target.value.length === 1) {
                  track('search_demo_start');
                }
              }}
              placeholder={strings.inputPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-4 pl-12 pr-10 text-sm text-slate-100 transition-all placeholder:text-slate-500 focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
            />
            {query && (
              <button
                onClick={clear}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-700"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {quickQueries.map((q) => (
              <button
                key={q}
                onClick={() => {
                  track('search_demo_quick_click', { query: q });
                  search(q);
                }}
                className="rounded-lg border border-slate-800/60 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                {q}
              </button>
            ))}
          </div>

          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <span className="text-sm text-slate-400">{strings.searching}</span>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-3">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-4 w-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a4 4 0 0 1 4 4v1h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-1H7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1V6a4 4 0 0 1 4-4z" />
                </svg>
                <span className="text-xs font-medium text-slate-300">{searchReason}</span>
              </div>
              {results.map(({ app }) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/50"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ backgroundColor: app.color + '20', color: app.color }}
                  >
                    {app.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-100">{app.name}</div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">{app.description}</div>
                  </div>
                  <div className="rounded-md bg-brand/10 px-2 py-1 text-xs text-brand">
                    {categories.find((c) => c.id === app.category)?.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">{strings.emptyResult}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
