import type { Availability, CategorySlug } from '@/entities/product/model/types';

/**
 * Wire format of `GET /api/search`. Declared in the feature layer rather than
 * beside the route handler so client code never imports from `app/`.
 */
export interface SearchResultItem {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  discount: number;
  availability: Availability;
}

export interface SearchResponse {
  items: SearchResultItem[];
}
