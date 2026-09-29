import { PageHero } from "./PageHero";

type Section = { title: string; points: string[] };

/** Legal pages: short, scannable point lists instead of long paragraphs. Text must be reviewed by counsel. */
export function LegalPage({ title, accent, updated, path, sections }: { title: string; accent?: string; updated: string; path: string; sections: Section[] }) {
  return (
    <>
      <PageHero title={title} accent={accent} subtitle={`Last updated ${updated}`} crumbs={[{ name: title + (accent ? ` ${accent}` : ""), href: path }]} />
      <section className="section-y bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ol className="sticky top-28 grid gap-1 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted hover:border-gold-500 hover:text-brand-700">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="grid max-w-3xl gap-10">
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i}`} data-reveal>
                <h2 className="flex items-center gap-3 text-2xl md:text-3xl">
                  <span className="grid size-10 place-items-center rounded-full bg-gold-100 font-display text-base text-brand-700">{i + 1}</span>
                  {s.title}
                </h2>
                <ul className="mt-4 grid gap-2.5 pl-[52px]">
                  {s.points.map((p) => (
                    <li key={p} className="relative text-muted before:absolute before:top-2.5 before:-left-5 before:size-1.5 before:rotate-45 before:bg-gold-500">
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
