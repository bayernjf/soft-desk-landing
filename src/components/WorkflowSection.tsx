import type { Software, Workflow } from '@/data/types';
import { formatTimeAgo } from '@/lib/utils';
import { track } from '@/lib/analytics';

export interface WorkflowSectionStrings {
  lang: 'en' | 'zh';
  badge: string;
  title: string;
  subtitle: string;
  launchButton: string;
  /** `{n}` = usage count. */
  usageCount: string;
}

export default function WorkflowSection({
  workflows,
  software,
  strings,
}: {
  workflows: Workflow[];
  software: Software[];
  strings: WorkflowSectionStrings;
}) {
  return (
    <section id="workflow" className="px-4 py-24 sm:px-6" data-analytics-section="workflow">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 17h7" />
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

        <div className="grid gap-5 md:grid-cols-2">
          {workflows.map((wf) => {
            const wfApps = wf.softwareIds
              .map((id) => software.find((s) => s.id === id))
              .filter(Boolean)
              .slice(0, 4) as Software[];

            return (
              <div
                key={wf.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 transition-all duration-300 hover:border-slate-700/80"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${wf.color}20 0%, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white">{wf.name}</h3>
                        {wf.isFavorite && (
                          <svg className="h-3.5 w-3.5 fill-amber-500 text-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                          </svg>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{wf.description}</p>
                    </div>
                    <button
                      onClick={() => track('workflow_launch_click', { workflow_id: wf.id, workflow_name: wf.name })}
                      className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-dark active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {strings.launchButton}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {wfApps.map((app) => (
                        <div
                          key={app.id}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 text-xs font-semibold"
                          style={{ backgroundColor: app.color + '30', color: app.color }}
                          title={app.name}
                        >
                          {app.name.slice(0, 2)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {formatTimeAgo(wf.lastUsed, strings.lang)} ·{' '}
                      {strings.usageCount.replace('{n}', String(wf.usageCount))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
