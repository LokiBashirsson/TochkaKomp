import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CategorySlug } from '@/entities/product/model/types';
import { parseCatalogParams, type RawSearchParams } from '@/features/filters/model/search-params';
import { getBrandNames, getCatalog, getCategories, getCategory } from '@/shared/api/repository';
import { breadcrumbLd, itemListLd, pageMetadata } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/json-ld';
import { PageHeader } from '@/shared/ui/page-header';
import { ProductGridSkeleton } from '@/shared/ui/skeleton';
import { CatalogView } from '@/widgets/catalog/ui/catalog-view';

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  return pageMetadata({
    title: `${category.name} — купить в Махачкале`,
    description: category.description,
    path: `/catalog/${category.slug}`,
  });
}

async function CategoryResults({
  slug,
  searchParams,
}: {
  slug: CategorySlug;
  searchParams: RawSearchParams;
}) {
  const query = parseCatalogParams(searchParams, slug);
  const [result, brandNames] = await Promise.all([getCatalog(query), getBrandNames()]);

  return (
    <>
      <CatalogView
        query={query}
        result={result}
        brandNames={brandNames}
        basePath={`/catalog/${slug}`}
      />
      <JsonLd data={itemListLd(result.items, `Каталог: ${slug}`)} />
    </>
  );
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ category: slug }, resolvedSearch] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);
  if (!category) notFound();

  const trail = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: category.name, href: `/catalog/${category.slug}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Категория"
        title={category.name}
        description={category.description}
        trail={trail}
      />

      <Suspense
        key={JSON.stringify(resolvedSearch)}
        fallback={
          <div className="container-page pb-24">
            <ProductGridSkeleton count={9} />
          </div>
        }
      >
        <CategoryResults slug={category.slug} searchParams={resolvedSearch} />
      </Suspense>

      <JsonLd data={breadcrumbLd(trail)} />
    </>
  );
}
