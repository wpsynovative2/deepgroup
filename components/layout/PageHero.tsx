import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { LeafSprig } from "@/components/decor/Botanical";
import { Ornament } from "@/components/decor/Ornament";

type Props = {
  title: string;
  accent?: string;
  subtitle?: string;
  crumbs: Array<{ name: string; href: string }>;
  image?: { src: string; alt: string };
  children?: ReactNode;
  aside?: ReactNode;
};

/** Inner-page hero: cream panel, arch-framed image, script accent. */
export function PageHero({ title, accent, subtitle, crumbs, image = { src: "/images/about/towers-portrait.jpg", alt: "" }, children, aside }: Props) {
  return (
    <section className="grain relative overflow-hidden bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
      <LeafSprig className="absolute top-24 -left-10 h-64 w-40 -rotate-12 text-gold-500/30 md:h-80" />
      <div aria-hidden className="absolute top-1/3 right-[38%] hidden size-28 text-gold-500/30 dot-grid lg:block" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Breadcrumbs items={crumbs} className="hero-rise mb-8" />
          <Ornament className="hero-rise mb-5 text-gold-500" />
          <h1 className="hero-rise text-[2.4rem] leading-[1.05] md:text-[3.4rem]" style={{ "--d": 100 } as React.CSSProperties}>
            {title}
            {accent ? (
              <>
                {" "}
                <span className="block font-script text-[1.3em] leading-[1.1] font-normal text-gold-600">{accent}</span>
              </>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="hero-rise mt-5 max-w-xl text-lg text-muted" style={{ "--d": 200 } as React.CSSProperties}>
              {subtitle}
            </p>
          ) : null}
          {children ? (
            <div className="hero-rise mt-8" style={{ "--d": 300 } as React.CSSProperties}>
              {children}
            </div>
          ) : null}
        </div>
        {aside ?? (
          <div className="relative mx-auto hidden w-full max-w-[380px] lg:block">
            <div className="absolute -inset-4 arch border border-gold-500/40" aria-hidden />
            <div className="hero-settle relative aspect-[3/4] overflow-hidden arch shadow-2xl shadow-brand-900/20">
              <Image src={image.src} alt={image.alt} fill preload loading="eager" sizes="380px" className="object-cover" />
            </div>
            <div aria-hidden className="absolute -bottom-6 -left-10 size-24 rounded-full bg-brand-700/90 blur-0" />
          </div>
        )}
      </div>
    </section>
  );
}
