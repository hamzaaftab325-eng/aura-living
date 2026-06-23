import { config } from "dotenv";
import { Resend } from "resend";
config({ path: ".env" });
config({ path: ".env.local", override: true });
async function main() {
  const r = new Resend(process.env.RESEND_API_KEY!);
  const { data } = await r.emails.list({ limit: 5 });
  if (data && data.data) {
    console.log("\nRecent emails sent via Resend:\n");
    data.data.forEach((e, i) => {
      console.log(`  ${i+1}. ${e.subject}`);
      console.log(`     To: ${(e.to || []).join(", ")}`);
      console.log(`     Status: sent`);
      console.log(`     Created: ${e.created_at}`);
      console.log("");
    });
  }
}
main().catch(console.error);
