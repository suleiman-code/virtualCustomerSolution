import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

import { SiteShell } from '@/components/layout/SiteShell';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { BlogPostSchema } from '@/components/seo/BlogPostSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { AuthorBox } from '@/components/blog/AuthorBox';
import { InContentCTA } from '@/components/blog/InContentCTA';
import { LeadMagnetBanner } from '@/components/blog/LeadMagnetBanner';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: { absolute: post.title },
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastModified || post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
      url: `https://virtualcustomersolution.com/blog/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/opengraph-image'],
    },
    alternates: {
      canonical: `https://virtualcustomersolution.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.category, 3);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.category, href: `/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}` },
    { label: post.title, href: `/blog/${slug}` },
  ];

  // Split content to insert CTA mid-article
  const contentLines = post.content.split('\n');
  const midPoint = Math.floor(contentLines.length / 2);
  const firstHalf = contentLines.slice(0, midPoint).join('\n');
  const secondHalf = contentLines.slice(midPoint).join('\n');

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SiteShell>
      <BlogPostSchema
        title={post.title}
        excerpt={post.excerpt}
        date={post.date}
        lastModified={post.lastModified}
        author={post.author}
        slug={slug}
        category={post.category}
        tags={post.tags}
        readingTime={post.readingTime}
      />
      {post.faqs.length > 0 && <FAQSchema faqs={post.faqs} />}

      <article className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero */}
          <header className="max-w-4xl mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Link
                href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)] hover:bg-[rgba(34,197,94,0.15)] transition-colors"
              >
                <Tag className="w-3 h-3" />
                {post.category}
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-white/70 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>

            {/* Author line */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#22C55E] to-[#059669] flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {post.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author}</p>
              </div>
            </div>
          </header>

          {/* Content + Sidebar */}
          <div className="flex gap-10 lg:gap-14">
            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/* First half of content */}
              <div className="prose-blog">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
                      return (
                        <h2 id={id} className="font-display text-2xl md:text-3xl font-bold text-white mt-12 mb-4 scroll-mt-28" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                      return (
                        <h2 id={id} className="font-display text-2xl md:text-3xl font-bold text-white mt-12 mb-4 scroll-mt-28" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                      return (
                        <h3 id={id} className="font-display text-xl md:text-2xl font-semibold text-white mt-8 mb-3 scroll-mt-28" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children, ...props }) => (
                      <p className="text-white/70 leading-relaxed mb-5" {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc list-inside space-y-2 text-white/70 mb-5 ml-2" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 text-white/70 mb-5 ml-2" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-white/70 leading-relaxed" {...props}>
                        {children}
                      </li>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-semibold text-white" {...props}>
                        {children}
                      </strong>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        className="text-[#22C55E] hover:text-[#4ADE80] underline underline-offset-2 transition-colors"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-[#22C55E] pl-5 my-6 text-white/60 italic"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="font-mono text-sm bg-[rgba(34,197,94,0.08)] text-[#4ADE80] px-1.5 py-0.5 rounded" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={`font-mono text-sm ${className || ''}`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children, ...props }) => (
                      <pre className="bg-black border border-[rgba(255,255,255,0.06)] rounded-xl p-5 overflow-x-auto mb-6 text-sm" {...props}>
                        {children}
                      </pre>
                    ),
                    hr: () => (
                      <hr className="border-t border-[rgba(255,255,255,0.06)] my-10" />
                    ),
                  }}
                >
                  {firstHalf}
                </ReactMarkdown>
              </div>

              {/* Mid-article CTA */}
              <InContentCTA />

              {/* Second half of content */}
              <div className="prose-blog">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
                      return (
                        <h2 id={id} className="font-display text-2xl md:text-3xl font-bold text-white mt-12 mb-4 scroll-mt-28" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                      return (
                        <h2 id={id} className="font-display text-2xl md:text-3xl font-bold text-white mt-12 mb-4 scroll-mt-28" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                      return (
                        <h3 id={id} className="font-display text-xl md:text-2xl font-semibold text-white mt-8 mb-3 scroll-mt-28" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children, ...props }) => (
                      <p className="text-white/70 leading-relaxed mb-5" {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc list-inside space-y-2 text-white/70 mb-5 ml-2" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside space-y-2 text-white/70 mb-5 ml-2" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-white/70 leading-relaxed" {...props}>
                        {children}
                      </li>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-semibold text-white" {...props}>
                        {children}
                      </strong>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        className="text-[#22C55E] hover:text-[#4ADE80] underline underline-offset-2 transition-colors"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-[#22C55E] pl-5 my-6 text-white/60 italic"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="font-mono text-sm bg-[rgba(34,197,94,0.08)] text-[#4ADE80] px-1.5 py-0.5 rounded" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={`font-mono text-sm ${className || ''}`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children, ...props }) => (
                      <pre className="bg-black border border-[rgba(255,255,255,0.06)] rounded-xl p-5 overflow-x-auto mb-6 text-sm" {...props}>
                        {children}
                      </pre>
                    ),
                    hr: () => (
                      <hr className="border-t border-[rgba(255,255,255,0.06)] my-10" />
                    ),
                  }}
                >
                  {secondHalf}
                </ReactMarkdown>
              </div>

              {/* FAQ Section */}
              {post.faqs.length > 0 && (
                <section className="mt-16">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {post.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group glass-panel overflow-hidden"
                      >
                        <summary className="flex items-center justify-between cursor-pointer p-5 text-white font-medium hover:text-[#22C55E] transition-colors list-none">
                          <span className="pr-4">{faq.question}</span>
                          <span className="shrink-0 text-white/60 group-open:rotate-45 transition-transform text-xl">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-5 text-white/70 leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Author Box */}
              <div className="mt-12">
                <AuthorBox authorName={post.author} />
              </div>

              {/* Lead Magnet Banner */}
              <LeadMagnetBanner />

              <div className="mt-12 rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-sm text-white/65 sm:text-base">
                  Want a tailored look at your marketing and systems?
                </p>
                <Link
                  href={FREE_AUDIT_CONTACT_HREF}
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#22C55E]/20 px-6 py-2.5 text-sm font-semibold text-[#86EFAC] transition hover:bg-[#22C55E]/30"
                >
                  Free Consultation
                </Link>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-16">
                  <h2 className="font-display text-2xl font-bold text-white mb-8">
                    Related Articles
                  </h2>
                  <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="glass-panel group flex h-full min-h-0 flex-col p-5 transition-all hover:border-[rgba(34,197,94,0.2)]"
                      >
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#22C55E]">
                          {related.category}
                        </span>
                        <h3 className="font-display mb-2 line-clamp-2 text-base font-semibold text-white transition-colors group-hover:text-[#22C55E]">
                          {related.title}
                        </h3>
                        <p className="min-h-[2.75rem] flex-1 text-sm text-white/60 line-clamp-2">
                          {related.excerpt}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-[#22C55E]">
                          Read more
                          <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <TableOfContents items={post.toc} />
            </aside>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
