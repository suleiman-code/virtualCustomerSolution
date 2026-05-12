import Image from 'next/image';
import { SiteShell } from '@/components/layout/SiteShell';
import { Metadata } from 'next';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import { Check } from 'lucide-react';
import { FadeUp, GlassCard } from '@/components/ui-dp/AnimatedElements';

export const metadata: Metadata = {
  title: 'About Us — 8+ Years, 200+ Clients',
  description: 'Learn about Virtual Customer Solution — 8+ years combining AI-powered digital marketing, virtual teams & web development. 200+ clients across 15+ countries.',
  alternates: {
    canonical: 'https://virtualcustomersolution.com/about',
  },
  openGraph: {
    title: 'About Virtual Customer Solution',
    description: '8+ years combining AI-powered digital marketing, virtual teams & web development. 200+ clients across 15+ countries.',
    url: 'https://virtualcustomersolution.com/about',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'About Virtual Customer Solution' }],
  },
};

const servicesOffered = [
  'SEO Services',
  'PPC/Paid Advertising',
  'Social Media Marketing',
  'Content Marketing',
  'Web Design & Development',
  'Email & SMS Marketing',
  'AI Services',
];

const values = [
  {
    icon: '🎯',
    title: 'Results-First',
    description: 'Everything we do is measured and optimized for real business growth.',
  },
  {
    icon: '🤝',
    title: 'Transparency',
    description: 'No hidden fees, no surprises, no BS. What you see is what you get.',
  },
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We keep up with what works so you don\'t have to. You get strategies that are actually current.',
  },
  {
    icon: '🛡️',
    title: 'Reliability',
    description: 'Your dedicated team shows up every single day, delivering consistent results.',
  },
  {
    icon: '❤️',
    title: 'Client-First',
    description: 'Your success is literally our business. We win when you win.',
  },
  {
    icon: '⚡',
    title: 'Speed & Efficiency',
    description: 'We deliver projects on time and optimize for maximum performance.',
  },
  {
    icon: '🔒',
    title: 'Security First',
    description: 'Your data and systems are protected with enterprise-grade security.',
  },
  {
    icon: '🌍',
    title: 'Global Reach',
    description: 'Working with clients across 15+ countries with flexible scheduling.',
  },
];

