// Pure functions, safe for the client filter island.
import type { Category, ProjectSummary, Status } from "@/types";

export const BUDGETS = [
  { value: "under-50l", label: "Under ₹50 L", test: (p: number | null) => p !== null && p < 50_00_000 },
  { value: "50l-1cr", label: "₹50 L – 1 Cr", test: (p: number | null) => p !== null && p >= 50_00_000 && p < 1_00_00_000 },
  { value: "1cr-2cr", label: "₹1 – 2 Cr", test: (p: number | null) => p !== null && p >= 1_00_00_000 && p < 2_00_00_000 },
  { value: "above-2cr", label: "Above ₹2 Cr", test: (p: number | null) => p !== null && p >= 2_00_00_000 },
  { value: "on-request", label: "Price on request", test: (p: number | null) => p === null },
] as const;

export const POSSESSIONS = [
  { value: "ready", label: "Ready to move", test: (p: ProjectSummary) => p.status === "completed" },
  { value: "2027", label: "2027", test: (p: ProjectSummary) => p.status !== "completed" && !!p.possession?.startsWith("2027") },
  { value: "2028", label: "2028", test: (p: ProjectSummary) => p.status !== "completed" && !!p.possession?.startsWith("2028") },
  { value: "2029-plus", label: "2029 +", test: (p: ProjectSummary) => p.status !== "completed" && (p.possession ?? "") >= "2029" },
] as const;

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "possession", label: "Possession: soonest" },
] as const;

export type BudgetBand = (typeof BUDGETS)[number]["value"];
export type SortKey = (typeof SORTS)[number]["value"];

export type FilterState = {
  category?: Category[];
  status?: Status[];
  station?: string[];
  config?: string[];
  budget?: BudgetBand;
  possession?: string;
  rera?: boolean;
  q?: string;
  sort?: SortKey;
};

const RESIDENTIAL_CONFIG = /BHK|Jodi/i;

export function parseFilters(sp: URLSearchParams): FilterState {
  const list = (k: string) => sp.get(k)?.split(",").filter(Boolean);
  return {
    category: list("category") as Category[] | undefined,
    status: list("status") as Status[] | undefined,
    station: list("station"),
    config: list("config"),
    budget: (sp.get("budget") as BudgetBand) ?? undefined,
    possession: sp.get("possession") ?? undefined,
    rera: sp.get("rera") === "1" || undefined,
    q: sp.get("q") ?? undefined,
    sort: (sp.get("sort") as SortKey) ?? undefined,
  };
}

export function serializeFilters(f: FilterState) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === "" || v === false) continue;
    if (Array.isArray(v)) {
      if (v.length) sp.set(k, v.join(","));
    } else if (v === true) sp.set(k, "1");
    else if (!(k === "sort" && v === "featured")) sp.set(k, String(v));
  }
  return sp.toString();
}

export function countActive(f: FilterState) {
  return (
    (f.category?.length ?? 0) +
    (f.status?.length ?? 0) +
    (f.station?.length ?? 0) +
    (f.config?.length ?? 0) +
    (f.budget ? 1 : 0) +
    (f.possession ? 1 : 0) +
    (f.rera ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

function matches(p: ProjectSummary, f: FilterState, skip?: keyof FilterState) {
  if (skip !== "category" && f.category?.length && !f.category.includes(p.category)) return false;
  if (skip !== "status" && f.status?.length && !f.status.includes(p.status)) return false;
  if (skip !== "station" && f.station?.length && !f.station.includes(p.station)) return false;
  if (skip !== "config" && f.config?.length && !p.unitLabels.some((u) => f.config!.includes(u))) return false;
  if (skip !== "budget" && f.budget && !BUDGETS.find((b) => b.value === f.budget)?.test(p.priceMin)) return false;
  if (skip !== "possession" && f.possession && !POSSESSIONS.find((x) => x.value === f.possession)?.test(p))
    return false;
  if (skip !== "rera" && f.rera && !p.rera) return false;
  if (skip !== "q" && f.q) {
    const q = f.q.toLowerCase();
    if (!p.name.toLowerCase().includes(q) && !p.locality.toLowerCase().includes(q)) return false;
  }
  return true;
}

export function applyFilters(projects: ProjectSummary[], f: FilterState) {
  const out = projects.filter((p) => matches(p, f));
  const price = (p: ProjectSummary, dir: 1 | -1) => p.priceMin ?? (dir === 1 ? Infinity : -Infinity);
  switch (f.sort) {
    case "newest":
      return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "price-asc":
      return out.sort((a, b) => price(a, 1) - price(b, 1));
    case "price-desc":
      return out.sort((a, b) => price(b, -1) - price(a, -1));
    case "possession":
      return out.sort((a, b) => (a.possession ?? "9999").localeCompare(b.possession ?? "9999"));
    default:
      return out;
  }
}

/** Faceted counts: each option counted against every other active filter. */
export function getFacetCounts(projects: ProjectSummary[], f: FilterState) {
  const facet = <K extends keyof FilterState>(key: K, pick: (p: ProjectSummary) => string[]) => {
    const counts: Record<string, number> = {};
    for (const p of projects) if (matches(p, f, key)) for (const v of pick(p)) counts[v] = (counts[v] ?? 0) + 1;
    return counts;
  };
  const budget: Record<string, number> = {};
  const possession: Record<string, number> = {};
  for (const p of projects) {
    if (matches(p, f, "budget")) for (const b of BUDGETS) if (b.test(p.priceMin)) budget[b.value] = (budget[b.value] ?? 0) + 1;
    if (matches(p, f, "possession"))
      for (const x of POSSESSIONS) if (x.test(p)) possession[x.value] = (possession[x.value] ?? 0) + 1;
  }
  return {
    category: facet("category", (p) => [p.category]),
    status: facet("status", (p) => [p.status]),
    station: facet("station", (p) => [p.station]),
    config: facet("config", (p) => p.unitLabels),
    budget,
    possession,
  };
}

/** Configuration chips depend on the chosen category (industrial hides BHK). */
export function getConfigOptions(projects: ProjectSummary[], f: FilterState) {
  const scope = f.category?.length ? projects.filter((p) => f.category!.includes(p.category)) : projects;
  const labels = [...new Set(scope.flatMap((p) => p.unitLabels))];
  return labels.sort((a, b) => {
    const ra = RESIDENTIAL_CONFIG.test(a), rb = RESIDENTIAL_CONFIG.test(b);
    return ra === rb ? a.localeCompare(b, undefined, { numeric: true }) : ra ? -1 : 1;
  });
}
