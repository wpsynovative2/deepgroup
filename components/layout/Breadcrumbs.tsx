import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, graph } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils";

type Crumb = { name: string; href: string };

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(all))} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className={cn("flex flex-wrap items-center gap-1.5", tone === "light" ? "text-white/70" : "text-muted")}>
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="size-3.5 opacity-60" aria-hidden /> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "light" ? "text-gold-200" : "text-brand-700"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="transition hover:text-gold-500">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
