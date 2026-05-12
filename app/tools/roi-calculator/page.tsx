"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Users,
  Clock,
  Percent,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── CountUp on view ─────────────────────────────────── */

function CountUpOnView({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = performance.now();
    const startVal = 0;
    const diff = value - startVal;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [hasAnimated, value, duration]);

  // Re-animate when value changes after initial animation
  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = performance.now();
    const startVal = display;
    const diff = value - startVal;
    if (Math.abs(diff) < 1) return;

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
    <span ref={ref} className="font-mono">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Progress bar ────────────────────────────────────── */

function ROIProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const color =
    pct < 30 ? "#EF4444" : pct < 60 ? "#F59E0B" : pct < 80 ? "#22C55E" : "#10B981";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white/60 mb-2">
        <span>0%</span>
        <span className="font-mono font-semibold" style={{ color }}>
          {Math.round(value)}% ROI
        </span>
        <span>{max}%+</span>
      </div>
      <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden border border-[rgba(255,255,255,0.06)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ── page ───────────────────────────────────────────── */

export default function ROICalculatorPage() {
  const [spend, setSpend] = useState(5000);
  const [efficiencyGain, setEfficiencyGain] = useState(25);
  const [teamSize, setTeamSize] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [calculated, setCalculated] = useState(false);

  // Calculations
  const hoursPerPersonPerMonth = 160;
  const totalMonthlyHours = teamSize * hoursPerPersonPerMonth;
  const hoursSavedPerMonth = totalMonthlyHours * (efficiencyGain / 100);
  const monthlySavings = hoursSavedPerMonth * hourlyRate;
  const annualSavings = monthlySavings * 12;
  const annualCost = spend * 12;
  const threeYearSavings = annualSavings * 3;
  const threeYearCost = annualCost * 3;
  const threeYearROI =
    threeYearCost > 0
      ? Math.round(((threeYearSavings - threeYearCost) / threeYearCost) * 100)
      : 0;
  const paybackMonths =
    monthlySavings > 0 ? Math.round((spend / monthlySavings) * 10) / 10 : 0;
  const netAnnualGain = annualSavings - annualCost;

  const reset = useCallback(() => {
    setSpend(5000);
    setEfficiencyGain(25);
    setTeamSize(10);
    setHourlyRate(50);
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
              <Calculator className="w-4 h-4" />
              Free Tool
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              ROI <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Estimate your projected return on investment based on your monthly
              spend, efficiency gains, team size, and hourly rate. See annual
              savings, 3-year ROI, and payback period instantly.
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
              <h2 className="text-xl font-bold text-white">Your Metrics</h2>
              <button
                onClick={reset}
                className="text-xs text-white/60 hover:text-[#22C55E] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Monthly Spend */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <DollarSign className="w-4 h-4 text-[#22C55E]" />
                  Monthly Spend (Investment)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    value={spend}
                    onChange={(e) => setSpend(Number(e.target.value))}
                    className="pl-9"
                    min={0}
                  />
                </div>
                <input
                  type="range"
                  value={spend}
                  onChange={(e) => setSpend(Number(e.target.value))}
                  min={500}
                  max={50000}
                  step={500}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>$500</span>
                  <span className="font-mono font-semibold text-white">
                    ${spend.toLocaleString()}
                  </span>
                  <span>$50K</span>
                </div>
              </div>

              {/* Efficiency Gain */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Percent className="w-4 h-4 text-[#22C55E]" />
                  Efficiency Gain (%)
                </label>
                <input
                  type="number"
                  value={efficiencyGain}
                  onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                  step={1}
                  min={1}
                  max={80}
                />
                <input
                  type="range"
                  value={efficiencyGain}
                  onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                  min={1}
                  max={80}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1%</span>
                  <span className="font-mono font-semibold text-white">
                    {efficiencyGain}%
                  </span>
                  <span>80%</span>
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Users className="w-4 h-4 text-[#22C55E]" />
                  Team Size
                </label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  min={1}
                  max={500}
                />
                <input
                  type="range"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1</span>
                  <span className="font-mono font-semibold text-white">
                    {teamSize} people
                  </span>
                  <span>100</span>
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                  <Clock className="w-4 h-4 text-[#22C55E]" />
                  Average Hourly Rate ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="pl-9"
                    min={10}
                    max={500}
                  />
                </div>
                <input
                  type="range"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  min={10}
                  max={200}
                  className="w-full mt-2 accent-[#22C55E] h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>$10</span>
                  <span className="font-mono font-semibold text-white">
                    ${hourlyRate}/hr
                  </span>
                  <span>$200</span>
                </div>
              </div>

              <button
                onClick={() => setCalculated(true)}
                className="btn-primary w-full gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate ROI
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
              Projected Results
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
                  {/* 3-Year ROI hero */}
                  <div className="card-accent p-6 text-center">
                    <div className="text-sm text-white/60 mb-1">
                      3-Year ROI
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-[#22C55E]">
                      <CountUpOnView value={threeYearROI} suffix="%" />
                    </div>
                    <div className="mt-4">
                      <ROIProgressBar value={threeYearROI} max={500} />
                    </div>
                  </div>

                  {/* Key metrics grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-accent p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs text-white/60">
                          Annual Savings
                        </span>
                      </div>
                      <div className="text-xl font-bold text-[#10B981]">
                        <CountUpOnView value={annualSavings} prefix="$" />
                      </div>
                      <div className="text-xs text-white/40">
                        ${Math.round(monthlySavings).toLocaleString()}/mo
                      </div>
                    </div>

                    <div className="card-accent p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-xs text-white/60">
                          Net Annual Gain
                        </span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        <CountUpOnView
                          value={netAnnualGain}
                          prefix={netAnnualGain >= 0 ? "$" : "-$"}
                        />
                      </div>
                      <div className="text-xs text-white/40">
                        savings minus cost
                      </div>
                    </div>

                    <div className="card-accent p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-xs text-white/60">
                          Payback Period
                        </span>
                      </div>
                      <div className="text-xl font-bold text-[#F59E0B]">
                        <CountUpOnView
                          value={Math.round(paybackMonths * 10) / 10}
                          suffix=" mo"
                        />
                      </div>
                      <div className="text-xs text-white/40">to break even</div>
                    </div>

                    <div className="card-accent p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#8B5CF6]" />
                        <span className="text-xs text-white/60">
                          Hours Saved / Month
                        </span>
                      </div>
                      <div className="text-xl font-bold text-[#8B5CF6]">
                        <CountUpOnView value={Math.round(hoursSavedPerMonth)} suffix="h" />
                      </div>
                      <div className="text-xs text-white/40">
                        across {teamSize} people
                      </div>
                    </div>
                  </div>

                  {/* 3-Year breakdown */}
                  <div className="card-accent p-5">
                    <div className="text-sm font-semibold text-white/70 mb-3">
                      3-Year Financial Summary
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Total Investment (3yr)",
                          value: threeYearCost,
                          color: "#EF4444",
                        },
                        {
                          label: "Total Savings (3yr)",
                          value: threeYearSavings,
                          color: "#10B981",
                        },
                        {
                          label: "Net Profit (3yr)",
                          value: threeYearSavings - threeYearCost,
                          color: "#22C55E",
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-white/60">{row.label}</span>
                          <span
                            className="font-mono font-semibold"
                            style={{ color: row.color }}
                          >
                            ${row.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="p-4 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)]">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-[#22C55E] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Insight
                        </p>
                        <p className="text-xs text-white/60">
                          With a {efficiencyGain}% efficiency gain across{" "}
                          {teamSize} team members at ${hourlyRate}/hr, you save{" "}
                          <span className="font-mono font-semibold text-white/70">
                            {Math.round(hoursSavedPerMonth)} hours/month
                          </span>{" "}
                          worth{" "}
                          <span className="font-mono font-semibold text-[#10B981]">
                            ${Math.round(monthlySavings).toLocaleString()}
                          </span>
                          . Your investment pays for itself in{" "}
                          <span className="font-mono font-semibold text-[#F59E0B]">
                            {paybackMonths} months
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href={FREE_AUDIT_CONTACT_HREF} className="btn-primary w-full gap-2">
                    Get Your Custom ROI Analysis
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
                    <Calculator className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm max-w-xs">
                    Fill in your metrics and click &quot;Calculate ROI&quot; to
                    see your projected results with animated counters and visual
                    progress bars.
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
