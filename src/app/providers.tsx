'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/shared/ui/controls';
import { SmoothScroll } from '@/widgets/smooth-scroll';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Catalogue data changes on the order of hours, not seconds.
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * One client per browser session, a fresh one per server request — the standard
 * App Router pattern that prevents request data leaking between users.
 */
function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="tochkacomp:theme"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200} skipDelayDuration={400}>
          <SmoothScroll />
          {children}
          <Toaster
            position="bottom-right"
            offset={20}
            gap={10}
            toastOptions={{
              classNames: {
                toast:
                  'glass-strong !rounded-xl !border-border !text-foreground !font-sans !text-sm',
                description: '!text-muted-foreground !text-xs',
                actionButton: '!bg-primary !text-primary-foreground !rounded-full !font-semibold',
              },
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
