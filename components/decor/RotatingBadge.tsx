import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

/** Circular text stamp that slowly rotates around a monogram. */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  const repeated = `${text} ${text} `;
  return (
    <div className={cn("grid size-32 place-items-center rounded-full bg-white/80 shadow-xl shadow-brand-900/10 backdrop-blur", className)} aria-hidden>
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circle-path" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text className="fill-brand-700 text-[9.5px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#circle-path" textLength="276">
            {repeated}
          </textPath>
        </text>
      </svg>
      <LogoMark className="w-12" />
    </div>
  );
}
