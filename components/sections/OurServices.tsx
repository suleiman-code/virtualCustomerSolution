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

const HOME_PAGE_SIZE = 3;

function ServiceVisualNoImage({
  title,
  description,
}: {
  title: string;
  description: string;
  isHomeServices: boolean;
}) {
  const lede = plainTextFromAnyContent(description, 110);
  const cleanTitle = title?.trim() || 'Service';

  return (
    <div className="relative flex h-full min-h-[140px] w-full overflow-hidden sm:min-h-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(34,197,94,0.18),transparent_42%),radial-gradient(ellipse_at_85%_75%,rgba(20,217,196,0.14),transparent_40%),linear-gradient(135deg,#101010,#07110d_48%,#050505)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#22C55E]/20" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full border border-[#14d9c4]/15" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/12 via-white/[0.06] to-transparent" />

      <div className="relative z-[1] flex h-full w-full flex-col justify-between px-5 pb-6 pt-5 text-left sm:px-6 sm:pb-7">
        <div className="flex justify-end">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25">VCS</span>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#22C55E]/70">
            Service brief
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-[#f2f2f2] line-clamp-2 sm:text-xl">
            {cleanTitle}
          </h3>
          {lede ? (
            <p className="mt-2.5 text-[13px] leading-relaxed text-white/48 line-clamp-2 sm:text-sm">{lede}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ServiceCoverMedia({
  image,
  title,
  description,
  isHomeServices,
  imageFailed,
  onImageError,
}: {
  image: string;
  title: string;
  description: string;
  isHomeServices: boolean;
  imageFailed: boolean;
  onImageError: () => void;
}) {
  const url = image?.trim();
  if (url && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS/user URLs can be same-origin or remote.
      <img
        src={url}
        alt={`${title?.trim() || 'Service'} cover image`}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={onImageError}
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
  const [failedImages, setFailedImages] = useState<Record<string, true>>({});
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(HOME_PAGE_SIZE);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      try {
        const [pinnedRes, unpinnedRes] = await Promise.all([
          fetch('/api/services?pinned=true'),
          fetch(`/api/services?skip=0&limit=${HOME_PAGE_SIZE}`),
        ]);

        const pinnedData = pinnedRes.ok ? await pinnedRes.json() : [];
        const unpinnedData = unpinnedRes.ok
          ? await unpinnedRes.json()
          : { services: [], hasMore: false };

        if (!pinnedRes.ok) {
          console.warn('[OurServices] pinned fetch failed:', pinnedRes.status);
        }
        if (!unpinnedRes.ok) {
          console.warn('[OurServices] list fetch failed:', unpinnedRes.status);
        }

        setPinnedServices(Array.isArray(pinnedData) ? pinnedData : []);
        setServices(Array.isArray(unpinnedData.services) ? unpinnedData.services : []);
        setHasMore(unpinnedData.hasMore || false);
        setSkip(HOME_PAGE_SIZE);
        setVisibleCount(HOME_PAGE_SIZE);
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

  const isHomeServices = sectionId === 'services';
  const allLoadedServices = [...pinnedServices, ...services];
  const allVisibleServices = isHomeServices
    ? allLoadedServices.slice(0, visibleCount)
    : allLoadedServices;
  const hasHiddenLoadedServices = isHomeServices && allLoadedServices.length > visibleCount;
  const canLoadMore = hasMore || hasHiddenLoadedServices;

  const loadMore = async () => {
    if (loadingMore) return;

    const nextVisibleCount = visibleCount + HOME_PAGE_SIZE;
    if (isHomeServices && (!hasMore || allLoadedServices.length >= nextVisibleCount)) {
      setVisibleCount(nextVisibleCount);
      return;
    }

    setLoadingMore(true);
    try {
      const res = await fetch(`/api/services?skip=${skip}&limit=${HOME_PAGE_SIZE}`);
      const data = await res.json();
      if (Array.isArray(data.services)) {
        setServices((prev) => [...prev, ...data.services]);
      }
      setHasMore(data.hasMore || false);
      setSkip((prev) => prev + HOME_PAGE_SIZE);
      if (isHomeServices) {
        setVisibleCount(nextVisibleCount);
      }
    } catch (err) {
      console.error('Load more services error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

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
                  const imageUrl = service.image?.trim() || '';
                  const imageKey = `${service.id}:${imageUrl}`;
                  const hasTileImage = !!imageUrl && !failedImages[imageKey];
                  return (
                    <StaggerItem key={service.id} className="h-full min-h-0">
                      <RevealOnScroll variant="blur-in" duration={0.6} className="h-full min-h-0">
                        <Link
                          href={`/offering/${service.id}`}
                          className={cn(
                            'group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl transition-shadow duration-300',
                            isHomeServices
                              ? 'bg-[#111]/95 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.08] hover:shadow-[0_12px_48px_rgba(34,197,94,0.12)]'
                              : 'bg-[#101010]/95 shadow-[0_8px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.08] hover:shadow-[0_12px_48px_rgba(20,217,196,0.12)]'
                          )}
                        >
                          <div
                            className={cn(
                              'relative aspect-[16/10] min-h-[140px] overflow-hidden sm:min-h-0',
                              isHomeServices
                                ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]'
                                : 'bg-gradient-to-br from-[#141414] via-[#0f1715] to-[#080808]'
                            )}
                          >
                            <ServiceCoverMedia
                              image={service.image}
                              title={service.title}
                              description={service.description}
                              isHomeServices={isHomeServices}
                              imageFailed={!!failedImages[imageKey]}
                              onImageError={() => setFailedImages((prev) => ({ ...prev, [imageKey]: true }))}
                            />
                            <div className="absolute left-3 top-3">
                              <span className="inline-flex rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0] shadow-sm backdrop-blur-sm">
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
                              'flex min-h-0 min-w-0 flex-1 flex-col border-t border-white/[0.06] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4'
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
                                    isHomeServices ? 'text-[#F5F5F5]' : 'text-[#F5F5F5]'
                                  )}
                                >
                                  {service.title}
                                </h3>
                                <p
                                  className={cn(
                                    'mt-2 min-h-[4.5rem] flex-1 text-sm leading-relaxed line-clamp-3',
                                    isHomeServices ? 'text-[#A1A1AA]' : 'text-[#A1A1AA]'
                                  )}
                                >
                                  {plainTextFromAnyContent(service.description, 400)}
                                </p>
                              </>
                            ) : (
                              <p
                                className={cn(
                                  'mt-3 min-h-[4.5rem] flex-1 text-xs leading-relaxed line-clamp-4 sm:text-sm',
                                  isHomeServices ? 'text-white/42' : 'text-white/45'
                                )}
                              >
                                Open the offering for scope, deliverables, timelines, and how we work with your
                                team.
                              </p>
                            )}

                            <div
                              className={cn(
                                'mt-auto flex justify-end border-t pt-4',
                                isHomeServices ? 'border-white/[0.08]' : 'border-white/[0.08]'
                              )}
                            >
                              <span
                                className={cn(
                                  'inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors sm:h-9 sm:w-auto',
                                  isHomeServices
                                    ? 'border border-[#22C55E]/35 bg-[#22C55E]/15 text-[#86EFAC] group-hover:bg-[#22C55E]/25'
                                    : 'border border-[#14d9c4]/35 bg-[#14d9c4]/15 text-[#99F6E4] group-hover:bg-[#14d9c4]/25'
                                )}
                              >
                                Details
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
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

            {canLoadMore && (
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
