import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  serviceSlugs,
  cities,
  serviceNames,
  cityNames,
  generateServiceCityContent,
  type ServiceSlug,
  type City,
} from "@/lib/programmatic-seo";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

export async function generateStaticParams() {
  const params: { service: string; city: string }[] = [];
  for (const service of serviceSlugs) {
    for (const city of cities) {
      params.push({ service, city });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city } = await params;

  if (
    !serviceSlugs.includes(service as ServiceSlug) ||
    !cities.includes(city as City)
  ) {
    return { title: "Not Found" };
  }

  const sName = serviceNames[service as ServiceSlug];
  const cName = cityNames[city as City];

  return {
    title: `${sName} in ${cName}`,
    description: `Professional ${sName.toLowerCase()} for businesses in ${cName}. Local market expertise combined with global best practices to drive measurable growth.`,
    alternates: {
      canonical: `https://virtualcustomersolution.com/services/${service}/near/${city}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city } = await params;

  if (
    !serviceSlugs.includes(service as ServiceSlug) ||
    !cities.includes(city as City)
  ) {
    notFound();
  }

  const content = generateServiceCityContent(
    service as ServiceSlug,
    city as City
  );
  const sName = serviceNames[service as ServiceSlug];
  const cName = cityNames[city as City];

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
              {sName} in {cName}
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
            <MapPin className="h-4 w-4" />
            {cName}
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
            Get a Free Growth Audit
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

      {/* Local Context */}
      <section className="border-t border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-[var(--red-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              Why {cName}?
            </h2>
          </div>
          <p className="text-base leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            {content.whyLocal}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-[var(--border-subtle)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              Our {sName} in {cName}
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
              Everything you need to build, measure, and scale your growth engine.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.services.map((svc, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
              >
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--red-primary)]" />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {svc.description}
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
            Key Benefits
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
            Get a Free Growth Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
