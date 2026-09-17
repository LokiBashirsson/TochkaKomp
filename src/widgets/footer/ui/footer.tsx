import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { NewsletterForm } from '@/features/newsletter/ui/newsletter-form';
import { contacts, footerNav, legal, siteConfig, social } from '@/shared/config/site';
import { Logo } from '@/shared/ui/logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="container-page section-tight">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>

            <address className="flex flex-col gap-3 text-sm not-italic">
              <a
                href={contacts.phoneHref}
                className="inline-flex items-center gap-3 font-semibold transition-colors hover:text-primary"
              >
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span data-numeric>{contacts.phone}</span>
              </a>
              <span className="inline-flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {contacts.address.city}, {contacts.address.street}
                </span>
              </span>
            </address>

            <dl className="flex flex-col gap-1 text-xs text-muted-foreground">
              {contacts.hours.map((entry) => (
                <div key={entry.days} className="flex gap-2">
                  <dt className="w-16 shrink-0">{entry.days}</dt>
                  <dd data-numeric>{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footerNav.map((group) => (
                <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                  <h2 id={`footer-${group.title}`} className="eyebrow mb-4">
                    {group.title}
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <NewsletterForm />
          </div>
        </div>

        <hr className="rule-fade my-10" />

        <div className="flex flex-col-reverse gap-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. ИНН <span data-numeric>{legal.inn}</span> · В Махачкале
            с <span data-numeric>{legal.since}</span> года.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  {item.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-3xl text-2xs leading-relaxed text-muted-foreground/70">
          Информация на сайте не является публичной офертой. Характеристики и комплектация уточняйте
          у менеджера — производители меняют ревизии без уведомления.
        </p>
      </div>
    </footer>
  );
}
