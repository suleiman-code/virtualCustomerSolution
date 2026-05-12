import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { guides, getGuideBySlug, getAllGuideSlugs } from "@/lib/guides";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import ReactMarkdown from "react-markdown";
import {
  ChevronRight,
  ArrowRight,
  Clock,
  User,
  BookOpen,
  ChevronDown,
  MessageCircleQuestion,
} from "lucide-react";

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: { absolute: guide.title },
    description: guide.excerpt,
    alternates: {
      canonical: `https://virtualcustomersolution.com/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `https://virtualcustomersolution.com/guides/${guide.slug}`,
      type: "article",
      publishedTime: guide.lastUpdated,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualcustomersolution.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://virtualcustomersolution.com/guides" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://virtualcustomersolution.com/guides/${guide.slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    dateModified: guide.lastUpdated,
    publisher: {
      "@type": "Organization",
      name: "Virtual Customer Solution",
      url: "https://virtualcustomersolution.com",
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav className="flex items-center gap-2 text-sm font-[family-name:var(--font-body)] text-[var(--text-muted)]">
            <Link
              href="/"
              className="transition-colors hover:text-[var(--text-secondary)]"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/guides"
              className="transition-colors hover:text-[var(--text-secondary)]"
            >
              Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate text-[var(--text-primary)] sm:max-w-none">
              {guide.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--red-border)] bg-[var(--surface-glass-strong)] px-4 py-1.5 text-sm font-medium text-[var(--red-primary)] font-[family-name:var(--font-body)]">
            <BookOpen className="h-4 w-4" />
            {guide.category}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)] sm:text-4xl lg:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {guide.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {guide.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated{" "}
              {new Date(guide.lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            {/* TOC Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                  Table of Contents
                </h3>
                <nav className="mt-4 flex flex-col gap-2.5">
                  {guide.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--red-primary)] font-[family-name:var(--font-body)]"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <article className="min-w-0">
              {/* Mobile TOC */}
              <details className="mb-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] lg:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[var(--red-primary)]" />
                    Table of Contents
                  </span>
                  <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
                </summary>
                <nav className="flex flex-col gap-2 border-t border-[var(--border-subtle)] px-5 py-4">
                  {guide.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--red-primary)] font-[family-name:var(--font-body)]"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </details>

              {/* Markdown Content */}
              <div className="prose-vcs">
                <ReactMarkdown
                  components={{
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const idMatch = text.match(/\{#([\w-]+)\}/);
                      const id = idMatch ? idMatch[1] : undefined;
                      const cleanText = text.replace(/\s*\{#[\w-]+\}/, "");
                      return (
                        <h2
                          id={id}
                          className="mt-14 mb-5 scroll-mt-24 text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)] first:mt-0 sm:text-3xl"
                          {...props}
                        >
                          {cleanText}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => (
                      <h3
                        className="mt-8 mb-4 text-xl font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]"
                        {...props}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p
                        className="mb-5 text-base leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                        {...props}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul
                        className="mb-5 ml-5 list-disc space-y-2 text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol
                        className="mb-5 ml-5 list-decimal space-y-2 text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                        {...props}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li
                        className="text-base leading-relaxed"
                        {...props}
                      >
                        {children}
                      </li>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong
                        className="font-semibold text-[var(--text-primary)]"
                        {...props}
                      >
                        {children}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em className="text-[var(--text-primary)]" {...props}>
                        {children}
                      </em>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="my-6 border-l-4 border-[var(--red-primary)] bg-[var(--surface-glass-strong)] py-4 pl-5 pr-4 text-[var(--text-secondary)] font-[family-name:var(--font-body)] rounded-r-lg"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    hr: () => (
                      <hr className="my-10 border-[var(--border-subtle)]" />
                    ),
                  }}
                >
                  {guide.content}
                </ReactMarkdown>
              </div>

              {/* FAQ Section */}
              {guide.faqs.length > 0 && (
                <div className="mt-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <MessageCircleQuestion className="h-6 w-6 text-[var(--red-primary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {guide.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
                      >
                        <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                          {faq.question}
                          <ChevronDown className="h-5 w-5 flex-shrink-0 text-[var(--text-muted)] transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-[var(--border-subtle)] px-6 py-4">
                          <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-16 rounded-2xl border border-[var(--red-border)] bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface-glass-strong)] p-8 text-center sm:p-12">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)] sm:text-3xl">
                  Ready to put these strategies into action?
                </h2>
                <p className="mt-4 text-base text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                  Our team can implement everything in this guide — and more —
                  for your business. Let&apos;s talk about what growth looks like
                  for you.
                </p>
                <Link
                  href={FREE_AUDIT_CONTACT_HREF}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--red-primary)] px-8 py-3.5 text-sm font-semibold text-black shadow-lg shadow-[#22C55E]/20 transition-[background-color,box-shadow] hover:bg-[var(--red-dark)] hover:shadow-[#22C55E]/30 font-[family-name:var(--font-body)]"
                >
                  Get a Free Growth Audit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
