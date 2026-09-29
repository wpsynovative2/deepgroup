import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { CtaButton } from "@/components/ui/CtaButton";
import { Ornament } from "@/components/decor/Ornament";

export function RedevelopmentTeaser() {
  const { redevelopment: r } = getPage("home");
  return (
    <section className="grain section-y relative overflow-hidden bg-cream">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-reveal="left">
          <Ornament className="mb-4 text-gold-500" />
          <p className="font-script text-4xl text-gold-600">Redevelopment</p>
          <h2 className="mt-1 text-[2rem] leading-[1.1] md:text-[2.6rem]">{r.title}</h2>
          <p className="mt-4 max-w-md text-lg text-muted">{r.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/redevelopment">
              Explore redevelopment <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <CtaButton source="home-redevelopment" variant="accent" title="Talk to our redevelopment team">
              Talk to our team
            </CtaButton>
          </div>
        </div>

        {/* Before → after visual + process */}
        <div className="relative">
          <div className="grid grid-cols-[1fr_auto_1.3fr] items-end gap-4" data-reveal="right">
            <figure className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl grayscale sepia-[.35]">
                <Image src="/images/redevelopment/tower.jpg" alt="" fill sizes="220px" className="object-cover object-bottom opacity-70" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_22px,rgba(255,255,255,.35)_22px_24px)]" />
              </div>
              <figcaption className="mt-2 text-center text-xs tracking-wide text-muted">Old building</figcaption>
            </figure>
            <span className="mb-16 grid size-12 place-items-center rounded-full bg-brand-700 text-gold-400 shadow-lg">
              <ArrowRight className="size-5" aria-hidden />
            </span>
            <figure className="relative">
              <div className="relative aspect-[3/4] overflow-hidden arch-sm shadow-2xl shadow-brand-900/20">
                <Image src="/images/projects/deep-crown/cover.jpg" alt="" fill sizes="300px" className="object-cover object-top" />
              </div>
              <figcaption className="mt-2 text-center text-xs tracking-wide text-brand-700">Deep Crown, Sai Nidhi CHS</figcaption>
            </figure>
          </div>

          <ol className="relative mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <svg aria-hidden className="absolute top-8 left-[12%] hidden h-2 w-[76%] sm:block" preserveAspectRatio="none" viewBox="0 0 100 2">
              <line x1="0" y1="1" x2="100" y2="1" stroke="#c9943c" strokeWidth="0.6" strokeDasharray="2 2" className="animate-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
            </svg>
            {r.steps.map((s, i) => (
              <li key={s.title} className="relative flex flex-col items-center text-center" data-reveal style={{ "--d": i * 120 } as React.CSSProperties}>
                <span className="relative grid size-16 place-items-center rounded-full border border-gold-500/50 bg-white text-brand-700 shadow-md transition hover:bg-brand-700 hover:text-gold-400">
                  <Icon name={s.icon} className="size-6" />
                  <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-gold-500 text-[0.7rem] font-semibold text-white">{i + 1}</span>
                </span>
                <span className="mt-3 font-display text-lg text-brand-700">{s.title}</span>
                <span className="text-xs text-muted">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
