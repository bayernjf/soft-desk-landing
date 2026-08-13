import type { Software, CategoryMeta, Stats, Workflow, SoftwareCategory } from './types';
import type { Language } from '@/i18n/ui';

const CATEGORY_BASE: Array<Omit<CategoryMeta, 'name'>> = [
  { id: 'dev-tools', icon: 'Code2', color: '#00d4aa' },
  { id: 'design', icon: 'Palette', color: '#a371f7' },
  { id: 'productivity', icon: 'LayoutList', color: '#58a6ff' },
  { id: 'communication', icon: 'MessageSquare', color: '#d29922' },
  { id: 'browsers', icon: 'Globe', color: '#f85149' },
  { id: 'utilities', icon: 'Wrench', color: '#8b949e' },
  { id: 'media', icon: 'Image', color: '#ec4899' },
  { id: 'security', icon: 'ShieldCheck', color: '#10b981' },
];

const CATEGORY_NAMES: Record<Language, Record<SoftwareCategory, string>> = {
  en: {
    'dev-tools': 'Developer Tools',
    design: 'Design & Creative',
    productivity: 'Productivity',
    communication: 'Communication',
    browsers: 'Browsers',
    utilities: 'Utilities',
    media: 'Media',
    security: 'Security',
  },
  zh: {
    'dev-tools': '开发工具',
    design: '设计创意',
    productivity: '效率办公',
    communication: '通讯协作',
    browsers: '浏览器',
    utilities: '系统工具',
    media: '影音娱乐',
    security: '安全防护',
  },
};

export function getCategories(lang: Language): CategoryMeta[] {
  return CATEGORY_BASE.map((cat) => ({ ...cat, name: CATEGORY_NAMES[lang][cat.id] }));
}

const mk = (overrides: Partial<Software>): Software => ({
  id: 'x',
  name: 'App',
  description: '',
  icon: '',
  category: 'dev-tools',
  version: '1.0.0',
  publisher: '',
  size: 100,
  installDate: '',
  lastUsed: '',
  usageMinutes: 0,
  launchCount: 0,
  path: '',
  color: '#8b5cf6',
  tags: [],
  ...overrides,
});

const SOFTWARE_BASE: Software[] = [
  mk({ id: '1', name: 'Visual Studio Code', category: 'dev-tools', publisher: 'Microsoft', size: 358, usageMinutes: 89230, launchCount: 1247, color: '#2563eb' }),
  mk({ id: '2', name: 'Figma', category: 'design', publisher: 'Figma Inc.', size: 185, usageMinutes: 23410, launchCount: 523, color: '#a371f7' }),
  mk({ id: '3', name: 'Chrome', category: 'browsers', publisher: 'Google', size: 680, usageMinutes: 124560, launchCount: 2156, color: '#ef4444' }),
  mk({ id: '4', name: 'Slack', category: 'communication', publisher: 'Salesforce', size: 245, usageMinutes: 45620, launchCount: 1892, color: '#a855f7' }),
  mk({ id: '5', name: 'Notion', category: 'productivity', publisher: 'Notion Labs', size: 286, usageMinutes: 124500, launchCount: 789, color: '#8b949e' }),
  mk({ id: '6', name: 'Photoshop', category: 'design', publisher: 'Adobe', size: 2450, usageMinutes: 17890, launchCount: 234, color: '#f87171' }),
  mk({ id: '7', name: 'Safari', category: 'browsers', publisher: 'Apple', size: 180, usageMinutes: 34560, launchCount: 1234, color: '#0ea5e9' }),
  mk({ id: '8', name: 'Xcode', category: 'dev-tools', publisher: 'Apple', size: 8420, usageMinutes: 42310, launchCount: 567, color: '#3b82f6' }),
  mk({ id: '9', name: 'Snipaste', category: 'utilities', publisher: 'Snipaste', size: 45, usageMinutes: 8920, launchCount: 892, color: '#10b981' }),
  mk({ id: '10', name: 'CleanShot X', category: 'utilities', publisher: 'CleanShot', size: 58, usageMinutes: 3450, launchCount: 234, color: '#f59e0b' }),
];

interface SoftwareText {
  description: string;
  tags: string[];
}

const SOFTWARE_TEXT: Record<Language, Record<string, SoftwareText>> = {
  en: {
    '1': { description: 'Code editor', tags: ['Code', 'Development'] },
    '2': { description: 'Collaborative interface design tool', tags: ['Design'] },
    '3': { description: 'Web browser', tags: ['Browser'] },
    '4': { description: 'Team communication and collaboration', tags: ['Team'] },
    '5': { description: 'Knowledge base and collaborative workspace', tags: ['Notes'] },
    '6': { description: 'Professional image editing software', tags: ['Design', 'Image editing'] },
    '7': { description: 'Default system browser', tags: ['Browser'] },
    '8': { description: 'Apple developer tools', tags: ['Code', 'Development'] },
    '9': { description: 'Screenshot and pinning tool', tags: ['Screenshot', 'Capture', 'Pin'] },
    '10': { description: 'Screenshot and screen recording tool', tags: ['Screenshot', 'Recording', 'Capture'] },
  },
  zh: {
    '1': { description: '代码编辑器', tags: ['代码', '开发'] },
    '2': { description: '协作式界面设计工具', tags: ['设计'] },
    '3': { description: '网页浏览器', tags: ['浏览器'] },
    '4': { description: '团队沟通协作', tags: ['团队'] },
    '5': { description: '知识库与协作工作区', tags: ['笔记'] },
    '6': { description: '专业图像处理软件', tags: ['设计', '图像处理'] },
    '7': { description: '系统默认浏览器', tags: ['浏览器'] },
    '8': { description: '苹果开发工具', tags: ['代码', '开发'] },
    '9': { description: '截图与贴图工具', tags: ['截屏', '截图', '贴图'] },
    '10': { description: '截图与录屏工具', tags: ['截屏', '录屏', '截图'] },
  },
};

