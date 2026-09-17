import { SearchX } from 'lucide-react';
import type { CatalogQuery, CatalogResult } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';
import { buildCatalogQuery, type FilterState } from '@/features/filters/model/search-params';
import { FilterPanel } from '@/features/filters/ui/filter-panel';
import { SortSelect } from '@/features/filters/ui/sort-select';
import { pluralProducts } from '@/shared/lib/format';
import { EmptyState } from '@/shared/ui/empty-state';
import { Pagination } from '@/shared/ui/pagination';

export interface CatalogViewProps {
  query: CatalogQuery;
  result: CatalogResult;
  brandNames: Record<string, string>;
  /** Path the pagination links hang off, e.g. `/catalog/gpu`. */
  basePath: string;
}

export function CatalogView({ query, result, brandNames, basePath }: CatalogViewProps) {
  const state: FilterState = {
    brands: query.brands ?? [],
    availability: query.availability ?? [],
    sort: query.sort ?? 'popular',
    ...(query.priceMin !== undefined && { priceMin: query.priceMin }),
    ...(query.priceMax !== undefined && { priceMax: query.priceMax }),
    ...(query.search && { q: query.search }),
  };

  return (
    <div className="container-page pb-24">
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <FilterPanel
          facets={result.facets}
          brandNames={brandNames}
          state={state}
          total={result.total}
        />

        <div className="min-w-0">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Найдено{' '}
              <span data-numeric className="font-semibold text-foreground">
                {result.total}
              </span>{' '}
              {pluralProducts(result.total)}
            </p>
            <SortSelect value={state.sort} />
          </div>

          {result.items.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Под эти условия ничего не подошло"
              description="Снимите часть фильтров или расширьте диапазон цены — скорее всего, подходящее есть чуть дороже или чуть дешевле."
              action={{ href: basePath, label: 'Сбросить фильтры' }}
              secondaryAction={{ href: '/pc-builder', label: 'Собрать под задачу' }}
            />
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((product) => (
                  <li key={product.slug} className="flex">
                    <ProductCard
                      product={product}
                      brandName={brandNames[product.brand] ?? product.brand}
                      className="w-full"
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-14">
                <Pagination
                  page={result.page}
                  total={result.total}
                  perPage={result.perPage}
                  hrefFor={(page) => `${basePath}${buildCatalogQuery({ ...state, page })}`}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
