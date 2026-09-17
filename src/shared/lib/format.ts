import type { Availability, Product } from '@/entities/product/model/types';

/**
 * Formatters are memoised at module scope: `Intl` constructors are expensive
 * and these run inside list renders.
 */

const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 });

const dateLong = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** `94 990 ₽` — non-breaking spaces intact so prices never wrap mid-number. */
export const formatPrice = (value: number): string => rub.format(value);

export const formatCompact = (value: number): string => compact.format(value);

export const formatDate = (iso: string): string => dateLong.format(new Date(iso));

export function discountPercent(product: Pick<Product, 'price' | 'oldPrice'>): number {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

/** Russian plural rules: 1 товар / 2 товара / 5 товаров. */
export function plural(count: number, forms: [one: string, few: string, many: string]): string {
  const abs = Math.abs(count) % 100;
  const tail = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (tail > 1 && tail < 5) return forms[1];
  if (tail === 1) return forms[0];
  return forms[2];
}

export const pluralProducts = (count: number) => plural(count, ['товар', 'товара', 'товаров']);
export const pluralReviews = (count: number) => plural(count, ['отзыв', 'отзыва', 'отзывов']);
export const pluralMonths = (count: number) => plural(count, ['месяц', 'месяца', 'месяцев']);

export const availabilityLabel: Record<Availability, string> = {
  in_stock: 'В наличии',
  low_stock: 'Мало на складе',
  preorder: 'Под заказ',
  out_of_stock: 'Нет в наличии',
};

/** Warranty in the unit a customer actually thinks in. */
export function formatWarranty(months: number): string {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${plural(years, ['год', 'года', 'лет'])}`;
  }
  return `${months} ${pluralMonths(months)}`;
}

/** Slugs are URL-safe already; this guards user-supplied values in filters. */
export const isSafeSlug = (value: string): boolean => /^[a-z0-9-]{1,80}$/.test(value);
