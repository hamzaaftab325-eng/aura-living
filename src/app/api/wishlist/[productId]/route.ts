/**
 * ============================================================================
 * /api/wishlist/[productId] — Remove from wishlist + Toggle
 * ============================================================================
 *
 * DELETE /api/wishlist/[productId]  — Remove product from wishlist
 * PATCH  /api/wishlist/[productId]  — Toggle product in wishlist
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { removeFromWishlist, toggleWishlist } from "@/lib/wishlist";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { productId } = await params;
    await removeFromWishlist(session.user.id, productId);
    return NextResponse.json({ ok: true, removed: true });
  } catch (error) {
    console.error("[wishlist] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { productId } = await params;
    const result = await toggleWishlist(session.user.id, productId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[wishlist] PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
