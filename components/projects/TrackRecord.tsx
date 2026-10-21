import { Building, CheckCircle2, Clock, Factory } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Item = { name: string; locality?: string; type: "residential" | "industrial"; status?: "ongoing" };

/** Name-only list of projects from data/legacy.json, shown under the project grid on station and category pages. */
export function TrackRecord({ title, accent, items }: { title: string; accent: string; items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="section-y !pt-6 bg-white">
      <div className="container-x">
        <SectionHeading title={title} accent={accent} />
        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const I = p.type === "industrial" ? Factory : Building;
            return (
              <li
                key={p.name}
                className="flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 transition hover:border-gold-500"
                data-reveal
                style={{ "--d": (i % 6) * 60 } as React.CSSProperties}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-100 text-brand-700">
                  <I className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg leading-tight text-brand-700">{p.name}</span>
                  {p.locality ? <span className="mt-0.5 block text-xs text-muted">{p.locality}</span> : null}
                  <span className="mt-1.5 flex items-center gap-1 text-[0.7rem] text-gold-600">
                    {p.status === "ongoing" ? (
                      <>
                        <Clock className="size-3" aria-hidden /> Ongoing
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3" aria-hidden /> Completed
                      </>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
