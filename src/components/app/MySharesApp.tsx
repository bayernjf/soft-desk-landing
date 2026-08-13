import { cn } from '@/lib/utils';

interface ShareRecord {
  id: keyof SharesStrings['shareTitles'];
  type: 'workflow' | 'favorites';
  itemCount: number;
  createdAt: string;
  views: number;
  status: 'active' | 'expired';
}

const MOCK_SHARES: ShareRecord[] = [
  {
    id: 'share-001',
    type: 'workflow',
    itemCount: 3,
    createdAt: '2026-06-15',
    views: 12,
    status: 'active',
  },
  {
    id: 'share-002',
    type: 'favorites',
    itemCount: 5,
    createdAt: '2026-06-10',
    views: 28,
    status: 'active',
  },
  {
    id: 'share-003',
    type: 'workflow',
    itemCount: 2,
    createdAt: '2026-05-28',
    views: 5,
    status: 'expired',
  },
];

export interface SharesStrings {
  pageTitle: string;
  pageSubtitle: string;
  typeWorkflow: string;
  typeFavorites: string;
  expiredBadge: string;
  itemCountLabel: string;
  viewCountLabel: string;
  copyLinkTooltip: string;
  deleteShareTooltip: string;
  emptyTitle: string;
  emptyHint: string;
  shareTitles: {
    'share-001': string;
    'share-002': string;
    'share-003': string;
  };
}

interface MySharesAppProps {
  strings: SharesStrings;
}

export default function MySharesApp({ strings }: MySharesAppProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-gradient-to-br from-brand/20 to-accent-500/20">
          <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{strings.pageTitle}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{strings.pageSubtitle}</p>
        </div>
      </div>

      {/* Share list */}
      {MOCK_SHARES.length > 0 ? (
        <div className="space-y-3">
          {MOCK_SHARES.map((share) => (
            <div
              key={share.id}
              className={cn(
                'group rounded-2xl border p-5 transition-all duration-300',
                share.status === 'active'
                  ? 'border-slate-800/60 bg-slate-900/40 hover:border-slate-700/80'
                  : 'border-slate-800/30 bg-slate-900/20 opacity-60',
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl',
                      share.type === 'workflow'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-amber-500/10 text-amber-400',
                    )}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {share.type === 'workflow' ? (
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      ) : (
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{strings.shareTitles[share.id]}</h3>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px]',
                          share.type === 'workflow'
                            ? 'bg-brand/10 text-brand'
                            : 'bg-amber-500/10 text-amber-400',
                        )}
                      >
                        {share.type === 'workflow' ? strings.typeWorkflow : strings.typeFavorites}
                      </span>
                      {share.status === 'expired' && (
                        <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-400">
                          {strings.expiredBadge}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {strings.itemCountLabel.replace('{n}', String(share.itemCount))}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {share.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {strings.viewCountLabel.replace('{n}', String(share.views))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg bg-slate-800/60 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    title={strings.copyLinkTooltip}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <button
                    className="rounded-lg bg-slate-800/60 p-2 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                    title={strings.deleteShareTooltip}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-20">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/60">
            <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">{strings.emptyTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{strings.emptyHint}</p>
        </div>
      )}
    </div>
  );
}