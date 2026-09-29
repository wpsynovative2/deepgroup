import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { StationPresence } from "@/components/home/StationPresence";
import { RedevelopmentTeaser } from "@/components/home/RedevelopmentTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { HomeContact } from "@/components/home/HomeContact";
import { Legacy } from "@/components/home/Legacy";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getSeo, getSite, getTestimonials } from "@/lib/data/content";
import { getActiveCategories, getAllProjects, toSummary } from "@/lib/data/projects";
import { getActiveStations } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";
import { graph, localBusinessLd } from "@/lib/seo/jsonld";

const seo = getSeo();
export const metadata = buildMetadata({
  title: seo.defaultTitle,
  absoluteTitle: true,
  description: seo.defaultDescription,
  path: "/",
  image: "/images/hero/hero.jpg",
});

export default function HomePage() {
  const home = getPage("home");
  const projects = getAllProjects();
  const stations = getActiveStations();
  const categories = getActiveCategories();
  const testimonials = getTestimonials();

  return (
    <>
      <JsonLd data={graph(localBusinessLd(getSite()))} />
      <Hero
        stations={stations.map(({ slug, name, count }) => ({ slug, name, count }))}
        categories={categories}
        projectCount={projects.length}
      />
      <Marquee items={home.marquee} />
      <AboutTeaser />
      <CategoryTiles />
      <FeaturedProjects projects={projects.slice(0, 6).map(toSummary)} />
      <StationPresence
        stations={stations.map((s) => ({
          slug: s.slug,
          name: s.name,
          count: s.count,
          covers: projects.filter((p) => p.station === s.slug).map((p) => ({ src: p.images.cover.src, name: p.name })),
        }))}
      />
      <RedevelopmentTeaser />
      <Legacy />
      {testimonials.length ? <Testimonials items={testimonials} title={home.testimonials.title} /> : null}
      <HomeContact projects={projects.map((p) => p.name)} />
    </>
  );
}
