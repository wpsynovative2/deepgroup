import Image from "next/image";
import { FitImage } from "@/components/ui/FitImage";
import { CalendarDays, IndianRupee, LayoutGrid, MapPin, ShieldCheck } from "lucide-react";
import type { Project } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/ui/Badge";
import { CtaButton } from "@/components/ui/CtaButton";
import { LeafSprig } from "@/components/decor/Botanical";
import { formatConfigs, possessionLabel } from "@/lib/utils";

/**
 * Brochure renders are tall portrait shots, so the render sits whole inside an arch frame
 * while a blurred copy of it tints the maroon background.
 */
export function ProjectHero({ p, stationName }: { p: Project; stationName: string }) {
  const configs = formatConfigs(p.units.map((u) => u.label));
  const facts = [
    p.price.onRequest
      ? { icon: LayoutGrid, label: p.category === "residential" ? "Homes" : "Spaces", value: configs || "On request" }
      : { icon: IndianRupee, label: "Price", value: p.price.display },
    { icon: CalendarDays, label: "Possession", value: possessionLabel(p.status, p.possession) },
    p.rera?.[0]
      ? { icon: ShieldCheck, label: "MahaRERA", value: p.rera[0].number }
      : { icon: IndianRupee, label: "Pricing", value: "On request" },
  ];

  return (
    <section className="grain relative isolate overflow-hidden bg-brand-900 pt-28 pb-16 text-white md:pt-32 lg:pb-20">
      <Image src={p.images.cover.src} alt="" fill sizes="50vw" className="-z-10 scale-125 object-cover opacity-30 blur-2xl" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-800/70" />
      <LeafSprig className="absolute top-24 -left-8 h-72 w-44 -rotate-12 text-gold-400/15" />

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Breadcrumbs
            tone="light"
            className="hero-rise"
            items={[
              { name: "Projects", href: "/projects" },
              { name: stationName, href: `/projects/station/${p.station}` },
              { name: p.name, href: `/projects/${p.slug}` },
            ]}
          />
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-3" style={{ "--d": 100 } as React.CSSProperties}>
            <StatusBadge status={p.status} className="bg-white/90" />
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="size-4 text-gold-400" aria-hidden /> {p.location.locality}
              {p.location.distanceFromStation ? ` · ${p.location.distanceFromStation} from ${stationName} station` : ""}
            </span>
          </div>
          <h1 className="hero-rise mt-4 text-5xl text-white md:text-7xl" style={{ "--d": 200 } as React.CSSProperties}>
            {p.name}
          </h1>
          <p className="hero-rise mt-3 max-w-xl text-lg text-white/80" style={{ "--d": 300 } as React.CSSProperties}>
            {p.tagline}
          </p>

          <dl
            className="hero-rise mt-8 grid grid-cols-2 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md sm:grid-cols-3"
            style={{ "--d": 400 } as React.CSSProperties}
          >
            {facts.map(({ icon: I, label, value }) => (
              <div key={label} className="border-white/15 px-4 py-3 not-last:border-r max-sm:last:col-span-2 max-sm:last:border-t sm:px-5 sm:py-4">
                <dt className="flex items-center gap-1.5 text-xs text-white/60">
                  <I className="size-3.5 text-gold-400" aria-hidden /> {label}
                </dt>
                <dd className="mt-1 font-display text-base sm:text-lg">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ "--d": 500 } as React.CSSProperties}>
            <CtaButton project={p.name} intent="site-visit" source={`/projects/${p.slug}#hero`} variant="light" size="lg">
              Book a site visit
            </CtaButton>
            {p.brochure ? (
              <CtaButton
                project={p.name}
                intent="brochure"
                onSuccessUrl={p.brochure}
                source={`/projects/${p.slug}#hero`}
                size="lg"
                className="!bg-transparent ring-1 ring-white/50 hover:!bg-white/10"
              >
                Download brochure
              </CtaButton>
            ) : null}
          </div>
        </div>

        {/* The render, whole, in an arch */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div aria-hidden className="absolute -inset-4 arch border border-gold-400/40" />
          <div className="hero-settle relative aspect-[3/4] overflow-hidden arch bg-white shadow-2xl shadow-black/40">
            <FitImage
              src={p.images.cover.src}
              alt={p.images.cover.alt}
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 420px, 90vw"
            />
          </div>
          {p.rera?.[0]?.qr ? (
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 text-ink shadow-xl sm:-left-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.rera[0].qr} alt={`MahaRERA QR code for ${p.rera[0].number}`} className="size-16 rounded-lg" />
              <span className="text-xs leading-tight">
                <span className="block font-semibold text-brand-700">MahaRERA</span>
                Scan to verify
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
