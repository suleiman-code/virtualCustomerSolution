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
                className="glass-panel group flex h-full min-h-0 flex-col overflow-hidden p-0 transition-all hover:border-[rgba(34,197,94,0.2)]"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/[0.04]">
                  {post.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#14532d]/25 to-[#052e16]/50">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]/50">
                        Article
                      </span>
                    </div>
                  )}
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
