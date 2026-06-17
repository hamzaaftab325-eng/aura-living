import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auraliving.pk';
  const now = new Date();

  // Top-level pages (SPA views — only the homepage is a real route, but we expose
  // the canonical homepage URL to crawlers. Individual SPA views share the / route.)
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
