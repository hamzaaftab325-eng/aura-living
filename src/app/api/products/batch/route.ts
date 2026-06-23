/**
 * POST /api/products/batch
 *
 * Fetch product details by IDs (for guest wishlist lookup).
 * No auth required.
 *
 * Body: { ids: string[] }
 * Returns: { ok: true, products: [...] }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  ids: z.array(z.string()).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input" },
        { status: 400 },
      );
    }

    const { ids } = parseResult.data;
    if (ids.length === 0) {
      return NextResponse.json({ ok: true, products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        images: { orderBy: [{ sortOrder: "asc" }], select: { url: true } },
        category: { select: { slug: true } },
        rating: true,
        reviewCount: true,
        badge: true,
        material: true,
        inStock: true,
        sku: true,
        dimensions: true,
        weight: true,
        careInstructions: true,
        warranty: true,
        origin: true,
        description: true,
      },
    });

    return NextResponse.json({
      ok: true,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price) / 100, // paisa → rupees
        originalPrice: p.originalPrice ? Number(p.originalPrice) / 100 : undefined,
        image: p.image,
        images: p.images.map((img) => img.url),
        category: p.category.slug,
        rating: p.rating,
        reviews: p.reviewCount,
        badge: p.badge ?? undefined,
        material: p.material ?? "",
        inStock: p.inStock,
        sku: p.sku,
        dimensions: p.dimensions ?? undefined,
        weight: p.weight ?? undefined,
        careInstructions: p.careInstructions ?? undefined,
        warranty: p.warranty ?? undefined,
        origin: p.origin ?? undefined,
        description: p.description,
      })),
    });
  } catch (error) {
    console.error("[products/batch] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
