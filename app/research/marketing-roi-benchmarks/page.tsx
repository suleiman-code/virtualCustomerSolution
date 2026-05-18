"use client";

import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── data ───────────────────────────────────────────── */

const roiByChannel = [
  { channel: "SEO", roi: 748, industry: 520 },
  { channel: "Email", roi: 642, industry: 480 },
  { channel: "Content", roi: 538, industry: 410 },
  { channel: "PPC", roi: 412, industry: 350 },
  { channel: "Social", roi: 328, industry: 280 },
];

const trendData = [
  { quarter: "Q1 2023", SEO: 580, PPC: 340, Social: 210, Email: 510, Content: 420 },
  { quarter: "Q2 2023", SEO: 620, PPC: 360, Social: 240, Email: 540, Content: 450 },
  { quarter: "Q3 2023", SEO: 660, PPC: 380, Social: 270, Email: 570, Content: 470 },
  { quarter: "Q4 2023", SEO: 690, PPC: 390, Social: 290, Email: 600, Content: 490 },
  { quarter: "Q1 2024", SEO: 710, PPC: 395, Social: 300, Email: 620, Content: 510 },
  { quarter: "Q2 2024", SEO: 730, PPC: 400, Social: 310, Email: 630, Content: 520 },
  { quarter: "Q3 2024", SEO: 740, PPC: 408, Social: 320, Email: 638, Content: 530 },
  { quarter: "Q4 2024", SEO: 748, PPC: 412, Social: 328, Email: 642, Content: 538 },
];

const radarData = [
  { metric: "ROI", SEO: 95, PPC: 65, Social: 52, Email: 88, Content: 78 },
  { metric: "Scalability", SEO: 90, PPC: 80, Social: 75, Email: 70, Content: 85 },
  { metric: "Speed", SEO: 30, PPC: 95, Social: 70, Email: 80, Content: 40 },
  { metric: "Longevity", SEO: 95, PPC: 20, Social: 40, Email: 60, Content: 90 },
  { metric: "Cost Eff.", SEO: 88, PPC: 55, Social: 65, Email: 92, Content: 80 },
  { metric: "Targeting", SEO: 70, PPC: 90, Social: 85, Email: 95, Content: 60 },
];

const costPerLead = [
  { channel: "SEO", cost: 14 },
  { channel: "Email", cost: 18 },
  { channel: "Content", cost: 22 },
  { channel: "Social", cost: 38 },
  { channel: "PPC", cost: 52 },
];

const channelColors: Record<string, string> = {
  SEO: "#22C55E",
  PPC: "#F59E0B",
  Social: "#8B5CF6",
  Email: "#10B981",
  Content: "#EC4899",
};

/* ── dark tooltips ──────────────────────────────────── */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black border border-[rgba(255,255,255,0.1)] px-4 py-3 rounded-lg text-sm shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-white/70">
          <span
            style={{ color: entry.color || entry.stroke }}
            className="font-mono font-semibold"
          >
            {entry.name === "cost" || entry.dataKey === "cost"
              ? `$${entry.value}`
              : `${entry.value}%`}
          </span>{" "}
          {entry.name}
        </p>
      ))}
    </div>
  );
}

/* ── page ───────────────────────────────────────────── */

export default function MarketingROIBenchmarksPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden section-padding pb-8">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-wide relative z-10">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#22C55E] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Research
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="badge mb-4 w-fit">
              <Target className="w-4 h-4" />
              Marketing Research
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Marketing ROI Benchmarks{" "}
              <span className="text-gradient">by Channel</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Detailed ROI comparison across five major marketing channels,
              based on survey data from over 850 companies. Featuring grouped
              bar charts, area trend charts, and radar comparisons.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key metrics */}
      <section className="container-wide pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {roiByChannel.map((ch, i) => (
            <motion.div
              key={ch.channel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card-accent p-5 text-center"
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ background: channelColors[ch.channel] }}
              />
              <div className="text-xs text-white/60 mb-1">{ch.channel}</div>
              <div className="font-mono text-2xl font-bold text-white">
                {ch.roi}%
              </div>
              <div className="text-xs text-white/40">avg. ROI</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 1. Grouped Bar: ROI by Channel vs Industry */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            ROI by Channel vs Industry Average
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Our clients&apos; results compared to industry benchmarks
          </p>
          <div className="h-[280px] sm:h-[340px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiByChannel} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis dataKey="channel" stroke="#64748B" fontSize={12} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                <Bar
                  dataKey="roi"
                  name="Our Clients"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="industry"
                  name="Industry Avg"
                  fill="#334155"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 2. Area Chart: ROI Trends Over Time */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            ROI Trends Over Time
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Quarterly ROI performance across channels (2023-2024)
          </p>
          <div className="h-[280px] sm:h-[340px] md:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  {Object.entries(channelColors).map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`grad-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis dataKey="quarter" stroke="#64748B" fontSize={11} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                {Object.entries(channelColors).map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#grad-${key})`}
                    dot={false}
                    activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 3. Radar + Cost per Lead */}
      <section className="container-wide pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Channel Strengths Comparison
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Multi-factor analysis across key performance dimensions
            </p>
            <div className="h-[300px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                >
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    stroke="#64748B"
                    fontSize={11}
                  />
                  <PolarRadiusAxis stroke="#64748B" fontSize={10} />
                  <Radar
                    name="SEO"
                    dataKey="SEO"
                    stroke="#22C55E"
                    fill="#22C55E"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="PPC"
                    dataKey="PPC"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Email"
                    dataKey="Email"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Cost per Lead by Channel
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Average cost to acquire a single qualified lead
            </p>
            <div className="h-[300px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costPerLead} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    type="number"
                    stroke="#64748B"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    stroke="#64748B"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-black border border-[rgba(255,255,255,0.1)] px-4 py-3 rounded-lg text-sm shadow-xl">
                          <p className="font-semibold text-white">
                            {label}
                          </p>
                          <p className="font-mono text-[#22C55E]">
                            ${payload[0].value} / lead
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="cost"
                    name="Cost per Lead"
                    radius={[0, 4, 4, 0]}
                    fill="#22C55E"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-16">
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Maximize Your Marketing ROI
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Let our team analyze your current marketing mix and identify
            opportunities to improve your returns.
          </p>
          <Link href={FREE_AUDIT_CONTACT_HREF} className="btn-primary gap-2">
            Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
