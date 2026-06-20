import type { Metadata } from 'next';
import BlogView from '@/components/BlogView';

// Revalidate every 1 hours
export const revalidate = 3600;


export const metadata: Metadata = {
  title: 'Journal | Aura Living',
  description:
    'Styling guides, care tips, trend reports, and behind-the-scenes stories from the Aura Living workshop in Lahore.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Journal | Aura Living',
    description: 'Styling guides, care tips, trend reports, and behind-the-scenes stories from the Aura Living workshop.',
    type: 'website',
    images: [{ url: '/og/blog.png', width: 1344, height: 768, alt: 'Journal | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal | Aura Living',
    description: 'Styling guides, care tips, and behind-the-scenes stories from our Lahore workshop.',
    images: ['/og/blog.png'],
  },
};

export default function BlogPage() {
  return <BlogView />;
}
