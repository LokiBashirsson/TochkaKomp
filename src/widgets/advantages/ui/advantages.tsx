import {
  Gauge,
  HandCoins,
  MapPinned,
  Repeat2,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/shared/ui/reveal';
import { SectionHeading } from '@/shared/ui/section-heading';

interface Advantage {
  icon: LucideIcon;
  /** Spec-sheet notation — the measurable claim, when there is one. */
  metric: string;
  title: string;
  body: string;
}

const advantages: Advantage[] = [
  {
    icon: Gauge,
    metric: '4 ч',
    title: 'Стенд, а не описание с сайта',
    body: 'Каждая сборка проходит четыре часа под нагрузкой: температуры, стабильность памяти, поведение вентиляторов. Отчёт отдаём вместе с компьютером.',
  },
  {
    icon: Wrench,
    metric: 'в городе',
    title: 'Сервис здесь, а не в Москве',
    body: 'Гарантийный случай решается на месте. Не нужно отправлять карту транспортной компанией и ждать три недели ответа.',
  },
  {
    icon: HandCoins,
    metric: '−0 ₽',
    title: 'Отговорим от лишнего',
    body: 'Если для ваших задач хватит процессора дешевле — скажем об этом. Продать дорогое один раз проще, чем остаться магазином, куда возвращаются.',
  },
  {
    icon: MapPinned,
    metric: '5 городов',
    title: 'Доставка по Дагестану',
    body: 'Махачкала — в день заказа. Каспийск, Дербент, Избербаш, Хасавюрт — на следующий. Компьютер везём собранным и упакованным в жёсткий короб.',
  },
  {
    icon: ShieldCheck,
    metric: '36 мес',
    title: 'Гарантия на систему целиком',
    body: 'Не на «отдельные комплектующие по гарантии производителя», а на сборку как на изделие. Разбираться, что именно отказало, — наша работа.',
  },
  {
    icon: Repeat2,
    metric: 'trade-in',
    title: 'Старое железо в зачёт',
    body: 'Оценим вашу видеокарту или процессор и вычтем из стоимости новой сборки. Оценка бесплатная и ни к чему не обязывает.',
  },
];

export function Advantages() {
  return (
    <section aria-labelledby="advantages-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="advantages-heading"
            eyebrow="Почему сюда"
            title="Шесть причин, которые проверяются"
            description="Каждая из них — то, что можно спросить у нас в лицо и получить конкретный ответ."
          />
        </Reveal>

        <Stagger className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => (
            <StaggerItem key={advantage.title}>
              <article className="glass edge-copper flex h-full flex-col gap-4 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-lg border border-border text-primary"
                  >
                    <advantage.icon className="size-5" />
                  </span>
                  <span className="font-mono text-2xs tracking-[0.16em] text-muted-foreground uppercase">
                    {advantage.metric}
                  </span>
                </div>

                <h3 className="text-base leading-snug font-bold tracking-tight">
                  {advantage.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{advantage.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
