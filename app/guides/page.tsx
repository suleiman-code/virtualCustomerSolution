import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { guides } from "@/lib/guides";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  BookOpen,
  TrendingUp,
  Users,
  BarChart3,
  Globe,
  Zap,
  Target,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guides & Resources",
  description:
    "In-depth guides on virtual team management, performance marketing, business systems, and scaling globally. Practical advice from real-world experience.",
  alternates: {
    canonical: "https://virtualcustomersolution.com/guides",
  },
  openGraph: {
    title: "Guides & Resources",
    description:
      "In-depth guides on virtual team management, performance marketing, business systems, and scaling globally.",
    url: "https://virtualcustomersolution.com/guides",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Virtual Workforce": <Users className="h-5 w-5" />,
  "Performance Marketing": <TrendingUp className="h-5 w-5" />,
  "Growth Systems": <BarChart3 className="h-5 w-5" />,
};

const guideIcons: Record<string, React.ReactNode> = {
  "complete-guide-virtual-team-management": <Users className="h-8 w-8" />,
  "performance-marketing-playbook-2025": <Target className="h-8 w-8" />,
  "business-systems-reporting-framework": <BarChart3 className="h-8 w-8" />,
  "scaling-your-business-globally": <Globe className="h-8 w-8" />,
  "digital-transformation-roadmap": <Zap className="h-8 w-8" />,
  "customer-acquisition-strategy-guide": <TrendingUp className="h-8 w-8" />,
};

export default function GuidesPage() {
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
            <span className="text-[var(--text-primary)]">Guides</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--red-border)] bg-[var(--surface-glass-strong)] px-4 py-1.5 text-sm font-medium text-[var(--red-primary)] font-[family-name:var(--font-body)]">
            <BookOpen className="h-4 w-4" />
            In-Depth Resources
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)] sm:text-5xl lg:text-6xl">
            Guides & Playbooks
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            No fluff, no filler. Just practical, experience-backed guides on
            growing your business, building virtual teams, and running marketing
            that actually works.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--red-border)] hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[var(--border-subtle)] p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--surface-glass-strong)] text-[var(--red-primary)]">
                    {guideIcons[guide.slug] || (
                      <BookOpen className="h-8 w-8" />
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-glass-strong)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    {categoryIcons[guide.category]}
                    {guide.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6 pt-5">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] font-[family-name:var(--font-display)] group-hover:text-[var(--red-primary)] transition-colors">
                    {guide.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                    {guide.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                      Updated{" "}
                      {new Date(guide.lastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--red-primary)] font-[family-name:var(--font-body)] transition-transform group-hover:translate-x-1">
                      Read Guide
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[var(--border-subtle)] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Want these strategies implemented for you?
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            Our team can build and execute growth systems, performance marketing
            campaigns, and virtual workforce solutions tailored to your business.
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
