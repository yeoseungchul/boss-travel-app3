import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  ".next",
  "out",
  "build",
  "coverage",
  ".turbo",
  "tsconfig.tsbuildinfo",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
  ".pnpm-debug.log",
];

const alsoRemoveNodeModules = process.argv.includes("--deps") || process.env.CLEAN_DEPS === "1";
if (alsoRemoveNodeModules) targets.unshift("node_modules");

async function safeRm(rel) {
  const p = path.join(root, rel);
  if (!existsSync(p)) return;
  await rm(p, { recursive: true, force: true });
  process.stdout.write(`removed ${rel}\n`);
}

await Promise.all(targets.map((t) => safeRm(t)));

