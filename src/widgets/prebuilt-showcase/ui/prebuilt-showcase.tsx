'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Product } from '@/entities/product/model/types';
import { Price } from '@/entities/product/ui/price';
import { AddToCartButton } from '@/features/cart/ui/add-to-cart-button';
import { cn } from '@/shared/lib/cn';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { SectionHeading } from '@/shared/ui/section-heading';

/**
 * Three tiers, side by side, drifting at different rates as the section passes.
 * The parallax has a job here: the price ladder is the point of the section, and
 * separating the cards in depth stops them reading as one undifferentiated row.
 */
export function PrebuiltShowcase({ builds }: { builds: Product[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((card, index) => {
        const depth = [0.14, -0.06, 0.2][index] ?? 0;
        gsap.to(card, {
          yPercent: depth * 100,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  if (builds.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-labelledby="builds-heading"
      className="section relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="mesh-field -z-10 opacity-60" />

      <div className="container-page">
        <SectionHeading
          id="builds-heading"
          eyebrow="Готовые системы"
          title="Три сборки, которые закрывают почти всё"
          description="Собраны из комплектующих, которые мы ставим себе. Любую можно изменить под себя — заменить видеокарту, добавить памяти, взять другой корпус."
          link={{ href: '/catalog/prebuilt', label: 'Все сборки' }}
        />

        <ul className="mt-14 grid items-start gap-4 lg:grid-cols-3">
          {builds.slice(0, 3).map((build, index) => {
            const highlight = index === 1;

            return (
              <li key={build.slug} data-parallax>
                <article
                  className={cn(
                    'glass edge-copper relative flex h-full flex-col overflow-hidden rounded-2xl',
                    highlight && 'ring-1 ring-primary/40',
                  )}
                >
                  {highlight && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="copper" size="md">
                        Чаще всего берут
                      </Badge>
                    </div>
                  )}

                  <CategoryArt slug="prebuilt" className="aspect-16/10 w-full" />

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div>
                      <p className="eyebrow">Сборка</p>
                      <h3 className="mt-2 font-display text-xl leading-tight font-extrabold tracking-tight">
                        {build.shortName.replace('Сборка ', '')}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {build.highlights[0]}
                    </p>

                    <dl className="flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
                      {build.specs.slice(0, 4).map((spec) => (
                        <div
                          key={spec.key}
                          className="flex items-baseline justify-between gap-4 bg-card px-4 py-2.5"
                        >
                          <dt className="text-xs text-muted-foreground">{spec.key}</dt>
                          <dd className="text-right font-mono text-2xs text-foreground">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-auto flex flex-col gap-4 pt-2">
                      <Price
                        price={build.price}
                        {...(build.oldPrice !== undefined && { oldPrice: build.oldPrice })}
                        size="lg"
                      />

                      <div className="flex gap-2">
                        <AddToCartButton product={build} className="flex-1" />
                        <Button asChild variant="secondary" size="icon" aria-label="Подробнее">
                          <Link href={`/product/${build.slug}`}>
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
