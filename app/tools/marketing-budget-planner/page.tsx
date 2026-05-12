"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ArrowLeft,
  ArrowRight,
  PieChart as PieChartIcon,
  DollarSign,
  RotateCcw,
  Lightbulb,
  Target,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── animated number ────────────────────────────────── */

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const startTime = performance.now();
    const startVal = display;
    const diff = value - startVal;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="font-mono">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── allocation presets ─────────────────────────────── */

type Goal =
  | "lead-gen"
  | "brand"
  | "ecommerce"
  | "retention"
  | "thought-leadership";
type Industry =
  | "saas"
  | "ecommerce-ind"
  | "services"
  | "healthcare"
  | "finance"
  | "education";

const goalWeights: Record<Goal, Record<string, number>> = {
  "lead-gen": { SEO: 25, PPC: 30, Content: 20, Social: 10, Email: 15 },
  brand: { SEO: 20, PPC: 10, Content: 30, Social: 30, Email: 10 },
  ecommerce: { SEO: 20, PPC: 35, Content: 10, Social: 25, Email: 10 },
  retention: { SEO: 10, PPC: 10, Content: 20, Social: 20, Email: 40 },
  "thought-leadership": { SEO: 30, PPC: 5, Content: 35, Social: 20, Email: 10 },
};

const industryAdjust: Record<Industry, Record<string, number>> = {
  saas: { SEO: 5, PPC: -5, Content: 5, Social: -5, Email: 0 },
  "ecommerce-ind": { SEO: -5, PPC: 10, Content: -5, Social: 5, Email: -5 },
  services: { SEO: 5, PPC: 0, Content: 5, Social: -5, Email: -5 },
  healthcare: { SEO: 10, PPC: -5, Content: 5, Social: -5, Email: -5 },
  finance: { SEO: 5, PPC: 5, Content: 0, Social: -10, Email: 0 },
  education: { SEO: 5, PPC: -5, Content: 10, Social: 0, Email: -10 },
};

const channelColors: Record<string, string> = {
  SEO: "#22C55E",
  PPC: "#F59E0B",
  Content: "#EC4899",
  Social: "#8B5CF6",
  Email: "#10B981",
};

const channelTips: Record<string, string> = {
  SEO: "Focus on long-tail keywords and technical SEO for sustainable organic growth. Expect 4-6 months for meaningful results.",
  PPC: "Start with branded terms, then expand to high-intent commercial keywords. Test ad copy weekly for best performance.",
  Content:
    "Invest in pillar content and repurpose across channels. Blog posts, case studies, and whitepapers drive long-term value.",
  Social:
    "Choose 2-3 platforms where your audience is most active. Quality over quantity. Prioritize video content for engagement.",
  Email:
    "Build segmented lists and automate drip campaigns. Personalized sequences see 3x higher conversion rates.",
};

const channelExpectedROI: Record<string, string> = {
  SEO: "500-800%",
  PPC: "300-450%",
  Content: "400-600%",
  Social: "250-400%",
  Email: "550-750%",
};

/* ── dark tooltip ────────────────────────────────────── */

function DarkPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-black border border-[rgba(255,255,255,0.1)] px-4 py-3 rounded-lg text-sm shadow-xl">
      <p className="font-semibold text-white">{d.name}</p>
      <p className="font-mono text-[#22C55E]">
        ${d.amount.toLocaleString()} ({d.percent}%)
      </p>
      <p className="text-xs text-white/60 mt-1">
        Expected ROI: {channelExpectedROI[d.name]}
      </p>
    </div>
  );
}

/* ── page ───────────────────────────────────────────── */

