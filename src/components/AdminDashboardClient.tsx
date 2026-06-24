'use client';

/**
 * AdminDashboardClient — main admin dashboard.
 *
 * Receives initial stats from server, then provides navigation to
 * sub-pages (products, orders, customers, coupons).
 */

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatPKR } from "@/lib/currency-display";
import type { AdminStats } from "@/lib/admin";
import PremiumButton from "@/components/ui/PremiumButton";

interface Props {
  initialStats: AdminStats;
}

export default function AdminDashboardClient({ initialStats }: Props) {
  const [stats] = useState(initialStats);

  const statsCards = [
    {
      label: "Total Revenue",
      value: formatPKR(stats.totalRevenue),
      icon: TrendingUp,
      color: "var(--color-success)",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "var(--color-info)",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "var(--color-gold)",
      bg: "rgba(212, 175, 55, 0.1)",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "var(--color-gold)",
      bg: "rgba(212, 175, 55, 0.1)",
    },
  ];

  const navCards = [
    { label: "Products", href: "/admin/products", icon: Package, description: "Manage your product catalog" },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart, description: "View and update orders" },
    { label: "Customers", href: "/admin/customers", icon: Users, description: "View customer list" },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket, description: "Manage discount coupons" },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="w-5 h-5 aura-text-gold" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Admin Dashboard
            </span>
          </div>
          <h1 className="aura-h2">Welcome back, Admin</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl p-5"
                style={{ backgroundColor: card.bg, border: `1px solid ${card.color}20` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: "white" }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <p className="text-2xl font-bold mb-1">{card.value}</p>
                <p className="text-xs aura-text-secondary uppercase tracking-wider">
                  {card.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Low stock alert */}
        {stats.lowStockCount > 0 && (
          <div
            className="rounded-lg p-4 mb-8 flex items-center gap-3"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
          >
            <AlertTriangle className="w-5 h-5 aura-text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                {stats.lowStockCount} product{stats.lowStockCount !== 1 ? "s" : ""} with low stock
              </p>
              <p className="text-xs text-red-600">
                Review inventory and restock soon to avoid stockouts.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {navCards.map((nav) => {
            const Icon = nav.icon;
            return (
              <Link
                key={nav.label}
                href={nav.href}
                className="block rounded-xl p-5 transition-all duration-300 hover:shadow-md"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 aura-bg-gold-tint">
                  <Icon className="w-5 h-5 aura-text-gold" />
                </div>
                <h3 className="font-semibold mb-1">{nav.label}</h3>
                <p className="text-xs aura-text-secondary">{nav.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Recent orders */}
        <div className="rounded-xl p-6 mb-8" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium aura-text-gold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm aura-text-secondary text-center py-8">
              No orders yet. Once customers place orders, they&apos;ll appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider aura-text-secondary border-b">
                    <th className="pb-2 pr-4">Order #</th>
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4 text-right">Total</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs">{order.orderNumber}</td>
                      <td className="py-3 pr-4">{order.customerName}</td>
                      <td className="py-3 pr-4">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              order.status === "DELIVERED"
                                ? "rgba(34,197,94,0.1)"
                                : order.status === "SHIPPED"
                                  ? "rgba(59,130,246,0.1)"
                                  : order.status === "CANCELLED"
                                    ? "rgba(239,68,68,0.1)"
                                    : "rgba(212,175,55,0.1)",
                            color:
                              order.status === "DELIVERED"
                                ? "var(--color-success)"
                                : order.status === "SHIPPED"
                                  ? "var(--color-info)"
                                  : order.status === "CANCELLED"
                                    ? "var(--color-danger)"
                                    : "var(--color-gold)",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-medium">{formatPKR(order.total)}</td>
                      <td className="py-3 text-right text-xs aura-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        {stats.topProducts.length > 0 && (
          <div className="rounded-xl p-6" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <h2 className="text-lg font-semibold mb-4">Top Products by Sales</h2>
            <div className="space-y-3">
              {stats.topProducts.map((product, i) => (
                <div key={product.productId} className="flex items-center gap-4">
                  <span className="text-lg font-bold aura-text-gold w-6">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.productName}</p>
                    <p className="text-xs aura-text-secondary">{product.unitsSold} units sold</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPKR(product.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <PremiumButton variant="primary" href="/admin/products/new" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Product
          </PremiumButton>
          <PremiumButton variant="secondary" href="/admin/orders">
            View All Orders
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
