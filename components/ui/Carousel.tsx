"use client";

import { Children, useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  label: string;
  /** Width of each slide, e.g. "basis-full sm:basis-1/2 lg:basis-1/3". */
  slideClassName?: string;
  tone?: "light" | "dark";
  autoplay?: number | false;
  className?: string;
};

/** One-card-at-a-time carousel with arrows, dots and pause-on-hover autoplay. */
export function Carousel({ children, label, slideClassName = "basis-full sm:basis-1/2 lg:basis-1/3", tone = "light", autoplay = 6000, className }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [index, setIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const slides = Children.toArray(children);
  const dark = tone === "dark";

  const sync = useCallback(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    setIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const raf = requestAnimationFrame(sync);
    embla.on("select", sync).on("reInit", sync);
    let t: ReturnType<typeof setInterval> | undefined;
    let paused = false;
    const node = embla.rootNode();
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    if (autoplay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      node.addEventListener("focusin", pause);
      node.addEventListener("focusout", resume);
      t = setInterval(() => !paused && embla.scrollNext(), autoplay);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
      embla.off("select", sync).off("reInit", sync);
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      node.removeEventListener("focusin", pause);
      node.removeEventListener("focusout", resume);
    };
  }, [embla, sync, autoplay]);

  return (
    <div className={className} aria-roledescription="carousel" aria-label={label} data-carousel>
      <div className="-my-4 overflow-hidden py-4" ref={emblaRef}>
        <div className="-ml-5 flex">
          {slides.map((child, i) => (
            <div key={i} className={cn("min-w-0 shrink-0 grow-0 pl-5", slideClassName)} aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {snaps.length > 1 ? (
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={`Choose ${label.toLowerCase()} page`}>
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Page ${i + 1}`}
                onClick={() => embla?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === index ? (dark ? "w-8 bg-gold-400" : "w-8 bg-gold-500") : dark ? "w-2 bg-white/25" : "w-2 bg-line",
                )}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label="Previous"
              className={cn(
                "grid size-12 place-items-center rounded-full border transition",
                dark ? "border-white/20 text-white hover:border-gold-400 hover:bg-gold-500 hover:text-brand-900" : "border-brand-700/20 text-brand-700 hover:bg-brand-700 hover:text-white",
              )}
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label="Next"
              className={cn(
                "grid size-12 place-items-center rounded-full transition",
                dark ? "bg-gold-500 text-brand-900 hover:bg-gold-400" : "bg-brand-700 text-white hover:bg-brand-800",
              )}
            >
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
