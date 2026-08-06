import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://soft-desk-landing.pages.dev';

function swapLocale(url, from, to) {
  return url.replace(`/${from}/`, `/${to}/`);
}

// https://astro.build/config
// Cloudflare adapter will be added in Phase 5 when demo app SSR pages are introduced.
export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/app/') &&
        !page.endsWith('/404') &&
        page !== `${SITE_URL}/` &&
        page !== `${SITE_URL}`,
      serialize: (item) => {
        const url = item.url;
        const links = [];
        if (url.includes('/zh/')) {
          links.push(
            { hreflang: 'zh-CN', url },
            { hreflang: 'en', url: swapLocale(url, 'zh', 'en') },
            { hreflang: 'x-default', url }
          );
        } else if (url.includes('/en/')) {
          links.push(
            { hreflang: 'zh-CN', url: swapLocale(url, 'en', 'zh') },
            { hreflang: 'en', url },
            { hreflang: 'x-default', url: swapLocale(url, 'en', 'zh') }
          );
        }
        if (links.length > 0) {
          return { ...item, links };
        }
        return item;
      },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
