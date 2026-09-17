'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Product } from '@/entities/product/model/types';
import { AvailabilityDot } from '@/entities/product/ui/availability-dot';
import { Price } from '@/entities/product/ui/price';
import { Rating } from '@/entities/product/ui/rating';
import { AddToCartButton } from '@/features/cart/ui/add-to-cart-button';
import { formatWarranty } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

/**
 * "Просмотр без перехода" — enough to decide without losing scroll position in
 * a long grid. Deliberately not the full product page: no reviews, no related
 * items, no tabs. If the visitor needs those, the link is right there.
 */
export function QuickView({ product, brandName }: { product: Product; brandName: string }) {
  const [open, setOpen] = React.useState(false);
  const primarySpecs = product.specs.filter((spec) => spec.primary);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          aria-label={`Быстрый просмотр: ${product.shortName}`}
        >
          <Eye aria-hidden="true" />
          <span>Быстрый просмотр</span>
        </Button>
      </DialogTrigger>

      <DialogContent side="center" className="sm:max-h-[85svh]">
        <DialogHeader>
          <p className="eyebrow">{brandName}</p>
          <DialogTitle className="font-display text-xl leading-tight tracking-tight">
            {product.shortName}
          </DialogTitle>
          <DialogDescription className="sr-only">{product.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="grid gap-8 md:grid-cols-2">
          <div>
            <CategoryArt
              slug={product.category}
              className="aspect-4/3 w-full rounded-lg border border-border"
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Rating value={product.rating} count={product.reviewCount} />
              <AvailabilityDot availability={product.availability} stock={product.stock} />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <ul className="flex flex-col gap-2">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-copper" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {primarySpecs.map((spec) => (
                <div key={spec.key} className="bg-card px-4 py-3">
                  <dt className="eyebrow">{spec.key}</dt>
                  <dd className="mt-1 font-mono text-xs text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="text-xs text-muted-foreground">
              Гарантия {formatWarranty(product.warrantyMonths)} · Артикул{' '}
              <span data-numeric>{product.sku}</span>
            </p>
          </div>
        </DialogBody>

        <DialogFooter className="items-center justify-between sm:flex-row">
          <Price price={product.price} {...(product.oldPrice !== undefined && { oldPrice: product.oldPrice })} size="md" />
          <div className="flex w-full gap-3 sm:w-auto">
            <Button asChild variant="secondary" className="flex-1 sm:flex-none">
              <Link href={`/product/${product.slug}`} onClick={() => setOpen(false)}>
                Подробнее
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <AddToCartButton product={product} className="flex-1 sm:flex-none" />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
