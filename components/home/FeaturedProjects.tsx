import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/types";
import { getPage } from "@/lib/data/content";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";

export function FeaturedProjects({ projects }: { projects: ProjectSummary[] }) {
  const { featured } = getPage("home");
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading align="left" title={featured.title} subtitle={featured.subtitle} />
          <Link href="/projects" className="group flex items-center gap-2 font-medium text-brand-700" data-reveal>
            <span className="link-draw">View all projects</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <div className="mt-12" data-reveal>
          <Carousel label="Our projects">
            {projects.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
