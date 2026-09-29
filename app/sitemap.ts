import type { MetadataRoute } from "next";
import { getAllProjects, getNavCategories } from "@/lib/data/projects";
import { getActiveStations } from "@/lib/data/stations";
import { getOpenJobs } from "@/lib/data/jobs";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about-us", "/projects", "/redevelopment", "/channel-partner", "/career", "/contact-us", "/privacy-policy", "/terms-and-conditions", "/disclaimer"].map((p) => ({
    url: siteUrl(p),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p.startsWith("/privacy") || p.startsWith("/terms") || p.startsWith("/disclaimer") ? 0.3 : 0.8,
  }));
  const projects = getAllProjects().map((p) => ({
    url: siteUrl(`/projects/${p.slug}`),
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: [p.images.cover.src, ...p.images.gallery.slice(0, 5).map((g) => g.src)].map((s) => siteUrl(s)),
  }));
  const stations = getActiveStations().map((s) => ({ url: siteUrl(`/projects/station/${s.slug}`), priority: 0.8 }));
  const types = getNavCategories().map((c) => ({ url: siteUrl(`/projects/type/${c.slug}`), priority: 0.7 }));
  const jobs = getOpenJobs().map((j) => ({ url: siteUrl(`/career/${j.slug}`), lastModified: new Date(j.postedAt), priority: 0.5 }));
  return [...staticPages, ...projects, ...stations, ...types, ...jobs];
}
