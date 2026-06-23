/**
 * ============================================================================
 * Admin Server Functions
 * ============================================================================
 *
 * ALL functions here check that the current user has ADMIN role.
 * Never call these from client components — they're for Server Components
 * and Route Handlers only.
 *
 * USAGE:
 *   import { getAdminStats, adminGetProducts } from '@/lib/admin';
 *   const stats = await getAdminStats();
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ----------------------------------------------------------------------------
// Auth helper — verify current user is admin
// ----------------------------------------------------------------------------

/**
 * Get the current admin session. Throws if user is not authenticated or not admin.
 * Use in Server Components and Route Handlers.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new AdminAuthError("Unauthorized");
  }

  if (session.user.role !== "ADMIN") {
    throw new AdminAuthError("Forbidden — admin access required");
  }

  return session;
}

/**
 * Custom error class so Route Handlers can distinguish auth errors from
 * other errors (return 401/403 vs 500).
 */
export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

// ----------------------------------------------------------------------------
// Dashboard stats
// ----------------------------------------------------------------------------

export interface AdminStats {
  totalRevenue: bigint; // paisa
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    status: string;
    total: bigint;
    createdAt: Date;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    productImage: string;
    unitsSold: number;
    revenue: bigint;
  }>;
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();

  // Get all orders (for revenue calculation)
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      status: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0n);

  // Get product + customer counts
  const [totalProducts, totalCustomers, lowStockProducts] = await Promise.all([
    prisma.product.count({ where: { isActive: true, deletedAt: null } }),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.product.count({
      where: {
        isActive: true,
        deletedAt: null,
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
    }),
  ]);

  // Top products by units sold (from order items)
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: { not: "CANCELLED" } },
    },
    select: {
      productId: true,
      productName: true,
      productImage: true,
      quantity: true,
      lineTotal: true,
    },
  });

  // Aggregate by product
  const productMap = new Map<
    string,
    { productName: string; productImage: string; unitsSold: number; revenue: bigint }
  >();
  for (const item of orderItems) {
    const existing = productMap.get(item.productId);
    if (existing) {
      existing.unitsSold += item.quantity;
      existing.revenue += item.lineTotal;
    } else {
      productMap.set(item.productId, {
        productName: item.productName,
        productImage: item.productImage,
        unitsSold: item.quantity,
        revenue: item.lineTotal,
      });
    }
  }

  const topProducts = Array.from(productMap.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalProducts,
    totalCustomers,
    lowStockCount: lowStockProducts,
    recentOrders: orders.slice(0, 5),
    topProducts,
  };
}

// ----------------------------------------------------------------------------
// Product management
// ----------------------------------------------------------------------------

export async function adminGetProducts({
  page = 1,
  perPage = 20,
  search,
  category,
  includeDeleted = false,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  includeDeleted?: boolean;
} = {}) {
  await requireAdmin();

  const where: {
    isActive?: boolean;
    deletedAt?: Date | null;
    OR?: Array<Record<string, unknown>>;
    categoryId?: string;
  } = {};

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.categoryId = category;
  }

  const skip = (page - 1) * perPage;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, totalPages: Math.ceil(total / perPage), currentPage: page };
}

export async function adminGetProductById(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
  });
}

// ----------------------------------------------------------------------------
// Order management
// ----------------------------------------------------------------------------

export async function adminGetOrders({
  page = 1,
  perPage = 20,
  status,
  search,
}: {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
} = {}) {
  await requireAdmin();

  const where: {
    status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    OR?: Array<Record<string, unknown>>;
  } = {};

  if (status && status !== "all") {
    where.status = status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * perPage;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, totalPages: Math.ceil(total / perPage), currentPage: page };
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED",
  note?: string,
) {
  await requireAdmin();

  const updateData: {
    status: typeof status;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
  } = { status };

  const now = new Date();
  if (status === "SHIPPED") updateData.shippedAt = now;
  if (status === "DELIVERED") updateData.deliveredAt = now;
  if (status === "CANCELLED") updateData.cancelledAt = now;

  return prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: updateData,
    }),
    prisma.orderStatusEvent.create({
      data: { orderId, status, note },
    }),
  ]);
}

// ----------------------------------------------------------------------------
// Customer management
// ----------------------------------------------------------------------------

export async function adminGetCustomers({
  page = 1,
  perPage = 20,
  search,
}: {
  page?: number;
  perPage?: number;
  search?: string;
} = {}) {
  await requireAdmin();

  const where: {
    role: "CUSTOMER";
    deletedAt: null;
    OR?: Array<Record<string, unknown>>;
  } = {
    role: "CUSTOMER",
    deletedAt: null,
  };

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * perPage;

  // Get customers with their order count + total spent
  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        orders: {
          where: { status: { not: "CANCELLED" } },
          select: { total: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  const customersWithStats = customers.map((c) => {
    const orderCount = c.orders.length;
    const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0n);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      emailVerified: c.emailVerified,
      createdAt: c.createdAt,
      orderCount,
      totalSpent,
    };
  });

  return { customers: customersWithStats, total, totalPages: Math.ceil(total / perPage), currentPage: page };
}

// ----------------------------------------------------------------------------
// Coupon management
// ----------------------------------------------------------------------------

export async function adminGetCoupons() {
  await requireAdmin();
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { redemptions: true } },
    },
  });
}
