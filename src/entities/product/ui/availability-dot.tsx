import type { Availability } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';
import { availabilityLabel } from '@/shared/lib/format';

const tone: Record<Availability, { dot: string; text: string }> = {
  in_stock: { dot: 'bg-success', text: 'text-success' },
  low_stock: { dot: 'bg-ember', text: 'text-ember' },
  preorder: { dot: 'bg-caspian', text: 'text-caspian' },
  out_of_stock: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
};

export function AvailabilityDot({
  availability,
  stock,
  className,
}: {
  availability: Availability;
  stock?: number;
  className?: string;
}) {
  const label =
    availability === 'low_stock' && stock !== undefined
      ? `Осталось ${stock} шт.`
      : availabilityLabel[availability];

  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-medium', className)}>
      <span
        aria-hidden="true"
        className={cn('size-1.5 shrink-0 rounded-full', tone[availability].dot)}
      />
      <span className={tone[availability].text}>{label}</span>
    </span>
  );
}
