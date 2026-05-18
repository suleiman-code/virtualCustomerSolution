'use client';

import { TextReveal } from '@/components/motion/TextReveal';
import { LineReveal } from '@/components/motion/TextReveal';

/**
 * Compact text reveal section between hero and proof bar.
 * Words light up as user scrolls — creates dramatic pacing.
 */
export function HomepageHeroText() {
  return (
    <section className="relative py-20 md:py-28 bg-[var(--bg-primary)] overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="container-wide relative z-10 max-w-3xl mx-auto">
        <LineReveal className="mb-4">
          <span className="badge text-xs">Why Us</span>
        </LineReveal>

        <TextReveal
          text="Most teams burn budget hiring separate vendors for chat, support, marketing, and web. VCS is one service provider — dedicated people and delivery under one roof, so you stop coordinating and start scaling."
          className="text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed tracking-tight"
        />

        <div className="mt-12 grid grid-cols-3 gap-4 md:gap-6">
          {[
            { value: '40-60%', label: 'Lower Costs' },
            { value: '3+', label: 'Years Running' },
            { value: '<1 week', label: 'Staff Ready' },
          ].map((stat, i) => (
            <LineReveal key={i} delay={0.3 + i * 0.2}>
              <div className="text-center p-4 md:p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="font-mono text-xl md:text-3xl font-bold text-[#22C55E] neon-text mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs text-[#A1A1AA] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </LineReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
