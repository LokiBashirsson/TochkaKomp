'use client';

import * as React from 'react';
import { Minus, Plus, Truck, Store, ShieldCheck } from 'lucide-react';
import type { Product } from '@/entities/product/model/types';
import { AvailabilityDot } from '@/entities/product/ui/availability-dot';
import { Price } from '@/entities/product/ui/price';
import { AddToCartButton } from '@/features/cart/ui/add-to-cart-button';
import { CompareButton } from '@/features/compare/ui/compare-button';
import { WishlistButton } from '@/features/wishlist/ui/wishlist-button';
import { formatPrice, formatWarranty } from '@/shared/lib/format';

const FREE_DELIVERY_FROM = 30_000;

/**
 * Everything needed to decide, in one column that never scrolls out of reach on
 * desktop. Delivery and warranty sit inside the box rather than in a tab, since
 * "when will I get it and what if it breaks" is part of the price.
 */
export function BuyBox({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);
  const max = Math.max(1, Math.min(10, product.stock || 10));
  const freeDelivery = product.price >= FREE_DELIVERY_FROM;

  return (
    <div className="glass flex flex-col gap-6 rounded-2xl p-6 sm:p-7">
      <div className="flex flex-col gap-3">
        <Price
          price={product.price}
          {...(product.oldPrice !== undefined && { oldPrice: product.oldPrice })}
          size="lg"
        />
        <AvailabilityDot availability={product.availability} stock={product.stock} />
      </div>

      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center rounded-full border border-border"
          role="group"
          aria-label="Количество"
        >
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Уменьшить количество"
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <output data-numeric className="w-10 text-center text-sm font-bold" aria-live="polite">
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(max, value + 1))}
            disabled={quantity >= max}
            aria-label="Увеличить количество"
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1" />
      </div>

      <div className="flex items-center gap-2">
        <WishlistButton slug={product.slug} name={product.shortName} className="size-11" />
        <CompareButton slug={product.slug} name={product.shortName} className="size-11" />
        <p className="ml-1 text-xs text-muted-foreground">В избранное · К сравнению</p>
      </div>

      <hr className="rule-fade" />

      <dl className="flex flex-col gap-4 text-sm">
        <div className="flex gap-3">
          <Store className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <dt className="font-semibold">Самовывоз сегодня</dt>
            <dd className="text-xs text-muted-foreground">
              пр. Имама Шамиля, 48 — если товар в наличии, отложим на сутки
            </dd>
          </div>
        </div>

        <div className="flex gap-3">
          <Truck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <dt className="font-semibold">
              {freeDelivery ? 'Бесплатная доставка по Махачкале' : 'Доставка по Махачкале — 300 ₽'}
            </dt>
            <dd className="text-xs text-muted-foreground">
              {freeDelivery
                ? 'Курьер в день заказа. По Дагестану — на следующий день.'
                : `Бесплатно от ${formatPrice(FREE_DELIVERY_FROM)}. По Дагестану — на следующий день.`}
            </dd>
          </div>
        </div>

        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <dt className="font-semibold">Гарантия {formatWarranty(product.warrantyMonths)}</dt>
            <dd className="text-xs text-muted-foreground">
              Обслуживание в нашем сервисе в Махачкале, без отправки в другой город
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
