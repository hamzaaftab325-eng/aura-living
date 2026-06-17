// Generate a single hero banner image via z-ai SDK with retries
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUTPUT_PATH = '/home/z/my-project/upload/hero-banner-1-lighting.png';

const PROMPT = `Luxury editorial product photography for a home decor brand. A curated arrangement of brass table lamps with pleated shades, a modern pendant light, and a crystal table lamp on a warm wood console table. Warm ambient golden lighting. Background: soft charcoal gradient. Professional studio photography, warm color palette of cream, gold, and charcoal. Clean negative space on the right side for text overlay. 16:9 aspect ratio, high resolution, photorealistic.`;

console.log('Initializing ZAI SDK...');
const zai = await ZAI.create();
console.log('SDK ready.');

for (let attempt = 1; attempt <= 10; attempt++) {
  console.log(`Attempt ${attempt}/10...`);
  try {
    const response = await zai.images.generations.create({
      prompt: PROMPT,
      size: '1344x768',
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('No image data in response');
    }

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(OUTPUT_PATH, buffer);
    console.log(`✅ SUCCESS! Image saved to ${OUTPUT_PATH} (${buffer.length.toLocaleString()} bytes)`);
    process.exit(0);
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.log(`  ❌ Failed: ${msg.slice(0, 100)}`);
    if (attempt < 10) {
      const wait = Math.min(30 * attempt, 180); // 30s, 60s, 90s, 120s, 150s, 180s, 180s, 180s, 180s
      console.log(`  Waiting ${wait}s before retry...`);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
}

console.log('❌ All 10 attempts failed.');
process.exit(1);
