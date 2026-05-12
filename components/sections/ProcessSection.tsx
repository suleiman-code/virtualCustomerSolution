'use client';

import { motion } from 'framer-motion';
import { Search, Wrench, Rocket, LineChart } from 'lucide-react';
import { Section, Container, SectionHeader, FadeUp, SignalPoint } from '@/components/ui-dp/AnimatedElements';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnose',
    description: 'Founder-led audit to understand your acquisition, reporting, and operational reality. No fluff, no generic recommendations.',
  },
  {
    number: '02',
    icon: Wrench,
    title: 'Build',
    description: 'Implement the systems, campaigns, and team structure needed. Attribution, creative, automation, and execution setup.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Scale',
    description: 'Activate performance marketing and virtual execution. Clear ownership, regular reporting, and continuous optimization.',
  },
  {
    number: '04',
    icon: LineChart,
    title: 'Optimize',
    description: 'Ongoing iteration on creative, targeting, and operations. You see the numbers. We own the execution.',
  },
];

export function ProcessSection() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Our Process"
          title="From chaos to clarity in four phases."
          description="A structured approach that combines strategy, implementation, and execution."
          align="center"
        />

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <FadeUp key={step.number} delay={index * 0.1}>
                <div className="relative text-center lg:text-left">
                  {/* Number Badge */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface-glass)] border border-[var(--border-glass)] mb-6 mx-auto lg:mx-0">
                    <step.icon className="w-7 h-7 text-[#22C55E] neon-text" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center neon-box">
                      <SignalPoint size="sm" pulse={false} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-[var(--text-muted)] text-xs font-mono mb-2">{step.number}</div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
