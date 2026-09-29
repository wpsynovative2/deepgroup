"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type T = { name: string; project: string; quote: string; rating?: number };

export function Testimonials({ items, title }: { items: T[]; title: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    // autoplay, paused for reduced motion and while hovering
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let paused = false;
    const node = embla.rootNode();
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);
    const t = setInterval(() => !paused && embla.scrollNext(), 6000);
    return () => {
      clearInterval(t);
      embla.off("select", onSelect);
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
    };
  }, [embla, onSelect]);

  const [first, ...rest] = title.split(" from ");

  return (
    <section className="section-y relative overflow-hidden bg-white" aria-roledescription="carousel" aria-label="Testimonials">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div data-reveal="left">
          <Quote className="size-14 fill-gold-100 text-gold-500" strokeWidth={1} aria-hidden />
          <h2 className="mt-4 text-[2rem] leading-[1.1] md:text-[2.75rem]">
            {first}
            {rest.length ? (
              <>
                {" "}from <span className="font-script text-[1.35em] font-normal text-gold-600">{rest.join(" from ")}</span>
              </>
            ) : null}
          </h2>
          <div className="mt-8 flex items-center gap-3">
            <button type="button" onClick={() => embla?.scrollPrev()} aria-label="Previous testimonial" className="grid size-12 place-items-center rounded-full border border-brand-700/20 text-brand-700 transition hover:bg-brand-700 hover:text-white">
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => embla?.scrollNext()} aria-label="Next testimonial" className="grid size-12 place-items-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800">
              <ArrowRight className="size-5" aria-hidden />
            </button>
            <div className="ml-4 flex gap-2" role="tablist" aria-label="Choose testimonial">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => embla?.scrollTo(i)}
                  className={cn("h-2 rounded-full transition-all duration-500", i === index ? "w-8 bg-gold-500" : "w-2 bg-line")}
                />
              ))}
            </div>
          </div>
        </div>

        <div data-reveal="right">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-5 flex">
            {items.map((t, i) => (
              <figure key={t.name} className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-1/2" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
                <div className={cn("flex h-full flex-col rounded-[1.5rem] border p-7 transition-colors duration-500", i === index ? "border-gold-500 bg-cream" : "border-line bg-white")}>
                  <div className="flex gap-0.5" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={cn("size-4", s < (t.rating ?? 5) ? "fill-gold-500 text-gold-500" : "text-line")} aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full bg-brand-700 font-display text-gold-400">
                      {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span>
                      <span className="block font-medium text-ink">{t.name}</span>
                      <span className="text-sm text-muted">{t.project}</span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
