import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/auth/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://aura-living-two.vercel.app/sitemap.xml',
    host: 'https://aura-living-two.vercel.app',
  };
}
