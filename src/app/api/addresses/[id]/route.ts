/**
 * ============================================================================
 * /api/addresses/[id] — Update + Delete a single address
 * ============================================================================
 *
 * PUT    /api/addresses/[id]  — Update address
 * DELETE /api/addresses/[id]  — Delete address
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateAddress, deleteAddress, setDefaultAddress } from "@/lib/addresses";
import { z } from "zod";

const updateSchema = z.object({
  label: z.string().min(1).max(50).optional(),
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  line1: z.string().min(5).optional(),
  line2: z.string().optional(),
  city: z.string().min(2).optional(),
  province: z.string().min(2).optional(),
  postal: z.string().min(4).optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
  setDefault: z.boolean().optional(), // convenience flag
});

export async function PUT(
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
    const body = await request.json();
    const parseResult = updateSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    // Handle setDefault convenience flag
    if (parseResult.data.setDefault) {
      const success = await setDefaultAddress(id, session.user.id);
      if (!success) {
        return NextResponse.json(
          { ok: false, error: "Address not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    const address = await updateAddress(id, session.user.id, parseResult.data);
    if (!address) {
      return NextResponse.json(
        { ok: false, error: "Address not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, address });
  } catch (error) {
    console.error("[addresses] PUT error:", error);
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
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const success = await deleteAddress(id, session.user.id);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Address not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[addresses] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
