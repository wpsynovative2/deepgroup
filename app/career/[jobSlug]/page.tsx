import { notFound } from "next/navigation";
import { Briefcase, CalendarDays, CheckCircle2, Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ApplicationForm } from "@/components/career/ApplicationForm";
import { DetailHeading } from "@/components/projects/detail/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getJobBySlug, getOpenJobs } from "@/lib/data/jobs";
import { getSite } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { graph, jobLd } from "@/lib/seo/jsonld";

// Closed jobs are not generated, so their URLs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getOpenJobs().map((j) => ({ jobSlug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/career/[jobSlug]">) {
  const { jobSlug } = await params;
  const j = getJobBySlug(jobSlug);
  if (!j) return {};
  return buildMetadata({ title: `${j.title}, ${j.location}`, description: `${j.description} ${j.experience} experience.`, path: `/career/${j.slug}` });
}

export default async function JobPage({ params }: PageProps<"/career/[jobSlug]">) {
  const { jobSlug } = await params;
  const j = getJobBySlug(jobSlug);
  if (!j) notFound();

  const meta = [
    { icon: MapPin, label: j.location },
    { icon: Briefcase, label: j.experience },
    { icon: Clock, label: j.type === "FULL_TIME" ? "Full time" : j.type },
    { icon: CalendarDays, label: `Apply by ${new Date(j.validThrough).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` },
  ];

  return (
    <>
      <JsonLd data={graph(jobLd(j, getSite()))} />
      <PageHero
        title={j.title}
        subtitle={j.description}
        crumbs={[
          { name: "Career", href: "/career" },
          { name: j.title, href: `/career/${j.slug}` },
        ]}
        image={{ src: "/images/redevelopment/tower.jpg", alt: "" }}
      >
        <ul className="flex flex-wrap gap-2">
          {meta.map(({ icon: I, label }) => (
            <li key={label} className="flex items-center gap-2 rounded-full border border-gold-500/30 bg-white/70 px-4 py-2 text-sm">
              <I className="size-4 text-gold-500" aria-hidden /> {label}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section-y bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-12">
            {[
              { title: "What you'll do", items: j.responsibilities },
              { title: "What you'll bring", items: j.requirements },
            ].map((b) => (
              <div key={b.title}>
                <DetailHeading title={b.title} />
                <ul className="grid gap-3">
                  {b.items.map((it, i) => (
                    <li key={it} className="flex gap-3 rounded-2xl bg-cream p-4" data-reveal style={{ "--d": i * 70 } as React.CSSProperties}>
                      <CheckCircle2 className="size-5 shrink-0 text-gold-500" aria-hidden /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div id="apply" className="h-fit rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] sm:p-10 lg:sticky lg:top-28">
            <p className="font-script text-3xl text-gold-600">Interested?</p>
            <h2 className="mb-8 text-3xl">Apply for this role</h2>
            <ApplicationForm positions={getOpenJobs().map((x) => x.title)} defaultPosition={j.title} />
          </div>
        </div>
      </section>
    </>
  );
}
