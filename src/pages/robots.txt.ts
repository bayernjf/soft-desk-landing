import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/seo';

const robots = `User-agent: *
Allow: /
Disallow: /app/

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

export const GET: APIRoute = () => {
  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
