import { Building2, CalendarDays, Check, ExternalLink, Handshake, Layers, QrCode, Ruler, ShieldCheck, Trees, Zap, Weight, MoveVertical, Store } from "lucide-react";
import type { Project } from "@/types";
import { getAmenity } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";
import { CtaButton } from "@/components/ui/CtaButton";
import { Accordion } from "@/components/ui/Accordion";
import { Ornament } from "@/components/decor/Ornament";
import { formatMonth, formatPrice, possessionLabel } from "@/lib/utils";

export function DetailHeading({ title, accent, id }: { title: string; accent?: string; id?: string }) {
  return (
    <div className="mb-8" data-reveal>
      <Ornament className="mb-3 text-gold-500" />
      <h2 id={id} className="text-3xl md:text-4xl">
        {title} {accent ? <span className="font-script text-[1.3em] font-normal text-gold-600">{accent}</span> : null}
      </h2>
    </div>
  );
}

export function ProjectOverview({ p }: { p: Project }) {
  const facts = [
    p.landParcelAcres && { icon: Trees, label: "Land parcel", value: `${p.landParcelAcres} acres` },
    p.towers && { icon: Building2, label: p.category === "residential" ? "Towers" : "Buildings", value: String(p.towers) },
    p.floors && { icon: Layers, label: "Floors", value: p.floors },
    { icon: CalendarDays, label: "Possession", value: possessionLabel(p.status, p.possession) },
    p.frontageFt && { icon: Store, label: "Shop frontage", value: `Up to ${p.frontageFt} ft` },
    p.ceilingHeightFt && { icon: MoveVertical, label: "Clear height", value: `${p.ceilingHeightFt} ft` },
    p.powerLoadKva && { icon: Zap, label: "Power load", value: `${p.powerLoadKva} kVA` },
    p.floorLoadKgSqm && { icon: Weight, label: "Floor load", value: `${p.floorLoadKgSqm.toLocaleString("en-IN")} kg/m²` },
    ...(p.rera?.length ? [{ icon: ShieldCheck, label: "MahaRERA", value: "Registered" }] : []),
    ...(p.redevelopmentOf ? [{ icon: Handshake, label: "Redevelopment of", value: p.redevelopmentOf }] : []),
  ].filter(Boolean) as Array<{ icon: typeof Trees; label: string; value: string }>;

  return (
    <section id="overview" className="scroll-mt-40">
      <DetailHeading title="Overview" />
      <p className="max-w-2xl font-display text-2xl leading-snug text-ink" data-reveal>
        {p.description ?? p.tagline}
      </p>
      <ul className="mt-6 flex flex-wrap gap-2" data-reveal>
        {p.highlights.map((h) => (
          <li key={h} className="flex items-center gap-1.5 rounded-full bg-gold-100 px-4 py-2 text-sm text-brand-700">
            <Check className="size-4 text-gold-600" aria-hidden /> {h}
          </li>
        ))}
      </ul>
      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {facts.map(({ icon: I, label, value }, i) => (
          <div
            key={label}
            data-reveal
            style={{ "--d": i * 60 } as React.CSSProperties}
            className="group rounded-2xl border border-line bg-white p-5 transition hover:border-gold-500 hover:shadow-lg hover:shadow-brand-900/5"
          >
            <I className="size-6 text-gold-500 transition group-hover:scale-110" strokeWidth={1.4} aria-hidden />
            <dt className="mt-3 text-xs text-muted">{label}</dt>
            <dd className="font-display text-xl text-brand-700">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ConfigurationTable({ p }: { p: Project }) {
  if (!p.units.length) return null;
  return (
    <section id="configurations" className="scroll-mt-40">
      <DetailHeading title="Configurations" />
      <div className="grid gap-4 sm:grid-cols-2">
        {p.units.map((u, i) => (
          <div
            key={u.label}
            data-reveal
            style={{ "--d": i * 100 } as React.CSSProperties}
            className="relative overflow-hidden rounded-2xl border border-line bg-cream p-6 transition hover:border-gold-500"
          >
            <Ruler aria-hidden className="absolute -right-4 -bottom-4 size-28 text-gold-500/10" strokeWidth={1} />
            <p className="font-display text-3xl text-brand-700">{u.label}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Carpet area</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {u.carpetAreaSqft
                    ? `${u.carpetAreaSqft[0].toLocaleString("en-IN")}–${u.carpetAreaSqft[1].toLocaleString("en-IN")} sq ft`
                    : "On request"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Price from</dt>
                <dd className="mt-0.5 font-medium text-ink">{u.priceFrom ? formatPrice(u.priceFrom) : "On request"}</dd>
              </div>
            </dl>
            <CtaButton project={p.name} unit={u.label} intent="cost-sheet" source={`/projects/${p.slug}#configurations`} variant="outline" size="sm" className="relative mt-5">
              Get cost sheet
            </CtaButton>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Specifications({ p }: { p: Project }) {
  if (!p.specifications.length) return null;
  return (
    <section id="specifications" className="scroll-mt-40">
      <DetailHeading title="Specifications" />
      <div className="grid gap-4 sm:grid-cols-2">
        {p.specifications.map((g, i) => (
          <div
            key={g.title}
            data-reveal
            style={{ "--d": (i % 2) * 100 } as React.CSSProperties}
            className="rounded-2xl border border-line bg-white p-6 transition hover:border-gold-500"
          >
            <p className="flex items-center gap-3 font-display text-xl text-brand-700">
              <span className="grid size-11 place-items-center rounded-full bg-brand-700 text-gold-400">
                <Icon name={g.icon} className="size-5" />
              </span>
              {g.title}
            </p>
            <ul className="mt-4 grid gap-2">
              {g.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden /> {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AmenitiesGrid({ p }: { p: Project }) {
  const items = p.amenities.map(getAmenity).filter(Boolean) as Array<{ id: string; label: string; icon: string }>;
  return (
    <section id="amenities" className="scroll-mt-40">
      <DetailHeading title="Amenities" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((a, i) => (
          <li
            key={a.id}
            data-reveal
            style={{ "--d": (i % 4) * 70 } as React.CSSProperties}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center transition hover:-translate-y-1 hover:border-gold-500"
          >
            <span className="grid size-14 place-items-center rounded-full bg-gold-100 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-gold-400">
              <Icon name={a.icon} className="size-6" />
            </span>
            <span className="text-sm text-ink">{a.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LocationConnectivity({ p, map }: { p: Project; map: React.ReactNode }) {
  return (
    <section id="location" className="scroll-mt-40">
      <DetailHeading title="Location &" accent="connectivity" />
      <div className={p.connectivity.length ? "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" : "grid max-w-3xl gap-6"}>
        {map}
        <ol className="relative grid content-start gap-3 empty:hidden" data-reveal="right">
          {p.connectivity.map((c) => (
            <li key={c.place} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                <Icon name={c.type} className="size-5" />
              </span>
              <span className="flex-1 text-sm text-ink">{c.place}</span>
              <span className="rounded-full bg-gold-100 px-3 py-1 text-sm font-medium text-gold-600">{c.distance}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 text-sm text-muted">
        {p.location.address}, {p.location.locality}, {p.location.city}
        {p.location.pincode ? ` ${p.location.pincode}` : ""}
      </p>
    </section>
  );
}

export function ConstructionUpdates({ p }: { p: Project }) {
  if (p.status !== "ongoing" || !p.constructionUpdates.length) return null;
  return (
    <section id="updates" className="scroll-mt-40">
      <DetailHeading title="Construction" accent="updates" />
      <ol className="relative ml-3 border-l-2 border-dashed border-gold-500/50">
        {p.constructionUpdates.map((u, i) => (
          <li key={u.date + u.title} className="relative pb-8 pl-8 last:pb-0" data-reveal style={{ "--d": i * 100 } as React.CSSProperties}>
            <span className="absolute top-1 -left-[9px] size-4 rounded-full border-4 border-white bg-gold-500 ring-1 ring-gold-500" />
            <p className="text-sm text-gold-600">{formatMonth(u.date)}</p>
            <p className="font-display text-xl text-brand-700">{u.title}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ReraBlock({ p }: { p: Project }) {
  return (
    <section id="rera" className="scroll-mt-40">
      <div className="grain relative overflow-hidden rounded-3xl bg-brand-700 p-8 text-white md:p-10" data-reveal>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-gold-400">
              <ShieldCheck className="size-5" aria-hidden /> MahaRERA
            </p>
            {p.rera?.length ? (
              <ul className="mt-3 grid gap-1">
                {p.rera.map((r) => (
                  <li key={r.number} className="font-display text-2xl">
                    {r.number} <span className="text-base text-white/60">· {r.phase}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 font-display text-2xl">Registration details on request</p>
            )}
            <a
              href="https://maharera.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold-200 underline-offset-4 hover:underline"
            >
              Verify on maharera.maharashtra.gov.in <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
          <div className="flex gap-3">
            {(p.rera?.length ? p.rera : [{ number: "", phase: "", qr: undefined }]).map((r, i) =>
              r.qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={r.qr} alt={`MahaRERA QR code for ${r.number}`} className="size-28 rounded-xl bg-white p-2" />
              ) : (
                <span key={i} className="grid size-28 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20" title="QR code to be added">
                  <QrCode className="size-14 text-white/50" strokeWidth={1} aria-hidden />
                </span>
              ),
            )}
          </div>
        </div>
        <p className="mt-6 border-t border-white/15 pt-4 text-xs text-white/60">
          Images are artist&apos;s impressions. Details are indicative and subject to change; refer to the agreement for sale.
        </p>
      </div>
    </section>
  );
}

export function ProjectFaq({ p }: { p: Project }) {
  if (!p.faqs.length) return null;
  return (
    <section id="faq" className="scroll-mt-40">
      <DetailHeading title="Questions," accent="answered" />
      <Accordion items={p.faqs} />
    </section>
  );
}
