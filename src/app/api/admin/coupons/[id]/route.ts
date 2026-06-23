/**
 * /api/admin/coupons/[id] — Update + Delete coupon
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  description: z.string().max(500).optional().nullable(),
  type: z.enum(["PERCENTAGE", "FLAT"]).optional(),
  value: z.number().min(0).optional(),
  minOrderValue: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  perUserLimit: z.number().int().min(1).optional(),
  startsAt: z.string().optional().transform((s) => (s ? new Date(s) : undefined)),
  endsAt: z.string().optional().nullable().transform((s) => (s ? new Date(s) : null)),
  isActive: z.boolean().optional(),
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
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const data = parseResult.data;
    const updateData: Record<string, unknown> = {};
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = rupeesToPaisa(data.value);
    if (data.minOrderValue !== undefined) updateData.minOrderValue = rupeesToPaisa(data.minOrderValue);
    if (data.maxDiscount !== undefined) {
      updateData.maxDiscount = data.maxDiscount ? rupeesToPaisa(data.maxDiscount) : null;
    }
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit;
    if (data.perUserLimit !== undefined) updateData.perUserLimit = data.perUserLimit;
    if (data.startsAt !== undefined) updateData.startsAt = data.startsAt;
    if (data.endsAt !== undefined) updateData.endsAt = data.endsAt;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ok: true,
      coupon: {
        ...coupon,
        value: coupon.value.toString(),
        minOrderValue: coupon.minOrderValue.toString(),
        maxDiscount: coupon.maxDiscount?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("[admin/coupons] PUT error:", error);
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
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/coupons] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
