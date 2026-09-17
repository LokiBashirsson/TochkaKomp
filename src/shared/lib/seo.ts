import type { Metadata } from 'next';
import type { Product, Review } from '@/entities/product/model/types';
import { contacts, legal, siteConfig } from '@/shared/config/site';

const BASE = siteConfig.url;

export function absoluteUrl(path = '/'): string {
  return new URL(path, BASE).toString();
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Set for pages that must not be indexed (cart, account). */
  noIndex?: boolean;
  images?: string[];
}

/**
 * One builder for every page's metadata, so title templates, canonicals,
 * Open Graph and Twitter cards can never drift apart.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  images,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = images?.[0] ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/* -- JSON-LD ---------------------------------------------------------------- */

type JsonLd = Record<string, unknown>;

export function organizationLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: BASE,
    logo: absoluteUrl('/icon.svg'),
    foundingDate: String(legal.since),
    taxID: legal.inn,
    email: contacts.email,
    telephone: contacts.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address.street,
      addressLocality: contacts.address.city,
      addressRegion: contacts.address.region,
      postalCode: contacts.address.postalCode,
      addressCountry: contacts.address.country,
    },
    sameAs: [contacts.telegram, contacts.whatsapp],
  };
}

export function localBusinessLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    '@id': `${BASE}/#store`,
    name: siteConfig.name,
    image: absoluteUrl(siteConfig.ogImage),
    url: BASE,
    telephone: contacts.phone,
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address.street,
      addressLocality: contacts.address.city,
      addressRegion: contacts.address.region,
      postalCode: contacts.address.postalCode,
      addressCountry: contacts.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contacts.geo.latitude,
      longitude: contacts.geo.longitude,
    },
    openingHoursSpecification: contacts.openingHoursSpec.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: spec.days,
      opens: spec.opens,
      closes: spec.closes,
    })),
  };
}

export function websiteLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: siteConfig.name,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${BASE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/catalog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

const availabilityUrl: Record<Product['availability'], string> = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  preorder: 'https://schema.org/PreOrder',
  out_of_stock: 'https://schema.org/OutOfStock',
};

export function productLd(product: Product, productReviews: Review[] = []): JsonLd {
  const url = absoluteUrl(`/product/${product.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    url,
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review: productReviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.createdAt,
      name: review.title,
      reviewBody: review.body,
      reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
    })),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'RUB',
      price: product.price,
      availability: availabilityUrl[product.availability],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${BASE}/#organization` },
      priceValidUntil: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: { '@type': 'QuantitativeValue', value: product.warrantyMonths, unitCode: 'MON' },
      },
    },
  };
}

export function breadcrumbLd(trail: { name: string; href: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function itemListLd(productsInList: Product[], listName: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: productsInList.length,
    itemListElement: productsInList.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}
