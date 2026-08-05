import { useState, useMemo } from 'react';
import type { Software } from '@/data/types';
import { CATEGORIES } from '@/data/software';
import { track } from '@/lib/analytics';

function useClassifyProgress(software: Software[]) {
  const [progress, setProgress] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifiedCount, setClassifiedCount] = useState(0);

  const startClassify = () => {
    track('ai_classify_demo_click');
    setIsClassifying(true);
    setProgress(0);
    setClassifiedCount(0);
    const total = software.length;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setProgress(Math.round((current / total) * 100));
      setClassifiedCount(current);
      if (current >= total) {
        clearInterval(timer);
        setTimeout(() => setIsClassifying(false), 1000);
      }
    }, 150);
  };

  return { progress, isClassifying, classifiedCount, startClassify };
}

export default function AIClassifySection({ software }: { software: Software[] }) {
  const { progress, isClassifying, classifiedCount, startClassify } = useClassifyProgress(software);

  const categoryGroups = useMemo(() => {
    return CATEGORIES.filter((cat) => software.some((s) => s.category === cat.id)).map((cat) => ({
      ...cat,
      apps: software.filter((s) => s.category === cat.id).slice(0, 3),
    }));
  }, [software]);

  return (
    <section id="ai-classify" className="px-4 py-24 sm:px-6" data-analytics-section="ai">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v1h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-1H7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1V6a4 4 0 0 1 4-4z" />
            </svg>
            MVP 核心功能
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI 自动识别与分类
          </h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            基于软件功能语义理解自动归类，告别手动建文件夹。装再多软件也不会乱。
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 transition-all duration-500 sm:p-8">
          {isClassifying && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-pulse text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a4 4 0 0 1 4 4v1h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-1H7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1V6a4 4 0 0 1 4-4z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-200">AI 正在分析软件用途...</span>
                </div>
                <span className="text-xs tabular-nums text-slate-500">
                  {classifiedCount} / {software.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-brand to-pink-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-slate-800/60 bg-slate-800/30 p-5 transition-all duration-300"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-sm font-semibold text-slate-200">{group.name}</span>
                  <span className="ml-auto text-xs tabular-nums text-slate-500">
                    {group.apps.length} 个
                  </span>
                </div>
                <div className="space-y-2">
                  {group.apps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-2.5 rounded-lg bg-slate-900/40 p-2.5"
                    >
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: app.color + '20', color: app.color }}
                      >
                        {app.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-slate-200">{app.name}</div>
                      </div>
                      <svg className="h-3.5 w-3.5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-1H7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1V6a4 4 0 0 1 4-4z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startClassify}
              disabled={isClassifying}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white transition-all hover:bg-brand-dark disabled:bg-brand/50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-1H7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1V6a4 4 0 0 1 4-4z" />
              </svg>
              {isClassifying ? `正在分类 ${progress}%` : '演示 AI 分类过程'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
