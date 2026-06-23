/**
 * Verify the seeded database by querying Supabase directly.
 */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("❌ No DATABASE_URL set");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("\n📊 Database Verification\n" + "=".repeat(50));

  const categories = await prisma.category.findMany();
  console.log(`\n📁 Categories: ${categories.length}`);
  categories.forEach((c) => console.log(`   - ${c.slug} (${c.name})`));

  const productCount = await prisma.product.count();
  const sampleProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "asc" },
    include: { category: true, images: true },
  });
  console.log(`\n🛍️  Products: ${productCount} total`);
  console.log("   Sample (first 5):");
  sampleProducts.forEach((p) => {
    const pkr = (Number(p.price) / 100).toLocaleString("en-PK");
    console.log(
      `   - ${p.name} — Rs. ${pkr} (${p.category.name}, ${p.images.length} images)`,
    );
  });

  const coupons = await prisma.coupon.findMany();
  console.log(`\n🎟️  Coupons: ${coupons.length}`);
  coupons.forEach((c) => {
    const val = c.type === "PERCENTAGE" ? `${c.value}%` : `Rs. ${Number(c.value) / 100}`;
    console.log(`   - ${c.code}: ${c.description} (${val})`);
  });

  const tableCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT count(*)::bigint as count FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `;
  console.log(
    `\n📋 Total tables in database: ${tableCount[0].count}`,
  );

  console.log("\n" + "=".repeat(50) + "\n✅ Database is live and seeded!\n");
}

main()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
