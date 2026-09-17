'use client';

import * as React from 'react';
import { Check, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/entities/product/model/types';
import { useCartLine, useCartStore } from '@/features/cart/model/store';
import { cn } from '@/shared/lib/cn';
import { Button, type ButtonProps } from '@/shared/ui/button';

export interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  product: Product;
  quantity?: number;
  /** Icon-only rendering for use inside product cards. */
  compact?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  className,
  size,
  variant,
  ...props
}: AddToCartButtonProps) {
  const add = useCartStore((state) => state.add);
  const line = useCartLine(product.slug);
  const [pending, setPending] = React.useState(false);

  const unavailable = product.availability === 'out_of_stock';
  const inCart = Boolean(line);

  async function handleClick() {
    if (unavailable || pending) return;
    setPending(true);
    // Server actions land here later; the delay keeps the state honest either way.
    await new Promise((resolve) => setTimeout(resolve, 260));
    add(product, quantity);
    setPending(false);

    toast.success(inCart ? 'Количество обновлено' : 'Добавлено в корзину', {
      description: product.shortName,
      action: { label: 'В корзину', onClick: () => useCartStore.getState().setOpen(true) },
    });
  }

  const label = unavailable
    ? 'Нет в наличии'
    : product.availability === 'preorder'
      ? 'Предзаказ'
      : inCart
        ? 'В корзине'
        : 'В корзину';

  return (
    <Button
      onClick={handleClick}
      disabled={unavailable || pending}
      aria-label={compact ? `${label}: ${product.shortName}` : undefined}
      aria-busy={pending}
      size={size ?? (compact ? 'icon-sm' : 'md')}
      variant={variant ?? (inCart ? 'secondary' : 'primary')}
      className={cn(className)}
      {...props}
    >
      {pending ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : inCart ? (
        <Check aria-hidden="true" />
      ) : (
        <ShoppingBag aria-hidden="true" />
      )}
      {!compact && <span>{label}</span>}
    </Button>
  );
}
