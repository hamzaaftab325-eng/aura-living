/**
 * Test Resend email delivery directly.
 * Run: npx tsx scripts/test-resend.ts your-email@example.com
 */
import { config } from "dotenv";
import { Resend } from "resend";

config({ path: ".env" });
config({ path: ".env.local", override: true });

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Aura Living <onboarding@resend.dev>";
  const to = process.argv[2];

  if (!to) {
    console.error("❌ Usage: npx tsx scripts/test-resend.ts your-email@example.com");
    process.exit(1);
  }

  if (!apiKey || apiKey.startsWith("re_placeholder")) {
    console.error("❌ RESEND_API_KEY is not set. Add it to .env.local");
    process.exit(1);
  }

  console.log(`\n📧 Testing Resend email delivery`);
  console.log(`   From: ${from}`);
  console.log(`   To:   ${to}`);
  console.log(`   API Key: ${apiKey.substring(0, 8)}...\n`);

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Aura Living — Resend Test Email",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px;">
        <h1 style="color: #2C2C2C;">✅ Resend is working!</h1>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 24px;">
          Hi there,
        </p>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 24px;">
          This is a test email from Aura Living. If you're reading this,
          your Resend integration is configured correctly.
        </p>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 24px;">
          Next steps:
        </p>
        <ul style="color: #4A4A4A; font-size: 15px; line-height: 24px;">
          <li>Sign up at http://localhost:3000/auth/signup</li>
          <li>You'll receive a verification email (just like this one)</li>
          <li>Click the link to verify your account</li>
          <li>Log in at http://localhost:3000/auth/login</li>
        </ul>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #E5E5E5;">
        <p style="color: #999; font-size: 12px;">Aura Living — Where Comfort Meets Style</p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Email failed to send:");
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log(`✅ Email sent successfully!`);
  console.log(`   Email ID: ${data?.id}`);
  console.log(`\n   Check your inbox (and spam folder) at: ${to}`);
  console.log(`   You can also view it in Resend dashboard: https://resend.com/emails\n`);
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
