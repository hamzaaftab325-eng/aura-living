/**
 * ============================================================================
 * Server-Side Product Queries
 * ============================================================================
 *
 * All functions here run on the SERVER ONLY (in Server Components, Server
 * Actions, Route Handlers). They query Supabase Postgres via Prisma.
 *
 * IMPORTANT: These functions must NEVER be imported by client components
 * (they would bundle Prisma into the browser). Client components receive
 * data via props from Server Components.
 *
 * USAGE (in Server Components):
 *   import { getProducts, getProductBySlug } from '@/lib/products';
 *   const products = await getProducts({ page: 1 });
 */

import { prisma } from "@/lib/db";
import type { Product, Category } from "@prisma/client";

// ----------------------------------------------------------------------------
// Types — these match what the frontend expects (from src/types/product.ts)
// ----------------------------------------------------------------------------

/**
 * The shape frontend components expect. Converted from Prisma's BigInt-paisa
 * model to the rupees-number model so existing UI works unchanged.
 */
export interface FrontendProduct {
  id: string;
  slug: string;
  name: string;
  price: number; // Rupees (not paisa) — for frontend display
  originalPrice?: number;
  image: string;
  images: string[];
  category: string; // category slug
  rating: number;
  reviews: number;
  badge?: "NEW" | "SALE" | "BESTSELLER";
  description: string;
  material: string;
  inStock: boolean;
  sku?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  warranty?: string;
  origin?: string;
}

export interface FrontendCategory {
  id: string; // slug (frontend uses slug as id)
  name: string;
  image: string;
  description: string;
}

// ----------------------------------------------------------------------------
// Conversion helpers — Prisma row → Frontend shape
// ----------------------------------------------------------------------------

function toFrontendProduct(
  p: Product & { images: { url: string; altText: string | null }[] },
): FrontendProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number(p.price) / 100, // paisa → rupees
    originalPrice: p.originalPrice ? Number(p.originalPrice) / 100 : undefined,
    image: p.image,
    images: p.images
      .sort((a, b) => 0) // already sorted by sortOrder from Prisma
      .map((img) => img.url),
    category: "", // will be filled by caller (need category slug)
    rating: p.rating,
    reviews: p.reviewCount,
    badge: p.badge ?? undefined,
    description: p.description,
    material: p.material ?? "",
    inStock: p.inStock,
    sku: p.sku,
    dimensions: p.dimensions ?? undefined,
    weight: p.weight ?? undefined,
    careInstructions: p.careInstructions ?? undefined,
    warranty: p.warranty ?? undefined,
    origin: p.origin ?? undefined,
  };
}

function toFrontendCategory(c: Category): FrontendCategory {
  return {
    id: c.slug,
    name: c.name,
    image: c.image ?? "",
    description: c.description,
  };
}

// ----------------------------------------------------------------------------
// Query functions
// ----------------------------------------------------------------------------

/**
 * Get all active categories.
 */
export async function getCategories(): Promise<FrontendCategory[]> {
  const cats = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }],
  });
  return cats.map(toFrontendCategory);
}

/**
 * Get a category by slug.
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<FrontendCategory | null> {
  const cat = await prisma.category.findUnique({
    where: { slug },
  });
  return cat ? toFrontendCategory(cat) : null;
}

/**
 * Get products with optional filtering, sorting, and pagination.
 *
 * @example
 *   // First page of 12 products
 *   const { products, total } = await getProducts({ page: 1 });
 *
 *   // Filter by category
 *   const { products } = await getProducts({ category: 'lighting' });
 *
 *   // Search by name
 *   const { products } = await getProducts({ search: 'lamp' });
 */
