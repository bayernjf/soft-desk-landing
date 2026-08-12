import { useMemo, useState } from 'react';
import type { Software } from '@/data/types';
import { formatMinutes, formatTimeAgo, formatSize, cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

export interface UninstallStrings {
  lang: 'en' | 'zh';
  pageTitle: string;
  pageSubtitle: string;
  totalSpaceLabel: string;
  reclaimableSpaceLabel: string;
  largestSectionTitle: string;
  topCountLabel: string;
  lastUsedSuffix: string;
  uninstallButton: string;
  unusedSectionTitle: string;
  unusedSectionMeta: string;
  lastUsedPrefix: string;
  allActiveMessage: string;
  suggestionTitle: string;
  suggestionBody: string;
  largeAppsTitle: string;
  largeAppsMeta: string;
  cleanUpAllButton: string;
  nothingToCleanButton: string;
}

interface UninstallAppProps {
  software: Software[];
  strings: UninstallStrings;
}

export default function UninstallApp({ software, strings }: UninstallAppProps) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const activeSoftware = useMemo(
    () => software.filter((s) => !removedIds.includes(s.id)),
    [software, removedIds],
  );

  const bySize = useMemo(
    () => [...activeSoftware].sort((a, b) => b.size - a.size).slice(0, 6),
    [activeSoftware],
  );
  const unused = useMemo(
    () =>
      [...activeSoftware]
        .filter((s) => new Date(s.lastUsed).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000)
        .sort((a, b) => a.usageMinutes - b.usageMinutes),
    [activeSoftware],
  );
  const largeSize = useMemo(() => activeSoftware.filter((s) => s.size >= 500), [activeSoftware]);

  const totalSize = activeSoftware.reduce((sum, s) => sum + s.size, 0);
  const potentialFree = unused.reduce((sum, s) => sum + s.size, 0);

  const uninstallSoftware = (id: string) => {
    setRemovedIds((prev) => [...prev, id]);
    track('software_uninstall', { software_id: id });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{strings.pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{strings.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white tabular-nums">{formatSize(totalSize)}</div>
            <div className="text-xs text-gray-500">{strings.totalSpaceLabel}</div>
          </div>
          <div className="w-px h-10 bg-gray-800" />
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-400 tabular-nums">{formatSize(potentialFree)}</div>
            <div className="text-xs text-gray-500">{strings.reclaimableSpaceLabel}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Largest disk footprint */}
          <section className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="12" x2="2" y2="12" />
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  <line x1="6" y1="16" x2="6.01" y2="16" />
                  <line x1="10" y1="16" x2="10.01" y2="16" />
                </svg>
                <h2 className="text-sm font-semibold text-gray-200">{strings.largestSectionTitle}</h2>
              </div>
              <span className="text-xs text-gray-500">{strings.topCountLabel.replace('{n}', String(bySize.length))}</span>
            </div>
            <div className="space-y-2.5">
              {bySize.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: sw.color + '25', color: sw.color }}
                  >
                    {sw.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200 truncate">{sw.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatSize(sw.size)} · {formatMinutes(sw.usageMinutes, strings.lang)} · {formatTimeAgo(sw.lastUsed, strings.lang)}{strings.lastUsedSuffix}
                    </div>
                  </div>
                  <button
                    onClick={() => uninstallSoftware(sw.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {strings.uninstallButton}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recently unused */}
          <section className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h2 className="text-sm font-semibold text-gray-200">{strings.unusedSectionTitle}</h2>
              </div>
              <span className="text-xs text-gray-500">{strings.unusedSectionMeta.replace('{n}', String(unused.length))}</span>
            </div>
            <div className="space-y-2.5">
              {unused.length > 0 ? (
                unused.slice(0, 5).map((sw) => (
                  <div
                    key={sw.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: sw.color + '25', color: sw.color }}
                    >
                      {sw.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate">{sw.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {strings.lastUsedPrefix}{formatTimeAgo(sw.lastUsed, strings.lang)}
                      </div>
                    </div>
                    <button
                      onClick={() => uninstallSoftware(sw.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {strings.uninstallButton}
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-sm text-gray-500">
                  {strings.allActiveMessage}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          {/* Cleanup suggestion */}
          <section className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-gray-900/40 to-gray-900/40 border border-amber-500/20">
            <div className="flex items-start gap-2.5">
              <svg className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-gray-200">{strings.suggestionTitle}</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {strings.suggestionBody.replace('{n}', String(unused.length))}
                </p>
              </div>
            </div>
          </section>

          {/* Large apps */}
          <section className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-200">{strings.largeAppsTitle}</h3>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {strings.largeAppsMeta.replace('{n}', String(largeSize.length))}
            </div>
            <div className="space-y-2">
              {largeSize.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center gap-2.5 text-xs group cursor-pointer"
                  onClick={() => uninstallSoftware(sw.id)}
                >
                  <span
                    className="px-2 py-0.5 rounded-md font-medium"
                    style={{ backgroundColor: sw.color + '20', color: sw.color }}
                  >
                    {formatSize(sw.size)}
                  </span>
                  <span className="text-gray-400 truncate group-hover:text-gray-200 transition-colors">
                    {sw.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <button
            className={cn(
              'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all',
              'bg-gradient-to-r from-brand to-brand text-white',
              'hover:shadow-lg hover:shadow-brand/20 active:scale-[0.99]',
            )}
          >
            {unused.length > 0
              ? strings.cleanUpAllButton.replace('{n}', String(unused.length))
              : strings.nothingToCleanButton}
          </button>
        </aside>
      </div>
    </div>
  );
}
