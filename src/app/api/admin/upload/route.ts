/**
 * ============================================================================
 * POST /api/admin/upload — Upload image to Cloudinary
 * ============================================================================
 *
 * Accepts multipart/form-data with a single "file" field.
 * Returns the Cloudinary URL.
 *
 * Auth: Requires ADMIN role.
 * Body: FormData with "file" field (image file)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (max 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, error: "File too large (max 10 MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageBuffer(buffer, "aura-living/products");

    return NextResponse.json({
      ok: true,
      url: result.secureUrl,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("[admin/upload] Error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
