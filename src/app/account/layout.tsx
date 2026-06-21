import type { Metadata } from 'next';
import AccountLayout from '@/components/AccountLayout';

export const metadata: Metadata = {
  title: 'My Account | Aura Living',
  description: 'Your Aura Living account dashboard.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false } };

export default function AccountRootLayout({
  children }: {
  children: React.ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
