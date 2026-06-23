import type { Metadata } from "next";
import AdminCustomersClient from "@/components/AdminCustomersClient";

export const metadata: Metadata = {
  title: "Customers | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default function AdminCustomersPage() {
  return <AdminCustomersClient />;
}
