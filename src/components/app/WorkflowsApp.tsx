import type { Software, Workflow } from '@/data/types';
import { formatTimeAgo } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface WorkflowsAppProps {
  software: Software[];
  workflows: Workflow[];
}

export default function WorkflowsApp({ software, workflows }: WorkflowsAppProps) {
  const favorite = workflows.filter((w) => w.isFavorite);
  const rest = workflows.filter((w) => !w.isFavorite);

  const handleLaunch = (id: string) => {
    track('workflow_run', { workflow_id: id });
  };

  const handleFavorite = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (wf) {
      const wasFav = wf.isFavorite;
      track(wasFav ? 'workflow_unfavorite' : 'workflow_favorite', { workflow_id: id });
    }
  };

  const renderCard = (workflow: Workflow) => {
    const wfApps = workflow.softwareIds
      .map((id) => software.find((s) => s.id === id))
      .filter(Boolean) as Software[];

    return (
      <div
        key={workflow.id}
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all duration-300 hover:border-slate-700/80',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: `linear-gradient(135deg, ${workflow.color}15 0%, transparent 60%)` }}
        />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">{workflow.name}</h3>
                <button
                  onClick={() => handleFavorite(workflow.id)}
                  className="text-amber-400 opacity-80 transition-opacity hover:opacity-100"
                >
                  <svg
                    className={cn('h-3.5 w-3.5', workflow.isFavorite && 'fill-amber-400')}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">{workflow.description}</p>
            </div>
            <button
              onClick={() => handleLaunch(workflow.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg shadow-slate-900/20 transition-all duration-200 hover:bg-slate-100 active:scale-95',
              )}
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              启动
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="-space-x-2 flex items-center">
              {wfApps.map((sw) => (
                <div
                  key={sw.id}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 text-xs font-semibold"
                  style={{ backgroundColor: sw.color + '30', color: sw.color }}
                  title={sw.name}
                >
                  {sw.name.slice(0, 2)}
                </div>
              ))}
              {wfApps.length > 0 && (
                <div className="ml-3 border-l border-slate-700/80 pl-3 text-xs text-slate-500">
                  {workflow.softwareIds.length} 个应用
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {formatTimeAgo(workflow.lastUsed)} · {workflow.usageCount} 次使用
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">工作流</h1>
          <p className="mt-1 text-sm text-slate-500">一键启动你的高效工作组合</p>
        </div>
        <button
          onClick={() => track('workflow_create_start')}
          className="rounded-xl border border-brand/30 bg-brand/20 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/30 transition-colors"
        >
          + 创建工作流
        </button>
      </div>

      {favorite.length > 0 && (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            ★ 收藏
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {favorite.map((w) => renderCard(w))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          全部工作流
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {rest.map((w) => renderCard(w))}
        </div>
      </div>
    </div>
  );
}
