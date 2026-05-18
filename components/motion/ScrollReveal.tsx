'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

/* ─── Smooth ease curve — gentle acceleration, soft deceleration ── */
const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Variant =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleUp'
  | 'rotateIn'
  | 'blurIn'
  | 'clipReveal'
  | 'stagger';

const variantMap: Record<Variant, { hidden: any; visible: any }> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -2, y: 24 },
    visible: { opacity: 1, rotate: 0, y: 0 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
  clipReveal: {
    hidden: { opacity: 0, clipPath: 'inset(20% 0 0 0)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0 0 0)' },
  },
  stagger: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
};

/* ─── ScrollReveal ────────────────────────────────── */
export function ScrollReveal({
  children,
  variant = 'slideUp',
  delay = 0,
  duration = 1.0,
  className = '',
  once = true,
  margin = '-60px',
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any, amount: 0.2 });
  const v = variantMap[variant];

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{
        duration,
        delay,
        ease: smoothEase,
        ...(variant === 'stagger' ? { staggerChildren: 0.25 } : {}),
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── ScrollRevealItem (for stagger children) ─────── */
export function ScrollRevealItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 1.2, ease: smoothEase },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── ScrollLinked — opacity/scale tied to scroll ─── */
export function ScrollLinked({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [30, 0, 0, -30]);
  const smoothY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.8 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: smoothY, willChange: 'transform, opacity' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── Parallax Layer ──────────────────────────────── */
export function ParallaxLayer({
  children,
  speed = 0.3,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -60, speed * 60]);
  const smoothY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.8 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, willChange: 'transform' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
