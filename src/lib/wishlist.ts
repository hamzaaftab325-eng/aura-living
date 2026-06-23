/**
 * ============================================================================
 * Server-Side Wishlist Operations
 * ============================================================================
 *
 * DB-backed wishlist for logged-in users. For guests, the wishlist is
 * stored in localStorage via Zustand (see src/store/useStore.ts).
 *
 * On login, the guest wishlist should be merged via mergeWishlist().
 *
 * USAGE (server-side only):
 *   import { getWishlist, toggleWishlist } from '@/lib/wishlist';
 */

import { prisma } from "@/lib/db";
import type { Product, WishlistItem } from "@prisma/client";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

// ----------------------------------------------------------------------------
// Get wishlist
// ----------------------------------------------------------------------------

/**
 * Get all wishlist items for a user, with product details.
 */
export async function getWishlist(
  userId: string,
): Promise<WishlistItemWithProduct[]> {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get just the product IDs in the user's wishlist (for quick checks).
 */
export async function getWishlistProductIds(
  userId: string,
): Promise<Set<string>> {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}

// ----------------------------------------------------------------------------
// Check if in wishlist
// ----------------------------------------------------------------------------

/**
 * Check if a product is in the user's wishlist.
 */
export async function isInWishlist(
  userId: string,
  productId: string,
): Promise<boolean> {
  const count = await prisma.wishlistItem.count({
    where: { userId, productId },
  });
  return count > 0;
}

// ----------------------------------------------------------------------------
// Add to wishlist
// ----------------------------------------------------------------------------

/**
 * Add a product to the user's wishlist.
 * Idempotent — if already in wishlist, does nothing.
 */
export async function addToWishlist(
  userId: string,
  productId: string,
): Promise<WishlistItem> {
  return prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    update: {}, // no-op if exists
    create: { userId, productId },
  });
}

// ----------------------------------------------------------------------------
// Remove from wishlist
// ----------------------------------------------------------------------------

/**
 * Remove a product from the user's wishlist.
 * Idempotent — if not in wishlist, does nothing.
 */
export async function removeFromWishlist(
  userId: string,
  productId: string,
): Promise<void> {
  await prisma.wishlistItem.deleteMany({
    where: { userId, productId },
  });
}

// ----------------------------------------------------------------------------
// Toggle wishlist
// ----------------------------------------------------------------------------

/**
 * Toggle a product in the wishlist.
 * @returns { added: boolean } — true if added, false if removed
 */
export async function toggleWishlist(
  userId: string,
  productId: string,
): Promise<{ added: boolean }> {
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });
    return { added: false };
  } else {
    await prisma.wishlistItem.create({
      data: { userId, productId },
    });
    return { added: true };
  }
}

// ----------------------------------------------------------------------------
// Merge guest wishlist
// ----------------------------------------------------------------------------

/**
 * Merge a guest wishlist (product IDs from localStorage) into the user's DB wishlist.
 * Idempotent — existing items are not duplicated.
 *
 * @param userId - The logged-in user's ID
 * @param productIds - Array of product IDs from localStorage
 */
export async function mergeWishlist(
  userId: string,
  productIds: string[],
): Promise<void> {
  if (productIds.length === 0) return;

  // Get existing wishlist items to avoid duplicates
  const existing = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  const existingIds = new Set(existing.map((e) => e.productId));

  // Filter out IDs that are already in the wishlist
  const newProductIds = productIds.filter((id) => !existingIds.has(id));

  if (newProductIds.length === 0) return;

  // Verify the products exist
  const validProducts = await prisma.product.findMany({
    where: {
      id: { in: newProductIds },
      isActive: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (validProducts.length === 0) return;

  // Create wishlist items
  await prisma.wishlistItem.createMany({
    data: validProducts.map((p) => ({
      userId,
      productId: p.id,
    })),
    skipDuplicates: true,
  });
}

// ----------------------------------------------------------------------------
// Clear wishlist
// ----------------------------------------------------------------------------

/**
 * Clear all items from the user's wishlist.
 */
export async function clearWishlist(userId: string): Promise<void> {
  await prisma.wishlistItem.deleteMany({ where: { userId } });
}
