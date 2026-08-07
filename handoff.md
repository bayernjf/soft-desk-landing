# Handoff — soft-desk-landing

更新时间：2026-08-08

## 项目概况
SoftDesk（Electron 桌面软件管理工具）落地页，改动最多的仓库。Astro 7 静态站点，
中英双语，部署于 Cloudflare Pages（站点：https://soft-desk-landing.pages.dev）。
通过页头/页脚链接回 hub 站 bayjf.com，不与其他落地页直接互链。

## 已完成（本地未推送，分支 dev，共 14 个提交）
- `f58d125` build(deps): add testing, lighthouse and OG tooling
- `5a4e552` test: add vitest setup and unit tests
- `45f68cb` chore(ci): run Lighthouse CI on pull requests
- `19c1914` chore(lint): expand eslint flat config
- `d4cc985` feat(seo): add robots.txt
- `26cccec` feat(seo): add bilingual OG images and generator
- `595dea7` feat(legal): add terms of service page
- `7719e9c` refactor(ui): extract Logo component and link terms page
- `5a95475` feat(download): show toast when release fetch fails
- `454eae1` refactor(analytics): unify consent handling
- `91bc37f` refactor(i18n): localize relative time labels
- `b0600f3` refactor(ui): polish home, feature page and demo apps
- `fdc143c` docs: update README
- `c38eeca` docs: update analytics tracking plan

## 注意点
- public/og/ 下功能页的 OG 图为 SVG（ai-classification、cross-platform、radial-menu、usage-tracking 中英版），社交平台不支持 SVG og:image；默认图 default.png 是 PNG 可用。
- 含 vitest 单测与 Lighthouse CI，提交前跑 `npm test` 与 `npm run build`。
- 所有提交仅在本地，尚未 push。

## 下一步
1. 将功能页 SVG OG 图替换为 PNG（可用仓库内 OG generator 工具生成）。
2. `git push`（dev 分支，推送前可先 `git pull --rebase`）。
3. 部署后验证 robots.txt、sitemap、下载按钮 toast 与分析埋点。
