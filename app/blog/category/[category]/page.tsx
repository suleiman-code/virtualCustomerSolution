import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

import { SiteShell } from '@/components/layout/SiteShell';
import { getAllCategories, getPostsByCategory, getAllPosts } from '@/lib/blog';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'digital-marketing':
    'Strategies, tips, and insights to grow your online presence and maximize ROI from digital marketing campaigns.',
  'virtual-workforce':
    'Best practices for building, managing, and scaling remote teams that deliver results.',
  'remote-work':
    'Tips and strategies for building, managing, and scaling remote teams from our 8+ years of experience.',
  'business-growth':
    'Proven strategies and frameworks to scale your business efficiently while reducing overhead.',
  'seo':
    'Search engine optimization techniques and strategies to improve your rankings and drive organic traffic.',
  'cost-saving':
    'Smart approaches to reduce business costs without sacrificing quality or output.',
  'technology':
    'Tech insights, tool reviews, and automation strategies to help growing businesses work smarter and scale faster.',
  'industry-insights':
    'Data and analysis from our work across e-commerce, SaaS, healthcare, and fintech industries.',
  'case-studies':
    'Real results from our client work — revenue growth, cost savings, and team scaling stories.',
};

function categorySlugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const name = categorySlugToName(category);

  return {
    title: `${name} Articles | Blog`,
    description:
      CATEGORY_DESCRIPTIONS[category] ||
      `Browse our latest articles about ${name.toLowerCase()}.`,
    alternates: {
      canonical: `https://virtualcustomersolution.com/blog/category/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryName = categorySlugToName(category);

  // Try matching by slug conversion and by direct name
  const allPosts = getAllPosts();
  const posts = allPosts.filter(
    (post) =>
      post.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() ||
      post.category.toLowerCase() === category.toLowerCase()
  );

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: categoryName, href: `/blog/category/${category}` },
  ];

  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-[#22C55E] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-[#22C55E]" />
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {categoryName}
              </h1>
            </div>
            <p className="text-lg text-white/60">
              {CATEGORY_DESCRIPTIONS[category] ||
                `Explore our latest articles about ${categoryName.toLowerCase()}.`}
            </p>
            <p className="mt-2 text-sm text-white/40">
              {posts.length} article{posts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const formattedDate = new Date(post.date).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                );

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="glass-panel p-6 group hover:border-[rgba(34,197,94,0.2)] transition-all flex flex-col"
                  >
                    {/* Category badge */}
                    <span className="inline-flex self-start items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.08)] text-[#22C55E] border border-[rgba(34,197,94,0.15)] mb-4">
                      {post.category}
                    </span>

                    <h2 className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#22C55E] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center">
              <p className="text-white/60 text-lg">
                No articles found in this category yet.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 mt-4 text-[#22C55E] hover:text-[#4ADE80] transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse all articles
              </Link>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
