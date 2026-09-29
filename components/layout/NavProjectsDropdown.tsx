"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ChevronDown, Factory, House, Store, TrainFront } from "lucide-react";
import type { NavCategory, StationOption } from "@/types";
import { cn } from "@/lib/utils";

const CAT_ICON = { residential: House, commercial: Store, industrial: Factory } as const;
const CAT_LABEL = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" } as const;

type Props = {
  stations: StationOption[];
  categories: NavCategory[];
  active: boolean;
};

export function NavProjectsDropdown({ stations, categories, active }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a[data-item]") ?? []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      btn.current?.focus();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      requestAnimationFrame(() => {
        const list = items();
        const i = list.indexOf(document.activeElement as HTMLAnchorElement);
        const next = e.key === "ArrowDown" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        list[i === -1 ? 0 : next]?.focus();
      });
    }
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon} onKeyDown={onKeyDown}>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-11 items-center gap-1 px-3 text-[0.93rem] whitespace-nowrap transition-colors hover:text-brand-700",
          active ? "text-brand-700" : "text-ink/80",
        )}
      >
        <span className={cn("link-draw", active && "[background-size:100%_1px]")}>Projects</span>
        <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>

      <div
        ref={panel}
        id={id}
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
        className={cn(
          "absolute top-full left-1/2 w-[680px] -translate-x-1/2 pt-3 transition-all duration-300",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="grid grid-cols-[1fr_1fr_200px] gap-2 overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-2xl shadow-brand-900/10">
          <div className="p-3">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gold-600">By station</p>
            <ul>
              {stations.map((s) => (
                <li key={s.slug}>
                  <Link
                    data-item
                    href={`/projects/station/${s.slug}`}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-brand-50 hover:text-brand-700 focus:bg-brand-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <TrainFront className="size-4 text-gold-500" aria-hidden /> {s.name}
                    </span>
                    <span className="rounded-full bg-surface px-2 text-xs text-muted group-hover:bg-white">{s.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l border-line p-3">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gold-600">By type</p>
            <ul>
              {categories.map((c) => {
                const I = CAT_ICON[c.slug];
                return (
                  <li key={c.slug}>
                    <Link
                      data-item
                      href={`/projects/type/${c.slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink transition hover:bg-brand-50 hover:text-brand-700 focus:bg-brand-50"
                    >
                      <span className="flex items-center gap-2.5">
                        <I className="size-4 text-gold-500" aria-hidden /> {CAT_LABEL[c.slug]}
                      </span>
                      {c.comingSoon ? (
                        <span className="rounded-full bg-gold-100 px-2 text-[0.65rem] font-semibold text-gold-600">Soon</span>
                      ) : (
                        <span className="rounded-full bg-surface px-2 text-xs text-muted group-hover:bg-white">{c.count}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <Link
            data-item
            href="/projects"
            className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-xl p-4 text-white"
          >
            <Image src="/images/projects/deep-sky/cover.jpg" alt="" fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-transparent" />
            <span className="relative font-display text-lg">View all projects</span>
            <span className="relative mt-1 flex items-center gap-1 text-xs text-gold-200">
              Explore <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
