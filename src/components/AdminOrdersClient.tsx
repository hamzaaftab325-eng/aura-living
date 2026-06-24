'use client';

/**
 * AdminOrdersClient — view + update order statuses.
 */

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Search, ChevronDown, ChevronRight } from "lucide-react";
import { formatPKR } from "@/lib/currency-display";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: string;
  itemCount: number;
  createdAt: string;
}

const STATUSES = ["all", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "var(--color-gold)", bg: "rgba(212,175,55,0.1)" },
  CONFIRMED: { color: "var(--color-success)", bg: "rgba(34,197,94,0.1)" },
  PROCESSING: { color: "var(--color-gold)", bg: "rgba(212,175,55,0.1)" },
  SHIPPED: { color: "var(--color-info)", bg: "rgba(59,130,246,0.1)" },
  DELIVERED: { color: "var(--color-success)", bg: "rgba(34,197,94,0.1)" },
  CANCELLED: { color: "var(--color-danger)", bg: "rgba(239,68,68,0.1)" },
  RETURNED: { color: "var(--color-danger)", bg: "rgba(239,68,68,0.1)" },
};

export default function AdminOrdersClient() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ perPage: "50" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Order updated", description: `Status changed to ${newStatus}` });
        fetchOrders();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="w-5 h-5 aura-text-gold" />
          <span className="text-[11px] uppercase tracking-wider font-semibold">Admin</span>
        </div>
        <h1 className="aura-h2 mb-8">Orders</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 aura-text-secondary" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm"
              style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-sm text-sm"
            style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="text-sm aura-text-secondary">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm aura-text-secondary">
              {search || statusFilter !== "all"
                ? "No orders match your filters."
                : "No orders yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const colors = statusColors[order.status] ?? statusColors.PENDING;
              const isExpanded = expandedId === order.id;
              return (
                <div
                  key={order.id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                >
                  {/* Order row (clickable) */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full p-4 flex items-center gap-4 hover:aura-bg-cream-tint transition-colors text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                      <div>
                        <p className="font-mono text-xs">{order.orderNumber}</p>
                        <p className="text-xs aura-text-secondary">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs aura-text-secondary">{order.customerEmail}</p>
                      </div>
                      <p className="text-sm hidden sm:block">{order.itemCount} items</p>
                      <p className="text-sm font-semibold">{formatPKR(BigInt(order.total))}</p>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium justify-self-start"
                        style={{ backgroundColor: colors.bg, color: colors.color }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="p-4 border-t" style={{ backgroundColor: "rgba(250,250,247,0.5)" }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider aura-text-secondary mb-1">
                            Contact
                          </p>
                          <p className="text-sm">{order.customerName}</p>
                          <p className="text-sm aura-text-secondary">{order.customerEmail}</p>
                          <p className="text-sm aura-text-secondary">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider aura-text-secondary mb-1">
                            Payment
                          </p>
                          <p className="text-sm">{order.paymentMethod}</p>
                          <p className="text-sm aura-text-secondary">{order.paymentStatus}</p>
                        </div>
                      </div>

                      {/* Status update */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider aura-text-secondary">
                          Update status:
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="px-3 py-1.5 rounded text-sm"
                          style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                        >
                          {STATUSES.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <span className="text-xs aura-text-secondary">Updating...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
