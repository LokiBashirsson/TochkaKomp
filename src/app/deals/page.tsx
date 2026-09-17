import type { Metadata } from 'next';
import { TicketPercent } from 'lucide-react';
import { ProductCard } from '@/entities/product/ui/product-card';
import { getBrandNames, getDeals } from '@/shared/api/repository';
import { discountPercent, formatPrice, pluralProducts } from '@/shared/lib/format';
import { breadcrumbLd, itemListLd, pageMetadata } from '@/shared/lib/seo';
import { EmptyState } from '@/shared/ui/empty-state';
import { JsonLd } from '@/shared/ui/json-ld';
import { PageHeader } from '@/shared/ui/page-header';

export const revalidate = 1800;

export const metadata: Metadata = pageMetadata({
  title: 'Акции и скидки',
  description:
    'Сниженные цены на комплектующие и готовые сборки в Махачкале. Обновляем каждую неделю — без вечных «скидок» от завышенной цены.',
  path: '/deals',
});

const trail = [
  { name: 'Главная', href: '/' },
  { name: 'Акции', href: '/deals' },
];

export default async function DealsPage() {
  const [deals, brandNames] = await Promise.all([getDeals(24), getBrandNames()]);

  const totalSaving = deals.reduce(
    (sum, product) => sum + ((product.oldPrice ?? product.price) - product.price),
    0,
  );
  const best = deals[0];

  return (
    <>
      <PageHeader
        eyebrow="Акции недели"
        title="Стало дешевле"
        description="Цены снижены до конца недели или пока хватит складского остатка. Старая цена — та, по которой товар реально продавался, а не выдуманная для красной плашки."
        trail={trail}
      >
        {deals.length > 0 && (
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Позиций</dt>
              <dd data-numeric className="mt-2 font-display text-2xl font-extrabold">
                {deals.length}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Максимальная скидка</dt>
              <dd data-numeric className="mt-2 font-display text-2xl font-extrabold text-copper">
                {best ? `−${discountPercent(best)}%` : '—'}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Суммарная выгода</dt>
              <dd data-numeric className="mt-2 font-display text-2xl font-extrabold">
                {formatPrice(totalSaving)}
              </dd>
            </div>
          </dl>
        )}
      </PageHeader>

      <div className="container-page pb-24">
        {deals.length === 0 ? (
          <EmptyState
            icon={TicketPercent}
            title="Сейчас акций нет"
            description="Новые цены выставляем по понедельникам. Подпишитесь на письмо по средам — присылаем список сразу, как он появляется."
            action={{ href: '/catalog', label: 'Открыть каталог' }}
          />
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              <span data-numeric className="font-semibold text-foreground">
                {deals.length}
              </span>{' '}
              {pluralProducts(deals.length)} со сниженной ценой
            </p>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {deals.map((product) => (
                <li key={product.slug} className="flex">
                  <ProductCard
                    product={product}
                    brandName={brandNames[product.brand] ?? product.brand}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <JsonLd data={[breadcrumbLd(trail), itemListLd(deals, 'Акции TochkaComp')]} />
    </>
  );
}
