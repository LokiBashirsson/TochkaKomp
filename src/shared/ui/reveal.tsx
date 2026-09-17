'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/shared/lib/cn';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  delay?: number;
  /** Fraction of the element that must be visible before it plays. */
  amount?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer';
}

/**
 * Scroll-triggered entrance. Plays once, respects `prefers-reduced-motion` by
 * rendering the final state immediately — nothing is ever hidden behind an
 * animation the visitor asked not to see.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  amount = 0.25,
  as = 'div',
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];

  if (reduced) {
    return React.createElement(as, { className, ...props }, children);
  }

  // `motion[as]` is correctly typed per tag, but the union across tags is not
  // assignable from a single prop object — the element type is fixed at runtime.
  const Component = motion[as] as React.ElementType;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}

/* -- Stagger ---------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/** Wrap a list; each direct `<StaggerItem>` child enters in sequence. */
export function Stagger({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
