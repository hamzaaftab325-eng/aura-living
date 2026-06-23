/**
 * ============================================================================
 * Database Seed Script
 * ============================================================================
 *
 * Seeds the database with:
 * - 6 categories (from existing mock data)
 * - 46 products (from existing mock data, all prices converted to paisa)
 * - 2 coupons (WELCOME10, AURA500)
 *
 * Admin user is NOT seeded here. In Phase 2, Better Auth will create the
 * admin user via the signup flow, then a script will promote them to ADMIN.
 *
 * RUN:
 *   npm run db:seed
 *
 * IDEMPOTENT:
 *   Running multiple times is safe — uses upsert pattern.
 */

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Load env vars BEFORE importing mock data (which may trigger other imports)
config({ path: ".env" });
config({ path: ".env.local", override: true });

// Import existing mock data — we don't want to duplicate 1000+ lines
import { categories as mockCategories } from "../src/data/products";
import { products as mockProducts } from "../src/data/products";

// ----------------------------------------------------------------------------
// Prisma client for seed script
// In Prisma 7 with a driver adapter, the adapter MUST be passed to the
// PrismaClient constructor. We use DIRECT_URL (port 5432) for the seed
// script because it's a long-running process with many sequential writes
// (the pooled connection + PgBouncer transaction mode doesn't play well
// with multi-statement transactions in a script context).
// ----------------------------------------------------------------------------

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DIRECT_URL or DATABASE_URL is not set. Add to .env.local.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/** Convert rupees (number) to paisa (BigInt). */
function toPaisa(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

// ----------------------------------------------------------------------------
// Seed functions
// ----------------------------------------------------------------------------

async function seedCategories() {
  console.log("📝 Seeding categories...");

  for (const cat of mockCategories) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        isActive: true,
      },
      create: {
        slug: cat.id,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        isActive: true,
      },
    });
  }

  console.log(`   ✓ ${mockCategories.length} categories seeded`);
}

async function seedProducts() {
  console.log("📝 Seeding products...");

  let count = 0;
  for (const p of mockProducts) {
    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: p.category },
    });
    if (!category) {
      console.warn(
        `   ⚠ Skipping "${p.name}" — category "${p.category}" not found`,
      );
      continue;
    }

    // Convert badge string to enum (only if present)
    const badge = p.badge
      ? (["NEW", "SALE", "BESTSELLER"].includes(p.badge)
          ? (p.badge as "NEW" | "SALE" | "BESTSELLER")
          : null)
      : null;

    // Upsert the product
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku ?? `AURA-${p.id.padStart(3, "0")}`,
        description: p.description,
        material: p.material ?? null,
        dimensions: p.dimensions ?? null,
        weight: p.weight ?? null,
        careInstructions: p.careInstructions ?? null,
        warranty: p.warranty ?? null,
        origin: p.origin ?? null,
        price: toPaisa(p.price),
        originalPrice: p.originalPrice ? toPaisa(p.originalPrice) : null,
        stock: p.inStock ? 50 : 0,
        inStock: p.inStock,
        categoryId: category.id,
        badge,
        rating: p.rating,
        reviewCount: p.reviews,
        isActive: true,
        image: p.image,
      },
      create: {
        slug: p.slug,
        name: p.name,
        sku: p.sku ?? `AURA-${p.id.padStart(3, "0")}`,
        description: p.description,
        material: p.material ?? null,
        dimensions: p.dimensions ?? null,
        weight: p.weight ?? null,
        careInstructions: p.careInstructions ?? null,
        warranty: p.warranty ?? null,
        origin: p.origin ?? null,
        price: toPaisa(p.price),
        originalPrice: p.originalPrice ? toPaisa(p.originalPrice) : null,
        stock: p.inStock ? 50 : 0,
        inStock: p.inStock,
        categoryId: category.id,
        badge,
        rating: p.rating,
        reviewCount: p.reviews,
        isActive: true,
        image: p.image,
      },
    });

    // Upsert product images
    for (let i = 0; i < p.images.length; i++) {
      const url = p.images[i];
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: product.id, url },
      });
      if (!existingImage) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url,
            altText: `${p.name} — image ${i + 1}`,
            sortOrder: i,
          },
        });
      }
    }

    count++;
  }

  console.log(`   ✓ ${count} products seeded`);
}

async function seedCoupons() {
  console.log("📝 Seeding coupons...");

  // WELCOME10 — 10% off, no minimum, max Rs. 1,000 off
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {
      description: "10% off your first order (max Rs. 1,000)",
      type: "PERCENTAGE",
      value: 10n,
      minOrderValue: 0n,
      maxDiscount: 100000n, // Rs. 1,000 in paisa
      usageLimit: 1000,
      perUserLimit: 1,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-12-31"),
      isActive: true,
    },
    create: {
      code: "WELCOME10",
      description: "10% off your first order (max Rs. 1,000)",
      type: "PERCENTAGE",
      value: 10n,
      minOrderValue: 0n,
      maxDiscount: 100000n,
      usageLimit: 1000,
      perUserLimit: 1,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-12-31"),
      isActive: true,
    },
  });

  // AURA500 — flat Rs. 500 off on orders above Rs. 5,000
  await prisma.coupon.upsert({
    where: { code: "AURA500" },
    update: {
      description: "Flat Rs. 500 off on orders above Rs. 5,000",
      type: "FLAT",
      value: 50000n, // Rs. 500 in paisa
      minOrderValue: 500000n, // Rs. 5,000 in paisa
      maxDiscount: null,
      usageLimit: 500,
      perUserLimit: 1,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-12-31"),
      isActive: true,
    },
    create: {
      code: "AURA500",
      description: "Flat Rs. 500 off on orders above Rs. 5,000",
      type: "FLAT",
      value: 50000n,
      minOrderValue: 500000n,
      maxDiscount: null,
      usageLimit: 500,
      perUserLimit: 1,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-12-31"),
      isActive: true,
    },
  });

  console.log("   ✓ 2 coupons seeded (WELCOME10, AURA500)");
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

async function main() {
  console.log("\n🌱 Starting Aura Living database seed...\n");

  await seedCategories();
  await seedProducts();
  await seedCoupons();

  console.log("\n✅ Seed completed successfully!\n");
  console.log("Next steps:");
  console.log("  1. Run the app: npm run dev");
  console.log("  2. Visit http://localhost:3000 to verify frontend still works");
  console.log(
    "  3. Phase 2 will add auth — admin user created via signup flow.",
  );
}

main()
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
