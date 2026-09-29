import { ChevronDown, Building, MapPin, Search, Timer } from "lucide-react";
import type { StationOption } from "@/types";

const CAT_LABEL: Record<string, string> = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" };

/** A plain GET form to /projects: works without JavaScript and produces shareable filter URLs. */
export function QuickFinder({ stations, categories }: { stations: StationOption[]; categories: Array<{ slug: string; count: number }> }) {
  const selects = [
    { name: "category", label: "Property type", icon: Building, placeholder: "All types", options: categories.map((c) => ({ value: c.slug, label: CAT_LABEL[c.slug] ?? c.slug })) },
    { name: "station", label: "Nearest station", icon: MapPin, placeholder: "All stations", options: stations.map((s) => ({ value: s.slug, label: s.name })) },
    {
      name: "status",
      label: "Status",
      icon: Timer,
      placeholder: "Any status",
      options: [
        { value: "ongoing", label: "Ongoing" },
        { value: "upcoming", label: "Upcoming" },
        { value: "completed", label: "Ready to move" },
      ],
    },
  ];

  return (
    <div className="container-x relative z-10 -mt-14 md:-mt-16">
      <form
        action="/projects"
        method="get"
        className="hero-rise mx-auto grid max-w-5xl gap-2 rounded-3xl bg-white p-3 shadow-[0_30px_80px_-30px_rgba(51,3,15,.35)] ring-1 ring-line md:grid-cols-[1fr_1fr_1fr_auto] md:rounded-full md:p-2.5"
        style={{ "--d": 500 } as React.CSSProperties}
        aria-label="Find a project"
      >
        {selects.map(({ name, label, icon: I, placeholder, options }, i) => (
          <label
            key={name}
            className={`relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-4 transition hover:bg-cream md:rounded-full md:px-5 ${i > 0 ? "md:border-l md:border-line" : ""}`}
          >
            <I className="size-5 shrink-0 text-gold-500" aria-hidden />
            <span className="flex flex-1 flex-col">
              <span className="text-[0.7rem] font-semibold tracking-wide text-muted">{label}</span>
              <select name={name} defaultValue="" className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[0.95rem] text-ink outline-none">
                <option value="">{placeholder}</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </span>
            <ChevronDown className="pointer-events-none absolute right-4 size-4 text-muted" aria-hidden />
          </label>
        ))}
        <button
          type="submit"
          className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-700 px-7 font-medium text-white transition hover:bg-brand-800 md:rounded-full"
        >
          <Search className="size-4 transition-transform group-hover:scale-110" aria-hidden /> Search
        </button>
      </form>
    </div>
  );
}
