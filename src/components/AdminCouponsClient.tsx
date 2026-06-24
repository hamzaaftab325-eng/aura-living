'use client';

/**
 * AdminCouponsClient — view, create, edit, delete coupons.
 */

import { useState, useEffect, useCallback } from "react";
import { Ticket, Plus, Trash2, X } from "lucide-react";
import { formatPKR } from "@/lib/currency-display";
import PremiumButton from "@/components/ui/PremiumButton";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FLAT";
  value: string;
  minOrderValue: string;
  maxDiscount: string | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  _count: { redemptions: number };
}

export default function AdminCouponsClient() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(100);
  const [perUserLimit, setPerUserLimit] = useState(1);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.ok) {
        setCoupons(data.coupons);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({ title: "Code required", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          description: description.trim() || null,
          type,
          value,
          minOrderValue,
          maxDiscount: type === "PERCENTAGE" && maxDiscount > 0 ? maxDiscount : null,
          usageLimit: usageLimit > 0 ? usageLimit : null,
          perUserLimit,
          startsAt: new Date().toISOString(),
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to create");

      toast({ title: "Coupon created", description: `${code.toUpperCase()} is now active.` });
      setShowForm(false);
      setCode("");
      setDescription("");
      setValue(10);
      fetchCoupons();
    } catch (err) {
      toast({
        title: "Create failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Coupon deleted", description: `${code} has been removed.` });
        fetchCoupons();
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Ticket className="w-5 h-5 aura-text-gold" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Admin</span>
            </div>
            <h1 className="aura-h2">Coupons</h1>
          </div>
          <PremiumButton
            variant="primary"
            onClick={() => setShowForm(!showForm)}
            leftIcon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Cancel" : "New Coupon"}
          </PremiumButton>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="rounded-xl p-6 mb-6 space-y-4"
            style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
          >
            <h2 className="text-lg font-semibold">Create New Coupon</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="w-full px-3 py-2 rounded text-sm uppercase"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FLAT")}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat amount (Rs.)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="10% off your first order"
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Value {type === "PERCENTAGE" ? "(%)" : "(Rs.)"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min order (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              {type === "PERCENTAGE" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Max discount (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Usage limit</label>
                <input
                  type="number"
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Per user limit</label>
                <input
                  type="number"
                  min="1"
                  value={perUserLimit}
                  onChange={(e) => setPerUserLimit(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
            </div>

            <PremiumButton type="submit" variant="primary">
              Create Coupon
            </PremiumButton>
          </form>
        )}

        {/* Coupons list */}
        {loading ? (
          <div className="text-center py-12">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="text-sm aura-text-secondary">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm aura-text-secondary mb-4">No coupons yet.</p>
            <PremiumButton variant="secondary" onClick={() => setShowForm(true)}>
              Create Your First Coupon
            </PremiumButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="rounded-xl p-5"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-mono font-bold text-lg">{c.code}</h3>
                    {c.description && (
                      <p className="text-xs aura-text-secondary mt-1">{c.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="p-1.5 rounded hover:aura-bg-red-tint-5 aura-text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="aura-text-secondary">Discount:</span>{" "}
                    <span className="font-medium">
                      {c.type === "PERCENTAGE"
                        ? `${c.value}%`
                        : formatPKR(BigInt(c.value))}
                    </span>
                  </div>
                  <div>
                    <span className="aura-text-secondary">Used:</span>{" "}
                    <span className="font-medium">
                      {c._count.redemptions}
                      {c.usageLimit && ` / ${c.usageLimit}`}
                    </span>
                  </div>
                  <div>
                    <span className="aura-text-secondary">Min order:</span>{" "}
                    <span className="font-medium">
                      {Number(c.minOrderValue) > 0
                        ? formatPKR(BigInt(c.minOrderValue))
                        : "None"}
                    </span>
                  </div>
                  <div>
                    <span className="aura-text-secondary">Per user:</span>{" "}
                    <span className="font-medium">{c.perUserLimit}x</span>
                  </div>
                  {c.maxDiscount && (
                    <div>
                      <span className="aura-text-secondary">Max discount:</span>{" "}
                      <span className="font-medium">{formatPKR(BigInt(c.maxDiscount))}</span>
                    </div>
                  )}
                  <div>
                    <span className="aura-text-secondary">Status:</span>{" "}
                    <span
                      className="font-medium"
                      style={{
                        color: c.isActive ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs aura-text-secondary">
                  Started: {formatDate(c.startsAt)}
                  {c.endsAt && ` · Ends: ${formatDate(c.endsAt)}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
