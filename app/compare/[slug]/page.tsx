import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  getComparisonBySlug,
  getAllComparisonSlugs,
} from "@/lib/comparisons";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Star,
  StarHalf,
  Scale,
  Trophy,
} from "lucide-react";

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return { title: "Comparison Not Found" };

  return {
    title: comparison.title,
    description: comparison.excerpt,
    alternates: {
      canonical: `https://virtualcustomersolution.com/compare/${comparison.slug}`,
    },
    openGraph: {
      title: comparison.title,
      description: comparison.excerpt,
      url: `https://virtualcustomersolution.com/compare/${comparison.slug}`,
      type: "article",
    },
  };
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-[var(--red-primary)] text-[var(--red-primary)]"
        />
      ))}
      {hasHalf && (
        <StarHalf className="h-4 w-4 fill-[var(--red-primary)] text-[var(--red-primary)]" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-[var(--border-strong)]"
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
        {rating}/5
      </span>
    </div>
  );
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const { itemA, itemB } = comparison;
  const featureKeys = Object.keys(itemA.features);

  return (
    <SiteShell>
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
              Resources
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate text-[var(--text-primary)] sm:max-w-none">
              {comparison.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--red-border)] bg-[var(--surface-glass-strong)] px-4 py-1.5 text-sm font-medium text-[var(--red-primary)] font-[family-name:var(--font-body)]">
            <Scale className="h-4 w-4" />
            Comparison
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)] sm:text-4xl lg:text-5xl">
            {comparison.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {comparison.excerpt}
          </p>
          <p className="mt-4 text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Last updated{" "}
            {new Date(comparison.lastUpdated).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[itemA, itemB].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                    {item.name}
                  </h2>
                  <div className="mt-2">
                    <RatingStars rating={item.rating} />
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-glass-strong)] text-2xl font-bold text-[var(--red-primary)] font-[family-name:var(--font-display)]">
                  {item.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side by Side Pros/Cons */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Item A */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] overflow-hidden">
              <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-glass-strong)] px-6 py-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                  {itemA.name}
                </h3>
              </div>
              <div className="p-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400 font-[family-name:var(--font-body)]">
                  <Check className="h-4 w-4" />
                  Pros
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {itemA.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      {pro}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-400 font-[family-name:var(--font-body)]">
                  <X className="h-4 w-4" />
                  Cons
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {itemA.cons.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                    >
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Item B */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] overflow-hidden">
              <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-glass-strong)] px-6 py-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                  {itemB.name}
                </h3>
              </div>
              <div className="p-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400 font-[family-name:var(--font-body)]">
                  <Check className="h-4 w-4" />
                  Pros
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {itemB.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      {pro}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-400 font-[family-name:var(--font-body)]">
                  <X className="h-4 w-4" />
                  Cons
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {itemB.cons.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                    >
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)]">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-glass-strong)]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                    {itemA.name}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                    {itemB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureKeys.map((key, index) => (
                  <tr
                    key={key}
                    className={`border-b border-[var(--border-subtle)] ${
                      index % 2 === 0
                        ? "bg-[var(--surface-elevated)]"
                        : "bg-[var(--bg-primary)]"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {itemA.features[key]}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {itemB.features[key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-[var(--red-border)] bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface-glass-strong)] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <Trophy className="h-6 w-6 text-[var(--red-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                Our Verdict
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
              {comparison.verdict}
            </p>

            <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--red-primary)] font-[family-name:var(--font-body)]">
                Recommendation
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                {comparison.recommendation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-subtle)] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Not sure which option fits your business?
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            We help businesses make the right strategic decisions every day.
            Get a free consultation and we&apos;ll recommend a practical mix of support, staff, and marketing.
          </p>
          <Link
            href={FREE_AUDIT_CONTACT_HREF}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--red-primary)] px-8 py-3.5 text-sm font-semibold text-black shadow-lg shadow-[#22C55E]/20 transition-[background-color,box-shadow] hover:bg-[var(--red-dark)] hover:shadow-[#22C55E]/30 font-[family-name:var(--font-body)]"
          >
            Free Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
