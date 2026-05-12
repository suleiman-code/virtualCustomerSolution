import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://virtualcustomersolution.com';

function getBlogSlugs(): string[] {
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (!fs.existsSync(blogDir)) return [];
    return fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map((f) => f.replace(/\.(mdx|md)$/, ''));
  } catch {
    return [];
  }
}

function getDataSlugs(modulePath: string, key: string): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(modulePath);
    const data = mod[key];
    if (Array.isArray(data)) return data.map((d: { slug: string }) => d.slug);
    return [];
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Home ──
  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
  ];

  // ── Service pages ──
  const servicePages = [
    '/services',
    '/performance-marketing',
    '/remote-workforce',
    '/systems-reporting',
  ].map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 }));

  // ── Blog ──
  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];

  const blogPosts = getBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog categories
  const blogCategories = [
    'digital-marketing', 'remote-work', 'business-growth',
    'technology', 'case-studies', 'industry-insights',
    'cost-saving', 'remote-workforce',
  ].map((cat) => ({
    url: `${SITE_URL}/blog/category/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // ── Case studies (from lib/case-studies.ts) ──
  const caseStudySlugs = getDataSlugs('@/lib/case-studies', 'caseStudies');
  const caseStudyPages = [
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...caseStudySlugs.map((slug) => ({
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  // ── Guides (from lib/guides.ts) ──
  const guideSlugs = getDataSlugs('@/lib/guides', 'guides');
  const guidePages = [
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...guideSlugs.map((slug) => ({
      url: `${SITE_URL}/guides/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // ── Comparisons (from lib/comparisons.ts) — route is /compare/ ──
  const compSlugs = getDataSlugs('@/lib/comparisons', 'comparisons');
  const comparisonPages = compSlugs.map((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Core pages ──
  const corePages = [
    '/about', '/contact', '/results',
  ].map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 }));

  // ── Research ──
  const researchPages = [
    '/research',
    '/research/remote-work-statistics',
    '/research/marketing-roi-benchmarks',
    '/research/business-automation-trends',
  ].map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }));

  // ── Tools ──
  const toolPages = [
    '/tools',
    '/tools/roi-calculator',
    '/tools/remote-team-cost-calculator',
    '/tools/marketing-budget-planner',
  ].map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }));

  // ── Legal ──
  const legalPages = [
    '/privacy-policy', '/terms-of-service',
  ].map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 }));

  return [
    ...home,
    ...servicePages,
    ...blogIndex,
    ...blogPosts,
    ...blogCategories,
    ...caseStudyPages,
    ...guidePages,
    ...comparisonPages,
    ...corePages,
    ...researchPages,
    ...toolPages,
    ...legalPages,
  ];
}
