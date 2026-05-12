"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Globe,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  Award,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
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

/* ── dark tooltip ────────────────────────────────────── */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black border border-[rgba(255,255,255,0.1)] px-4 py-3 rounded-lg text-sm shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-white/70">
          <span
            style={{ color: entry.color }}
            className="font-mono font-semibold"
          >
            ${entry.value.toLocaleString()}
          </span>{" "}
          {entry.name}
        </p>
      ))}
    </div>
  );
}

/* ── constants ──────────────────────────────────────── */

const projectTypes = [
  { value: "web-dev", label: "Web Development" },
  { value: "mobile-dev", label: "Mobile Development" },
  { value: "design", label: "UI/UX Design" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "data", label: "Data Engineering" },
  { value: "devops", label: "DevOps / Cloud" },
];

const skillLevels = [
  { value: "junior", label: "Junior", multiplier: 0.6 },
  { value: "mid", label: "Mid-Level", multiplier: 1.0 },
  { value: "senior", label: "Senior", multiplier: 1.5 },
];

const locations = [
  { value: "us-uk", label: "US / UK / AU", multiplier: 1.0, flag: "🇺🇸" },
  {
    value: "eastern-europe",
    label: "Eastern Europe",
    multiplier: 0.42,
    flag: "🇵🇱",
  },
  {
    value: "south-asia",
    label: "South Asia",
    multiplier: 0.28,
    flag: "🇮🇳",
  },
  {
    value: "southeast-asia",
    label: "Southeast Asia",
    multiplier: 0.32,
    flag: "🇵🇭",
  },
  {
    value: "latin-america",
    label: "Latin America",
    multiplier: 0.40,
    flag: "🇧🇷",
  },
];

// Base monthly rates per project type (US mid-level)
const baseRates: Record<string, number> = {
  "web-dev": 8500,
  "mobile-dev": 9200,
  design: 7200,
  marketing: 6800,
  data: 9800,
  devops: 10200,
};

/* ── page ───────────────────────────────────────────── */

