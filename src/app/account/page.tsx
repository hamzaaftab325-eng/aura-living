import type { Metadata } from 'next';
import AccountView from '@/components/AccountView';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Your account overview, rewards, recent orders, and saved addresses.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
