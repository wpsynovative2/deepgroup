import "server-only";
import stations from "@/data/stations.json";
import { StationsSchema } from "@/lib/schemas/station.schema";
import { getAllProjects } from "./projects";

export const getStations = () => StationsSchema.parse(stations);

/** Stations that have at least one project, in line order, with counts. */
export function getActiveStations() {
  const counts = new Map<string, number>();
  for (const p of getAllProjects()) counts.set(p.station, (counts.get(p.station) ?? 0) + 1);
  return getStations()
    .filter((s) => counts.has(s.slug))
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, count: counts.get(s.slug)! }));
}

export const getStationBySlug = (slug: string) => getActiveStations().find((s) => s.slug === slug);
