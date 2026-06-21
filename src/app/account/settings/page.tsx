import type { Metadata } from 'next';
import SettingsView from '@/components/SettingsView';

export const metadata: Metadata = {
  title: 'Account Settings | Aura Living',
  description: 'Update your profile, password, and notification preferences.',
  alternates: { canonical: '/account/settings' },
  robots: { index: false, follow: false } };

export default function SettingsPage() {
  return <SettingsView />;
}
