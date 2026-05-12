'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Brain, Zap, MessageSquare, Workflow, ArrowRight } from 'lucide-react';
import { RevealOnScroll, StaggerChildren, StaggerItem, MagneticHover } from '@/components/animations/ScrollAnimations';

const services = [
  {
    icon: Brain,
    title: 'AI-Powered CX',
    description: 'We set up chatbots and smart support tools that handle your customers while your team sleeps.',
    gradient: 'from-[#22C55E] to-black',
    features: ['AI Chatbots', 'Sentiment Analysis', 'Predictive Support', 'Smart Routing'],
    size: 'large',
  },
  {
    icon: Workflow,
    title: 'Digital Engineering',
    description: 'Websites, apps, APIs — we build the stuff that runs your business.',
    gradient: 'from-[#22C55E] to-[#059669]',
    features: ['Custom Development', 'API Integration', 'Web Apps', 'DevOps'],
    size: 'small',
  },
  {
    icon: MessageSquare,
    title: 'Virtual Workforce',
    description: 'Need a VA, support agent, or marketer? We\'ve got trained staff ready to start this week.',
    gradient: 'from-[#059669] to-[#22C55E]',
    features: ['Virtual Assistants', 'Tech Support', 'Sales & Marketing', '24/7 Coverage'],
    size: 'medium',
  },
  {
    icon: Zap,
    title: 'Digital Marketing',
    description: 'SEO, Google Ads, social media — we run your campaigns and report real numbers, not vanity metrics.',
    gradient: 'from-[#22C55E] to-black',
    features: ['SEO & PPC', 'Social Media', 'Content Strategy', 'Analytics'],
    size: 'small',
  },
];

export function PillarsSection() {
  const router = useRouter();

  return (
    <section
      id="what-we-do"
      className="section-padding relative scroll-mt-[calc(var(--site-header-height)+1rem)] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[150px]" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <RevealOnScroll variant="fade-up" duration={0.8} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-[rgba(34,197,94,0.3)] text-[#22C55E] text-sm font-medium mb-4 neon-text neon-border">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F5F5F5] tracking-tight mb-4">
            What We
            <br />
            <span className="text-gradient-lime">Actually Do</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Four core areas where we help businesses cut costs, move faster, and stop leaving money on the table.
          </p>
        </RevealOnScroll>

        {/* Bento Grid */}
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto lg:auto-rows-[200px]">
          {services.map((service, index) => (
            <StaggerItem
              key={service.title}
              className={`
                ${service.size === 'large' ? 'sm:col-span-2 lg:row-span-2' : ''}
                ${service.size === 'medium' ? 'sm:col-span-2 lg:col-span-2 lg:row-span-1' : ''}
                ${service.size === 'small' ? 'sm:col-span-1 lg:col-span-1 lg:row-span-1' : ''}
              `}
            >
            <MagneticHover strength={0.15} className="group relative overflow-hidden rounded-2xl h-full">
              {/* Background Image Placeholder with Hover Zoom */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-[opacity,transform] duration-700 ease-out`}
                />
                {/* Decorative geometric shapes */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.03] group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/[0.02] group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute top-1/2 right-4 w-16 h-16 rotate-45 bg-gradient-to-br ${service.gradient} opacity-[0.07] group-hover:opacity-[0.12] group-hover:scale-110 transition-[opacity,transform] duration-700`} />
              </div>

              {/* Glass Background */}
              <div className="absolute inset-0 glass" />

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent rounded-2xl" />

              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="absolute inset-0 rounded-2xl border border-[rgba(255,255,255,0.06)]" />

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:brightness-110 transition-[transform,filter] duration-700`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#22C55E] group-hover:neon-text-strong transition-colors duration-[400ms]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 flex-grow">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {service.features.slice(0, 3).map((feature) => (
                    <span 
                      key={feature}
                      className="text-xs px-2 py-1 rounded-full bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)] neon-text"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => router.push('/services#offerings')}
                  className="mt-4 flex min-h-[44px] items-center gap-1 text-sm text-[#71717A] transition-colors group/cta hover:text-[#F5F5F5]"
                >
                  Full service list
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </button>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#22C55E]/20 to-[#059669]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </MagneticHover>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
