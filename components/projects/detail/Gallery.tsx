"use client";

import Image from "next/image";
import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";

type Img = { src: string; alt: string; kind?: string };

export function Gallery({ images }: { images: Img[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: images.length > 2 });
  const [open, setOpen] = useState(-1);

  return (
    <div className="relative" data-reveal>
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="-ml-4 flex">
          {images.map((img, i) => (
            <div key={img.src + i} className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 md:basis-[62%]">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl"
                aria-label={`Open image: ${img.alt}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 60vw, 85vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full bg-white/90 text-brand-700 opacity-0 transition group-hover:opacity-100">
                  <Expand className="size-4" aria-hidden />
                </span>
                {img.kind ? (
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs text-brand-700 capitalize backdrop-blur">{img.kind}</span>
                ) : null}
              </button>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => embla?.scrollPrev()} aria-label="Previous image" className="grid size-11 place-items-center rounded-full border border-line text-brand-700 hover:bg-brand-700 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => embla?.scrollNext()} aria-label="Next image" className="grid size-11 place-items-center rounded-full bg-brand-700 text-white hover:bg-brand-800">
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
      <Lightbox open={open >= 0} index={Math.max(open, 0)} close={() => setOpen(-1)} slides={images.map((i) => ({ src: i.src, alt: i.alt }))} />
    </div>
  );
}
