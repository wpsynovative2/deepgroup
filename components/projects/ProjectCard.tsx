import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, LayoutGrid, TrainFront } from "lucide-react";
import type { ProjectSummary } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { CtaButton } from "@/components/ui/CtaButton";
import { formatPrice } from "@/lib/utils";

const CAT_LABEL = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" } as const;

export function ProjectCard({ p, priority, delay = 0, enquire = true }: { p: ProjectSummary; priority?: boolean; delay?: number; enquire?: boolean }) {
  return (
    <article
      data-reveal
      style={{ "--d": delay } as React.CSSProperties}
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_30px_60px_-30px_rgba(101,7,39,.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.cover.src}
          alt={p.cover.alt}
          fill
          preload={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 left-4 flex gap-2">
          <StatusBadge status={p.status} className="bg-white/90" />
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-white/15 px-3 py-1 text-xs text-white ring-1 ring-white/30 backdrop-blur">
          {CAT_LABEL[p.category]}
        </span>
        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between text-white">
          <div>
            <p className="text-xs text-white/70">
              {p.priceMin ? "Starting from" : p.unitLabels.length ? (p.category === "residential" ? "Homes" : "Spaces") : "Highlight"}
            </p>
            <p className="font-display text-2xl">{p.priceMin ? formatPrice(p.priceMin) : p.unitLabels.length ? p.configs : p.highlights[0]}</p>
          </div>
          <span className="grid size-11 translate-y-2 place-items-center rounded-full bg-white text-brand-700 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.45rem]">
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:z-10">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <TrainFront className="size-3.5 text-gold-500" aria-hidden />
          {p.locality} · near {p.stationName}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-line pt-4 text-sm">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-4 shrink-0 text-gold-500" aria-hidden />
            <div>
              <dt className="sr-only">Configurations</dt>
              <dd className="text-ink">{p.configs}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-gold-500" aria-hidden />
            <div>
              <dt className="sr-only">Possession</dt>
              <dd className="text-ink">{p.possessionLabel}</dd>
            </div>
          </div>
        </dl>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-sm font-medium text-brand-700">View details</span>
          {enquire ? (
            <CtaButton project={p.name} source={`card:${p.slug}`} variant="outline" size="sm" className="relative z-20">
              Enquire
            </CtaButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
