import { ogImageLayout } from '@/lib/og-image';

export const alt = 'Journal | Aura Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return ogImageLayout({
    title: 'The Journal',
    subtitle: 'Styling guides, care tips, trend reports, and behind-the-scenes stories from our Lahore workshop.',
    category: 'Blog',
  });
}
