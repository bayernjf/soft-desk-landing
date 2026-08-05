# AGENTS.md — SoftDesk 落地页项目指令

本文档供 AI coding agents（Trae / Claude Code / Cursor / Codex / Copilot 等）在本项目工作时自动读取。

---

## 项目概览

SoftDesk 落地页是 AI 驱动的桌面软件管理效率工具官方网站，包含营销落地页（中英双语）和在线演示 App。

- **包管理器**：npm（不要用 pnpm/yarn）
- **框架**：Astro 7 + TypeScript
- **渲染模式**：SSG（落地页静态预渲染）+ React 岛屿（演示 App）
- **样式**：Tailwind CSS v4（通过 @tailwindcss/vite 插件）
- **i18n**：中英双语，URL 前缀路由（/zh/、/en/）
- **SEO**：@astrojs/sitemap、结构化数据（JSON-LD）、llms.txt（GEO）
- **演示 App**：React 19 岛屿（client:load）
- **图标**：astro-icon + @iconify-json/lucide
- **Node 版本**：22（CI 固定使用 Node 22，Astro 7 要求 >= 22.12.0）

### 项目结构

```text
soft-desk-landing/
├── .github/workflows/ci.yml        # CI：lint、类型检查、构建
├── public/
│   ├── favicon.svg
│   ├── llms.txt                    # AI 引擎抓取入口（GEO）
│   └── og/                         # OG 图片
├── src/
│   ├── components/
│   │   ├── BaseHead.astro          # 统一 meta、hreflang、Consent Mode
│   │   ├── Header.astro / Footer.astro
│   │   ├── LanguageSwitcher.astro  # 中英切换
│   │   ├── CookieBanner.astro      # Cookie 授权
│   │   ├── Analytics.astro         # GA4 + Clarity + 滚动/曝光追踪
│   │   ├── DownloadButtons.astro   # GitHub Releases 下载
│   │   ├── FeatureSection.astro    # 特性卡片
│   │   ├── FAQ.astro               # 含 FAQPage Schema
│   │   ├── HomePage.astro          # 首页共享组件
│   │   ├── PrivacyPage.astro       # 隐私页共享组件
│   │   ├── DownloadPage.astro      # 下载页共享组件
│   │   ├── FeaturePage.astro       # 特性详情页共享组件
│   │   └── app/
│   │       └── DashboardApp.tsx    # 演示 App React 岛屿
│   ├── content/                    # Content Collections（预留）
│   ├── data/
│   │   ├── types.ts                # TypeScript 类型
│   │   ├── software.ts             # mock 数据
│   │   └── features.ts             # 特性页内容（中英双语）
│   ├── i18n/
│   │   ├── ui.ts                   # UI 字符串（中英双语）
│   │   ├── utils.ts                # i18n 工具函数
│   │   └── locales.ts              # 语言配置
│   ├── layouts/
│   │   ├── BaseLayout.astro        # 落地页布局
│   │   └── AppLayout.astro         # 演示 App 布局
│   ├── lib/
│   │   ├── analytics.ts            # GA4 + Clarity + Consent Mode v2
│   │   ├── download-urls.ts        # GitHub Releases 链接
│   │   ├── seo.ts                  # SEO 工具函数（Schema、hreflang）
│   │   └── utils.ts                # cn() 等工具函数
│   ├── pages/
│   │   ├── index.astro             # 根重定向到 /zh/
│   │   ├── 404.astro
│   │   ├── robots.txt.ts           # 动态 robots.txt
│   │   ├── zh/                     # 中文页面
│   │   │   ├── index.astro
│   │   │   ├── privacy.astro
│   │   │   ├── download.astro
│   │   │   └── features/[slug].astro
│   │   ├── en/                     # 英文页面
│   │   │   ├── index.astro
│   │   │   ├── privacy.astro
│   │   │   ├── download.astro
│   │   │   └── features/[slug].astro
│   │   └── app/                    # 演示 App（无 i18n）
│   │       ├── dashboard.astro
│   │       ├── library.astro
│   │       └── ...
│   └── styles/
│       └── global.css              # Tailwind v4 入口
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
└── AGENTS.md
```

