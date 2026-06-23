/**
 * ============================================================================
 * Shipping Calculation
 * ============================================================================
 *
 * Pakistan-wide shipping rules:
 * - Flat Rs. 250 per order
 * - FREE shipping on orders above Rs. 10,000
 *
 * All amounts in paisa (1 PKR = 100 paisa).
 */

/** Flat shipping cost in paisa (Rs. 250) */
export const FLAT_SHIPPING_COST = 25000n;

/** Free shipping threshold in paisa (Rs. 10,000) */
export const FREE_SHIPPING_THRESHOLD = 1_000_000n;

/**
 * Calculate shipping cost for a given subtotal.
 *
 * @param subtotalPaisa - Order subtotal in paisa (BigInt)
 * @returns Shipping cost in paisa (BigInt) — 0 if free shipping applies
 *
 * @example
 *   calculateShipping(50000n)   // 25000n (Rs. 250 — below threshold)
 *   calculateShipping(1_000_000n) // 0n (free — at threshold)
 *   calculateShipping(1_500_000n) // 0n (free — above threshold)
 */
export function calculateShipping(subtotalPaisa: bigint): bigint {
  if (subtotalPaisa >= FREE_SHIPPING_THRESHOLD) {
    return 0n;
  }
  return FLAT_SHIPPING_COST;
}

/**
 * Check if an order qualifies for free shipping.
 */
export function qualifiesForFreeShipping(subtotalPaisa: bigint): boolean {
  return subtotalPaisa >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Calculate how much more the user needs to spend to qualify for free shipping.
 * Returns 0n if already qualified.
 *
 * @example
 *   amountUntilFreeShipping(800000n)  // 200000n (Rs. 2,000 more needed)
 *   amountUntilFreeShipping(1_000_000n) // 0n (already qualified)
 */
export function amountUntilFreeShipping(subtotalPaisa: bigint): bigint {
  if (subtotalPaisa >= FREE_SHIPPING_THRESHOLD) {
    return 0n;
  }
  return FREE_SHIPPING_THRESHOLD - subtotalPaisa;
}
