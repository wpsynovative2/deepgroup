import { FitImage } from "@/components/ui/FitImage";
import { ArrowRight } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/decor/CountUp";
import { LeafSprig } from "@/components/decor/Botanical";
import { Ornament } from "@/components/decor/Ornament";

export function AboutTeaser() {
  const { about, stats } = getPage("home");
  return (
    <section className="section-y relative overflow-hidden bg-white">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Visual: arch photo, offset second photo, years badge */}
        <div className="relative mx-auto w-full max-w-[520px]" data-reveal="left">
          <div aria-hidden className="absolute -top-6 -left-6 size-40 text-gold-500/40 dot-grid" />
          <LeafSprig className="absolute -bottom-10 -left-14 z-10 h-56 w-36 -rotate-12 text-brand-700/40" />
          <div className="relative ml-auto aspect-[4/5] w-[78%] overflow-hidden arch shadow-2xl shadow-brand-900/15">
            <FitImage src="/images/about/towers-portrait.jpg" alt="Deep Group towers rising above the pool deck" sizes="(min-width: 1024px) 400px, 78vw" />
          </div>
          <div className="absolute bottom-10 left-0 aspect-square w-[42%] overflow-hidden rounded-[1.5rem] border-[6px] border-white shadow-xl">
            <FitImage src="/images/projects/ankur-grandeur/cover.jpg" alt="Ankur Grandeur tower, Nalasopara East" sizes="220px" />
          </div>
          <div className="absolute top-10 left-[8%] rounded-2xl bg-brand-700 px-5 py-4 text-center text-white shadow-xl shadow-brand-900/30">
            <p className="font-display text-4xl leading-none text-gold-400">{about.yearsBadge}</p>
            <p className="mt-1 text-xs tracking-wide text-white/80">Years of trust</p>
          </div>
        </div>

        <div>
          <div data-reveal>
            <Ornament className="mb-4 text-gold-500" />
            <h2 className="text-[2rem] leading-[1.1] md:text-[2.75rem]">
              {about.title} <span className="font-script text-[1.35em] font-normal text-gold-600">{about.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-muted">{about.body}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {about.points.map((pt, i) => (
              <li
                key={pt.label}
                data-reveal
                style={{ "--d": i * 90 } as React.CSSProperties}
                className="group flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:border-gold-500 hover:bg-cream"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-600 transition group-hover:bg-brand-700 group-hover:text-gold-400">
                  <Icon name={pt.icon} className="size-5" />
                </span>
                <span className="text-sm font-medium text-ink">{pt.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-6" data-reveal>
            <ButtonLink href="/about-us" variant="outline" className="whitespace-nowrap">
              About Deep Group <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <span className="hidden font-script text-3xl text-gold-600 sm:inline">Deep Group</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-x mt-20">
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-cream lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--d": i * 100 } as React.CSSProperties}
              className="relative flex flex-col items-center justify-center gap-1 border-line px-4 py-8 text-center odd:border-r lg:border-r lg:last:border-r-0 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0"
            >
              <dd className="font-display text-4xl text-brand-700 md:text-5xl">
                <CountUp value={s.value} decimals={(s as { decimals?: number }).decimals ?? 0} suffix={s.suffix} />
              </dd>
              <dt className="text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
