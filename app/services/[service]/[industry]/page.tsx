import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  serviceSlugs,
  industries,
  serviceNames,
  industryNames,
  generateServiceIndustryContent,
  type ServiceSlug,
  type Industry,
} from "@/lib/programmatic-seo";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Zap,
} from "lucide-react";

export async function generateStaticParams() {
  const params: { service: string; industry: string }[] = [];
  for (const service of serviceSlugs) {
    for (const industry of industries) {
      params.push({ service, industry });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; industry: string }>;
}): Promise<Metadata> {
  const { service, industry } = await params;

  if (
    !serviceSlugs.includes(service as ServiceSlug) ||
    !industries.includes(industry as Industry)
  ) {
    return { title: "Not Found" };
  }

  const sName = serviceNames[service as ServiceSlug];
  const iName = industryNames[industry as Industry];

  return {
    title: `${sName} for ${iName}`,
    description: `Specialized ${sName.toLowerCase()} designed for ${iName.toLowerCase()} companies. Industry-specific strategies, systems, and execution that drive measurable results.`,
    alternates: {
      canonical: `https://virtualcustomersolution.com/services/${service}/${industry}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ServiceIndustryPage({
  params,
}: {
  params: Promise<{ service: string; industry: string }>;
}) {
  const { service, industry } = await params;

  if (
    !serviceSlugs.includes(service as ServiceSlug) ||
    !industries.includes(industry as Industry)
  ) {
    notFound();
  }

  const content = generateServiceIndustryContent(
    service as ServiceSlug,
    industry as Industry
  );
  const sName = serviceNames[service as ServiceSlug];
  const iName = industryNames[industry as Industry];

  return (
    <SiteShell>
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav className="flex items-center gap-2 text-sm font-[family-name:var(--font-body)] text-[var(--text-muted)]">
            <Link href="/" className="transition-colors hover:text-[var(--text-secondary)]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/services#offerings" className="transition-colors hover:text-[var(--text-secondary)]">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[var(--text-primary)]">
              {sName} for {iName}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--red-border)] bg-[var(--surface-glass-strong)] px-4 py-1.5 text-sm font-medium text-[var(--red-primary)] font-[family-name:var(--font-body)]">
            <Zap className="h-4 w-4" />
            {iName} Solutions
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)] sm:text-4xl lg:text-5xl">
            {content.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {content.subheadline}
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

      {/* Intro */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="border-t border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              Challenges {iName} Businesses Face
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
              These are the pain points we hear most often from {iName.toLowerCase()} companies.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.challenges.map((challenge, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="border-t border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              How We Solve These Problems
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
              Our {sName.toLowerCase()} are built specifically for {iName.toLowerCase()} companies.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.solutions.map((solution, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--red-primary)]" />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                      {solution.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            What You Get
          </h2>
          <ul className="mt-10 space-y-4">
            {content.benefits.map((benefit, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-4"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <span className="text-base text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-subtle)] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            {content.ctaHeadline}
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {content.ctaText}
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
