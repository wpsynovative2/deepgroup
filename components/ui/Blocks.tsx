import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

type IconItem = { icon: string; title: string; text: string };

/** Grid of icon cards (the reference's "services" card style). */
export function IconCards({ items, cols = 3, tone = "light" }: { items: IconItem[]; cols?: 3 | 4 | 6; tone?: "light" | "cream" }) {
  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        cols === 3 && "lg:grid-cols-3",
        cols === 4 && "lg:grid-cols-4",
        cols === 6 && "lg:grid-cols-3 xl:grid-cols-6",
      )}
    >
      {items.map((it, i) => (
        <li
          key={it.title}
          data-reveal
          style={{ "--d": (i % 4) * 90 } as React.CSSProperties}
          className={cn(
            "group relative overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500 hover:shadow-[0_30px_60px_-35px_rgba(101,7,39,.45)]",
            tone === "cream" ? "border-white bg-white" : "border-line bg-cream",
          )}
        >
          <span aria-hidden className="absolute -top-10 -right-10 size-28 rounded-full bg-gold-100 transition-transform duration-700 group-hover:scale-[3.2]" />
          <span className="relative grid size-14 place-items-center rounded-2xl bg-brand-700 text-gold-400 shadow-lg shadow-brand-900/20 transition group-hover:rotate-6">
            <Icon name={it.icon} className="size-6" />
          </span>
          <h3 className="relative mt-5 text-xl">{it.title}</h3>
          <p className="relative mt-1.5 text-sm text-muted">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** A real sequence, so numbered steps with a connecting line. */
export function NumberedProcess({ steps, tone = "light" }: { steps: Array<{ title: string; text: string }>; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid gap-8 md:grid-cols-4 xl:grid-cols-7">
      <span aria-hidden className={cn("absolute top-7 right-[7%] left-[7%] hidden h-px border-t-2 border-dashed xl:block", dark ? "border-gold-400/40" : "border-gold-500/50")} />
      <span aria-hidden className={cn("absolute top-2 bottom-2 left-7 w-px border-l-2 border-dashed md:hidden", dark ? "border-gold-400/40" : "border-gold-500/50")} />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 xl:flex-col xl:items-center xl:text-center" data-reveal style={{ "--d": i * 110 } as React.CSSProperties}>
          <span
            className={cn(
              "relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 font-display text-xl transition duration-500 hover:scale-110",
              dark ? "border-gold-400 bg-brand-800 text-gold-400 hover:bg-gold-500 hover:text-brand-900" : "border-gold-500 bg-white text-brand-700 hover:bg-brand-700 hover:text-gold-400",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>
            <span className={cn("block font-display text-lg", dark ? "text-white" : "text-brand-700")}>{s.title}</span>
            <span className={cn("mt-0.5 block text-sm", dark ? "text-white/65" : "text-muted")}>{s.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Year timeline, alternating above/below the line on desktop. */
export function Timeline({ items }: { items: Array<{ year: string; title: string; text: string }> }) {
  return (
    <ol className="relative grid gap-6 md:grid-cols-3 lg:grid-cols-6">
      <span aria-hidden className="absolute top-[26px] right-0 left-0 hidden h-[2px] bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0 lg:block" />
      {items.map((m, i) => (
        <li key={m.year} className="relative" data-reveal style={{ "--d": i * 120 } as React.CSSProperties}>
          <span className="relative z-10 mx-auto flex h-[54px] w-fit items-center rounded-full border-2 border-gold-500 bg-brand-700 px-5 font-display text-xl text-gold-400 lg:mx-0">
            {m.year}
          </span>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur lg:text-left">
            <p className="font-display text-lg text-white">{m.title}</p>
            <p className="mt-1 text-sm text-white/65">{m.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
