import {
  CATEGORY_SLUGS,
  SORT_OPTIONS,
  type Availability,
  type CatalogQuery,
  type CategorySlug,
  type SortKey,
} from '@/entities/product/model/types';

/**
 * URL is the single source of truth for catalogue state.
 *
 * Filters live in the query string rather than component state so that a
 * filtered view can be shared, bookmarked, and rendered on the server. These
 * two functions are the only place that knows the parameter names.
 */

export type RawSearchParams = Record<string, string | string[] | undefined>;

const SORT_KEYS = new Set<string>(SORT_OPTIONS.map((option) => option.value));
const CATEGORIES = new Set<string>(CATEGORY_SLUGS);
const AVAILABILITIES = new Set<Availability>([
  'in_stock',
  'low_stock',
  'preorder',
  'out_of_stock',
]);

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((entry) => entry.split(',')).filter(Boolean);
}

function positiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** Everything unrecognised is dropped, so a hand-edited URL cannot break a page. */
export function parseCatalogParams(
  params: RawSearchParams,
  fallbackCategory?: CategorySlug,
): CatalogQuery {
  const categoryParam = first(params.category);
  const category =
    categoryParam && CATEGORIES.has(categoryParam) ? (categoryParam as CategorySlug) : undefined;

  const sortParam = first(params.sort);
  const search = first(params.q)?.trim();
  const priceMin = positiveInt(first(params.min));
  const priceMax = positiveInt(first(params.max));

  const availability = list(params.stock).filter((value): value is Availability =>
    AVAILABILITIES.has(value as Availability),
  );

  return {
    ...(category ?? fallbackCategory ? { category: category ?? fallbackCategory } : {}),
    ...(list(params.brand).length > 0 && { brands: list(params.brand) }),
    ...(priceMin !== undefined && { priceMin }),
    ...(priceMax !== undefined && priceMax > 0 && { priceMax }),
    ...(availability.length > 0 && { availability }),
    ...(search && { search }),
    ...(sortParam && SORT_KEYS.has(sortParam) && { sort: sortParam as SortKey }),
    page: positiveInt(first(params.page)) || 1,
    perPage: 12,
  };
}

export interface FilterState {
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  availability: Availability[];
  sort: SortKey;
  q?: string;
}

/** Builds the next query string. Empty values are omitted, never left as `?x=`. */
export function buildCatalogQuery(state: Partial<FilterState> & { page?: number }): string {
  const params = new URLSearchParams();

  if (state.brands?.length) params.set('brand', state.brands.join(','));
  if (state.availability?.length) params.set('stock', state.availability.join(','));
  if (state.priceMin !== undefined && state.priceMin > 0) params.set('min', String(state.priceMin));
  if (state.priceMax !== undefined && state.priceMax > 0) params.set('max', String(state.priceMax));
  if (state.q) params.set('q', state.q);
  if (state.sort && state.sort !== 'popular') params.set('sort', state.sort);
  if (state.page && state.page > 1) params.set('page', String(state.page));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function countActiveFilters(query: CatalogQuery): number {
  return (
    (query.brands?.length ?? 0) +
    (query.availability?.length ?? 0) +
    (query.priceMin !== undefined ? 1 : 0) +
    (query.priceMax !== undefined ? 1 : 0)
  );
}
