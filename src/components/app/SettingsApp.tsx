import { useState, type SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

// ── Inline SVG icons ─────────────────────────────────────────────────────────
const icons = {
  Monitor: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Bell: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Database: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Shield: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Pencil: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
    </svg>
  ),
  Trash2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ShieldAlert: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

type IconKey = keyof typeof icons;

type TabId = 'appearance' | 'notifications' | 'data' | 'privacy' | 'ai';

const tabs: { id: TabId; icon: IconKey }[] = [
  { id: 'appearance', icon: 'Monitor' },
  { id: 'notifications', icon: 'Bell' },
  { id: 'data', icon: 'Database' },
  { id: 'privacy', icon: 'Shield' },
  { id: 'ai', icon: 'Sparkles' },
];

// ── Strings ───────────────────────────────────────────────────────────────────

export interface SettingsTabsStrings {
  appearance: string;
  notifications: string;
  data: string;
  privacy: string;
  ai: string;
}

export interface SettingsAppearanceStrings {
  title: string;
  subtitle: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  startMinimized: string;
  startMinimizedDesc: string;
  minimizeToTray: string;
  minimizeToTrayDesc: string;
}

export interface SettingsNotificationsStrings {
  title: string;
  subtitle: string;
  launchNotifications: string;
  launchNotificationsDesc: string;
  weeklyReport: string;
  weeklyReportDesc: string;
}

export interface SettingsDataStrings {
  title: string;
  subtitle: string;
  scanOnStartup: string;
  scanOnStartupDesc: string;
  autoUpdates: string;
  autoUpdatesDesc: string;
  localStorageLabel: string;
  openStorageLocation: string;
}

export interface SettingsPrivacyStrings {
  title: string;
  subtitle: string;
  anonymizeData: string;
  anonymizeDataDesc: string;
  sendAnalytics: string;
  sendAnalyticsDesc: string;
}

export interface SettingsAiModelsStrings {
  title: string;
  subtitle: string;
  addModel: string;
  privacyNoticeBefore: string;
  privacyNoticeHighlight: string;
  privacyNoticeAfter: string;
  emptyState: string;
  statusActive: string;
  statusInactive: string;
  modelLabel: string;
  modelUnset: string;
  apiKeyLabel: string;
  apiKeyUnset: string;
  endpointLabel: string;
  disable: string;
  enable: string;
  edit: string;
  delete: string;
  confirmTitle: string;
  /** Uses `{n}` as a placeholder for the provider config name. */
  confirmBody: string;
  cancel: string;
  confirmDelete: string;
}

export interface SettingsAiStrings {
  title: string;
  subtitle: string;
  smartGrouping: string;
  smartGroupingDesc: string;
  workflowSuggestions: string;
  workflowSuggestionsDesc: string;
  models: SettingsAiModelsStrings;
}

export interface SettingsStrings {
  title: string;
  subtitle: string;
  tabs: SettingsTabsStrings;
  appearance: SettingsAppearanceStrings;
  notifications: SettingsNotificationsStrings;
  data: SettingsDataStrings;
  privacy: SettingsPrivacyStrings;
  ai: SettingsAiStrings;
}

interface ToggleProps {
  checked: boolean;
  onChange: (_v: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-800/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-200">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5',
          checked ? 'bg-brand' : 'bg-gray-700',
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all',
            checked ? 'left-6' : 'left-1',
          )}
        />
      </button>
    </div>
  );
}

// ── AI Models Section ─────────────────────────────────────────────────────────

interface AiProviderConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiKeyHint: string;
  endpoint: string;
  isActive: boolean;
}

const providerLabel = (provider: string) => {
  const labels: Record<string, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    gemini: 'Gemini',
    custom: 'Custom',
  };
  return labels[provider] || provider.toUpperCase();
};

const initialProviders: AiProviderConfig[] = [
  {
    id: '1',
    name: 'siliconflow',
    provider: 'custom',
    model: 'deepseek-ai/DeepSeek-V3.2',
    apiKeyHint: '******sszq',
    endpoint: 'https://api.siliconflow.cn',
    isActive: true,
  },
];

