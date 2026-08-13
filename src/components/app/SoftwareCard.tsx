import type { CategoryMeta, Software } from '@/data/types';
import { formatMinutes } from '@/lib/utils';
import { track } from '@/lib/analytics';

export interface SoftwareCardStrings {
  /** Language key passed to shared formatters (formatMinutes). */
  lang: 'en' | 'zh';
}

interface SoftwareCardProps {
  software: Software;
  categories: CategoryMeta[];
  strings: SoftwareCardStrings;
  index?: number;
  onLaunch?: (_id: string) => void;
}

export default function SoftwareCard({
  software,
  categories,
  strings,
  index = 0,
  onLaunch,
}: SoftwareCardProps) {
  const categoryMeta = categories.find((c) => c.id === software.category);

  const handleClick = () => {
    track('software_launch', {
      software_id: software.id,
      software_name: software.name,
      software_category: software.category,
    });
    onLaunch?.(software.id);
  };

  return (
    <button
      onClick={handleClick}
      className="group relative w-full rounded-2xl border border-slate-800/60 bg-slate-900/40 p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700/80 hover:bg-slate-800/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      style={{ animation: `fadeInUp 0.4s ease-out ${index * 50}ms both` }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: software.color + '25', color: software.color }}
        >
          {software.name.slice(0, 2)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-100" data-clarity-mask="true">
            {software.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500" data-clarity-mask="true">
            {software.description}
          </p>
          <div className="mt-1.5 flex items-center gap-2.5 text-xs text-slate-500">
            {categoryMeta && (
              <span>{categoryMeta.name}</span>
            )}
            <span className="text-slate-700">·</span>
            <span>{formatMinutes(software.usageMinutes, strings.lang)}</span>
          </div>
        </div>

        {/* Play icon */}
        <svg
          className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-brand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </button>
  );
}