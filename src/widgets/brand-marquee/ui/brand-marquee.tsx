import Link from 'next/link';
import type { Brand } from '@/entities/product/model/types';

/**
 * Two identical tracks scrolling as one 200%-wide strip; the keyframe stops at
 * −50%, so the seam lands exactly where the second copy begins and the loop is
 * invisible. Pauses on hover and freezes entirely under reduced motion.
 */
export function BrandMarquee({ brands }: { brands: Brand[] }) {
  const track = [...brands, ...brands];

  return (
    <section aria-labelledby="brands-heading" className="section-tight overflow-hidden">
      <div className="container-page">
        <h2 id="brands-heading" className="eyebrow text-center">
          Работаем напрямую с 24 производителями
        </h2>
      </div>

      <div
        className="group relative mt-8 flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
        aria-hidden="true"
      >
        <ul className="flex w-max animate-marquee items-center gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((brand, index) => (
            <li key={`${brand.slug}-${index}`}>
              <Link
                href={`/brands/${brand.slug}`}
                tabIndex={-1}
                className="flex h-14 items-center rounded-xl border border-border px-7 font-display text-sm font-bold tracking-tight whitespace-nowrap text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* The marquee is decorative duplication; this is the accessible list. */}
      <ul className="sr-only">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link href={`/brands/${brand.slug}`}>{brand.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
