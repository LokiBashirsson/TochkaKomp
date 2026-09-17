'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CategoryArt } from '@/entities/category/ui/category-art';
import { useCartStore, useCartTotals } from '@/features/cart/model/store';
import { formatPrice, pluralProducts } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

const FREE_DELIVERY_FROM = 30_000;

export function CartDrawer() {
  const { isOpen, setOpen, lines, setQuantity, remove } = useCartStore();
  const { count, subtotal, savings } = useCartTotals();
  const remainingToFree = Math.max(0, FREE_DELIVERY_FROM - subtotal);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent side="right">
        <DialogHeader>
          <p className="eyebrow">Корзина</p>
          <DialogTitle className="font-display text-lg tracking-tight">
            {count > 0 ? `${count} ${pluralProducts(count)}` : 'Пока пусто'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Список выбранных товаров с возможностью изменить количество.
          </DialogDescription>
        </DialogHeader>

        {lines.length === 0 ? (
          <DialogBody className="grid place-items-center text-center">
            <div className="max-w-xs">
              <div
                aria-hidden="true"
                className="mx-auto grid size-16 place-items-center rounded-full border border-border text-muted-foreground"
              >
                <ShoppingBag className="size-6" />
              </div>
              <p className="mt-5 font-display text-base font-bold">В корзине ничего нет</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Соберите конфигурацию в конфигураторе или выберите готовое из каталога.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/catalog">Открыть каталог</Link>
                </Button>
                <Button asChild variant="ghost" onClick={() => setOpen(false)}>
                  <Link href="/pc-builder">Собрать ПК</Link>
                </Button>
              </div>
            </div>
          </DialogBody>
        ) : (
          <>
            <DialogBody className="flex flex-col gap-4">
              {remainingToFree > 0 && (
                <p className="rounded-lg border border-border px-4 py-3 text-xs text-muted-foreground">
                  До бесплатной доставки по Махачкале —{' '}
                  <span data-numeric className="font-semibold text-foreground">
                    {formatPrice(remainingToFree)}
                  </span>
                </p>
              )}

              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li key={line.slug} className="flex gap-4">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="shrink-0"
                    >
                      <CategoryArt
                        slug={line.category}
                        ambient={false}
                        className="size-20 rounded-lg border border-border"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm leading-snug font-semibold hover:text-primary"
                      >
                        {line.shortName}
                      </Link>

                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            aria-label={`Уменьшить количество: ${line.shortName}`}
                            className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Minus className="size-3.5" aria-hidden="true" />
                          </button>
                          <span
                            data-numeric
                            className="w-8 text-center text-sm font-semibold"
                            aria-label={`Количество: ${line.quantity}`}
                          >
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            disabled={line.quantity >= line.maxQuantity}
                            aria-label={`Увеличить количество: ${line.shortName}`}
                            className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span data-numeric className="text-sm font-bold">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      aria-label={`Удалить из корзины: ${line.shortName}`}
                      className="h-fit cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </DialogBody>

            <DialogFooter className="flex-col gap-4 sm:flex-col">
              <dl className="flex w-full flex-col gap-2 text-sm">
                {savings > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Скидка</dt>
                    <dd data-numeric className="font-semibold">
                      −{formatPrice(savings)}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold">Итого</dt>
                  <dd data-numeric className="font-display text-xl font-bold">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>

              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/cart">Оформить заказ</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
