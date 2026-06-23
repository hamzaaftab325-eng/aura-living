import type { Metadata } from "next";
import AdminCouponsClient from "@/components/AdminCouponsClient";

export const metadata: Metadata = {
  title: "Coupons | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default function AdminCouponsPage() {
  return <AdminCouponsClient />;
}
