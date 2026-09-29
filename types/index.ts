import type { Category, Status } from "@/lib/schemas/project.schema";

export type { Project, Category, Status } from "@/lib/schemas/project.schema";
export type { Station } from "@/lib/schemas/station.schema";
export type { Site } from "@/lib/schemas/site.schema";
export type { Job } from "@/lib/schemas/job.schema";

export type ProjectSummary = {
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  status: Status;
  featured: boolean;
  station: string;
  stationName: string;
  locality: string;
  configs: string;
  unitLabels: string[];
  priceMin: number | null;
  priceDisplay: string;
  possession: string | null;
  possessionLabel: string;
  rera: boolean;
  cover: { src: string; alt: string };
  highlights: string[];
  updatedAt: string;
};

export type StationOption = { slug: string; name: string; count: number };
export type NavCategory = { slug: "residential" | "commercial" | "industrial"; count: number; comingSoon: boolean };

export type LeadModalOptions = {
  source?: string;
  project?: string;
  unit?: string;
  intent?: "enquiry" | "site-visit" | "brochure" | "cost-sheet" | "floor-plan";
  title?: string;
  /** Opens this URL in a new tab after a successful submit (brochure download). */
  onSuccessUrl?: string;
  /** Pre-filled message, e.g. from empty filter results. */
  message?: string;
};
