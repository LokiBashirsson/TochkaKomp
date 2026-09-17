'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useHydrated } from '@/shared/hooks/use-hydrated';
import { cn } from '@/shared/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const dark = !hydrated || resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className={cn(
        'grid size-10 cursor-pointer place-items-center rounded-full border border-border',
        'text-muted-foreground transition-colors hover:border-primary hover:text-primary',
        className,
      )}
    >
      {dark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