const team = [
  {
    name: 'CEO',
    role: 'Founder & CEO',
    description: 'Leading Virtual Customer Solution with a vision to help businesses grow smarter.',
  },
  {
    name: 'Marketing Director',
    role: 'Marketing Director',
    description: 'Overseeing all digital marketing strategies and campaigns.',
  },
  {
    name: 'Operations Manager',
    role: 'Operations Manager',
    description: 'Managing virtual team operations and client relationships.',
  },
  {
    name: 'IT Director',
    role: 'IT Director',
    description: 'Leading technology solutions and software development.',
  },
  {
    name: 'Technical Lead',
    role: 'Engineering & Integrations',
    description: 'Reliable delivery across systems, integrations, and web projects.',
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="overflow-x-hidden pb-20">
        {/* Full-bleed horizontal band — text left, wide image right (reference layout) */}
        <section
          className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2 border-b border-white/[0.07] bg-[#090909]"
          aria-labelledby="about-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full border border-white/[0.1] sm:h-32 sm:w-32 md:top-12 md:h-36 md:w-36" />
            <div className="absolute left-2 top-14 h-16 w-16 rounded-full border border-white/[0.06] sm:top-16 md:h-24 md:w-24" />
            <div className="absolute -right-[18%] top-1/2 hidden h-[min(95vw,380px)] w-[min(95vw,380px)] -translate-y-1/2 rotate-45 border border-white/[0.07] md:block" />
            <div className="absolute inset-0 grid-bg opacity-[0.06]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/35 to-transparent md:h-32" />
            <div className="absolute -bottom-20 right-[10%] h-56 w-56 rounded-full bg-[#22C55E]/[0.07] blur-[90px]" />
          </div>

          <div className="relative z-10 container-wide flex flex-col gap-10 py-12 md:flex-row md:items-center md:gap-12 md:py-16 lg:gap-16 lg:py-20">
            <div className="min-w-0 flex-1 text-left">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50 md:text-xs">
                Est. 2017
              </p>
              <h1 id="about-hero-heading" className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#F5F5F5] sm:text-5xl lg:text-6xl">
                <span className="block text-lg font-semibold tracking-tight text-white/70 sm:text-xl md:mb-1">
                  About Virtual Customer Solution
                </span>
                <span className="mt-2 block sm:mt-3">
                  8+ Years of{' '}
                  <span className="text-[#22C55E]">Getting It Done</span>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
                200+ clients across 15+ countries rely on us to handle the work that matters.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                We were born from a simple idea — businesses shouldn&apos;t have to choose between great marketing and
                affordable virtual talent. One team, one roof.
              </p>
            </div>

            <div className="relative w-full shrink-0 md:w-[min(52%,520px)] lg:w-[min(46%,580px)]">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#0f0f0f] shadow-[0_24px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04] md:rounded-2xl">
                {/* Anchor crop to top; gradient masks bottom edge */}
                <Image
                  src="/images/about-dashboard-hero.png"
                  alt="Virtual Customer Solution — analytics and global operations"
                  fill
                  className="object-cover object-top origin-top scale-[1.08] sm:scale-110"
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-14 bg-gradient-to-t from-[#090909] via-[#090909]/70 to-transparent sm:h-16"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container-wide pt-16 md:pt-20">
          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <h2 className="font-display text-3xl font-bold text-text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Virtual Customer Solution was born from a simple idea — businesses shouldn't have to choose between great IT solutions and affordable virtual talent. We combined both into one powerful solution.
                </p>
                <p>
                  What started as a small virtual staffing operation has grown into a full-service agency handling marketing, web development, and operations support for 200+ clients in 15+ countries.
                </p>
                <p>
                  We saw businesses struggling to manage multiple vendors — one for marketing, another for staff, another for web design. The complexity was killing their growth. We fixed that by bringing everything under one roof.
                </p>
                <p>
                  Today, we're the ONLY agency that offers marketing + virtual staff in one package. Our clients save 50-75% compared to hiring these services separately — and they get better results because everything works together.
                </p>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
              <div className="relative -mx-2 mb-8 h-32 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] sm:h-36 md:mx-0">
                <Image
                  src="/Virtual.png"
                  alt="Virtual Customer Solution logo"
                  fill
                  className="object-contain object-center p-6"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-4">
                Our Mission
              </h3>
              <p className="text-text-secondary mb-6">
                Help businesses stop overpaying for marketing and virtual staff by putting both under one roof — with people who actually care about results.
              </p>
              <h3 className="font-display text-xl font-bold text-text-primary mb-4">
                Where We're Headed
              </h3>
              <p className="text-text-secondary">
                We want to be the first call when a business needs to grow but doesn't want to deal with five different agencies to make it happen.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-20">
            <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-4">
              Our Services
            </h2>
            <p className="text-text-secondary text-center mb-10 max-w-2xl mx-auto leading-relaxed">
              Full-stack digital capabilities — from search and paid media to web builds and AI-enabled workflows — delivered under one roof.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {servicesOffered.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-[#22C55E]/25 hover:bg-white/[0.05]"
                >
                  <Check className="h-5 w-5 shrink-0 text-[#22C55E]" aria-hidden />
                  <span className="font-medium text-text-primary">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-8">
              <a
                href="/services"
                className="text-sm font-semibold text-[#22C55E] hover:text-[#4ADE80] transition-colors"
              >
                Explore the full service catalog →
              </a>
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <FadeUp key={value.title} delay={index * 0.1}>
                  <GlassCard className="p-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {value.description}
                    </p>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-4">
              Meet Our Team
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              Our dedicated team is committed to your success. Each member brings expertise in their field to deliver exceptional results.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <FadeUp key={member.name} delay={index * 0.1}>
                  <GlassCard className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/[0.06] border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-[#22C55E]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#22C55E] text-sm font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-text-muted text-sm">
                      {member.description}
                    </p>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
              Ready to Grow With Us?
            </h2>
            <p className="text-text-secondary mb-6">
              Let's discuss how we can help your business reach its full potential.
            </p>
            <a
              href={FREE_AUDIT_CONTACT_HREF}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#4ADE80] text-black font-semibold px-8 py-4 rounded-lg transition-colors duration-300"
            >
              🎯 Get Your FREE Digital Audit
            </a>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