export async function getProducts({
  page = 1,
  perPage = 12,
  category,
  search,
  minPrice,
  maxPrice,
  sort = "featured",
  featuredOnly = false,
  onSaleOnly = false,
  includeOutOfStock = true,
}: {
  page?: number;
  perPage?: number;
  category?: string; // category slug
  search?: string;
  minPrice?: number; // in rupees
  maxPrice?: number; // in rupees
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "best-selling";
  featuredOnly?: boolean;
  onSaleOnly?: boolean;
  includeOutOfStock?: boolean;
}): Promise<{
  products: FrontendProduct[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  // Build the where clause
  const where: {
    isActive: boolean;
    deletedAt: null;
    categoryId?: string;
    featured?: boolean;
    originalPrice?: { not: null };
    inStock?: boolean;
    AND?: Array<Record<string, unknown>>;
    OR?: Array<Record<string, unknown>>;
  } = {
    isActive: true,
    deletedAt: null,
  };

  // Filter by category slug (need to look up category ID first)
  if (category && category !== "all") {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      select: { id: true },
    });
    if (cat) {
      where.categoryId = cat.id;
    } else {
      // Category doesn't exist — return empty
      return { products: [], total: 0, totalPages: 0, currentPage: page };
    }
  }

  if (featuredOnly) {
    where.featured = true;
  }

  if (onSaleOnly) {
    where.originalPrice = { not: null };
  }

  if (!includeOutOfStock) {
    where.inStock = true;
  }

  // Price filter (convert rupees to paisa)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, unknown> = {};
    if (minPrice !== undefined) priceFilter.gte = BigInt(Math.round(minPrice * 100));
    if (maxPrice !== undefined) priceFilter.lte = BigInt(Math.round(maxPrice * 100));
    where.AND = [{ price: priceFilter }];
  }

  // Search (case-insensitive on name + description)
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }

  // Build the orderBy clause (Prisma 7 requires array format)
  let orderBy: Array<Record<string, "asc" | "desc">>;
  switch (sort) {
    case "price-asc":
      orderBy = [{ price: "asc" }];
      break;
    case "price-desc":
      orderBy = [{ price: "desc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "best-selling":
      orderBy = [{ reviewCount: "desc" }];
      break;
    case "featured":
    default:
      orderBy = [{ sortOrder: "asc" }, { featured: "desc" }];
      break;
  }

  // Calculate pagination
  const skip = (page - 1) * perPage;

  // Fetch products + total count in parallel
  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: [{ sortOrder: "asc" }] },
        category: { select: { slug: true } },
      },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  // Convert to frontend shape (fill in category slug)
  const products: FrontendProduct[] = rows.map((p) => {
    const frontend = toFrontendProduct(p);
    frontend.category = p.category.slug;
    return frontend;
  });

  return {
    products,
    total,
    totalPages: Math.ceil(total / perPage),
    currentPage: page,
  };
}

/**
 * Get a single product by slug, with images and variants.
 * Returns null if not found.
 */
export async function getProductBySlug(
  slug: string,
): Promise<FrontendProduct | null> {
  const p = await prisma.product.findUnique({
    where: { slug, isActive: true, deletedAt: null },
    include: {
      images: { orderBy: [{ sortOrder: "asc" }] },
      category: { select: { slug: true } },
    },
  });

  if (!p) return null;

  const frontend = toFrontendProduct(p);
  frontend.category = p.category.slug;
  return frontend;
}

/**
 * Get related products (same category, excluding the current product).
 */
export async function getRelatedProducts(
  productId: string,
  count = 4,
): Promise<FrontendProduct[]> {
  // First, get the current product to find its category
  const current = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });

  if (!current) return [];

  const rows = await prisma.product.findMany({
    where: {
      categoryId: current.categoryId,
      id: { not: productId },
      isActive: true,
      deletedAt: null,
    },
    include: {
      images: { orderBy: [{ sortOrder: "asc" }] },
      category: { select: { slug: true } },
    },
    take: count,
    orderBy: [{ featured: "desc" }],
  });

  return rows.map((p) => {
    const frontend = toFrontendProduct(p);
    frontend.category = p.category.slug;
    return frontend;
  });
}

/**
 * Get all product slugs (for generateStaticParams).
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/**
 * Get featured products (for homepage).
 * Falls back to top-rated products if no products have featured: true.
 */
export async function getFeaturedProducts(
  count = 8,
): Promise<FrontendProduct[]> {
  // Try featured products first
  let rows = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null, featured: true },
    include: {
      images: { orderBy: [{ sortOrder: "asc" }] },
      category: { select: { slug: true } },
    },
    take: count,
    orderBy: [{ sortOrder: "asc" }],
  });

  // Fall back to top-rated + bestseller + NEW products if no featured ones
  if (rows.length === 0) {
    rows = await prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        images: { orderBy: [{ sortOrder: "asc" }] },
        category: { select: { slug: true } },
      },
      take: count,
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
    });
  }

  return rows.map((p) => {
    const frontend = toFrontendProduct(p);
    frontend.category = p.category.slug;
    return frontend;
  });
}

/**
 * Get new arrivals (most recently created products).
 */
export async function getNewArrivals(
  count = 8,
): Promise<FrontendProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    include: {
      images: { orderBy: [{ sortOrder: "asc" }] },
      category: { select: { slug: true } },
    },
    take: count,
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map((p) => {
    const frontend = toFrontendProduct(p);
    frontend.category = p.category.slug;
    return frontend;
  });
}

/**
 * Get products on sale (originalPrice is not null).
 */
export async function getSaleProducts(
  count = 12,
): Promise<FrontendProduct[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      originalPrice: { not: null },
    },
    include: {
      images: { orderBy: [{ sortOrder: "asc" }] },
      category: { select: { slug: true } },
    },
    take: count,
    orderBy: [{ sortOrder: "asc" }],
  });

  return rows.map((p) => {
    const frontend = toFrontendProduct(p);
    frontend.category = p.category.slug;
    return frontend;
  });
}
