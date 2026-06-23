'use client';

/**
 * AdminProductsClient — product list with search, add/edit/delete.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle } from "lucide-react";
import { formatPKR } from "@/lib/currency-display";
import PremiumButton from "@/components/ui/PremiumButton";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  featured: boolean;
  image: string;
  category: { name: string };
  _count: { orderItems: number };
}

export default function AdminProductsClient() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: "20",
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.ok) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will hide it from the store (soft delete).`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Product deleted", description: `${name} has been removed.` });
        fetchProducts();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 aura-text-gold" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Admin</span>
            </div>
            <h1 className="aura-h2">Products</h1>
          </div>
          <PremiumButton variant="primary" href="/admin/products/new" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Product
          </PremiumButton>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 aura-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, SKU, or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-sm text-sm"
            style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
          />
        </div>

        {/* Products table */}
        {loading ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="text-sm aura-text-secondary">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm aura-text-secondary mb-4">
              {search ? "No products match your search." : "No products yet."}
            </p>
            <PremiumButton variant="secondary" href="/admin/products/new" leftIcon={<Plus className="w-4 h-4" />}>
              Add Your First Product
            </PremiumButton>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "rgba(212,175,55,0.05)" }}>
                <tr className="text-left text-xs uppercase tracking-wider aura-text-secondary">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Sold</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs aura-text-secondary">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 aura-text-secondary">{p.category.name}</td>
                    <td className="p-3 text-right font-medium">{formatPKR(BigInt(p.price))}</td>
                    <td className="p-3 text-center">
                      <span
                        className={
                          p.stock <= 5
                            ? "text-red-600 font-medium"
                            : "aura-text-secondary"
                        }
                      >
                        {p.stock}
                        {p.stock <= 5 && (
                          <AlertTriangle className="w-3 h-3 inline ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {p.isActive ? (
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "var(--color-success)" }}>
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "rgba(138,138,138,0.1)", color: "var(--color-muted-gray, #888)" }}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center aura-text-secondary">{p._count.orderItems}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded text-sm border disabled:opacity-50"
              style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded text-sm border disabled:opacity-50"
              style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
