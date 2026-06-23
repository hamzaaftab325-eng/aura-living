import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/products";
import { articles } from "@/data/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the actual deployment URL.
  const baseUrl = "https://aura-living-two.vercel.app";
  const now = new Date();

  // Static routes — one entry per page
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/sale`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lookbook`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/care-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Product pages — fetched from database (one URL per product slug)
  const productSlugs = await getAllProductSlugs();
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog article pages — one URL per article (still from static data)
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Category pages — fetched from database
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(c.id)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...articlePages, ...categoryPages];
}
