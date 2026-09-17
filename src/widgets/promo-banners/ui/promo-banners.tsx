import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Reveal } from '@/shared/ui/reveal';

interface Banner {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  tone: 'copper' | 'caspian';
}

const banners: Banner[] = [
  {
    eyebrow: 'Сервисный центр',
    title: 'Диагностика — бесплатно, всегда',
    body: 'Не включается, шумит, перегревается или просто стал медленным. Посмотрим и скажем, что с этим делать, до того как вы решите платить за ремонт.',
    href: '/service',
    cta: 'Записаться на диагностику',
    tone: 'copper',
  },
  {
    eyebrow: 'Trade-in',
    title: 'Старая видеокарта — часть новой',
    body: 'Оценим ваше железо за 20 минут при вас и вычтем сумму из стоимости апгрейда. Никаких «пришлите фото, перезвоним в течение недели».',
    href: '/service#trade-in',
    cta: 'Узнать оценку',
    tone: 'caspian',
  },
];

export function PromoBanners() {
  return (
    <section aria-label="Специальные предложения" className="section-tight">
      <div className="container-page grid gap-4 lg:grid-cols-2">
        {banners.map((banner, index) => (
          <Reveal key={banner.title} delay={index * 0.08}>
            <Link
              href={banner.href}
              className={cn(
                'group glass edge-copper relative isolate flex h-full flex-col overflow-hidden rounded-2xl p-8 sm:p-10',
                'transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)]',
                'hover:-translate-y-1 hover:shadow-lift',
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -top-1/3 -right-1/4 -z-10 size-[28rem] rounded-full opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
                style={{
                  background:
                    banner.tone === 'copper'
                      ? 'radial-gradient(circle, var(--tc-glow), transparent 68%)'
                      : 'radial-gradient(circle, color-mix(in srgb, var(--tc-caspian) 34%, transparent), transparent 68%)',
                }}
              />

              <p className="eyebrow">{banner.eyebrow}</p>
              <h3 className="mt-4 max-w-[14ch] text-2xl font-extrabold">{banner.title}</h3>
              <p className="mt-4 max-w-md flex-1 text-sm leading-relaxed text-muted-foreground">
                {banner.body}
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {banner.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
