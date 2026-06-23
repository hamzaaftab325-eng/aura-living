import type { Metadata } from 'next';
import { Suspense } from 'react';
import SaleView from '@/components/SaleView';
import { getSaleProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Sale | Aura Living',
  description: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
  alternates: { canonical: '/sale' },
  openGraph: {
    title: 'Sale | Aura Living',
    description: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
    type: 'website',
    images: [{ url: '/og/sale.png', width: 1344, height: 768, alt: 'Sale | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Sale | Aura Living',
    description: 'Limited-time prices on selected pieces — shop the sale before it ends.',
    images: ['/og/sale.png'] } };

// Revalidate every hour (ISR)
export const revalidate = 3600;

export default async function SalePage() {
  const saleProducts = await getSaleProducts(24);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading sale...</div></div>}>
      <SaleView initialProducts={saleProducts} />
    </Suspense>
  );
}
