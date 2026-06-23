/**
 * ============================================================================
 * Order Operations
 * ============================================================================
 *
 * Server-side order creation, fetching, and status updates.
 *
 * createOrder() is the critical function — it runs in a DB transaction to:
 *   1. Validate all cart items are in stock
 *   2. Calculate totals (subtotal + shipping - discount + tax)
 *   3. Create Order + OrderItem records (with product snapshots)
 *   4. Decrement product stock
 *   5. Apply coupon (if provided)
 *   6. Clear user's cart
 *   7. Create OrderStatusEvent (PENDING)
 *
 * USAGE (server-side only):
 *   import { createOrder, getOrderById } from '@/lib/orders';
 */

import { prisma } from "@/lib/db";
import { calculateShipping } from "@/lib/shipping";
import { validateCouponForUser, redeemCoupon } from "@/lib/coupons";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { Order, OrderItem, OrderStatusEvent } from "@prisma/client";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal: string;
  country?: string;
}

export interface OrderInput {
  userId: string;
  userEmail: string;
  paymentMethod: "COD" | "CARD" | "BANK_TRANSFER";
  shippingAddress: ShippingAddressInput;
  couponCode?: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productSku: string;
  unitPrice: bigint; // paisa
  quantity: number;
  lineTotal: bigint; // paisa
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  statusEvents: OrderStatusEvent[];
}

// ----------------------------------------------------------------------------
// Order number generator
// ----------------------------------------------------------------------------

/**
 * Generate a human-friendly order number: AURA-2026-0001
 * Increments based on count of orders this year.
 */
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  return `AURA-${year}-${String(count + 1).padStart(4, "0")}`;
}

// ----------------------------------------------------------------------------
// Create order
// ----------------------------------------------------------------------------

/**
 * Create an order from the user's cart.
 *
 * Flow:
 *   1. Fetch user's cart with product details
 *   2. Validate all items in stock
 *   3. Calculate subtotal (sum of price * qty)
 *   4. Validate coupon (if provided)
 *   5. Calculate shipping (free above Rs. 10,000)
 *   6. Calculate total = subtotal + shipping - discount
 *   7. Transaction: create Order + OrderItems + decrement stock + redeem coupon + clear cart
 *   8. Send confirmation email (async, non-blocking)
 *
 * @returns The created order with items
 * @throws Error if cart is empty, items out of stock, or coupon invalid
 */
export async function createOrder(input: OrderInput): Promise<OrderWithItems> {
  // 1. Fetch user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: input.userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
              sku: true,
              price: true,
              stock: true,
              inStock: true,
              isActive: true,
              deletedAt: true,
            },
          },
          variant: { select: { name: true, value: true, priceDelta: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  // 2. Validate all items
  const orderItemSnapshots: OrderItemSnapshot[] = [];
  for (const item of cart.items) {
    const p = item.product;
    if (!p.isActive || p.deletedAt) {
      throw new Error(`"${p.name}" is no longer available`);
    }
    if (!p.inStock || p.stock < item.quantity) {
      throw new Error(`"${p.name}" is out of stock or has insufficient quantity`);
    }

    const unitPrice = p.price + (item.variant?.priceDelta ?? 0n);
    const lineTotal = unitPrice * BigInt(item.quantity);

    orderItemSnapshots.push({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productImage: p.image,
      productSku: p.sku,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    });
  }

  // 3. Calculate subtotal
  const subtotal = orderItemSnapshots.reduce(
    (sum, item) => sum + item.lineTotal,
    0n,
  );

  // 4. Validate coupon (if provided)
  let discount = 0n;
  let couponId: string | null = null;
  if (input.couponCode) {
    const couponResult = await validateCouponForUser(
      input.couponCode,
      subtotal,
      input.userId,
    );
    if (!couponResult.valid) {
      throw new Error(couponResult.error ?? "Invalid coupon");
    }
    discount = couponResult.discountPaisa ?? 0n;
    couponId = couponResult.coupon!.id;
  }

  // 5. Calculate shipping (based on subtotal after discount)
  const shippingCost = calculateShipping(subtotal - discount);

  // 6. Calculate total
  const tax = 0n; // No tax for now (GST can be added later)
  const total = subtotal + shippingCost - discount + tax;

  const orderNumber = await generateOrderNumber();

  // 7. Create order in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        status: "PENDING",
        paymentStatus: input.paymentMethod === "COD" ? "UNPAID" : "UNPAID",
        paymentMethod: input.paymentMethod,
        customerName: input.shippingAddress.fullName,
        customerEmail: input.userEmail,
        customerPhone: input.shippingAddress.phone,
        shippingLine1: input.shippingAddress.line1,
        shippingLine2: input.shippingAddress.line2 ?? null,
        shippingCity: input.shippingAddress.city,
        shippingProvince: input.shippingAddress.province,
        shippingPostal: input.shippingAddress.postal,
        shippingCountry: input.shippingAddress.country ?? "Pakistan",
        subtotal,
        shippingCost,
        discount,
        tax,
        total,
        couponCode: input.couponCode ?? null,
        notes: input.notes ?? null,
      },
    });

    // Create order items (snapshots)
    await tx.orderItem.createMany({
      data: orderItemSnapshots.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        productSku: item.productSku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    });

    // Decrement stock for each product
    for (const item of orderItemSnapshots) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          // Mark out of stock if stock reaches 0
          inStock: { set: false },
        },
      });
      // Re-check: if stock > 0 after decrement, set inStock back to true
      const updated = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });
      if (updated && updated.stock > 0) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inStock: true },
        });
      }
    }

    // Create initial status event
    await tx.orderStatusEvent.create({
      data: {
        orderId: newOrder.id,
        status: "PENDING",
        note: "Order placed",
      },
    });

    // Redeem coupon (if any)
    if (couponId) {
      await tx.couponRedemption.create({
        data: {
          couponId,
          userId: input.userId,
          orderId: newOrder.id,
        },
      });
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Clear user's cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  // 8. Fetch the complete order with items
  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  // 9. Send confirmation email (non-blocking)
  if (fullOrder) {
    void sendOrderConfirmationEmail(fullOrder).catch((err) =>
      console.error("[orders] Failed to send confirmation email:", err),
    );
  }

  return fullOrder!;
}

// ----------------------------------------------------------------------------
// Get orders
// ----------------------------------------------------------------------------

/**
 * Get a single order by ID. Verifies ownership (userId must match).
 */
export async function getOrderById(
  orderId: string,
  userId: string,
): Promise<OrderWithItems | null> {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });
}

/**
 * Get a single order by order number (e.g., "AURA-2026-0001").
 * Verifies ownership.
 */
export async function getOrderByNumber(
  orderNumber: string,
  userId: string,
): Promise<OrderWithItems | null> {
  return prisma.order.findFirst({
    where: { orderNumber: orderNumber.toUpperCase(), userId },
    include: {
      items: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });
}

/**
 * Get all orders for a user, paginated, newest first.
 */
export async function getOrders(
  userId: string,
  page = 1,
  perPage = 10,
): Promise<{ orders: OrderWithItems[]; total: number; totalPages: number }> {
  const skip = (page - 1) * perPage;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        statusEvents: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    orders,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}