export default function MarketingBudgetPlannerPage() {
  const [budget, setBudget] = useState(10000);
  const [goal, setGoal] = useState<Goal>("lead-gen");
  const [industry, setIndustry] = useState<Industry>("saas");
  const [calculated, setCalculated] = useState(false);

  // Calculate allocation
  const base = goalWeights[goal];
  const adj = industryAdjust[industry];
  const rawAllocation = Object.keys(base).reduce(
    (acc, ch) => {
      acc[ch] = Math.max(5, base[ch] + (adj[ch] || 0));
      return acc;
    },
    {} as Record<string, number>
  );
  const total = Object.values(rawAllocation).reduce((a, b) => a + b, 0);
  const allocation = Object.entries(rawAllocation).map(([name, pct]) => ({
    name,
    percent: Math.round((pct / total) * 100),
    amount: Math.round((pct / total) * budget),
    color: channelColors[name],
    tip: channelTips[name],
    roi: channelExpectedROI[name],
  }));

  const reset = useCallback(() => {
    setBudget(10000);
    setGoal("lead-gen");
    setIndustry("saas");
    setCalculated(false);
  }, []);

  const goals: { value: Goal; label: string; icon: string }[] = [
    { value: "lead-gen", label: "Lead Generation", icon: "🎯" },
    { value: "brand", label: "Brand Awareness", icon: "📢" },
    { value: "ecommerce", label: "E-commerce Sales", icon: "🛒" },
    { value: "retention", label: "Customer Retention", icon: "🔄" },
    { value: "thought-leadership", label: "Thought Leadership", icon: "💡" },
  ];

  const industries: { value: Industry; label: string }[] = [
    { value: "saas", label: "SaaS / Tech" },
    { value: "ecommerce-ind", label: "E-commerce" },
    { value: "services", label: "Professional Services" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden section-padding pb-8">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container-wide relative z-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#22C55E] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="badge mb-4 w-fit">
              <PieChartIcon className="w-4 h-4" />
              Free Tool
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Marketing Budget{" "}
              <span className="text-gradient">Planner</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Get a recommended budget allocation across marketing channels
              based on your goals, industry, and total budget. Visualized with
              an interactive pie chart and per-channel tips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="container-wide pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Your Parameters
              </h2>
              <button
                onClick={reset}
                className="text-xs text-white/60 hover:text-[#22C55E] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <DollarSign className="w-4 h-4 text-[#22C55E]" />
                  Monthly Marketing Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="pl-9"
                    min={500}
                  />
                </div>
                <input
                  type="range"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={500}
                  max={100000}
                  step={500}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>$500</span>
                  <span className="font-mono font-semibold text-white">
                    ${budget.toLocaleString()}
                  </span>
                  <span>$100K</span>
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Target className="w-4 h-4 text-[#22C55E]" />
                  Primary Business Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGoal(g.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2 ${
                        goal === g.value
                          ? "bg-[rgba(34,197,94,0.15)] border-[#22C55E] text-[#22C55E]"
                          : "bg-black border-[rgba(255,255,255,0.08)] text-white/60 hover:border-[#64748B]"
                      }`}
                    >
                      <span>{g.icon}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Building2 className="w-4 h-4 text-[#22C55E]" />
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full rounded-lg bg-black border border-[rgba(255,255,255,0.1)] text-white px-4 py-2.5 text-sm focus:border-[#22C55E] focus:outline-none transition-colors"
                >
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setCalculated(true)}
                className="btn-primary w-full gap-2"
              >
                <PieChartIcon className="w-4 h-4" />
                Plan My Budget
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Recommended Allocation
            </h2>

            <AnimatePresence mode="wait">
              {calculated ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {/* Pie Chart */}
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocation}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={60}
                          dataKey="amount"
                          stroke="none"
                          label={({ name, percent }) =>
                            `${name} ${percent}%`
                          }
                          labelLine={false}
                        >
                          {allocation.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<DarkPieTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: 12, color: "#94A3B8" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Channel breakdown cards */}
                  <div className="space-y-3">
                    {allocation.map((ch) => (
                      <div key={ch.name} className="card-accent p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ background: ch.color }}
                            />
                            <span className="text-sm font-semibold text-white">
                              {ch.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-sm font-bold text-white">
                              <AnimatedNumber value={ch.amount} prefix="$" />
                            </span>
                            <span className="text-xs text-white/40 ml-2">
                              {ch.percent}%
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ch.percent}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: ch.color }}
                          />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs text-white/60 flex-1">
                            {ch.tip}
                          </p>
                          <div className="shrink-0 text-right">
                            <div className="text-xs text-white/40">
                              Expected ROI
                            </div>
                            <div
                              className="font-mono text-xs font-semibold"
                              style={{ color: ch.color }}
                            >
                              {ch.roi}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pro tip */}
                  <div className="p-4 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)]">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[#F59E0B] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Pro Tip
                        </p>
                        <p className="text-xs text-white/60">
                          Start with this allocation and adjust after 90 days
                          based on actual performance data. Shift budget toward
                          channels with the highest ROI. Track cost-per-lead and
                          customer acquisition cost for each channel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={FREE_AUDIT_CONTACT_HREF}
                    className="btn-primary w-full gap-2"
                  >
                    Get Expert Budget Optimization
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[500px] text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(34,197,94,0.08)] flex items-center justify-center mb-4">
                    <PieChartIcon className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm max-w-xs">
                    Set your budget, goal, and industry, then click &quot;Plan
                    My Budget&quot; to get your recommended allocation with an
                    interactive pie chart.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
