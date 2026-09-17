import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  /** Say what to do next, not that something is missing. */
  description: string;
  action?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'glass flex flex-col items-center rounded-2xl px-6 py-16 text-center sm:py-24',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-full border border-border text-muted-foreground"
      >
        <Icon className="size-6" />
      </span>

      <h2 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>

      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {action && (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="secondary">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
