import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getPage } from "@/lib/data/content";
import { getNavCategories } from "@/lib/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Wave } from "@/components/decor/Wave";
import { Blob, LeafSprig } from "@/components/decor/Botanical";
import { cn } from "@/lib/utils";

const COVERS: Record<string, string> = {
  residential: "/images/projects/deep-sky/cover.jpg",
  commercial: "/images/categories/commercial.jpg",
  industrial: "/images/projects/sky-industrial-hub/cover.jpg",
};

export function CategoryTiles() {
  const { categories } = getPage("home");
  const items = getNavCategories();

  return (
    <section className="grain relative overflow-hidden bg-sand section-y">
      <Wave position="top" className="text-white" />
      <Blob className="absolute -right-24 bottom-0 hidden w-[420px] text-brand-700/90 md:block" />
      <div aria-hidden className="absolute right-24 bottom-32 hidden size-24 text-white/50 dot-grid lg:block" />
      <LeafSprig className="absolute bottom-6 -left-4 h-72 w-44 text-gold-600/40" />

      <div className="container-x relative">
        <SectionHeading title={categories.title} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((c, i) => (
            <Link
              key={c.slug}
              href={`/projects/type/${c.slug}`}
              data-reveal
              style={{ "--d": i * 120 } as React.CSSProperties}
              className="group relative isolate flex min-h-[340px] flex-col items-center overflow-hidden rounded-[1.75rem] border border-white bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(51,3,15,.35)] transition-all duration-500 hover:-translate-y-2"
            >
              {/* image reveals on hover */}
              <Image
                src={COVERS[c.slug]!}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="-z-10 scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900/95 via-brand-800/70 to-brand-700/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {c.comingSoon ? (
                <span className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-600">
                  <Clock className="size-3.5" aria-hidden /> Coming soon
                </span>
              ) : null}

              <span
                className={cn(
                  "relative grid size-20 place-items-center rounded-full ring-8 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-white group-hover:ring-white/10",
                  c.comingSoon ? "bg-surface text-muted ring-surface/60" : "bg-gold-100 text-brand-700 ring-gold-50",
                )}
              >
                <Icon name={c.icon} className="size-8" />
              </span>
              <h3 className="mt-6 text-2xl transition-colors group-hover:text-white">{c.title}</h3>
              <p className="mt-2 text-muted transition-colors group-hover:text-white/80">{c.blurb}</p>
              <p className="mt-4 text-sm font-medium text-gold-600 transition-colors group-hover:text-gold-200">
                {c.comingSoon ? "Register your interest" : `${c.count} ${c.count === 1 ? "project" : "projects"}`}
              </p>
              <span className="mt-auto grid size-11 place-items-center rounded-full border border-brand-700/20 text-brand-700 transition-all duration-500 group-hover:w-32 group-hover:border-white/40 group-hover:text-white">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Wave position="bottom" variant={2} className="text-white" />
    </section>
  );
}
