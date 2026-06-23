import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAdminStats } from "@/lib/admin";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | Aura Living",
  description: "Internal admin tools — inventory, orders, analytics, and store settings.",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="aura-h2 mb-4">Admin Access Required</h1>
          <p className="text-sm aura-text-secondary mb-6">
            You must be logged in as an admin to view this page.
          </p>
          <a
            href="/auth/login?from=/admin"
            className="inline-block px-6 py-3 rounded-sm bg-[var(--color-gold)] text-white font-medium hover:bg-[var(--color-gold-hover)] transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="aura-h2 mb-4">Access Denied</h1>
          <p className="text-sm aura-text-secondary mb-6">
            Your account doesn&apos;t have admin privileges. If you believe this is an error, please contact support.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-sm border border-[var(--color-gold)] text-[var(--color-gold)] font-medium hover:bg-[var(--color-gold)] hover:text-white transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Fetch initial stats on the server
  const stats = await getAdminStats();

  return <AdminDashboardClient initialStats={stats} />;
}
