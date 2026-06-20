import type { Metadata } from 'next';
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
    images: [{ url: '/og/shop.png', width: 1344, height: 768, alt: 'Shop All Home Decor | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Home Decor | Aura Living',
    description: 'Handcrafted lamps, vases, candles, planters, wall art & tableware — delivered across Pakistan.',
    images: ['/og/shop.png'],
  },
};

export default function ShopPage() {
  return <ShopView />;
}
