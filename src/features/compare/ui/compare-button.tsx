'use client';

import { Scale } from 'lucide-react';
import { toast } from 'sonner';
import { COMPARE_LIMIT, useCompareStore, useIsCompared } from '@/features/compare/model/store';
import { useHydrated } from '@/shared/hooks/use-hydrated';
import { cn } from '@/shared/lib/cn';

export function CompareButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const hydrated = useHydrated();
  const active = useIsCompared(slug);
  const count = useCompareStore((state) => state.slugs.length);
  const toggle = useCompareStore((state) => state.toggle);
  const on = hydrated && active;

  function handleClick() {
    if (!active && count >= COMPARE_LIMIT) {
      toast.error('В сравнении уже четыре товара', {
        description: 'Уберите один, чтобы добавить новый — иначе таблица перестанет читаться.',
      });
      return;
    }
    toggle(slug);
    toast(active ? 'Убрано из сравнения' : 'Добавлено к сравнению', {
      description: name,
      ...(!active && { action: { label: 'Сравнить', onClick: () => (window.location.href = '/compare') } }),
    });
  }

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Убрать из сравнения: ${name}` : `Добавить к сравнению: ${name}`}
      onClick={handleClick}
      className={cn(
        'grid size-9 cursor-pointer place-items-center rounded-full border border-border',
        'bg-card/70 backdrop-blur-sm transition-colors duration-200',
        'hover:border-primary hover:text-primary',
        on ? 'border-primary text-primary' : 'text-muted-foreground',
        className,
      )}
    >
      <Scale className="size-4" aria-hidden="true" />
    </button>
  );
}
