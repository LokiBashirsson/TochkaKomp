import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  function Input({ className, type = 'text', ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-12 w-full rounded-xl border border-input bg-transparent px-4 text-sm text-foreground',
          'placeholder:text-muted-foreground/70',
          'transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--tc-copper)_40%,var(--input))]',
          'focus:border-primary focus:outline-none focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-destructive',
          className,
        )}
        {...props}
      />
    );
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<'textarea'>
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground',
        'placeholder:text-muted-foreground/70',
        'transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--tc-copper)_40%,var(--input))]',
        'focus:border-primary focus:outline-none focus-visible:outline-none',
        'aria-[invalid=true]:border-destructive',
        className,
      )}
      {...props}
    />
  );
});

/** Field wrapper: label, control, hint and error in one accessible unit. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-xs font-semibold tracking-wide text-foreground">
        {label}
        {required && (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
