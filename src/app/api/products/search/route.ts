/**
 * GET /api/products/search?q=...
 *
 * Returns up to 5 products matching the search query.
 * No auth required — public endpoint for navbar search.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ ok: true, results: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
        category: { select: { slug: true, name: true } },
      },
      take: 5,
      orderBy: [{ rating: "desc" }],
    });

    return NextResponse.json({
      ok: true,
      results: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price) / 100, // paisa → rupees
        image: p.image,
        category: p.category.slug,
        categoryName: p.category.name,
      })),
    });
  } catch (error) {
    console.error("[products/search] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
