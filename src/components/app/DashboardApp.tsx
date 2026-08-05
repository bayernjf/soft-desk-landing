import { useState, useMemo } from 'react';
import type { Software, Workflow } from '@/data/types';
import { CATEGORIES } from '@/data/software';
import { formatMinutes } from '@/lib/utils';
import { track } from '@/lib/analytics';
import SoftwareCard from './SoftwareCard';
import { RadialMenu } from './RadialMenu';

interface DashboardAppProps {
  software: Software[];
  workflows: Workflow[];
}

function StatCard({
  title,
  value,
  hint,
  color,
}: {
  title: string;
  value: string;
  hint: string;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all duration-300 hover:border-slate-700/80">
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="mb-2 text-xs font-medium text-slate-500">{title}</div>
          <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{hint}</div>
        </div>
        <svg className="h-4 w-4 text-slate-700 transition-colors group-hover:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      </div>
    </div>
  );
}

export default function DashboardApp({ software, workflows }: DashboardAppProps) {
  const [radialOpen, setRadialOpen] = useState(false);

  const topApps = useMemo(
    () => [...software].sort((a, b) => b.usageMinutes - a.usageMinutes).slice(0, 5),
    [software],
  );

  const recentApps = useMemo(
    () => [...software].sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()).slice(0, 6),
    [software],
  );

  const totalMinutes = software.reduce((sum, s) => sum + s.usageMinutes, 0);
  const perDay = Math.round(totalMinutes / 7);

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
    track('workflow_run', {
      workflow_id: id,
    });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {greeting}，欢迎回来 <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">这是你的软件使用概览</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-3 py-1.5 text-brand">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-medium">AI 分析已更新</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard title="总应用数" value={String(software.length)} hint="个已安装应用" color="#7c3aed" />
        <StatCard title="本周使用时长" value={`${(totalMinutes / 60).toFixed(1)}h`} hint={`${perDay} 分钟 / 天`} color="#ec4899" />
        <StatCard title="智能工作流" value={String(workflows.length)} hint={`已使用 ${workflows.reduce((s, w) => s + w.usageCount, 0)} 次`} color="#f59e0b" />
        <StatCard
          title="最近活跃"
          value={`${Math.round((software.filter((s) => new Date(s.lastUsed).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000).length / Math.max(1, software.length)) * 100)}%`}
          hint="3 天内使用过"
          color="#10b981"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Apps */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">常用软件</h2>
              <div className="text-xs text-slate-500">按使用时长排序</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {topApps.map((sw, i) => (
                <SoftwareCard key={sw.id} software={sw} index={i} onLaunch={handleLaunchSoftware} />
              ))}
            </div>
          </section>

          {/* Recent Apps */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">最近使用</h2>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
              <div className="space-y-2">
                {recentApps.map((sw, idx) => {
                  const percent = Math.round((sw.usageMinutes / Math.max(1, totalMinutes)) * 100);
                  return (
                    <div
                      key={sw.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-slate-800/40 py-2 last:border-b-0 transition-all hover:pl-2"
                      onClick={() => handleLaunchSoftware(sw.id)}
                    >
                      <div className="w-6 text-xs tabular-nums text-slate-600">{String(idx + 1).padStart(2, '0')}</div>
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: sw.color + '25', color: sw.color }}
                      >
                        {sw.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-200">{sw.name}</div>
                        <div className="text-xs text-slate-500">
                          {formatMinutes(sw.usageMinutes)} · {sw.lastUsed ? new Date(sw.lastUsed).toLocaleDateString('zh-CN') : '未知'}
                        </div>
                      </div>
                      <div className="text-xs tabular-nums text-slate-500">{percent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-6">
          {/* Category Overview */}
          <section>
            <h2 className="mb-4 text-sm font-semibold text-slate-200">分类概览</h2>
            <div className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
              {CATEGORIES.slice(0, 6).map((cat) => {
                const count = software.filter((s) => s.category === cat.id).length;
                const usage = software
                  .filter((s) => s.category === cat.id)
                  .reduce((sum, s) => sum + s.usageMinutes, 0);
                const percent = Math.round((usage / Math.max(1, totalMinutes)) * 100);
                if (count === 0) return null;
                return (
                  <div key={cat.id}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{cat.name}</span>
                      <span className="text-xs tabular-nums text-slate-500">
                        {percent}% · {count} 个
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/60">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percent)}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Suggestions */}
          <section>
            <h2 className="mb-4 text-sm font-semibold text-slate-200">AI 建议</h2>
            <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-slate-900/40 to-accent/5 p-4">
              <div className="mb-3 flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">优化你的工作流</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Chrome、Notion、飞书在过去一周多次同时使用，建议创建组合工作流。
                  </p>
                </div>
              </div>
              <button className="w-full rounded-xl bg-brand/15 py-2.5 text-xs font-medium text-brand transition-colors hover:bg-brand/25">
                创建工作流 +
              </button>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
              <div className="text-xs leading-relaxed text-slate-400">
                💡 <span className="text-slate-300">提示</span>：你的生产力在周四早 9-11 点达到峰值，建议将重要任务安排在这个时段。
              </div>
            </div>
          </section>

          {/* Radial Menu Trigger */}
          <section>
            <button
              onClick={() => setRadialOpen(true)}
              className="flex w-full items-center gap-3 rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/10 to-accent/10 px-4 py-3 text-sm font-medium text-brand transition-all hover:from-brand/20 hover:to-accent/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="3" r="1.5" />
                <circle cx="12" cy="21" r="1.5" />
                <circle cx="3" cy="12" r="1.5" />
                <circle cx="21" cy="12" r="1.5" />
                <circle cx="5.64" cy="5.64" r="1.5" />
                <circle cx="18.36" cy="18.36" r="1.5" />
                <circle cx="5.64" cy="18.36" r="1.5" />
                <circle cx="18.36" cy="5.64" r="1.5" />
              </svg>
              <span>打开径向菜单</span>
              <span className="ml-auto rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">中键</span>
            </button>
          </section>
        </aside>
      </div>

      {/* Radial Menu */}
      <RadialMenu
        software={software}
        workflows={workflows}
        open={radialOpen}
        onOpenChange={setRadialOpen}
        onLaunchSoftware={handleLaunchSoftware}
        onLaunchWorkflow={handleLaunchWorkflow}
      />
    </div>
  );
}
