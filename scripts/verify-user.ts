/**
 * Manually verify a user's email (for testing only).
 * In production, users click the link in the verification email.
 *
 * Usage: npx tsx scripts/verify-user.ts hamzaaftab325@gmail.com
 */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL or DIRECT_URL is not set.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("\n❌ Usage: npx tsx scripts/verify-user.ts <email>");
    process.exit(1);
  }

  console.log(`\n📧 Marking email as verified: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  console.log(`   Found user: ${user.name}`);
  console.log(`   Currently verified: ${user.emailVerified ? "✅" : "❌"}`);

  if (user.emailVerified) {
    console.log("\n✅ Email is already verified. No changes needed.\n");
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  console.log(`\n✅ Success! ${updated.email} is now verified.`);
  console.log("   You can now log in at http://localhost:3000/auth/login\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
