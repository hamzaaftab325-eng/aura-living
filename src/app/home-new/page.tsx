import type { Metadata } from 'next';
import HomeNew from '@/components/HomeNew';
import { getFeaturedProducts, getCategories } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Aura Living | Premium Home Decor Pakistan',
  description: 'Handcrafted home decor for the modern Pakistani home.',
  alternates: { canonical: '/home-new' },
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

export default async function HomeNewPage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return <HomeNew featuredProducts={featuredProducts} categories={categories} />;
}
