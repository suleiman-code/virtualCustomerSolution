'use client';

import { Linkedin, Mail, ArrowRight } from 'lucide-react';
import { FadeUp, GlassCard, SignalPoint, StaggerContainer, StaggerItem } from '@/components/ui-dp/AnimatedElements';
import { useNavigation } from '@/lib/navigation';
import { SITE_STATS } from '@/lib/site-stats';

const companyValues = [
  {
    title: 'Proof Over Promises',
    description: 'We show you what\'s working with real numbers, not marketing fluff. If something isn\'t performing, we tell you.',
  },
  {
    title: 'Execution, Not Just Strategy',
    description: 'We don\'t hand you a PDF and walk away. We build, implement, and run the systems we design.',
  },
  {
    title: 'Founder-Level Accountability',
    description: 'Every engagement has direct founder oversight. You\'re not passed off to junior staff.',
  },
];

const trustMetrics = [
  { value: SITE_STATS.years.display, label: 'Years in the Game' },
  { value: SITE_STATS.clients.display, label: 'Clients Served' },
  { value: SITE_STATS.countries.display, label: 'Countries Served' },
];

export function FounderSection() {
  const { navigateTo } = useNavigation();

  return (
    <section className="section-padding relative">
      <div className="container-wide">
        {/* Section Header */}
        <FadeUp className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-[#22C55E] text-sm font-medium uppercase tracking-wider mb-4 block">
            Why Virtual Customer Solution
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Built by operators, for operators.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mt-4 leading-relaxed">
            We've lived the chaos of fragmented vendors, broken reporting, and founder-dependent execution. Virtual Customer Solution exists to solve it.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Founder Card */}
          <FadeUp className="lg:col-span-1">
            <GlassCard className="p-8 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-[#22C55E]">VCS</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">Virtual Customer Solution</h3>
                  <p className="text-[var(--text-muted)] text-sm">Founded 2020</p>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                10+ years in performance marketing and operations. Built and scaled acquisition systems across B2B, e-commerce, and service businesses.
              </p>

              {/* Trust Metrics */}
              <div className="space-y-3 mb-6">
                {trustMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{metric.label}</span>
                    <span className="text-[#22C55E] font-medium tabular-nums">{metric.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href="https://linkedin.com/company/virtualcustomersolution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[var(--surface-glass-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#22C55E] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@virtualcustomersolution.com"
                  className="w-10 h-10 rounded-lg bg-[var(--surface-glass-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#22C55E] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </GlassCard>
          </FadeUp>

          {/* Values */}
          <StaggerContainer className="lg:col-span-2 grid sm:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <StaggerItem key={value.title}>
                <GlassCard className="p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center mb-4">
                    <span className="font-display font-bold text-[#22C55E]">{index + 1}</span>
                  </div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {value.description}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Bottom CTA */}
        <FadeUp className="text-center">
          <GlassCard className="inline-block p-6">
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Ready to see what clarity looks like?
            </p>
            <button
              onClick={() => navigateTo('free-growth-audit')}
              className="inline-flex items-center gap-2 text-[#22C55E] hover:text-[#059669] font-medium group"
            >
              Free Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </GlassCard>
        </FadeUp>
      </div>
    </section>
  );
}
