import { useMemo } from 'react';
import type { Software, Workflow } from '@/data/types';
import { formatMinutes } from '@/lib/utils';
import { track } from '@/lib/analytics';

export interface FavoritesSectionStrings {
  lang: 'en' | 'zh';
  badge: string;
  title: string;
  subtitle: string;
  /** `{n}` = number of favorite apps. */
  favoriteSoftwareLabel: string;
  /** `{n}` = number of favorite workflows. */
  favoriteWorkflowsLabel: string;
  /** `{n}` = launch count. */
  launchCount: string;
  /** `{n}` = usage count. */
  usageCount: string;
  launchButton: string;
}

export default function FavoritesSection({
  software,
  workflows,
  strings,
}: {
  software: Software[];
  workflows: Workflow[];
  strings: FavoritesSectionStrings;
}) {
  const favoriteSoftware = useMemo(() => software.filter((s) => s.launchCount > 300), [software]);
  const favoriteWorkflows = useMemo(() => workflows.filter((w) => w.isFavorite), [workflows]);

  return (
    <section
      id="favorites"
      className="border-y border-slate-800/60 bg-slate-900/20 px-4 py-24 sm:px-6"
      data-analytics-section="favorites"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
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

        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <svg className="h-4 w-4 fill-amber-500 text-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
            </svg>
            {strings.favoriteSoftwareLabel.replace('{n}', String(favoriteSoftware.length))}
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {favoriteSoftware.slice(0, 6).map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-800/30 p-4 transition-colors hover:border-slate-700"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ backgroundColor: app.color + '20', color: app.color }}
                >
                  {app.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-200">{app.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {formatMinutes(app.usageMinutes, strings.lang)} ·{' '}
                    {strings.launchCount.replace('{n}', String(app.launchCount))}
                  </div>
                </div>
                <button
                  onClick={() => track('favorite_app_launch', { app_id: app.id, app_name: app.name })}
                  className="rounded-lg bg-slate-900/40 p-2 text-slate-400 transition-colors hover:bg-slate-900/60 hover:text-slate-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <svg className="h-4 w-4 fill-amber-500 text-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
            </svg>
            {strings.favoriteWorkflowsLabel.replace('{n}', String(favoriteWorkflows.length))}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {favoriteWorkflows.map((wf) => {
              const wfApps = wf.softwareIds
                .map((id) => software.find((s) => s.id === id))
                .filter(Boolean)
                .slice(0, 4) as Software[];

              return (
                <div
                  key={wf.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-800/60 bg-slate-800/30 p-4 transition-colors hover:border-slate-700"
                >
                  <div className="flex -space-x-2">
                    {wfApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 text-xs font-semibold"
                        style={{ backgroundColor: app.color + '30', color: app.color }}
                      >
                        {app.name.slice(0, 2)}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-200">{wf.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {strings.usageCount.replace('{n}', String(wf.usageCount))}
                    </div>
                  </div>
                  <button
                    onClick={() => track('favorite_workflow_launch', { workflow_id: wf.id, workflow_name: wf.name })}
                    className="flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
                  >
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {strings.launchButton}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
