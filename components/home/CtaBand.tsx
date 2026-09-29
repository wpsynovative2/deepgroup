import Image from "next/image";
import { CarFront, CalendarDays, Coffee } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { CtaButton } from "@/components/ui/CtaButton";
import { LeafSprig } from "@/components/decor/Botanical";

const PERKS = [
  { icon: CarFront, label: "Free pickup & drop" },
  { icon: CalendarDays, label: "Open all 7 days" },
  { icon: Coffee, label: "Sample flat walkthrough" },
];

/** "Visit a project this weekend" band shown at the bottom of every page. */
export function CtaBand({ source = "cta-band" }: { source?: string }) {
  const { cta } = getPage("home");
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="container-x">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-brand-700 text-white" data-reveal="zoom">
          <Image src="/images/hero/hero.jpg" alt="" fill sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover object-bottom opacity-25 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-700/90 to-brand-700/40" />
          <LeafSprig className="absolute -top-6 right-6 h-60 w-40 rotate-[200deg] text-gold-400/30" />
          <div className="relative grid items-center gap-10 p-8 md:p-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-[2.2rem] leading-tight text-white md:text-5xl">
                {cta.title} <span className="font-script text-[1.3em] text-gold-400">{cta.titleAccent}</span>
              </h2>
              <p className="mt-3 text-lg text-white/75">{cta.subtitle}</p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {PERKS.map(({ icon: I, label }) => (
                  <li key={label} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 backdrop-blur">
                    <I className="size-4 text-gold-400" aria-hidden /> {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <CtaButton source={source} intent="site-visit" variant="light" size="lg" className="w-full sm:w-auto">
                {cta.button}
              </CtaButton>
              <p className="text-sm text-white/60">Takes 30 seconds. No spam, ever.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
