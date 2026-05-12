"use client";

import Link from "next/link";
import { FREE_AUDIT_CONTACT_HREF } from "@/lib/paths";
import {
  Calculator,
  Users,
  PieChart,
  ArrowRight,
  Wrench,
  Sparkles,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    title: "ROI Calculator",
    description:
      "Calculate your projected return on investment based on monthly spend, efficiency gains, and team metrics. Get instant insights into annual savings and payback period.",
    href: "/tools/roi-calculator",
    icon: Calculator,
    badge: "Most Popular",
    color: "#22C55E",
    preview: {
      label: "Avg. result",
      value: "312%",
      sub: "3-year ROI",
    },
    features: ["Annual savings projection", "3-year ROI forecast", "Payback period estimate"],
  },
  {
    title: "Remote Team Cost Calculator",
    description:
      "Compare in-house vs remote team costs with detailed breakdowns by role, skill level, and location. Visualize savings with interactive charts.",
    href: "/tools/remote-team-cost-calculator",
    icon: Users,
    badge: "New",
    color: "#10B981",
    preview: {
      label: "Avg. savings",
      value: "47%",
      sub: "vs US rates",
    },
    features: ["Multi-location comparison", "Skill level pricing", "Visual cost breakdown"],
  },
  {
    title: "Marketing Budget Planner",
    description:
      "Get a recommended budget allocation across marketing channels based on your goals, industry, and total budget. Includes Recharts pie visualization.",
    href: "/tools/marketing-budget-planner",
    icon: PieChart,
    badge: "Interactive",
    color: "#8B5CF6",
    preview: {
      label: "Channels",
      value: "5",
      sub: "optimized split",
    },
    features: ["Goal-based allocation", "Industry benchmarks", "Channel-level tips"],
  },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(34,197,94,0.12),transparent_70%)]" />
        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="badge mb-6 mx-auto w-fit">
                <Wrench className="w-4 h-4" />
                100% Free &mdash; No Signup
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Free Business{" "}
                <span className="text-gradient">Tools</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
                Interactive calculators and planning tools to help you make
                smarter, data-driven decisions. Instant results, no login required.
              </p>
            </motion.div>

            {/* Quick stat row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
              {[
                { icon: TrendingUp, label: "Avg. ROI Calculated", value: "312%" },
                { icon: DollarSign, label: "Avg. Savings Found", value: "$48K" },
                { icon: BarChart3, label: "Calculations Run", value: "12,400+" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.12)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-lg font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/60">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.href}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                >
                  <Link
                    href={tool.href}
                    className="group card-accent p-0 hover:border-[#22C55E] transition-[border-color] duration-300 flex flex-col h-full overflow-hidden"
                  >
                    {/* Top color bar */}
                    <div
                      className="h-1 w-full"
                      style={{ background: tool.color }}
                    />

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `${tool.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: tool.color }} />
                        </div>
                        {tool.badge && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.12)] text-[#22C55E] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#22C55E] transition-colors">
                        {tool.title}
                      </h2>
                      <p className="text-sm text-white/60 mb-5 leading-relaxed flex-1">
                        {tool.description}
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {tool.features.map((f) => (
                          <span
                            key={f}
                            className="text-xs px-2 py-1 rounded-md bg-white/[0.04] text-white/70 border border-[rgba(255,255,255,0.06)]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Preview metric */}
                      <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
                        <div>
                          <div className="text-xs text-white/60">{tool.preview.label}</div>
                          <div className="font-mono text-2xl font-bold" style={{ color: tool.color }}>
                            {tool.preview.value}
                          </div>
                          <div className="text-xs text-white/40">{tool.preview.sub}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#22C55E]">
                          Try Free
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              How It Works
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              Three simple steps to actionable business insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Enter Your Metrics",
                desc: "Input your current business data like spend, team size, and goals.",
              },
              {
                step: "02",
                title: "Get Instant Results",
                desc: "Our calculators crunch the numbers and show animated, visual results.",
              },
              {
                step: "03",
                title: "Take Action",
                desc: "Use the insights to make data-driven decisions or request a custom analysis.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                className="card-accent p-6 text-center"
              >
                <div className="font-mono text-3xl font-bold text-[#22C55E] mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="glass-panel p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Personalized Analysis?
            </h2>
            <p className="text-white/70 mb-6 max-w-xl mx-auto">
              Our tools provide estimates. For a detailed, custom analysis
              tailored to your business, talk to our experts.
            </p>
            <Link href={FREE_AUDIT_CONTACT_HREF} className="btn-primary gap-2">
              Get a Free Growth Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
