import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

/**
 * The copper fill is reserved for the single most important action on a view.
 * Everything else is glass or ghost — that restraint is what keeps the accent
 * meaning "do this one".
 */
const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2',
    'rounded-full font-semibold whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)]',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:opacity-45',
    'active:scale-[0.98]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-[0_8px_28px_-10px_var(--tc-glow)] hover:bg-copper-soft hover:shadow-[0_14px_40px_-12px_var(--tc-glow)]',
        secondary:
          'glass text-foreground hover:border-[color-mix(in_srgb,var(--tc-copper)_55%,transparent)]',
        outline:
          'border border-input bg-transparent text-foreground hover:border-primary hover:text-primary',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        danger: 'bg-destructive text-white hover:brightness-110',
        link: 'h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-xs [&_svg]:size-4',
        md: 'h-11 px-6 text-sm [&_svg]:size-4',
        lg: 'h-14 px-8 text-base [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-5',
        'icon-sm': 'size-9 [&_svg]:size-4',
      },
    },
    compoundVariants: [{ variant: 'link', size: ['sm', 'md', 'lg'], class: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the single child element (e.g. a Next.js `<Link>`). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      type={asChild ? undefined : (type ?? 'button')}
      {...props}
    />
  );
});

export { buttonVariants };
