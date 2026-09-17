'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Anything driven by `localStorage` (cart count, wishlist state) must render
 * its empty form until this flips, or React will report a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
