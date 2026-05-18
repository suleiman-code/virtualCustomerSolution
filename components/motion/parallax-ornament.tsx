"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import { useMotionProfile } from "./use-motion-profile";

type ParallaxOrnamentProps = {
  className?: string;
  travel?: number;
};

export function ParallaxOrnament({ className, travel = 40 }: ParallaxOrnamentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowScrollParallax, isCompact } = useMotionProfile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const movement = isCompact ? travel * 0.35 : travel;
  const rawY = useTransform(scrollYProgress, [0, 1], [movement, -movement]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <div ref={ref} className={cn("pointer-events-none relative", className)}>
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl transform-gpu"
        style={allowScrollParallax ? { y, willChange: "transform" } : undefined}
      />
    </div>
  );
}
