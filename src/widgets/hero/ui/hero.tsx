'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MoveDown } from 'lucide-react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { Button } from '@/shared/ui/button';
import { Counter } from '@/shared/ui/counter';
import { Magnetic } from '@/shared/ui/magnetic';
import { TraceField } from './trace-field';

const stats = [
  { value: 4200, suffix: '+', label: 'собранных компьютеров' },
  { value: 24, suffix: '', label: 'бренда на складе' },
  { value: 4, suffix: ' ч', label: 'стресс-тест перед выдачей' },
  { value: 3, suffix: ' года', label: 'гарантия на сборку' },
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      // The headline is pre-split in markup so its words can rise out of a
      // clipped line box without waiting for JS to measure anything.
      const lede = root.querySelector<HTMLElement>('[data-hero-lede]');
      const split = lede ? new SplitType(lede, { types: 'lines', tagName: 'span' }) : null;

      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

      timeline
        .from('[data-hero-word]', { yPercent: 118, duration: 0.9, stagger: 0.08 }, 0)
        .from('[data-hero-eyebrow]', { opacity: 0, y: 12, duration: 0.5 }, 0)
        .from('[data-hero-canvas]', { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0.05);

      if (split?.lines?.length) {
        timeline.from(split.lines, { opacity: 0, y: 16, duration: 0.7, stagger: 0.06 }, 0.3);
      }

      timeline
        .from('[data-hero-cta]', { opacity: 0, y: 16, duration: 0.6, stagger: 0.08 }, 0.42)
        .from('[data-hero-stat]', { opacity: 0, y: 14, duration: 0.6, stagger: 0.06 }, 0.5);

      return () => split?.revert();
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="mesh-field -z-20" />
      <div data-hero-canvas aria-hidden="true" className="absolute inset-0 -z-10">
        <TraceField className="size-full" />
      </div>

      <div className="container-page relative flex min-h-[min(88svh,54rem)] flex-col justify-center py-24">
        <div className="max-w-3xl">
          <p data-hero-eyebrow className="eyebrow">
            Махачкала · пр. Имама Шамиля, 48 · с 2014 года
          </p>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-5xl leading-[0.95] font-extrabold tracking-[-0.045em]"
          >
            <span className="sr-only">Точка сборки</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="inline-block">
                Точка
              </span>
              <span className="ml-[0.14em] inline-block size-[0.15em] translate-y-[-0.18em] rounded-full bg-copper shadow-[0_0_32px_var(--tc-glow)]" />
            </span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="inline-block">
                сборки
              </span>
            </span>
          </h1>

          <p data-hero-lede className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Комплектующие, готовые системы и сервис в одном месте. Всё, что продаём, проверяем на
            стенде. Всё, что собираем, гоняем четыре часа под нагрузкой — и только потом отдаём.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span data-hero-cta className="inline-flex">
              <Magnetic>
                <Button asChild size="lg">
                  <Link href="/pc-builder">
                    Собрать компьютер
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
            </span>
            <span data-hero-cta className="inline-flex">
              <Button asChild size="lg" variant="secondary">
                <Link href="/catalog">Открыть каталог</Link>
              </Button>
            </span>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 lg:mt-24 lg:grid-cols-4">
          {stats.map((stat) => (
            <div data-hero-stat key={stat.label} className="flex flex-col gap-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <p aria-hidden="true" className="text-xs leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#categories"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-2xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-primary lg:flex"
      >
        <MoveDown className="size-3.5 animate-bounce" aria-hidden="true" />
        Каталог
      </a>
    </section>
  );
}
