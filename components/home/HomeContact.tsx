import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/data/content";
import { LeadForm } from "@/components/forms/LeadForm";
import { Ornament } from "@/components/decor/Ornament";
import { LeafSprig } from "@/components/decor/Botanical";

/** "Have a project in mind?" style block from the UI reference, with an inline lead form. */
export function HomeContact({ projects }: { projects: string[] }) {
  const site = getSite();
  return (
    <section className="grain relative overflow-hidden bg-cream section-y" id="enquire">
      <LeafSprig className="absolute top-10 right-0 h-72 w-44 scale-x-[-1] text-gold-600/30" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative hidden lg:block" data-reveal="left">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden arch shadow-2xl shadow-brand-900/20">
            <Image src="/images/projects/deep-crown/cover.jpg" alt="" fill sizes="384px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent" />
            <div className="absolute right-6 bottom-6 left-6 text-white">
              <p className="font-script text-4xl text-gold-400">Let&apos;s talk</p>
              <ul className="mt-3 grid gap-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="size-4 text-gold-400" aria-hidden /> <a href={`tel:${site.phoneHref}`}>{site.phone}</a></li>
                <li className="flex items-center gap-2"><Mail className="size-4 text-gold-400" aria-hidden /> <a href={`mailto:${site.email}`}>{site.email}</a></li>
                <li className="flex items-center gap-2"><MapPin className="size-4 text-gold-400" aria-hidden /> Tulinj, Nallasopara East</li>
              </ul>
            </div>
          </div>
          <div aria-hidden className="absolute -bottom-6 left-4 size-32 text-gold-500/40 dot-grid" />
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(51,3,15,.35)] ring-1 ring-line sm:p-10" data-reveal="right">
          <Ornament className="mb-4 text-gold-500" />
          <h2 className="text-[2rem] leading-[1.1] md:text-[2.5rem]">
            Have a home in <span className="font-script text-[1.35em] font-normal text-gold-600">mind?</span>
          </h2>
          <p className="mt-2 mb-8 text-muted">Tell us what you&apos;re looking for. We&apos;ll call you within one working day.</p>
          <LeadForm projects={projects} source="/#enquire" intent="enquiry" submitLabel="Send enquiry" />
        </div>
      </div>
    </section>
  );
}
