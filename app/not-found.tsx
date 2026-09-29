import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafSprig } from "@/components/decor/Botanical";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[85vh] items-center overflow-hidden bg-cream pt-32 pb-20">
      <LeafSprig className="absolute top-24 -left-8 h-72 w-44 -rotate-12 text-gold-500/30" />
      <div className="container-x grid items-center gap-10 text-center lg:grid-cols-2 lg:text-left">
        <div>
          <p className="font-script text-5xl text-gold-600">Oops</p>
          <h1 className="mt-2 text-5xl md:text-6xl">This floor isn&apos;t built yet</h1>
          <p className="mt-4 text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="/projects" size="lg">
              View projects <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <Link href="/contact-us" className="flex min-h-13 items-center px-6 text-brand-700 hover:underline">
              Contact us
            </Link>
          </div>
        </div>
        {/* "404" as an under-construction building */}
        <svg viewBox="0 0 400 300" className="mx-auto w-full max-w-md" aria-hidden>
          <path d="M20 280h360" stroke="#c9943c" strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${60 + i * 105} 0)`}>
              <rect x="0" y={i === 1 ? 70 : 110} width="70" height={i === 1 ? 210 : 170} rx="6" fill={i === 1 ? "#650727" : "#f3d9e1"} />
              <text x="35" y={i === 1 ? 200 : 220} textAnchor="middle" fontSize="64" fontFamily="var(--font-display)" fill={i === 1 ? "#d9ad62" : "#650727"}>
                {i === 1 ? "0" : "4"}
              </text>
            </g>
          ))}
          <path d="M270 40v70M270 40h110M370 40v30" stroke="#1d1a1b" strokeWidth="3" fill="none" />
          <path d="M366 70h8v10h-8z" fill="#c9943c" className="animate-float" />
        </svg>
      </div>
    </section>
  );
}
