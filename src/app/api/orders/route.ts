/**
 * ============================================================================
 * GET /api/orders — List user's orders (paginated)
 * ============================================================================
 *
 * Query params: ?page=1&perPage=10
 *
 * Returns orders with first status event + item count.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/orders";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "10", 10);

    const result = await getOrders(session.user.id, page, perPage);

    return NextResponse.json({
      ok: true,
      orders: result.orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total.toString(), // BigInt → string
        itemCount: order.items.length,
        firstItemImage: order.items[0]?.productImage ?? null,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
        })),
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("[orders] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
