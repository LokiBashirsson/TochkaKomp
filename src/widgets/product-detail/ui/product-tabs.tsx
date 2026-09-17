'use client';

import { BadgeCheck } from 'lucide-react';
import type { Product, Review } from '@/entities/product/model/types';
import { Rating } from '@/entities/product/ui/rating';
import { formatDate, formatWarranty, pluralReviews } from '@/shared/lib/format';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/controls';

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  return (
    <Tabs defaultValue="specs" className="flex flex-col gap-8">
      <TabsList aria-label="Разделы описания товара">
        <TabsTrigger value="specs">Характеристики</TabsTrigger>
        <TabsTrigger value="reviews">
          Отзывы <span data-numeric>{reviews.length || product.reviewCount}</span>
        </TabsTrigger>
        <TabsTrigger value="delivery">Доставка и гарантия</TabsTrigger>
      </TabsList>

      <TabsContent value="specs">
        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {product.specs.map((spec) => (
            <div
              key={spec.key}
              className="flex items-baseline justify-between gap-6 bg-card px-5 py-4"
            >
              <dt className="text-sm text-muted-foreground">{spec.key}</dt>
              <dd className="text-right font-mono text-xs font-medium text-foreground">
                {spec.value}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-6 bg-card px-5 py-4">
            <dt className="text-sm text-muted-foreground">Артикул</dt>
            <dd data-numeric className="text-right font-mono text-xs">
              {product.sku}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 bg-card px-5 py-4">
            <dt className="text-sm text-muted-foreground">Гарантия</dt>
            <dd className="text-right font-mono text-xs">{formatWarranty(product.warrantyMonths)}</dd>
          </div>
        </dl>
      </TabsContent>

      <TabsContent value="reviews">
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-border px-6 py-14 text-center">
            <p className="font-display text-base font-bold">Отзывов на этот товар пока нет</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Купили здесь? Напишите пару строк — это помогает следующему выбирать.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border px-6 py-5">
              <span className="font-display text-3xl font-extrabold" data-numeric>
                {product.rating.toFixed(1)}
              </span>
              <div>
                <Rating value={product.rating} showCount={false} size="md" />
                <p className="mt-1 text-xs text-muted-foreground">
                  <span data-numeric>{product.reviewCount}</span>{' '}
                  {pluralReviews(product.reviewCount)} · публикуем без модерации оценок
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-4">
              {reviews.map((review) => (
                <li key={review.id}>
                  <article className="rounded-xl border border-border p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Rating value={review.rating} showCount={false} />
                      <time
                        dateTime={review.createdAt}
                        className="font-mono text-2xs text-muted-foreground"
                      >
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                    <h3 className="mt-3 text-base font-bold tracking-tight">{review.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.body}
                    </p>
                    <footer className="mt-4 flex items-center gap-3 text-xs">
                      <span className="font-semibold">{review.author}</span>
                      <span className="text-muted-foreground">{review.city}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1.5 text-success">
                          <BadgeCheck className="size-3.5" aria-hidden="true" />
                          Покупка подтверждена
                        </span>
                      )}
                    </footer>
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}
      </TabsContent>

      <TabsContent value="delivery">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Самовывоз — бесплатно',
              body: 'Махачкала, пр. Имама Шамиля, 48. Держим заказ сутки. Товар распакуем и проверим при вас, до оплаты.',
            },
            {
              title: 'Курьер по Махачкале',
              body: '300 ₽, бесплатно от 30 000 ₽. В день заказа, если оформили до 17:00.',
            },
            {
              title: 'Дагестан',
              body: 'Каспийск, Дербент, Избербаш, Хасавюрт — на следующий день. Остальные города — транспортной компанией.',
            },
            {
              title: 'Оплата',
              body: 'Картой на сайте или при получении, наличными, по QR. Для юрлиц — безналичный расчёт с НДС и полным пакетом документов.',
            },
            {
              title: `Гарантия ${formatWarranty(product.warrantyMonths)}`,
              body: 'Обслуживаем в собственном сервисе. На время ремонта выдаём подменное устройство из фонда, если оно есть в наличии.',
            },
            {
              title: 'Возврат 14 дней',
              body: 'Товар надлежащего качества принимаем обратно в течение 14 дней, если сохранён товарный вид и комплектация.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
