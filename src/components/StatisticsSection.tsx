import { useMemo } from 'react';
import type { Software } from '@/data/types';
import { CATEGORIES } from '@/data/software';

export default function StatisticsSection({ software }: { software: Software[] }) {
  const totalMinutes = software.reduce((sum, s) => sum + s.usageMinutes, 0);
  const totalLaunches = software.reduce((sum, s) => sum + s.launchCount, 0);

  const topApps = useMemo(
    () => [...software].sort((a, b) => b.usageMinutes - a.usageMinutes).slice(0, 5),
    [software],
  );

  const categoryStats = useMemo(
    () =>
      CATEGORIES.filter((cat) => software.some((s) => s.category === cat.id))
        .map((cat) => {
          const apps = software.filter((s) => s.category === cat.id);
          const usage = apps.reduce((sum, s) => sum + s.usageMinutes, 0);
          return {
            ...cat,
            count: apps.length,
            usage,
            percent: Math.round((usage / totalMinutes) * 100),
          };
        })
        .sort((a, b) => b.usage - a.usage),
    [software, totalMinutes],
  );

  return (
    <section id="statistics" className="px-4 py-24 sm:px-6" data-analytics-section="statistics">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18 17V9M13 17V5M8 17v-3" />
            </svg>
            使用时长统计
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            数据驱动的效率洞察
          </h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            追踪每款软件的启动次数、使用时长、活跃时段，生成你的个人软件使用画像。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 总览 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm font-semibold text-slate-200">本周使用总时长</span>
            </div>
            <div className="mb-2 text-4xl font-bold text-white">
              {(totalMinutes / 60).toFixed(1)}h
            </div>
            <div className="text-xs text-slate-500">
              共 {software.length} 个软件，{totalLaunches} 次启动
            </div>
          </div>

          {/* Top 5 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-sm font-semibold text-slate-200">高频软件 TOP 5</span>
            </div>
            <div className="space-y-2.5">
              {topApps.map((app, idx) => (
                <div key={app.id} className="flex items-center gap-2.5">
                  <div className="w-5 text-xs tabular-nums text-slate-600">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold"
                    style={{ backgroundColor: app.color + '20', color: app.color }}
                  >
                    {app.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 truncate text-xs font-medium text-slate-200">{app.name}</div>
                  <div className="text-xs tabular-nums text-slate-500">
                    {(app.usageMinutes / 60).toFixed(1)}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 分类分布 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="text-sm font-semibold text-slate-200">分类使用占比</span>
            </div>
            <div className="space-y-3">
              {categoryStats.slice(0, 6).map((cat) => (
                <div key={cat.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{cat.name}</span>
                    <span className="text-xs tabular-nums text-slate-500">
                      {cat.percent}% · {cat.count} 个
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, cat.percent)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
