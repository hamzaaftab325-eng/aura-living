import type { Metadata } from 'next';
import BlogView from '@/components/BlogView';

export const metadata: Metadata = {
  title: 'Journal | Aura Living',
  description:
    'Styling guides, care tips, trend reports, and behind-the-scenes stories from the Aura Living workshop in Lahore.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Journal | Aura Living',
    description:
      'Styling guides, care tips, trend reports, and behind-the-scenes stories from the Aura Living workshop in Lahore.',
  },
};

export default function BlogPage() {
  return <BlogView />;
}
