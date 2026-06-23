/**
 * POST /api/wishlist/merge — Merge guest wishlist into user's DB wishlist
 *
 * Body: { productIds: string[] }
 * Called after login to sync localStorage wishlist to DB.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  productIds: z.array(z.string()).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input" },
        { status: 400 },
      );
    }

    const { productIds } = parseResult.data;
    if (productIds.length === 0) {
      return NextResponse.json({ ok: true, merged: 0 });
    }

    // Verify products exist
    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (validProducts.length === 0) {
      return NextResponse.json({ ok: true, merged: 0 });
    }

    // Get existing wishlist items to avoid duplicates
    const existing = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    const existingIds = new Set(existing.map((e) => e.productId));

    // Filter out already-existing items
    const newProductIds = validProducts
      .map((p) => p.id)
      .filter((id) => !existingIds.has(id));

    if (newProductIds.length === 0) {
      return NextResponse.json({ ok: true, merged: 0 });
    }

    // Create wishlist items
    await prisma.wishlistItem.createMany({
      data: newProductIds.map((productId) => ({
        userId: session.user.id,
        productId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ ok: true, merged: newProductIds.length });
  } catch (error) {
    console.error("[wishlist/merge] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
