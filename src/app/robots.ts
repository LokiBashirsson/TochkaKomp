import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Personal and transient surfaces carry no search value and should not
        // consume crawl budget.
        disallow: ['/api/', '/cart', '/account', '/compare', '/wishlist', '/*?q='],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
