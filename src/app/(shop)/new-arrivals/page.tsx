import type { Metadata } from 'next';
import { Suspense } from 'react';
import NewArrivalsView from '@/components/NewArrivalsView';
import { getNewArrivals } from '@/lib/products';

export const metadata: Metadata = {
  title: 'New Arrivals | Aura Living',
  description: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
  alternates: { canonical: '/new-arrivals' },
  openGraph: {
    title: 'New Arrivals | Aura Living',
    description: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
    type: 'website',
    images: [{ url: '/og/new-arrivals.png', width: 1344, height: 768, alt: 'New Arrivals | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'New Arrivals | Aura Living',
    description: 'Fresh additions to the Aura Living collection.',
    images: ['/og/new-arrivals.png'] } };

// Revalidate every hour (ISR)
export const revalidate = 3600;

export default async function NewArrivalsPage() {
  const newProducts = await getNewArrivals(24);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading new arrivals...</div></div>}>
      <NewArrivalsView initialProducts={newProducts} />
    </Suspense>
  );
}
