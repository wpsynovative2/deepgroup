// Validates every JSON file in /data with Zod. Run before build: npm run validate
import fs from "node:fs";
import path from "node:path";
import { ProjectSchema } from "../lib/schemas/project.schema";
import { StationsSchema } from "../lib/schemas/station.schema";
import { SiteSchema } from "../lib/schemas/site.schema";
import { JobsSchema } from "../lib/schemas/job.schema";

const root = process.cwd();
const read = (p: string) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const errors: string[] = [];

function check(label: string, fn: () => void) {
  try {
    fn();
  } catch (e) {
    errors.push(`✖ ${label}\n${e instanceof Error ? e.message : String(e)}`);
  }
}

const stations = StationsSchema.parse(read("data/stations.json"));
const amenityIds = new Set((read("data/amenities.json") as Array<{ id: string }>).map((a) => a.id));
check("data/site.json", () => SiteSchema.parse(read("data/site.json")));
check("data/jobs.json", () => JobsSchema.parse(read("data/jobs.json")));

const dir = path.join(root, "data/projects");
const slugs = new Set<string>();
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const label = `data/projects/${file}`;
  check(label, () => {
    const p = ProjectSchema.parse(read(label));
    if (`${p.slug}.json` !== file) throw new Error(`slug "${p.slug}" must match the file name`);
    if (slugs.has(p.slug)) throw new Error(`duplicate slug "${p.slug}"`);
    slugs.add(p.slug);
    if (!stations.some((s) => s.slug === p.station)) throw new Error(`unknown station "${p.station}"`);
    for (const a of p.amenities) if (!amenityIds.has(a)) throw new Error(`unknown amenity "${a}"`);
    const imgs = [p.images.cover, ...p.images.gallery, ...p.images.floorPlans].map((i) => i.src);
    for (const src of imgs) if (!fs.existsSync(path.join(root, "public", src))) throw new Error(`missing image ${src}`);
    for (const r of p.rera ?? []) if (r.qr && !fs.existsSync(path.join(root, "public", r.qr))) throw new Error(`missing RERA QR ${r.qr}`);
    if (p.brochure && !fs.existsSync(path.join(root, "public", p.brochure))) throw new Error(`missing brochure ${p.brochure}`);
  });
}

if (errors.length) {
  console.error(errors.join("\n\n"));
  process.exit(1);
}
console.log(`✔ Data valid: ${slugs.size} projects, ${stations.length} stations`);
