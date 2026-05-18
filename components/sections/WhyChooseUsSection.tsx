'use client';

import { Check, ArrowRight } from 'lucide-react';
import { Section, Container, SectionHeader, FadeUp, GlassCard } from '@/components/ui-dp/AnimatedElements';
import { useNavigation, type PageRoute } from '@/lib/navigation';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    title: 'Support, staff & marketing in one package',
    description: 'Live chat, VAs, SDRs, and campaigns — coordinated by one provider',
    icon: '✅',
  },
  {
    title: 'Save 50-75% vs hiring separately',
    description: 'Get both services at a fraction of the cost',
    icon: '💰',
  },
  {
    title: 'Your OWN dedicated team',
    description: 'Not shared, not outsourced — they\'re all yours',
    icon: '👥',
  },
  {
    title: 'Performance guarantees on every plan',
    description: 'We put our money where our mouth is',
    icon: '🎯',
  },
  {
    title: 'No long-term contracts',
    description: 'Cancel anytime with 30-day notice',
    icon: '🔓',
  },
];

const packages: {
  name: string;
  price: string;
  period: string;
  description: string;
  badge: string;
  highlighted: boolean;
  link: PageRoute;
}[] = [
  {
    name: 'Starter Rocket',
    price: '$399',
    period: '/mo',
    description: 'For Startups',
    badge: '🟢',
    highlighted: false,
    link: 'contact',
  },
  {
    name: 'Growth Engine',
    price: '$999',
    period: '/mo',
    description: 'Most Popular',
    badge: '🔵',
    highlighted: true,
    link: 'contact',
  },
  {
    name: 'Domination Mode',
    price: '$2,499',
    period: '/mo',
    description: 'For Market Leaders',
    badge: '🟡',
    highlighted: false,
    link: 'contact',
  },
];

export function WhyChooseUsSection() {
  const { navigateTo } = useNavigation();

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Why Choose Us"
          title="One Provider for Support, Staff & Marketing"
          description="Why companies choose VCS over juggling separate freelancers, agencies, and offshore vendors."
          align="center"
        />

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <FadeUp key={benefit.title} delay={index * 0.1}>
              <GlassCard className="p-6 flex gap-4">
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {benefit.description}
                  </p>
                </div>
              </GlassCard>
            </FadeUp>
          ))}
        </div>

        {/* Package Preview */}
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
            Example engagement ranges
          </h3>
          <p className="text-[var(--text-secondary)]">
            Final scopes are custom — contact us for a tailored proposal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <FadeUp key={pkg.name} delay={index * 0.1}>
              <GlassCard 
                className={`p-6 text-center ${pkg.highlighted ? 'border-2 border-[#22C55E] relative' : ''}`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#059669] text-black text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{pkg.badge}</div>
                <h4 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">
                  {pkg.name}
                </h4>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-[#22C55E]">{pkg.price}</span>
                  <span className="text-[var(--text-muted)] text-sm">{pkg.period}</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm mb-4">{pkg.description}</p>
                <Button
                  onClick={() => navigateTo(pkg.link)}
                  variant={pkg.highlighted ? 'default' : 'outline'}
                  className="w-full"
                >
                  Get a quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
