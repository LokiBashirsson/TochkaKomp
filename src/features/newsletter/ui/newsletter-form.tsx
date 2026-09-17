'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeToNewsletter } from '@/features/newsletter/model/actions';
import { newsletterSchema, type NewsletterInput } from '@/features/newsletter/model/schema';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: NewsletterInput) {
    const result = await subscribeToNewsletter(values);
    if (result.ok) {
      toast.success('Готово', { description: result.message });
      reset();
    } else {
      toast.error('Не отправилось', { description: result.message });
    }
  }

  return (
    <section aria-labelledby="newsletter-heading" className="glass rounded-2xl p-6 sm:p-8">
      <h2 id="newsletter-heading" className="font-display text-lg font-bold tracking-tight">
        Письмо по средам
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Что подешевело за неделю, что приехало и что брать не стоит. Одно письмо, без рассылок про
        «уникальные предложения».
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Электронная почта
            </label>
            <Input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
              {...register('email')}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
            {isSubmitting ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Send aria-hidden="true" />
            )}
            Подписаться
          </Button>
        </div>

        {errors.email && (
          <p id="newsletter-email-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </form>
    </section>
  );
}
