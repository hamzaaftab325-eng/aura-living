import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Frequently Asked Questions | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Frequently Asked Questions',
    subtitle: 'Answers about orders, shipping, returns, products, payment, and the Aura Rewards program.',
    category: 'Support',
  });
}
