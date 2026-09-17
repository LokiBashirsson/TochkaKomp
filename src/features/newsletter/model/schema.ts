import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите почту')
    .email('Проверьте адрес — похоже, в нём опечатка'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
