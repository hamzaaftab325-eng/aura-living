import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Sale | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Sale',
    subtitle: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
    category: 'Shop',
  });
}
