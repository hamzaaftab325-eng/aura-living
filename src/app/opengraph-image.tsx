import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Aura Living — Premium Home Decor Pakistan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Where Comfort Meets Style',
    subtitle: 'Handcrafted home decor, lamps, plants, vases & more. Premium quality delivered across Pakistan.',
    category: 'Premium Home Decor Pakistan',
  });
}
