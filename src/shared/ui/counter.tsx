'use client';

import * as React from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

const ruNumber = new Intl.NumberFormat('ru-RU');

export interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
}

/**
 * Counts up once, when scrolled into view. Renders the final value as the SSR
 * output, so the number is correct before hydration and for reduced motion.
 */
export function Counter({ value, suffix = '', prefix = '', duration = 1.6, className }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const [display, setDisplay] = React.useState(value);

  React.useEffect(() => {
    if (reduced || !inView) return;
    setDisplay(0);
    motionValue.set(value);
    return spring.on('change', (latest) => setDisplay(Math.round(latest)));
  }, [inView, motionValue, reduced, spring, value]);

  return (
    <span ref={ref} className={className} data-numeric>
      {prefix}
      {ruNumber.format(display)}
      {suffix}
    </span>
  );
}
