import { FitImage } from "@/components/ui/FitImage";
import Link from "next/link";
import { ArrowRight, Quote, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCards, NumberedProcess } from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Wave } from "@/components/decor/Wave";
import { LeafSprig } from "@/components/decor/Botanical";
import { RedevEnquiryForm } from "@/components/redevelopment/RedevEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqs, getPage, getPageSeo, getSite } from "@/lib/data/content";
import { getActiveStations } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqLd, graph } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({ ...getPageSeo("/redevelopment"), path: "/redevelopment" });

export default function RedevelopmentPage() {
  const r = getPage("redevelopment");
  const faqs = getFaqs("redevelopment");
  const site = getSite();

  return (
    <>
      <JsonLd data={graph(faqLd(faqs))} />
      <PageHero
        title={r.hero.title}
        accent={r.hero.titleAccent}
        subtitle={r.hero.subtitle}
        crumbs={[{ name: "Redevelopment", href: "/redevelopment" }]}
        image={{ src: "/images/redevelopment/tower.jpg", alt: "" }}
      >
        <ButtonLink href="#feasibility" size="lg">
          {r.hero.cta} <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </PageHero>

      {/* What members receive */}
      <section className="relative z-10 -mt-10 bg-transparent">
        <div className="container-x">
          <dl className="grid grid-cols-2 overflow-hidden rounded-3xl bg-brand-700 text-white shadow-2xl shadow-brand-900/25 lg:grid-cols-4">
            {r.receive.map((x, i) => (
              <div key={x.label} className="border-white/10 p-6 text-center odd:border-r lg:border-r lg:last:border-r-0 md:p-8" data-reveal style={{ "--d": i * 100 } as React.CSSProperties}>
                <dd className="font-display text-2xl text-gold-400 md:text-3xl">{x.value}</dd>
                <dt className="mt-1 text-sm text-white/70">{x.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Why" accent="redevelop?" subtitle="What your society gains." />
          <div className="mt-12">
            <IconCards items={r.benefits} />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="grain relative overflow-hidden bg-brand-700 py-24 md:py-32">
        <Wave position="top" className="text-white" />
        <LeafSprig className="absolute bottom-10 -left-6 h-72 w-44 text-gold-400/20" />
        <div className="container-x">
          <SectionHeading tone="dark" title="The" accent="process" subtitle={r.processNote} />
          <div className="mt-16">
            <NumberedProcess steps={r.process} tone="dark" />
          </div>
        </div>
        <Wave position="bottom" className="text-cream" />
      </section>

      {/* Transparency */}
      <section className="section-y grain bg-cream">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="relative" data-reveal="left">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden arch shadow-2xl">
              <FitImage src="/images/projects/deep-crown/cover.jpg" alt="Deep Crown, the redevelopment of Sai Nidhi CHS" sizes="448px" />
            </div>
            <figure className="absolute right-0 bottom-6 max-w-xs rounded-3xl bg-white p-6 shadow-2xl md:-right-6">
              <Quote className="size-8 fill-gold-100 text-gold-500" strokeWidth={1} aria-hidden />
              <blockquote className="mt-2 font-display text-lg leading-snug text-ink">Aapke sapno ka sahi address.</blockquote>
              <figcaption className="mt-3 text-sm text-muted">
                <span className="font-medium text-brand-700">Deep Crown</span> · Sai Nidhi CHS Ltd.
              </figcaption>
            </figure>
          </div>
          <div>
            <SectionHeading align="left" title="Complete" accent="transparency" />
            <ul className="mt-8 grid gap-4">
              {r.transparency.map((t, i) => (
                <li key={t.title} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm" data-reveal style={{ "--d": i * 100 } as React.CSSProperties}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-gold-400">
                    <Icon name={t.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display text-xl text-brand-700">{t.title}</span>
                    <span className="text-sm text-muted">{t.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Completed & ongoing */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Societies we're" accent="rebuilding" />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {r.completed.map((c, i) => (
              <li key={c.name} className="group relative overflow-hidden rounded-3xl border border-line bg-white transition hover:border-gold-500" data-reveal style={{ "--d": i * 120 } as React.CSSProperties}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <FitImage src={c.image} alt={`${c.name}, ${c.location}`} sizes="(min-width: 768px) 33vw, 100vw" className="transition duration-1000 group-hover:scale-105" />
                  <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${c.status === "Completed" ? "bg-white text-ink" : "bg-gold-100 text-gold-600"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <span>
                    <Link href={`/projects/${c.slug}`} className="block font-display text-xl text-brand-700 after:absolute after:inset-0">
                      {c.name}
                    </Link>
                    <span className="text-sm text-muted">{c.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-sm text-brand-700">
                    <Users className="size-4 text-gold-500" aria-hidden /> {c.society}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ + form */}
      <section id="feasibility" className="section-y grain bg-sand">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading align="left" title="Common" accent="questions" />
            <Accordion items={faqs} className="mt-8" />
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] sm:p-10" data-reveal="right">
            <p className="font-script text-3xl text-gold-600">Let&apos;s meet</p>
            <h2 className="text-3xl">Request a feasibility meeting</h2>
            <p className="mt-1 mb-8 text-sm text-muted">
              Or call us on <a href={`tel:${site.phoneHref}`} className="font-medium text-brand-700">{site.phone}</a>
            </p>
            <RedevEnquiryForm stations={getActiveStations().map((s) => s.name)} />
          </div>
        </div>
      </section>
    </>
  );
}
