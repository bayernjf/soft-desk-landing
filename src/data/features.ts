import type { Language } from '@/i18n/ui';

export interface FeatureContent {
  slug: string;
  icon: string;
  color: string;
  title: { zh: string; en: string };
  tagline: { zh: string; en: string };
  description: { zh: string; en: string };
  sections: Array<{
    heading: { zh: string; en: string };
    body: { zh: string; en: string };
  }>;
}

export const features: FeatureContent[] = [
  {
    slug: 'ai-classification',
    icon: 'AI',
    color: '#00d4aa',
    title: { zh: 'AI 智能分类', en: 'AI Smart Classification' },
    tagline: {
      zh: '让 AI 自动整理你的软件库',
      en: 'Let AI organize your software library automatically',
    },
    description: {
      zh: 'SoftDesk 通过你配置的 AI 模型自动识别并分类所有已安装软件。无需手动整理，AI 会根据软件名称、描述和用途将其归入最合适的类别。',
      en: 'SoftDesk uses your configured AI models to automatically identify and categorize all installed software. No manual sorting needed — AI assigns each app to the most appropriate category based on its name, description, and purpose.',
    },
    sections: [
      {
        heading: { zh: '工作原理', en: 'How It Works' },
        body: {
          zh: 'SoftDesk 扫描系统中已安装的软件，提取软件名称、版本、发布者等信息，然后通过你配置的 AI 模型（如 OpenAI GPT、Anthropic Claude 等）进行分类。分类结果存储在本地 SQLite 数据库中。',
          en: 'SoftDesk scans installed software, extracts name, version, publisher and other metadata, then classifies them through your configured AI models (e.g., OpenAI GPT, Anthropic Claude). Results are stored in a local SQLite database.',
        },
      },
      {
        heading: { zh: '支持的分类', en: 'Supported Categories' },
        body: {
          zh: '开发工具、设计创意、效率办公、通讯协作、浏览器、系统工具、影音娱乐、安全防护。你也可以自定义分类体系。',
          en: 'Development Tools, Design & Creative, Productivity, Communication, Browsers, System Utilities, Media & Entertainment, Security. You can also customize the category system.',
        },
      },
      {
        heading: { zh: '隐私保护', en: 'Privacy Protection' },
        body: {
          zh: 'AI 分类请求在本地发起，仅发送软件名称和描述到 AI 服务商进行分类判断。不发送个人数据、文件内容或其他敏感信息。分类完成后，数据不会被 AI 服务商存储。',
          en: 'AI classification requests are initiated locally, sending only software names and descriptions to the AI provider for categorization. No personal data, file contents, or other sensitive information is sent. Data is not stored by the AI provider after classification.',
        },
      },
    ],
  },
  {
    slug: 'radial-menu',
    icon: '◎',
    color: '#a371f7',
    title: { zh: '径向菜单启动', en: 'Radial Menu Launcher' },
    tagline: {
      zh: '鼠标中键，瞬间启动',
      en: 'Middle-click to launch instantly',
    },
    description: {
      zh: 'SoftDesk 的径向菜单是一个创新的快速启动器。在任何位置按下鼠标中键即可唤出一个圆形菜单，将常用软件放在指尖。支持翻页、拖拽排序和智能推荐。',
      en: 'SoftDesk\'s radial menu is an innovative quick launcher. Press the middle mouse button anywhere to summon a circular menu with your favorite apps at your fingertips. Supports paging, drag-to-reorder, and smart recommendations.',
    },
    sections: [
      {
        heading: { zh: '使用方式', en: 'Usage' },
        body: {
          zh: '在系统任何位置按下鼠标中键（或配置的快捷键），径向菜单会在鼠标当前位置弹出。将鼠标移动到对应扇区即可选中软件，点击启动。支持滚轮翻页查看更多软件。',
          en: 'Press the middle mouse button (or a configured shortcut) anywhere in the system, and the radial menu appears at the cursor position. Move the mouse to the corresponding sector to select an app, then click to launch. Scroll to page through more apps.',
        },
      },
      {
        heading: { zh: '自定义配置', en: 'Customization' },
        body: {
          zh: '拖拽软件到径向菜单的扇区进行排序。每个扇区可以放置一个软件或一个文件夹（包含多个软件）。支持最多 8 个扇区和无限翻页。',
          en: 'Drag apps into radial menu sectors to reorder. Each sector can hold one app or one folder (containing multiple apps). Supports up to 8 sectors with unlimited pages.',
        },
      },
      {
        heading: { zh: '系统权限', en: 'System Permissions' },
        body: {
          zh: 'macOS 需要授予辅助功能权限（Accessibility）以监听鼠标中键。Windows 无需额外权限。',
          en: 'macOS requires Accessibility permission to monitor middle-click. Windows requires no additional permissions.',
        },
      },
    ],
  },
  {
    slug: 'usage-tracking',
    icon: '⏱',
    color: '#58a6ff',
    title: { zh: '使用时长统计', en: 'Usage Time Tracking' },
    tagline: {
      zh: '了解你的时间都去哪了',
      en: 'Know where your time goes',
    },
    description: {
      zh: 'SoftDesk 精准追踪每个应用的使用时长、启动次数和活跃时段。通过可视化图表洞察你的使用习惯，发现效率瓶颈。',
      en: 'SoftDesk precisely tracks usage time, launch count, and active periods for each application. Visualize your usage patterns and discover productivity bottlenecks through charts.',
    },
    sections: [
      {
        heading: { zh: '追踪维度', en: 'Tracking Dimensions' },
        body: {
          zh: '总使用时长、今日使用时长、启动次数、最近使用时间、按分类统计、按日/周/月趋势分析。',
          en: 'Total usage time, daily usage time, launch count, last used time, category-based statistics, and daily/weekly/monthly trend analysis.',
        },
      },
      {
        heading: { zh: '数据存储', en: 'Data Storage' },
        body: {
          zh: '所有使用数据存储在本地 SQLite 数据库中，不上传任何服务器。你可以随时清除统计数据或导出数据。',
          en: 'All usage data is stored in a local SQLite database with no server uploads. You can clear statistics or export data at any time.',
        },
      },
      {
        heading: { zh: '可视化报表', en: 'Visual Reports' },
        body: {
          zh: '内置仪表盘提供柱状图、饼图、折线图等多种可视化方式。查看 Top 应用排行、分类分布和趋势变化。',
          en: 'The built-in dashboard provides bar charts, pie charts, line charts and more. View top app rankings, category distribution, and trend changes.',
        },
      },
    ],
  },
  {
    slug: 'cross-platform',
    icon: '⌘',
    color: '#d29922',
    title: { zh: '跨平台支持', en: 'Cross-Platform Support' },
    tagline: {
      zh: 'macOS 和 Windows，体验一致',
      en: 'macOS and Windows, consistent experience',
    },
    description: {
      zh: 'SoftDesk 同时支持 macOS（Intel 和 Apple Silicon）以及 Windows 10/11。跨平台使用相同的界面设计和功能集，通过云同步在不同设备间共享配置。',
      en: 'SoftDesk supports both macOS (Intel and Apple Silicon) and Windows 10/11. Enjoy the same interface design and feature set across platforms, with cloud sync to share configurations between devices.',
    },
    sections: [
      {
        heading: { zh: '系统要求', en: 'System Requirements' },
        body: {
          zh: 'macOS 11 (Big Sur) 或更高版本，支持 Intel 和 Apple Silicon (M1/M2/M3)。Windows 10 64 位或 Windows 11。',
          en: 'macOS 11 (Big Sur) or later, supporting Intel and Apple Silicon (M1/M2/M3). Windows 10 64-bit or Windows 11.',
        },
      },
      {
        heading: { zh: '软件扫描', en: 'Software Scanning' },
        body: {
          zh: 'macOS 扫描 /Applications 和 ~/Applications 目录。Windows 扫描注册表和常见安装路径。跨平台通过 bundleId 对齐软件身份。',
          en: 'macOS scans /Applications and ~/Applications directories. Windows scans the registry and common install paths. Cross-platform software identity is aligned via bundleId.',
        },
      },
      {
        heading: { zh: '云同步', en: 'Cloud Sync' },
        body: {
          zh: '可选启用 Supabase 云同步，在多台设备间同步软件库、收藏夹、工作流和配置。同步数据加密传输，不包含敏感信息。',
          en: 'Optionally enable Supabase cloud sync to synchronize software library, favorites, workflows, and configurations across multiple devices. Synced data is encrypted and contains no sensitive information.',
        },
      },
    ],
  },
];

export function getFeatureBySlug(slug: string): FeatureContent | undefined {
  return features.find((f) => f.slug === slug);
}
