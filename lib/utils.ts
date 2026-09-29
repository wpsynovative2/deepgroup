export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** ₹ in lakh / crore: 5500000 → "₹55 L", 22000000 → "₹2.2 Cr" */
export function formatPrice(n: number) {
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} Cr`;
  return `₹${trim(n / 1_00_000)} L`;
}
const trim = (n: number) => (Math.round(n * 100) / 100).toString();

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2028-12" → "Dec 2028" */
export function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1] ?? ""} ${y}`;
}

/** "Ready to move", "Dec 2028", or a status phrase when no date is published. */
export function possessionLabel(status: "upcoming" | "ongoing" | "completed", possession?: string | null) {
  if (status === "completed") return "Ready to move";
  if (possession) return formatMonth(possession);
  return status === "ongoing" ? "Under construction" : "Launching soon";
}

/** Google Maps embed: exact coordinates when verified, otherwise an address search. */
export function mapEmbedSrc(loc: { lat?: number; lng?: number; mapQuery?: string; address?: string; locality?: string }) {
  const q = loc.lat !== undefined && loc.lng !== undefined ? `${loc.lat},${loc.lng}` : (loc.mapQuery ?? `${loc.address}, ${loc.locality}`);
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

/** Joins unit labels: ["2 BHK","3 BHK"] → "2 & 3 BHK" */
export function formatConfigs(labels: string[]) {
  const bhk = labels.filter((l) => /BHK$/.test(l)).map((l) => l.replace(" BHK", ""));
  const rest = labels.filter((l) => !/BHK$/.test(l));
  const parts: string[] = [];
  if (bhk.length) parts.push(`${bhk.length > 1 ? `${bhk.slice(0, -1).join(", ")} & ${bhk.at(-1)}` : bhk[0]} BHK`);
  if (rest.length) parts.push(rest.map((r) => `${r}s`).join(" & "));
  return parts.join(" · ");
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.deepgroups.in").replace(/\/$/, "");
  return `${base}${path}`;
}
