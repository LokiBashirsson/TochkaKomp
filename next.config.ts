import type { NextConfig } from 'next';

/**
 * Security headers applied to every route.
 * CSP is intentionally omitted here — it is issued per-request from `middleware.ts`
 * with a rotating nonce, which is the only way to keep it strict under the App Router.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    // Keeps first-load JS small: these packages ship large barrel files.
    optimizePackageImports: ['lucide-react', 'motion', '@radix-ui/react-dropdown-menu'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Product imagery is served from R2 behind a CDN in production.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.tochkacomp.ru' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [{ source: '/:path*', headers: [...securityHeaders] }];
  },

  async redirects() {
    return [
      { source: '/shop', destination: '/catalog', permanent: true },
      { source: '/products/:slug', destination: '/product/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
