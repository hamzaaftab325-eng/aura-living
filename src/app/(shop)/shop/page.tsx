import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/products';
import ShopView from '@/components/ShopView';

export const metadata: Metadata = {
  title: 'Shop All Home Decor | Aura Living',
  description:
    'Browse our full collection of handcrafted lamps, vases, candles, planters, wall art, and tableware — delivered across Pakistan.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop All Home Decor | Aura Living',
    description: 'Handcrafted lamps, vases, candles, planters, wall art, and tableware — delivered across Pakistan.',
    type: 'website',
    images: [{ url: '/og/shop.png', width: 1344, height: 768, alt: 'Shop All Home Decor | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Home Decor | Aura Living',
    description: 'Handcrafted lamps, vases, candles, planters, wall art & tableware — delivered across Pakistan.',
    images: ['/og/shop.png'] } };

// Revalidate every hour (ISR)
export const revalidate = 3600;

export default async function ShopPage() {
  // Fetch all products + categories from DB (server-side)
  const [{ products }, categories] = await Promise.all([
    getProducts({ perPage: 100 }), // Get all products for client-side filtering
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading shop...</div></div>}>
      <ShopView initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
