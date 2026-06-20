import { ogImageLayout } from '@/lib/og-image';

export const alt = 'New Arrivals | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'New Arrivals',
    subtitle: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
    category: 'Shop',
  });
}
