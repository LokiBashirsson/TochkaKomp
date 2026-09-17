'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Scale, Search, ShoppingBag } from 'lucide-react';
import type { Category } from '@/entities/product/model/types';
import { useCartStore, useCartTotals } from '@/features/cart/model/store';
import { useCompareCount } from '@/features/compare/model/store';
import { SearchDialog } from '@/features/search/ui/search-dialog';
import { useWishlistCount } from '@/features/wishlist/model/store';
import { useHydrated } from '@/shared/hooks/use-hydrated';
import { cn } from '@/shared/lib/cn';
import { primaryNav } from '@/shared/config/site';
import { Logo } from '@/shared/ui/logo';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { CategoryMenu } from './category-menu';
import { MobileNav } from './mobile-nav';

/** Icon button with a count bubble; shared by wishlist, compare and cart. */
function CountAction({
  icon: Icon,
  count,
  label,
  href,
  onClick,
}: {
  icon: typeof Heart;
  count: number;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const hydrated = useHydrated();
  const visible = hydrated ? count : 0;

  const inner = (
    <>
      <Icon className="size-[1.15rem]" aria-hidden="true" />
      {visible > 0 && (
        <span
          data-numeric
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-primary px-1 text-[0.625rem] leading-[1.15rem] font-bold text-primary-foreground"
        >
          {visible > 99 ? '99+' : visible}
        </span>
      )}
      <span className="sr-only">
        {label}
        {visible > 0 ? `, ${visible}` : ''}
      </span>
    </>
  );

  const classes = cn(
    'relative grid size-10 cursor-pointer place-items-center rounded-full',
    'text-muted-foreground transition-colors hover:text-foreground',
  );

  return href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { count: cartCount } = useCartTotals();
  const wishlistCount = useWishlistCount();
  const compareCount = useCompareCount();
  const openCart = useCartStore((state) => state.setOpen);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ⌘K / Ctrl+K anywhere opens search — the shortcut power users expect.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Перейти к содержимому
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[var(--ease-out-expo)]',
          scrolled ? 'pt-2' : 'pt-4 sm:pt-6',
        )}
      >
        <div className="container-page">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]',
              scrolled
                ? 'glass-strong h-14 px-3 sm:px-4'
                : 'h-16 border border-transparent px-3 sm:px-4',
            )}
          >
            <Logo className="mr-2 shrink-0" />

            <nav aria-label="Основная навигация" className="hidden lg:flex lg:items-center lg:gap-1">
              <CategoryMenu categories={categories} />
              {primaryNav.slice(1).map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'group flex h-10 cursor-pointer items-center gap-2 rounded-full text-muted-foreground transition-colors',
                  'px-3 hover:text-foreground',
                  'md:border md:border-border md:pr-2 md:pl-4 md:hover:border-primary',
                )}
              >
                <Search className="size-[1.15rem]" aria-hidden="true" />
                <span className="hidden text-sm md:inline">Поиск</span>
                <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-2xs md:inline">
                  ⌘K
                </kbd>
                <span className="sr-only">Открыть поиск по каталогу</span>
              </button>

              <div className="hidden sm:contents">
                <ThemeToggle />
                <CountAction icon={Scale} count={compareCount} label="Сравнение" href="/compare" />
                <CountAction icon={Heart} count={wishlistCount} label="Избранное" href="/wishlist" />
              </div>

              <CountAction
                icon={ShoppingBag}
                count={cartCount}
                label="Корзина"
                onClick={() => openCart(true)}
              />

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Открыть меню"
                className="grid size-10 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              >
                <Menu className="size-[1.15rem]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} categories={categories} />
    </>
  );
}