export function getMockSoftware(lang: Language): Software[] {
  return SOFTWARE_BASE.map((sw) => ({ ...sw, ...SOFTWARE_TEXT[lang][sw.id] }));
}

const STATS_BASE = {
  totalApps: 18,
  totalUsageTime: 5678900,
  todayUsageTime: 28456,
  topApps: [
    { name: 'VS Code', usageTime: 124560, percentage: 28.5 },
    { name: 'Chrome', usageTime: 98760, percentage: 22.6 },
    { name: 'Terminal', usageTime: 67890, percentage: 15.5 },
    { name: 'Slack', usageTime: 45670, percentage: 10.4 },
    { name: 'Figma', usageTime: 34560, percentage: 7.9 },
  ],
  categoryDistribution: [
    { count: 4, color: '#00d4aa' },
    { count: 2, color: '#a371f7' },
    { count: 3, color: '#58a6ff' },
    { count: 3, color: '#d29922' },
    { count: 3, color: '#8b949e' },
    { count: 2, color: '#f85149' },
    { count: 2, color: '#a371f7' },
  ],
  weeklyTrend: [8.5, 9.2, 7.8, 10.1, 6.5, 3.2, 2.8],
};

const STATS_TEXT: Record<Language, { distribution: string[]; days: string[] }> = {
  en: {
    distribution: ['Developer Tools', 'Design', 'Office Suites', 'Communication', 'Utilities', 'Browsers', 'Media'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  zh: {
    distribution: ['开发工具', '设计软件', '办公套件', '通讯应用', '系统工具', '浏览器', '影音娱乐'],
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
};

export function getMockStats(lang: Language): Stats {
  const text = STATS_TEXT[lang];
  return {
    totalApps: STATS_BASE.totalApps,
    totalUsageTime: STATS_BASE.totalUsageTime,
    todayUsageTime: STATS_BASE.todayUsageTime,
    topApps: STATS_BASE.topApps,
    categoryDistribution: STATS_BASE.categoryDistribution.map((slice, i) => ({
      ...slice,
      name: text.distribution[i],
    })),
    weeklyTrend: STATS_BASE.weeklyTrend.map((hours, i) => ({ day: text.days[i], hours })),
  };
}

const WORKFLOW_BASE: Array<Omit<Workflow, 'name' | 'description'>> = [
  { id: 'wf-1', color: '#00d4aa', softwareIds: ['1', '6', '3'], isFavorite: true, usageCount: 89, lastUsed: '' },
  { id: 'wf-2', color: '#a371f7', softwareIds: ['2', '4'], isFavorite: true, usageCount: 34, lastUsed: '' },
  { id: 'wf-3', color: '#58a6ff', softwareIds: ['5', '9'], isFavorite: false, usageCount: 56, lastUsed: '' },
  { id: 'wf-4', color: '#f87171', softwareIds: ['6', '2'], isFavorite: false, usageCount: 12, lastUsed: '' },
];

const WORKFLOW_HOURS_AGO = [2, 5, 24, 24 * 3];

const WORKFLOW_TEXT: Record<Language, Record<string, { name: string; description: string }>> = {
  en: {
    'wf-1': { name: 'Morning Dev Mode', description: 'Launch IDE + terminal + browser to start coding right away' },
    'wf-2': { name: 'Design Review', description: 'Open Figma + Slack, ready for the design discussion' },
    'wf-3': { name: 'Writing Docs', description: 'Notion + browser, focused on content creation' },
    'wf-4': { name: 'Photo Editing', description: 'Photoshop + Figma, image editing and export' },
  },
  zh: {
    'wf-1': { name: '晨间开发模式', description: '启动 IDE + 终端 + 浏览器，快速进入编码状态' },
    'wf-2': { name: '设计评审', description: '打开 Figma + Slack，准备设计讨论' },
    'wf-3': { name: '文档撰写', description: 'Notion + 浏览器，专注内容创作' },
    'wf-4': { name: '修图工作流', description: 'Photoshop + Figma，图像处理与导出' },
  },
};

export function getMockWorkflows(lang: Language): Workflow[] {
  const now = Date.now();
  return WORKFLOW_BASE.map((wf, i) => ({
    ...wf,
    ...WORKFLOW_TEXT[lang][wf.id],
    lastUsed: new Date(now - 1000 * 60 * 60 * WORKFLOW_HOURS_AGO[i]).toISOString(),
  }));
}
