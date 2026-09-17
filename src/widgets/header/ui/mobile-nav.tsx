'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Heart, Phone, Scale } from 'lucide-react';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { Category } from '@/entities/product/model/types';
import { cn } from '@/shared/lib/cn';
import { contacts, primaryNav } from '@/shared/config/site';
import { Logo } from '@/shared/ui/logo';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

export function MobileNav({
  open,
  onOpenChange,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="lg:hidden">
        <DialogHeader>
          <DialogTitle asChild>
            <span>
              <Logo href={null} />
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">Меню сайта и разделы каталога</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-8">
          <nav aria-label="Разделы">
            <ul className="flex flex-col">
              {primaryNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-baseline justify-between gap-4 border-b border-border py-4',
                        'font-display text-xl font-bold tracking-tight transition-colors',
                        active ? 'text-primary' : 'hover:text-primary',
                      )}
                    >
                      {item.label}
                      <span className="text-xs font-normal text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section>
            <h2 className="eyebrow mb-3">Категории</h2>
            <ul className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/catalog/${category.slug}`}
                    onClick={close}
                    className="flex items-center gap-2.5 rounded-lg border border-border p-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                  >
                    <CategoryArt
                      slug={category.slug}
                      ambient={false}
                      className="size-9 shrink-0 rounded-md"
                    />
                    <span className="min-w-0 leading-tight">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex items-center gap-2">
            <Link
              href="/wishlist"
              onClick={close}
              className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
            >
              <Heart className="size-4" aria-hidden="true" />
              Избранное
            </Link>
            <Link
              href="/compare"
              onClick={close}
              className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
            >
              <Scale className="size-4" aria-hidden="true" />
              Сравнение
            </Link>
            <ThemeToggle />
          </section>
        </DialogBody>

        <DialogFooter className="flex-col items-stretch gap-2 sm:flex-col">
          <a
            href={contacts.phoneHref}
            className="flex items-center gap-3 text-sm font-semibold transition-colors hover:text-primary"
          >
            <Phone className="size-4 text-primary" aria-hidden="true" />
            <span data-numeric>{contacts.phone}</span>
          </a>
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Telegram
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
