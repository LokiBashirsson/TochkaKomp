'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Product } from '@/entities/product/model/types';

/**
 * A cart line stores a price snapshot, not a reference. If the catalogue price
 * changes between adding and checking out, the customer sees the change
 * explicitly at checkout instead of the total silently moving.
 */
export interface CartLine {
  slug: string;
  name: string;
  shortName: string;
  category: Product['category'];
  price: number;
  oldPrice?: number;
  quantity: number;
  maxQuantity: number;
}

interface CartState {
  lines: CartLine[];
  /** Drawer visibility lives here so any component can open the cart. */
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

const MAX_PER_LINE = 10;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      add: (product, quantity = 1) =>
        set((state) => {
          const cap = Math.min(MAX_PER_LINE, Math.max(1, product.stock || MAX_PER_LINE));
          const existing = state.lines.find((line) => line.slug === product.slug);

          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.slug === product.slug
                  ? { ...line, quantity: Math.min(cap, line.quantity + quantity) }
                  : line,
              ),
            };
          }

          const line: CartLine = {
            slug: product.slug,
            name: product.name,
            shortName: product.shortName,
            category: product.category,
            price: product.price,
            ...(product.oldPrice !== undefined && { oldPrice: product.oldPrice }),
            quantity: Math.min(cap, quantity),
            maxQuantity: cap,
          };
          return { lines: [...state.lines, line] };
        }),

      remove: (slug) => set((state) => ({ lines: state.lines.filter((line) => line.slug !== slug) })),

      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.slug !== slug)
              : state.lines.map((line) =>
                  line.slug === slug
                    ? { ...line, quantity: Math.min(line.maxQuantity, quantity) }
                    : line,
                ),
        })),

      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'tochkacomp:cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // `isOpen` is session UI state and must not survive a reload.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

/* -- Derived selectors ------------------------------------------------------ */

export interface CartTotals {
  count: number;
  subtotal: number;
  /** Sum of (oldPrice − price) across the cart. */
  savings: number;
}

export function useCartTotals(): CartTotals {
  return useCartStore(
    useShallow((state) => {
      let count = 0;
      let subtotal = 0;
      let savings = 0;
      for (const line of state.lines) {
        count += line.quantity;
        subtotal += line.price * line.quantity;
        if (line.oldPrice) savings += (line.oldPrice - line.price) * line.quantity;
      }
      return { count, subtotal, savings };
    }),
  );
}

export const useCartLine = (slug: string) =>
  useCartStore((state) => state.lines.find((line) => line.slug === slug));
