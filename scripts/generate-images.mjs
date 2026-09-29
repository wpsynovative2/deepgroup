// One-off asset generator: section imagery cropped from the hero render, the commercial
// "coming soon" illustration, and the favicon/app icons from the supplied logo.
// Project imagery comes from the brochures: see scripts/extract-brochure-images.py.
// Run: node scripts/generate-images.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const HERO = path.join(root, "public/images/hero/hero.jpg");
const out = (p) => {
  const full = path.join(root, "public/images", p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  return full;
};

async function crop(file, { left, top, width, height }, { w = 1200, tint, modulate } = {}) {
  let img = sharp(HERO).extract({ left, top, width, height }).resize({ width: w });
  if (modulate) img = img.modulate(modulate);
  if (tint) img = img.composite([{ input: Buffer.from(tint(w, Math.round((w * height) / width))), blend: "soft-light" }]);
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(out(file));
}

const warmOverlay = (from, to) => (w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;

// ---------- Illustrations ----------
const commercialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3d9e1"/><stop offset="0.55" stop-color="#f6ecd9"/><stop offset="1" stop-color="#fbf6ee"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8fb3c9"/><stop offset="1" stop-color="#d7e4ea"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe2a8"/><stop offset="1" stop-color="#d9ad62"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#sky)"/>
  <circle cx="930" cy="210" r="90" fill="#fff6e6" opacity=".8"/>
  <g fill="#e9d6c2" opacity=".7">
    <rect x="40" y="380" width="90" height="330"/><rect x="140" y="320" width="70" height="390"/>
    <rect x="1010" y="340" width="80" height="370"/><rect x="1095" y="400" width="80" height="310"/>
  </g>
  <!-- main block -->
  <rect x="230" y="210" width="740" height="500" fill="#f7efe3"/>
  <rect x="230" y="210" width="740" height="30" fill="#650727"/>
  <text x="600" y="232" font-family="Georgia, serif" font-size="20" letter-spacing="10" fill="#f6ecd9" text-anchor="middle">DEEP GROUP</text>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${262 + i * 78}" y="265" width="58" height="250" fill="url(#glass)"/>`).join("")}
  ${Array.from({ length: 10 }, (_, i) => `<rect x="${250 + i * 78}" y="255" width="10" height="270" fill="#e8dccb"/>`).join("")}
  ${Array.from({ length: 3 }, (_, i) => `<rect x="230" y="${330 + i * 62}" width="740" height="6" fill="#e8dccb"/>`).join("")}
  <rect x="230" y="525" width="740" height="14" fill="#c9943c"/>
  <!-- arcade -->
  ${Array.from({ length: 8 }, (_, i) => {
    const x = 250 + i * 90;
    return `<path d="M${x} 710 V600 a35 35 0 0 1 70 0 V710 Z" fill="url(#glow)"/><path d="M${x} 710 V600 a35 35 0 0 1 70 0 V710" fill="none" stroke="#650727" stroke-width="4"/>`;
  }).join("")}
  <rect x="0" y="710" width="1200" height="190" fill="#e9dfd2"/>
  <rect x="0" y="780" width="1200" height="8" fill="#d6c7b4"/>
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 110 + 20}" y="830" width="60" height="6" rx="3" fill="#fbf6ee"/>`).join("")}
  <!-- trees -->
  <g fill="#6d7f4e"><circle cx="150" cy="650" r="70"/><circle cx="110" cy="690" r="50"/><circle cx="1060" cy="650" r="72"/><circle cx="1110" cy="690" r="50"/></g>
  <g fill="#556b3a"><rect x="145" y="690" width="10" height="40"/><rect x="1055" y="690" width="10" height="40"/></g>
</svg>`;
const render = (svg, file, w, fmt = "jpeg") =>
  sharp(Buffer.from(svg)).resize({ width: w })[fmt](fmt === "jpeg" ? { quality: 85, mozjpeg: true } : {}).toFile(file);

// ---------- Build ----------
// Commercial projects are "coming soon": an illustration stands in until renders exist.
await render(commercialSvg, out("categories/commercial.jpg"), 1200);

await crop("about/towers-portrait.jpg", { left: 880, top: 600, width: 640, height: 807 }, { w: 900 });
await crop("about/pool-life.jpg", { left: 700, top: 1000, width: 700, height: 407 }, { w: 1000 });
await crop("redevelopment/tower.jpg", { left: 1060, top: 640, width: 460, height: 600 }, {
  w: 800, tint: warmOverlay("#f6ecd9", "#c9943c"),
});

// ---------- Logo-derived assets (source: public/icons/deep group Logo.png) ----------
const LOGO = path.join(root, "public/icons/deep group Logo.png");
fs.copyFileSync(LOGO, path.join(root, "public/logo-full.png")); // URL-safe copy of the full lockup
// The skyline mark is the box x 84–244, y 0–146 of the 329x229 lockup.
const mark = await sharp(LOGO).extract({ left: 84, top: 0, width: 161, height: 147 }).png().toBuffer();
await sharp(mark).toFile(path.join(root, "public/logo-mark.png"));

async function icon(file, size, padRatio = 0.14, bg = "#ffffff") {
  const inner = Math.round(size * (1 - padRatio * 2));
  const m = await sharp(mark).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: m, gravity: "centre" }])
    .png()
    .toFile(file);
}
fs.mkdirSync(path.join(root, "public/icons"), { recursive: true });
await icon(path.join(root, "app/icon.png"), 512);
await icon(path.join(root, "app/apple-icon.png"), 180);
await icon(path.join(root, "public/icons/icon-192.png"), 192);
await icon(path.join(root, "public/icons/icon-512.png"), 512);
await icon(path.join(root, "public/icons/icon-maskable-512.png"), 512, 0.22);
// Square logo for Organization JSON-LD
await icon(path.join(root, "public/logo.png"), 512, 0.08);
if (fs.existsSync(path.join(root, "public/logo.svg"))) fs.unlinkSync(path.join(root, "public/logo.svg"));

console.log("Images generated");
