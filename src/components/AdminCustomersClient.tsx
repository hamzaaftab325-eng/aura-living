'use client';

/**
 * AdminCustomersClient — view customer list with order stats.
 */

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Mail, CheckCircle } from "lucide-react";
import { formatPKR } from "@/lib/currency-display";

interface Customer {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: string;
}

export default function AdminCustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ perPage: "50" });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      if (data.ok) {
        setCustomers(data.customers);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 aura-text-gold" />
          <span className="text-[11px] uppercase tracking-wider font-semibold">Admin</span>
        </div>
        <h1 className="aura-h2 mb-8">Customers</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 aura-text-secondary" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm"
            style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
          />
        </div>

        {/* Customers */}
        {loading ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="text-sm aura-text-secondary">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm aura-text-secondary">
              {search ? "No customers match your search." : "No customers yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <table className="w-full text-sm">
              <thead className="aura-bg-gold-tint-5">
                <tr className="text-left text-xs uppercase tracking-wider aura-text-secondary">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-center">Verified</th>
                  <th className="p-3 text-center">Orders</th>
                  <th className="p-3 text-right">Total Spent</th>
                  <th className="p-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 aura-text-secondary">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {c.emailVerified ? (
                        <CheckCircle className="w-4 h-4 mx-auto text-green-500" />
                      ) : (
                        <span className="text-xs aura-text-secondary">No</span>
                      )}
                    </td>
                    <td className="p-3 text-center">{c.orderCount}</td>
                    <td className="p-3 text-right font-medium">{formatPKR(BigInt(c.totalSpent))}</td>
                    <td className="p-3 text-right text-xs aura-text-secondary">
                      {new Date(c.createdAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
