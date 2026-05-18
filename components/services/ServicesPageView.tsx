'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FREE_CONSULTATION_CONTACT_HREF } from '@/lib/paths';
import { cn } from '@/lib/utils';

type Props = {
  /** Rendered after the hero (e.g. Mongo-backed offering tiles). */
  belowHero?: ReactNode;
};

export function ServicesPageView({ belowHero }: Props) {
  return (
    <div className="relative overflow-hidden pb-24 pt-10 md:pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#22C55E]/[0.06] blur-[130px] md:h-[520px] md:w-[520px]" />
        <div className="absolute bottom-0 left-[-15%] h-[380px] w-[380px] rounded-full bg-[#059669]/[0.05] blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#0A0A0A]" />
      </div>

      <div className="container-wide relative z-10">
        <header
          className={cn(
            'mx-auto max-w-3xl text-center',
            belowHero ? 'mb-8 md:mb-10' : 'mb-14 md:mb-20'
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#4ADE80]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#22C55E]" />
            What we deliver
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mt-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl"
          >
            One team for{' '}
            <span className="bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#059669] bg-clip-text text-transparent">
              support, staff &amp; growth
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
          >
            Live chat, customer support, virtual staff, marketing, and web — pick what you need
            and we handle delivery so you can focus on your clients.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href={FREE_CONSULTATION_CONTACT_HREF}
              className="inline-flex items-center rounded-full bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_28px_rgba(34,197,94,0.25)] transition hover:bg-[#4ADE80]"
            >
              Free Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#22C55E]/40 hover:bg-[#22C55E]/10"
            >
              Contact us
            </Link>
          </motion.div>
        </header>
      </div>

      {belowHero ? <div className="relative z-10">{belowHero}</div> : null}
    </div>
  );
}
