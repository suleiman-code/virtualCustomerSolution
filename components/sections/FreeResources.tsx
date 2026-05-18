import { ArrowRight, Users, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Resource {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
}

const resources: Resource[] = [
  {
    icon: Users,
    title: 'How to Hire and Manage a Virtual Team (Without Losing Your Mind)',
    description:
      'A practical guide with the exact SOPs, tools, and check-in schedules we use to run virtual teams across 5+ time zones.',
    slug: 'complete-guide-virtual-team-management',
  },
  {
    icon: BarChart3,
    title: 'The 2026 Service Provider Growth Playbook',
    description:
      'How we plan live chat, support coverage, virtual staff, and marketing for clients — budgets, channels, and reporting without agency fluff.',
    slug: 'performance-marketing-playbook-2025',
  },
  {
    icon: Settings,
    title: 'Operations Reporting Your Team Will Actually Open',
    description:
      'Dashboards and weekly rhythms we use so support queues, staff utilization, and campaign results stay visible for leadership and clients.',
    slug: 'business-systems-reporting-framework',
  },
];

export function FreeResources() {
  return (
    <section className="section-padding relative bg-white/[0.01] border-y border-white/[0.04]">
      <div className="container-wide">
        {/* header */}
        <div className="scroll-reveal mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#22C55E] neon-text">
            Resources
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F5F5] sm:text-4xl">
            Free Guides
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Playbooks we use when delivering support, virtual staff, and marketing for clients.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 md:grid-cols-3 stagger-children">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.slug} className="scroll-scale">
                <div
                  className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 transition-[border-color,background-color] hover:border-[#22C55E]/25 hover:bg-white/[0.05]"
                >
                  {/* icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E] transition-colors group-hover:bg-[#22C55E]/20 neon-text neon-box">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* title */}
                  <h3 className="mb-3 font-display text-lg font-semibold leading-snug text-[#F5F5F5]">
                    {r.title}
                  </h3>

                  {/* description */}
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-white/60">
                    {r.description}
                  </p>

                  {/* link */}
                  <Link
                    href={`/guides/${r.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#22C55E] transition hover:text-[#4ADE80] neon-text min-h-[44px]"
                  >
                    Read Guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
