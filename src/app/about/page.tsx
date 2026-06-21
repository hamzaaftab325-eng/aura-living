import type { Metadata } from 'next';
import AboutView from '@/components/AboutView';

// Revalidate every 24 hours
export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Our Story | Aura Living',
  description:
    'From a Lahore workshop to homes across Pakistan — discover the artisans, materials, and milestones behind Aura Living.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Our Story | Aura Living',
    description:
      'From a Lahore workshop to homes across Pakistan — discover the artisans, materials, and milestones behind Aura Living.',
    type: 'article',
    images: [{ url: '/og/about.png', width: 1344, height: 768, alt: 'Our Story | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story | Aura Living',
    description: 'From a Lahore workshop to homes across Pakistan — discover the artisans behind Aura Living.',
    images: ['/og/about.png'] } };

export default function AboutPage() {
  return <AboutView />;
}
