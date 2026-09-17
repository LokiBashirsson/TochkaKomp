import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface SectionHeadingProps {
  /** Spec-sheet notation, not a decorative number. */
  eyebrow: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  align?: 'start' | 'center';
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = 'start',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-4 text-3xl font-extrabold">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {link.label}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
