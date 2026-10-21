import { ListingTemplate } from "@/components/projects/ListingTemplate";
import { getPageSeo } from "@/lib/data/content";
import { getActiveCategories, getProjectSummaries } from "@/lib/data/projects";
import { getActiveStations } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";

// Query-string views canonicalise to /projects.
export const metadata = buildMetadata({ ...getPageSeo("/projects"), path: "/projects" });

export default function ProjectsPage() {
  const projects = getProjectSummaries();
  const stations = getActiveStations().map(({ slug, name, count }) => ({ slug, name, count }));
  return (
    <ListingTemplate
      title="Our"
      accent="projects"
      subtitle="A growing portfolio of homes, commercial spaces and industrial developments across Western suburbs."
      crumbs={[{ name: "Projects", href: "/projects" }]}
      projects={projects}
      stations={stations}
      heroImage={{ src: "/images/projects/deep-sky/cover.jpg", alt: "" }}
      stats={[
        { value: String(stations.length), label: "Key Locations" },
        { value: "30+", label: "Projects Delivered" },
        { value: String(getActiveCategories().length), label: "Categories" },
      ]}
    />
  );
}
