/**
 * ============================================================================
 * PKR Currency Helpers
 * ============================================================================
 *
 * All monetary values in the database are stored as integer paisa
 * (1 PKR = 100 paisa). This avoids floating-point rounding errors.
 *
 * Example: Rs. 9,999.00 stored as 999900
 *
 * These helpers convert between BigInt (DB) and display strings.
 */

/**
 * Format a paisa amount (BigInt) as a PKR display string.
 *
 * @example
 *   formatPKR(999900n)           // "Rs. 9,999"
 *   formatPKR(999900n, true)     // "Rs. 9,999.00"
 *   formatPKR(BigInt(0))         // "Rs. 0"
 */
export function formatPKR(paisa: bigint, showDecimals = false): string {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Format paisa as a bare number without the "Rs." prefix.
 *
 * @example
 *   formatPKRNumber(999900n)     // "9,999"
 */
export function formatPKRNumber(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Convert a rupee number (from a form input) to paisa BigInt for storage.
 *
 * @example
 *   rupeesToPaisa(9999)          // 999900n
 *   rupeesToPaisa(99.99)         // 9999n
 */
export function rupeesToPaisa(rupees: number): bigint {
  if (rupees < 0) {
    throw new Error("Amount cannot be negative");
  }
  return BigInt(Math.round(rupees * 100));
}

/**
 * Convert paisa BigInt back to a rupee number (for form inputs).
 *
 * @example
 *   paisaToRupees(999900n)       // 9999
 */
export function paisaToRupees(paisa: bigint): number {
  return Number(paisa) / 100;
}

/**
 * Calculate a percentage discount on a paisa amount.
 * Returns the discount amount in paisa (capped at maxDiscount if provided).
 *
 * @example
 *   calculatePercentageDiscount(100000n, 10)              // 10000n (10% of Rs. 1,000)
 *   calculatePercentageDiscount(100000n, 10, 5000n)       // 5000n (capped at Rs. 50)
 */
export function calculatePercentageDiscount(
  amount: bigint,
  percentage: number,
  maxDiscount?: bigint,
): bigint {
  const discount = (amount * BigInt(Math.round(percentage))) / 100n;
  if (maxDiscount !== undefined && discount > maxDiscount) {
    return maxDiscount;
  }
  return discount;
}

/**
 * Add two paisa amounts safely.
 */
export function addPaisa(a: bigint, b: bigint): bigint {
  return a + b;
}

/**
 * Subtract one paisa amount from another (clamped at 0).
 */
export function subtractPaisa(a: bigint, b: bigint): bigint {
  const result = a - b;
  return result < 0n ? 0n : result;
}
