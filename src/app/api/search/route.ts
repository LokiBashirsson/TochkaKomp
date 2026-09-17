import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { SearchResponse, SearchResultItem } from '@/features/search/model/types';
import { getBrandNames, searchProducts } from '@/shared/api/repository';
import { discountPercent } from '@/shared/lib/format';

/**
 * Suggest endpoint for the header search.
 *
 * Returns a trimmed projection rather than full products — the dropdown needs
 * six fields and shipping the rest would triple the payload for nothing.
 */

const querySchema = z.object({
  q: z.string().trim().min(2).max(80),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? '',
    limit: request.nextUrl.searchParams.get('limit') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ items: [] } satisfies SearchResponse, { status: 200 });
  }

  const [hits, brandNames] = await Promise.all([
    searchProducts(parsed.data.q, parsed.data.limit),
    getBrandNames(),
  ]);

  const items: SearchResultItem[] = hits.map(({ product }) => ({
    slug: product.slug,
    name: product.shortName,
    brand: brandNames[product.brand] ?? product.brand,
    category: product.category,
    price: product.price,
    discount: discountPercent(product),
    availability: product.availability,
  }));

  return NextResponse.json(
    { items } satisfies SearchResponse,
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}
