import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { articles } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auraliving.pk';
  const now = new Date();

  // Top-level SPA views — listed as hash URLs so Google can discover them.
  // Even though they share the / HTML route, listing them helps with crawl
  // discovery and signals site structure.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/#shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/#new-arrivals`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/#sale`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/#lookbook`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/#blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/#about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/#contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/#faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/#shipping`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/#returns`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/#care-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/#terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/#privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/#wishlist`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${baseUrl}/#cart`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${baseUrl}/#account`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${baseUrl}/#track-orders`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
  ];

  // Product pages — one URL per product
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/#product/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages — derived from product categories
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/#shop?category=${encodeURIComponent(c)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Article pages — one URL per article in the Journal
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/#article/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...articlePages];
}
