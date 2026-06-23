import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminProductForm from "@/components/AdminProductForm";

export const metadata: Metadata = {
  title: "Edit Product | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm">Admin access required.</p>
      </div>
    );
  }

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!product || product.deletedAt) {
    notFound();
  }

  // Transform BigInt fields to strings for the client component
  const serializedProduct = {
    ...product,
    price: product.price.toString(),
    originalPrice: product.originalPrice?.toString() ?? null,
  };

  return <AdminProductForm categories={categories} product={serializedProduct} />;
}
