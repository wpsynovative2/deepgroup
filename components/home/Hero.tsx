import Image from "next/image";
import { ArrowRight, Building2 } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { ButtonLink } from "@/components/ui/Button";
import { CtaButton } from "@/components/ui/CtaButton";
import { RotatingBadge } from "@/components/decor/RotatingBadge";
import { LeafSprig } from "@/components/decor/Botanical";
import { QuickFinder } from "./QuickFinder";
import type { StationOption } from "@/types";

type Props = { stations: StationOption[]; categories: Array<{ slug: string; count: number }>; projectCount: number };

export function Hero({ stations, categories, projectCount }: Props) {
  const { hero } = getPage("home");
  return (
    <section className="relative bg-white">
      <div className="relative flex min-h-[760px] flex-col overflow-hidden md:min-h-[860px] lg:h-[max(100svh,940px)] lg:max-h-[1040px]">
        {/* Photo: the top of hero.jpg fades to white, so the headline sits on white with no overlay. */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] sm:h-[72%] lg:h-full">
          <div className="hero-settle absolute inset-0">
            <Image
              src="/images/hero/hero.jpg"
              alt="Deep Group residential towers seen across an infinity pool"
              fill
              preload
              fetchPriority="high"
              quality={85}
              sizes="100vw"
              className="object-cover object-[50%_85%] lg:object-bottom"
            />
          </div>
          {/* soft white wash to guarantee a clean top edge on every crop */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white to-transparent" />
        </div>

        <LeafSprig className="absolute top-28 -left-8 hidden h-72 w-44 -rotate-[18deg] text-gold-500/35 md:block" />
        <LeafSprig className="absolute top-40 -right-6 hidden h-64 w-40 scale-x-[-1] rotate-[14deg] text-brand-700/15 md:block" />

        {/* white mist behind the copy keeps it legible where the tower tops rise into it */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-16 left-1/2 h-[560px] w-[min(1100px,120%)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.95)_0%,rgba(255,255,255,.8)_40%,rgba(255,255,255,0)_70%)]"
        />
        <div className="container-x relative flex flex-col items-center pt-32 text-center md:pt-36">
          <h1 className="hero-rise text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]" style={{ "--d": 120 } as React.CSSProperties}>
            {hero.title}
            <span className="mt-1 block font-script text-[1.25em] leading-[1.05] font-normal text-gold-600">{hero.titleAccent}</span>
          </h1>
          <p className="hero-rise mt-4 max-w-xl text-base font-medium text-ink/75 md:text-lg" style={{ "--d": 240 } as React.CSSProperties}>
            {hero.subtitle}
          </p>
          <div className="hero-rise mt-7 flex flex-wrap justify-center gap-3" style={{ "--d": 360 } as React.CSSProperties}>
            <ButtonLink href="/projects" size="lg">
              {hero.primaryCta}
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
            </ButtonLink>
            <CtaButton source="home-hero" intent="site-visit" variant="accent" size="lg">
              {hero.secondaryCta}
            </CtaButton>
          </div>
        </div>

        {/* Floating glass chips over the photo */}
        <div className="pointer-events-none absolute bottom-40 left-[6%] hidden animate-float lg:block">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-xl shadow-brand-900/10 ring-1 ring-white backdrop-blur-md">
            <span className="grid size-10 place-items-center rounded-full bg-brand-700 text-white">
              <Building2 className="size-5" aria-hidden />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-xl text-brand-700">{projectCount} projects</span>
              <span className="text-xs text-muted">along the Western line</span>
            </span>
          </div>
        </div>
        <div className="absolute right-[6%] bottom-44 hidden lg:block">
          <RotatingBadge text={hero.badge} className="relative" />
        </div>
      </div>

      <QuickFinder stations={stations} categories={categories} />
    </section>
  );
}
