import { CheckCircle2, Factory, Building } from "lucide-react";
import { getLegacy, getPage } from "@/lib/data/content";
import { CountUp } from "@/components/decor/CountUp";
import { Ornament } from "@/components/decor/Ornament";
import { Wave } from "@/components/decor/Wave";
import { LeafSprig } from "@/components/decor/Botanical";

/** Delivered projects from the brochures' "Deep Group of success" pages. */
export function Legacy({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { legacy } = getPage("home");
  const items = getLegacy();
  const industrial = items.filter((i) => i.type === "industrial").length;
  const dark = tone === "dark";

  return (
    <section className={dark ? "grain relative overflow-hidden bg-brand-800 py-24 text-white md:py-32" : "section-y relative overflow-hidden bg-white"}>
      {dark ? <Wave position="top" className="text-cream" /> : null}
      <LeafSprig className={dark ? "absolute -right-6 bottom-10 h-72 w-44 rotate-12 text-gold-400/20" : "absolute -right-6 bottom-10 h-72 w-44 rotate-12 text-gold-500/25"} />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-32" data-reveal="left">
          <Ornament className={dark ? "mb-4 text-gold-400" : "mb-4 text-gold-500"} />
          <h2 className={dark ? "text-[2rem] leading-[1.1] text-white md:text-[2.75rem]" : "text-[2rem] leading-[1.1] md:text-[2.75rem]"}>
            {legacy.title} <span className={dark ? "font-script text-[1.35em] font-normal text-gold-400" : "font-script text-[1.35em] font-normal text-gold-600"}>{legacy.titleAccent}</span>
          </h2>
          <p className={dark ? "mt-4 text-lg text-white/70" : "mt-4 text-lg text-muted"}>{legacy.subtitle}</p>
          <dl className="mt-8 flex gap-4">
            {[
              { value: items.length - industrial, label: "Residential" },
              { value: industrial, label: "Industrial hubs" },
            ].map((s) => (
              <div key={s.label} className={dark ? "rounded-2xl border border-white/15 bg-white/5 px-5 py-4" : "rounded-2xl border border-line bg-cream px-5 py-4"}>
                <dd className={dark ? "font-display text-4xl text-gold-400" : "font-display text-4xl text-brand-700"}>
                  <CountUp value={s.value} />
                </dd>
                <dt className={dark ? "text-sm text-white/60" : "text-sm text-muted"}>{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p, i) => {
            const I = p.type === "industrial" ? Factory : Building;
            return (
              <li
                key={p.name}
                data-reveal
                style={{ "--d": (i % 3) * 70 } as React.CSSProperties}
                className={
                  dark
                    ? "group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold-400/60 hover:bg-white/[0.08]"
                    : "group flex items-start gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-gold-500"
                }
              >
                <span className={dark ? "grid size-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-400" : "grid size-10 shrink-0 place-items-center rounded-xl bg-gold-100 text-brand-700"}>
                  <I className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={dark ? "block font-display text-lg leading-tight text-white" : "block font-display text-lg leading-tight text-brand-700"}>{p.name}</span>
                  <span className={dark ? "mt-0.5 block text-xs text-white/55" : "mt-0.5 block text-xs text-muted"}>{p.locality}</span>
                  <span className={dark ? "mt-1.5 flex items-center gap-1 text-[0.7rem] text-gold-200" : "mt-1.5 flex items-center gap-1 text-[0.7rem] text-gold-600"}>
                    <CheckCircle2 className="size-3" aria-hidden /> Completed
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {dark ? <Wave position="bottom" className="text-cream" /> : null}
    </section>
  );
}
