import type { Product } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';
import { SectionHeading } from '@/shared/ui/section-heading';

export interface ProductRailProps {
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  brandNames: Record<string, string>;
  link?: { href: string; label: string };
  headingId: string;
}

/**
 * Horizontal, snap-scrolled rail. Bleeds to the viewport edge on purpose — a
 * half-visible card at the right edge is the clearest possible affordance that
 * there is more to the right, and it needs no arrows or dots to say so.
 */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  brandNames,
  link,
  headingId,
}: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="section-tight">
      <div className="container-page">
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          {...(description && { description })}
          {...(link && { link })}
        />
      </div>

      <ul className="rail mt-10">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard
              product={product}
              brandName={brandNames[product.brand] ?? product.brand}
              railWidth
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
