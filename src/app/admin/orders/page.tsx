import type { Metadata } from "next";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Orders | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
