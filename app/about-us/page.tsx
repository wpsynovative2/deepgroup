import { FitImage } from "@/components/ui/FitImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCards } from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { CtaBand } from "@/components/home/CtaBand";
import { Legacy } from "@/components/home/Legacy";
import { CountUp } from "@/components/decor/CountUp";
import { Wave } from "@/components/decor/Wave";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getPageSeo, getSite } from "@/lib/data/content";
import { getAllProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { graph } from "@/lib/seo/jsonld";
import { siteUrl } from "@/lib/utils";

export const metadata = buildMetadata({ ...getPageSeo("/about-us"), path: "/about-us" });

export default function AboutPage() {
  const about = getPage("about");
  const { stats } = getPage("home");
  const site = getSite();
  const current = getAllProjects();

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "AboutPage",
          url: siteUrl("/about-us"),
          about: { "@id": siteUrl("/#organization") },
          mainEntity: { "@id": siteUrl("/#organization"), foundingDate: site.foundingYear },
        })}
      />
      <PageHero
        title={about.hero.title}
        accent={about.hero.titleAccent}
        subtitle={about.hero.subtitle}
        crumbs={[{ name: "About us", href: "/about-us" }]}
        image={{ src: "/images/projects/deep-crown/cover.jpg", alt: "" }}
      />

      {/* Story + stats */}
      <section className="section-y bg-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="relative" data-reveal="left">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden arch-sm">
                <FitImage src="/images/projects/deep-landmark/cover.jpg" alt="Deep Landmark, Gala Nagar, Nalasopara East" sizes="(min-width: 1024px) 270px, 45vw" />
              </div>
              <div className="relative mt-12 aspect-[3/4] overflow-hidden arch-sm">
                <FitImage src="/images/projects/deep-sky/cover.jpg" alt="Deep Sky, Yashwant Smart City, Vasai East" sizes="(min-width: 1024px) 270px, 45vw" />
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-3xl bg-brand-700 px-7 py-5 text-center text-white shadow-2xl">
              <p className="font-display text-5xl leading-none text-gold-400">{site.yearsOfSuccess}th</p>
              <p className="mt-1 text-xs tracking-[0.2em] uppercase">Year of success</p>
            </div>
          </div>
          <div>
            <SectionHeading align="left" title={about.story.title} subtitle={about.story.body} />
            <dl className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className="rounded-2xl border border-line bg-cream p-5" data-reveal style={{ "--d": i * 90 } as React.CSSProperties}>
                  <dd className="font-display text-4xl text-brand-700">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="text-sm text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section className="grain relative bg-sand section-y">
        <Wave position="top" className="text-white" />
        <div className="container-x">
          <SectionHeading title="What we" accent="promise" />
          <div className="mt-12">
            <IconCards items={about.pillars} cols={4} tone="cream" />
          </div>
        </div>
        <Wave position="bottom" variant={2} className="text-white" />
      </section>

      {/* Current projects strip */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Building" accent="now" subtitle={`${current.length} current projects across the Western line.`} />
          <ul className="no-scrollbar -mx-5 mt-12 flex snap-x gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0">
            {current.map((p, i) => (
              <li key={p.slug} className="w-44 shrink-0 snap-start lg:w-auto" data-reveal style={{ "--d": i * 70 } as React.CSSProperties}>
                <Link href={`/projects/${p.slug}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden arch-sm">
                    <FitImage src={p.images.cover.src} alt={p.images.cover.alt} sizes="180px" className="transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <ArrowUpRight className="absolute right-3 bottom-3 size-5 text-white opacity-0 transition group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="mt-3 block font-display text-lg leading-tight text-brand-700">{p.name}</span>
                  <span className="text-xs text-muted">{p.location.locality}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Legacy />

      {/* Compliance */}
      <section className="section-y bg-cream">
        <div className="container-x">
          <SectionHeading title="Built on" accent="trust" />
          <ul className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            {about.compliance.map((c, i) => (
              <li key={c.title} className="flex items-center gap-4 rounded-2xl bg-white p-5" data-reveal style={{ "--d": i * 80 } as React.CSSProperties}>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-700 text-gold-400">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-xl text-brand-700">{c.title}</span>
                  <span className="text-sm text-muted">{c.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand source="/about-us#cta" />
    </>
  );
}
