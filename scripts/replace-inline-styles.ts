/**
 * Replace common inline style patterns with global CSS classes.
 * Run: npx tsx scripts/replace-inline-styles.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

const projectRoot = process.cwd();

// Common inline style → CSS class mappings
const replacements: Array<{ pattern: string; replacement: string; flags?: string }> = [
  // Border patterns
  { pattern: /style=\{\{ border: ['"]1\.5px solid var\(--color-gold-soft[^)]*\)['"] \}\}/g, replacement: 'className="aura-border-gold-soft-1-5"' },
  { pattern: /style=\{\{ border: ['"]1px solid var\(--color-gold-soft[^)]*\)['"] \}\}/g, replacement: 'className="aura-border-gold-soft"' },
  { pattern: /style=\{\{ border: ['"]2px solid var\(--color-gold\)['"] \}\}/g, replacement: 'className="aura-border-gold-2"' },
  { pattern: /style=\{\{ border: ['"]1px solid rgba\(220, 38, 38, 0\.2\)['"] \}\}/g, replacement: 'className="aura-border-red-soft"' },

  // Background tints
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(212, ?175, ?55, ?0\.08\)['"] \}\}/g, replacement: 'className="aura-bg-gold-tint"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(212, ?175, ?55, ?0\.05\)['"] \}\}/g, replacement: 'className="aura-bg-gold-tint-5"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(212, ?175, ?55, ?0\.1\)['"] \}\}/g, replacement: 'className="aura-bg-gold-tint-12"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(239, ?68, ?68, ?0\.05\)['"] \}\}/g, replacement: 'className="aura-bg-red-tint-5"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(220, ?38, ?38, ?0\.03\)['"] \}\}/g, replacement: 'className="aura-bg-red-tint"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(34, ?197, ?94, ?0\.05\)['"] \}\}/g, replacement: 'className="aura-bg-green-tint"' },
  { pattern: /style=\{\{ backgroundColor: ['"]rgba\(59, ?130, ?246, ?0\.05\)['"] \}\}/g, replacement: 'className="aura-bg-blue-tint"' },
  { pattern: /style=\{\{ backgroundColor: ['"]transparent['"] \}\}/g, replacement: 'className="aura-bg-transparent"' },
];

let totalReplaced = 0;
let filesModified = 0;

const files = glob.sync("src/**/*.tsx", { cwd: projectRoot });

for (const file of files) {
  const filePath = join(projectRoot, file);
  let content = readFileSync(filePath, "utf-8");
  let modified = false;

  for (const { pattern, replacement } of replacements) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      const matches = content.match(pattern);
      if (matches) {
        totalReplaced += matches.length;
      }
      content = newContent;
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, content, "utf-8");
    filesModified++;
    console.log(`  ✅ ${file}`);
  }
}

console.log(`\n📊 Replaced ${totalReplaced} inline styles in ${filesModified} files\n`);
