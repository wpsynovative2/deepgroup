import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { LazyMap } from "@/components/projects/detail/LazyMap";
import { WhatsAppIcon } from "@/components/decor/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getPageSeo, getSite } from "@/lib/data/content";
import { getAllProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { graph, localBusinessLd } from "@/lib/seo/jsonld";
import { mapEmbedSrc, siteUrl } from "@/lib/utils";

export const metadata = buildMetadata({ ...getPageSeo("/contact-us"), path: "/contact-us" });

export default function ContactPage() {
  const c = getPage("contact");
  const site = getSite();
  const channels = [
    { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phoneHref}` },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with sales", href: `https://wa.me/${site.whatsapp}` },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Hours", value: site.hours },
  ];

  return (
    <>
      <JsonLd data={graph({ "@type": "ContactPage", url: siteUrl("/contact-us") }, localBusinessLd(site))} />
      <PageHero
        title={c.hero.title}
        accent={c.hero.titleAccent}
        subtitle={c.hero.subtitle}
        crumbs={[{ name: "Contact us", href: "/contact-us" }]}
        aside={
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {channels.map(({ icon: I, label, value, href }, i) => {
              const inner = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-700 text-gold-400 transition group-hover:scale-110">
                    <I className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="font-display text-lg text-brand-700">{value}</span>
                  </span>
                </>
              );
              const cls = "group flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-gold-500";
              return (
                <li key={label} className="hero-rise" style={{ "--d": 200 + i * 100 } as React.CSSProperties}>
                  {href ? (
                    <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        }
      />

      <section className="section-y bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] sm:p-10" data-reveal="left">
            <h2 className="mb-8 text-3xl md:text-4xl">{c.formTitle}</h2>
            <LeadForm projects={getAllProjects().map((p) => p.name)} intent="enquiry" submitLabel="Send message" />
          </div>
          <div className="grid content-start gap-4" data-reveal="right">
            {site.offices.map((o) => (
              <div key={o.label} className="rounded-3xl bg-cream p-6">
                <p className="flex items-center gap-2 font-display text-xl text-brand-700">
                  <MapPin className="size-5 text-gold-500" aria-hidden /> {o.label}
                </p>
                <p className="mt-2 text-sm text-muted">{o.address}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-700 hover:text-white">
                    <Phone className="size-3.5" aria-hidden /> {o.phone}
                  </a>
                  <a href={o.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-700 hover:text-white">
                    <Navigation className="size-3.5" aria-hidden /> Directions
                  </a>
                </div>
              </div>
            ))}
            <LazyMap
              src={mapEmbedSrc({ mapQuery: `${site.headOffice.address.streetAddress}, ${site.headOffice.address.addressLocality} ${site.headOffice.address.postalCode}` })}
              label={site.headOffice.label}
            />
          </div>
        </div>
      </section>
    </>
  );
}
