import { Suspense, type ReactNode } from "react";
import type { Category, ProjectSummary, StationOption } from "@/types";
import { ProjectExplorer } from "./ProjectExplorer";
import { ProjectCard } from "./ProjectCard";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, itemListLd } from "@/lib/seo/jsonld";

type Props = {
  title: string;
  accent?: string;
  subtitle?: string;
  crumbs: Array<{ name: string; href: string }>;
  projects: ProjectSummary[];
  stations: StationOption[];
  lock?: { station?: string; category?: Category };
  heroImage?: { src: string; alt: string };
  stats?: Array<{ value: string; label: string }>;
  after?: ReactNode;
  ld?: object[];
};

export function ListingTemplate({ title, accent, subtitle, crumbs, projects, stations, lock, heroImage, stats, after, ld = [] }: Props) {
  const scoped = projects.filter((p) => (!lock?.station || p.station === lock.station) && (!lock?.category || p.category === lock.category));
  return (
    <>
      <JsonLd data={graph(itemListLd(scoped.map((p) => p.slug)), ...ld)} />
      <PageHero title={title} accent={accent} subtitle={subtitle} crumbs={crumbs} image={heroImage}>
        {stats ? (
          <dl className="flex flex-wrap gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-gold-500/30 bg-white/70 px-5 py-3 backdrop-blur">
                <dd className="font-display text-2xl text-brand-700">{s.value}</dd>
                <dt className="text-xs text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        ) : null}
      </PageHero>
      <section className="section-y !pt-14 bg-white">
        <div className="container-x">
          {/* Fallback renders every card as HTML so crawlers see the full list. */}
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {scoped.map((p) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </div>
            }
          >
            <ProjectExplorer projects={projects} stations={stations} lock={lock} />
          </Suspense>
        </div>
      </section>
      {after}
      <CtaBand />
    </>
  );
}
