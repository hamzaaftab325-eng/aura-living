/**
 * ============================================================================
 * Server-Side Cart Operations
 * ============================================================================
 *
 * For logged-in users, the cart is stored in the database (Cart + CartItem
 * tables). For guests, the cart is in localStorage via Zustand (see
 * src/store/useStore.ts).
 *
 * On login, the guest cart is merged into the DB cart via mergeCart().
 *
 * USAGE (server-side only):
 *   import { getCart, addToCart, mergeCart } from '@/lib/cart';
 */

import { prisma } from "@/lib/db";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface CartItemInput {
  productId?: string;
  slug?: string;
  quantity: number;
  variantId?: string;
}

export interface CartItemOutput {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: bigint; // paisa
  quantity: number;
  variantId: string | null;
  variantName: string | null;
  variantValue: string | null;
  inStock: boolean;
}

export interface CartOutput {
  id: string;
  userId: string;
  items: CartItemOutput[];
  totalPaisa: bigint; // sum of (price * qty) for all items
  itemCount: number; // sum of quantities
}

// ----------------------------------------------------------------------------
// Get cart
// ----------------------------------------------------------------------------

/**
 * Get a user's cart with all items. Returns null if user has no cart yet.
 */
export async function getCart(userId: string): Promise<CartOutput | null> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
              price: true,
              inStock: true,
              deletedAt: true,
              isActive: true,
            },
          },
          variant: {
            select: { name: true, value: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return null;

  const items: CartItemOutput[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    productSlug: item.product.slug,
    productImage: item.product.image,
    productPrice: item.product.price,
    quantity: item.quantity,
    variantId: item.variantId,
    variantName: item.variant?.name ?? null,
    variantValue: item.variant?.value ?? null,
    inStock: item.product.inStock && item.product.isActive && !item.product.deletedAt,
  }));

  const totalPaisa = items.reduce(
    (sum, item) => sum + item.productPrice * BigInt(item.quantity),
    0n,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalPaisa,
    itemCount,
  };
}

// ----------------------------------------------------------------------------
// Add to cart
// ----------------------------------------------------------------------------

/**
 * Add an item to the user's cart. Creates the cart if it doesn't exist.
 * If the item already exists (same product + variant), increments quantity.
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string,
): Promise<CartOutput> {
  // Verify product exists and is active
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true, deletedAt: null },
    select: { id: true, inStock: true, stock: true },
  });

  if (!product) {
    throw new Error("Product not found or no longer available");
  }

  if (!product.inStock) {
    throw new Error("Product is out of stock");
  }

  // Cap quantity at 99 (matches MAX_CART_QTY in store)
  const safeQty = Math.max(1, Math.min(quantity, 99));

  // Get or create cart
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Upsert cart item (increment if exists)
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId ?? null },
  });

  if (existingItem) {
    const newQty = Math.min(existingItem.quantity + safeQty, 99);
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity: safeQty },
    });
  }

  return (await getCart(userId))!;
}

// ----------------------------------------------------------------------------
// Update quantity
// ----------------------------------------------------------------------------

/**
 * Update the quantity of a cart item. Removes the item if quantity <= 0.
 */
export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number,
): Promise<CartOutput | null> {
  if (quantity <= 0) {
    return removeFromCart(userId, itemId);
  }

  const safeQty = Math.min(quantity, 99);

  // Verify the item belongs to the user's cart
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return null;

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) return null;

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: safeQty },
  });

  return getCart(userId);
}

// ----------------------------------------------------------------------------
// Remove from cart
// ----------------------------------------------------------------------------

/**
 * Remove an item from the user's cart.
 */
export async function removeFromCart(
  userId: string,
  itemId: string,
): Promise<CartOutput | null> {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return null;

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  });

  return getCart(userId);
}

// ----------------------------------------------------------------------------
// Clear cart
// ----------------------------------------------------------------------------

/**
 * Clear all items from the user's cart.
 */
export async function clearCart(userId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

// ----------------------------------------------------------------------------
// Merge guest cart into user cart
// ----------------------------------------------------------------------------

/**
 * Merge a guest cart (from localStorage) into the user's DB cart.
 * Called on login. For each guest item:
 * - If product already in user's cart: increment quantity (capped at 99)
 * - Otherwise: add new item
 *
 * @param userId - The logged-in user's ID
 * @param guestItems - Array of { productId, quantity, variantId? } from localStorage
 */
export async function mergeCart(
  userId: string,
  guestItems: CartItemInput[],
): Promise<CartOutput | null> {
  if (guestItems.length === 0) {
    return getCart(userId);
  }

  // Get or create user's cart
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Process each guest item
  for (const guestItem of guestItems) {
    // Resolve product by ID or slug
    const where = guestItem.productId
      ? { id: guestItem.productId, isActive: true, deletedAt: null }
      : guestItem.slug
        ? { slug: guestItem.slug, isActive: true, deletedAt: null }
        : null;

    if (!where) continue;

    const product = await prisma.product.findFirst({
      where,
      select: { id: true },
    });
    if (!product) continue;

    const safeQty = Math.max(1, Math.min(guestItem.quantity, 99));

    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
        variantId: guestItem.variantId ?? null,
      },
    });

    if (existing) {
      const newQty = Math.min(existing.quantity + safeQty, 99);
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          variantId: guestItem.variantId,
          quantity: safeQty,
        },
      });
    }
  }

  return getCart(userId);
}
