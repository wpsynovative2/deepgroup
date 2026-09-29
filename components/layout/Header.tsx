"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Logo } from "@/components/decor/Logo";
import { CtaButton } from "@/components/ui/CtaButton";
import { NavProjectsDropdown } from "./NavProjectsDropdown";
import { MobileNav } from "./MobileNav";
import type { NavCategory, StationOption } from "@/types";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; dropdown?: boolean; collapse?: boolean };
type Props = {
  nav: NavItem[];
  stations: StationOption[];
  categories: NavCategory[];
  phone: string;
  phoneHref: string;
};

export function Header({ nav, stations, categories, phone, phoneHref }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Project detail pages open on a dark photo, so the header starts solid there.
  const darkHero = /^\/projects\/(?!station\/|type\/)[^/]+$/.test(pathname);
  const solid = scrolled || darkHero;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const collapsed = nav.filter((n) => n.collapse);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "border-b border-line/80 bg-white/90 shadow-[0_8px_30px_-12px_rgba(51,3,15,.15)] backdrop-blur-xl" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className={cn("container-x flex items-center justify-between gap-6 transition-[height] duration-500", scrolled ? "h-[72px]" : "h-[88px]")}>
        <Link href="/" aria-label="Deep Group home" className="shrink-0">
          <Logo priority className={cn("w-auto transition-[height] duration-500", scrolled ? "h-12" : "h-16")} />
        </Link>

        <nav aria-label="Main" className="hidden items-center lg:flex">
          {nav.map((item) =>
            item.dropdown ? (
              <NavProjectsDropdown key={item.href} stations={stations} categories={categories} active={isActive(item.href)} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "min-h-11 items-center px-3 text-[0.93rem] whitespace-nowrap transition-colors hover:text-brand-700",
                  isActive(item.href) ? "text-brand-700" : "text-ink/80",
                  item.collapse ? "hidden xl:flex" : "flex",
                )}
              >
                <span className="link-draw" aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </span>
              </Link>
            ),
          )}
          {collapsed.length ? <MoreMenu items={collapsed} isActive={isActive} /> : null}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${phoneHref}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink/80 transition hover:text-brand-700 2xl:flex"
          >
            <Phone className="size-4 text-gold-500" aria-hidden /> {phone}
          </a>
          <CtaButton source="header" className="hidden sm:inline-flex" size="sm">
            Enquire now
          </CtaButton>
          <MobileNav nav={nav} stations={stations} categories={categories} isActivePath={pathname} />
        </div>
      </div>
    </header>
  );
}

/** Between 1024px and 1280px, Career and Channel partners move into "More". */
function MoreMenu({ items, isActive }: { items: NavItem[]; isActive: (h: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative xl:hidden"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-1 px-3 text-[0.93rem] text-ink/80 hover:text-brand-700"
      >
        More <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div className={cn("absolute top-full right-0 pt-3 transition-all", open ? "visible opacity-100" : "invisible -translate-y-1 opacity-0")}>
        <ul className="w-52 rounded-xl border border-line bg-white p-2 shadow-xl">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                onClick={() => setOpen(false)}
                className={cn("block rounded-lg px-3 py-2.5 text-sm hover:bg-brand-50 hover:text-brand-700", isActive(i.href) && "text-brand-700")}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
