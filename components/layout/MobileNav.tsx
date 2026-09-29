"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { NavCategory, StationOption } from "@/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/decor/Logo";

const CAT_LABEL = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" } as const;

type Props = {
  nav: Array<{ label: string; href: string; dropdown?: boolean }>;
  stations: StationOption[];
  categories: NavCategory[];
  isActivePath: string;
};

export function MobileNav({ nav, stations, categories, isActivePath }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);

  // Close drawer on navigation.
  useEffect(() => {
    ref.current?.close();
  }, [isActivePath]);

  const linkCls = "flex min-h-12 items-center justify-between border-b border-line py-3 font-display text-xl text-brand-700";

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="grid size-11 place-items-center rounded-full border border-line bg-white/80 text-brand-700 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(420px,100%)] max-w-full bg-white p-0 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Logo className="h-12" />
            <button type="button" onClick={() => ref.current?.close()} className="grid size-11 place-items-center rounded-full hover:bg-brand-50" aria-label="Close menu">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            {nav.map((item) =>
              item.dropdown ? (
                <div key={item.href} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={projectsOpen}
                    onClick={() => setProjectsOpen((o) => !o)}
                    className="flex min-h-12 w-full items-center justify-between py-3 font-display text-xl text-brand-700"
                  >
                    {item.label}
                    <ChevronDown className={cn("size-5 text-gold-500 transition-transform", projectsOpen && "rotate-180")} aria-hidden />
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-300", projectsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="mt-1 text-xs font-semibold text-gold-600">By station</p>
                      {stations.map((s) => (
                        <Link key={s.slug} href={`/projects/station/${s.slug}`} className="flex min-h-11 items-center justify-between text-ink">
                          {s.name} <span className="text-sm text-muted">{s.count}</span>
                        </Link>
                      ))}
                      <p className="mt-3 text-xs font-semibold text-gold-600">By type</p>
                      {categories.map((c) => (
                        <Link key={c.slug} href={`/projects/type/${c.slug}`} className="flex min-h-11 items-center justify-between text-ink">
                          {CAT_LABEL[c.slug]} <span className="text-sm text-muted">{c.comingSoon ? "Coming soon" : c.count}</span>
                        </Link>
                      ))}
                      <Link href="/projects" className="mb-4 flex min-h-11 items-center font-medium text-brand-700">
                        View all projects →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </dialog>
    </>
  );
}
