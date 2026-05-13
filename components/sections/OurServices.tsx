'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { RevealOnScroll, StaggerChildren, StaggerItem } from '@/components/animations/ScrollAnimations';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { plainTextFromAnyContent } from '@/lib/markdown-excerpt';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  isPinned: boolean;
}

type OurServicesProps = {
  /** DOM id for anchor links (`#services` on home, `#offerings` on /services). */
  sectionId?: string;
};

function ServiceVisualNoImage({
  title,
  description,
  isHomeServices,
}: {
  title: string;
  description: string;
  isHomeServices: boolean;
}) {
  const lede = plainTextFromAnyContent(description, 110);
  const cleanTitle = title?.trim() || 'Service';

  return (
    <div className="relative flex h-full min-h-[140px] w-full overflow-hidden sm:min-h-0">
      {/* Quiet depth — no loud colour blocks */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isHomeServices
            ? 'bg-gradient-to-br from-[#101010] via-[#0c0c0c] to-[#080808]'
            : 'bg-gradient-to-br from-[#fafafa] via-[#f4f4f5] to-[#ececee]'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-[0.45]',
          isHomeServices
            ? '[background-image:repeating-linear-gradient(-12deg,transparent,transparent_38px,rgba(255,255,255,0.02)_38px,rgba(255,255,255,0.02)_39px)]'
            : '[background-image:repeating-linear-gradient(-12deg,transparent,transparent_40px,rgba(0,0,0,0.02)_40px,rgba(0,0,0,0.02)_41px)]'
        )}
      />
      {isHomeServices ? (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#22C55E]/25 via-[#22C55E]/10 to-transparent" />
      ) : (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-sky-300/50 via-sky-200/20 to-transparent" />
      )}

      <div className="relative z-[1] flex h-full w-full flex-col justify-end px-5 pb-6 pt-10 text-left sm:px-6 sm:pb-7 sm:pt-12">
        <h3
          className={cn(
            'font-display text-lg font-semibold leading-snug tracking-tight line-clamp-2 sm:text-xl',
            isHomeServices ? 'text-[#f4f4f5]' : 'text-zinc-900'
          )}
        >
          {cleanTitle}
        </h3>
        {lede ? (
          <p
            className={cn(
              'mt-2.5 text-[13px] leading-relaxed line-clamp-2 sm:text-sm',
              isHomeServices ? 'text-white/48' : 'text-slate-600'
            )}
          >
            {lede}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ServiceCoverMedia({
  image,
  title,
  description,
  isHomeServices,
}: {
  image: string;
  title: string;
  description: string;
  isHomeServices: boolean;
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
  return (
    <ServiceVisualNoImage
      title={title}
      description={description}
      isHomeServices={isHomeServices}
    />
  );
}

export function OurServices({ sectionId = 'services' }: OurServicesProps) {
  const [pinnedServices, setPinnedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      try {
        const [pinnedRes, unpinnedRes] = await Promise.all([
          fetch('/api/services?pinned=true'),
          fetch('/api/services?skip=0&limit=3'),
        ]);

        const pinnedData = await pinnedRes.json();
        const unpinnedData = await unpinnedRes.json();

        setPinnedServices(Array.isArray(pinnedData) ? pinnedData : []);
        setServices(Array.isArray(unpinnedData.services) ? unpinnedData.services : []);
        setHasMore(unpinnedData.hasMore || false);
        setSkip(3);
      } catch (err) {
        console.error('Fetch services error:', err);
        setPinnedServices([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    void initFetch();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/services?skip=${skip}&limit=3`);
      const data = await res.json();
      if (Array.isArray(data.services)) {
        setServices((prev) => [...prev, ...data.services]);
      }
      setHasMore(data.hasMore || false);
      setSkip(skip + 3);
    } catch (err) {
      console.error('Load more services error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const allVisibleServices = [...pinnedServices, ...services];
  const isHomeServices = sectionId === 'services';

  return (
    <section
      id={sectionId}
      className={cn(
        'section-padding relative scroll-mt-[calc(var(--site-header-height)+0.75rem)] overflow-hidden',
        isHomeServices && 'border-t border-white/[0.06]'
      )}
    >
      {isHomeServices && (
        <>
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#22C55E]/5 blur-[150px]" />
        </>
      )}

      <div className="container-wide relative z-10 max-w-full">
        {isHomeServices ? (
          <RevealOnScroll variant="fade-up" duration={0.8} className="mb-8 text-center sm:mb-10">
            <span className="neon-border neon-text glass mb-4 inline-block rounded-full border border-[rgba(34,197,94,0.3)] px-4 py-1.5 text-sm font-medium text-[#22C55E]">
              Our Services
            </span>
            <h2 className="font-display mb-4 text-4xl font-extrabold tracking-tight text-[#F5F5F5] md:text-5xl lg:text-6xl">
              What We
              <br />
              <span className="text-gradient-lime">Actually Do</span>
            </h2>
          </RevealOnScroll>
        ) : (
          <RevealOnScroll variant="fade-up" duration={0.8}>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#14d9c4] sm:text-sm">
                  Our services
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#F5F5F5] sm:text-3xl md:text-4xl">
                  Solutions for Growth
                </h2>
              </div>
            </div>
          </RevealOnScroll>
        )}

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
              {Array.isArray(allVisibleServices) && allVisibleServices.length > 0 ? (
                allVisibleServices.map((service) => {
                  const hasTileImage = !!service.image?.trim();
                  return (
                  <StaggerItem key={service.id} className="h-full min-h-0">
                    <RevealOnScroll variant="blur-in" duration={0.6} className="h-full min-h-0">
                      <article
                        className={cn(
                          'flex h-full min-w-0 flex-col overflow-hidden rounded-2xl transition-shadow duration-300',
                          isHomeServices
                            ? 'bg-[#111]/95 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.08] hover:shadow-[0_12px_48px_rgba(34,197,94,0.12)]'
                            : 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]'
                        )}
                      >
                        <div
                          className={cn(
                            'relative aspect-[16/10] min-h-[140px] overflow-hidden sm:min-h-0',
                            isHomeServices ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]' : 'bg-zinc-100'
                          )}
                        >
                          <ServiceCoverMedia
                            image={service.image}
                            title={service.title}
                            description={service.description}
                            isHomeServices={isHomeServices}
                          />
                          <div className="absolute left-3 top-3">
                            <span
                              className={cn(
                                'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm',
                                isHomeServices
                                  ? 'border border-white/10 bg-black/50 text-[#A7F3D0]'
                                  : 'bg-white/95 text-zinc-800'
                              )}
                            >
                              Offering
                            </span>
                          </div>
                          {service.isPinned && (
                            <div className="absolute right-3 top-3 rounded-full bg-[#0d9488] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                              Featured
                            </div>
                          )}
                        </div>

                        <div
                          className={cn(
                            'flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4',
                            isHomeServices && 'border-t border-white/[0.06]'
                          )}
                        >
                          <p
                            className={cn(
                              'text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px]',
                              isHomeServices ? 'text-[#4ADE80]' : 'text-[#0d9488]'
                            )}
                          >
                            Professional service
                          </p>
                          {hasTileImage ? (
                            <>
                              <h3
                                className={cn(
                                  'mt-2 font-display text-base font-bold leading-snug tracking-tight line-clamp-2 sm:text-lg',
                                  isHomeServices ? 'text-[#F5F5F5]' : 'text-zinc-900'
                                )}
                              >
                                {service.title}
                              </h3>
                              <p
                                className={cn(
                                  'mt-2 min-h-[4.5rem] flex-1 text-sm leading-relaxed line-clamp-3',
                                  isHomeServices ? 'text-[#A1A1AA]' : 'text-zinc-500'
                                )}
                              >
                                {plainTextFromAnyContent(service.description, 400)}
                              </p>
                            </>
                          ) : (
                            <p
                              className={cn(
                                'mt-3 min-h-[4.5rem] flex-1 text-xs leading-relaxed line-clamp-4 sm:text-sm',
                                isHomeServices ? 'text-white/42' : 'text-zinc-500'
                              )}
                            >
                              Open the offering for scope, deliverables, timelines, and how we work with your
                              team.
                            </p>
                          )}

                          <div
                            className={cn(
                              'mt-auto flex justify-end border-t pt-4',
                              isHomeServices ? 'border-white/[0.08]' : 'border-zinc-100'
                            )}
                          >
                            <Button
                              asChild
                              className={cn(
                                'h-10 w-full rounded-full px-4 text-sm font-semibold shadow-none sm:h-9 sm:w-auto',
                                isHomeServices
                                  ? 'border border-[#22C55E]/35 bg-[#22C55E]/15 text-[#86EFAC] hover:bg-[#22C55E]/25'
                                  : 'bg-[#bae6fd] text-sky-900 hover:bg-[#7dd3fc]'
                              )}
                            >
                              <Link
                                href={`/offering/${service.id}`}
                                className="inline-flex items-center gap-1.5"
                              >
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
                  No services yet. Add tiles from the admin Services panel.
                </p>
              )}
            </StaggerChildren>

            {hasMore && (
              <div className="mt-10 flex justify-center px-2 sm:mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className={cn(
                    'w-full max-w-sm rounded-full px-6 py-5 sm:w-auto sm:max-w-none sm:px-8 sm:py-6',
                    isHomeServices
                      ? 'border-[#22C55E]/35 bg-[#22C55E]/[0.06] text-[#86EFAC] hover:bg-[#22C55E]/15'
                      : 'border-[#0d9488]/40 bg-white/[0.04] text-[#14d9c4] hover:bg-[#0d9488]/10'
                  )}
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
