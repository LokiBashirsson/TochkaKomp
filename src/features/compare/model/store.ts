'use client';

import { createCollectionStore } from '@/shared/lib/create-collection-store';

/** Four columns is where a spec table stops fitting a laptop screen. */
export const COMPARE_LIMIT = 4;

export const useCompareStore = createCollectionStore('tochkacomp:compare', COMPARE_LIMIT);

export const useIsCompared = (slug: string) =>
  useCompareStore((state) => state.slugs.includes(slug));

export const useCompareCount = () => useCompareStore((state) => state.slugs.length);
