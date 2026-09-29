import { notFound } from "next/navigation";
import { TrainFront } from "lucide-react";
import { ListingTemplate } from "@/components/projects/ListingTemplate";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllProjects, getProjectSummaries } from "@/lib/data/projects";
import { getActiveStations, getStationBySlug } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveStations().map((s) => ({ station: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/station/[station]">) {
  const { station } = await params;
  const s = getStationBySlug(station);
  if (!s) return {};
  return buildMetadata({
    title: s.seo?.title ?? `Flats, Shops & Industrial Units near ${s.name} Station`,
    description: s.seo?.description ?? `${s.count} Deep Group projects near ${s.name} station on the Mumbai Western line.`,
    path: `/projects/station/${s.slug}`,
  });
}

export default async function StationPage({ params }: PageProps<"/projects/station/[station]">) {
  const { station } = await params;
  const s = getStationBySlug(station);
  if (!s) notFound();

  const here = getAllProjects().filter((p) => p.station === s.slug);
  const faqs = here
    .filter((p) => p.location.distanceFromStation)
    .map((p) => ({ q: `How far is ${p.name} from ${s.name} station?`, a: `${p.name} in ${p.location.locality} is about ${p.location.distanceFromStation} from ${s.name} station.` }));
  const stations = getActiveStations().map(({ slug, name, count }) => ({ slug, name, count }));

  return (
    <ListingTemplate
      title="Projects in"
      accent={s.name}
      subtitle={s.intro}
      crumbs={[
        { name: "Projects", href: "/projects" },
        { name: s.name, href: `/projects/station/${s.slug}` },
      ]}
      projects={getProjectSummaries()}
      stations={stations}
      lock={{ station: s.slug }}
      heroImage={here[0]?.images.cover}
      stats={[
        { value: String(s.count), label: s.count === 1 ? "Project" : "Projects" },
        { value: `${s.line} line`, label: "Railway" },
      ]}
      ld={faqs.length ? [faqLd(faqs)] : []}
      after={
        faqs.length ? (
          <section className="section-y bg-cream">
            <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <SectionHeading align="left" title="Getting there from" accent={s.name}>
                <p className="mt-4 flex items-center gap-2 text-muted">
                  <TrainFront className="size-5 text-gold-500" aria-hidden /> Fast locals to Dadar & Churchgate
                </p>
              </SectionHeading>
              <Accordion items={faqs} />
            </div>
          </section>
        ) : null
      }
    />
  );
}
