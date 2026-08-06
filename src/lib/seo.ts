const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || 'https://soft-desk-landing.pages.dev').replace(/\/$/, '');

const GITHUB_REPO = 'https://github.com/bayernjf/soft-desk';
const GITHUB_RELEASES = `${GITHUB_REPO}/releases`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.png`;

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  lang: 'zh' | 'en';
  image?: string;
  noindex?: boolean;
}

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export function buildCanonicalUrl(path: string, lang: string): string {
  const base = `${SITE_URL}/${lang}`;
  if (path === '/') return withTrailingSlash(base);
  return withTrailingSlash(`${base}${path}`);
}

export function buildHreflangTags(path: string) {
  const zhUrl = buildCanonicalUrl(path, 'zh');
  const enUrl = buildCanonicalUrl(path, 'en');
  return [
    { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl },
    { rel: 'alternate', hreflang: 'en', href: enUrl },
    { rel: 'alternate', hreflang: 'x-default', href: zhUrl },
  ];
}

const organization = {
  '@type': 'Organization',
  name: 'SoftDesk',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [GITHUB_REPO],
};

/** Organization + WebSite structured data, safe for every page */
export function baseSchema(lang: 'zh' | 'en') {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SoftDesk',
      url: SITE_URL,
      inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
      publisher: organization,
    },
    {
      '@context': 'https://schema.org',
      ...organization,
    },
  ];
}

/** SoftwareApplication structured data for the homepage */
export function softwareApplicationSchema(lang: 'zh' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SoftDesk',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'macOS, Windows',
    description: lang === 'zh'
      ? 'AI 驱动的桌面软件管理效率工具，支持智能分类、径向菜单启动、使用时长统计和工作流自动化。'
      : 'AI-powered desktop software manager with smart classification, radial menu launcher, usage tracking, and workflow automation.',
    url: buildCanonicalUrl('/', lang),
    image: DEFAULT_OG_IMAGE,
    downloadUrl: GITHUB_RELEASES,
    softwareVersion: 'latest',
    author: organization,
    publisher: organization,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: lang === 'zh'
      ? ['AI 智能分类', '径向菜单快速启动', '使用时长统计', '工作流自动化', '跨平台支持']
      : ['AI Smart Classification', 'Radial Menu Quick Launch', 'Usage Time Tracking', 'Workflow Automation', 'Cross-Platform Support'],
  };
}

/** FAQPage structured data */
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList structured data */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>, lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path, lang),
    })),
  };
}

export { SITE_URL, GITHUB_REPO, GITHUB_RELEASES, DEFAULT_OG_IMAGE };
