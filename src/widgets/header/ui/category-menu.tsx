'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Category } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';

/**
 * Twelve categories in a three-column grid. Each row carries its own glyph, so
 * the menu reads as a shelf rather than a list of words.
 */
export function CategoryMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          open ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Каталог
        <ChevronDown
          className={cn('size-4 transition-transform duration-300', open && 'rotate-180')}
          aria-hidden="true"
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={16}
          collisionPadding={24}
          className={cn(
            'glass-strong z-50 w-[min(56rem,92vw)] rounded-2xl p-3',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-98 data-[state=open]:slide-in-from-top-2',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        >
          <ul className="grid grid-cols-2 gap-1 xl:grid-cols-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalog/${category.slug}`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                >
                  <CategoryArt
                    slug={category.slug}
                    ambient={false}
                    className="size-11 shrink-0 rounded-lg border border-border transition-colors group-hover:border-primary"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{category.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {category.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Не знаете, что подойдёт? Соберём конфигурацию под задачу и бюджет.
            </p>
            <Link
              href="/pc-builder"
              onClick={() => setOpen(false)}
              className="shrink-0 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Конфигуратор
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
