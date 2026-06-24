/**
 * /api/reviews — List + Create reviews
 * GET  /api/reviews?productId=...  — List approved reviews for a product
 * POST /api/reviews                 — Create a new review (auth optional)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

const createSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { ok: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        rating: true,
        title: true,
        body: true,
        createdAt: true,
      },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      ok: true,
      reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      count: reviews.length,
    });
  } catch (error) {
    console.error("[reviews] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 reviews per hour per IP
    const ip = getClientIP(request);
    const limit = rateLimit(`review:${ip}`, RATE_LIMITS.NEWSLETTER);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many reviews. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parseResult = createSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await prisma.product.findFirst({
      where: { id: parseResult.data.productId, isActive: true, deletedAt: null },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 },
      );
    }

    // Check if user is logged in (optional — reviews can be anonymous)
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (session?.user) {
        userId = session.user.id;
      }
    } catch {
      // No session — anonymous review
    }

    const review = await prisma.review.create({
      data: {
        productId: parseResult.data.productId,
        userId,
        name: parseResult.data.name,
        email: parseResult.data.email,
        rating: parseResult.data.rating,
        title: parseResult.data.title ?? null,
        body: parseResult.data.body,
        // Auto-approve for now (can add moderation later)
        isApproved: true,
      },
    });

    // Update product rating + review count
    const allReviews = await prisma.review.findMany({
      where: { productId: parseResult.data.productId, isApproved: true },
      select: { rating: true },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: parseResult.data.productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ ok: true, review });
  } catch (error) {
    console.error("[reviews] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
