import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Layers, LayoutGrid, MapPin } from "lucide-react";
import type { ProjectSummary } from "@/types";
import { getPage } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { FitImage } from "@/components/ui/FitImage";
import { StatusBadge } from "@/components/ui/Badge";
import { CompletionBar } from "@/components/ui/Completion";

export type SpotlightProject = ProjectSummary & { overview: string; floors?: string };

/** "Our projects": one large slide per project with its overview, highlights, floors and possession. */
export function FeaturedProjects({ projects }: { projects: SpotlightProject[] }) {
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
          <Carousel label="Our projects" slideClassName="basis-full" autoplay={8000}>
            {projects.map((p) => (
              <Spotlight key={p.slug} p={p} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function Spotlight({ p }: { p: SpotlightProject }) {
  const facts = [
    p.floors ? { icon: Layers, label: "Floors", value: p.floors } : { icon: LayoutGrid, label: "Homes", value: p.configs },
    { icon: CalendarDays, label: "Possession", value: p.possessionLabel },
  ];
  return (
    <article className="group relative grid overflow-hidden rounded-[2rem] border border-line bg-cream lg:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[480px]">
        <FitImage src={p.cover.src} alt={p.cover.alt} sizes="(min-width: 1024px) 640px, 100vw" className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        <div className="absolute top-5 left-5">
          <StatusBadge status={p.status} className="bg-white/90" />
        </div>
      </div>

      <div className="flex flex-col p-6 sm:p-10">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4 text-gold-500" aria-hidden /> {p.locality}
        </p>
        <h3 className="mt-2 text-3xl md:text-4xl">
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0">
            {p.name}
          </Link>
        </h3>

        <p className="mt-6 font-script text-3xl text-gold-600">Overview</p>
        <p className="mt-1 text-muted">{p.overview}</p>

        {p.highlights.length ? (
          <ul className="mt-6 grid gap-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-ink">
                <CheckCircle2 className="size-4 shrink-0 text-gold-500" aria-hidden /> {h}
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-8 grid grid-cols-2 gap-3">
          {facts.map(({ icon: I, label, value }) => (
            <div key={label} className="rounded-2xl border border-line bg-white px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <I className="size-3.5 text-gold-500" aria-hidden /> {label}
              </dt>
              <dd className="mt-1 font-display text-lg leading-tight text-brand-700">{value}</dd>
            </div>
          ))}
        </dl>

        {p.completion ? <CompletionBar completion={p.completion} className="mt-6" /> : null}

        <span className="mt-auto inline-flex items-center gap-2 pt-8 font-medium text-brand-700 transition-all group-hover:gap-3">
          View project <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}
