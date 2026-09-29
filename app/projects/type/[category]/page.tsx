import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Store, Building2, TrainFront } from "lucide-react";
import { ListingTemplate } from "@/components/projects/ListingTemplate";
import { PageHero } from "@/components/layout/PageHero";
import { CtaButton } from "@/components/ui/CtaButton";
import { CtaBand } from "@/components/home/CtaBand";
import { getAllProjects, getNavCategories, getProjectSummaries } from "@/lib/data/projects";
import { getActiveStations } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

const SEO: Record<string, { title: string; noun: string }> = {
  residential: { title: "Flats in Nalasopara, Virar & Vasai", noun: "residential projects" },
  commercial: { title: "Commercial Shops & Offices: Coming Soon", noun: "commercial projects" },
  industrial: { title: "Industrial Galas on NH 48", noun: "industrial projects" },
};

export function generateStaticParams() {
  return getNavCategories().map((c) => ({ category: c.slug }));
}

const find = (slug: string) => getNavCategories().find((c) => c.slug === slug);

export async function generateMetadata({ params }: PageProps<"/projects/type/[category]">) {
  const { category } = await params;
  const c = find(category);
  if (!c) return {};
  return buildMetadata({
    title: SEO[c.slug]!.title,
    description: c.comingSoon
      ? `Deep Group ${SEO[c.slug]!.noun} are coming soon near Nallasopara, Virar and Vasai. Register your interest for early access.`
      : `${c.count} Deep Group ${SEO[c.slug]!.noun} near Nallasopara, Virar and Vasai Road stations.`,
    path: `/projects/type/${c.slug}`,
  });
}

export default async function TypePage({ params }: PageProps<"/projects/type/[category]">) {
  const { category } = await params;
  const c = find(category);
  if (!c) notFound();

  const crumbs = [
    { name: "Projects", href: "/projects" },
    { name: c.title, href: `/projects/type/${c.slug}` },
  ];

  if (c.comingSoon) return <ComingSoon title={c.title} accent={c.accent} blurb={c.blurb} crumbs={crumbs} />;

  const here = getAllProjects().filter((p) => p.category === c.slug);
  return (
    <ListingTemplate
      title={c.title}
      accent={c.accent}
      subtitle={c.blurb}
      crumbs={crumbs}
      projects={getProjectSummaries()}
      stations={getActiveStations().map(({ slug, name, count }) => ({ slug, name, count }))}
      lock={{ category: c.slug }}
      heroImage={here[0]?.images.cover}
      stats={[{ value: String(here.length), label: here.length === 1 ? "Project" : "Projects" }]}
    />
  );
}

function ComingSoon({ title, accent, blurb, crumbs }: { title: string; accent: string; blurb: string; crumbs: Array<{ name: string; href: string }> }) {
  const perks = [
    { icon: TrainFront, label: "Near the station" },
    { icon: Store, label: "Shops & showrooms" },
    { icon: Building2, label: "Offices" },
  ];
  return (
    <>
      <PageHero
        title={title}
        accent={accent}
        subtitle={blurb}
        crumbs={crumbs}
        aside={
          <div className="relative mx-auto hidden w-full max-w-[380px] lg:block">
            <div className="absolute -inset-4 arch border border-gold-500/40" aria-hidden />
            <div className="hero-settle relative aspect-[3/4] overflow-hidden arch shadow-2xl shadow-brand-900/20">
              <Image src="/images/categories/commercial.jpg" alt="Illustration of a Deep Group commercial building" fill preload loading="eager" sizes="380px" className="object-cover" />
              <div className="absolute inset-0 bg-brand-900/30" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-6 py-3 font-display text-2xl whitespace-nowrap text-brand-700 shadow-xl backdrop-blur">
                Coming soon
              </span>
            </div>
          </div>
        }
      >
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm font-semibold text-gold-600">
          <Clock className="size-4" aria-hidden /> Project coming soon
        </p>
        <ul className="mb-8 flex flex-wrap gap-2">
          {perks.map(({ icon: I, label }) => (
            <li key={label} className="flex items-center gap-2 rounded-full border border-gold-500/30 bg-white/70 px-4 py-2 text-sm">
              <I className="size-4 text-gold-500" aria-hidden /> {label}
            </li>
          ))}
        </ul>
        <CtaButton size="lg" source="/projects/type/commercial" title="Get early access" message="I'm interested in Deep Group's upcoming commercial project.">
          Register your interest
        </CtaButton>
      </PageHero>
      <CtaBand source="/projects/type/commercial#cta" />
    </>
  );
}
