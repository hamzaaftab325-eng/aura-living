import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminProductForm from "@/components/AdminProductForm";

export const metadata: Metadata = {
  title: "Add New Product | Admin | Aura Living",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm">Admin access required.</p>
      </div>
    );
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return <AdminProductForm categories={categories} />;
}
