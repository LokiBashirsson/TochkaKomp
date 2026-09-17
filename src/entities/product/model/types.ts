/** Domain model. Mirrors `prisma/schema.prisma` one-to-one. */

export const CATEGORY_SLUGS = [
  'gpu',
  'cpu',
  'motherboard',
  'ram',
  'storage',
  'psu',
  'case',
  'cooling',
  'monitor',
  'peripherals',
  'laptop',
  'prebuilt',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/** Slots the configurator fills. A category maps to at most one slot. */
export const BUILD_SLOTS = [
  'cpu',
  'motherboard',
  'gpu',
  'ram',
  'storage',
  'psu',
  'cooling',
  'case',
] as const;

export type BuildSlot = (typeof BUILD_SLOTS)[number];

export type Availability = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock';

export type ProductBadge = 'new' | 'hit' | 'sale' | 'preorder' | 'exclusive';

export interface SpecItem {
  /** Short label shown in the compare table header. */
  key: string;
  value: string;
  /** Specs flagged as primary surface on the card and in quick view. */
  primary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  /** Full retail name, e.g. "Видеокарта Palit GeForce RTX 5070 Ti GamingPro 16GB". */
  name: string;
  /** Compact name for cards and breadcrumbs. */
  shortName: string;
  sku: string;
  brand: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  availability: Availability;
  stock: number;
  badges: ProductBadge[];
  /** Three sentences max — the reason to pick this over the next one. */
  highlights: string[];
  description: string;
  specs: SpecItem[];
  warrantyMonths: number;
  /** ISO date; drives the "Новинки" rail ordering. */
  releasedAt: string;

  /* -- Configurator metadata (absent for non-component categories) -------- */
  buildSlot?: BuildSlot;
  /** Watts drawn, or watts supplied for a PSU. */
  power?: number;
  socket?: string;
  formFactor?: string;
  memoryType?: 'DDR4' | 'DDR5';
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Genitive plural, for headings like "12 видеокарт". */
  nameShort: string;
  description: string;
  buildSlot?: BuildSlot;
}

export interface Brand {
  slug: string;
  name: string;
  country: string;
  /** Categories this brand actually appears in — powers the brands page. */
  categories: CategorySlug[];
}

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  city: string;
  rating: number;
  createdAt: string;
  title: string;
  body: string;
  /** Verified = matched against an order in the CRM. */
  verified: boolean;
}

/* -- Query contracts -------------------------------------------------------- */

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price-asc', label: 'Сначала дешёвые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'new', label: 'Новинки' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export interface CatalogQuery {
  category?: CategorySlug;
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  availability?: Availability[];
  search?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  /** Facet counts computed against the query with that facet excluded. */
  facets: {
    brands: { value: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}
