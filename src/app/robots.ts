import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/auth', '/checkout', '/cart', '/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: 'https://auraliving.com/sitemap.xml',
    host: 'https://auraliving.com',
  };
}
