import type { Metadata } from 'next';
import AboutView from '@/components/AboutView';

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
  },
};

export default function AboutPage() {
  return <AboutView />;
}
