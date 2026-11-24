import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

/** Circular text stamp that slowly rotates around a monogram. */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  // One pass of the phrase round the circle; textLength (the path's circumference, 2π·44)
  // only spreads the letters out, so the font must be small enough that they never overlap.
  return (
    <div className={cn("grid size-32 place-items-center rounded-full bg-white/80 shadow-xl shadow-brand-900/10 backdrop-blur", className)} aria-hidden>
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circle-path" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text className="fill-brand-700 text-[7.5px] font-semibold uppercase" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#circle-path" textLength="270" lengthAdjust="spacing">
            {`${text} `}
          </textPath>
        </text>
      </svg>
      <LogoMark className="w-12" />
    </div>
  );
}
