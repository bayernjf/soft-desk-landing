import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://soft-desk-landing.pages.dev';

// https://astro.build/config
// Cloudflare adapter will be added in Phase 5 when demo app SSR pages are introduced.
export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/app/') &&
        !page.endsWith('/404'),
      serialize: (item) => {
        const url = item.url;
        const links = [];
        if (url.includes('/zh/')) {
          // Chinese page: en equivalent lives at root (strip /zh/ prefix)
          const enUrl = url.replace('/zh/', '/');
          links.push(
            { hreflang: 'zh-CN', url },
            { hreflang: 'en', url: enUrl },
            { hreflang: 'x-default', url: enUrl }
          );
        } else {
          // English page at root: zh equivalent lives at /zh/
          const zhUrl = url.replace(`${SITE_URL}/`, `${SITE_URL}/zh/`);
          links.push(
            { hreflang: 'zh-CN', url: zhUrl },
            { hreflang: 'en', url },
            { hreflang: 'x-default', url }
          );
        }
        return { ...item, links };
      },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
