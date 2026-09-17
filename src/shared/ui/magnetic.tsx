'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { cn } from '@/shared/lib/cn';

/**
 * Pulls its child a few pixels toward the pointer. Used on the two or three
 * highest-intent actions on the site, never on ordinary links — the effect
 * stops meaning anything once everything does it.
 *
 * Disabled outright on coarse pointers and under reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.32,
  radius = 96,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  React.useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const handleMove = React.useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - distance / (radius + rect.width / 2));
      x.set(dx * strength * falloff);
      y.set(dy * strength * falloff);
    },
    [radius, strength, x, y],
  );

  const reset = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (reduced || !enabled) {
    return <span className={cn('inline-flex', className)}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', className)}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
