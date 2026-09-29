import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrainFront } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Wave } from "@/components/decor/Wave";
import { LeafSprig } from "@/components/decor/Botanical";

type StationWithProjects = { slug: string; name: string; count: number; covers: Array<{ src: string; name: string }> };

/** "Where we build": the Western line drawn as a route map with a train gliding between our stations. */
export function StationPresence({ stations }: { stations: StationWithProjects[] }) {
  const { presence } = getPage("home");
  return (
    <section className="grain relative overflow-hidden bg-brand-700 py-24 text-white md:py-32">
      <Wave position="top" className="text-white" />
      <LeafSprig className="absolute top-20 right-4 h-72 w-44 rotate-[20deg] text-gold-400/20" />
      <div aria-hidden className="absolute bottom-20 left-10 size-28 text-white/10 dot-grid" />

      <div className="container-x relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <SectionHeading align="left" tone="dark" title={presence.title} subtitle={presence.subtitle} />
        <div className="relative hidden h-56 w-44 overflow-hidden arch ring-8 ring-white/10 lg:block" data-reveal="zoom">
          <Image src="/images/redevelopment/tower.jpg" alt="" fill sizes="176px" className="object-cover" />
        </div>
      </div>

      {/* Route map */}
      <div className="container-x relative mt-16">
        <div className="relative">
          {/* track: horizontal on desktop, vertical on mobile */}
          <div aria-hidden className="absolute top-[34px] right-0 left-0 hidden h-[3px] bg-white/15 md:block">
            <div className="h-full w-full origin-left bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" data-reveal style={{ transform: "scaleX(var(--s,1))" }} />
            <span className="absolute -top-[15px] animate-ride">
              <span className="flex h-8 items-center gap-1 rounded-full bg-white px-3 text-brand-700 shadow-lg shadow-black/30">
                <TrainFront className="size-4" />
              </span>
            </span>
          </div>
          <div aria-hidden className="absolute top-2 bottom-2 left-[33px] w-[3px] bg-gradient-to-b from-gold-500 to-gold-400/40 md:hidden" />

          <ol className="relative grid gap-10 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": stations.length } as React.CSSProperties}>
            {stations.map((s, i) => (
              <li key={s.slug} data-reveal style={{ "--d": i * 180 } as React.CSSProperties}>
                <Link href={`/projects/station/${s.slug}`} className="group flex gap-5 md:flex-col md:items-center md:text-center">
                  <span className="relative grid size-[70px] shrink-0 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold-500/20 [animation-duration:2.6s]" />
                    <span className="relative grid size-[70px] place-items-center rounded-full border-2 border-gold-400 bg-brand-800 font-display text-2xl text-gold-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-brand-900">
                      {s.count}
                    </span>
                  </span>
                  <span className="md:mt-5">
                    <span className="block font-display text-2xl text-white md:text-3xl">{s.name}</span>
                    <span className="mt-1 block text-sm text-white/60">
                      {s.count} {s.count === 1 ? "project" : "projects"}
                    </span>
                    <span className="mt-4 flex -space-x-3 md:justify-center">
                      {s.covers.slice(0, 4).map((c) => (
                        <span key={c.src} className="relative size-11 overflow-hidden rounded-full ring-2 ring-brand-700 transition-transform group-hover:-translate-y-1">
                          <Image src={c.src} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                      ))}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold-200 transition group-hover:gap-3">
                      Explore {s.name} <ArrowRight className="size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-12 text-center text-sm text-white/50 md:text-right">Western line · towards Churchgate →</p>
      </div>
      <Wave position="bottom" className="text-cream" />
    </section>
  );
}
