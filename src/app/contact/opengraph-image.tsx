import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Get in Touch | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Get in Touch',
    subtitle: 'Questions about an order, a product, or a custom commission? Reach the Aura Living team in Lahore.',
    category: 'Contact',
  });
}
