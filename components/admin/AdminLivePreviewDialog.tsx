'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ArticleBody } from '@/components/public/ArticleBody';
import DOMPurify from 'isomorphic-dompurify';
import { isProbablyRichHtml, plainTextFromAnyContent } from '@/lib/markdown-excerpt';

type BlogPreview = {
  title?: string;
  category?: string;
  authorName?: string;
  image?: string;
  excerpt?: string;
  content?: string;
};

type ServicePreview = {
  title?: string;
  description?: string;
  body?: string;
  image?: string;
};

type Props = {
  kind: 'blog' | 'service';
  entityId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function sanitizeSnippet(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

export function AdminLivePreviewDialog({ kind, entityId, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<BlogPreview | null>(null);
  const [service, setService] = useState<ServicePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !entityId) {
      setBlog(null);
      setService(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const path = kind === 'blog' ? `/api/blogs/${entityId}` : `/api/services/${entityId}`;
    fetch(path)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Load failed');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (kind === 'blog') setBlog(data as BlogPreview);
        else setService(data as ServicePreview);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, entityId, kind]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] max-h-[100dvh] min-h-0 w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-white/10 bg-[#0a0a0a] p-0 text-white shadow-none sm:left-0 sm:top-0 sm:max-w-none sm:translate-x-0 sm:translate-y-0"
      >
        <DialogHeader className="shrink-0 border-b border-white/10 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-14 text-left sm:px-6 sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top))]">
          <DialogTitle className="text-base text-white sm:text-lg">
            {kind === 'blog' ? 'Insight preview' : 'Offering preview'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Read-only preview of the public page content. Full screen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
          </div>
        ) : error ? (
          <p className="flex flex-1 items-center justify-center px-2 py-8 text-center text-sm text-red-300">{error}</p>
        ) : kind === 'blog' && blog ? (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] pr-1 sm:pr-4">
            <div className="mx-auto max-w-3xl space-y-4 pb-4 break-words [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]">
                  {blog.category || 'General'}
                </p>
                <h2 className="font-display mt-2 text-xl font-bold leading-tight sm:text-2xl">{blog.title}</h2>
                <p className="mt-2 text-sm text-white/50">{blog.authorName}</p>
              </div>
              {blog.image ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.image}
                    alt=""
                    className="max-h-[min(280px,42vh)] w-full object-cover sm:max-h-[280px]"
                  />
                </div>
              ) : null}
              {blog.excerpt?.trim() ? (
                isProbablyRichHtml(blog.excerpt) ? (
                  <div
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-white/75 sm:p-4 [&_a]:text-[#4ADE80]"
                    dangerouslySetInnerHTML={{ __html: sanitizeSnippet(blog.excerpt) }}
                  />
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-white/75 sm:p-4">
                    {blog.excerpt}
                  </div>
                )
              ) : null}
              <ArticleBody markdownOrHtml={blog.content || ''} />
            </div>
          </div>
        ) : kind === 'service' && service ? (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] pr-1 sm:pr-4">
            <div className="mx-auto max-w-3xl space-y-4 pb-4 break-words [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]">Service</p>
                <h2 className="font-display mt-2 text-xl font-bold leading-tight sm:text-2xl">{service.title}</h2>
              </div>
              {service.image ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt=""
                    className="max-h-[min(280px,42vh)] w-full object-cover sm:max-h-[280px]"
                  />
                </div>
              ) : null}
              {(() => {
                const lead =
                  plainTextFromAnyContent(service.description || '', 280) ||
                  plainTextFromAnyContent(service.body || '', 280);
                return lead ? (
                  <p className="text-sm leading-relaxed text-white/70 sm:text-base">{lead}</p>
                ) : null;
              })()}
              <ArticleBody
                markdownOrHtml={
                  service.body?.trim() ? service.body : service.description || ''
                }
              />
            </div>
          </div>
        ) : (
          <p className="flex flex-1 items-center justify-center px-2 py-8 text-center text-sm text-white/45">Nothing to preview.</p>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
