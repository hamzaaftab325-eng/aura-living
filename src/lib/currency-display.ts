/**
 * ============================================================================
 * PKR Currency Display Helper (client-safe)
 * ============================================================================
 *
 * Client-side version of currency formatting. The server-side version
 * (src/lib/currency.ts) cannot be imported by client components because
 * it has no client-only deps — but we keep them separate for clarity.
 *
 * This file is safe to import from client components.
 */

/**
 * Format a paisa amount (BigInt) as a PKR display string.
 *
 * @example
 *   formatPKR(999900n)  // "Rs. 9,999"
 *   formatPKR(BigInt(0))  // "Rs. 0"
 */
export function formatPKR(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format a rupee number (for prices that are already in rupees).
 *
 * @example
 *   formatRupees(9999)  // "Rs. 9,999"
 */
export function formatRupees(rupees: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}
