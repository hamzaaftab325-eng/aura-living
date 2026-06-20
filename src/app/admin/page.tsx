import type { Metadata } from 'next';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Aura Living',
  description: 'Internal admin tools — inventory, orders, analytics, and store settings.',
  alternates: { canonical: '/admin' },
  robots: { index: false, follow: false },
};

// Admin dashboard is lazy-loaded via dynamic import inside the client wrapper
// to keep it out of the initial bundle for other routes.
export default function AdminPage() {
  return <AdminDashboard />;
}
