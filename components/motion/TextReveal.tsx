'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Word-by-word reveal tied to scroll ──────────── */
export function TextReveal({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.25'],
  });

  const words = text.split(' ');

  return (
    <p ref={ref} className={`relative flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(start + 1.5 / words.length, 1);
        return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
      })}
    </p>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block transition-colors duration-300">
      {word}
    </motion.span>
  );
}

/* ─── Letter-by-letter reveal on view ─────────────── */
export function LetterReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const letters = text.split('');

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-block ${className}`}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                delay: delay + i * 0.03,
                ease: smoothEase,
              },
            },
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ─── Line reveal — clip animation ────────────────── */
export function LineReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 1, delay, ease: smoothEase }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
