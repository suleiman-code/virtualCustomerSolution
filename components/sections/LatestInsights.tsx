'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Loader2, ArrowRight } from 'lucide-react';
import { RevealOnScroll, StaggerChildren, StaggerItem } from '@/components/animations/ScrollAnimations';
import { Button } from '@/components/ui/button';
import { plainTextFromAnyContent } from '@/lib/markdown-excerpt';
import { cn } from '@/lib/utils';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  authorName: string;
  image: string;
  isPinned: boolean;
  date: string;
}

function BlogVisualNoImage({ title, lede }: { title: string; lede: string }) {
  const cleanTitle = title?.trim() || 'Article';

  return (
    <div className="relative flex h-full min-h-[140px] w-full overflow-hidden sm:min-h-0">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#060606]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:repeating-linear-gradient(11deg,transparent,transparent_44px,rgba(255,255,255,0.018)_44px,rgba(255,255,255,0.018)_45px)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_100%_0%,rgba(34,197,94,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/12 via-white/[0.06] to-transparent" />

      <div className="relative z-[1] flex h-full w-full flex-col justify-end px-5 pb-6 pt-10 text-left sm:px-6 sm:pb-7 sm:pt-12">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-[#f2f2f2] line-clamp-2 sm:text-xl">
          {cleanTitle}
        </h3>
        {lede ? (
          <p className="mt-2.5 text-[13px] leading-relaxed text-white/45 line-clamp-2 sm:text-sm">{lede}</p>
        ) : null}
      </div>
    </div>
  );
}

function BlogCoverMedia({
  image,
  title,
  lede,
}: {
  image: string;
  title: string;
  lede: string;
}) {
  const [broken, setBroken] = useState(false);
  const url = image?.trim();
  if (url && !broken) {
    return (
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
      />
    );
  }
  return <BlogVisualNoImage title={title} lede={lede} />;
}

function cardExcerpt(blog: Blog): string {
  return plainTextFromAnyContent(blog.content || '', 190);
}

export function LatestInsights() {
  const [pinnedBlogs, setPinnedBlogs] = useState<Blog[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      try {
        const [pinnedRes, unpinnedRes] = await Promise.all([
          fetch('/api/blogs?pinned=true'),
          fetch('/api/blogs?skip=0&limit=3'),
        ]);

        const pinnedData = await pinnedRes.json();
        const unpinnedData = await unpinnedRes.json();

        setPinnedBlogs(Array.isArray(pinnedData) ? pinnedData : []);
        setBlogs(Array.isArray(unpinnedData.blogs) ? unpinnedData.blogs : []);
        setHasMore(unpinnedData.hasMore || false);
        setSkip(3);
      } catch (err) {
        console.error('Fetch blogs error:', err);
        setPinnedBlogs([]);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    void initFetch();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/blogs?skip=${skip}&limit=3`);
      const data = await res.json();
      if (Array.isArray(data.blogs)) {
        setBlogs((prev) => [...prev, ...data.blogs]);
      }
      setHasMore(data.hasMore || false);
      setSkip(skip + 3);
    } catch (err) {
      console.error('Load more blogs error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const allVisibleBlogs = [...pinnedBlogs, ...blogs];

  return (
    <section
      id="blogs"
      className="section-padding relative scroll-mt-[calc(var(--site-header-height)+0.75rem)] overflow-hidden border-t border-white/[0.06]"
    >
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#22C55E]/5 blur-[150px]" />

      <div className="container-wide relative z-10 max-w-full">
        <RevealOnScroll variant="fade-up" duration={0.8} className="mb-8 text-center sm:mb-10">
          <span className="neon-border neon-text glass mb-4 inline-block rounded-full border border-[rgba(34,197,94,0.3)] px-4 py-1.5 text-sm font-medium text-[#22C55E]">
            Insights
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#F5F5F5] md:text-5xl lg:text-6xl">
            Latest
            <br />
            <span className="text-gradient-lime">Insights</span>
          </h2>
        </RevealOnScroll>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
          </div>
        ) : (
          <>
            <StaggerChildren
              staggerDelay={0.08}
              className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              {Array.isArray(allVisibleBlogs) && allVisibleBlogs.length > 0 ? (
                allVisibleBlogs.map((blog) => {
                  const hasTileImage = !!blog.image?.trim();
                  return (
                  <StaggerItem key={blog.id} className="h-full min-h-0">
                    <RevealOnScroll variant="blur-in" duration={0.6} className="h-full min-h-0">
                      <article
                        className={cn(
                          'flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-[#111]/95 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.08] transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(34,197,94,0.12)]'
                        )}
                      >
                        <div className="relative aspect-[16/10] min-h-[140px] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] sm:min-h-0">
                          <BlogCoverMedia
                            image={blog.image}
                            title={blog.title}
                            lede={plainTextFromAnyContent(blog.content || '', 120)}
                          />
                          <div className="absolute left-3 top-3">
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0] shadow-sm backdrop-blur-sm">
                              {(blog.category || 'Insight').slice(0, 18)}
                            </span>
                          </div>
                          {blog.isPinned && (
                            <div className="absolute right-3 top-3 rounded-full bg-[#0d9488] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-white/[0.06] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80] sm:text-[11px]">
                            {blog.category || 'Article'}
                          </p>
                          {hasTileImage ? (
                            <>
                              <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug tracking-tight text-[#F5F5F5] sm:text-lg">
                                {blog.title}
                              </h3>
                              <p className="mt-2 min-h-[4.5rem] flex-1 line-clamp-3 text-sm leading-relaxed text-[#A1A1AA]">
                                {cardExcerpt(blog)}
                              </p>
                            </>
                          ) : (
                            <p className="mt-3 min-h-[4.5rem] flex-1 text-xs leading-relaxed text-white/42 line-clamp-4 sm:text-sm">
                              Read the full insight for tactics, examples, and takeaways you can use this week.
                            </p>
                          )}

                          <div className="mt-auto flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#E4E4E7]">
                              <User className="h-4 w-4 shrink-0 text-[#71717A]" aria-hidden />
                              <span className="truncate">{blog.authorName}</span>
                            </span>
                            <Button
                              asChild
                              className="h-10 w-full shrink-0 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/15 px-4 text-sm font-semibold text-[#86EFAC] shadow-none hover:bg-[#22C55E]/25 sm:h-9 sm:w-auto"
                            >
                              <Link href={`/insight/${blog.id}`} className="inline-flex items-center gap-1.5">
                                Details
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </article>
                    </RevealOnScroll>
                  </StaggerItem>
                  );
                })
              ) : (
                <p className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/45 sm:py-14">
                  No insights yet.
                </p>
              )}
            </StaggerChildren>

            {hasMore && (
              <div className="mt-10 flex justify-center px-2 sm:mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="w-full max-w-sm rounded-full border-[#22C55E]/35 bg-[#22C55E]/[0.06] px-6 py-5 text-[#86EFAC] hover:bg-[#22C55E]/15 sm:w-auto sm:max-w-none sm:px-8 sm:py-6"
                >
                  {loadingMore ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Load more'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
