import type { Metadata } from 'next';
import PrivacyView from '@/components/PrivacyView';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Aura Living collects, uses, and protects your personal information when you shop with us.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
