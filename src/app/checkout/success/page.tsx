import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessView from "@/components/CheckoutSuccessView";

export const metadata: Metadata = {
  title: "Order Confirmed | Aura Living",
  description: "Your order has been placed successfully.",
  alternates: { canonical: "/checkout/success" },
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      }
    >
      <CheckoutSuccessView />
    </Suspense>
  );
}
