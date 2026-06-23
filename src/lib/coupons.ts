/**
 * ============================================================================
 * Coupon Validation & Application
 * ============================================================================
 *
 * Server-side coupon logic. All amounts in paisa (BigInt).
 *
 * Rules:
 * - Coupon must be active (isActive: true)
 * - Current date must be within startsAt → endsAt (if endsAt is set)
 * - Cart subtotal must meet minOrderValue
 * - For PERCENTAGE coupons: discount = (subtotal * value) / 100, capped at maxDiscount
 * - For FLAT coupons: discount = value (capped at subtotal)
 * - User-specific: perUserLimit limits how many times one user can redeem
 * - Global: usageLimit limits total redemptions across all users
 */

import { prisma } from "@/lib/db";
import type { Coupon } from "@prisma/client";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountPaisa?: bigint;
  error?: string;
}

// ----------------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------------

/**
 * Validate a coupon code against a cart subtotal.
 * Does NOT check per-user limits (use validateCouponForUser for that).
 */
export async function validateCoupon(
  code: string,
  subtotalPaisa: bigint,
): Promise<CouponValidationResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is no longer active" };
  }

  const now = new Date();
  if (now < coupon.startsAt) {
    return { valid: false, error: "This coupon is not yet valid" };
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    return { valid: false, error: "This coupon has expired" };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  if (subtotalPaisa < coupon.minOrderValue) {
    const minRupees = Number(coupon.minOrderValue) / 100;
    return {
      valid: false,
      error: `Minimum order of Rs. ${minRupees.toLocaleString("en-PK")} required for this coupon`,
    };
  }

  // Calculate discount
  let discountPaisa: bigint;
  if (coupon.type === "PERCENTAGE") {
    const percentage = Number(coupon.value);
    discountPaisa = (subtotalPaisa * BigInt(Math.round(percentage))) / 100n;
    if (coupon.maxDiscount !== null && discountPaisa > coupon.maxDiscount) {
      discountPaisa = coupon.maxDiscount;
    }
  } else {
    // FLAT
    discountPaisa = coupon.value;
  }

  // Discount can't exceed subtotal
  if (discountPaisa > subtotalPaisa) {
    discountPaisa = subtotalPaisa;
  }

  return { valid: true, coupon, discountPaisa };
}

/**
 * Validate a coupon for a specific user (checks per-user limit + existing redemptions).
 */
export async function validateCouponForUser(
  code: string,
  subtotalPaisa: bigint,
  userId: string,
): Promise<CouponValidationResult> {
  const baseResult = await validateCoupon(code, subtotalPaisa);
  if (!baseResult.valid || !baseResult.coupon) {
    return baseResult;
  }

  // Check per-user redemption count
  const userRedemptions = await prisma.couponRedemption.count({
    where: { couponId: baseResult.coupon.id, userId },
  });

  if (userRedemptions >= baseResult.coupon.perUserLimit) {
    return {
      valid: false,
      error: `You've already used this coupon (limit: ${baseResult.coupon.perUserLimit}x per user)`,
    };
  }

  return baseResult;
}

// ----------------------------------------------------------------------------
// Redemption
// ----------------------------------------------------------------------------

/**
 * Record a coupon redemption for a user + order.
 * This should be called inside the order creation transaction.
 *
 * NOTE: Does NOT validate the coupon — call validateCouponForUser first.
 */
export async function redeemCoupon(
  couponId: string,
  userId: string,
  orderId: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.couponRedemption.create({
      data: { couponId, userId, orderId },
    }),
    prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    }),
  ]);
}
