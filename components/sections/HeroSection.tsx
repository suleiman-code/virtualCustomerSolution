'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Zap, Globe, Cpu } from 'lucide-react';

const smoothEase = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { scrollY } = useScroll();

  const rawY = useTransform(scrollY, [0, 800], [0, 40]);
  const rawOpacity = useTransform(scrollY, [200, 800], [1, 0]);

  const y = useSpring(rawY, { stiffness: 60, damping: 30, mass: 0.8 });
  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 30, mass: 0.8 });

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden lg:min-h-[calc(100vh-var(--site-header-height))]">
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <div className="absolute inset-0 md:hidden bg-[radial-gradient(ellipse_at_70%_40%,rgba(34,197,94,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 md:hidden bg-[radial-gradient(ellipse_at_20%_80%,rgba(5,150,105,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-[-20%] right-[-10%] hidden h-[700px] w-[700px] animate-[hero-drift_20s_ease-in-out_infinite] rounded-full bg-[#22C55E]/[0.07] blur-[120px] md:block" />
        <div className="absolute bottom-[-30%] left-[-15%] hidden h-[600px] w-[600px] animate-[hero-drift_25s_ease-in-out_infinite_reverse] rounded-full bg-[#059669]/[0.06] blur-[100px] md:block" />
        <div className="absolute top-[30%] right-[20%] hidden h-[400px] w-[400px] animate-[hero-drift_18s_ease-in-out_infinite_2s] rounded-full bg-[#4ADE80]/[0.04] blur-[80px] md:block" />
        <div className="absolute inset-0 hidden grid-bg opacity-[0.06] md:block" />
        <div className="noise-overlay absolute inset-0 hidden opacity-[0.03] md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]/70" />
      </div>

      <div className="container-wide relative z-10 w-full pb-14 pt-6 sm:pb-16 sm:pt-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="min-w-0 max-w-3xl lg:max-w-none">
            <motion.div style={{ y, opacity }} className="relative max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.3)] bg-black/20 px-4 py-2 text-sm text-[#22C55E] backdrop-blur-sm"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-medium tracking-wide">Your Growth Partner</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
              className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
            >
              We Build Teams
              <br />
              That Actually
              <br />
              <span className="text-[#22C55E]">Get Things Done</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              className="mt-6 max-w-md text-lg leading-relaxed text-white/65"
            >
              Live chat, customer support, virtual staff, marketing, and web builds &mdash; one service provider,
              one team. We handle delivery so you can focus on your clients and growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
              className="mt-10 flex flex-wrap gap-6"
            >
              {[
                { icon: Zap, label: '50+ Clients Served', color: '#22C55E' },
                { icon: Globe, label: '10+ Countries', color: '#059669' },
                { icon: Cpu, label: '3+ Years Delivering', color: '#22C55E' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/50">
                  <item.icon size={14} style={{ color: item.color }} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: smoothEase }}
            className="relative mx-auto w-full max-w-lg justify-self-center lg:mx-0 lg:max-w-none lg:justify-self-end"
          >
            {/* Wide cinematic frame (4:3 → 16:11); square art is cropped with object-cover so no empty bands. */}
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[min(100%,26rem)] sm:aspect-[16/11] sm:max-w-[min(100%,34rem)] lg:mx-0 lg:ml-auto lg:max-w-[min(52rem,54vw)] lg:aspect-[16/11]">
              <Image
                src="/images/hero-vcs.png"
                alt="Virtual Customer Solution — marketing and virtual teams"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 85vw, 54vw"
                className="rounded-2xl object-cover object-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.08] drop-shadow-[0_0_80px_rgba(34,197,94,0.14)]"
              />
            </div>
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#22C55E]/10 via-transparent to-[#059669]/5 blur-2xl md:-inset-8"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
