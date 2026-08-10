# SoftDesk (Web)

SoftDesk 的纯网页版本，基于 Astro 7 + React 19 构建，仅面向浏览器端运行。

> **命名说明**：本仓库原名 `soft-desk`，因主名 `soft-desk` 已让位给 Electron 桌面版，故更名为 `soft-desk-web`，以 `-web` 后缀明确区分「网页版 / 桌面版」。桌面版见 [soft-desk](https://github.com/bayernjf/soft-desk)。

---

## 项目简介

SoftDesk 落地页是 AI 驱动的桌面软件管理效率工具官方网站，包含：

- **中英双语营销落地页**（SSG 静态预渲染，SEO 优化）
- **在线演示 App**（React 岛屿，展示核心功能交互）

## 技术栈

| 技术 | 说明 |
|------|------|
| Astro 7 | 框架，SSG 预渲染 + React 岛屿 |
| React 19 | 演示 App 交互组件 |
| Tailwind CSS v4 | 样式方案 |
| TypeScript | 类型安全 |
| @astrojs/sitemap | Sitemap 自动生成 |
| astro-icon + Lucide | 图标方案 |
| zustand | 演示 App 状态管理 |
| GA4 + Clarity | 隐私合规分析（Consent Mode v2） |

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env.local

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 类型检查 + 构建
npm run build

# 预览构建产物
npm run preview

# ESLint
npm run lint
```

## 环境变量

所有 `.env*` 文件均被 `.gitignore` 忽略，仅 `.env.example` 可提交。

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 衡量 ID | 生产环境 |
| `PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity 项目 ID | 生产环境 |

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 英文首页（根路径） |
| `/features/[slug]` | FeaturePage | 英文特性页 |
| `/privacy` | PrivacyPage | 英文隐私政策 |
| `/download` | DownloadPage | 英文下载页 |
| `/terms` | TermsPage | 英文服务条款 |
| `/zh/` | HomePage | 中文首页 |
| `/zh/features/[slug]` | FeaturePage | 中文特性页 |
| `/zh/privacy` | PrivacyPage | 中文隐私政策 |
| `/zh/download` | DownloadPage | 中文下载页 |
| `/zh/terms` | TermsPage | 中文服务条款 |
| `/app/dashboard` | Dashboard | 演示 App 仪表盘 |
| `/app/*` | ... | 其他演示页面 |

## 提交前验证

```bash
npm run check && npm run build
```

以上命令必须全部成功。

## 部署

- **平台**：Cloudflare Pages（Git 集成）
- **Build command**：`npm run build`
- **Build output**：`dist`
- **Node version**：22
- `main` 分支 → 生产域名
- `dev` 分支 → 预览域名
- PR → 自动 preview URL

## 相关仓库

- 桌面版（Electron）：[bayernjf/soft-desk](https://github.com/bayernjf/soft-desk)
