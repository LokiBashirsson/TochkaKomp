import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryArt } from '@/entities/category/ui/category-art';
import { ProductCard } from '@/entities/product/ui/product-card';
import { Rating } from '@/entities/product/ui/rating';
import {
  getAllProductSlugs,
  getBrandNames,
  getCategory,
  getProductBySlug,
  getRelated,
  getReviews,
} from '@/shared/api/repository';
import { breadcrumbLd, pageMetadata, productLd } from '@/shared/lib/seo';
import { Badge } from '@/shared/ui/badge';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { JsonLd } from '@/shared/ui/json-ld';
import { BuyBox } from '@/widgets/product-detail/ui/buy-box';
import { ProductTabs } from '@/widgets/product-detail/ui/product-tabs';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return pageMetadata({
    title: product.name,
    // Lead with the price: it is the first thing a search result reader wants.
    description: `${product.shortName} — ${product.highlights[0] ?? product.description.slice(0, 120)} Гарантия и сервис в Махачкале.`,
    path: `/product/${product.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, reviews, related, brandNames] = await Promise.all([
    getCategory(product.category),
    getReviews(product.slug),
    getRelated(product.slug, 4),
    getBrandNames(),
  ]);

  const brandName = brandNames[product.brand] ?? product.brand;
  const trail = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    ...(category ? [{ name: category.name, href: `/catalog/${category.slug}` }] : []),
    { name: product.shortName, href: `/product/${product.slug}` },
  ];

  return (
    <>
      <div className="container-page pt-10 pb-24">
        <Breadcrumbs trail={trail} className="mb-10" />

        {/* Column 2 spans both rows so the sticky buy box has room to travel;
            `items-start` keeps it content-height instead of stretching. */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16 lg:gap-y-16">
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="glass grain relative isolate overflow-hidden rounded-2xl">
              <div aria-hidden="true" className="mesh-field -z-10 opacity-70" />
              <CategoryArt slug={product.category} className="aspect-4/3 w-full" />

              {product.badges.length > 0 && (
                <ul className="absolute top-5 left-5 flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <li key={badge}>
                      <Badge variant="copper" size="md">
                        {badge === 'new'
                          ? 'Новинка'
                          : badge === 'hit'
                            ? 'Хит продаж'
                            : badge === 'sale'
                              ? 'Скидка'
                              : badge === 'preorder'
                                ? 'Предзаказ'
                                : 'Только у нас'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div>
              <p className="eyebrow">{brandName}</p>
              <h1 className="mt-4 text-3xl font-extrabold">{product.shortName}</h1>
              <p className="mt-3 text-sm text-muted-foreground">{product.name}</p>
              <div className="mt-5">
                <Rating value={product.rating} count={product.reviewCount} size="md" />
              </div>
            </div>
            <BuyBox product={product} />
          </aside>

          <div className="lg:col-start-1 lg:row-start-2">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="sr-only">
                О товаре
              </h2>
              <p className="max-w-[65ch] text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-xl border border-border p-5">
                    <span aria-hidden="true" className="mb-3 block h-px w-8 bg-copper" />
                    <p className="text-sm leading-relaxed">{highlight}</p>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-16">
              <ProductTabs product={product} reviews={reviews} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-24">
            <h2 id="related-heading" className="text-2xl font-extrabold">
              С этим обычно смотрят
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug} className="flex">
                  <ProductCard
                    product={item}
                    brandName={brandNames[item.brand] ?? item.brand}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <JsonLd data={[productLd(product, reviews), breadcrumbLd(trail)]} />
    </>
  );
}
