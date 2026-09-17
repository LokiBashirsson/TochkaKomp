import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { pluralReviews } from '@/shared/lib/format';

export interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
  /** Show "12 отзывов" next to the stars. */
  showCount?: boolean;
}

export function Rating({ value, count, size = 'sm', className, showCount = true }: RatingProps) {
  const rounded = Math.round(value * 2) / 2;
  const label =
    count !== undefined
      ? `Рейтинг ${value} из 5 на основе ${count} ${pluralReviews(count)}`
      : `Рейтинг ${value} из 5`;

  return (
    <span className={cn('inline-flex items-center gap-2', className)} aria-label={label}>
      <span className="inline-flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={cn(
              size === 'sm' ? 'size-3.5' : 'size-4',
              index <= rounded
                ? 'fill-copper text-copper'
                : index - 0.5 === rounded
                  ? 'fill-copper/40 text-copper'
                  : 'fill-transparent text-muted-foreground/40',
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span
        data-numeric
        className={cn('font-medium text-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}
        aria-hidden="true"
      >
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground" aria-hidden="true">
          · {count}
        </span>
      )}
    </span>
  );
}
