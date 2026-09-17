import { cn } from '@/shared/lib/cn';
import { discountPercent, formatPrice } from '@/shared/lib/format';

export interface PriceProps {
  price: number;
  oldPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { current: 'text-base', old: 'text-xs' },
  md: { current: 'text-xl', old: 'text-sm' },
  lg: { current: 'text-3xl', old: 'text-base' },
} as const;

export function Price({ price, oldPrice, size = 'md', className }: PriceProps) {
  const discount = discountPercent({ price, ...(oldPrice !== undefined && { oldPrice }) });

  return (
    <span className={cn('flex flex-wrap items-baseline gap-x-2.5 gap-y-1', className)}>
      <span
        data-numeric
        className={cn('font-bold tracking-tight text-foreground', sizes[size].current)}
      >
        {formatPrice(price)}
      </span>
      {discount > 0 && oldPrice && (
        <>
          <s
            data-numeric
            className={cn('text-muted-foreground/70', sizes[size].old)}
            aria-label={`Старая цена ${formatPrice(oldPrice)}`}
          >
            {formatPrice(oldPrice)}
          </s>
          <span
            data-numeric
            className={cn('font-semibold text-copper', sizes[size].old)}
            aria-label={`Скидка ${discount} процентов`}
          >
            −{discount}%
          </span>
        </>
      )}
    </span>
  );
}
