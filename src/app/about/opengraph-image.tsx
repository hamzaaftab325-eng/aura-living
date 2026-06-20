import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Our Story | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'Our Story',
    subtitle: 'From a Lahore workshop to homes across Pakistan — meet the artisans behind Aura Living.',
    category: 'About',
  });
}
