import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { ProjectSchema, CATEGORIES, type Project, type Category } from "@/lib/schemas/project.schema";
import type { ProjectSummary } from "@/types";
import { getStations } from "./stations";
import { getCategoryContent } from "./content";
import { formatConfigs, possessionLabel } from "@/lib/utils";

const DIR = path.join(process.cwd(), "data/projects");

export const getAllProjects = cache((): Project[] =>
  fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ProjectSchema.parse(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))))
    .sort(
      (a, b) =>
        (a.order ?? 99) - (b.order ?? 99) ||
        Number(b.featured) - Number(a.featured) ||
        b.updatedAt.localeCompare(a.updatedAt),
    ),
);

export const getProjectBySlug = (slug: string) => getAllProjects().find((p) => p.slug === slug);

export const getFeaturedProjects = (limit = 6) => getAllProjects().filter((p) => p.featured).slice(0, limit);

export function getRelatedProjects(p: Project, limit = 3) {
  const score = (x: Project) => (x.station === p.station ? 2 : 0) + (x.category === p.category ? 1 : 0);
  return getAllProjects()
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function getActiveCategories(): Array<{ slug: Category; count: number }> {
  const all = getAllProjects();
  return CATEGORIES.map((slug) => ({ slug, count: all.filter((p) => p.category === slug).length })).filter(
    (c) => c.count > 0,
  );
}

/**
 * Categories shown in navigation and tiles: every category with projects, plus any marked
 * "comingSoon" in data/categories.json (shown with a "Coming soon" badge instead of a count).
 */
export function getNavCategories() {
  const counts = new Map(getActiveCategories().map((c) => [c.slug, c.count]));
  return getCategoryContent()
    .filter((c) => counts.has(c.slug) || c.comingSoon)
    .map((c) => ({ ...c, count: counts.get(c.slug) ?? 0, comingSoon: !counts.has(c.slug) }));
}

/** The slim shape handed to cards and the client filter island. */
export function toSummary(p: Project): ProjectSummary {
  const station = getStations().find((s) => s.slug === p.station);
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    status: p.status,
    featured: p.featured,
    station: p.station,
    stationName: station?.name ?? p.station,
    locality: p.location.locality,
    configs: formatConfigs(p.units.map((u) => u.label)) || "Configurations on request",
    unitLabels: p.units.map((u) => u.label),
    priceMin: p.price.onRequest ? null : (p.price.min ?? null),
    priceDisplay: p.price.display,
    possession: p.possession ?? null,
    possessionLabel: possessionLabel(p.status, p.possession),
    rera: Boolean(p.rera?.length),
    cover: p.images.cover,
    highlights: p.highlights,
    updatedAt: p.updatedAt,
  };
}

export const getProjectSummaries = () => getAllProjects().map(toSummary);
