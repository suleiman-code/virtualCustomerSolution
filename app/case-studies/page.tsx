import { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { caseStudies, getAllServices, getAllIndustries } from "@/lib/case-studies";
import { CaseStudyGrid } from "./CaseStudyGrid";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import { BarChart3, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Case Studies — Real Results & ROI | VCS" },
  description:
    "See how we helped e-commerce, SaaS & agencies grow with virtual teams and performance marketing. Real ROI case studies.",
  alternates: {
    canonical: "https://virtualcustomersolution.com/case-studies",
  },
  openGraph: {
    title: "Case Studies — Real Results & ROI | VCS",
    description:
      "See how we helped e-commerce, SaaS & agencies grow with virtual teams and performance marketing. Real ROI case studies.",
    url: "https://virtualcustomersolution.com/case-studies",
    type: "website",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'VCS Case Studies — Real Results & ROI' }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualcustomersolution.com" },
    { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://virtualcustomersolution.com/case-studies" },
  ],
};

export default function CaseStudiesPage() {
  const services = getAllServices();
  const industries = getAllIndustries();

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="radial-glow absolute inset-0" />
        <div className="container-wide relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="badge mx-auto mb-6 w-fit">
              <BarChart3 className="h-4 w-4" />
              <span>Proven Results</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Real Results for{" "}
              <span className="text-gradient">Real Businesses</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-muted)]">
              Every engagement is built around measurable outcomes. Explore how we have helped
              businesses scale revenue, reduce costs, and build systems that run without the
              founder in the loop.
            </p>
            {/* Summary Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: "312%", label: "Avg. Revenue Growth" },
                { value: "47%", label: "Avg. Cost Reduction" },
                { value: "5+", label: "Industries Served" },
                { value: "100%", label: "Client Retention" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-glass)] p-4"
                >
                  <div className="font-mono text-2xl font-bold text-[var(--red-primary)]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid with Filters */}
      <section className="section-padding">
        <div className="container-wide">
          <CaseStudyGrid
            caseStudies={caseStudies}
            services={services}
            industries={industries}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-[var(--border-subtle)]">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <div className="badge mx-auto mb-6 w-fit">
              <TrendingUp className="h-4 w-4" />
              <span>Your Turn</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="mb-8 text-[var(--text-muted)]">
              Every case study started with a conversation. Let us show you what is possible
              for your business.
            </p>
            <a href={FREE_AUDIT_CONTACT_HREF} className="btn-primary">
              Get Your Free Growth Audit
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
