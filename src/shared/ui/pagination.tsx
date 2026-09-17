import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  /** Returns the href for a given page; owns all query-string concerns. */
  hrefFor: (page: number) => string;
}

/** Windowed page list: first, last, and two neighbours, with gaps elided. */
function pageNumbers(current: number, last: number): (number | 'gap')[] {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);

  const pages = new Set([1, last, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);

  const result: (number | 'gap')[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push('gap');
    result.push(page);
    previous = page;
  }
  return result;
}

export function Pagination({ page, total, perPage, hrefFor }: PaginationProps) {
  const last = Math.ceil(total / perPage);
  if (last <= 1) return null;

  const items = pageNumbers(page, last);
  const base =
    'grid h-11 min-w-11 cursor-pointer place-items-center rounded-full px-3 text-sm font-semibold transition-colors';

  return (
    <nav aria-label="Страницы каталога" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" aria-label="Предыдущая страница" className={cn(base, 'border border-border hover:border-primary')}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(base, 'border border-border opacity-35')}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {items.map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Страница ${item}`}
            data-numeric
            className={cn(
              base,
              item === page
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:border-primary',
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < last ? (
        <Link href={hrefFor(page + 1)} rel="next" aria-label="Следующая страница" className={cn(base, 'border border-border hover:border-primary')}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(base, 'border border-border opacity-35')}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
