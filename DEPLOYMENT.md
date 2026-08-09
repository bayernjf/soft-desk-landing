# SoftDesk 落地页部署指南

## 部署架构

- **平台**：Cloudflare Pages（Git 集成）
- **不再使用**：GitHub Actions 部署、Vercel
- **域名**：Cloudflare 默认 `.pages.dev` 域名

## Cloudflare Pages 配置

### 1. 连接仓库

1. 登录 Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. 选择 GitHub 仓库 `bayernjf/soft-desk-landing`
3. 分支配置：
   - Production branch: `main`
   - Preview branches: `dev` 及所有 PR 分支

### 2. 构建配置

| 配置项 | 值 |
|--------|-----|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 20 |

### 3. 环境变量

在 Pages → Settings → Environment variables 中配置：

| 变量名 | 说明 | 环境 |
|--------|------|------|
| `PUBLIC_GA_MEASUREMENT_ID` | GA4 衡量 ID | Production + Preview |
| `PUBLIC_CLARITY_PROJECT_ID` | Clarity 项目 ID | Production + Preview |

### 4. 分支映射

| 分支 | 部署目标 | URL |
|------|---------|-----|
| `main` | 生产 | `soft-desk-landing.pages.dev` |
| `dev` | 预览 | `dev.softdesk-landing.pages.dev` |
| PR | Preview | `pr-XX.soft-desk-landing.pages.dev` |

## CI

GitHub Actions（`.github/workflows/ci.yml`）在 PR 和 push 到 main/dev 时运行：
- ESLint
- Astro 类型检查（`astro check`）
- 构建（`astro build`）

部署完全由 Cloudflare Pages Git 集成处理，CI 仅做质量检查。

## 本地预览

```bash
npm run build
npm run preview    # 预览构建产物
```

## 故障排除

- 构建失败：检查 Node 版本是否为 20
- 样式缺失：确认 Tailwind v4 通过 @tailwindcss/vite 插件加载
- 页面 404：确认 Astro 路由文件命名正确
- 环境变量未生效：确认在 CF Dashboard 中配置了 `PUBLIC_` 前缀变量
