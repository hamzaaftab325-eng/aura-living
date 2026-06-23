'use client';

/**
 * CheckoutSuccessView — shown after a successful order.
 *
 * Reads orderId from URL search params, fetches the order details,
 * shows confirmation with order number + summary.
 */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Truck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPKR } from "@/lib/currency-display";
import { GoldDivider, FloatingOrb } from "@/components/SVGDecorations";
import PremiumButton from "@/components/ui/PremiumButton";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface OrderData {
  ok: boolean;
  order?: {
    orderNumber: string;
    status: string;
    total: string; // BigInt serialized as string
    customerName: string;
    items: Array<{
      productName: string;
      productImage: string;
      quantity: number;
      lineTotal: string;
    }>;
    shippingCity: string;
    shippingProvince: string;
    paymentMethod: string;
  };
  error?: string;
}

function CheckoutSuccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useStore((state) => state.clearCart);

  const [order, setOrder] = useState<OrderData["order"] | null>(null);
  const [loading, setLoading] = useState(!orderId ? false : true);
  const [error, setError] = useState<string | null>(
    !orderId ? "No order ID provided" : null,
  );

  useEffect(() => {
    // Clear the local cart (guest cart in localStorage)
    clearCart();

    if (!orderId) {
      return;
    }

    let cancelled = false;

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data: OrderData) => {
        if (cancelled) return;
        if (data.ok && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error ?? "Could not load order details");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load order details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md text-center">
        <div className="animate-pulse">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 aura-bg-gold-tint" />
          <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md text-center">
        <h1 className="aura-h2 mb-3">Order Not Found</h1>
        <p className="text-sm aura-text-secondary mb-6">
          {error ?? "We couldn't find this order. Please check your order history."}
        </p>
        <PremiumButton variant="primary" href="/account/orders">
          View My Orders
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Order Confirmed" },
        ]}
      />

      <div className="rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
        {/* Success header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center aura-bg-gold-tint">
              <CheckCircle className="w-8 h-8 aura-text-gold" />
            </div>
          </div>
          <h1 className="aura-h2 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-sm aura-text-secondary">
            Thank you, {order.customerName}. Your order has been placed successfully.
          </p>
        </div>

        <div className="flex justify-center my-5">
          <GoldDivider />
        </div>

        {/* Order number */}
        <div
          className="text-center py-4 mb-6 rounded-lg"
          style={{ backgroundColor: "rgba(212, 175, 55, 0.08)" }}
        >
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            Order Number
          </p>
          <p className="text-xl font-bold aura-text-gold">{order.orderNumber}</p>
        </div>

        {/* Items */}
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
          Items Ordered
        </h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs aura-text-secondary">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">
                {formatPKR(BigInt(item.lineTotal))}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm aura-text-secondary">Total</span>
            <span className="text-lg font-bold">{formatPKR(BigInt(order.total))}</span>
          </div>
        </div>

        {/* Shipping info */}
        <div
          className="p-4 rounded-lg mb-6"
          style={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 aura-text-gold" />
            <span className="text-sm font-semibold">Shipping to</span>
          </div>
          <p className="text-sm aura-text-secondary">
            {order.shippingCity}, {order.shippingProvince}
          </p>
          <p className="text-xs aura-text-secondary mt-1">
            {order.paymentMethod === "COD"
              ? "Cash on Delivery — Pay when your order arrives"
              : order.paymentMethod}
          </p>
        </div>

        {/* Next steps */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 aura-text-gold" />
            <span className="text-sm font-semibold">What happens next?</span>
          </div>
          <ol className="text-sm aura-text-secondary space-y-2 ml-6 list-decimal">
            <li>We&apos;ll process your order within 24 hours</li>
            <li>You&apos;ll receive a confirmation email shortly</li>
            <li>Your order will be shipped via our courier partner</li>
            <li>Pay in cash when your order arrives (COD)</li>
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <PremiumButton
            variant="primary"
            fullWidth
            href="/account/orders"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track My Order
          </PremiumButton>
          <PremiumButton variant="secondary" fullWidth href="/shop">
            Continue Shopping
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessView() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)",
        }}
      />
      <FloatingOrb size={180} top="10%" left="5%" delay={0} />
      <FloatingOrb size={140} top="70%" left="80%" delay={1.5} />
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        }
      >
        <CheckoutSuccessForm />
      </Suspense>
    </div>
  );
}
