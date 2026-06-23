/**
 * ============================================================================
 * GET /api/orders/[id] — Get order details
 * ============================================================================
 *
 * Returns the order with items, status, and shipping info.
 * Only the order owner can view their own orders.
 *
 * Auth: Requires a valid session.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const order = await getOrderById(id, session.user.id);

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Serialize BigInt fields (JSON can't serialize BigInt natively)
    return NextResponse.json({
      ok: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        subtotal: order.subtotal.toString(),
        shippingCost: order.shippingCost.toString(),
        discount: order.discount.toString(),
        tax: order.tax.toString(),
        total: order.total.toString(),
        shippingLine1: order.shippingLine1,
        shippingLine2: order.shippingLine2,
        shippingCity: order.shippingCity,
        shippingProvince: order.shippingProvince,
        shippingPostal: order.shippingPostal,
        shippingCountry: order.shippingCountry,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          lineTotal: item.lineTotal.toString(),
        })),
      },
    });
  } catch (error) {
    console.error("[orders] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
