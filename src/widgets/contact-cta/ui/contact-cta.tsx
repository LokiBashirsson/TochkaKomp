import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { contacts } from '@/shared/config/site';
import { Button } from '@/shared/ui/button';
import { Magnetic } from '@/shared/ui/magnetic';
import { Reveal } from '@/shared/ui/reveal';

export function ContactCta() {
  return (
    <section aria-labelledby="contact-cta-heading" className="section">
      <div className="container-page">
        <Reveal>
          <div className="glass grain relative isolate overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12 sm:py-24">
            <div aria-hidden="true" className="mesh-field -z-10 opacity-80" />

            <p className="eyebrow">Следующий шаг</p>
            <h2 id="contact-cta-heading" className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold">
              Расскажите, для чего нужен компьютер
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Игры, монтаж, учёба, работа с 3D или просто «чтобы не тормозил». Подберём конфигурацию
              под задачу и бюджет — без звонков «уточнить наличие» и навязанных допов.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Button asChild size="lg">
                  <Link href="/pc-builder">
                    Открыть конфигуратор
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="secondary">
                <a href={contacts.phoneHref}>
                  <Phone aria-hidden="true" />
                  <span data-numeric>{contacts.phone}</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" />
                  Telegram
                </a>
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              {contacts.address.city}, {contacts.address.street} · {contacts.hours[0].days}{' '}
              <span data-numeric>{contacts.hours[0].time}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
