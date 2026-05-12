"use client";

import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import { ArrowLeft, ArrowRight, TrendingUp, Zap, Clock, Cog } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── data ───────────────────────────────────────────── */

const adoptionByYear = [
  { year: "2020", adoption: 31 },
  { year: "2021", adoption: 39 },
  { year: "2022", adoption: 48 },
  { year: "2023", adoption: 56 },
  { year: "2024", adoption: 64 },
  { year: "2025", adoption: 72 },
];

const timeSavingsData = [
  { process: "Data Entry", before: 40, after: 8 },
  { process: "Invoicing", before: 25, after: 4 },
  { process: "Reporting", before: 30, after: 6 },
  { process: "Email Mktg", before: 20, after: 5 },
  { process: "Customer Svc", before: 35, after: 12 },
  { process: "HR Onboarding", before: 28, after: 10 },
];

const costReductionData = [
  { year: "2020", labor: 12, operations: 8, errors: 15 },
  { year: "2021", labor: 18, operations: 14, errors: 22 },
  { year: "2022", labor: 24, operations: 19, errors: 30 },
  { year: "2023", labor: 30, operations: 24, errors: 38 },
  { year: "2024", labor: 35, operations: 28, errors: 45 },
  { year: "2025", labor: 40, operations: 32, errors: 52 },
];

const automationTypes = [
  { name: "Workflow Automation", value: 32, color: "#22C55E" },
  { name: "AI / ML", value: 24, color: "#059669" },
  { name: "RPA", value: 20, color: "#4ADE80" },
  { name: "Chatbots", value: 14, color: "#86EFAC" },
  { name: "Other", value: 10, color: "#BFDBFE" },
];

const roiTimelineData = [
  { month: "Month 1", roi: -80 },
  { month: "Month 3", roi: -40 },
  { month: "Month 6", roi: 20 },
  { month: "Month 9", roi: 80 },
  { month: "Month 12", roi: 150 },
  { month: "Month 18", roi: 280 },
  { month: "Month 24", roi: 420 },
];

const keyStats = [
  { label: "Businesses Automating", value: "72%", icon: Cog },
  { label: "Avg. Time Saved", value: "34%", icon: Clock },
  { label: "Error Reduction", value: "52%", icon: Zap },
  { label: "ROI in 12 Months", value: "150%", icon: TrendingUp },
];

/* ── tooltip ────────────────────────────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong px-4 py-3 rounded-lg text-sm">
      <p className="font-semibold text-[var(--text-primary)] mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-[var(--text-secondary)]">
          <span style={{ color: entry.color || entry.stroke }} className="font-mono font-semibold">
            {entry.value > 0 ? `${entry.value}%` : `${entry.value}%`}
          </span>{" "}
          {entry.name}
        </p>
      ))}
    </div>
  );
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

/* ── page ───────────────────────────────────────────── */

export default function BusinessAutomationTrendsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden section-padding pb-8">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-wide relative z-10">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--red-primary)] transition-colors mb-8"
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
              <TrendingUp className="w-4 h-4" />
              Technology Research
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Business Automation Trends{" "}
              <span className="text-gradient">2025</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              How businesses are adopting automation technologies, the real
              savings they achieve, and where the industry is headed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="container-wide pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {keyStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fade}
                className="card-accent p-5 text-center"
              >
                <Icon className="w-5 h-5 text-[var(--red-primary)] mx-auto mb-2" />
                <div className="font-mono text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Adoption Trend */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
            Automation Adoption Rate
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Percentage of businesses using at least one automation tool
          </p>
          <div className="h-[300px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adoptionByYear}>
                <defs>
                  <linearGradient id="adoptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="adoption"
                  name="Adoption"
                  stroke="#22C55E"
                  strokeWidth={3}
                  fill="url(#adoptionGrad)"
                  dot={{ fill: "#22C55E", r: 5, strokeWidth: 2, stroke: "#000000" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* Time Savings */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
            Hours per Week: Before vs After Automation
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Average weekly hours spent on each process
          </p>
          <div className="h-[300px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSavingsData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="process" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}h`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="glass-strong px-4 py-3 rounded-lg text-sm">
                        <p className="font-semibold text-[var(--text-primary)] mb-1">{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <p key={i} className="text-[var(--text-secondary)]">
                            <span style={{ color: entry.color }} className="font-mono font-semibold">
                              {entry.value}h/week
                            </span>{" "}
                            {entry.name}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                <Bar dataKey="before" name="Before" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* Cost Reduction + Automation Types */}
      <section className="container-wide pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Cost Reduction Over Time
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Percentage reduction in key cost categories
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costReductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                  <Line type="monotone" dataKey="labor" name="Labor Costs" stroke="#22C55E" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="operations" name="Operations" stroke="#4ADE80" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="errors" name="Error Costs" stroke="#86EFAC" strokeWidth={2} dot={false} />
                </LineChart>
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
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Automation Technologies Used
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Distribution of automation technology adoption
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={automationTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    dataKey="value"
                    stroke="none"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {automationTypes.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="glass-strong px-4 py-3 rounded-lg text-sm">
                          <p className="font-semibold text-[var(--text-primary)]">{d.name}</p>
                          <p className="font-mono text-[var(--red-primary)]">{d.value}%</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Timeline */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
            Automation ROI Timeline
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Typical return on automation investment over 24 months
          </p>
          <div className="h-[300px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiTimelineData}>
                <defs>
                  <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="roi"
                  name="ROI"
                  stroke="#22C55E"
                  strokeWidth={3}
                  fill="url(#roiGrad)"
                  dot={{ fill: "#22C55E", r: 5, strokeWidth: 2, stroke: "#000000" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-16">
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
            Automate Your Business Processes
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
            Discover which processes in your business can benefit most from
            automation and start saving time and money.
          </p>
          <Link href={FREE_AUDIT_CONTACT_HREF} className="btn-primary gap-2">
            Get a Free Growth Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
