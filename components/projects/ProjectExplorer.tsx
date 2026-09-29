"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import type { Category, ProjectSummary, StationOption, Status } from "@/types";
import {
  BUDGETS, POSSESSIONS, SORTS, applyFilters, countActive, getConfigOptions, getFacetCounts, parseFilters, serializeFilters,
  type FilterState,
} from "@/lib/data/filters";
import { ProjectCard } from "./ProjectCard";
import { useLeadModal } from "@/components/forms/LeadModalProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CAT_LABEL: Record<Category, string> = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" };
const STATUS_LABEL: Record<Status, string> = { upcoming: "Upcoming", ongoing: "Ongoing", completed: "Completed" };
const PAGE = 12;

type Props = {
  projects: ProjectSummary[];
  stations: StationOption[];
  /** On /projects/station/[s] and /projects/type/[c] the page's own filter is fixed and hidden. */
  lock?: { station?: string; category?: Category };
};

export function ProjectExplorer({ projects, stations, lock }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();
  const [limit, setLimit] = useState(PAGE);
  const sheet = useRef<HTMLDialogElement>(null);
  const { openLeadModal } = useLeadModal();

  const f = useMemo(() => parseFilters(new URLSearchParams(sp.toString())), [sp]);
  const lockStation = lock?.station;
  const lockCategory = lock?.category;
  const scoped = useMemo(
    () => projects.filter((p) => (!lockStation || p.station === lockStation) && (!lockCategory || p.category === lockCategory)),
    [projects, lockStation, lockCategory],
  );
  const results = useMemo(() => applyFilters(scoped, f), [scoped, f]);
  const facets = useMemo(() => getFacetCounts(scoped, f), [scoped, f]);
  const configOptions = useMemo(() => getConfigOptions(scoped, f), [scoped, f]);
  const active = countActive(f);

  const update = (next: FilterState) => {
    // Drop config chips that no longer apply after a category change (e.g. Industrial hides BHK).
    if (next.config?.length) {
      const allowed = getConfigOptions(scoped, next);
      next = { ...next, config: next.config.filter((c) => allowed.includes(c)) };
    }
    const qs = serializeFilters(next);
    setLimit(PAGE);
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  const toggle = <K extends "category" | "status" | "station" | "config">(key: K, value: string) => {
    const cur = (f[key] ?? []) as string[];
    update({ ...f, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] });
  };
  const clear = () => update({ sort: f.sort });

  const cats = (Object.keys(CAT_LABEL) as Category[]).filter((c) => scoped.some((p) => p.category === c));
  const statuses = (Object.keys(STATUS_LABEL) as Status[]).filter((s) => scoped.some((p) => p.status === s));
  const scopedStations = stations.filter((s) => scoped.some((p) => p.station === s.slug));

  const panel = (
    <div className="grid gap-6">
      <label className="relative block">
        <span className="sr-only">Search by project or locality</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          defaultValue={f.q ?? ""}
          placeholder="Search project or locality"
          onChange={(e) => update({ ...f, q: e.target.value || undefined })}
          className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-11 text-sm outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15"
        />
      </label>

      {!lock?.category && cats.length > 1 ? (
        <Group label="Property type">
          <Segmented>
            {cats.map((c) => (
              <Seg key={c} on={f.category?.includes(c)} count={facets.category[c] ?? 0} onClick={() => toggle("category", c)}>
                {CAT_LABEL[c]}
              </Seg>
            ))}
          </Segmented>
        </Group>
      ) : null}

      {statuses.length > 1 ? (
        <Group label="Status">
          <Segmented>
            {statuses.map((s) => (
              <Seg key={s} on={f.status?.includes(s)} count={facets.status[s] ?? 0} onClick={() => toggle("status", s)}>
                {STATUS_LABEL[s]}
              </Seg>
            ))}
          </Segmented>
        </Group>
      ) : null}

      {!lock?.station && scopedStations.length > 1 ? (
        <Group label="Station">
          <div className="flex flex-wrap gap-2">
            {scopedStations.map((s) => (
              <Chip key={s.slug} on={f.station?.includes(s.slug)} count={facets.station[s.slug] ?? 0} onClick={() => toggle("station", s.slug)}>
                {s.name}
              </Chip>
            ))}
          </div>
        </Group>
      ) : null}

      <Group label="Configuration">
        <div className="flex flex-wrap gap-2">
          {configOptions.map((c) => (
            <Chip key={c} on={f.config?.includes(c)} count={facets.config[c] ?? 0} onClick={() => toggle("config", c)}>
              {c}
            </Chip>
          ))}
        </div>
      </Group>

      <div className="grid gap-4 sm:grid-cols-2">
        <MiniSelect
          label="Budget"
          value={f.budget ?? ""}
          onChange={(v) => update({ ...f, budget: (v || undefined) as FilterState["budget"] })}
          options={BUDGETS.map((b) => ({ value: b.value, label: b.label, count: facets.budget[b.value] ?? 0 }))}
          placeholder="Any budget"
        />
        <MiniSelect
          label="Possession"
          value={f.possession ?? ""}
          onChange={(v) => update({ ...f, possession: v || undefined })}
          options={POSSESSIONS.map((x) => ({ value: x.value, label: x.label, count: facets.possession[x.value] ?? 0 }))}
          placeholder="Any time"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-gold-500" aria-hidden /> MahaRERA registered only
        </span>
        <input type="checkbox" role="switch" checked={Boolean(f.rera)} onChange={(e) => update({ ...f, rera: e.target.checked || undefined })} className="peer sr-only" />
        <span className="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
      </label>
    </div>
  );

  const chips: Array<{ label: string; remove: () => void }> = [
    ...(f.category ?? []).map((c) => ({ label: CAT_LABEL[c], remove: () => toggle("category", c) })),
    ...(f.status ?? []).map((s) => ({ label: STATUS_LABEL[s], remove: () => toggle("status", s) })),
    ...(f.station ?? []).map((s) => ({ label: stations.find((x) => x.slug === s)?.name ?? s, remove: () => toggle("station", s) })),
    ...(f.config ?? []).map((c) => ({ label: c, remove: () => toggle("config", c) })),
    ...(f.budget ? [{ label: BUDGETS.find((b) => b.value === f.budget)?.label ?? "", remove: () => update({ ...f, budget: undefined }) }] : []),
    ...(f.possession ? [{ label: `Possession: ${POSSESSIONS.find((x) => x.value === f.possession)?.label}`, remove: () => update({ ...f, possession: undefined }) }] : []),
    ...(f.rera ? [{ label: "RERA registered", remove: () => update({ ...f, rera: undefined }) }] : []),
    ...(f.q ? [{ label: `“${f.q}”`, remove: () => update({ ...f, q: undefined }) }] : []),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-28 rounded-3xl border border-line bg-cream p-6">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-display text-xl text-brand-700">Filters</p>
            {active ? (
              <button type="button" onClick={clear} className="text-sm text-gold-600 hover:underline">
                Clear all
              </button>
            ) : null}
          </div>
          {panel}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted" aria-live="polite">
            <span className="font-display text-2xl text-brand-700">{results.length}</span> {results.length === 1 ? "project" : "projects"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => sheet.current?.showModal()}
              className="flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden /> Filters{active ? ` (${active})` : ""}
            </button>
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={f.sort ?? "featured"}
                onChange={(e) => update({ ...f, sort: e.target.value as FilterState["sort"] })}
                className="min-h-11 cursor-pointer appearance-none rounded-full border border-line bg-white pr-10 pl-4 text-sm outline-none focus:border-gold-500"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            </label>
          </div>
        </div>

        {chips.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={c.remove}
                  className="flex items-center gap-1.5 rounded-full bg-brand-700 py-1.5 pr-2.5 pl-3.5 text-sm text-white transition hover:bg-brand-800"
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label} <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clear} className="px-2 py-1.5 text-sm text-gold-600 hover:underline">
                Clear filters
              </button>
            </li>
          </ul>
        ) : null}

        {results.length ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <div key={p.slug} hidden={i >= limit}>
                  <ProjectCard p={p} priority={i < 3} delay={(i % 3) * 80} />
                </div>
              ))}
            </div>
            {results.length > limit ? (
              <div className="mt-10 text-center">
                <Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>
                  Load more projects
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-gold-500/50 bg-cream px-6 py-16 text-center">
            <svg viewBox="0 0 120 80" className="h-20 text-gold-500" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 76h100M24 76V40a16 16 0 0 1 32 0v36M64 76V24a20 20 0 0 1 40 0v52" />
              <circle cx="84" cy="44" r="6" />
            </svg>
            <p className="mt-4 font-display text-2xl text-brand-700">No projects match these filters.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={clear}>
                Clear filters
              </Button>
              <Button
                onClick={() =>
                  openLeadModal({
                    source: `${pathname}#empty`,
                    title: "Tell us what you're looking for",
                    message: `Looking for: ${chips.map((c) => c.label).join(", ")}`,
                  })
                }
              >
                Tell us what you&apos;re looking for
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <dialog
        ref={sheet}
        aria-label="Filters"
        onClick={(e) => e.target === sheet.current && sheet.current?.close()}
        className="mx-0 mt-auto mb-0 max-h-[88dvh] w-full max-w-full rounded-t-3xl bg-cream p-0 lg:hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-cream px-5 py-4">
          <p className="font-display text-xl text-brand-700">Filters</p>
          <button type="button" onClick={() => sheet.current?.close()} className="grid size-11 place-items-center rounded-full hover:bg-white" aria-label="Close filters">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 py-5">{panel}</div>
        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-cream px-5 py-4">
          <Button variant="outline" onClick={clear} className="flex-1">
            Clear
          </Button>
          <Button onClick={() => sheet.current?.close()} className="flex-[2]">
            Show {results.length} {results.length === 1 ? "project" : "projects"}
          </Button>
        </div>
      </dialog>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-semibold tracking-wide text-gold-600">{label}</legend>
      {children}
    </fieldset>
  );
}

function Segmented({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 ring-1 ring-line">{children}</div>;
}

function Seg({ on, count, onClick, children }: { on?: boolean; count: number; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={Boolean(on)}
      disabled={!on && count === 0}
      onClick={onClick}
      className={cn(
        "min-h-10 flex-1 rounded-xl px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40",
        on ? "bg-brand-700 text-white shadow" : "text-ink hover:bg-brand-50",
      )}
    >
      {children} <span className={cn("text-xs", on ? "text-gold-200" : "text-muted")}>({count})</span>
    </button>
  );
}

function Chip({ on, count, onClick, children }: { on?: boolean; count: number; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={Boolean(on)}
      disabled={!on && count === 0}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-3.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40",
        on ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-ink hover:border-gold-500",
      )}
    >
      {children} <span className={cn("text-xs", on ? "text-gold-200" : "text-muted")}>{count}</span>
    </button>
  );
}

function MiniSelect({
  label, value, onChange, options, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string; count: number }>; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-semibold tracking-wide text-gold-600">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-white pr-9 pl-3 text-sm outline-none focus:border-gold-500"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.count === 0 && o.value !== value}>
              {o.label} ({o.count})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
      </span>
    </label>
  );
}