### 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Redirect | 重定向到 `/zh/` |
| `/zh/` | HomePage | 中文首页 |
| `/zh/features/[slug]` | FeaturePage | 中文特性页 |
| `/zh/privacy` | PrivacyPage | 中文隐私政策 |
| `/zh/download` | DownloadPage | 中文下载页 |
| `/en/` | HomePage | 英文首页 |
| `/en/features/[slug]` | FeaturePage | 英文特性页 |
| `/en/privacy` | PrivacyPage | 英文隐私政策 |
| `/en/download` | DownloadPage | 英文下载页 |
| `/app/dashboard` | Dashboard | 演示 App 仪表盘 |
| `/app/library` | Library | 演示 App 软件库 |
| `/app/*` | ... | 其他演示页面 |
| `/404` | 404 | 404 页面 |

---

## 常用命令

```bash
cp .env.example .env.local         # 首次：填入 GA4 和 Clarity ID
npm install
npm run dev                        # 启动开发服务器（默认 http://localhost:4321）
npm run build                      # 类型检查 + 构建
npm run preview                    # 预览构建产物
npm run check                      # 类型检查（astro check）
npm run lint                       # ESLint
```

### 提交前验证

```bash
npm run check && npm run build
```

以上命令必须全部成功。

---

## 环境变量

- 所有 `.env*` 文件均被 `.gitignore` 忽略，仅 `.env.example` 可提交
- Astro 使用 `PUBLIC_` 前缀暴露变量到客户端
- 不得在代码、日志、提交信息或文档中写入真实 token、API Key

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 衡量 ID | 生产环境 |
| `PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity 项目 ID | 生产环境 |

---

## i18n 约定

- 默认语言：中文（`/zh/`）
- 所有 UI 字符串集中在 `src/i18n/ui.ts`
- 新增字符串时必须同时添加中英两个版本
- 使用 `useTranslations(lang)` 获取翻译函数
- 演示 App（`/app/*`）不区分语言，内容以中文为主

---

## SEO + GEO 约定

- 所有落地页 SSG 预渲染，确保完整 HTML 输出
- 每页包含 canonical、hreflang、OG、Twitter Card
- 结构化数据：SoftwareApplication（首页）、FAQPage（FAQ 区块）、BreadcrumbList（特性页）
- `public/llms.txt` 为 AI 引擎提供产品摘要和内容索引
- `robots.txt` 屏蔽 `/app/*`（演示页无 SEO 价值）

---

## 埋点与隐私

埋点方案详见 `docs/analytics-tracking-plan.md`。

### 核心文件

| 文件 | 用途 |
|------|------|
| `src/lib/analytics.ts` | Consent Mode v2、GA4/Clarity 加载与 track 函数 |
| `src/components/CookieBanner.astro` | Cookie 授权弹窗 |
| `src/components/Analytics.astro` | 滚动深度、Section 曝光、Page View 追踪 |
| `src/components/BaseHead.astro` | Consent Mode v2 默认拒绝（inline script） |

### 开发约定

- 事件名使用 `snake_case`
- 开发环境通过 `console.debug` 输出，不发送真实数据
- 生产环境只有在用户授予 `analytics_storage` 后才能加载 GA4 和 Clarity
- 环境变量前缀为 `PUBLIC_`（非 `VITE_`）

---

## 部署

### Cloudflare Pages（Git 集成）

- Framework preset: Astro
- Build command: `npm run build`
- Build output: `dist`
- Node version: 22
- 环境变量在 CF Dashboard 配置
- `main` 分支 → 生产域名
- `dev` 分支 → 预览域名
- PR → 自动 preview URL

不再使用 GitHub Actions 部署和 Vercel。

---

## Commit Message

遵循 `.trae/rules/git-commit-message.md`：

```text
<type>(<scope>): <imperative subject within 50 chars>

<short body explaining the purpose>
```

- Commit message 必须使用英文
- 每个 commit 只处理一个目的
- 不得把所有改动压缩为一个提交

---

## 不要做的事

- 不要用 pnpm/yarn，只用 npm
- 不要提交 `.env` 文件
- 不要直接在 main 或 dev 分支提交，使用 feature/ 或 refactor/ 分支
- 不要使用 `VITE_` 前缀的环境变量，Astro 用 `PUBLIC_`
- 不要在落地页中使用 React Router，用 Astro 原生路由
- 不要在前端代码里硬编码 API Key
- 不要创建假的占位图片文件
- 不要跳过 `git pull --rebase` 直接 push
