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
        !page.endsWith('/404') &&
        page !== `${SITE_URL}/` &&
        page !== `${SITE_URL}`,
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