function AiModelsSection({ strings }: { strings: SettingsAiModelsStrings }) {
  const [providers, setProviders] = useState<AiProviderConfig[]>(initialProviders);
  const [confirmDelete, setConfirmDelete] = useState<AiProviderConfig | null>(null);

  const toggleProvider = (id: string) => {
    setProviders((p) =>
      p.map((m) => {
        if (m.id === id) {
          track('ai_model_toggle', { provider: m.provider, enabled: !m.isActive });
          return { ...m, isActive: !m.isActive };
        }
        return m;
      }),
    );
  };

  const deleteProvider = (id: string) => {
    const provider = providers.find((m) => m.id === id);
    if (provider) {
      track('ai_model_delete', { provider: provider.provider });
    }
    setProviders((p) => p.filter((m) => m.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">{strings.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{strings.subtitle}</p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 text-xs font-medium hover:bg-violet-500/25 transition-colors"
        >
          <icons.Plus className="w-3.5 h-3.5" />
          {strings.addModel}
        </button>
      </div>

      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-3">
        <icons.ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <p className="text-[11px] leading-relaxed text-amber-200/80">
          {strings.privacyNoticeBefore}
          <span className="font-semibold text-amber-200">
            {strings.privacyNoticeHighlight}
          </span>
          {strings.privacyNoticeAfter}
        </p>
      </div>

      {providers.length === 0 ? (
        <div className="p-6 rounded-2xl bg-gray-900/40 border border-dashed border-gray-800 text-center">
          <icons.Sparkles className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 leading-relaxed">
            {strings.emptyState}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {providers.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between p-4 rounded-2xl bg-gray-900/40 border border-gray-800/60"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-100 truncate">{m.name}</h4>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      {providerLabel(m.provider)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider shrink-0',
                      m.isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-800 text-gray-500',
                    )}
                  >
                    {m.isActive ? strings.statusActive : strings.statusInactive}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-800/80 space-y-2">
                  <div className="flex justify-between gap-3 text-[11px]">
                    <span className="text-gray-500">{strings.modelLabel}</span>
                    <span className="font-medium text-gray-300 text-right truncate">{m.model || strings.modelUnset}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[11px]">
                    <span className="text-gray-500">{strings.apiKeyLabel}</span>
                    <span className="font-mono text-gray-400">{m.apiKeyHint || strings.apiKeyUnset}</span>
                  </div>
                  {m.endpoint && (
                    <div className="flex justify-between gap-3 text-[11px]">
                      <span className="text-gray-500">{strings.endpointLabel}</span>
                      <span className="font-mono text-gray-400 text-right break-all">{m.endpoint}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => toggleProvider(m.id)}
                  className={cn(
                    'w-full py-2 rounded-xl text-xs font-semibold transition-colors',
                    m.isActive
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-violet-500/15 text-violet-300 hover:bg-violet-500/25',
                  )}
                >
                  {m.isActive ? strings.disable : strings.enable}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition-colors"
                  >
                    <icons.Pencil className="w-3.5 h-3.5" />
                    {strings.edit}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(m)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-colors"
                  >
                    <icons.Trash2 className="w-3.5 h-3.5" />
                    {strings.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl shadow-slate-950/50 p-6"
          >
            <h3 className="text-base font-semibold text-white">{strings.confirmTitle}</h3>
            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
              {strings.confirmBody.replace('{n}', confirmDelete.name)}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition-colors"
              >
                {strings.cancel}
              </button>
              <button
                onClick={() => {
                  deleteProvider(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
              >
                {strings.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings App ──────────────────────────────────────────────────────────────

export default function SettingsApp({ strings }: { strings: SettingsStrings }) {
  const [activeTab, setActiveTab] = useState<TabId>('appearance');
  const [theme, setTheme] = useState('dark');
  const [prefs, setPrefs] = useState({
    startMinimized: false,
    minimizeToTray: true,
    autoUpdates: true,
    launchNotifications: true,
    weeklyReport: true,
    smartGrouping: true,
    aiSuggestions: true,
    sendAnalytics: false,
    anonymizeData: true,
    scanOnStartup: true,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((p) => {
      const newVal = !p[key];
      track('settings_change', { setting_key: key, setting_value: String(newVal) });
      if (key === 'smartGrouping' || key === 'aiSuggestions') {
        track('ai_toggle', { feature: key, enabled: newVal });
      }
      return { ...p, [key]: newVal };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{strings.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{strings.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = icons[tab.icon];
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  track('settings_open', { active_tab: tab.id });
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all',
                  activeTab === tab.id
                    ? 'bg-brand/15 text-brand border border-brand/30'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent',
                )}
              >
                <Icon className="w-4 h-4" />
                {strings.tabs[tab.id]}
              </button>
            );
          })}
        </nav>

        <main className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60">
          {activeTab === 'appearance' && (
            <div className="space-y-1 max-w-lg">
              <h2 className="text-base font-semibold text-gray-100 mb-1">{strings.appearance.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{strings.appearance.subtitle}</p>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{strings.appearance.themeLabel}</div>
                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-800/40 rounded-xl w-fit">
                  {[
                    { id: 'light', label: strings.appearance.themeLight },
                    { id: 'dark', label: strings.appearance.themeDark },
                    { id: 'system', label: strings.appearance.themeSystem },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-xs font-medium transition-all',
                        theme === t.id ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-0 border-t border-gray-800/80">
                <Toggle
                  checked={prefs.startMinimized}
                  onChange={() => togglePref('startMinimized')}
                  label={strings.appearance.startMinimized}
                  description={strings.appearance.startMinimizedDesc}
                />
                <Toggle
                  checked={prefs.minimizeToTray}
                  onChange={() => togglePref('minimizeToTray')}
                  label={strings.appearance.minimizeToTray}
                  description={strings.appearance.minimizeToTrayDesc}
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-0 max-w-lg border-t border-gray-800/80">
              <h2 className="text-base font-semibold text-gray-100 mb-1 pt-0">{strings.notifications.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{strings.notifications.subtitle}</p>
              <Toggle
                checked={prefs.launchNotifications}
                onChange={() => togglePref('launchNotifications')}
                label={strings.notifications.launchNotifications}
                description={strings.notifications.launchNotificationsDesc}
              />
              <Toggle
                checked={prefs.weeklyReport}
                onChange={() => togglePref('weeklyReport')}
                label={strings.notifications.weeklyReport}
                description={strings.notifications.weeklyReportDesc}
              />
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-0 max-w-lg border-t border-gray-800/80">
              <h2 className="text-base font-semibold text-gray-100 mb-1 pt-0">{strings.data.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{strings.data.subtitle}</p>
              <Toggle
                checked={prefs.scanOnStartup}
                onChange={() => togglePref('scanOnStartup')}
                label={strings.data.scanOnStartup}
                description={strings.data.scanOnStartupDesc}
              />
              <Toggle
                checked={prefs.autoUpdates}
                onChange={() => togglePref('autoUpdates')}
                label={strings.data.autoUpdates}
                description={strings.data.autoUpdatesDesc}
              />
              <div className="p-4 rounded-xl bg-gray-800/40 mt-4">
                <div className="text-xs font-semibold text-gray-300 mb-1">{strings.data.localStorageLabel}</div>
                <div className="text-xs text-gray-500 font-mono">~/Library/Application Support/SoftDesk</div>
                <button className="mt-3 px-3 py-1.5 rounded-lg bg-gray-700/70 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors">
                  {strings.data.openStorageLocation}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-0 max-w-lg border-t border-gray-800/80">
              <h2 className="text-base font-semibold text-gray-100 mb-1 pt-0">{strings.privacy.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{strings.privacy.subtitle}</p>
              <Toggle
                checked={prefs.anonymizeData}
                onChange={() => togglePref('anonymizeData')}
                label={strings.privacy.anonymizeData}
                description={strings.privacy.anonymizeDataDesc}
              />
              <Toggle
                checked={prefs.sendAnalytics}
                onChange={() => togglePref('sendAnalytics')}
                label={strings.privacy.sendAnalytics}
                description={strings.privacy.sendAnalyticsDesc}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-0 max-w-2xl border-t border-gray-800/80">
              <h2 className="text-base font-semibold text-gray-100 mb-1 pt-0">{strings.ai.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{strings.ai.subtitle}</p>
              <div className="max-w-lg">
                <Toggle
                  checked={prefs.smartGrouping}
                  onChange={() => togglePref('smartGrouping')}
                  label={strings.ai.smartGrouping}
                  description={strings.ai.smartGroupingDesc}
                />
                <Toggle
                  checked={prefs.aiSuggestions}
                  onChange={() => togglePref('aiSuggestions')}
                  label={strings.ai.workflowSuggestions}
                  description={strings.ai.workflowSuggestionsDesc}
                />
              </div>
              <AiModelsSection strings={strings.ai.models} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
