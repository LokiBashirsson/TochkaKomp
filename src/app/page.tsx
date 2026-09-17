import {
  getBestsellers,
  getBrandNames,
  getBrands,
  getCategories,
  getCategoryCounts,
  getDeals,
  getNewArrivals,
  getPrebuilts,
  getReviews,
} from '@/shared/api/repository';
import { faqItems } from '@/shared/config/faq';
import { faqLd, itemListLd } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/json-ld';
import { Advantages } from '@/widgets/advantages/ui/advantages';
import { BrandMarquee } from '@/widgets/brand-marquee/ui/brand-marquee';
import { CategoryGrid } from '@/widgets/category-grid/ui/category-grid';
import { ContactCta } from '@/widgets/contact-cta/ui/contact-cta';
import { FaqSection } from '@/widgets/faq/ui/faq-section';
import { Hero } from '@/widgets/hero/ui/hero';
import { PrebuiltShowcase } from '@/widgets/prebuilt-showcase/ui/prebuilt-showcase';
import { ProductRail } from '@/widgets/product-rail/ui/product-rail';
import { PromoBanners } from '@/widgets/promo-banners/ui/promo-banners';
import { ReviewsSection } from '@/widgets/reviews/ui/reviews-section';

/** Fully static. The catalogue is revalidated by the CMS webhook, not by time. */
export const revalidate = 3600;

export default async function HomePage() {
  const [categories, counts, brandNames, brands, bestsellers, newArrivals, deals, builds, reviews] =
    await Promise.all([
      getCategories(),
      getCategoryCounts(),
      getBrandNames(),
      getBrands(),
      getBestsellers(8),
      getNewArrivals(8),
      getDeals(8),
      getPrebuilts(),
      getReviews(),
    ]);

  // Cheapest, mid, flagship — the ladder the section is built to show.
  const showcase = [builds.at(0), builds.at(1), builds.at(-1)].filter(
    (build): build is NonNullable<typeof build> => Boolean(build),
  );

  return (
    <>
      <Hero />

      <CategoryGrid categories={categories} counts={counts} />

      <ProductRail
        headingId="bestsellers-heading"
        eyebrow="Выбор покупателей"
        title="Берут чаще всего"
        description="Позиции, которые уезжают со склада быстрее остальных — и к которым не возвращаются с претензиями."
        products={bestsellers}
        brandNames={brandNames}
        link={{ href: '/catalog?sort=popular', label: 'Смотреть все' }}
      />

      <PrebuiltShowcase builds={showcase} />

      <ProductRail
        headingId="deals-heading"
        eyebrow="Скидки недели"
        title="Стало дешевле"
        description="Цены снижены до конца недели или пока не закончится складской остаток."
        products={deals}
        brandNames={brandNames}
        link={{ href: '/deals', label: 'Все акции' }}
      />

      <PromoBanners />

      <ProductRail
        headingId="new-heading"
        eyebrow="Новое на складе"
        title="Только приехало"
        description="Свежие поступления — от новых поколений видеокарт до периферии, которую стоит потрогать в магазине."
        products={newArrivals}
        brandNames={brandNames}
        link={{ href: '/catalog?sort=new', label: 'Все новинки' }}
      />

      <Advantages />

      <BrandMarquee brands={brands} />

      <ReviewsSection reviews={reviews} />

      <FaqSection />

      <ContactCta />

      <JsonLd
        data={[
          faqLd([...faqItems]),
          itemListLd(bestsellers, 'Хиты продаж TochkaComp'),
        ]}
      />
    </>
  );
}
