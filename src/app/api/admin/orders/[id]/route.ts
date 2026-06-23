/**
 * ============================================================================
 * /api/admin/orders/[id] — Update order status
 * ============================================================================
 *
 * PATCH /api/admin/orders/[id]  — Update order status { status, note? }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminUpdateOrderStatus } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]),
  note: z.string().max(500).optional(),
});

export async function PATCH(
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
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 },
      );
    }

    await adminUpdateOrderStatus(id, parseResult.data.status, parseResult.data.note);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/orders] PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
