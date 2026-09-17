import 'server-only';
import { cache } from 'react';
import type {
  Brand,
  CatalogQuery,
  CatalogResult,
  Category,
  CategorySlug,
  Product,
  Review,
  SortKey,
} from '@/entities/product/model/types';
import { discountPercent } from '@/shared/lib/format';
import { brands, categories, products, reviews } from './catalog-data';

/**
 * The catalogue's only read surface.
 *
 * Every page and route handler goes through this module, so the storage engine
 * is a private detail. Swapping the bundled dataset for Prisma means rewriting
 * the bodies below against `prisma.product.*` and nothing else — the exported
 * signatures are the contract the rest of the app is written against.
 *
 * `cache()` dedupes calls within a single render pass, so a page may ask for the
 * same category three times without paying for it three times.
 */

const DEFAULT_PER_PAGE = 12;

/* -- Sorting ---------------------------------------------------------------- */

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  new: (a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt),
};

/* -- Matching --------------------------------------------------------------- */

/** Normalise for accent/case-insensitive comparison, including Cyrillic ё. */
const normalize = (value: string) => value.toLowerCase().replaceAll('ё', 'е').trim();

function matchesSearch(product: Product, term: string): boolean {
  const haystack = normalize(
    [product.name, product.shortName, product.sku, product.brand, product.description].join(' '),
  );
  return normalize(term)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

/**
 * Applies every filter except the one named, which is how facet counts stay
 * useful: unchecking "ASUS" should still show how many ASUS items exist.
 */
function applyFilters(
  source: Product[],
  query: CatalogQuery,
  except?: 'brands' | 'price' | 'availability',
): Product[] {
  return source.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (query.search && !matchesSearch(product, query.search)) return false;
    if (except !== 'brands' && query.brands?.length && !query.brands.includes(product.brand)) {
      return false;
    }
    if (except !== 'price') {
      if (query.priceMin !== undefined && product.price < query.priceMin) return false;
      if (query.priceMax !== undefined && product.price > query.priceMax) return false;
    }
    if (
      except !== 'availability' &&
      query.availability?.length &&
      !query.availability.includes(product.availability)
    ) {
      return false;
    }
    return true;
  });
}

/* -- Catalogue -------------------------------------------------------------- */

export const getCatalog = cache(async (query: CatalogQuery = {}): Promise<CatalogResult> => {
  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  const page = Math.max(1, query.page ?? 1);

  const filtered = applyFilters(products, query);
  const sorted = [...filtered].sort(comparators[query.sort ?? 'popular']);

  const brandPool = applyFilters(products, query, 'brands');
  const brandCounts = new Map<string, number>();
  for (const product of brandPool) {
    brandCounts.set(product.brand, (brandCounts.get(product.brand) ?? 0) + 1);
  }

  const pricePool = applyFilters(products, query, 'price');
  const prices = pricePool.map((product) => product.price);

  return {
    items: sorted.slice((page - 1) * perPage, page * perPage),
    total: sorted.length,
    page,
    perPage,
    facets: {
      brands: [...brandCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 0,
      },
    },
  };
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return products.find((product) => product.slug === slug) ?? null;
});

export const getProductsBySlugs = cache(async (slugs: string[]): Promise<Product[]> => {
  // Preserve caller order rather than catalogue order — compare tables rely on it.
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined);
});

export const getAllProductSlugs = cache(async (): Promise<string[]> =>
  products.map((product) => product.slug),
);

/* -- Curated rails ---------------------------------------------------------- */

export const getBestsellers = cache(async (limit = 8): Promise<Product[]> =>
  [...products]
    .filter((product) => product.badges.includes('hit'))
    .sort(comparators.popular)
    .slice(0, limit),
);

export const getNewArrivals = cache(async (limit = 8): Promise<Product[]> =>
  [...products].sort(comparators.new).slice(0, limit),
);

export const getDeals = cache(async (limit = 12): Promise<Product[]> =>
  [...products]
    .filter((product) => product.oldPrice !== undefined)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit),
);

export const getPrebuilts = cache(async (): Promise<Product[]> =>
  products.filter((product) => product.category === 'prebuilt').sort(comparators['price-asc']),
);

/** Same category first, then the same brand, never the product itself. */
export const getRelated = cache(async (slug: string, limit = 4): Promise<Product[]> => {
  const product = products.find((item) => item.slug === slug);
  if (!product) return [];

  const scored = products
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === product.category ? 4 : 0) +
        (candidate.brand === product.brand ? 2 : 0) +
        (Math.abs(candidate.price - product.price) < product.price * 0.4 ? 1 : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating);

  return scored.slice(0, limit).map((entry) => entry.candidate);
});

/** Components the configurator may put into a given slot. */
export const getBuildOptions = cache(async (): Promise<Product[]> =>
  products.filter((product) => product.buildSlot !== undefined),
);

/* -- Taxonomy --------------------------------------------------------------- */

export const getCategories = cache(async (): Promise<Category[]> => categories);

export const getCategory = cache(async (slug: string): Promise<Category | null> =>
  categories.find((category) => category.slug === slug) ?? null,
);

export const getCategoryCounts = cache(async (): Promise<Record<CategorySlug, number>> => {
  const counts = Object.fromEntries(
    categories.map((category) => [category.slug, 0]),
  ) as Record<CategorySlug, number>;
  for (const product of products) counts[product.category] += 1;
  return counts;
});

export const getBrands = cache(async (): Promise<Brand[]> =>
  [...brands].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
);

export const getBrand = cache(async (slug: string): Promise<Brand | null> =>
  brands.find((brand) => brand.slug === slug) ?? null,
);

/** Brand slug → display name, for labels that only carry the slug. */
export const getBrandNames = cache(async (): Promise<Record<string, string>> =>
  Object.fromEntries(brands.map((brand) => [brand.slug, brand.name])),
);

/* -- Reviews ---------------------------------------------------------------- */

export const getReviews = cache(async (productSlug?: string): Promise<Review[]> => {
  const source = productSlug
    ? reviews.filter((review) => review.productSlug === productSlug)
    : reviews;
  return [...source].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
});

/* -- Search ----------------------------------------------------------------- */

export interface SearchHit {
  product: Product;
  /** Higher is better; exposed so the UI can group "точные совпадения". */
  score: number;
}

/**
 * Local ranked search. Mirrors the shape an Algolia `search()` response would
 * take, so wiring Algolia later is a swap of this function's body.
 */
export const searchProducts = cache(async (term: string, limit = 8): Promise<SearchHit[]> => {
  const query = normalize(term);
  if (query.length < 2) return [];

  const tokens = query.split(/\s+/).filter(Boolean);

  return products
    .map((product) => {
      const name = normalize(product.shortName);
      const full = normalize(`${product.name} ${product.sku} ${product.brand}`);

      let score = 0;
      for (const token of tokens) {
        if (name.startsWith(token)) score += 6;
        else if (name.includes(token)) score += 4;
        else if (full.includes(token)) score += 2;
        else return { product, score: 0 };
      }
      if (product.availability === 'in_stock') score += 1;
      return { product, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit);
});
