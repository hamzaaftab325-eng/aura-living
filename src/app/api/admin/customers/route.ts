/**
 * GET /api/admin/customers — List customers with order stats
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminGetCustomers } from "@/lib/admin";

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
    const search = searchParams.get("search") ?? undefined;

    const result = await adminGetCustomers({ page, perPage, search });

    return NextResponse.json({
      ok: true,
      customers: result.customers.map((c) => ({
        ...c,
        totalSpent: c.totalSpent.toString(),
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (error) {
    console.error("[admin/customers] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
