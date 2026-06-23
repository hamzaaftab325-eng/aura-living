/**
 * ============================================================================
 * /api/admin/products — List + Create products
 * ============================================================================
 *
 * GET  /api/admin/products  — List products (paginated, searchable)
 * POST /api/admin/products  — Create a new product
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { adminGetProducts } from "@/lib/admin";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required").optional(),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description is required"),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  careInstructions: z.string().optional(),
  warranty: z.string().optional(),
  origin: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  badge: z.enum(["NEW", "SALE", "BESTSELLER"]).optional().nullable(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  image: z.string().url("Main image URL is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);
    const search = searchParams.get("search") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    const result = await adminGetProducts({ page, perPage, search, category });

    return NextResponse.json({
      ok: true,
      products: result.products.map((p) => ({
        ...p,
        price: p.price.toString(),
        originalPrice: p.originalPrice?.toString() ?? null,
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (error) {
    console.error("[admin/products] GET error:", error);
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
    const parseResult = productSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = parseResult.data;
    const slug = data.slug ?? slugify(data.name);

    // Check slug uniqueness
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { ok: false, error: "A product with this slug already exists" },
        { status: 400 },
      );
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      return NextResponse.json(
        { ok: false, error: "A product with this SKU already exists" },
        { status: 400 },
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        slug,
        name: data.name,
        sku: data.sku,
        description: data.description,
        material: data.material ?? null,
        dimensions: data.dimensions ?? null,
        weight: data.weight ?? null,
        careInstructions: data.careInstructions ?? null,
        warranty: data.warranty ?? null,
        origin: data.origin ?? null,
        price: rupeesToPaisa(data.price),
        originalPrice: data.originalPrice ? rupeesToPaisa(data.originalPrice) : null,
        stock: data.stock,
        inStock: data.inStock,
        categoryId: data.categoryId,
        badge: data.badge ?? null,
        rating: data.rating,
        reviewCount: data.reviewCount,
        isActive: data.isActive,
        featured: data.featured,
        sortOrder: data.sortOrder,
        image: data.image,
        images: {
          create: data.images.map((url, i) => ({
            url,
            altText: `${data.name} — image ${i + 1}`,
            sortOrder: i,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({
      ok: true,
      product: {
        ...product,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("[admin/products] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
