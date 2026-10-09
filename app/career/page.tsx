import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCards } from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Wave } from "@/components/decor/Wave";
import { JobList } from "@/components/career/JobList";
import { ApplicationForm } from "@/components/career/ApplicationForm";
import { getPage, getPageSeo } from "@/lib/data/content";
import { getAllJobs, getOpenJobs } from "@/lib/data/jobs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...getPageSeo("/career"), path: "/career" });

export default function CareerPage() {
  const c = getPage("career");
  const jobs = getOpenJobs();
  const departments = [...new Set(getAllJobs().map((j) => j.department))];

  return (
    <>
      <PageHero
        title={c.hero.title}
        accent={c.hero.titleAccent}
        subtitle={c.hero.subtitle}
        crumbs={[{ name: "Career", href: "/career" }]}
        image={{ src: "/images/projects/deep-landmark/cover.jpg", alt: "" }}
      >
        <ButtonLink href="#openings" size="lg">
          See {jobs.length} open {jobs.length === 1 ? "role" : "roles"} <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </PageHero>

      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Life at" accent="Deep Group" />
          <div className="mt-12">
            <IconCards items={c.culture} />
          </div>
        </div>
      </section>

      <section className="grain relative bg-sand py-24">
        <Wave position="top" className="text-white" />
        <div className="container-x">
          <SectionHeading title="Perks &" accent="benefits" />
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {c.perks.map((p, i) => (
              <li key={p.label} className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center transition hover:-translate-y-1" data-reveal style={{ "--d": i * 70 } as React.CSSProperties}>
                <span className="grid size-16 place-items-center rounded-full bg-gold-100 text-brand-700 transition group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-gold-400">
                  <Icon name={p.icon} className="size-7" />
                </span>
                <span className="text-sm font-medium text-ink">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Wave position="bottom" variant={2} className="text-white" />
      </section>

      <section id="openings" className="section-y bg-white">
        <div className="container-x max-w-4xl">
          <SectionHeading title="Open" accent="positions" />
          <div className="mt-10">
            <JobList jobs={jobs} departments={departments} />
          </div>
        </div>
      </section>

      <section id="apply" className="section-y grain bg-cream">
        <div className="container-x max-w-3xl">
          <SectionHeading title="Apply" accent="now" subtitle={c.applyNote} />
          <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] sm:p-10" data-reveal>
            <ApplicationForm positions={jobs.map((j) => j.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
