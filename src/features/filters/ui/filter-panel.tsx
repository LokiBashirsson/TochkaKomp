'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Availability, CatalogResult } from '@/entities/product/model/types';
import { buildCatalogQuery, type FilterState } from '@/features/filters/model/search-params';
import { cn } from '@/shared/lib/cn';
import { formatPrice, availabilityLabel } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Checkbox, Slider } from '@/shared/ui/controls';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

const AVAILABILITY_ORDER: Availability[] = ['in_stock', 'low_stock', 'preorder'];

export interface FilterPanelProps {
  facets: CatalogResult['facets'];
  brandNames: Record<string, string>;
  state: FilterState;
  /** Rendered inside a sheet on mobile, inline on desktop. */
  variant?: 'inline' | 'sheet';
  total: number;
}

/**
 * Live filters: every change rewrites the URL and the server re-renders the
 * grid. `useTransition` keeps the old results on screen while the new ones
 * arrive, so the page never blanks between states.
 */
function useFilterNavigation(state: FilterState) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();

  const apply = React.useCallback(
    (next: Partial<FilterState>) => {
      const merged: FilterState = { ...state, ...next };
      const query = buildCatalogQuery({ ...merged, page: 1 });
      startTransition(() => {
        router.replace(`${pathname}${query}`, { scroll: false });
      });
    },
    [pathname, router, state],
  );

  const reset = React.useCallback(() => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }, [pathname, router]);

  return { apply, reset, pending, searchParams };
}

function FilterBody({
  facets,
  brandNames,
  state,
  apply,
}: Pick<FilterPanelProps, 'facets' | 'brandNames' | 'state'> & {
  apply: (next: Partial<FilterState>) => void;
}) {
  const { min, max } = facets.priceRange;
  const [range, setRange] = React.useState<[number, number]>([
    state.priceMin ?? min,
    state.priceMax ?? max,
  ]);

  // Re-sync when the server sends a different price envelope (category change).
  React.useEffect(() => {
    setRange([state.priceMin ?? min, state.priceMax ?? max]);
  }, [state.priceMin, state.priceMax, min, max]);

  const toggleBrand = (brand: string) => {
    const next = state.brands.includes(brand)
      ? state.brands.filter((item) => item !== brand)
      : [...state.brands, brand];
    apply({ brands: next });
  };

  const toggleAvailability = (value: Availability) => {
    const next = state.availability.includes(value)
      ? state.availability.filter((item) => item !== value)
      : [...state.availability, value];
    apply({ availability: next });
  };

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="eyebrow mb-4">Цена, ₽</legend>
        <Slider
          value={range}
          min={min}
          max={max}
          step={500}
          minStepsBetweenThumbs={1}
          onValueChange={(value) => setRange([value[0] ?? min, value[1] ?? max])}
          onValueCommit={(value) => apply({ priceMin: value[0], priceMax: value[1] })}
          aria-label="Диапазон цены"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span data-numeric>{formatPrice(range[0])}</span>
          <span data-numeric>{formatPrice(range[1])}</span>
        </div>
      </fieldset>

      {facets.brands.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-4">Бренд</legend>
          <ul className="flex flex-col gap-1">
            {facets.brands.map((facet) => {
              const id = `brand-${facet.value}`;
              const checked = state.brands.includes(facet.value);
              return (
                <li key={facet.value}>
                  <label
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggleBrand(facet.value)}
                    />
                    <span className="flex-1">{brandNames[facet.value] ?? facet.value}</span>
                    <span data-numeric className="text-xs text-muted-foreground">
                      {facet.count}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <fieldset>
        <legend className="eyebrow mb-4">Наличие</legend>
        <ul className="flex flex-col gap-1">
          {AVAILABILITY_ORDER.map((value) => {
            const id = `stock-${value}`;
            return (
              <li key={value}>
                <label
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Checkbox
                    id={id}
                    checked={state.availability.includes(value)}
                    onCheckedChange={() => toggleAvailability(value)}
                  />
                  <span>{availabilityLabel[value]}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

export function FilterPanel({ facets, brandNames, state, total }: FilterPanelProps) {
  const { apply, reset, pending } = useFilterNavigation(state);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const activeCount =
    state.brands.length +
    state.availability.length +
    (state.priceMin !== undefined ? 1 : 0) +
    (state.priceMax !== undefined ? 1 : 0);

  return (
    <>
      {/* Desktop */}
      <aside
        aria-label="Фильтры"
        aria-busy={pending}
        className={cn(
          'hidden lg:sticky lg:top-28 lg:block lg:h-fit',
          pending && 'opacity-60 transition-opacity',
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold tracking-tight">Фильтры</h2>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Сбросить
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
        <FilterBody facets={facets} brandNames={brandNames} state={state} apply={apply} />
      </aside>

      {/* Mobile trigger */}
      <Button
        variant="secondary"
        onClick={() => setSheetOpen(true)}
        className="lg:hidden"
        aria-haspopup="dialog"
      >
        <SlidersHorizontal aria-hidden="true" />
        Фильтры
        {activeCount > 0 && <Badge variant="copper">{activeCount}</Badge>}
      </Button>

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent side="bottom" className="lg:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-lg tracking-tight">Фильтры</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FilterBody facets={facets} brandNames={brandNames} state={state} apply={apply} />
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={reset} className="flex-1">
              Сбросить
            </Button>
            <Button onClick={() => setSheetOpen(false)} className="flex-1">
              Показать <span data-numeric>{total}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
