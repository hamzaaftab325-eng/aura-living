/**
 * ============================================================================
 * /api/addresses — List + Create addresses
 * ============================================================================
 *
 * GET  /api/addresses       — List user's addresses
 * POST /api/addresses       — Create a new address
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAddresses, createAddress } from "@/lib/addresses";
import { z } from "zod";

const addressSchema = z.object({
  label: z.string().min(1).max(50),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postal: z.string().min(4, "Postal code is required"),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
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

    const addresses = await getAddresses(session.user.id);
    return NextResponse.json({ ok: true, addresses });
  } catch (error) {
    console.error("[addresses] GET error:", error);
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
    const parseResult = addressSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const address = await createAddress(session.user.id, parseResult.data);
    return NextResponse.json({ ok: true, address });
  } catch (error) {
    console.error("[addresses] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
