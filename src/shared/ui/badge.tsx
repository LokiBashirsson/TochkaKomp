import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-mono text-2xs font-medium tracking-[0.12em] uppercase',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground',
        copper: 'bg-[color-mix(in_srgb,var(--tc-copper)_18%,transparent)] text-copper',
        caspian: 'bg-[color-mix(in_srgb,var(--tc-caspian)_18%,transparent)] text-caspian',
        success: 'bg-[color-mix(in_srgb,var(--tc-success)_18%,transparent)] text-success',
        danger: 'bg-[color-mix(in_srgb,var(--tc-danger)_18%,transparent)] text-danger',
        outline: 'border border-border text-muted-foreground',
      },
      size: {
        sm: 'h-5 px-2',
        md: 'h-7 px-3',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
