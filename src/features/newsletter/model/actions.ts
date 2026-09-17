'use server';

import { newsletterSchema, type NewsletterInput } from './schema';

export interface ActionResult {
  ok: boolean;
  message: string;
}

/**
 * Server Action. Validation runs again here because client-side validation is a
 * convenience for the visitor, never a security boundary.
 *
 * Delivery is a stub: wire `RESEND_API_KEY` and swap the marked block for a
 * `resend.contacts.create()` call.
 */
export async function subscribeToNewsletter(input: NewsletterInput): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Проверьте адрес почты' };
  }

  try {
    // --- Replace with Resend when credentials are configured -----------------
    await new Promise((resolve) => setTimeout(resolve, 400));
    // -------------------------------------------------------------------------

    return { ok: true, message: `Подписали ${parsed.data.email}. Первое письмо — в ближайшую среду.` };
  } catch {
    return { ok: false, message: 'Сервис рассылки не отвечает. Попробуйте позже.' };
  }
}
