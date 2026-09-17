import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import type { Review } from '@/entities/product/model/types';
import { Rating } from '@/entities/product/ui/rating';
import { formatDate } from '@/shared/lib/format';
import { Reveal } from '@/shared/ui/reveal';
import { SectionHeading } from '@/shared/ui/section-heading';

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-heading" className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="reviews-heading"
            eyebrow="Отзывы покупателей"
            title="Что пишут после покупки"
            description="Публикуем все отзывы, включая четвёрки. Отредактированные пятёрки не помогают выбрать."
          />
        </Reveal>
      </div>

      <ul className="rail mt-10 items-stretch">
        {reviews.map((review) => (
          <li key={review.id} className="flex w-[20rem] sm:w-[24rem]">
            <article className="glass flex flex-col gap-4 rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <Rating value={review.rating} showCount={false} />
                <time
                  dateTime={review.createdAt}
                  className="font-mono text-2xs text-muted-foreground"
                >
                  {formatDate(review.createdAt)}
                </time>
              </div>

              <h3 className="text-base leading-snug font-bold tracking-tight">{review.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

              <footer className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs">
                  <span className="font-semibold">{review.author}</span>
                  <span className="text-muted-foreground"> · {review.city}</span>
                </p>
                {review.verified && (
                  <span className="inline-flex items-center gap-1.5 text-2xs text-success">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Покупка подтверждена
                  </span>
                )}
              </footer>

              <Link
                href={`/product/${review.productSlug}`}
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                Товар из отзыва
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
