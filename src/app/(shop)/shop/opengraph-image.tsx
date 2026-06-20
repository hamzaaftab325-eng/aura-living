import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Shop All Home Decor | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Shop All Home Decor',
    subtitle: 'Handcrafted lamps, vases, candles, planters, wall art & tableware — delivered across Pakistan.',
    category: 'Shop',
  });
}
