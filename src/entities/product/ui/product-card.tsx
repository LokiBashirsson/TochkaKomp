import Link from 'next/link';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Product, ProductBadge } from '@/entities/product/model/types';
import { AvailabilityDot } from '@/entities/product/ui/availability-dot';
import { Price } from '@/entities/product/ui/price';
import { QuickView } from '@/entities/product/ui/quick-view';
import { Rating } from '@/entities/product/ui/rating';
import { AddToCartButton } from '@/features/cart/ui/add-to-cart-button';
import { CompareButton } from '@/features/compare/ui/compare-button';
import { WishlistButton } from '@/features/wishlist/ui/wishlist-button';
import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/badge';

const badgeMeta: Record<ProductBadge, { label: string; variant: 'copper' | 'caspian' | 'success' | 'neutral' }> = {
  new: { label: 'Новинка', variant: 'caspian' },
  hit: { label: 'Хит', variant: 'copper' },
  sale: { label: 'Скидка', variant: 'success' },
  preorder: { label: 'Предзаказ', variant: 'neutral' },
  exclusive: { label: 'Только у нас', variant: 'copper' },
};

export interface ProductCardProps {
  product: Product;
  brandName: string;
  /** Fixed width for horizontal rails; grids leave this off. */
  railWidth?: boolean;
  className?: string;
  /** Cards above the fold skip the fade-in so LCP is not delayed. */
  priority?: boolean;
}

/**
 * Server-rendered. Only the three action controls ship JavaScript, which keeps
 * a 24-card grid at roughly the cost of one interactive component.
 */
export function ProductCard({ product, brandName, railWidth, className }: ProductCardProps) {
  const chips = product.specs.filter((spec) => spec.primary).slice(0, 2);
  const href = `/product/${product.slug}`;

  return (
    <article
      className={cn(
        'group glass edge-copper relative flex flex-col overflow-hidden rounded-xl',
        'transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
        'hover:-translate-y-1 hover:shadow-lift',
        railWidth && 'w-[19rem] sm:w-[21rem]',
        className,
      )}
    >
      <div className="relative">
        <CategoryArt slug={product.category} className="aspect-4/3 w-full" ambient={false} />

        {product.badges.length > 0 && (
          <ul className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((badge) => (
              <li key={badge}>
                <Badge variant={badgeMeta[badge].variant}>{badgeMeta[badge].label}</Badge>
              </li>
            ))}
          </ul>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <WishlistButton slug={product.slug} name={product.shortName} />
          <CompareButton slug={product.slug} name={product.shortName} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{brandName}</span>
          <AvailabilityDot availability={product.availability} stock={product.stock} />
        </div>

        <h3 className="text-base leading-snug font-bold tracking-tight">
          {/* The stretched link makes the whole card clickable without nesting
              interactive elements inside an anchor. */}
          <Link
            href={href}
            prefetch
            className="after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
          >
            {product.shortName}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.reviewCount} />

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((spec) => (
              <li
                key={spec.key}
                className="rounded-md border border-border px-2 py-1 font-mono text-2xs text-muted-foreground"
              >
                {spec.value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-end justify-between gap-3">
            <Price
              price={product.price}
              {...(product.oldPrice !== undefined && { oldPrice: product.oldPrice })}
              size="md"
            />
            {/* Sits above the stretched link so the button stays clickable. */}
            <div className="relative z-10">
              <AddToCartButton product={product} compact />
            </div>
          </div>
          <div className="relative z-10">
            <QuickView product={product} brandName={brandName} />
          </div>
        </div>
      </div>
    </article>
  );
}
