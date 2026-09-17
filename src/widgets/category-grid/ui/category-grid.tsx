import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Category, CategorySlug } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';
import { pluralProducts } from '@/shared/lib/format';
import { Reveal, Stagger, StaggerItem } from '@/shared/ui/reveal';
import { SectionHeading } from '@/shared/ui/section-heading';

/**
 * Bento layout: the two categories that carry the business (видеокарты, готовые
 * сборки) get double-width tiles. The grid encodes what the store actually
 * sells rather than treating twelve categories as equally important.
 */
const featured: CategorySlug[] = ['gpu', 'prebuilt'];

export function CategoryGrid({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<CategorySlug, number>;
}) {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="categories-heading"
            eyebrow="12 разделов"
            title="Что есть на складе"
            description="Каждая позиция лежит в Махачкале — не «под заказ из Москвы за две недели»."
            link={{ href: '/catalog', label: 'Весь каталог' }}
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const wide = featured.includes(category.slug);
            const count = counts[category.slug];

            return (
              <StaggerItem
                key={category.slug}
                className={cn(wide && 'col-span-2', wide && 'md:row-span-1')}
              >
                <Link
                  href={`/catalog/${category.slug}`}
                  className={cn(
                    'group glass edge-copper relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-5',
                    'transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
                    'hover:-translate-y-1 hover:shadow-lift',
                    wide ? 'min-h-52' : 'min-h-44',
                  )}
                >
                  <CategoryArt
                    slug={category.slug}
                    ambient={wide}
                    className={cn(
                      'pointer-events-none absolute -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100',
                      wide ? 'top-0 right-0 h-full w-1/2' : '-right-6 -bottom-4 size-32',
                    )}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="max-w-[8em] text-base leading-tight font-bold tracking-tight">
                      {category.name}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {wide && (
                      <p className="max-w-[22ch] text-xs leading-snug text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <p className="font-mono text-2xs tracking-[0.12em] text-muted-foreground uppercase">
                      <span data-numeric>{count}</span> {pluralProducts(count)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
