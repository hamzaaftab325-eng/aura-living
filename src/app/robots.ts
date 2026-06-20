import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: 'https://auraliving.pk/sitemap.xml',
    host: 'https://auraliving.pk',
  };
}
