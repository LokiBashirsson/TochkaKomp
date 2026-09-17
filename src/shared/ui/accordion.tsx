'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-border last:border-b-0', className)}
      {...props}
    />
  );
});

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'group flex flex-1 cursor-pointer items-start justify-between gap-6 py-6 text-left',
          'text-lg font-semibold tracking-tight transition-colors hover:text-primary',
          'data-[state=open]:text-primary',
          className,
        )}
        {...props}
      >
        {children}
        <Plus
          aria-hidden="true"
          className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden',
        'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
        className,
      )}
      {...props}
    >
      <div className={cn('max-w-[68ch] pb-6 text-muted-foreground')}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
