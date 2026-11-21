// Turns the full-size 360° drone panoramas (14400×7200, ~50 MB each, kept out of git in
// public/360deg-images) into web-sized equirectangular images for the project pages:
//   panorama-4096.jpg   4096×2048, phones / GPUs with a 4096 texture limit
//   panorama-6144.jpg   6144×3072, desktop
//   panorama-poster.jpg 1600×900 crop of the view the viewer opens on, shown before it loads
// Run: node scripts/generate-panoramas.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const SRC = path.join(root, "public/360deg-images");

/** Source file → project slug. Add a line here when a new panorama arrives. */
const MAP = {
  "Deep_crown.jpg": "deep-crown",
  "Deep_landmark.jpg": "deep-landmark",
  "Deep_sky.jpg": "deep-sky",
  "Deep_Vaibhav.jpg": "deep-vaibhav",
  "Mahavir_enclave.jpg": "mahavir-enclave",
};

/** Same default the viewer opens on (degrees below the horizon). */
const POSTER_PITCH = -20;

sharp.cache(false);
const open = (file) => sharp(file, { limitInputPixels: false });

for (const [file, slug] of Object.entries(MAP)) {
  const input = path.join(SRC, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip ${file}: not found`);
    continue;
  }
  const outDir = path.join(root, "public/images/projects", slug);
  fs.mkdirSync(outDir, { recursive: true });

  for (const w of [4096, 6144]) {
    await open(input)
      .resize(w, w / 2, { kernel: "lanczos3" })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(path.join(outDir, `panorama-${w}.jpg`));
  }

  // Poster: a 120°-wide, 16:9 band centred on the opening view.
  const { width, height } = await open(input).metadata();
  const cw = Math.round(width / 3);
  const ch = Math.round((cw * 9) / 16);
  const cy = Math.round(height * (0.5 - POSTER_PITCH / 180));
  await open(input)
    .extract({ left: Math.round((width - cw) / 2), top: Math.min(height - ch, Math.max(0, cy - ch / 2)), width: cw, height: ch })
    .resize(1600, 900)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, "panorama-poster.jpg"));

  console.log(`✔ ${slug}`);
}
