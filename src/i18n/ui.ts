export const languages = {
  zh: '中文',
  en: 'English',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'zh';

export type UIKey =
  | 'nav.features'
  | 'nav.download'
  | 'nav.demo'
  | 'nav.privacy'
  | 'nav.github'
  | 'hero.badge'
  | 'hero.title'
  | 'hero.subtitle'
  | 'hero.cta_primary'
  | 'hero.cta_secondary'
  | 'hero.stat_apps'
  | 'hero.stat_platforms'
  | 'hero.stat_open_source'
  | 'features.title'
  | 'features.subtitle'
  | 'features.ai.title'
  | 'features.ai.desc'
  | 'features.radial.title'
  | 'features.radial.desc'
  | 'features.usage.title'
  | 'features.usage.desc'
  | 'features.cross_platform.title'
  | 'features.cross_platform.desc'
  | 'features.learn_more'
  | 'faq.title'
  | 'faq.subtitle'
  | 'faq.q1'
  | 'faq.a1'
  | 'faq.q2'
  | 'faq.a2'
  | 'faq.q3'
  | 'faq.a3'
  | 'faq.q4'
  | 'faq.a4'
  | 'faq.q5'
  | 'faq.a5'
  | 'cta.title'
  | 'cta.subtitle'
  | 'cta.download_mac'
  | 'cta.download_win'
  | 'cta.view_github'
  | 'footer.copyright'
  | 'footer.privacy'
  | 'footer.made_with'
  | 'cookie.text'
  | 'cookie.accept'
  | 'cookie.reject'
  | 'cookie.learn_more'
  | 'download.title'
  | 'download.subtitle'
  | 'download.mac'
  | 'download.win'
  | 'download.version'
  | 'download.latest_release'
  | 'download.loading'
  | 'download.fallback'
  | 'error.404.title'
  | 'error.404.desc'
  | 'error.404.back'
  | 'common.free'
  | 'common.open_source'
  | 'common.cross_platform';

type UIDict = Record<UIKey, string>;

export const ui: Record<Language, UIDict> = {
  zh: {
    'nav.features': '功能特性',
    'nav.download': '下载',
    'nav.demo': '在线演示',
    'nav.privacy': '隐私政策',
    'nav.github': 'GitHub',
    'hero.badge': '开源 · 免费 · 跨平台',
    'hero.title': 'AI 驱动的桌面软件管理效率工具',
    'hero.subtitle': '智能分类、径向菜单启动、使用时长统计、一键工作流——让每一次启动都快如闪电',
    'hero.cta_primary': '免费下载',
    'hero.cta_secondary': '在线体验',
    'hero.stat_apps': '支持应用',
    'hero.stat_platforms': '桌面平台',
    'hero.stat_open_source': '开源协议',
    'features.title': '为什么选择 SoftDesk',
    'features.subtitle': '四大核心能力，重新定义桌面软件管理',
    'features.ai.title': 'AI 智能分类',
    'features.ai.desc': '自动识别并分类所有已安装软件，无需手动整理',
    'features.radial.title': '径向菜单启动',
    'features.radial.desc': '鼠标中键唤出径向菜单，快速启动常用软件',
    'features.usage.title': '使用时长统计',
    'features.usage.desc': '精准追踪每个应用的使用时长，洞察效率瓶颈',
    'features.cross_platform.title': '跨平台支持',
    'features.cross_platform.desc': '同时支持 macOS 与 Windows，体验一致',
    'features.learn_more': '了解更多',
    'faq.title': '常见问题',
    'faq.subtitle': '关于 SoftDesk 你可能想知道的',
    'faq.q1': 'SoftDesk 是什么？',
    'faq.a1': 'SoftDesk 是一款 AI 驱动的桌面软件管理工具，支持 macOS 和 Windows。它提供智能分类、径向菜单快速启动、使用时长统计和工作流自动化等功能，帮助你更高效地管理桌面应用。',
    'faq.q2': 'SoftDesk 如何工作？',
    'faq.a2': 'SoftDesk 扫描系统中已安装的软件，通过 AI 自动分类。你可以通过鼠标中键唤出径向菜单快速启动应用，查看使用时长统计，创建工作流一键启动多个应用。',
    'faq.q3': 'SoftDesk 支持哪些平台？',
    'faq.a3': 'SoftDesk 支持 macOS（Intel 和 Apple Silicon）以及 Windows 10/11。',
    'faq.q4': 'SoftDesk 如何保护隐私？',
    'faq.a4': 'SoftDesk 完全在本地运行，软件数据存储在本地 SQLite 数据库中，不上传任何个人数据。云同步功能可选，使用 Supabase 加密传输。',
    'faq.q5': 'SoftDesk 是免费的吗？',
    'faq.a5': '是的，SoftDesk 是开源软件，完全免费使用。源代码托管在 GitHub 上，采用开源协议发布。',
    'cta.title': '立刻开始高效管理你的桌面',
    'cta.subtitle': '免费下载，开源透明，持续更新',
    'cta.download_mac': '下载 macOS 版',
    'cta.download_win': '下载 Windows 版',
    'cta.view_github': '在 GitHub 查看',
    'footer.copyright': 'SoftDesk. 保留所有权利。',
    'footer.privacy': '隐私政策',
    'footer.made_with': '使用 Astro 构建',
    'cookie.text': '本网站使用 Cookie 进行分析以改善体验。继续浏览即表示你同意使用 Cookie。',
    'cookie.accept': '接受',
    'cookie.reject': '拒绝',
    'cookie.learn_more': '了解更多',
    'download.title': '下载 SoftDesk',
    'download.subtitle': '选择适合你平台的版本，免费开始使用',
    'download.mac': 'macOS 版本',
    'download.win': 'Windows 版本',
    'download.version': '版本',
    'download.latest_release': '最新发布',
    'download.loading': '正在获取最新版本信息…',
    'download.fallback': '前往 GitHub Releases 页面',
    'error.404.title': '页面未找到',
    'error.404.desc': '你访问的页面不存在或已被移动。',
    'error.404.back': '返回首页',
    'common.free': '免费',
    'common.open_source': '开源',
    'common.cross_platform': '跨平台',
  },
  en: {
    'nav.features': 'Features',
    'nav.download': 'Download',
    'nav.demo': 'Live Demo',
    'nav.privacy': 'Privacy',
    'nav.github': 'GitHub',
    'hero.badge': 'Open Source · Free · Cross-Platform',
    'hero.title': 'AI-Powered Desktop Software Manager',
    'hero.subtitle': 'Smart classification, radial menu launcher, usage tracking, one-click workflows — launch at lightning speed',
    'hero.cta_primary': 'Download Free',
    'hero.cta_secondary': 'Try Live Demo',
    'hero.stat_apps': 'Supported Apps',
    'hero.stat_platforms': 'Desktop Platforms',
    'hero.stat_open_source': 'Open Source',
    'features.title': 'Why SoftDesk',
    'features.subtitle': 'Four core capabilities that redefine desktop software management',
    'features.ai.title': 'AI Smart Classification',
    'features.ai.desc': 'Automatically identify and categorize all installed software — no manual sorting needed',
    'features.radial.title': 'Radial Menu Launcher',
    'features.radial.desc': 'Middle-click to summon the radial menu and launch apps instantly',
    'features.usage.title': 'Usage Time Tracking',
    'features.usage.desc': 'Track usage time per app to uncover productivity bottlenecks',
    'features.cross_platform.title': 'Cross-Platform',
    'features.cross_platform.desc': 'Available on both macOS and Windows with a consistent experience',
    'features.learn_more': 'Learn more',
    'faq.title': 'FAQ',
    'faq.subtitle': 'Things you might want to know about SoftDesk',
    'faq.q1': 'What is SoftDesk?',
    'faq.a1': 'SoftDesk is an AI-powered desktop software manager for macOS and Windows. It offers smart classification, radial menu quick-launch, usage time tracking, and workflow automation to help you manage desktop apps more efficiently.',
    'faq.q2': 'How does SoftDesk work?',
    'faq.a2': 'SoftDesk scans installed software and uses AI to auto-classify them. You can summon a radial menu via middle-click for quick launches, view usage statistics, and create workflows to start multiple apps at once.',
    'faq.q3': 'Which platforms does SoftDesk support?',
    'faq.a3': 'SoftDesk supports macOS (Intel and Apple Silicon) and Windows 10/11.',
    'faq.q4': 'How does SoftDesk protect my privacy?',
    'faq.a4': 'SoftDesk runs entirely locally. Software data is stored in a local SQLite database and no personal data is uploaded. Cloud sync is optional and uses Supabase encrypted transport.',
    'faq.q5': 'Is SoftDesk free?',
    'faq.a5': 'Yes, SoftDesk is open-source software and completely free to use. The source code is hosted on GitHub under an open-source license.',
    'cta.title': 'Start Managing Your Desktop Efficiently',
    'cta.subtitle': 'Free to download, open and transparent, continuously updated',
    'cta.download_mac': 'Download for macOS',
    'cta.download_win': 'Download for Windows',
    'cta.view_github': 'View on GitHub',
    'footer.copyright': 'SoftDesk. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.made_with': 'Built with Astro',
    'cookie.text': 'This website uses cookies for analytics to improve your experience. By continuing to browse, you agree to the use of cookies.',
    'cookie.accept': 'Accept',
    'cookie.reject': 'Reject',
    'cookie.learn_more': 'Learn more',
    'download.title': 'Download SoftDesk',
    'download.subtitle': 'Choose the version for your platform and get started for free',
    'download.mac': 'macOS Version',
    'download.win': 'Windows Version',
    'download.version': 'Version',
    'download.latest_release': 'Latest release',
    'download.loading': 'Fetching latest release info…',
    'download.fallback': 'Go to GitHub Releases',
    'error.404.title': 'Page Not Found',
    'error.404.desc': 'The page you are looking for does not exist or has been moved.',
    'error.404.back': 'Back to home',
    'common.free': 'Free',
    'common.open_source': 'Open Source',
    'common.cross_platform': 'Cross-Platform',
  },
};
