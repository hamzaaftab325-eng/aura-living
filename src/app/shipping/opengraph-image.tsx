import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Shipping Information | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Shipping Information',
    subtitle: 'Standard, Express, and Same-Day delivery across Pakistan. Free shipping over PKR 2,999.',
    category: 'Support',
  });
}
