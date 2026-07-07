import { Share2, Clock, Link2, Copy, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareRecord {
  id: string;
  title: string;
  type: 'workflow' | 'favorites';
  itemCount: number;
  createdAt: string;
  views: number;
  status: 'active' | 'expired';
}

const MOCK_SHARES: ShareRecord[] = [
  {
    id: 'share-001',
    title: '晨间开发模式',
    type: 'workflow',
    itemCount: 3,
    createdAt: '2026-06-15',
    views: 12,
    status: 'active',
  },
  {
    id: 'share-002',
    title: '设计工具合集',
    type: 'favorites',
    itemCount: 5,
    createdAt: '2026-06-10',
    views: 28,
    status: 'active',
  },
  {
    id: 'share-003',
    title: '修图工作流',
    type: 'workflow',
    itemCount: 2,
    createdAt: '2026-05-28',
    views: 5,
    status: 'expired',
  },
];

export function MyShares() {
  return (
    <div className="space-y-8">
      {/* 页头 */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">我的分享</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              管理你分享出去的工作流和收藏夹合集
            </p>
          </div>
        </div>
      </div>

      {/* 分享列表 */}
      {MOCK_SHARES.length > 0 ? (
        <div className="space-y-3">
          {MOCK_SHARES.map((share) => (
            <div
              key={share.id}
              className={cn(
                'p-5 rounded-2xl border transition-all duration-300 group',
                share.status === 'active'
                  ? 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80'
                  : 'bg-slate-900/20 border-slate-800/30 opacity-60'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center',
                      share.type === 'workflow'
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'bg-amber-500/10 text-amber-400'
                    )}
                  >
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{share.title}</h3>
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded',
                          share.type === 'workflow'
                            ? 'bg-primary-500/10 text-primary-400'
                            : 'bg-amber-500/10 text-amber-400'
                        )}
                      >
                        {share.type === 'workflow' ? '工作流' : '收藏夹'}
                      </span>
                      {share.status === 'expired' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">
                          已过期
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        {share.itemCount} 项
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {share.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {share.views} 次查看
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    title="复制链接"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                    title="删除分享"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-800">
          <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center mb-3">
            <Share2 className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">还没有分享记录</p>
          <p className="text-xs text-slate-600 mt-1">在收藏夹或工作流页面可以生成分享链接</p>
        </div>
      )}
    </div>
  );
}