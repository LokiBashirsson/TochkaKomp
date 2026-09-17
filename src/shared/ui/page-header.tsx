import { Breadcrumbs, type Crumb } from '@/shared/ui/breadcrumbs';
import { cn } from '@/shared/lib/cn';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  trail?: Crumb[];
  children?: React.ReactNode;
  className?: string;
  /** Adds the ambient copper field. Off for utility pages like cart. */
  ambient?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  trail,
  children,
  className,
  ambient = true,
}: PageHeaderProps) {
  return (
    <header className={cn('relative isolate overflow-hidden', className)}>
      {ambient && <div aria-hidden="true" className="mesh-field -z-10 opacity-50" />}

      <div className="container-page pt-10 pb-12 sm:pt-14 sm:pb-16">
        {trail && <Breadcrumbs trail={trail} className="mb-8" />}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
