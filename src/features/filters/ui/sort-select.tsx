'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, Check } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SORT_OPTIONS, type SortKey } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';

export function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();

  const current = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  function select(next: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'popular') params.delete('sort');
    else params.set('sort', next);
    params.delete('page');

    const query = params.toString();
    startTransition(() => router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false }));
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-busy={pending}
        className={cn(
          'inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4',
          'text-sm font-semibold transition-colors hover:border-primary',
          'data-[state=open]:border-primary',
        )}
      >
        <ArrowUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">Сортировка:</span>
        {current.label}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            'glass-strong z-50 min-w-56 rounded-xl p-1.5',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => select(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm',
                'outline-none transition-colors data-[highlighted]:bg-muted',
                option.value === value && 'text-primary',
              )}
            >
              {option.label}
              {option.value === value && <Check className="size-4" aria-hidden="true" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
