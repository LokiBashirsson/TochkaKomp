import { faqItems } from '@/shared/config/faq';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Reveal } from '@/shared/ui/reveal';
import { SectionHeading } from '@/shared/ui/section-heading';

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              id="faq-heading"
              eyebrow="Частые вопросы"
              title="Спрашивают чаще всего"
              description="Не нашли свой вопрос — позвоните или напишите в Telegram, отвечаем в рабочее время за несколько минут."
              link={{ href: '/contacts', label: 'Задать вопрос' }}
              className="sm:flex-col sm:items-start"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible defaultValue="faq-0">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
