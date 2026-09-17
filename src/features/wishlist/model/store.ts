'use client';

import { createCollectionStore } from '@/shared/lib/create-collection-store';

export const useWishlistStore = createCollectionStore('tochkacomp:wishlist');

export const useIsWishlisted = (slug: string) =>
  useWishlistStore((state) => state.slugs.includes(slug));

export const useWishlistCount = () => useWishlistStore((state) => state.slugs.length);
