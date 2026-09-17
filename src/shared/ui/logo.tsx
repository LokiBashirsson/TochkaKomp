import Link from 'next/link';
import { cn } from '@/shared/lib/cn';

/**
 * The wordmark is the brand's one joke, and it is a true one: «точка» is the
 * Russian word for a dot. So the dot is the logo — a copper disc sitting in the
 * seam of the name, the same copper used for every accent on the site.
 */
export function Logo({
  className,
  href = '/',
  label = true,
}: {
  className?: string;
  href?: string | null;
  label?: boolean;
}) {
  const content = (
    <span className={cn('inline-flex items-baseline gap-[0.18em]', className)}>
      <span className="font-display text-[0.95rem] leading-none font-extrabold tracking-[-0.04em] uppercase">
        Tochka
      </span>
      <span
        aria-hidden="true"
        className="size-[0.42em] shrink-0 translate-y-[-0.06em] rounded-full bg-copper shadow-[0_0_12px_var(--tc-glow)]"
      />
      <span className="font-display text-[0.95rem] leading-none font-extrabold tracking-[-0.04em] text-muted-foreground uppercase">
        Comp
      </span>
      {label && <span className="sr-only">— магазин компьютерной техники в Махачкале</span>}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="rounded-md focus-visible:outline-2" aria-label="TochkaComp, на главную">
      {content}
    </Link>
  );
}
