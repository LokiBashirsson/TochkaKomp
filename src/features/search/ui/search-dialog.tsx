'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CornerDownLeft, Loader2, Search, X } from 'lucide-react';
import { CategoryArt } from '@/entities/category/ui/category-art';
import type { SearchResponse, SearchResultItem } from '@/features/search/model/types';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';

const SUGGESTIONS = ['RTX 5070', '9800X3D', 'DDR5 6000', 'блок питания', 'сборка для игр'];

async function fetchResults(term: string): Promise<SearchResultItem[]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Поиск временно недоступен');
  const data = (await response.json()) as SearchResponse;
  return data.items;
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [term, setTerm] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const debounced = useDebouncedValue(term.trim(), 220);

  const { data: items = [], isFetching, isError } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => fetchResults(debounced),
    enabled: debounced.length >= 2,
    placeholderData: (previous) => previous,
  });

  React.useEffect(() => setActiveIndex(0), [debounced]);

  // Reset only after the close animation, so the list does not flash empty.
  React.useEffect(() => {
    if (open) return;
    const timeout = setTimeout(() => setTerm(''), 260);
    return () => clearTimeout(timeout);
  }, [open]);

  function go(slug: string) {
    onOpenChange(false);
    router.push(`/product/${slug}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = items[activeIndex];
      if (active) go(active.slug);
      else if (term.trim()) {
        onOpenChange(false);
        router.push(`/catalog?q=${encodeURIComponent(term.trim())}`);
      }
    }
  }

  const showEmpty = debounced.length >= 2 && !isFetching && items.length === 0 && !isError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        side="center"
        hideClose
        className="top-[12vh] max-h-[76svh] w-[min(42rem,92vw)] translate-y-0 sm:top-[14vh]"
      >
        <DialogTitle className="sr-only">Поиск по каталогу</DialogTitle>
        <DialogDescription className="sr-only">
          Введите название, модель или артикул. Стрелки — перемещение, Enter — открыть.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          {/* Autofocus is correct here: the dialog exists only to be typed into. */}
          <input
            autoFocus
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Что ищете? Модель, бренд или артикул"
            aria-label="Поиск по каталогу"
            aria-controls="search-results"
            className="h-16 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          {isFetching && (
            <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Закрыть поиск"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div id="search-results" className="min-h-0 flex-1 overflow-y-auto p-3">
          {debounced.length < 2 && (
            <div className="p-4">
              <p className="eyebrow mb-3">Частые запросы</p>
              <ul className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => setTerm(suggestion)}
                      className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isError && (
            <p role="alert" className="p-6 text-center text-sm text-destructive">
              Поиск не отвечает. Попробуйте ещё раз или откройте каталог целиком.
            </p>
          )}

          {showEmpty && (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold">Ничего не нашли по запросу «{debounced}»</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Проверьте раскладку или напишите короче — например, «5070» вместо полного названия.
              </p>
              <Link
                href="/catalog"
                onClick={() => onOpenChange(false)}
                className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Открыть весь каталог
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <ul role="listbox" aria-label="Результаты поиска" className="flex flex-col gap-1">
              {items.map((item, index) => (
                <li key={item.slug}>
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => onOpenChange(false)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={cn(
                      'flex items-center gap-4 rounded-lg p-3 transition-colors',
                      index === activeIndex ? 'bg-muted' : 'hover:bg-muted/60',
                    )}
                  >
                    <CategoryArt
                      slug={item.category}
                      ambient={false}
                      className="size-14 shrink-0 rounded-md border border-border"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="eyebrow block">{item.brand}</span>
                      <span className="block truncate text-sm font-semibold">{item.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      {item.discount > 0 && <Badge variant="success">−{item.discount}%</Badge>}
                      <span data-numeric className="text-sm font-bold">
                        {formatPrice(item.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3 text-2xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">↑</kbd>
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">↓</kbd>
            навигация
          </span>
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="size-3" aria-hidden="true" />
            открыть
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">Esc</kbd>
            закрыть
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
