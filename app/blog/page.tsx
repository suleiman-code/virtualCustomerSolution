import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

import { SiteShell } from '@/components/layout/SiteShell';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { BlogCardMedia, BlogListClient } from './BlogListClient';
import { getDb } from '@/lib/db';
import { plainTextFromAnyContent } from '@/lib/markdown-excerpt';
import { normalizePublicImageUrl } from '@/lib/public-image-url';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: 'Marketing, Virtual Work & Growth Blog | VCS' },
  description:
    'Practical tips on marketing, virtual teams, and growing your business. Written by our team based on what we actually do for clients.',
  alternates: {
    canonical: 'https://virtualcustomersolution.com/blog',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virtualcustomersolution.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://virtualcustomersolution.com/blog' },
  ],
};

export type MongoBlogCard = {
  kind: 'mongo';
  mongoId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  readingTime: number;
  featured: boolean;
  image: string;
};

async function getMongoBlogCards(): Promise<MongoBlogCard[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    const rows = await db.collection('blogs').find({}).sort({ isPinned: -1, date: -1 }).toArray();

    return rows.map((doc) => {
      const id = doc._id.toString();
      const content = String(doc.content ?? '');
      const plainContent = plainTextFromAnyContent(content, 220);
      const words = plainTextFromAnyContent(content, 4000).trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(words / 225));
      const excerptField = String(doc.excerpt ?? '').trim();
      const excerpt = plainTextFromAnyContent(excerptField || content, 220) || plainContent;

      const rawDate = doc.date;
      let dateStr = '';
      if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        dateStr = rawDate.toISOString().slice(0, 10);
      } else if (typeof rawDate === 'string' && !Number.isNaN(Date.parse(rawDate))) {
        dateStr = new Date(rawDate).toISOString().slice(0, 10);
      }

      return {
        kind: 'mongo' as const,
        mongoId: id,
        slug: id,
        title: String(doc.title ?? ''),
        excerpt,
        category: String(doc.category ?? 'General'),
        tags: [] as string[],
        date: dateStr,
        author: String(doc.authorName ?? ''),
        readingTime,
        featured: !!doc.isPinned,
        image: normalizePublicImageUrl(typeof doc.image === 'string' ? doc.image : ''),
      };
    });
  } catch (error) {
    console.error('[blog/page] Failed to load Mongo blogs:', error);
    return [];
  }
}

export default async function BlogPage() {
  const [mongoCards, posts] = await Promise.all([getMongoBlogCards(), Promise.resolve(getAllPosts())]);

  const serializedMarkdown = posts.map((post) => ({
    kind: 'markdown' as const,
    slug: post.slug,
    mongoId: undefined as string | undefined,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    date: post.date,
    author: post.author,
    readingTime: post.readingTime,
    featured: post.featured,
    image: '' as string,
  }));

  const combinedPosts = [...mongoCards, ...serializedMarkdown];

  const mdCategories = getAllCategories();
  const mongoCats = mongoCards.map((c) => c.category).filter(Boolean);
  const categories = Array.from(new Set([...mongoCats, ...mdCategories])).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  const featuredMongo = mongoCards.find((p) => p.featured) ?? mongoCards[0];
  const featuredMarkdown = posts.find((p) => p.featured) ?? posts[0];

  const showMongoFeatured = mongoCards.length > 0 && featuredMongo;
  const featuredPost = showMongoFeatured ? featuredMongo : null;
  const featuredMarkdownPost = !showMongoFeatured && featuredMarkdown ? featuredMarkdown : null;

  const featuredFileSlug = featuredMarkdownPost?.slug ?? null;

  const listPosts = combinedPosts.filter((p) => {
    // Admin-created Mongo blogs should always appear in the grid/list as well.
    if (p.kind === 'markdown' && featuredFileSlug && p.slug === featuredFileSlug) return false;
    return true;
  });

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pb-20 pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-display mb-4 text-4xl font-bold text-[#F5F5F5] md:text-5xl lg:text-6xl">
              Our Blog
            </h1>
            <p className="text-lg text-white/60">
              Insights, tips, and strategies to help your business grow. Written by our team of digital marketing and
              virtual workforce experts.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link
              href={`/insight/${featuredPost.mongoId}`}
              className="glass-panel group mb-12 block p-6 transition-all hover:border-[rgba(34,197,94,0.2)] md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <div className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.04)] bg-gradient-to-br from-[rgba(34,197,94,0.1)] to-[rgba(29,78,216,0.05)] md:h-auto md:w-80">
                  <BlogCardMedia
                    image={featuredPost.image}
                    title={featuredPost.title}
                    category={featuredPost.category}
                    label={featuredPost.featured ? 'Featured insight' : 'Insight brief'}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                      {featuredPost.featured ? 'Featured' : featuredPost.category}
                    </span>
                    <span className="text-sm text-white/40">
                      {featuredPost.date
                        ? new Date(featuredPost.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <h2 className="font-display mb-3 text-2xl font-bold text-[#F5F5F5] transition-colors group-hover:text-[#22C55E] md:text-3xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 leading-relaxed text-white/60">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readingTime} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#22C55E] transition-all group-hover:gap-2">
                      Read article <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {featuredMarkdownPost && (
            <Link
              href={`/blog/${featuredMarkdownPost.slug}`}
              className="glass-panel group mb-12 block p-6 transition-all hover:border-[rgba(34,197,94,0.2)] md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <div className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#070b09] md:h-auto md:w-80">
                  <BlogCardMedia
                    title={featuredMarkdownPost.title}
                    category={featuredMarkdownPost.category}
                    label={featuredMarkdownPost.featured ? 'Featured insight' : 'Insight brief'}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                      {featuredMarkdownPost.featured ? 'Featured' : featuredMarkdownPost.category}
                    </span>
                    <span className="text-sm text-white/40">
                      {new Date(featuredMarkdownPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="font-display mb-3 text-2xl font-bold text-[#F5F5F5] transition-colors group-hover:text-[#22C55E] md:text-3xl">
                    {featuredMarkdownPost.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 leading-relaxed text-white/60">{featuredMarkdownPost.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredMarkdownPost.readingTime} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#22C55E] transition-all group-hover:gap-2">
                      Read article <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <BlogListClient posts={listPosts} categories={categories} />

        </div>
      </div>
    </SiteShell>
  );
}
