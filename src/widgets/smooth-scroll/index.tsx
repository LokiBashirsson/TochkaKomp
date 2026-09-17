'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis drives the scroll position; GSAP's ScrollTrigger reads it.
 *
 * Driving Lenis from `gsap.ticker` rather than its own rAF loop keeps both on a
 * single frame callback, which is what stops scroll-linked animations from
 * lagging the page by a frame.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Native momentum on touch is better than anything we can emulate.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Route changes must reset scroll and re-measure every trigger.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
