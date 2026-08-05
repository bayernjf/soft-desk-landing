import { mockStats, mockSoftware } from '@/data/software';

export default function DashboardApp() {
  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-[#161b22] p-4">
          <div className="text-2xl font-bold text-white">{mockStats.totalApps}</div>
          <div className="mt-1 text-xs text-gray-500">已安装应用</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#161b22] p-4">
          <div className="text-2xl font-bold text-white">{formatMinutes(mockStats.todayUsageTime)}</div>
          <div className="mt-1 text-xs text-gray-500">今日使用</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#161b22] p-4">
          <div className="text-2xl font-bold text-white">{formatMinutes(mockStats.totalUsageTime)}</div>
          <div className="mt-1 text-xs text-gray-500">累计使用</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#161b22] p-4">
          <div className="text-2xl font-bold text-brand">7</div>
          <div className="mt-1 text-xs text-gray-500">工作流</div>
        </div>
      </div>

      {/* Top apps */}
      <div className="rounded-xl border border-gray-800 bg-[#161b22] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">热门应用</h2>
        <div className="space-y-3">
          {mockStats.topApps.map((app, i) => (
            <div key={app.name} className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-sm font-bold text-gray-400">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{app.name}</span>
                  <span className="text-xs text-gray-500">{formatMinutes(app.usageTime)} · {app.percentage}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${app.percentage * 3}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent software */}
      <div className="rounded-xl border border-gray-800 bg-[#161b22] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">最近使用</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {mockSoftware.slice(0, 6).map((app) => (
            <div key={app.id} className="flex items-center gap-3 rounded-lg border border-gray-800 p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: app.color }}
              >
                {app.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm text-white">{app.name}</div>
                <div className="text-xs text-gray-500">{formatMinutes(app.usageMinutes)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
