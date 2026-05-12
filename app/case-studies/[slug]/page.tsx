import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { caseStudies, getCaseStudyBySlug, getAllSlugs } from "@/lib/case-studies";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lightbulb,
  MessageSquareQuote,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case Study Not Found" };

  return {
    title: { absolute: cs.title },
    description: `${cs.client} — ${cs.results[0].value} ${cs.results[0].metric.toLowerCase()}. See how VCS delivered measurable results through ${cs.servicesUsed.join(" and ")}.`,
    alternates: {
      canonical: `https://virtualcustomersolution.com/case-studies/${slug}`,
    },
    openGraph: {
      title: cs.title,
      description: `${cs.client}: ${cs.results.map((r) => `${r.value} ${r.metric.toLowerCase()}`).join(", ")}`,
      url: `https://virtualcustomersolution.com/case-studies/${slug}`,
      type: "article",
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // Find next / prev case studies for navigation
  const currentIndex = caseStudies.findIndex((c) => c.slug === slug);
  const prevStudy = currentIndex > 0 ? caseStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virtualcustomersolution.com' },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://virtualcustomersolution.com/case-studies' },
      { '@type': 'ListItem', position: 3, name: cs.title, item: `https://virtualcustomersolution.com/case-studies/${slug}` },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Link
              href="/"
              className="transition-colors hover:text-[var(--text-primary)]"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/case-studies"
              className="transition-colors hover:text-[var(--text-primary)]"
            >
              Case Studies
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-[var(--text-primary)]">{cs.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="radial-glow absolute inset-0" />
        <div className="container-wide relative z-10">
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--red-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Link>

          <div className="mx-auto max-w-4xl">
            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--surface-glass-strong)] px-3 py-1 text-xs font-medium text-[var(--red-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {cs.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[var(--red-primary)]" />
                <span>{cs.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[var(--red-primary)]" />
                <span>{cs.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--red-primary)]" />
                <span>{cs.duration}</span>
              </div>
            </div>

            {/* Services used */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Wrench className="h-4 w-4 text-[var(--text-light)]" />
              {cs.servicesUsed.map((service) => (
                <span
                  key={service}
                  className="badge text-xs"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results — Big metric cards */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
        <div className="container-wide py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-[var(--red-primary)]" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Key Results
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cs.results.map((result) => (
                <div
                  key={result.metric}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-primary)] p-6 transition-[border-color,box-shadow] hover:border-[var(--red-primary)] hover:shadow-[0_0_30px_var(--red-glow)]"
                >
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--red-dark)] to-[var(--red-primary)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="font-mono text-3xl font-bold text-[var(--red-primary)]">
                    {result.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                    {result.metric}
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                    {result.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-glass-strong)]">
                <Target className="h-5 w-5 text-[var(--red-primary)]" />
              </div>
              <h2 className="text-2xl font-bold">The Challenge</h2>
            </div>
            <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8">
              <p className="text-lg leading-relaxed text-[var(--text-secondary)]">{cs.problem}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-glass)]">
        <div className="container-wide section-padding">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-glass-strong)]">
                <Lightbulb className="h-5 w-5 text-[var(--red-primary)]" />
              </div>
              <h2 className="text-2xl font-bold">Our Strategy</h2>
            </div>
            <p className="mb-10 text-lg leading-relaxed text-[var(--text-secondary)]">
              {cs.strategy}
            </p>

            {/* Execution Timeline */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-glass-strong)]">
                <Calendar className="h-5 w-5 text-[var(--red-primary)]" />
              </div>
              <h3 className="text-xl font-bold">Execution</h3>
            </div>
            <div className="timeline ml-2">
              {cs.execution.map((step, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[var(--red-primary)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <MessageSquareQuote className="mx-auto mb-6 h-10 w-10 text-[var(--red-primary)] opacity-60" />
            <blockquote className="mb-6 text-xl leading-relaxed text-[var(--text-primary)] italic md:text-2xl">
              {"\u201C"}{cs.testimonial}{"\u201D"}
            </blockquote>
            <div className="text-sm text-[var(--text-muted)]">
              {"\u2014"} {cs.client} Leadership
            </div>
          </div>
        </div>
      </section>

      {/* Navigation between case studies */}
      <section className="border-t border-[var(--border-subtle)]">
        <div className="container-wide py-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            {prevStudy ? (
              <Link
                href={`/case-studies/${prevStudy.slug}`}
                className="group flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--red-primary)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <div className="text-left">
                  <div className="text-xs text-[var(--text-light)]">Previous</div>
                  <div className="font-medium">{prevStudy.client}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextStudy ? (
              <Link
                href={`/case-studies/${nextStudy.slug}`}
                className="group flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--red-primary)]"
              >
                <div className="text-right">
                  <div className="text-xs text-[var(--text-light)]">Next</div>
                  <div className="font-medium">{nextStudy.client}</div>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <div className="badge mx-auto mb-6 w-fit">
              <CheckCircle2 className="h-4 w-4" />
              <span>Get Started</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Want Results Like These?
            </h2>
            <p className="mb-8 text-[var(--text-muted)]">
              Every engagement starts with understanding your business. Book a free growth
              audit and we will show you where the biggest opportunities are.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={FREE_AUDIT_CONTACT_HREF} className="btn-primary">
                Get Your Free Growth Audit
              </a>
              <Link href="/case-studies" className="btn-outline">
                View More Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
