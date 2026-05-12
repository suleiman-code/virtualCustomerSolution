'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { FREE_AUDIT_CONTACT_HREF } from '@/lib/paths';
import type { ServiceCategory } from '@/lib/services-page-data';
import { cn } from '@/lib/utils';

type Props = {
  categories: ServiceCategory[];
  /** Rendered after the hero (e.g. Mongo-backed offering tiles). */
  belowHero?: ReactNode;
};

export function ServicesPageView({ categories, belowHero }: Props) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const active = useMemo(
    () => categories.find((c) => c.id === activeId) ?? categories[0],
    [categories, activeId]
  );

  useEffect(() => {
    if (!active) return;
    setOpenItems((prev) => {
      const next = { ...prev };
      active.items.forEach((item) => {
        if (next[item.name] === undefined) next[item.name] = false;
      });
      return next;
    });
  }, [active]);

  if (!active) return null;

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
            Service catalog
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mt-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl"
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#059669] bg-clip-text text-transparent">
              scale
            </span>
            <br className="hidden sm:block" />
            <span className="text-[var(--text-primary)]">without the overhead</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
          >
            Marketing, virtual teams, web, and growth — organized so you can explore fast, then move
            straight into a free audit when you&apos;re ready.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href={FREE_AUDIT_CONTACT_HREF}
              className="inline-flex items-center rounded-full bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_28px_rgba(34,197,94,0.25)] transition hover:bg-[#4ADE80]"
            >
              Free audit
            </Link>
          </motion.div>
        </header>
      </div>

      {belowHero ? <div className="relative z-10">{belowHero}</div> : null}

      <div className="container-wide relative z-10">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition-all',
                activeId === cat.id
                  ? 'border-[#22C55E]/50 bg-[#22C55E]/15 text-[#F5F5F5] shadow-[#22C55E]/10'
                  : 'border-white/10 bg-[#0C0C0C]/80 text-[#A1A1AA] backdrop-blur-sm'
              )}
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-white/[0.06] via-[#0A0A0A] to-[#050505] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-10">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#22C55E]/[0.07] blur-3xl" />
                  <div className="relative">
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:mb-5">
                      <span className="text-4xl md:text-5xl" aria-hidden>
                        {active.icon}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                        {active.items.length} line items
                      </span>
                    </div>
                    <h2 className="text-center font-display text-2xl font-bold text-[var(--text-primary)] md:text-4xl">
                      {active.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--text-secondary)] md:text-lg">
                      {active.description}
                    </p>

                    <ul className="mt-10 space-y-3" role="list">
                      {active.items.map((item) => {
                        const open = openItems[item.name] ?? false;
                        return (
                          <li
                            key={item.name}
                            className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050505]/50 backdrop-blur-sm transition-colors hover:border-[#22C55E]/20"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenItems((p) => ({ ...p, [item.name]: !open }))
                              }
                              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.03] md:px-5 md:py-4"
                              aria-expanded={open}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#059669]/10 text-[#22C55E] ring-1 ring-[#22C55E]/20">
                                  <Check className="h-4 w-4" />
                                </span>
                                <span className="font-medium text-[var(--text-primary)]">
                                  {item.name}
                                </span>
                              </span>
                              <ChevronDown
                                className={cn(
                                  'h-5 w-5 shrink-0 text-[#71717A] transition-transform duration-300',
                                  open && 'rotate-180'
                                )}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {open && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <p className="border-t border-white/[0.06] px-4 pb-4 pl-[4.5rem] pr-5 pt-3 text-sm leading-relaxed text-[var(--text-muted)] md:pl-[4.75rem]">
                                    {item.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-[#22C55E]/25 bg-gradient-to-br from-[#22C55E]/12 via-[#0A0A0A] to-[#050505] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,197,94,0.12),transparent_50%)]" />
                  <div className="relative max-w-lg">
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                      Start with {active.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] md:text-base">
                      Tell us your goals — we&apos;ll map the right mix of services and follow up with
                      next steps.
                    </p>
                  </div>
                  <Link
                    href={FREE_AUDIT_CONTACT_HREF}
                    className="relative mt-5 inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#22C55E] px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_32px_rgba(34,197,94,0.35)] transition hover:bg-[#4ADE80] md:mt-0 md:w-auto"
                  >
                    Book a free call
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
        </div>

        <footer className="relative mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080808] px-6 py-14 text-center md:mt-28 md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_65%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              Not sure where to begin?
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">
              Get a free digital audit — we&apos;ll recommend a practical package for your stage and
              budget.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={FREE_AUDIT_CONTACT_HREF}
                className="inline-flex items-center justify-center rounded-full bg-[#22C55E] px-8 py-4 text-sm font-bold text-black transition hover:bg-[#4ADE80]"
              >
                Get your free digital audit
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-[#F5F5F5] transition hover:border-[#22C55E]/40 hover:bg-[#22C55E]/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
