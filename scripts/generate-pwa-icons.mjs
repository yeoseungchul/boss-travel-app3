import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "master-logo.png");
const ICONS_DIR = path.join(ROOT, "public", "icons");
const FAVICON_DEST = path.join(ROOT, "public", "favicon.ico");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function writePng({ size, outPath, fit = "cover", background = "#000000", paddingPct = 0 }) {
  const pad = clamp(paddingPct, 0, 0.45);
  const inner = Math.max(1, Math.round(size * (1 - pad * 2)));

  const base = sharp(SRC, { failOn: "none" }).resize(inner, inner, {
    fit: "contain",
    background,
  });

  const img =
    paddingPct > 0
      ? sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background,
          },
        }).composite([{ input: await base.png().toBuffer(), gravity: "center" }])
      : base.resize(size, size, { fit, background });

  await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outPath);
}

async function main() {
  await ensureDir(ICONS_DIR);

  const outputs = [
    // Mandatory
    { size: 192, name: "icon-192x192.png", paddingPct: 0 },
    { size: 512, name: "icon-512x512.png", paddingPct: 0 },
    // Recommended maskable: add ~10% padding so the safe area survives the mask.
    { size: 192, name: "maskable-192x192.png", paddingPct: 0.1 },
    { size: 512, name: "maskable-512x512.png", paddingPct: 0.1 },
    // Apple
    { size: 180, name: "apple-touch-icon-180x180.png", paddingPct: 0 },
  ];

  for (const o of outputs) {
    const outPath = path.join(ICONS_DIR, o.name);
    await writePng({
      size: o.size,
      outPath,
      background: "#000000",
      paddingPct: o.paddingPct ?? 0,
    });
  }

  // Favicon (.ico) from 32x32 PNG.
  const faviconPng = await sharp(SRC, { failOn: "none" })
    .resize(32, 32, { fit: "contain", background: "#000000" })
    .png()
    .toBuffer();

  const icoBuf = await pngToIco([faviconPng]);
  await fs.writeFile(FAVICON_DEST, icoBuf);

  // Print a tiny summary for humans.
  // (Keep it short; CI logs stay readable.)
  process.stdout.write(
    [
      "Generated PWA icons:",
      ...outputs.map((o) => `- public/icons/${o.name}`),
      "- public/favicon.ico",
      "",
    ].join("\n"),
  );
}

main().catch((err) => {
  console.error("[generate-pwa-icons] failed:", err);
  process.exit(1);
});

