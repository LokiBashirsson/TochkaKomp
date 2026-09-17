'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useIsWishlisted, useWishlistStore } from '@/features/wishlist/model/store';
import { useHydrated } from '@/shared/hooks/use-hydrated';
import { cn } from '@/shared/lib/cn';

export function WishlistButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const hydrated = useHydrated();
  const toggle = useWishlistStore((state) => state.toggle);
  const active = useIsWishlisted(slug);
  const on = hydrated && active;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Убрать из избранного: ${name}` : `В избранное: ${name}`}
      onClick={() => {
        toggle(slug);
        toast(active ? 'Убрано из избранного' : 'Добавлено в избранное', { description: name });
      }}
      className={cn(
        'grid size-9 cursor-pointer place-items-center rounded-full border border-border',
        'bg-card/70 backdrop-blur-sm transition-colors duration-200',
        'hover:border-primary hover:text-primary',
        on ? 'border-primary text-primary' : 'text-muted-foreground',
        className,
      )}
    >
      <Heart className={cn('size-4', on && 'fill-current')} aria-hidden="true" />
    </button>
  );
}
