import type { Language } from './ui';
import type { AIClassifySectionStrings } from '@/components/AIClassifySection';
import type { FavoritesSectionStrings } from '@/components/FavoritesSection';
import type { RadialMenuSectionStrings } from '@/components/RadialMenuSection';
import type { SearchSectionStrings } from '@/components/SearchSection';
import type { StatisticsSectionStrings } from '@/components/StatisticsSection';
import type { WorkflowSectionStrings } from '@/components/WorkflowSection';

export interface HomeStrings {
  radial: RadialMenuSectionStrings;
  aiClassify: AIClassifySectionStrings;
  search: SearchSectionStrings;
  workflow: WorkflowSectionStrings;
  favorites: FavoritesSectionStrings;
  statistics: StatisticsSectionStrings;
}

export const homeStrings: Record<Language, HomeStrings> = {
  en: {
    radial: {
      badge: 'Instant access',
      title: 'Radial menu: one middle click away',
      subtitle:
        'No window switching, no digging through menus. Press the middle mouse button and every app and workflow is right there.',
      features: [
        { title: 'Scroll between pages', desc: 'Flick the wheel up or down to glide between page one and page two' },
        { title: 'Recently used', desc: 'Sorted by last use, so your go-to apps are always within reach' },
        { title: 'Favorites', desc: 'Favorited apps and workflows pinned to the top — zero hunting' },
        { title: 'Workflows', desc: 'Launch a whole set of apps at once and drop straight into work' },
      ],
      tryButton: 'Try the radial menu',
      tryHint: 'Or middle-click anywhere on the page',
      pageOne: 'Page 1',
      pageTwo: 'Page 2',
      scrollHint: 'Scroll to switch pages ↕',
      escHint: 'ESC',
    },
    aiClassify: {
      badge: 'Core feature',
      title: 'AI sorts your software automatically',
      subtitle:
        'Apps are grouped by what they actually do, so you never build folders by hand again. Install as many as you like without the mess.',
      analyzing: 'AI is analyzing what each app does...',
      appCount: '{n} apps',
      demoButton: 'Demo the AI classification',
      classifyingButton: 'Classifying {n}%',
    },
    search: {
      badge: 'Natural language search',
      title: 'Find software by describing it',
      subtitle:
        'Type things like "screenshot", "retouch photos" or "make a spreadsheet" — the AI reads the intent and pinpoints the right app.',
      inputPlaceholder: 'Describe what you need, e.g. "screenshot tool", "photo editing"...',
      searching: 'AI is interpreting your query...',
      matchCount: 'Found {n} matching apps',
      emptyResult: 'No matching software found',
      predefinedQueries: [
        { text: 'screenshot', reason: 'Matched screenshot and pinning tools', category: 'utilities' },
        { text: 'retouch photos', reason: 'Recognized design software, a good fit for image editing', category: 'design' },
        { text: 'make a spreadsheet', reason: 'Found productivity apps that handle spreadsheets', category: 'productivity' },
        { text: 'write code', reason: 'Located developer tools suited to a coding setup', category: 'dev-tools' },
      ],
    },
    workflow: {
      lang: 'en',
      badge: 'Smart workflows',
      title: 'Launch your whole setup at once',
      subtitle:
        'App combinations are suggested from your habits, so you can start IDE + terminal + browser in a single click.',
      launchButton: 'Launch',
      usageCount: '{n} uses',
    },
    favorites: {
      lang: 'en',
      badge: 'Favorites',
      title: 'Quick access to your go-to tools',
      subtitle:
        'Favorited apps and workflows stay pinned to the top — one click to launch, zero hunting.',
      favoriteSoftwareLabel: 'Favorite apps ({n})',
      favoriteWorkflowsLabel: 'Favorite workflows ({n})',
      launchCount: '{n} launches',
      usageCount: '{n} uses',
      launchButton: 'Launch',
    },
    statistics: {
      badge: 'Usage statistics',
      title: 'Data-driven efficiency insights',
      subtitle:
        'Track launches, time spent and active hours for every app to build a picture of how you actually work.',
      totalTimeLabel: 'Total time this week',
      totalSummary: '{apps} apps · {launches} launches',
      topAppsLabel: 'Top 5 most used',
      categoryShareLabel: 'Usage by category',
      categoryCount: '{n} apps',
    },
  },
  zh: {
    radial: {
      badge: '快捷交互',
      title: '径向菜单：鼠标中键即启',
      subtitle: '不用切换窗口、不用翻找菜单。按下鼠标中键，软件、工作流全部呈现在眼前。',
      features: [
        { title: '多页滚轮切换', desc: '滚轮上下滑动，在第一页和第二页间流畅切换' },
        { title: '最近使用', desc: '按最近使用时间排序，高频软件触手可得' },
        { title: '收藏夹', desc: '收藏的软件和工作流置顶，零查找成本' },
        { title: '工作流', desc: '一键启动软件组合，快速进入工作状态' },
      ],
      tryButton: '点击体验径向菜单',
      tryHint: '或在页面任意位置点击鼠标中键唤起',
      pageOne: '第一页',
      pageTwo: '第二页',
      scrollHint: '滚动滚轮切换页面 ↕',
      escHint: 'ESC',
    },
    aiClassify: {
      badge: 'MVP 核心功能',
      title: 'AI 自动识别与分类',
      subtitle: '基于软件功能语义理解自动归类，告别手动建文件夹。装再多软件也不会乱。',
      analyzing: 'AI 正在分析软件用途...',
      appCount: '{n} 个',
      demoButton: '演示 AI 分类过程',
      classifyingButton: '正在分类 {n}%',
    },
    search: {
      badge: '自然语言搜索',
      title: '用描述找到软件',
      subtitle: '输入“截屏”“修图”“做表格”等描述性语言，AI 理解语义后精准定位。',
      inputPlaceholder: '输入描述来搜索软件，如「截屏工具」「修图」...',
      searching: 'AI 正在理解语义...',
      matchCount: '找到 {n} 个匹配软件',
      emptyResult: '未找到匹配的软件',
      predefinedQueries: [
        { text: '截屏', reason: '匹配到截图与贴图工具', category: 'utilities' },
        { text: '修图', reason: '识别到设计类软件，适合图片编辑', category: 'design' },
        { text: '做表格', reason: '找到办公效率类软件，支持表格处理', category: 'productivity' },
        { text: '写代码', reason: '定位到开发工具类，适合编程环境', category: 'dev-tools' },
      ],
    },
    workflow: {
      lang: 'zh',
      badge: '智能工作流编排',
      title: '一键启动你的工作组合',
      subtitle: '根据使用习惯自动推荐软件组合，一键启动 IDE + 终端 + 浏览器等场景套件。',
      launchButton: '启动',
      usageCount: '{n} 次使用',
    },
    favorites: {
      lang: 'zh',
      badge: '收藏夹',
      title: '快捷访问你的高频工具',
      subtitle: '收藏的软件和工作流置顶显示，一键启动，零查找成本。',
      favoriteSoftwareLabel: '收藏软件 ({n})',
      favoriteWorkflowsLabel: '收藏工作流 ({n})',
      launchCount: '{n} 次启动',
      usageCount: '{n} 次使用',
      launchButton: '启动',
    },
    statistics: {
      badge: '使用时长统计',
      title: '数据驱动的效率洞察',
      subtitle: '追踪每款软件的启动次数、使用时长、活跃时段，生成你的个人软件使用画像。',
      totalTimeLabel: '本周使用总时长',
      totalSummary: '共 {apps} 个软件，{launches} 次启动',
      topAppsLabel: '高频软件 TOP 5',
      categoryShareLabel: '分类使用占比',
      categoryCount: '{n} 个',
    },
  },
};
