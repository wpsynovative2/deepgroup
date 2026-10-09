import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getNavigation, getSite } from "@/lib/data/content";
import { getActiveStations } from "@/lib/data/stations";
import { getNavCategories } from "@/lib/data/projects";
import { Logo } from "@/components/decor/Logo";
import { SocialIcon } from "@/components/decor/SocialIcons";
import { LeafSprig } from "@/components/decor/Botanical";
import { CtaButton } from "@/components/ui/CtaButton";

const CAT_LABEL = { residential: "Residential", commercial: "Commercial", industrial: "Industrial" } as const;

export function Footer() {
  const site = getSite();
  const nav = getNavigation();
  const stations = getActiveStations();
  const categories = getNavCategories();

  return (
    <footer className="grain relative overflow-hidden bg-brand-800 pt-24 pb-28 text-white/75 lg:pb-10">
      {/* scalloped arch edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-3 bg-[radial-gradient(circle_at_12px_0,#fff_12px,transparent_12.5px)] bg-[length:24px_12px] bg-repeat-x"
      />
      <LeafSprig className="absolute -right-6 bottom-10 h-72 w-44 rotate-12 text-gold-500/20" />

      <div className="container-x relative">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 md:flex-row md:items-center">
          <p className="max-w-xl font-display text-3xl leading-tight text-white md:text-4xl">
            Let&apos;s build something <span className="font-script text-[1.3em] text-gold-400">lasting</span>
          </p>
          <CtaButton source="footer" variant="light" size="lg">
            Enquire now
          </CtaButton>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
          <div>
            <Logo plate className="h-24" />
            <p className="mt-5 max-w-xs text-sm">
              {site.tagline}. {site.yearsOfSuccess} years of experience building homes and industrial hubs along the Western line.
            </p>
            <div className="mt-6 flex gap-2">
              {Object.entries(site.social).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500 hover:text-brand-900"
                >
                  <SocialIcon name={name} className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Projects">
            {stations.map((s) => (
              <FooterLink key={s.slug} href={`/projects/station/${s.slug}`}>
                Projects in {s.name}
              </FooterLink>
            ))}
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/projects/type/${c.slug}`}>
                {CAT_LABEL[c.slug]}
                {c.comingSoon ? <span className="ml-1 rounded-full bg-gold-500/20 px-2 text-[0.65rem] text-gold-200">Soon</span> : null}
              </FooterLink>
            ))}
          </FooterCol>

          {nav.footer.map((g) => (
            <FooterCol key={g.title} title={g.title}>
              {g.links.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterCol>
          ))}

          <FooterCol title="Visit us">
            <li className="flex gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden />
              <a href={site.headOffice.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {site.offices[0]?.address}
              </a>
            </li>
            <li className="flex gap-3 text-sm">
              <Phone className="size-4 shrink-0 text-gold-400" aria-hidden />
              <a href={`tel:${site.phoneHref}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex gap-3 text-sm">
              <Mail className="size-4 shrink-0 text-gold-400" aria-hidden />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
            <li className="flex gap-3 text-sm">
              <Clock className="size-4 shrink-0 text-gold-400" aria-hidden />
              {site.hours}
            </li>
          </FooterCol>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>
            All projects are registered under MahaRERA. Visuals are artist&apos;s impressions.{" "}
            <Link href="/disclaimer" className="underline hover:text-white">Disclaimer</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 font-display text-lg text-gold-400">{title}</p>
      <ul className="grid gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group inline-flex items-center gap-2 text-sm transition hover:text-white">
        <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-3" />
        {children}
      </Link>
    </li>
  );
}
