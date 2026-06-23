/**
 * ============================================================================
 * Server-Side Address Operations
 * ============================================================================
 *
 * CRUD operations for user addresses. All functions verify ownership
 * (userId must match the address's userId).
 *
 * USAGE (server-side only):
 *   import { getAddresses, createAddress } from '@/lib/addresses';
 */

import { prisma } from "@/lib/db";
import type { Address } from "@prisma/client";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface AddressInput {
  label: string; // Home | Work | Other
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal: string;
  country?: string;
  isDefault?: boolean;
}

// ----------------------------------------------------------------------------
// Get addresses
// ----------------------------------------------------------------------------

/**
 * Get all addresses for a user.
 */
export async function getAddresses(userId: string): Promise<Address[]> {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

/**
 * Get the user's default address (or null if none).
 */
export async function getDefaultAddress(
  userId: string,
): Promise<Address | null> {
  return prisma.address.findFirst({
    where: { userId, isDefault: true },
  });
}

/**
 * Get a single address by ID. Verifies ownership.
 */
export async function getAddressById(
  addressId: string,
  userId: string,
): Promise<Address | null> {
  return prisma.address.findFirst({
    where: { id: addressId, userId },
  });
}

// ----------------------------------------------------------------------------
// Create address
// ----------------------------------------------------------------------------

/**
 * Create a new address for a user.
 * If isDefault is true, unsets any existing default.
 * If this is the user's first address, automatically makes it default.
 */
export async function createAddress(
  userId: string,
  input: AddressInput,
): Promise<Address> {
  // Check if user has any addresses
  const existingCount = await prisma.address.count({ where: { userId } });
  const shouldBeDefault = input.isDefault ?? existingCount === 0;

  // If making this the default, unset any existing default
  if (shouldBeDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      label: input.label,
      name: input.name,
      phone: input.phone,
      line1: input.line1,
      line2: input.line2 ?? null,
      city: input.city,
      province: input.province,
      postal: input.postal,
      country: input.country ?? "Pakistan",
      isDefault: shouldBeDefault,
    },
  });
}

// ----------------------------------------------------------------------------
// Update address
// ----------------------------------------------------------------------------

/**
 * Update an existing address. Verifies ownership.
 * If isDefault is being set to true, unsets any existing default.
 */
export async function updateAddress(
  addressId: string,
  userId: string,
  input: Partial<AddressInput>,
): Promise<Address | null> {
  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!existing) return null;

  // If making this the default, unset any existing default
  if (input.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data: {
      ...(input.label !== undefined && { label: input.label }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.line1 !== undefined && { line1: input.line1 }),
      ...(input.line2 !== undefined && { line2: input.line2 }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.province !== undefined && { province: input.province }),
      ...(input.postal !== undefined && { postal: input.postal }),
      ...(input.country !== undefined && { country: input.country }),
      ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
    },
  });
}

// ----------------------------------------------------------------------------
// Delete address
// ----------------------------------------------------------------------------

/**
 * Delete an address. Verifies ownership.
 * If the deleted address was the default, makes the most recent remaining
 * address the new default.
 */
export async function deleteAddress(
  addressId: string,
  userId: string,
): Promise<boolean> {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!existing) return false;

  await prisma.address.delete({ where: { id: addressId } });

  // If we deleted the default, promote another
  if (existing.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return true;
}

// ----------------------------------------------------------------------------
// Set default address
// ----------------------------------------------------------------------------

/**
 * Set an address as the default. Unsets any existing default.
 * Verifies ownership.
 */
export async function setDefaultAddress(
  addressId: string,
  userId: string,
): Promise<boolean> {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!existing) return false;

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);

  return true;
}
