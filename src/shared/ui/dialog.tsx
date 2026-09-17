'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

const Overlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function Overlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-void/70 backdrop-blur-md',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className,
      )}
      {...props}
    />
  );
});

type Side = 'center' | 'right' | 'bottom';

const panelBySide: Record<Side, string> = {
  center:
    'left-1/2 top-1/2 max-h-[88svh] w-[min(56rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl',
  right: 'inset-y-0 right-0 h-full w-[min(28rem,92vw)] rounded-l-2xl',
  bottom: 'inset-x-0 bottom-0 max-h-[88svh] w-full rounded-t-2xl',
};

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: Side;
  /** Hide the built-in close button when the content supplies its own. */
  hideClose?: boolean;
}

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, children, side = 'center', hideClose, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'glass-strong fixed z-50 flex flex-col overflow-hidden',
          'duration-300 ease-[var(--ease-out-expo)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          panelBySide[side],
          side === 'right' &&
            'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
          side === 'bottom' &&
            'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          side === 'center' && 'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className={cn(
              'absolute top-4 right-4 z-10 grid size-9 cursor-pointer place-items-center rounded-full',
              'border border-border bg-card/80 text-muted-foreground',
              'transition-colors hover:border-primary hover:text-foreground',
            )}
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Закрыть</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 border-b border-border px-6 py-5 pr-16', className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-5', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row', className)}
      {...props}
    />
  );
}
