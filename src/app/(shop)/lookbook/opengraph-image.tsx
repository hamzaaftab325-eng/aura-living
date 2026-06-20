import { ogImageLayout } from '@/lib/og-image';

export const alt = 'The Lookbook | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'The Lookbook',
    subtitle: 'Styled room scenes and mood boards featuring Aura Living pieces — inspiration for every corner.',
    category: 'Inspiration',
  });
}
