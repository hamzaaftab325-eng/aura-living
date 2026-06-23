/**
 * ============================================================================
 * Admin Promotion Script
 * ============================================================================
 *
 * Promotes a user to ADMIN role. Run once after creating your admin account
 * via the signup flow.
 *
 * USAGE:
 *   npx tsx scripts/promote-admin.ts hamzaaftab325@gmail.com
 *
 * FLOW:
 *   1. Sign up at /auth/signup with your email (e.g. hamzaaftab325@gmail.com)
 *   2. Verify your email (click link in email)
 *   3. Run this script to promote yourself to ADMIN
 *   4. You can now access /admin/*
 */

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Load env vars
config({ path: ".env" });
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL or DIRECT_URL is not set.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("\n❌ Usage: npx tsx scripts/promote-admin.ts <email>");
    console.error("   Example: npx tsx scripts/promote-admin.ts hamzaaftab325@gmail.com\n");
    process.exit(1);
  }

  console.log(`\n🔐 Promoting user to ADMIN: ${email}\n`);

  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.error(`❌ User not found: ${email}`);
    console.error("   Please sign up at /auth/signup first, verify your email, then run this script again.\n");
    process.exit(1);
  }

  console.log(`   Found user: ${user.name} (id: ${user.id})`);
  console.log(`   Current role: ${user.role}`);
  console.log(`   Email verified: ${user.emailVerified ? "✅" : "❌"}`);

  if (!user.emailVerified) {
    console.error("\n⚠️  WARNING: User's email is NOT verified.");
    console.error("   You should verify your email before being promoted to admin.");
    console.error("   Continuing anyway...\n");
  }

  // 2. Promote to admin
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log(`\n✅ Success! ${updated.email} is now an ADMIN.\n`);
  console.log("   You can now access /admin in your browser.\n");
  console.log("   Next steps:");
  console.log("     1. Log out and log back in (refreshes your session with new role)");
  console.log("     2. Visit http://localhost:3000/admin\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Promotion failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
