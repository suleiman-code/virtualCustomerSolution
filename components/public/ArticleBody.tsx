'use client';

import DOMPurify from 'isomorphic-dompurify';
import { MarkdownBody } from '@/components/public/MarkdownBody';
import { isProbablyRichHtml } from '@/lib/markdown-excerpt';

const htmlWrapper =
  'mongo-markdown max-w-none text-[0.95rem] leading-relaxed text-white/85 [&_a]:text-[#4ADE80] [&_a]:underline [&_strong]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#22C55E]/50 [&_blockquote]:pl-4 [&_blockquote]:text-white/70 [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_p]:mt-4 [&_p]:first:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6';

/** Renders Mongo article fields: sanitized HTML (from admin Quill) or markdown (legacy). */
export function ArticleBody({
  markdownOrHtml,
  className = '',
}: {
  markdownOrHtml: string;
  className?: string;
}) {
  const t = markdownOrHtml?.trim() ?? '';
  if (!t) return null;

  if (isProbablyRichHtml(t)) {
    const clean = DOMPurify.sanitize(t, { USE_PROFILES: { html: true } });
    return (
      <div
        className={`${htmlWrapper} ${className}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return <MarkdownBody markdown={t} className={className} />;
}
