import type { Metadata } from 'next';
import PrivacyView from '@/components/PrivacyView';

// Revalidate every 720 hours
export const revalidate = 2592000;


export const metadata: Metadata = {
  title: 'Privacy Policy | Aura Living',
  description:
    'How Aura Living collects, uses, and protects your personal information when you shop with us.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Aura Living',
    description: 'How Aura Living collects, uses, and protects your personal information.',
    type: 'article',
    images: [{ url: '/og/privacy.png', width: 1344, height: 768, alt: 'Privacy Policy | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Aura Living',
    description: 'How we collect, use, and protect your personal information.',
    images: ['/og/privacy.png'] } };

export default function PrivacyPage() {
  return <PrivacyView />;
}
