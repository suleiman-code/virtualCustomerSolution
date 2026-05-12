"use client";

import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  DollarSign,
  TrendingUp,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

/* ── data ───────────────────────────────────────────── */

const adoptionData = [
  { year: "2019", rate: 5.7 },
  { year: "2020", rate: 34.2 },
  { year: "2021", rate: 27.6 },
  { year: "2022", rate: 24.5 },
  { year: "2023", rate: 28.2 },
  { year: "2024", rate: 32.6 },
  { year: "2025", rate: 36.2 },
];

const productivityData = [
  { category: "Fully Virtual", productivity: 77, satisfaction: 85, retention: 91 },
  { category: "Hybrid", productivity: 71, satisfaction: 78, retention: 84 },
  { category: "In-Office", productivity: 64, satisfaction: 62, retention: 72 },
];

const industryBreakdown = [
  { name: "Technology", value: 67, color: "#22C55E" },
  { name: "Marketing", value: 58, color: "#10B981" },
  { name: "Finance", value: 38, color: "#F59E0B" },
  { name: "Education", value: 29, color: "#8B5CF6" },
  { name: "Healthcare", value: 15, color: "#EC4899" },
  { name: "Other", value: 22, color: "#64748B" },
];

const costSavingsData = [
  { name: "Office Space", value: 35, color: "#22C55E" },
  { name: "Commute", value: 25, color: "#10B981" },
  { name: "Utilities", value: 15, color: "#F59E0B" },
  { name: "Equipment", value: 10, color: "#8B5CF6" },
  { name: "Other", value: 15, color: "#64748B" },
];

const industryData = [
  { industry: "Tech", remote: 67, hybrid: 22, office: 11 },
  { industry: "Finance", remote: 38, hybrid: 41, office: 21 },
  { industry: "Healthcare", remote: 15, hybrid: 30, office: 55 },
  { industry: "Education", remote: 29, hybrid: 38, office: 33 },
  { industry: "Marketing", remote: 58, hybrid: 28, office: 14 },
  { industry: "Legal", remote: 32, hybrid: 40, office: 28 },
];

const savingsOverTime = [
  { year: "2020", perEmployee: 8200 },
  { year: "2021", perEmployee: 9400 },
  { year: "2022", perEmployee: 10800 },
  { year: "2023", perEmployee: 11500 },
  { year: "2024", perEmployee: 12300 },
  { year: "2025", perEmployee: 13100 },
];

const keyStats = [
  { label: "Virtual Workers Globally", value: "98M+", icon: Users },
  {
    label: "Avg. Cost Savings / Employee",
    value: "$13.1K",
    icon: DollarSign,
  },
  { label: "Productivity Increase", value: "+22%", icon: TrendingUp },
  { label: "Companies Offering Virtual", value: "64%", icon: Building2 },
];

/* ── dark tooltip ────────────────────────────────────── */

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
            {typeof entry.value === "number" && entry.value > 100
              ? `$${entry.value.toLocaleString()}`
              : `${entry.value}%`}
          </span>{" "}
          {entry.name}
        </p>
      ))}
    </div>
  );
}

function DarkPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-black border border-[rgba(255,255,255,0.1)] px-4 py-3 rounded-lg text-sm shadow-xl">
      <p className="font-semibold text-white">{d.name}</p>
      <p className="font-mono text-[#22C55E]">{d.value}%</p>
    </div>
  );
}

/* ── page ───────────────────────────────────────────── */

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function RemoteWorkStatisticsPage() {
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
              <Users className="w-4 h-4" />
              Workforce Research
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Virtual Work Statistics{" "}
              <span className="text-gradient">2025</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              A deep dive into virtual work adoption, productivity
              metrics, and cost savings data from over 2,400 data points
              across 12 industries.
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
                <Icon className="w-5 h-5 text-[#22C55E] mx-auto mb-2" />
                <div className="font-mono text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 1. Adoption Rate Line Chart (responsive) */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Virtual Work Adoption Rate (2019-2025)
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Percentage of workforce working remotely. The 2020 spike reflects
            pandemic-driven adoption, with sustained growth continuing into
            2025.
          </p>
          <div className="h-[280px] sm:h-[340px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adoptionData}>
                <defs>
                  <linearGradient id="adoptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Adoption Rate"
                  stroke="#22C55E"
                  strokeWidth={3}
                  fill="url(#adoptionGrad)"
                  dot={{
                    fill: "#22C55E",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#000000",
                  }}
                  activeDot={{ r: 7, stroke: "#22C55E", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 2. Productivity Bar Chart (responsive) */}
      <section className="container-wide pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Productivity, Satisfaction & Retention by Work Model
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Self-reported productivity index, employee satisfaction, and
            retention rates across work arrangements.
          </p>
          <div className="h-[280px] sm:h-[340px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} barGap={6}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis dataKey="category" stroke="#64748B" fontSize={12} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                <Bar
                  dataKey="productivity"
                  name="Productivity"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="satisfaction"
                  name="Satisfaction"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="retention"
                  name="Retention"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 3. Industry Breakdown Pie Chart (responsive) */}
      <section className="container-wide pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Virtual Work by Industry
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Percentage of employees working remotely by industry sector
            </p>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    dataKey="value"
                    stroke="none"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {industryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkPieTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                </PieChart>
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
              Cost Savings Breakdown
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Where companies save the most with virtual teams
            </p>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costSavingsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    dataKey="value"
                    stroke="none"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {costSavingsData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkPieTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Industry stacked bar + savings line */}
      <section className="container-wide pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Work Model Distribution by Industry
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Percentage of employees in each work arrangement
            </p>
            <div className="h-[280px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData} layout="vertical" barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    type="number"
                    stroke="#64748B"
                    fontSize={12}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="industry"
                    stroke="#64748B"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                  <Bar
                    dataKey="remote"
                    name="Remote"
                    fill="#22C55E"
                    radius={[0, 0, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="hybrid"
                    name="Hybrid"
                    fill="#4ADE80"
                    radius={[0, 0, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="office"
                    name="In-Office"
                    fill="#334155"
                    radius={[0, 4, 4, 0]}
                    stackId="a"
                  />
                </BarChart>
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
              Savings per Employee Over Time
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Annual cost savings per virtual employee (USD)
            </p>
            <div className="h-[280px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsOverTime}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="perEmployee"
                    name="Savings"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{
                      fill: "#10B981",
                      r: 5,
                      strokeWidth: 2,
                      stroke: "#000000",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-16">
        <div className="glass-panel p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Build Your Virtual Team?
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Our virtual workforce solutions can help you tap into global talent
            while reducing costs by up to 60%.
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
