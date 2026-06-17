import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/upload/hero-banners';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PROMPTS = [
  {
    name: 'hero-banner-1-lighting',
    prompt: 'Luxury editorial product photography for a home decor brand. A curated arrangement of brass table lamps with pleated shades, a modern pendant light, and a crystal table lamp on a warm wood console table. Warm ambient golden lighting. Background: soft charcoal gradient. Professional studio photography, warm color palette of cream, gold, and charcoal. Clean negative space in the center for text overlay. 16:9 aspect ratio, high resolution, photorealistic.',
  },
  {
    name: 'hero-banner-2-plants',
    prompt: 'Luxury editorial product photography for a home decor brand. Golden brass wire-cage planters with succulents, a hanging glass terrarium, and hand-painted ceramic planters on a floating wooden shelf. Lush green trailing plants. Natural soft daylight from a window. Background: warm cream wall. Sage green and cream color palette. Clean negative space in the center. 16:9 aspect ratio, photorealistic, professional studio photography.',
  },
  {
    name: 'hero-banner-3-vases',
    prompt: 'Luxury editorial product photography for a home decor brand. A hand-blown amber glass vase, a geometric crystal sculpture on a brass base, and a hammered brass decorative bowl arranged on a white marble surface. Soft side lighting creating elegant shadows. Background: ivory cream. Amber, gold, and ivory color palette. Clean negative space in the center. 16:9 aspect ratio, photorealistic, professional product photography.',
  },
  {
    name: 'hero-banner-4-candles',
    prompt: 'Luxury editorial product photography for a home decor brand. A white marble pillar candle holder with brass collar, an amber glass reed diffuser with rattan reeds, and scented wax melts in a ceramic dish. Dried lavender flowers as accent. Cozy warm candlelight glow. Background: soft cream gradient. Cream, gold, and warm taupe color palette. Clean negative space in the center. 16:9 aspect ratio, photorealistic, professional photography.',
  },
  {
    name: 'hero-banner-5-room',
    prompt: 'Luxury editorial interior photography for a home decor brand. A beautifully styled living room corner featuring a brass table lamp with warm glow, a golden cage planter with a trailing plant, and an amber glass vase on a side table. Warm charcoal walls with gold accents. Warm, inviting, aspirational mood. Cream, gold, and charcoal color palette. Clean negative space in the center for text overlay. 16:9 aspect ratio, photorealistic, professional interior photography.',
  },
];

const SIZES = ['1344x768'];

async function generateOne(name: string, prompt: string): Promise<boolean> {
  const outPath = path.join(OUTPUT_DIR, `${name}.png`);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
    console.log(`SKIP ${name} (already exists)`);
    return true;
  }

  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      console.log(`[${name}] Attempt ${attempt}/15...`);
      const zai = await ZAI.create();
      const response = await zai.images.generations.create({
        prompt,
        size: '1344x768',
      });

      if (!response.data?.[0]?.base64) throw new Error('No image data');

      const buffer = Buffer.from(response.data[0].base64, 'base64');
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ ${name} saved (${buffer.length.toLocaleString()} bytes)`);
      return true;
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.log(`  ❌ ${msg.slice(0, 100)}`);
      const wait = Math.min(30 * attempt, 120);
      console.log(`  Waiting ${wait}s...`);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
  console.log(`❌ ${name} FAILED after 15 attempts`);
  return false;
}

async function main() {
  console.log(`Generating ${PROMPTS.length} hero banners...`);
  let succeeded = 0;
  for (const { name, prompt } of PROMPTS) {
    const ok = await generateOne(name, prompt);
    if (ok) succeeded++;
    // Brief pause between images
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log(`\n=== Done: ${succeeded}/${PROMPTS.length} generated ===`);
}

main();
