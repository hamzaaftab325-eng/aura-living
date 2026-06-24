'use client';

/**
 * OrderDetailView — shows full order details with status timeline.
 *
 * Server Component passes the order data as prop. This component is a client
 * component only because it uses the formatPKR helper and interactive UI.
 */

import Link from "next/link";
import { CheckCircle, Package, Truck, Clock, XCircle, ArrowLeft } from "lucide-react";
import type { Order, OrderItem, OrderStatusEvent } from "@prisma/client";
import { formatPKR } from "@/lib/currency-display";
import { GoldDivider } from "@/components/SVGDecorations";
import PremiumButton from "@/components/ui/PremiumButton";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface OrderDetailViewProps {
  order: Order & {
    items: OrderItem[];
    statusEvents: OrderStatusEvent[];
  };
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string; bg: string }
> = {
  PENDING: { label: "Order Placed", icon: Clock, color: "var(--color-gold)", bg: "rgba(212, 175, 55, 0.1)" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "var(--color-success)", bg: "rgba(34, 197, 94, 0.1)" },
  PROCESSING: { label: "Processing", icon: Package, color: "var(--color-gold)", bg: "rgba(212, 175, 55, 0.1)" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "var(--color-info)", bg: "rgba(59, 130, 246, 0.1)" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "var(--color-success)", bg: "rgba(34, 197, 94, 0.1)" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  RETURNED: { label: "Returned", icon: XCircle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
};

// Status flow order (for timeline display)
const statusFlow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailView({ order }: OrderDetailViewProps) {
  const currentStatusIndex = statusFlow.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "RETURNED";
  const config = statusConfig[order.status] ?? statusConfig.PENDING;

  return (
    <div className="w-full pt-28 sm:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Orders", href: "/account/orders" },
            { label: order.orderNumber },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <h1 className="aura-h2 mb-2">Order {order.orderNumber}</h1>
          <p className="text-sm aura-text-secondary">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Status banner */}
        <div
          className="rounded-lg p-4 mb-8 flex items-center gap-3"
          style={{ backgroundColor: config.bg }}
        >
          <config.icon className="w-5 h-5" style={{ color: config.color }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: config.color }}>
              {config.label}
            </p>
            <p className="text-xs aura-text-secondary">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod}{" "}
              · {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Status timeline (if not cancelled) */}
        {!isCancelled && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Order Timeline
            </h2>
            <div className="flex items-center justify-between relative">
              {/* Horizontal line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
              <div
                className="absolute top-5 left-0 h-0.5 transition-all duration-500"
                style={{
                  width: `${(currentStatusIndex / (statusFlow.length - 1)) * 100}%`,
                  backgroundColor: "var(--color-gold)",
                }}
              />
              {statusFlow.map((status, i) => {
                const StatusIcon = statusConfig[status].icon;
                const isDone = i <= currentStatusIndex;
                return (
                  <div
                    key={status}
                    className="relative flex flex-col items-center gap-2 z-10"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                      style={{
                        backgroundColor: isDone
                          ? "var(--color-gold)"
                          : "white",
                        borderColor: isDone
                          ? "var(--color-gold)"
                          : "#E5E5E5",
                      }}
                    >
                      <StatusIcon
                        className="w-4 h-4"
                        style={{
                          color: isDone ? "white" : "#999",
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-medium text-center hidden sm:block"
                      style={{
                        color: isDone
                          ? "var(--color-gold)"
                          : "#999",
                      }}
                    >
                      {statusConfig[status].label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center my-6">
          <GoldDivider />
        </div>

        {/* Items */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-lg border border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="font-medium hover:aura-text-gold transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs aura-text-secondary mt-1">
                    SKU: {item.productSku} · Qty: {item.quantity}
                  </p>
                  {item.variantName && item.variantValue && (
                    <p className="text-xs aura-text-secondary">
                      {item.variantName}: {item.variantValue}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPKR(item.lineTotal)}</p>
                  <p className="text-xs aura-text-secondary mt-1">
                    {formatPKR(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mb-8 p-6 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="aura-text-secondary">Subtotal</span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="aura-text-secondary">Shipping</span>
              <span>
                {order.shippingCost === 0n
                  ? "FREE"
                  : formatPKR(order.shippingCost)}
              </span>
            </div>
            {order.discount > 0n && (
              <div className="flex justify-between text-sm" style={{ color: "var(--color-success)" }}>
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatPKR(order.discount)}</span>
              </div>
            )}
            {order.tax > 0n && (
              <div className="flex justify-between text-sm">
                <span className="aura-text-secondary">Tax</span>
                <span>{formatPKR(order.tax)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Shipping Address
          </h2>
          <div className="p-4 rounded-lg border border-gray-100 text-sm">
            <p className="font-medium">{order.customerName}</p>
            <p className="aura-text-secondary mt-1">{order.customerPhone}</p>
            <p className="aura-text-secondary mt-2">
              {order.shippingLine1}
              {order.shippingLine2 && (
                <>
                  <br />
                  {order.shippingLine2}
                </>
              )}
              <br />
              {order.shippingCity}, {order.shippingProvince}
              <br />
              {order.shippingPostal}
              <br />
              {order.shippingCountry}
            </p>
          </div>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="mb-8 p-4 rounded-lg aura-bg-blue-tint">
            <h3 className="text-sm font-semibold mb-2">Tracking Information</h3>
            <p className="text-sm">
              <span className="aura-text-secondary">Carrier:</span>{" "}
              {order.trackingCarrier ?? "Courier"}
            </p>
            <p className="text-sm">
              <span className="aura-text-secondary">Tracking #:</span>{" "}
              <span className="font-mono font-medium">{order.trackingNumber}</span>
            </p>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">
              Order Notes
            </h2>
            <p className="text-sm aura-text-secondary p-4 rounded-lg bg-gray-50">
              {order.notes}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <PremiumButton variant="primary" href="/account/orders" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            All Orders
          </PremiumButton>
          <PremiumButton variant="secondary" href="/shop">
            Continue Shopping
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
