'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowDown,
  Calendar,
  Check,
  FileText,
  Globe2,
  Repeat,
  Sparkles,
  TrendingDown,
  UsersRound,
  Zap,
} from 'lucide-react'
import { SiteShell } from '@/components/layout/SiteShell'
import LeadForm from '@/components/LeadForm'
import { SITE_STATS } from '@/lib/site-stats'

// ─── Animated Counter ───────────────────────────────────────────────────────

function Counter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
}: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let startTime: number | null = null
    let frame: number

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts
      const progress = Math.min((ts - startTime) / (duration * 1000), 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

const whatTheyGet = [
  {
    icon: Calendar,
    title: '30-min Strategy Call',
    description:
      'A candid consultation with our workforce experts — no sales pitch, just honest advice.',
  },
  {
    icon: FileText,
    title: 'Custom Cost Breakdown',
    description:
      'Local hiring vs. VCS virtual team. Real numbers, line-by-line. See where the savings are.',
  },
  {
    icon: UsersRound,
    title: 'Matched Candidates',
    description:
      'A short-list of pre-vetted specialists from our bench, ready to interview this week.',
  },
]

const trustSignals = [
  { end: SITE_STATS.clients.value, suffix: SITE_STATS.clients.suffix, label: 'Teams Deployed' },
  { end: SITE_STATS.countries.value, suffix: SITE_STATS.countries.suffix, label: 'Countries' },
  { end: SITE_STATS.retention.value, suffix: SITE_STATS.retention.suffix, label: 'Client Retention' },
  { end: SITE_STATS.foundedYear, suffix: '', label: 'Since', isYear: true },
]

const painPoints = [
  {
    icon: TrendingDown,
    quote:
      'Paying $2,400+/month for chat and support across three vendors when one provider could run it?',
    tag: 'Vendor sprawl',
  },
  {
    icon: Repeat,
    quote:
      'Tired of freelancers who disappear after two weeks and ghost your Slack?',
    tag: 'Retention nightmare',
  },
  {
    icon: Sparkles,
    quote:
      'Need a team but don\u2019t know where to start, what to pay, or who to trust?',
    tag: 'Decision paralysis',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://virtualcustomersolution.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Free Consultation',
      item: 'https://virtualcustomersolution.com/free-consultation',
    },
  ],
}

export default function FreeConsultationPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#22C55E]/[0.08] blur-[140px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#22C55E] backdrop-blur-sm"
          >
            <Zap className="h-3.5 w-3.5 fill-[#22C55E]" />
            100% Free · No Credit Card
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Get a Free{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#4ADE80] via-[#22C55E] to-[#059669] bg-clip-text text-transparent">
                Virtual Team
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute -bottom-1 left-0 right-0 h-1 origin-left rounded-full bg-gradient-to-r from-[#22C55E] to-[#059669] shadow-[0_0_20px_rgba(34,197,94,0.6)]"
              />
            </span>
            <br />
            Consultation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-7 max-w-2xl text-lg text-white/70 sm:text-xl"
          >
            Hiring locally costs <span className="font-bold text-white">3x more</span>.
            We build your virtual team in <span className="font-bold text-[#22C55E]">2 weeks</span>.
          </motion.p>

          <motion.a
            href="#consultation-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-10 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#22C55E]"
          >
            Book your call
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.a>
        </div>
      </section>

      {/* ─── WHAT THEY GET ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
              What you walk away with
            </p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Everything you need to decide
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {whatTheyGet.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-7 backdrop-blur-sm transition-all duration-300 hover:border-[#22C55E]/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.08)]"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TRUST SIGNALS BAR ──────────────────────────────────────────── */}
      <section className="relative py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#22C55E]/20 bg-gradient-to-r from-[#0A0A0A] via-[#0F1A12] to-[#0A0A0A] p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)] sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            <div className="relative z-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {trustSignals.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center md:items-start md:text-left"
                >
                  {stat.isYear ? (
                    <div className="font-display text-4xl font-bold text-white sm:text-5xl">
                      <span className="text-sm font-semibold uppercase tracking-widest text-white/50">
                        {stat.label}{' '}
                      </span>
                      <Counter end={stat.end} duration={1.8} />
                    </div>
                  ) : (
                    <>
                      <div className="font-display text-4xl font-bold text-[#22C55E] sm:text-5xl">
                        <Counter
                          end={stat.end}
                          suffix={stat.suffix}
                          duration={2}
                        />
                      </div>
                      <div className="mt-1 text-sm font-medium uppercase tracking-wider text-white/50">
                        {stat.label}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" />
              Worldwide delivery
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22C55E]" />
              ISO-compliant
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22C55E]" />
              NDA on request
            </span>
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
              Sound familiar?
            </p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              We hear it every week
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {painPoints.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.tag}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A0A0A] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/[0.06] blur-3xl" />
                  <Icon className="mb-4 h-7 w-7 text-red-400/80" />
                  <p className="font-display text-lg font-semibold leading-snug text-white">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300">
                    {item.tag}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── FORM ────────────────────────────────────────────────────────── */}
      <section
        id="consultation-form"
        className="relative scroll-mt-24 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
              Takes 60 seconds
            </p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Book your free call
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Three quick steps. Your data stays with us — never shared, never
              sold.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <LeadForm />
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22C55E]" />
              Response in 24h
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22C55E]" />
              No sales pressure
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22C55E]" />
              Confidential
            </span>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
