import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

// Safe for production: keeps the build output, removes rebuildable caches only.
const targets = [".next/cache", ".next/dev/cache", ".turbo"];

async function safeRm(rel) {
  const p = path.join(root, rel);
  if (!existsSync(p)) return;
  await rm(p, { recursive: true, force: true });
  process.stdout.write(`removed ${rel}\n`);
}

await Promise.all(targets.map((t) => safeRm(t)));

