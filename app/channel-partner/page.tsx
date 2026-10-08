import { ArrowRight, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCards, NumberedProcess } from "@/components/ui/Blocks";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Wave } from "@/components/decor/Wave";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CpRegistrationForm } from "@/components/channel-partner/CpRegistrationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getPageSeo, getSite } from "@/lib/data/content";
import { getAllProjects, toSummary } from "@/lib/data/projects";
import { getActiveStations } from "@/lib/data/stations";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqLd, graph } from "@/lib/seo/jsonld";
import { siteUrl } from "@/lib/utils";

export const metadata = buildMetadata({ ...getPageSeo("/channel-partner"), path: "/channel-partner" });

export default function ChannelPartnerPage() {
  const cp = getPage("channel-partner");
  const site = getSite();
  const projects = getAllProjects().filter((p) => p.cpEligible !== false).map(toSummary);

  return (
    <>
      <JsonLd data={graph({ "@type": "WebPage", url: siteUrl("/channel-partner"), name: "Channel Partner Programme", about: { "@id": siteUrl("/#organization") } }, faqLd(cp.faqs))} />
      <PageHero
        title={cp.hero.title}
        accent={cp.hero.titleAccent}
        subtitle={cp.hero.subtitle}
        crumbs={[{ name: "Channel partners", href: "/channel-partner" }]}
        image={{ src: "/images/projects/deep-sky/towers-sunset.jpg", alt: "", fill: true }}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#register" size="lg">
            {cp.hero.cta} <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <a href={`tel:${site.cpDesk.phoneHref}`} className={buttonClasses("accent", "lg")}>
            <Phone className="size-4" aria-hidden /> {cp.hero.secondaryCta}
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Why partner" accent="with us" />
          <div className="mt-12">
            <IconCards items={cp.benefits} />
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-brand-700 py-24 md:py-32">
        <Wave position="top" className="text-white" />
        <div className="container-x">
          <SectionHeading tone="dark" title="How it" accent="works" />
          <div className="mt-16">
            <NumberedProcess steps={cp.process} tone="dark" />
          </div>
        </div>
        <Wave position="bottom" className="text-white" />
      </section>

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Projects open to" accent="partners" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} p={p} delay={(i % 3) * 100} enquire={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y grain bg-cream">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" title="Partner" accent="policies" />
            <Accordion items={cp.policies} className="mt-8" />
          </div>
          <div>
            <SectionHeading align="left" title="Frequently" accent="asked" />
            <Accordion items={cp.faqs} className="mt-8" />
          </div>
        </div>
      </section>

      <section id="register" className="section-y bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div data-reveal="left">
            <p className="font-script text-4xl text-gold-600">Join us</p>
            <h2 className="text-4xl">Register as a partner</h2>
            <p className="mt-3 text-muted">Our CP desk verifies registrations within 3–5 working days.</p>
            <div className="mt-8 grid gap-3">
              <a href={`tel:${site.cpDesk.phoneHref}`} className="flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-gold-500">
                <span className="grid size-12 place-items-center rounded-full bg-brand-700 text-gold-400"><Phone className="size-5" aria-hidden /></span>
                <span><span className="block text-xs text-muted">CP desk</span><span className="font-display text-xl text-brand-700">{site.cpDesk.phone}</span></span>
              </a>
              <a href={`mailto:${site.cpDesk.email}`} className="flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-gold-500">
                <span className="grid size-12 place-items-center rounded-full bg-brand-700 text-gold-400"><Mail className="size-5" aria-hidden /></span>
                <span><span className="block text-xs text-muted">Email</span><span className="font-display text-xl text-brand-700">{site.cpDesk.email}</span></span>
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] sm:p-10" data-reveal="right">
            <CpRegistrationForm areas={getActiveStations().map((s) => s.name)} />
          </div>
        </div>
      </section>
    </>
  );
}
