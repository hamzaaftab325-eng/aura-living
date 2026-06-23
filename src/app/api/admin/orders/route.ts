/**
 * ============================================================================
 * /api/admin/orders — List all orders
 * ============================================================================
 *
 * GET /api/admin/orders  — List orders (paginated, filterable by status)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminGetOrders } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const result = await adminGetOrders({ page, perPage, status, search });

    return NextResponse.json({
      ok: true,
      orders: result.orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        total: o.total.toString(),
        itemCount: o.items.length,
        createdAt: o.createdAt.toISOString(),
        user: o.user,
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (error) {
    console.error("[admin/orders] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
