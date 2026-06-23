/**
 * ============================================================================
 * /api/admin/products/[id] — Update + Delete a product
 * ============================================================================
 *
 * PUT    /api/admin/products/[id]  — Update product
 * DELETE /api/admin/products/[id]  — Soft delete product (sets deletedAt)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  sku: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  material: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
  badge: z.enum(["NEW", "SALE", "BESTSELLER"]).optional().nullable(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
});

function rupeesToPaisa(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parseResult = updateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = parseResult.data;

    // Verify product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Check slug uniqueness (if changing)
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (slugConflict) {
        return NextResponse.json(
          { ok: false, error: "Slug already in use" },
          { status: 400 },
        );
      }
    }

    // Check SKU uniqueness (if changing)
    if (data.sku && data.sku !== existing.sku) {
      const skuConflict = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (skuConflict) {
        return NextResponse.json(
          { ok: false, error: "SKU already in use" },
          { status: 400 },
        );
      }
    }

    // Build update data (convert rupees to paisa for money fields)
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.material !== undefined) updateData.material = data.material;
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions;
    if (data.warranty !== undefined) updateData.warranty = data.warranty;
    if (data.origin !== undefined) updateData.origin = data.origin;
    if (data.price !== undefined) updateData.price = rupeesToPaisa(data.price);
    if (data.originalPrice !== undefined) {
      updateData.originalPrice = data.originalPrice ? rupeesToPaisa(data.originalPrice) : null;
    }
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.inStock !== undefined) updateData.inStock = data.inStock;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.reviewCount !== undefined) updateData.reviewCount = data.reviewCount;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.image !== undefined) updateData.image = data.image;

    // Update product + images in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: updateData,
      });

      // Update images if provided
      if (data.images !== undefined) {
        // Delete existing images
        await tx.productImage.deleteMany({ where: { productId: id } });
        // Create new images
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((url, i) => ({
              productId: id,
              url,
              altText: `${product.name} — image ${i + 1}`,
              sortOrder: i,
            })),
          });
        }
      }

      return product;
    });

    const result = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({
      ok: true,
      product: {
        ...result,
        price: result!.price.toString(),
        originalPrice: result!.originalPrice?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("[admin/products] PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Soft delete (set deletedAt + isActive = false)
    const product = await prisma.product.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });

    if (product.count === 0) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/products] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
