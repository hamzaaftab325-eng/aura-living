/**
 * ============================================================================
 * /api/admin/coupons — List + Create coupons
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminGetCoupons } from "@/lib/admin";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).max(50).transform((s) => s.toUpperCase().trim()),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(["PERCENTAGE", "FLAT"]),
  value: z.number().min(0, "Value must be positive"),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  perUserLimit: z.number().int().min(1).default(1),
  startsAt: z.string().transform((s) => new Date(s)),
  endsAt: z.string().optional().nullable().transform((s) => (s ? new Date(s) : null)),
  isActive: z.boolean().default(true),
});

function rupeesToPaisa(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const coupons = await adminGetCoupons();
    return NextResponse.json({
      ok: true,
      coupons: coupons.map((c) => ({
        ...c,
        value: c.value.toString(),
        minOrderValue: c.minOrderValue.toString(),
        maxDiscount: c.maxDiscount?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error("[admin/coupons] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parseResult = couponSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const data = parseResult.data;

    // Check code uniqueness
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Coupon code already exists" },
        { status: 400 },
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        description: data.description ?? null,
        type: data.type,
        value: rupeesToPaisa(data.value),
        minOrderValue: rupeesToPaisa(data.minOrderValue),
        maxDiscount: data.maxDiscount ? rupeesToPaisa(data.maxDiscount) : null,
        usageLimit: data.usageLimit,
        perUserLimit: data.perUserLimit,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        isActive: data.isActive,
      },
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
    console.error("[admin/coupons] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
