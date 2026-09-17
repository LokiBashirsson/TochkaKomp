import type { MetadataRoute } from 'next';
import { getBrands, getCategories, getAllProductSlugs } from '@/shared/api/repository';
import { siteConfig } from '@/shared/config/site';

const staticRoutes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/catalog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/deals', priority: 0.9, changeFrequency: 'daily' },
  { path: '/pc-builder', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/brands', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/service', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contacts', priority: 0.7, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, brands, slugs] = await Promise.all([
    getCategories(),
    getBrands(),
    getAllProductSlugs(),
  ]);

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...categories.map((category) => ({
      url: `${siteConfig.url}/catalog/${category.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...brands.map((brand) => ({
      url: `${siteConfig.url}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...slugs.map((slug) => ({
      url: `${siteConfig.url}/product/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
