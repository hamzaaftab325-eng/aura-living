import type { Metadata } from "next";
import AdminProductsClient from "@/components/AdminProductsClient";

export const metadata: Metadata = {
  title: "Products | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
