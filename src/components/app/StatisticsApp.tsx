import { useMemo, useState, useEffect, useRef } from 'react';
import type { CategoryMeta, Software, Stats } from '@/data/types';
import { formatMinutes } from '@/lib/utils';

export interface StatisticsStrings {
  lang: 'en' | 'zh';
  pageTitle: string;
  pageSubtitle: string;
  statTotalUsageLabel: string;
  statAvgPerAppLabel: string;
  statTotalLaunchesLabel: string;
  hoursValue: string;
  minutesValue: string;
  softwareCountSub: string;
  launchesSub: string;
  dailyChartTitle: string;
  dailyChartSubtitle: string;
  categoryChartTitle: string;
  categoryChartSubtitle: string;
  donutTotalLabel: string;
  leaderboardTitle: string;
  leaderboardSubtitle: string;
}

interface StatisticsAppProps {
  software: Software[];
  stats: Stats;
  categories: CategoryMeta[];
  strings: StatisticsStrings;
}

export default function StatisticsApp({ software, stats, categories, strings }: StatisticsAppProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categoryData = useMemo(() => {
    return categories.map((cat) => {
      const items = software.filter((s) => s.category === cat.id);
      return {
        name: cat.name,
        value: items.reduce((sum, s) => sum + s.usageMinutes, 0),
        count: items.length,
        color: cat.color,
      };
    }).filter((d) => d.count > 0);
  }, [software, categories]);

  const topApps = useMemo(
    () => [...software].sort((a, b) => b.usageMinutes - a.usageMinutes).slice(0, 8),
    [software],
  );

  const totalUsage = software.reduce((sum, s) => sum + s.usageMinutes, 0);
  const avgPerApp = software.length > 0 ? Math.round(totalUsage / software.length) : 0;
  const totalLaunches = software.reduce((s, a) => s + a.launchCount, 0);

  // Bar chart data
  const weeklyData = stats.weeklyTrend;
  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);
  const BAR_W = 32;
  const CHART_W = 280;
  const CHART_H = 200;
  const CHART_PAD_TOP = 10;
  const CHART_PAD_BOTTOM = 28;
  const barAreaH = CHART_H - CHART_PAD_TOP - CHART_PAD_BOTTOM;
  const slot = CHART_W / weeklyData.length;

  // Donut chart data
  const totalCategoryValue = categoryData.reduce((sum, d) => sum + d.value, 0) || 1;
  const DONUT_R = 80;
  const CIRC = 2 * Math.PI * DONUT_R;
  let cumulativeOffset = 0;
  const donutSlices = categoryData.map((d) => {
    const fraction = d.value / totalCategoryValue;
    const dashLen = fraction * CIRC;
    const slice = {
      ...d,
      dashLen,
      dashGap: CIRC - dashLen,
      offset: -cumulativeOffset,
    };
    cumulativeOffset += dashLen;
    return slice;
  });

  return (
    <div ref={sectionRef} className="space-y-8">
      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes donutDraw {
          from { stroke-dashoffset: var(--target-offset); opacity: 0; }
          to { stroke-dashoffset: var(--final-offset); opacity: 1; }
        }
        @keyframes barFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{strings.pageTitle}</h1>
        <p className="text-sm text-gray-500 mt-1">{strings.pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: strings.statTotalUsageLabel,
            value: strings.hoursValue.replace('{n}', String(Math.round(totalUsage / 60))),
            sub: strings.softwareCountSub.replace('{n}', String(software.length)),
          },
          {
            label: strings.statAvgPerAppLabel,
            value: strings.hoursValue.replace('{n}', String(Math.round(avgPerApp / 60))),
            sub: strings.minutesValue.replace('{n}', String(avgPerApp % 60)),
          },
          {
            label: strings.statTotalLaunchesLabel,
            value: `${totalLaunches}`,
            sub: strings.launchesSub,
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60"
            style={{
              animation: visible ? `barFadeIn 0.5s ease-out ${i * 100}ms both` : 'none',
              opacity: visible ? 1 : 0,
            }}
          >
            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <section className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60">
          <h2 className="text-sm font-semibold text-gray-200 mb-1">{strings.dailyChartTitle}</h2>
          <p className="text-xs text-gray-500 mb-4">{strings.dailyChartSubtitle}</p>
          <div className="h-64 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="xMidYMid meet">
              {weeklyData.map((d, i) => {
                const barH = (d.hours / maxHours) * barAreaH;
                const x = i * slot + (slot - BAR_W) / 2;
                const y = CHART_PAD_TOP + barAreaH - barH;
                return (
                  <g key={d.day}>
                    <rect
                      x={x}
                      y={y}
                      width={BAR_W}
                      height={barH}
                      rx={6}
                      fill="#7c3aed"
                      opacity={visible ? 0.85 : 0}
                      style={{
                        transformOrigin: `${x + BAR_W / 2}px ${CHART_PAD_TOP + barAreaH}px`,
                        transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                        transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms, opacity 0.3s ease-out ${i * 80}ms`,
                      }}
                    >
                      <title>{strings.hoursValue.replace('{n}', String(d.hours))}</title>
                    </rect>
                    <text
                      x={x + BAR_W / 2}
                      y={CHART_H - 10}
                      textAnchor="middle"
                      fontSize={12}
                      fill="#64748b"
                      opacity={visible ? 1 : 0}
                      style={{ transition: `opacity 0.3s ease-out ${i * 80 + 200}ms` }}
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Donut chart */}
        <section className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60">
          <h2 className="text-sm font-semibold text-gray-200 mb-1">{strings.categoryChartTitle}</h2>
          <p className="text-xs text-gray-500 mb-4">{strings.categoryChartSubtitle}</p>
          <div className="h-64 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
              <g transform="rotate(-90 100 100)">
                <circle cx="100" cy="100" r={DONUT_R} fill="none" stroke="#1e293b" strokeWidth="32" />
                {donutSlices.map((slice, i) => (
                  <circle
                    key={slice.name}
                    cx="100"
                    cy="100"
                    r={DONUT_R}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="32"
                    strokeDasharray={visible ? `${slice.dashLen} ${slice.dashGap}` : `0 ${CIRC}`}
                    strokeDashoffset={slice.offset}
                    style={{
                      transition: `stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms`,
                    }}
                  >
                    <title>{`${slice.name}: ${formatMinutes(slice.value, strings.lang)}`}</title>
                  </circle>
                ))}
              </g>
              <text
                x="100"
                y="95"
                textAnchor="middle"
                fontSize={11}
                fill="#64748b"
                opacity={visible ? 1 : 0}
                style={{ transition: `opacity 0.5s ease-out 0.6s` }}
              >
                {strings.donutTotalLabel}
              </text>
              <text
                x="100"
                y="112"
                textAnchor="middle"
                fontSize={14}
                fontWeight={600}
                fill="#e2e8f0"
                opacity={visible ? 1 : 0}
                style={{ transition: `opacity 0.5s ease-out 0.8s` }}
              >
                {Math.round(totalUsage / 60)}h
              </text>
            </svg>
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {categoryData.map((d, i) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-gray-400"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.3s ease-out ${i * 80 + 400}ms`,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Top apps leaderboard */}
      <section className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60">
        <h2 className="text-sm font-semibold text-gray-200 mb-1">{strings.leaderboardTitle}</h2>
        <p className="text-xs text-gray-500 mb-6">{strings.leaderboardSubtitle}</p>
        <div className="space-y-3">
          {topApps.map((sw, idx) => {
            const percent = topApps[0].usageMinutes > 0
              ? (sw.usageMinutes / topApps[0].usageMinutes) * 100
              : 0;
            return (
              <div
                key={sw.id}
                className="flex items-center gap-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                  transition: `all 0.4s ease-out ${idx * 60}ms`,
                }}
              >
                <div className="w-6 text-xs text-gray-600 tabular-nums">{String(idx + 1).padStart(2, '0')}</div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: sw.color + '25', color: sw.color }}
                >
                  {sw.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-200 truncate">{sw.name}</span>
                    <span className="text-xs text-gray-500 tabular-nums">{formatMinutes(sw.usageMinutes, strings.lang)}</span>
                  </div>
                  <div className="h-1 bg-gray-800/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: visible ? `${Math.max(5, percent)}%` : '0%',
                        backgroundColor: sw.color,
                        transition: `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 60 + 200}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}