export default function RemoteTeamCostCalculatorPage() {
  const [projectType, setProjectType] = useState("web-dev");
  const [teamMembers, setTeamMembers] = useState(5);
  const [skillLevel, setSkillLevel] = useState("mid");
  const [location, setLocation] = useState("south-asia");
  const [calculated, setCalculated] = useState(false);

  const baseRate = baseRates[projectType] || 8500;
  const skill = skillLevels.find((s) => s.value === skillLevel) || skillLevels[1];
  const loc = locations.find((l) => l.value === location) || locations[2];
  const usRef = locations[0];

  // US rate (for comparison)
  const usMonthlyPerPerson = baseRate * skill.multiplier;
  const usMonthlyCost = usMonthlyPerPerson * teamMembers;
  const usAnnualCost = usMonthlyCost * 12;

  // Remote rate
  const remoteMonthlyPerPerson = baseRate * skill.multiplier * loc.multiplier;
  const remoteMonthlyCost = remoteMonthlyPerPerson * teamMembers;
  const remoteAnnualCost = remoteMonthlyCost * 12;

  // Savings
  const monthlySavings = usMonthlyCost - remoteMonthlyCost;
  const annualSavings = usAnnualCost - remoteAnnualCost;
  const savingsPercent =
    usMonthlyCost > 0 ? Math.round((monthlySavings / usMonthlyCost) * 100) : 0;

  // Cost range (+-15%)
  const monthlyLow = Math.round(remoteMonthlyCost * 0.85);
  const monthlyHigh = Math.round(remoteMonthlyCost * 1.15);

  // Chart data for visual bar comparison
  const chartData = [
    {
      category: "Monthly Cost",
      "US Rate": usMonthlyCost,
      "Remote Rate": remoteMonthlyCost,
    },
    {
      category: "Annual Cost",
      "US Rate": usAnnualCost,
      "Remote Rate": remoteAnnualCost,
    },
  ];

  // Per-member comparison for bar chart
  const perMemberChart = locations.map((l) => ({
    name: l.label,
    cost: Math.round(baseRate * skill.multiplier * l.multiplier),
    fill:
      l.value === location
        ? "#22C55E"
        : l.value === "us-uk"
          ? "#334155"
          : "#1E40AF",
  }));

  const reset = useCallback(() => {
    setProjectType("web-dev");
    setTeamMembers(5);
    setSkillLevel("mid");
    setLocation("south-asia");
    setCalculated(false);
  }, []);

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
              <Users className="w-4 h-4" />
              Free Tool
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Remote Team Cost{" "}
              <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Compare remote team costs by project type, skill level, and
              location. See detailed savings vs US rates with interactive charts.
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
                Team Configuration
              </h2>
              <button
                onClick={reset}
                className="text-xs text-white/60 hover:text-[#22C55E] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Briefcase className="w-4 h-4 text-[#22C55E]" />
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-lg bg-black border border-[rgba(255,255,255,0.1)] text-white px-4 py-2.5 text-sm focus:border-[#22C55E] focus:outline-none transition-colors"
                >
                  {projectTypes.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Members Slider */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Users className="w-4 h-4 text-[#22C55E]" />
                  Number of Team Members
                </label>
                <input
                  type="number"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(Number(e.target.value))}
                  min={1}
                  max={50}
                />
                <input
                  type="range"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1</span>
                  <span className="font-mono font-semibold text-white">
                    {teamMembers} {teamMembers === 1 ? "member" : "members"}
                  </span>
                  <span>50</span>
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Award className="w-4 h-4 text-[#22C55E]" />
                  Skill Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {skillLevels.map((sl) => (
                    <button
                      key={sl.value}
                      type="button"
                      onClick={() => setSkillLevel(sl.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                        skillLevel === sl.value
                          ? "bg-[rgba(34,197,94,0.15)] border-[#22C55E] text-[#22C55E]"
                          : "bg-black border-[rgba(255,255,255,0.08)] text-white/60 hover:border-[#64748B]"
                      }`}
                    >
                      {sl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <MapPin className="w-4 h-4 text-[#22C55E]" />
                  Remote Team Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {locations
                    .filter((l) => l.value !== "us-uk")
                    .map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => setLocation(l.value)}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                          location === l.value
                            ? "bg-[rgba(34,197,94,0.15)] border-[#22C55E] text-[#22C55E]"
                            : "bg-black border-[rgba(255,255,255,0.08)] text-white/60 hover:border-[#64748B]"
                        }`}
                      >
                        <span>{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                </div>
              </div>

              <button
                onClick={() => setCalculated(true)}
                className="btn-primary w-full gap-2"
              >
                <Users className="w-4 h-4" />
                Compare Costs
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
              Cost Comparison
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
                  {/* Savings banner */}
                  <div className="card-accent p-6 text-center">
                    <div className="text-sm text-white/60 mb-1">
                      Annual Savings vs US Rates
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-[#10B981]">
                      <AnimatedNumber value={annualSavings} prefix="$" />
                    </div>
                    <div className="text-sm text-white/40 mt-1">
                      <span className="font-mono font-semibold text-[#10B981]">
                        {savingsPercent}%
                      </span>{" "}
                      cost reduction
                    </div>
                  </div>

                  {/* Cost range + comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-accent p-4">
                      <div className="text-xs text-white/60 mb-2">
                        Monthly Cost Range
                      </div>
                      <div className="text-lg font-bold text-white font-mono">
                        ${monthlyLow.toLocaleString()} - $
                        {monthlyHigh.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/40">
                        {teamMembers} {skill.label} {loc.label}
                      </div>
                    </div>
                    <div className="card-accent p-4">
                      <div className="text-xs text-white/60 mb-2">
                        Annual Cost
                      </div>
                      <div className="text-lg font-bold text-[#22C55E] font-mono">
                        <AnimatedNumber
                          value={remoteAnnualCost}
                          prefix="$"
                        />
                      </div>
                      <div className="text-xs text-white/40">
                        vs ${usAnnualCost.toLocaleString()} US
                      </div>
                    </div>
                  </div>

                  {/* Bar chart comparing locations */}
                  <div>
                    <div className="text-sm font-semibold text-white/70 mb-3">
                      Monthly Cost per Member by Location
                    </div>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={perMemberChart}
                          layout="vertical"
                          margin={{ left: 10, right: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                          />
                          <XAxis
                            type="number"
                            stroke="#64748B"
                            fontSize={11}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#64748B"
                            fontSize={10}
                            width={100}
                          />
                          <Tooltip content={<DarkTooltip />} />
                          <Bar
                            dataKey="cost"
                            name="Monthly / Person"
                            radius={[0, 4, 4, 0]}
                          >
                            {perMemberChart.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Savings percentage visual bar */}
                  <div className="card-accent p-4">
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span>Savings Percentage</span>
                      <span className="font-mono font-semibold text-[#10B981]">
                        {savingsPercent}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${savingsPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#22C55E]"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div className="p-4 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 shrink-0" />
                      <p className="text-xs text-white/60">
                        Rates include collaboration tools, project management,
                        and dedicated team management. Location:{" "}
                        <span className="font-semibold text-white">
                          {loc.flag} {loc.label}
                        </span>
                        . Project:{" "}
                        <span className="font-semibold text-white">
                          {projectTypes.find((p) => p.value === projectType)?.label}
                        </span>
                        . Level:{" "}
                        <span className="font-semibold text-white">
                          {skill.label}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <Link href={FREE_AUDIT_CONTACT_HREF} className="btn-primary w-full gap-2">
                    Get Your Custom Cost Analysis
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
                    <Users className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm max-w-xs">
                    Configure your team details and click &quot;Compare
                    Costs&quot; to see a detailed cost comparison with visual
                    charts.
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
