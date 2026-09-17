import { Unbounded, Manrope, JetBrains_Mono } from 'next/font/google';

/**
 * Three roles, three faces.
 *
 * Display  — Unbounded: wide, engineered geometry. It looks like a hardware
 *            wordmark stamped into a case panel. Used only for headlines.
 * Body     — Manrope: a warm geometric grotesk that reads well in Russian at
 *            small sizes, which Inter does not do as gracefully in Cyrillic.
 * Utility  — JetBrains Mono: specs, prices, SKUs and counters. A monospace is
 *            not decoration here — it is the native notation of the subject.
 *
 * All three carry a full Cyrillic set, which is the hard constraint for a
 * Russian-language store and disqualifies most display faces outright.
 */

export const fontDisplay = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-unbounded',
  display: 'swap',
  preload: true,
});

export const fontSans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const fontVariables = [fontDisplay.variable, fontSans.variable, fontMono.variable].join(' ');
