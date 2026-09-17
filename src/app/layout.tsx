import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CartDrawer } from '@/features/cart/ui/cart-drawer';
import { getCategories } from '@/shared/api/repository';
import { fontVariables } from '@/shared/config/fonts';
import { siteConfig } from '@/shared/config/site';
import { localBusinessLd, organizationLd, websiteLd } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/json-ld';
import { Footer } from '@/widgets/footer/ui/footer';
import { Header } from '@/widgets/header/ui/header';
import { ThirdPartyAnalytics } from '@/widgets/analytics';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — компьютеры и комплектующие в Махачкале`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [
    'компьютерный магазин Махачкала',
    'купить видеокарту Махачкала',
    'сборка компьютера Дагестан',
    'комплектующие для ПК',
    'ноутбуки Махачкала',
    'сервисный центр компьютеров',
  ],
  category: 'shopping',
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080b10' },
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <html lang={siteConfig.lang} className={fontVariables} suppressHydrationWarning>
      <body className="grain min-h-svh antialiased">
        <Providers>
          <Header categories={categories} />
          <main id="main" className="pt-20 sm:pt-24">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>

        <JsonLd data={[organizationLd(), websiteLd(), localBusinessLd()]} />
        <Analytics />
        <SpeedInsights />
        <ThirdPartyAnalytics />
      </body>
    </html>
  );
}
