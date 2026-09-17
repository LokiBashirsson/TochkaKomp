import { Suspense } from 'react';
import type { Metadata } from 'next';
import { parseCatalogParams, type RawSearchParams } from '@/features/filters/model/search-params';
import { getBrandNames, getCatalog } from '@/shared/api/repository';
import { breadcrumbLd, pageMetadata } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/json-ld';
import { PageHeader } from '@/shared/ui/page-header';
import { ProductGridSkeleton } from '@/shared/ui/skeleton';
import { CatalogView } from '@/widgets/catalog/ui/catalog-view';

export const metadata: Metadata = pageMetadata({
  title: 'Каталог — комплектующие, техника и периферия',
  description:
    'Полный каталог TochkaComp: видеокарты, процессоры, память, накопители, мониторы и готовые сборки. Всё в наличии в Махачкале.',
  path: '/catalog',
});

const trail = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
];

async function CatalogResults({ params }: { params: RawSearchParams }) {
  const query = parseCatalogParams(params);
  const [result, brandNames] = await Promise.all([getCatalog(query), getBrandNames()]);

  return (
    <CatalogView query={query} result={result} brandNames={brandNames} basePath="/catalog" />
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const term = typeof params.q === 'string' ? params.q : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Каталог"
        title={term ? `Поиск: ${term}` : 'Всё, что есть на складе'}
        description={
          term
            ? 'Результаты по вашему запросу. Уточните фильтрами, если нашлось слишком много.'
            : 'Двенадцать разделов, двадцать четыре бренда. Фильтры работают сразу — страница не перезагружается, ссылку можно отправить другу.'
        }
        trail={trail}
      />

      <Suspense
        key={JSON.stringify(params)}
        fallback={
          <div className="container-page pb-24">
            <ProductGridSkeleton count={9} />
          </div>
        }
      >
        <CatalogResults params={params} />
      </Suspense>

      <JsonLd data={breadcrumbLd(trail)} />
    </>
  );
}
