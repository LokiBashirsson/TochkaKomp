import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getBrands, getCategories } from '@/shared/api/repository';
import { breadcrumbLd, pageMetadata } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/json-ld';
import { PageHeader } from '@/shared/ui/page-header';
import { Reveal, Stagger, StaggerItem } from '@/shared/ui/reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Бренды',
  description:
    'Производители, с которыми работает TochkaComp: NVIDIA, AMD, Intel, ASUS, MSI, Samsung, be quiet! и другие. Официальная гарантия и сервис в Махачкале.',
  path: '/brands',
});

const trail = [
  { name: 'Главная', href: '/' },
  { name: 'Бренды', href: '/brands' },
];

export default async function BrandsPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.slug, category.name]),
  );

  return (
    <>
      <PageHeader
        eyebrow="24 производителя"
        title="С кем работаем"
        description="Только официальные поставки. Это значит, что гарантийный случай решается через нас, а не через переписку с продавцом на маркетплейсе."
        trail={trail}
      />

      <div className="container-page pb-24">
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <StaggerItem key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                className="group glass edge-copper flex h-full flex-col justify-between gap-6 rounded-xl p-6 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-xl font-extrabold tracking-tight">
                    {brand.name}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  />
                </div>

                <div>
                  <p className="font-mono text-2xs tracking-[0.14em] text-muted-foreground uppercase">
                    {brand.country}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {brand.categories
                      .map((slug) => categoryNames[slug] ?? slug)
                      .join(' · ')}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-16">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Не нашли нужный бренд? Привозим под заказ — сроки и цену назовём до того, как возьмём
            предоплату.{' '}
            <Link href="/contacts" className="font-semibold text-primary underline-offset-4 hover:underline">
              Напишите нам
            </Link>
            .
          </p>
        </Reveal>
      </div>

      <JsonLd data={breadcrumbLd(trail)} />
    </>
  );
}
