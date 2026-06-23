/**
 * ============================================================================
 * Phase 1 Verification Script
 * ============================================================================
 *
 * Verifies that all Phase 1 (Foundation) deliverables are in place.
 * Run: npx tsx scripts/verify-phase-1.ts
 *
 * This script does NOT connect to the database — it only checks that files,
 * configs, and types are correctly set up.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function fileExists(relPath: string): boolean {
  return existsSync(join(projectRoot, relPath));
}

function fileContains(relPath: string, needle: string): boolean {
  if (!fileExists(relPath)) return false;
  const content = readFileSync(join(projectRoot, relPath), "utf-8");
  return content.includes(needle);
}

console.log("\n🔍 Phase 1 Verification\n");

// 1. Dependencies
console.log("📦 Dependencies:");
const pkg = JSON.parse(
  readFileSync(join(projectRoot, "package.json"), "utf-8"),
);
check("prisma 7 installed", pkg.dependencies.prisma?.startsWith("^7"));
check(
  "@prisma/client 7 installed",
  pkg.dependencies["@prisma/client"]?.startsWith("^7"),
);
check(
  "@prisma/adapter-neon installed",
  !!pkg.dependencies["@prisma/adapter-neon"],
);
check("better-auth installed", !!pkg.dependencies["better-auth"]);
check("resend installed", !!pkg.dependencies.resend);
check("react-email installed", !!pkg.dependencies["react-email"]);
check(
  "@react-email/components installed",
  !!pkg.dependencies["@react-email/components"],
);
check("@upstash/redis installed", !!pkg.dependencies["@upstash/redis"]);
check(
  "@upstash/ratelimit installed",
  !!pkg.dependencies["@upstash/ratelimit"],
);
check("zod installed", !!pkg.dependencies.zod);
check("nanoid installed", !!pkg.dependencies.nanoid);
check("tsx installed (dev)", !!pkg.devDependencies.tsx);
check("@supabase/ssr removed", !pkg.dependencies["@supabase/ssr"]);
check(
  "@supabase/supabase-js removed",
  !pkg.dependencies["@supabase/supabase-js"],
);

// 2. Prisma Schema
console.log("\n📋 Prisma Schema:");
check("prisma/schema.prisma exists", fileExists("prisma/schema.prisma"));
check("schema has User model", fileContains("prisma/schema.prisma", "model User"));
check(
  "schema has Product model",
  fileContains("prisma/schema.prisma", "model Product"),
);
check(
  "schema has Order model",
  fileContains("prisma/schema.prisma", "model Order"),
);
check(
  "schema has Category model",
  fileContains("prisma/schema.prisma", "model Category"),
);
check("schema has Cart model", fileContains("prisma/schema.prisma", "model Cart"));
check(
  "schema has Address model",
  fileContains("prisma/schema.prisma", "model Address"),
);
check(
  "schema has Coupon model",
  fileContains("prisma/schema.prisma", "model Coupon"),
);
check(
  "schema has WishlistItem model",
  fileContains("prisma/schema.prisma", "model WishlistItem"),
);
check(
  "schema has BigInt for price",
  fileContains("prisma/schema.prisma", "BigInt"),
);
check(
  "schema has UserRole enum",
  fileContains("prisma/schema.prisma", "enum UserRole"),
);
check(
  "schema has OrderStatus enum",
  fileContains("prisma/schema.prisma", "enum OrderStatus"),
);
check(
  "schema has PaymentMethod enum (COD)",
  fileContains("prisma/schema.prisma", "enum PaymentMethod"),
);
check(
  "schema validates (provider=postgresql)",
  fileContains("prisma/schema.prisma", 'provider = "postgresql"'),
);

// 3. Prisma Config
console.log("\n⚙️  Prisma Config:");
check("prisma.config.ts exists", fileExists("prisma.config.ts"));
check(
  "prisma.config.ts uses defineConfig",
  fileContains("prisma.config.ts", "defineConfig"),
);
check(
  "prisma.config.ts references schema",
  fileContains("prisma.config.ts", "prisma/schema.prisma"),
);
check(
  "prisma.config.ts has datasource.url",
  fileContains("prisma.config.ts", "datasource"),
);

// 4. Lib files
console.log("\n📚 Lib Files:");
check("src/lib/db.ts exists", fileExists("src/lib/db.ts"));
check(
  "db.ts exports prisma singleton",
  fileContains("src/lib/db.ts", "export const prisma"),
);
check(
  "db.ts uses PrismaNeon adapter",
  fileContains("src/lib/db.ts", "PrismaNeon"),
);
check("src/lib/env.ts exists", fileExists("src/lib/env.ts"));
check("env.ts validates with Zod", fileContains("src/lib/env.ts", "safeParse"));
check(
  "env.ts exports env (server)",
  fileContains("src/lib/env.ts", "export const env"),
);
check(
  "env.ts exports clientEnv",
  fileContains("src/lib/env.ts", "export const clientEnv"),
);
check("src/lib/currency.ts exists", fileExists("src/lib/currency.ts"));
check(
  "currency.ts exports formatPKR",
  fileContains("src/lib/currency.ts", "export function formatPKR"),
);
check(
  "currency.ts exports rupeesToPaisa",
  fileContains("src/lib/currency.ts", "export function rupeesToPaisa"),
);
check(
  "currency.ts exports paisaToRupees",
  fileContains("src/lib/currency.ts", "export function paisaToRupees"),
);

// 5. Seed script
console.log("\n🌱 Seed Script:");
check("prisma/seed.ts exists", fileExists("prisma/seed.ts"));
check(
  "seed.ts seeds categories",
  fileContains("prisma/seed.ts", "seedCategories"),
);
check("seed.ts seeds products", fileContains("prisma/seed.ts", "seedProducts"));
check("seed.ts seeds coupons", fileContains("prisma/seed.ts", "seedCoupons"));
check(
  "seed.ts uses toPaisa helper",
  fileContains("prisma/seed.ts", "toPaisa"),
);
check(
  "seed.ts uses upsert (idempotent)",
  fileContains("prisma/seed.ts", "upsert"),
);
check(
  "seed.ts seeds WELCOME10 coupon",
  fileContains("prisma/seed.ts", "WELCOME10"),
);
check(
  "seed.ts seeds AURA500 coupon",
  fileContains("prisma/seed.ts", "AURA500"),
);

// 6. Package.json scripts
console.log("\n📜 Package.json Scripts:");
check("db:generate script", pkg.scripts["db:generate"] === "prisma generate");
check(
  "db:migrate script",
  pkg.scripts["db:migrate"] === "prisma migrate dev",
);
check("db:seed script", pkg.scripts["db:seed"] === "tsx prisma/seed.ts");
check("db:studio script", pkg.scripts["db:studio"] === "prisma studio");
check(
  "db:reset script",
  pkg.scripts["db:reset"] === "prisma migrate reset --force",
);
check("prisma.seed configured", pkg.prisma?.seed === "tsx prisma/seed.ts");

// 7. Environment
console.log("\n🔐 Environment:");
check(".env.example exists", fileExists(".env.example"));
check(
  ".env.example has DATABASE_URL",
  fileContains(".env.example", "DATABASE_URL"),
);
check(
  ".env.example has DIRECT_URL",
  fileContains(".env.example", "DIRECT_URL"),
);
check(
  ".env.example has AUTH_SECRET",
  fileContains(".env.example", "AUTH_SECRET"),
);
check(
  ".env.example has RESEND_API_KEY",
  fileContains(".env.example", "RESEND_API_KEY"),
);
check(
  ".env.example has UPSTASH_REDIS_REST_URL",
  fileContains(".env.example", "UPSTASH_REDIS_REST_URL"),
);
check(
  ".env.example has BLOB_READ_WRITE_TOKEN",
  fileContains(".env.example", "BLOB_READ_WRITE_TOKEN"),
);
check(
  ".env.example documents no NEXT_PUBLIC_ for secrets",
  fileContains(".env.example", "NEVER prefix server secrets"),
);

// 8. TypeScript config
console.log("\n🔧 TypeScript Config:");
const tsconfig = JSON.parse(
  readFileSync(join(projectRoot, "tsconfig.json"), "utf-8"),
);
check(
  "tsconfig target >= ES2020",
  tsconfig.compilerOptions.target >= "ES2020",
  `got ${tsconfig.compilerOptions.target}`,
);
check("tsconfig strict mode", tsconfig.compilerOptions.strict === true);

// 9. Summary
console.log("\n" + "=".repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log("❌ Phase 1 verification FAILED. Fix the issues above.\n");
  process.exit(1);
} else {
  console.log("✅ Phase 1 verification PASSED. All deliverables in place.\n");
  console.log(
    "Next step: Set DATABASE_URL and DIRECT_URL in .env.local (Supabase creds),",
  );
  console.log("then run: npm run db:migrate -- --name init && npm run db:seed\n");
  process.exit(0);
}
