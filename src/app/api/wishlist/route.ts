/**
 * ============================================================================
 * /api/wishlist — List + Add to wishlist
 * ============================================================================
 *
 * GET  /api/wishlist  — List user's wishlist items (with product details)
 * POST /api/wishlist  — Add a product to wishlist { productId }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWishlist, addToWishlist } from "@/lib/wishlist";
import { z } from "zod";

const addSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const items = await getWishlist(session.user.id);
    return NextResponse.json({
      ok: true,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          price: item.product.price.toString(), // BigInt → string for JSON
          originalPrice: item.product.originalPrice?.toString() ?? null,
          image: item.product.image,
          inStock: item.product.inStock,
          badge: item.product.badge,
        },
      })),
    });
  } catch (error) {
    console.error("[wishlist] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

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
    const parseResult = addSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    await addToWishlist(session.user.id, parseResult.data.productId);
    return NextResponse.json({ ok: true, added: true });
  } catch (error) {
    console.error("[wishlist] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
