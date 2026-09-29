import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { ProjectHero } from "@/components/projects/detail/ProjectHero";
import { SubNav } from "@/components/projects/detail/SubNav";
import {
  AmenitiesGrid, ConfigurationTable, ConstructionUpdates, DetailHeading, LocationConnectivity, ProjectFaq, ProjectOverview, ReraBlock,
  Specifications,
} from "@/components/projects/detail/Sections";
import { Gallery } from "@/components/projects/detail/Gallery";
import { FloorPlans } from "@/components/projects/detail/FloorPlans";
import { LazyMap } from "@/components/projects/detail/LazyMap";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllProjects, getProjectBySlug, getRelatedProjects, toSummary } from "@/lib/data/projects";
import { getStations } from "@/lib/data/stations";
import { getAmenity, getSite } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { mapEmbedSrc } from "@/lib/utils";
import { faqLd, graph, projectLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return {};
  return {
    ...buildMetadata({ title: p.seo.title, description: p.seo.description, path: `/projects/${p.slug}`, image: `/projects/${p.slug}/opengraph-image` }),
    keywords: p.seo.keywords,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();

  const site = getSite();
  const stationName = getStations().find((s) => s.slug === p.station)?.name ?? p.station;
  const related = getRelatedProjects(p, 3).map(toSummary);
  const amenityLabels = p.amenities.map((a) => getAmenity(a)?.label).filter(Boolean) as string[];
  const projectNames = getAllProjects().map((x) => x.name);

  const nav = [
    { id: "overview", label: "Overview" },
    ...(p.units.length ? [{ id: "configurations", label: "Configurations" }] : []),
    ...(p.specifications.length ? [{ id: "specifications", label: "Specifications" }] : []),
    { id: "amenities", label: "Amenities" },
    ...(p.images.gallery.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(p.images.floorPlans.length ? [{ id: "floor-plans", label: "Floor plans" }] : []),
    { id: "location", label: "Location" },
    ...(p.status === "ongoing" && p.constructionUpdates.length ? [{ id: "updates", label: "Updates" }] : []),
    { id: "rera", label: "RERA" },
  ];

  return (
    <>
      <JsonLd data={graph(projectLd(p, amenityLabels), ...(p.faqs.length ? [faqLd(p.faqs)] : []))} />
      <ProjectHero p={p} stationName={stationName} />
      <SubNav items={nav} />

      <div className="container-x grid gap-14 py-16 lg:grid-cols-[1fr_360px] lg:py-24">
        <div className="grid min-w-0 gap-20">
          <ProjectOverview p={p} />
          <ConfigurationTable p={p} />
          <Specifications p={p} />
          <AmenitiesGrid p={p} />
          {p.images.gallery.length ? (
            <section id="gallery" className="scroll-mt-40">
              <DetailHeading title="Gallery" />
              <Gallery images={p.images.gallery} />
            </section>
          ) : null}
          {p.images.floorPlans.length ? (
            <section id="floor-plans" className="scroll-mt-40">
              <DetailHeading title="Floor" accent="plans" />
              <FloorPlans plans={p.images.floorPlans} project={p.name} slug={p.slug} />
            </section>
          ) : null}
          <LocationConnectivity
            p={p}
            map={<LazyMap src={p.location.mapEmbedUrl ?? mapEmbedSrc(p.location)} label={p.name} />}
          />
          <ConstructionUpdates p={p} />
          <ReraBlock p={p} />
          <ProjectFaq p={p} />
        </div>

        {/* Sticky enquiry card (desktop). Mobile uses the bottom action bar. */}
        <aside className="hidden lg:block" aria-label={`Enquire about ${p.name}`}>
          <div className="sticky top-40 rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(51,3,15,.4)]">
            <p className="font-script text-3xl text-gold-600">Interested?</p>
            <p className="font-display text-2xl text-brand-700">Enquire about {p.name}</p>
            <p className="mt-1 mb-5 text-sm text-muted">{p.price.onRequest ? "Get prices & availability" : p.price.display}</p>
            <LeadForm projects={projectNames} compact defaults={{ project: p.name }} intent="enquiry" source={`/projects/${p.slug}#sidebar`} submitLabel="Request a callback" />
            <a
              href={`tel:${(p.bookingPhone ?? site.phone).replace(/\s/g, "")}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm text-brand-700 hover:border-gold-500"
            >
              <Phone className="size-4" aria-hidden /> Booking: {p.bookingPhone ?? site.phone}
            </a>
            {p.redevelopmentOf ? (
              <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-center text-xs text-muted">
                A redevelopment of <span className="font-medium text-brand-700">{p.redevelopmentOf}</span>
              </p>
            ) : null}
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="section-y bg-cream">
          <div className="container-x">
            <DetailHeading title="You may also" accent="like" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <ProjectCard key={r.slug} p={r} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <CtaBand source={`/projects/${p.slug}#cta`} />
    </>
  );
}
