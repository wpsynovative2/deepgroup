import { Plus } from "lucide-react";
import { cn, slugify } from "@/lib/utils";

/** Native <details> accordion: keyboard-accessible with no JS. */
export function Accordion({ items, className }: { items: Array<{ q: string; a: string }>; className?: string }) {
  // One exclusive group per accordion, so two accordions on a page don't close each other.
  const group = `acc-${slugify(items[0]?.q ?? "faq").slice(0, 40)}`;
  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white", className)}>
      {items.map((it, i) => (
        <details key={it.q} className="group" name={group} open={i === 0}>
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 px-5 py-4 text-left font-medium text-ink transition-colors hover:text-brand-700 md:px-7">
            {it.q}
            <span className="acc-icon grid size-8 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600 transition-transform duration-300 group-open:bg-brand-700 group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="px-5 pb-5 text-muted md:px-7">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
