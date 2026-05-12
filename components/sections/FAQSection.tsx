'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeUp, GlassCard, SignalPoint, StaggerContainer, StaggerItem } from '@/components/ui-dp/AnimatedElements';
import { RevealOnScroll } from '@/components/animations/ScrollAnimations';

const faqs = [
  {
    question: 'What happens after I request a free audit?',
    answer: 'We take a look at your website, ads, and online presence. Within 24 hours, you get a report showing what\'s working, what\'s not, and what to fix first. If you want our help after that, great. If not, the report is yours to keep.',
  },
  {
    question: 'What does your marketing team actually handle?',
    answer: 'The usual stuff — SEO, Google Ads, social media, content, email campaigns. The difference is you get a dedicated person (or team) who actually knows your business, not a revolving door of freelancers.',
  },
  {
    question: 'How does virtual staff work?',
    answer: 'You tell us what role you need — VA, customer support, marketer, whatever. We match you with someone from our trained team. They work your hours, use your tools, and report directly to you. Think of it like hiring, minus the headache.',
  },
  {
    question: 'Do I have to sign a long contract?',
    answer: 'Nope. Everything is month-to-month. Give us 30 days notice if you want to stop. We\'d rather earn your business every month than lock you into something.',
  },
  {
    question: 'Do you work with clients outside Pakistan?',
    answer: 'Most of our clients are actually overseas — US, UK, UAE, Australia, Canada. Our team works across time zones, and we set up communication so it doesn\'t feel like you\'re working with someone in a different country.',
  },
  {
    question: 'How long before I see something happening?',
    answer: 'Depends on what you need. Virtual staff can start within a week. Marketing results usually start showing up in 30-60 days. We\'ll set clear expectations upfront so there are no surprises.',
  },
];

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <RevealOnScroll variant="fade-up" duration={0.8}>
    <section className="section-padding relative bg-white/[0.01] border-y border-white/[0.04]">
      {/* FAQ Schema for Google Rich Results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-narrow">
        {/* Section Header */}
        <FadeUp className="text-center mb-12 relative">
          <span className="text-[#22C55E] text-sm font-medium uppercase tracking-wider mb-4 block neon-text">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Questions we get asked a lot
          </h2>
        </FadeUp>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const itemKey = `faq-${index}`;
            const isOpen = openItems.has(itemKey);

            return (
              <GlassCard key={itemKey} className="overflow-hidden" hover={false}>
                <button
                  onClick={() => toggleItem(itemKey)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                >
                  <span className="font-medium text-[var(--text-primary)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5 transition-transform duration-500 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
    </RevealOnScroll>
  );
}
