"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

/** Click-to-load Google Map, so the iframe never competes with LCP. */
export function LazyMap({ src, label }: { src: string; label: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-sand" data-reveal="left">
      {loaded ? (
        <iframe title={`Map of ${label}`} src={src} className="absolute inset-0 size-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button type="button" onClick={() => setLoaded(true)} className="group absolute inset-0 size-full" aria-label={`Load map for ${label}`}>
          {/* stylised map placeholder */}
          <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <rect width="400" height="300" fill="#f3ebdf" />
            <path d="M-10 210 C 80 180, 140 240, 220 200 S 360 150, 420 170" stroke="#d7e4ea" strokeWidth="26" fill="none" />
            <path d="M0 90 H400 M0 150 H400 M120 0 V300 M260 0 V300" stroke="#fff" strokeWidth="8" />
            <path d="M40 0 L 360 300" stroke="#ecd7ae" strokeWidth="12" />
            {[...Array(14)].map((_, i) => (
              <rect key={i} x={(i * 67) % 380} y={(i * 41) % 260} width="34" height="24" rx="4" fill="#e9dfd2" />
            ))}
          </svg>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <span className="absolute top-full left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand-700/40" />
            <MapPin className="size-12 fill-brand-700 text-white drop-shadow-lg transition group-hover:-translate-y-1" strokeWidth={1.5} />
          </span>
          <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-700 shadow-lg transition group-hover:bg-brand-700 group-hover:text-white">
            <Navigation className="size-4" aria-hidden /> Load interactive map
          </span>
        </button>
      )}
    </div>
  );
}
