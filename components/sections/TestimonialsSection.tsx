'use client';

import { Quote, Star } from 'lucide-react';
import { FadeUp, GlassCard, SignalPoint, StaggerContainer, StaggerItem } from '@/components/ui-dp/AnimatedElements';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { SITE_STATS } from '@/lib/site-stats';

const testimonials = [
  {
    quote:
      'Two live chat agents through VCS — $1,650/month total. Shipping and checkout questions get answered in under two minutes now.',
    author: 'Sarah M.',
    company: 'E-Commerce Owner',
    location: 'USA',
    results: ['$1,650/mo', 'Live Chat'],
    rating: 5,
    timeAgo: '3 weeks ago',
  },
  {
    quote:
      'One support rep on email and Intercom for $980/month. Covers our busiest hours without us hiring locally again.',
    author: 'James R.',
    company: 'SaaS Founder',
    location: 'UK',
    results: ['$980/mo', 'Customer Support'],
    rating: 5,
    timeAgo: '1 week ago',
  },
  {
    quote:
      'SDR placement at $1,200/month. Eleven qualified calls booked in month one — we were not doing outbound ourselves before.',
    author: 'Ahmed K.',
    company: 'Agency Owner',
    location: 'Dubai',
    results: ['$1,200/mo', 'SDR'],
    rating: 5,
    timeAgo: '5 days ago',
  },
  {
    quote:
      'VA plus landing-page tweaks — about $2,100/month. After-hours site chat finally gets replies, so fewer leads go cold.',
    author: 'Lisa T.',
    company: 'Real Estate Tech',
    location: 'Canada',
    results: ['$2,100/mo', 'VA + Web'],
    rating: 5,
    timeAgo: '2 weeks ago',
  },
];

const stats = [
  { value: SITE_STATS.clients.value, suffix: SITE_STATS.clients.suffix, label: 'Clients Served' },
  { value: SITE_STATS.years.value, suffix: SITE_STATS.years.suffix, label: 'Years Running' },
  { value: SITE_STATS.countries.value, suffix: SITE_STATS.countries.suffix, label: 'Countries' },
  { value: SITE_STATS.retention.value, suffix: SITE_STATS.retention.suffix, label: 'Client Retention' },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding relative radial-glow">
      <div className="container-wide">
        {/* Stats Counter Bar */}
        <FadeUp className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[var(--surface-glass)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-[#22C55E] tabular-nums neon-text-strong">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[var(--text-muted)] text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Section Header */}
        <FadeUp className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-[#22C55E] text-sm font-medium uppercase tracking-wider mb-4 block neon-text">
            Client Results
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            What our clients say about working with us.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mt-4 leading-relaxed">
            What our clients say about working with us.
          </p>
        </FadeUp>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <GlassCard className="p-6 h-full flex flex-col">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#22C55E]/30 mb-4 neon-text" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#22C55E] text-[#22C55E]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.quote}"
                </p>

                {/* Results Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {testimonial.results.map((result) => (
                    <span
                      key={result}
                      className="text-xs px-2 py-1 rounded-full bg-[#059669]/10 text-[#22C55E] neon-text"
                    >
                      {result}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-glass)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-glass-strong)] flex items-center justify-center">
                    <span className="text-[#22C55E] font-medium text-sm neon-text">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-[var(--text-primary)] font-medium text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-[var(--text-muted)] text-xs">
                      {testimonial.company}, {testimonial.location}
                    </div>
                    <div className="text-[var(--text-muted)]/70 text-[10px] mt-0.5">
                      {testimonial.timeAgo}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
