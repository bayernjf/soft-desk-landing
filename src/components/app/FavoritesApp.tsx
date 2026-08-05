import { useState } from 'react';
import type { Software, Workflow } from '@/data/types';
import { formatTimeAgo } from '@/lib/utils';
import { track } from '@/lib/analytics';
import SoftwareCard from './SoftwareCard';
import { cn } from '@/lib/utils';

interface FavoritesAppProps {
  software: Software[];
  workflows: Workflow[];
}

export default function FavoritesApp({ software, workflows }: FavoritesAppProps) {
  const [favSoftwareIds, setFavSoftwareIds] = useState<string[]>(
    () => [...software].sort((a, b) => b.launchCount - a.launchCount).slice(0, 3).map((s) => s.id),
  );
  const [wfFavState, setWfFavState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(workflows.map((w) => [w.id, w.isFavorite])),
  );

  const handleToggleSoftwareFav = (id: string, name: string) => {
    const wasFav = favSoftwareIds.includes(id);
    setFavSoftwareIds((prev) => (wasFav ? prev.filter((x) => x !== id) : [...prev, id]));
    track(wasFav ? 'favorite_remove' : 'favorite_add', { item_name: name, item_type: 'software' });
  };

  const handleToggleWfFav = (id: string, name: string) => {
    const wasFav = wfFavState[id] ?? false;
    setWfFavState((prev) => ({ ...prev, [id]: !wasFav }));
    track(wasFav ? 'favorite_remove' : 'favorite_add', { item_name: name, item_type: 'workflow' });
  };

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

  const handleLaunchWorkflow = (id: string) => {
    track('workflow_run', { workflow_id: id });
  };

  const favoriteSoftware = software.filter((s) => favSoftwareIds.includes(s.id));
  const favoriteWorkflows = workflows.filter((w) => wfFavState[w.id]);

  return (
    <div className="space-y-8">
      {/* 页头 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-rose-500/20">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">收藏夹</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {favoriteSoftware.length} 个软件 · {favoriteWorkflows.length} 个工作流
          </p>
        </div>
      </div>

      {/* 收藏的软件 */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
          <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
          </svg>
          收藏的软件
        </h2>

        {favoriteSoftware.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {favoriteSoftware.map((app, i) => (
              <div key={app.id} className="group relative">
                <SoftwareCard software={app} index={i} onLaunch={handleLaunchSoftware} />
                <button
                  onClick={() => handleToggleSoftwareFav(app.id, app.name)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/80 text-rose-400 opacity-0 backdrop-blur-sm transition-opacity hover:bg-rose-500/20 group-hover:opacity-100"
                  title="取消收藏"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/60">
              <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">还没有收藏的软件</p>
            <p className="mt-1 text-xs text-slate-600">在软件库中点击星标即可收藏</p>
          </div>
        )}
      </section>

      {/* 收藏的工作流 */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
          <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          收藏的工作流
        </h2>

        {favoriteWorkflows.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {favoriteWorkflows.map((wf) => {
              const wfApps = wf.softwareIds
                .map((id) => software.find((s) => s.id === id))
                .filter(Boolean) as Software[];

              return (
                <div
                  key={wf.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all duration-300 hover:border-slate-700/80',
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-5"
                    style={{ background: `linear-gradient(135deg, ${wf.color}40 0%, transparent 60%)` }}
                  />
                  <div className="relative">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white">{wf.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">{wf.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleWfFav(wf.id, wf.name)}
                        className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/10"
                        title="取消收藏"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="-space-x-2 flex items-center">
                        {wfApps.map((app) => (
                          <div
                            key={app.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 text-[10px] font-semibold"
                            style={{ backgroundColor: app.color + '30', color: app.color }}
                            title={app.name}
                          >
                            {app.name.slice(0, 2)}
                          </div>
                        ))}
                        {wfApps.length > 0 && (
                          <div className="ml-3 border-l border-slate-700/80 pl-3 text-xs text-slate-500">
                            {wf.softwareIds.length} 个应用
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {formatTimeAgo(wf.lastUsed)} · {wf.usageCount} 次使用
                        </span>
                        <button
                          onClick={() => handleLaunchWorkflow(wf.id)}
                          className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-dark"
                        >
                          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          启动
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/60">
              <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">还没有收藏的工作流</p>
          </div>
        )}
      </section>
    </div>
  );
}
