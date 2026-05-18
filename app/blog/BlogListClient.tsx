'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search, X } from 'lucide-react';

interface PostSummary {
  kind?: 'mongo' | 'markdown';
  slug: string;
  mongoId?: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  readingTime: number;
  featured: boolean;
  image?: string;
}

interface BlogListClientProps {
  posts: PostSummary[];
  categories: string[];
}

export function BlogCardMedia({
  image,
  title,
  category = 'Insight',
  label = 'Insight brief',
}: {
  image?: string;
  title: string;
  category?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = image?.trim();

  if (src && !failed) {
    return (
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin/CMS URLs can be same-origin or remote. */}
        <img
          src={src}
          alt={`${title} cover image`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
        <span className="absolute left-3 top-3 inline-flex rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0] shadow-sm backdrop-blur-sm">
          {(category || 'Insight').slice(0, 18)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#070b09]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(34,197,94,0.18),transparent_42%),radial-gradient(ellipse_at_85%_75%,rgba(20,217,196,0.14),transparent_40%),linear-gradient(135deg,#101010,#07110d_48%,#050505)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#22C55E]/20" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full border border-[#14d9c4]/15" />
      <div className="relative z-[1] flex h-full w-full flex-col justify-between p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A7F3D0] backdrop-blur-sm">
            {(category || 'Insight').slice(0, 18)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25">
            VCS
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#22C55E]/70">
            {label}
          </p>
          <div className="mt-3 h-px w-20 bg-gradient-to-r from-[#22C55E]/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-lg bg-[rgba(34,197,94,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F5F5F5] placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-[#22C55E] text-white'
                : 'bg-[rgba(34,197,94,0.04)] text-white/60 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(34,197,94,0.2)] hover:text-white/70'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-[rgba(34,197,94,0.04)] text-white/60 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(34,197,94,0.2)] hover:text-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(activeCategory !== 'All' || searchQuery) && (
        <p className="text-sm text-white/40 mb-6">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const formattedDate =
              post.date && !Number.isNaN(Date.parse(post.date))
                ? new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '—';

            const href = post.mongoId ? `/insight/${post.mongoId}` : `/blog/${post.slug}`;
            const cardKey = post.mongoId ?? post.slug;

            return (
              <Link
                key={cardKey}
                href={href}
                className="glass-panel group flex h-full min-h-0 cursor-pointer flex-col overflow-hidden p-0 transition-all hover:border-[rgba(34,197,94,0.2)]"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#070b09]">
                  <BlogCardMedia
                    image={post.image}
                    title={post.title}
                    category={post.category}
                  />
                </div>
                <div className="flex min-h-0 flex-1 flex-col p-6">
                  <span className="mb-4 inline-flex items-center self-start rounded-full border border-[rgba(34,197,94,0.15)] bg-[rgba(34,197,94,0.08)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                    {post.category}
                  </span>

                  <h2 className="font-display mb-2 line-clamp-2 text-lg font-bold text-[#F5F5F5] transition-colors group-hover:text-[#22C55E]">
                    {post.title}
                  </h2>

                  <p className="mb-4 min-h-[4.5rem] flex-1 line-clamp-3 text-sm leading-relaxed text-white/60">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <p className="text-white/60 text-lg mb-2">No articles found.</p>
          <p className="text-white/40 text-sm">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </>
  );
}
