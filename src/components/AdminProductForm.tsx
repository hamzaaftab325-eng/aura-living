'use client';

/**
 * AdminProductForm — create/edit a product with Cloudinary image upload.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ExistingProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  careInstructions: string | null;
  warranty: string | null;
  origin: string | null;
  price: string;
  originalPrice: string | null;
  stock: number;
  inStock: boolean;
  categoryId: string;
  badge: "NEW" | "SALE" | "BESTSELLER" | null;
  isActive: boolean;
  featured: boolean;
  image: string;
  images: { id: string; url: string; sortOrder: number }[];
}

interface Props {
  categories: Category[];
  product?: ExistingProduct;
}

export default function AdminProductForm({ categories, product }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!product;

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [dimensions, setDimensions] = useState(product?.dimensions ?? "");
  const [weight, setWeight] = useState(product?.weight ?? "");
  const [careInstructions, setCareInstructions] = useState(product?.careInstructions ?? "");
  const [warranty, setWarranty] = useState(product?.warranty ?? "");
  const [origin, setOrigin] = useState(product?.origin ?? "");
  const [price, setPrice] = useState(product ? Number(product.price) / 100 : 0);
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? Number(product.originalPrice) / 100 : 0,
  );
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [badge, setBadge] = useState<"NEW" | "SALE" | "BESTSELLER" | "">(
    product?.badge ?? "",
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(
    product?.images.sort((a, b) => a.sortOrder - b.sortOrder).map((i) => i.url) ?? [],
  );

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        setImages((prev) => [...prev, data.url]);
      }
      toast({ title: "Image uploaded", description: "Image added to product." });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !sku.trim() || !description.trim() || !categoryId) {
      toast({
        title: "Missing fields",
        description: "Name, SKU, description, and category are required.",
        variant: "destructive",
      });
      return;
    }
    if (price <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0.",
        variant: "destructive",
      });
      return;
    }
    if (images.length === 0) {
      toast({
        title: "No images",
        description: "At least one product image is required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      sku: sku.trim(),
      description: description.trim(),
      material: material.trim() || null,
      dimensions: dimensions.trim() || null,
      weight: weight.trim() || null,
      careInstructions: careInstructions.trim() || null,
      warranty: warranty.trim() || null,
      origin: origin.trim() || null,
      price,
      originalPrice: originalPrice > 0 ? originalPrice : null,
      stock,
      inStock,
      categoryId,
      badge: badge || null,
      isActive,
      featured,
      image: images[0], // First image is the main image
      images,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to save");
      }

      toast({
        title: isEdit ? "Product updated" : "Product created",
        description: `${name} has been ${isEdit ? "updated" : "added"} successfully.`,
      });
      router.push("/admin/products");
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-4 hover:aura-text-gold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>

        <h1 className="aura-h2 mb-8">{isEdit ? "Edit Product" : "Add New Product"}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="rounded-xl p-6" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <p className="text-xs aura-text-secondary mb-4">
              Upload images to Cloudinary. First image will be the main product image.
            </p>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Product image ${i + 1}`}
                      className="w-full aspect-square rounded object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] bg-[var(--color-gold)] text-white">
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <label
              className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: "var(--color-gold-soft, rgba(212,175,55,0.3))" }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              {uploadingImage ? (
                <>
                  <Loader2 className="w-6 h-6 mb-2 animate-spin aura-text-gold" />
                  <p className="text-sm aura-text-secondary">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-2 aura-text-gold" />
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs aura-text-secondary">PNG, JPG, WebP — max 10 MB each</p>
                </>
              )}
            </label>
          </div>

          {/* Basic info */}
          <div className="rounded-xl p-6 space-y-4" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated from name"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Badge (optional)</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as "NEW" | "SALE" | "BESTSELLER" | "")}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              >
                <option value="">No badge</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>

          {/* Pricing + inventory */}
          <div className="rounded-xl p-6 space-y-4" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <h2 className="text-lg font-semibold">Pricing & Inventory</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price (Rs., for sales)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  Featured
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active (visible on store)
            </label>
          </div>

          {/* Product details (optional) */}
          <div className="rounded-xl p-6 space-y-4" style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}>
            <h2 className="text-lg font-semibold">Product Details (Optional)</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="H 45cm × W 25cm × D 25cm"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="2.5 kg"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Pakistan"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Care Instructions</label>
              <textarea
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Warranty</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="1-year manufacturer warranty"
                className="w-full px-3 py-2 rounded text-sm"
                style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <PremiumButton type="submit" variant="primary" loading={saving}>
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </PremiumButton>
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-sm text-sm font-medium border"
              style={{ border: "1px solid var(--color-gold-soft, rgba(212,175,55,0.2))" }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
