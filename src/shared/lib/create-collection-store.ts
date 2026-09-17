'use client';

import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CollectionState {
  slugs: string[];
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** False when `add` was rejected because the collection is full. */
  has: (slug: string) => boolean;
  isFull: () => boolean;
}

/**
 * Wishlist and compare are the same data structure — an ordered set of product
 * slugs in localStorage — differing only in name and capacity. One factory, so
 * a fix to persistence or ordering lands in both at once.
 *
 * @param limit Compare tables stop being readable past a handful of columns.
 */
export function createCollectionStore(
  storageKey: string,
  limit = Number.POSITIVE_INFINITY,
): UseBoundStore<StoreApi<CollectionState>> {
  return create<CollectionState>()(
    persist(
      (set, get) => ({
        slugs: [],

        has: (slug) => get().slugs.includes(slug),
        isFull: () => get().slugs.length >= limit,

        add: (slug) =>
          set((state) =>
            state.slugs.includes(slug) || state.slugs.length >= limit
              ? state
              : { slugs: [...state.slugs, slug] },
          ),

        remove: (slug) => set((state) => ({ slugs: state.slugs.filter((item) => item !== slug) })),

        toggle: (slug) =>
          set((state) => {
            if (state.slugs.includes(slug)) {
              return { slugs: state.slugs.filter((item) => item !== slug) };
            }
            return state.slugs.length >= limit ? state : { slugs: [...state.slugs, slug] };
          }),

        clear: () => set({ slugs: [] }),
      }),
      {
        name: storageKey,
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ slugs: state.slugs }),
      },
    ),
  );
}
